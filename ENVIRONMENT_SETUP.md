# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Firebase Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kaysapparel-3250f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Email Service (Resend)
```env
RESEND_API_KEY=re_your_resend_api_key_here
```

### Optional Configuration
```env
NODE_ENV=development
EMAIL_FROM_DOMAIN=kaysapparel.com
```

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (kaysapparel-3250f)
3. Go to Project Settings → General → Your apps
4. Copy the Firebase configuration values

### 2. Resend Email Setup
1. Sign up at [Resend](https://resend.com)
2. Create a new API key
3. Add your API key to `RESEND_API_KEY`
4. Verify your domain (optional but recommended)

### 3. Local Development
- Copy the variables to `.env.local` (this file is not committed to git)
- The email service will work in development mode with console logs if `RESEND_API_KEY` is not set

### 4. Production Deployment
- Set the environment variables in your hosting platform (Vercel, Netlify, etc.)
- The email service will automatically switch to production mode when `RESEND_API_KEY` is present

## Email Service Behavior

### Development Mode
- Emails are logged to console with `[DEV MODE]` prefix
- No actual emails are sent
- Simulates API delay for realistic testing

### Production Mode
- Real emails are sent via Resend API
- Error handling and logging for failed deliveries
- Professional email delivery with tracking

## Testing Email Service

You can test the email service by:
1. Creating a test order through the checkout process
2. Checking the console logs in development mode
3. Verifying email delivery in production mode
