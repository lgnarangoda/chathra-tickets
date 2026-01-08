# Google OAuth Setup Guide

This guide explains how to set up Google OAuth authentication in your NestJS application using Supabase.

## Prerequisites

1. A Supabase project (https://supabase.com)
2. A Google Cloud Project with OAuth 2.0 credentials

## Quick Reference: Finding Your Redirect URI

**Your Supabase redirect URI format:**
```
https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback
```

**To find your Project ID:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Check the URL: `https://app.supabase.com/project/<PROJECT-ID>`
4. Or go to **Settings** > **API** and look at the "Project URL"

**Example:** If your Project URL is `https://xyzabc123.supabase.co`, then your redirect URI is:
```
https://xyzabc123.supabase.co/auth/v1/callback
```

## Step 1: Configure Google OAuth in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Choose **Web application** as the application type
7. Add authorized redirect URIs:
   
   **How to find your Supabase redirect URI:**
   
   a. **Find your Supabase Project ID:**
      - Go to your [Supabase Dashboard](https://app.supabase.com/)
      - Select your project
      - Go to **Settings** > **API** (or check your project URL)
      - Your Project ID is in the URL: `https://app.supabase.com/project/<PROJECT-ID>`
      - Or look for "Project URL" in Settings: `https://<PROJECT-ID>.supabase.co`
   
   b. **Construct the redirect URI:**
      - Format: `https://<YOUR-PROJECT-ID>.supabase.co/auth/v1/callback`
      - Example: If your project ID is `abcdefghijklmnop`, the redirect URI would be:
        ```
        https://chivupbqyqnowigtsnwf.supabase.co/auth/v1/callback
        https://abcdefghijklmnop.supabase.co/auth/v1/callback
        ```
   
   c. **Add it in Google Cloud Console:**
      - In the "Authorized redirect URIs" section, click **+ ADD URI**
      - Paste your Supabase redirect URI (the one from step b)
      - Click **Save**
   
   **Note:** The redirect URI is the same for both development and production when using Supabase's hosted auth service.

8. Save your **Client ID** and **Client Secret**

## Step 2: Configure Google OAuth in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and enable it
4. **Alternative method to find redirect URI:** Supabase may display the required redirect URI directly in the Google provider settings. Look for a message like "Add this URL to your Google OAuth app" or check the "Redirect URL" field.
5. Enter your Google **Client ID** and **Client Secret** from Step 1
6. Save the configuration

## Step 3: Configure Environment Variables

Add the following to your `.env` file:

```env
# Supabase Configuration (already configured)
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>

# Optional: App URL for OAuth redirects (defaults to http://localhost:3000)
APP_URL=http://localhost:3000

# Optional: Frontend URL if you want to redirect after OAuth (for Option 2 in callback)
FRONTEND_URL=http://localhost:3001
```

## Step 4: API Endpoints

### Get Google OAuth URL

**GET** `/v1/auth/google?redirectTo=<optional-callback-url>`

Returns the Google OAuth URL that users should be redirected to.

**Response:**
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

### Google OAuth Callback

**GET** `/v1/auth/google/callback?code=<authorization-code>`

Handles the OAuth callback from Google and returns the access token and user information.

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "v1.xxx...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar_url": "https://..."
  }
}
```

## Usage Examples

### Frontend Integration (React/Next.js example)

```typescript
// 1. Get the OAuth URL
const response = await fetch('http://localhost:3000/v1/auth/google');
const { url } = await response.json();

// 2. Redirect user to Google
window.location.href = url;

// 3. After Google redirects back to your callback URL,
//    the backend will handle the code exchange automatically
```

### Alternative: Direct Redirect Flow

If you want the callback to redirect to your frontend with tokens in the URL:

1. Uncomment Option 2 in `auth.controller.ts` (line 55-57)
2. Comment out Option 1 (line 52-53)
3. Set `FRONTEND_URL` in your `.env` file
4. Handle the tokens in your frontend callback route

## Testing

1. Start your NestJS server:
   ```bash
   npm run start:dev
   ```

2. Test the OAuth flow:
   ```bash
   # Get the OAuth URL
   curl http://localhost:3000/v1/auth/google
   
   # Open the returned URL in your browser
   # After authentication, you'll be redirected to the callback endpoint
   ```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the redirect URI in Google Cloud Console matches exactly: `https://<project-id>.supabase.co/auth/v1/callback`

2. **"Provider not enabled"**
   - Make sure Google OAuth is enabled in your Supabase dashboard

3. **"Invalid client credentials"**
   - Verify your Google Client ID and Secret are correctly entered in Supabase

4. **Callback returns 400/401**
   - Check that the authorization code is being passed correctly
   - Ensure your Supabase project is properly configured

## Additional Providers

To add other OAuth providers (GitHub, Facebook, etc.), follow the same pattern:

1. Configure the provider in Supabase dashboard
2. Add a similar method in `AuthService` (e.g., `getGithubAuthUrl()`)
3. Add corresponding endpoints in `AuthController`

