# Free API Setup Guide

This guide explains how to set up the free API alternatives that have been integrated into your marketing PWA.

## ✅ Changes Made

1. **SMSProvider** (replaced Twilio) - FREE with unlimited messages
2. **OpenRouter** (replaced OpenAI) - FREE models available
3. **Mailtrap** (replaced Gmail SMTP) - FREE tier: 4,000 emails/month

---

## 📱 1. SMSProvider Setup (SMS)

### Sign Up
1. Go to: https://www.smsprovider.com/signup
2. Create a free account (no credit card required)
3. You get **unlimited messages** and **unlimited contacts** for free!

### Get Your Credentials
1. Log in to your SMSProvider dashboard
2. Find your:
   - **Username**
   - **Password**
   - **Sender ID** (the name/number that appears as sender)

### Add to Environment Variables
Add these to your `.env` file on Render:

```env
SMS_PROVIDER_USERNAME=your-username
SMS_PROVIDER_PASSWORD=your-password
SMS_PROVIDER_SENDER=your-sender-id
```

### Features
- ✅ Unlimited messages
- ✅ Unlimited contacts
- ✅ No credit card required
- ✅ No time limit on free plan

---

## 🤖 2. OpenRouter Setup (AI - Chatbot, Ad Generation, Hashtags)

### Sign Up
1. Go to: https://openrouter.ai
2. Sign up with Google or email
3. Navigate to **Dashboard → API Keys**
4. Click **"Generate API Key"**
5. Copy your API key

### Free Models Available
OpenRouter offers free models with the `:free` suffix:
- `meta-llama/llama-3.2-3b-instruct:free` (default)
- `google/gemini-flash-1.5:free`
- `mistralai/mistral-7b-instruct:free`

### Add to Environment Variables
Add these to your `.env` file on Render:

```env
OPENROUTER_API_KEY=your-api-key-here
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### Features
- ✅ Free models available (with rate limits)
- ✅ Access to 300+ models from 60+ providers
- ✅ OpenAI-compatible API (easy integration)
- ✅ Better uptime with automatic fallbacks

### Note
Free models have low rate limits. For production use, consider purchasing credits for faster models.

---

## 📧 3. Mailtrap Setup (Email)

### Sign Up
1. Go to: https://mailtrap.io
2. Create a free account (no credit card required)
3. Verify your email address

### Get SMTP Credentials
1. Log in to Mailtrap dashboard
2. Go to **Sending Domains**
3. Add and verify your domain (or use their test domain)
4. Click **Integrations** tab
5. Under **Transactional Stream**, click **Integrate**
6. Toggle to **SMTP**
7. Copy your credentials:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: (from dashboard)
   - **Password**: (from dashboard)

### Add to Environment Variables
Add these to your `.env` file on Render:

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

### Free Tier Limits
- ✅ 4,000 emails/month
- ✅ 150 emails/hour
- ✅ 150 emails/day
- ✅ 10 MB max email size
- ✅ Automatic SPF, DKIM, DMARC validation

---

## 🚀 Deployment Steps

### 1. Update Render Environment Variables
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Add/update the following variables:

```env
# OpenRouter
OPENROUTER_API_KEY=your-key-here
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free

# SMSProvider
SMS_PROVIDER_USERNAME=your-username
SMS_PROVIDER_PASSWORD=your-password
SMS_PROVIDER_SENDER=your-sender-id

# Mailtrap
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
```

### 2. Install New Dependencies
The backend will automatically install `axios` when you deploy. If deploying manually:

```bash
cd backend
npm install
```

### 3. Deploy to Render
1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Replace Twilio/OpenAI/Gmail with free alternatives"
   git push origin main
   ```
2. Render will automatically deploy
3. Check logs to ensure deployment succeeded

---

## 📝 Code Changes Summary

### Files Modified:
1. `backend/routes/sms.js` - Now uses SMSProvider REST API
2. `backend/routes/chatbot.js` - Now uses OpenRouter API
3. `backend/routes/ads.js` - Now uses OpenRouter API
4. `backend/routes/hashtags.js` - Now uses OpenRouter API
5. `backend/routes/email.js` - Now uses Mailtrap SMTP
6. `backend/package.json` - Removed `twilio`, added `axios`
7. `backend/.env.example` - Updated with new variables
8. `backend/.env.production.template` - Updated with new variables

---

## ✅ Testing

After deployment, test each feature:

1. **SMS**: Try sending an SMS to a client
2. **Chatbot**: Ask a question in the chatbot
3. **Ad Generation**: Generate an AI ad
4. **Hashtags**: Generate hashtags for a post
5. **Email**: Send an email to a client

---

## 💡 Tips

1. **SMSProvider**: Make sure your sender ID is approved before sending
2. **OpenRouter**: Free models may be slower - be patient with responses
3. **Mailtrap**: For production, verify your domain for better deliverability
4. **Rate Limits**: All free tiers have limits - monitor your usage

---

## 🆘 Troubleshooting

### SMS Not Sending
- Check SMSProvider credentials are correct
- Verify sender ID is approved
- Check phone number format (remove +, spaces)

### AI Not Responding
- Verify OpenRouter API key is correct
- Check if free model is available (may have downtime)
- Try a different free model

### Email Not Sending
- Verify Mailtrap SMTP credentials
- Check if you've exceeded free tier limits
- Verify domain is verified in Mailtrap

---

## 📚 Resources

- **SMSProvider**: https://www.smsprovider.com
- **OpenRouter**: https://openrouter.ai
- **Mailtrap**: https://mailtrap.io

---

**All set! Your app now uses 100% free API alternatives.** 🎉
