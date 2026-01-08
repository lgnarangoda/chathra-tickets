import { Controller, Post, UseGuards, Request, Get, Body, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './supabase.guard';
import { RefreshTokenDto, LogoutDto } from './dto/refresh-token.dto';
import { LoginDto, SignUpDto, ConfirmEmailDto, ResendConfirmationDto } from './dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
      signUpDto.redirectTo,
    );
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto.refresh_token);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('google')
  async getGoogleAuthUrl(@Query('redirectTo') redirectTo?: string) {
    return this.authService.getGoogleAuthUrl(redirectTo);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).json({ message: 'Authorization code is required' });
    }

    try {
      const result = await this.authService.handleGoogleCallback(code);
      
      // Option 1: Return JSON response (for API clients)
      return res.json(result);
      
      // Option 2: Redirect to frontend with tokens (uncomment if you prefer this approach)
      // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      // return res.redirect(`${frontendUrl}/auth/callback?access_token=${result.access_token}&refresh_token=${result.refresh_token}`);
    } catch (error) {
      return res.status(401).json({ message: error.message || 'Authentication failed' });
    }
  }

  /**
   * Email confirmation endpoint
   * This endpoint handles the callback from Supabase email confirmation links
   * The token and type are passed as query parameters from the email link
   */
  @Get('confirm-email')
  async confirmEmail(
    @Query('token') token: string,
    @Query('type') type: string,
    @Res() res: Response,
  ) {
    if (!token) {
      return res.status(400).json({ message: 'Confirmation token is required' });
    }

    try {
      const result = await this.authService.confirmEmail(token, type || 'signup');
      
      // Option 1: Return JSON response (for API clients)
      return res.json(result);
      
      // Option 2: Redirect to frontend success page (uncomment if you prefer this approach)
      // const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
      // return res.redirect(`${frontendUrl}/auth/email-confirmed?success=true`);
    } catch (error) {
      return res.status(401).json({ message: error.message || 'Email confirmation failed' });
    }
  }

  /**
   * Alternative POST endpoint for email confirmation
   * Some implementations prefer POST for security reasons
   */
  @Post('confirm-email')
  async confirmEmailPost(@Body() confirmEmailDto: ConfirmEmailDto) {
    return this.authService.confirmEmail(confirmEmailDto.token, confirmEmailDto.type || 'signup');
  }

  /**
   * Resend confirmation email
   */
  @Post('resend-confirmation')
  async resendConfirmation(@Body() resendConfirmationDto: ResendConfirmationDto) {
    return this.authService.resendConfirmationEmail(
      resendConfirmationDto.email,
      resendConfirmationDto.redirectTo,
    );
  }
}
