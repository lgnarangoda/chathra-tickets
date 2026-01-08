import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async login(email: string, password: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Sync user details to local PostgreSQL database if not already present
    try {
      await this.userService.createOrUpdateFromSupabase(
        data.user.id,
        data.user.email || email,
        data.user.user_metadata?.name,
        data.user.phone,
      );
    } catch (dbError) {
      // Log error but don't fail the login if Supabase succeeded
      console.error('Failed to sync user to local database:', dbError);
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
      },
    };
  }

  async signUp(email: string, password: string, name?: string, redirectTo?: string) {
    const supabase = this.supabaseService.getClient();
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || baseUrl;
    
    // Custom email redirect URL - defaults to your frontend confirmation page
    const emailRedirectTo = redirectTo || `${frontendUrl}/auth/confirm-email`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          name: name || email,
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      throw new UnauthorizedException('User creation failed');
    }

    // Save user details to local PostgreSQL database
    try {
      await this.userService.createOrUpdateFromSupabase(
        data.user.id,
        data.user.email || email,
        name || data.user.user_metadata?.name,
        data.user.phone,
      );
    } catch (dbError) {
      // Log error but don't fail the signup if Supabase succeeded
      console.error('Failed to save user to local database:', dbError);
    }

    if (!data.session) {
      // Email confirmation might be required
      return {
        message: 'Sign up successful. Please check your email for confirmation.',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
        },
      };
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
      },
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }

  async logout(refreshToken: string) {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new UnauthorizedException('Logout failed');
    }

    return { message: 'Logged out successfully' };
  }

  async getUser(token: string) {
    const supabase = this.supabaseService.getClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
    };
  }

  async getGoogleAuthUrl(redirectTo?: string) {
    const supabase = this.supabaseService.getClient();
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const callbackUrl = redirectTo || `${baseUrl}/v1/auth/google/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new UnauthorizedException(`Failed to generate Google OAuth URL: ${error.message}`);
    }

    return {
      url: data.url,
    };
  }

  async handleGoogleCallback(code: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session || !data.user) {
      throw new UnauthorizedException('Failed to authenticate with Google');
    }

    // Save user details to local PostgreSQL database
    try {
      await this.userService.createOrUpdateFromSupabase(
        data.user.id,
        data.user.email || '',
        data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        data.user.phone,
      );
    } catch (dbError) {
      // Log error but don't fail the authentication if Supabase succeeded
      console.error('Failed to save user to local database:', dbError);
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.email,
        avatar_url: data.user.user_metadata?.avatar_url,
      },
    };
  }

  /**
   * Handle email confirmation callback from Supabase
   * This is called when user clicks the confirmation link in their email
   * Supabase redirects to the emailRedirectTo URL with a token that can be exchanged for a session
   */
  async confirmEmail(token: string, type: string = 'signup') {
    const supabase = this.supabaseService.getClient();
    
    // For email confirmation, Supabase provides a token that can be verified
    // Try verifyOtp first (for email confirmation tokens)
    let data: any;
    let error: any;

    // Method 1: Try verifyOtp (works for email confirmation tokens)
    const otpResult = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as 'email' | 'signup' | 'recovery' | 'invite',
    });

    if (!otpResult.error && otpResult.data.user) {
      data = otpResult.data;
    } else {
      // Method 2: Try exchangeCodeForSession (alternative method)
      const exchangeResult = await supabase.auth.exchangeCodeForSession(token);
      if (!exchangeResult.error && exchangeResult.data.user) {
        data = exchangeResult.data;
      } else {
        error = exchangeResult.error || otpResult.error;
      }
    }

    if (error || !data?.user) {
      throw new UnauthorizedException(error?.message || 'Invalid or expired confirmation token');
    }

    // Update user in local database if needed
    try {
      await this.userService.createOrUpdateFromSupabase(
        data.user.id,
        data.user.email || '',
        data.user.user_metadata?.name,
        data.user.phone,
      );
    } catch (dbError) {
      console.error('Failed to update user in local database:', dbError);
    }

    return {
      message: 'Email confirmed successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
      },
      // Include session if available
      ...(data.session && {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
    };
  }

  /**
   * Resend confirmation email
   */
  async resendConfirmationEmail(email: string, redirectTo?: string) {
    const supabase = this.supabaseService.getClient();
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || baseUrl;
    const emailRedirectTo = redirectTo || `${frontendUrl}/auth/confirm-email`;

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo,
      },
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      message: 'Confirmation email sent successfully',
    };
  }
}
