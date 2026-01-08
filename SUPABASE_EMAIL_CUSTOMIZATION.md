# Supabase Email Confirmation Customization Guide

This guide explains how to customize Supabase email confirmation emails, including templates, redirect URLs, and SMTP configuration.

## Table of Contents

1. [Overview](#overview)
2. [Customizing Email Templates in Supabase Dashboard](#customizing-email-templates-in-supabase-dashboard)
3. [Custom Redirect URLs](#custom-redirect-urls)
4. [Custom SMTP Configuration](#custom-smtp-configuration)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Integration](#frontend-integration)
7. [Environment Variables](#environment-variables)
8. [Testing](#testing)

## Overview

Supabase sends email confirmation emails when users sign up. By default, these emails use Supabase's templates and redirect to Supabase's hosted confirmation page. This guide shows you how to:

- Customize email templates (subject, body, styling)
- Set custom redirect URLs after email confirmation
- Use your own SMTP server for sending emails
- Handle email confirmation in your backend/frontend

## Customizing Email Templates in Supabase Dashboard

### Step 1: Access Email Templates

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Email Templates**
4. You'll see templates for:
   - **Confirm signup** - Email sent when user signs up
   - **Magic Link** - Email for passwordless login
   - **Change Email Address** - Email when user changes email
   - **Reset Password** - Email for password reset
   - **Invite user** - Email for inviting users

### Step 2: Customize the Confirmation Email Template

1. Click on **Confirm signup** template
2. You can customize:
   - **Subject**: Email subject line
   - **Body**: HTML email body

### Step 3: Available Template Variables

Use these variables in your email templates:

- `{{ .ConfirmationURL }}` - The confirmation link URL
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Confirmation token (if needed)
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL
- `{{ .RedirectTo }}` - Custom redirect URL

### Example Custom Email Template

**Subject:**
```
Welcome! Please confirm your email address
```

**Body (HTML):**
```html
<h2>Welcome to {{ .SiteURL }}!</h2>
<p>Hi there,</p>
<p>Thank you for signing up! Please click the button below to confirm your email address:</p>
<p>
  <a href="{{ .ConfirmationURL }}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">
    Confirm Email Address
  </a>
</p>
<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>If you didn't create an account, you can safely ignore this email.</p>
<p>Best regards,<br>Your Team</p>
```

### Step 4: Save Your Template

1. Click **Save** to apply your changes
2. Test by signing up a new user

## Custom Redirect URLs

### Backend Configuration

The backend automatically sets a custom redirect URL when users sign up. The redirect URL is constructed from:

1. `FRONTEND_URL` environment variable (if set)
2. Falls back to `APP_URL` environment variable
3. Defaults to `http://localhost:3000`

The default redirect path is: `${FRONTEND_URL}/auth/confirm-email`

### Customizing Redirect URL in Signup

You can specify a custom redirect URL when signing up:

```typescript
// In your frontend
const response = await fetch('/v1/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    name: 'John Doe',
    redirectTo: 'https://yourapp.com/auth/email-confirmed' // Custom redirect
  })
});
```

### Important: Add Redirect URL to Supabase

**You must add your redirect URLs to Supabase's allowed list:**

1. Go to **Authentication** > **URL Configuration**
2. Under **Redirect URLs**, add your allowed URLs:
   - `http://localhost:3000/auth/confirm-email` (development)
   - `https://yourapp.com/auth/confirm-email` (production)
   - Any other custom redirect URLs you use
3. Click **Save**

**Note:** Supabase only redirects to URLs in this allowed list for security reasons.

## Custom SMTP Configuration

If you want to send emails through your own SMTP server instead of Supabase's:

### Step 1: Configure SMTP in Supabase

1. Go to **Project Settings** > **Auth** > **SMTP Settings**
2. Enable **Custom SMTP**
3. Fill in your SMTP details:
   - **Host**: Your SMTP server (e.g., `smtp.gmail.com`)
   - **Port**: SMTP port (usually `587` for TLS or `465` for SSL)
   - **Username**: Your SMTP username/email
   - **Password**: Your SMTP password or app-specific password
   - **Sender email**: Email address to send from
   - **Sender name**: Display name for emails
4. Test the connection
5. Click **Save**

### Step 2: Update Email Templates

After configuring SMTP, your custom email templates will be sent through your SMTP server, allowing you to:
- Use your own domain for sending emails
- Better email deliverability
- More control over email content

## Backend Implementation

### Email Confirmation Endpoint

The backend provides an endpoint to handle email confirmation:

**GET `/v1/auth/confirm-email?token=<token>&type=<type>`**

- `token`: Confirmation token from email link
- `type`: Type of confirmation (default: `signup`)

**Response:**
```json
{
  "message": "Email confirmed successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "email_confirmed_at": "2024-01-01T00:00:00Z"
  },
  "access_token": "jwt-token",
  "refresh_token": "refresh-token"
}
```

### Resend Confirmation Email

**POST `/v1/auth/resend-confirmation`**

**Request Body:**
```json
{
  "email": "user@example.com",
  "redirectTo": "https://yourapp.com/auth/confirm-email" // Optional
}
```

**Response:**
```json
{
  "message": "Confirmation email sent successfully"
}
```

## Frontend Integration

### Handling Email Confirmation

When a user clicks the confirmation link in their email, they'll be redirected to your specified URL. Handle it like this:

```typescript
// React example
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function EmailConfirmation() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type') || 'signup';

    if (!token) {
      setStatus('error');
      setMessage('Invalid confirmation link');
      return;
    }

    // Call your backend confirmation endpoint
    fetch(`/v1/auth/confirm-email?token=${token}&type=${type}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus('success');
          setMessage('Email confirmed successfully!');
          
          // Store tokens if provided
          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          
          // Redirect to dashboard or login
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Confirmation failed');
        }
      })
      .catch((error) => {
        setStatus('error');
        setMessage('An error occurred during confirmation');
        console.error(error);
      });
  }, [searchParams]);

  return (
    <div>
      {status === 'loading' && <p>Confirming your email...</p>}
      {status === 'success' && <p>{message}</p>}
      {status === 'error' && <p>{message}</p>}
    </div>
  );
}
```

### Signup with Custom Redirect

```typescript
async function signUp(email: string, password: string, name: string) {
  const frontendUrl = window.location.origin;
  const redirectTo = `${frontendUrl}/auth/confirm-email`;

  const response = await fetch('/v1/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name,
      redirectTo, // Custom redirect URL
    }),
  });

  return await response.json();
}
```

## Environment Variables

Add these to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Application URLs
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001  # Your frontend URL (if different from backend)
```

**Note:** 
- `APP_URL`: Your backend URL
- `FRONTEND_URL`: Your frontend URL (used for email redirects)
- If `FRONTEND_URL` is not set, `APP_URL` will be used

## Testing

### Test Email Confirmation Flow

1. **Sign up a new user:**
   ```bash
   curl -X POST http://localhost:3000/v1/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "testpassword123",
       "name": "Test User"
     }'
   ```

2. **Check email inbox** for confirmation email

3. **Click confirmation link** or manually test:
   ```bash
   # Extract token from email link and test
   curl "http://localhost:3000/v1/auth/confirm-email?token=YOUR_TOKEN&type=signup"
   ```

4. **Resend confirmation email:**
   ```bash
   curl -X POST http://localhost:3000/v1/auth/resend-confirmation \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com"
     }'
   ```

### Testing in Development

For local development, you can:

1. Use Supabase's built-in email testing (emails appear in Supabase dashboard under **Authentication** > **Users** > **Email Logs**)
2. Configure a development SMTP server (like MailHog or Mailtrap)
3. Use Supabase's email testing feature to see email content without actually sending

## Troubleshooting

### Email Not Received

1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase email logs: **Authentication** > **Users** > **Email Logs**
4. Verify SMTP configuration if using custom SMTP

### Redirect URL Not Working

1. Ensure redirect URL is added to Supabase's allowed list
2. Check that `FRONTEND_URL` or `APP_URL` is correctly set
3. Verify the URL format matches exactly (including protocol: `http://` or `https://`)

### Token Invalid/Expired

1. Tokens expire after a certain time (default: 1 hour)
2. Use the resend confirmation endpoint to get a new token
3. Check that the token hasn't been used already

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)

