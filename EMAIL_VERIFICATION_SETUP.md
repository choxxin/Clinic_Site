# Email Verification Setup Guide

## Overview
The login flow has been updated to include two-factor authentication via email verification:
1. User enters email and password
2. A 6-digit verification code is generated and sent to their email
3. User enters the code on the verification page
4. Upon successful verification, the actual login API is called

## EmailJS Setup Instructions

### Step 1: Create an EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month on free tier)

### Step 2: Add Email Service
1. Go to **Email Services** in the EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the prompts to connect your email account
5. Copy your **Service ID** (you'll need this)

### Step 3: Create Email Template
1. Go to **Email Templates** in the EmailJS dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: Your Clinic Portal Verification Code

Hello,

Your verification code is: {{verification_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Clinic Portal Team
```

4. Make sure to use these template variables:
   - `{{to_email}}` - Recipient email
   - `{{verification_code}}` - The 6-digit code
   - `{{user_email}}` - User's email (for reference)

5. Copy your **Template ID**

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it

### Step 5: Update Your Code
Replace the placeholder values in both files:

#### In `app/auth/login/page.js`:
```javascript
const emailResponse = await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID
  emailParams,
  'YOUR_PUBLIC_KEY'       // Replace with your Public Key
);
```

#### In `app/auth/login/verification/page.js`:
```javascript
const emailResponse = await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your Template ID
  emailParams,
  'YOUR_PUBLIC_KEY'       // Replace with your Public Key
);
```

## How It Works

### Login Page (`app/auth/login/page.js`)
- User enters email and password
- On submit:
  1. Generates random 6-digit code
  2. Sends code to user's email via EmailJS
  3. Stores credentials and code in sessionStorage
  4. Redirects to verification page

### Verification Page (`app/auth/login/verification/page.js`)
- Displays input for 6-digit code
- User enters code from email
- On verify:
  1. Checks if entered code matches stored code
  2. If match: Calls actual login API
  3. If success: Redirects to dashboard
  4. If fail: Shows error message
- Features:
  - Resend code option
  - Back to login link
  - Auto-formatting (numbers only, max 6 digits)

## Security Features
- Code stored in sessionStorage (cleared after successful login)
- Only numeric input accepted (6 digits)
- Verification required before actual API call
- Resend functionality for expired/lost codes

## Testing
1. Enter demo credentials:
   - Email: `clinic1@gmail.com`
   - Password: `clinic`
2. Check your email for the verification code
3. Enter the code on the verification page
4. You should be redirected to the dashboard

## Troubleshooting

### Email not received?
- Check spam/junk folder
- Verify EmailJS service is properly connected
- Check EmailJS dashboard for failed sends
- Ensure template variables match exactly

### "Failed to send verification code" error?
- Verify all three values (Service ID, Template ID, Public Key) are correct
- Check EmailJS account is active
- Check browser console for detailed error messages

### Code doesn't match?
- Make sure you're entering the code from the most recent email
- Code is case-sensitive (though only numbers are used)
- Try using the "Resend" button for a new code

## Environment Variables (Optional)
For better security, consider moving EmailJS credentials to environment variables:

Create `.env.local`:
```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Then update the code to use:
```javascript
process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
```

## Files Modified/Created
- ✅ `app/auth/login/page.js` - Updated to send verification code
- ✅ `app/auth/login/verification/page.js` - New verification page
- ✅ `EMAIL_VERIFICATION_SETUP.md` - This setup guide
