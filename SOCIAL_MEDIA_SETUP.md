# Social Media Integration Setup Guide

**Quick start:** For one place that covers Facebook, WhatsApp, and the in-app chatbot, see **[SETUP_FACEBOOK_WHATSAPP_CHATBOT.md](SETUP_FACEBOOK_WHATSAPP_CHATBOT.md)**.

This guide gives detailed steps for automatic posting to Facebook, Instagram, and WhatsApp, and clarifies how the in-app AI chatbot fits in.

## Overview

The platform supports posting ads to multiple social media platforms simultaneously:
- **Facebook** - Post to your Facebook Page
- **Instagram** - Post to your Instagram Business Account
- **WhatsApp** - Send messages via WhatsApp Business API

## Chatbot: In-app vs Facebook/WhatsApp

| Term | In this app | Setup |
|------|-------------|--------|
| **In-app AI chatbot** | Chat in your dashboard (Clients, notes as context) | Add `OPENROUTER_API_KEY` in backend `.env`. See [RENDER_SQLITE_ENV_STEPS.md](RENDER_SQLITE_ENV_STEPS.md) or [ADD_OPENROUTER_KEY_TO_RENDER.md](ADD_OPENROUTER_KEY_TO_RENDER.md) for production. |
| **Facebook/WhatsApp "chatbot"** | Automated replies on Messenger/WhatsApp | Not implemented. Would require webhooks, Meta App config, and new backend routes (separate scope). |

This guide covers **posting to Facebook/Instagram/WhatsApp** and assumes the in-app chatbot uses OpenRouter (no Facebook/Instagram/WhatsApp credentials needed for the chatbot).

## Meta App Basic Settings (Privacy & Data Deletion)

To make your app eligible for submission, fill these in **App settings > Basic** using your backend base URL (e.g. `https://your-backend.onrender.com` or your API domain):

| Field | URL to use |
|-------|------------|
| **Privacy policy URL** | `https://YOUR_BACKEND_URL/api/meta/privacy` |
| **User data deletion** (instructions) | `https://YOUR_BACKEND_URL/api/meta/data-deletion` |
| **Data deletion callback URL** (optional) | `https://YOUR_BACKEND_URL/api/meta/data-deletion-callback` |

The backend serves the privacy and data-deletion pages and, if you set the callback URL, accepts Meta's data-deletion callback. Contact email on those pages uses `META_CONTACT_EMAIL` or `CONTACT_EMAIL` from `.env` if set.

## Facebook & Instagram Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details and create the app

### Step 2: Add Products

1. In your app dashboard, add these products:
   - **Facebook Login** (for authentication)
   - **Instagram Basic Display** (for Instagram posting)
   - **WhatsApp Business API** (if using WhatsApp)

### Step 3: Get Facebook Page Access Token

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Generate Access Token"
4. Select permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
   - `business_management`
5. Generate a **Long-Lived Token** (valid for 60 days)
6. Copy the token to `.env` as `FACEBOOK_ACCESS_TOKEN`

### Step 4: Get Facebook Page ID

1. Go to your Facebook Page
2. Click "About" → "Page Info"
3. Scroll down to find "Page ID"
4. Copy to `.env` as `FACEBOOK_PAGE_ID`

### Step 5: Get Instagram Business Account ID

1. In your Facebook App, go to "Instagram Basic Display"
2. Connect your Instagram Business Account
3. Get your Instagram Account ID from the API
4. Copy to `.env` as `INSTAGRAM_BUSINESS_ACCOUNT_ID`

**Alternative method:**
```bash
# Use Graph API to get Instagram Account ID
GET https://graph.facebook.com/v18.0/{page-id}?fields=instagram_business_account&access_token={token}
```

## WhatsApp Business API Setup

### Option 1: Meta Business (Recommended)

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Navigate to WhatsApp → API Setup
3. Follow the setup wizard
4. Get your credentials:
   - Phone Number ID
   - Access Token
   - Business Account ID
5. Add to `.env`:
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_BUSINESS_ACCOUNT_ID`

### Option 2: Twilio WhatsApp (Alternative)

If you're using Twilio, you can use their WhatsApp API instead:
- Use Twilio's WhatsApp API endpoints
- Configure in Twilio Console

## Environment Variables

Add these to your `backend/.env` file. Template: [backend/.env.example](backend/.env.example).

| Variable | Used for |
|----------|----------|
| `FACEBOOK_ACCESS_TOKEN` | Facebook + Instagram posting |
| `FACEBOOK_PAGE_ID` | Facebook Page posts |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram posts |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp send |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp send |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp (optional in some flows) |
| `FRONTEND_URL` | Public base URL for ad images (required for Facebook/Instagram) |
| `OPENROUTER_API_KEY` | In-app AI chatbot only (no social credentials needed) |

```env
# Facebook/Instagram
FACEBOOK_ACCESS_TOKEN=your-long-lived-page-access-token
FACEBOOK_PAGE_ID=your-facebook-page-id
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-account-id

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=your-business-account-id

# Public URL for ad images (Facebook/Instagram require public URLs)
FRONTEND_URL=https://yourdomain.com
```

## Testing

### Test Facebook Posting

1. Create an ad in the platform
2. Click "Publish" on the ad
3. Select "Facebook"
4. Click "Publish Now"
5. Check your Facebook Page for the post

### Test Instagram Posting

1. Create an ad with an image
2. Click "Publish" on the ad
3. Select "Instagram"
4. Click "Publish Now"
5. Check your Instagram account for the post

### Test WhatsApp

1. Create an ad
2. Click "Publish" on the ad
3. Select "WhatsApp"
4. Enter a phone number (with country code, e.g., +1234567890)
5. Click "Publish Now"
6. Check the WhatsApp number for the message

## Important Notes

### Facebook/Instagram Requirements

- **Page Access Token**: Must have `pages_manage_posts` permission
- **Instagram**: Requires Instagram Business Account (not personal)
- **Image URLs**: Must be publicly accessible (not localhost)
- **Rate Limits**: Facebook has rate limits (typically 200 posts/hour)

### WhatsApp Requirements

- **Phone Number**: Must include country code (e.g., +1234567890)
- **Business Account**: Requires verified WhatsApp Business Account
- **Message Templates**: For initial messages, you may need approved templates
- **24-Hour Window**: After user replies, you can send free-form messages

### Image Requirements

- **Facebook**: Supports JPG, PNG, GIF
- **Instagram**: Requires square images (1:1 ratio), min 600x600px
- **WhatsApp**: Supports images up to 5MB

## Troubleshooting

### "Facebook credentials not configured"
- Check that `FACEBOOK_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` are set in `.env`
- Restart the backend server after adding credentials

### "Instagram credentials not configured"
- Ensure `INSTAGRAM_BUSINESS_ACCOUNT_ID` is set
- Verify your Instagram account is a Business Account
- Check that it's connected to your Facebook Page

### "WhatsApp credentials not configured"
- Verify `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN` are set
- Ensure your WhatsApp Business Account is verified

### "Error posting to Facebook"
- Check token expiration (tokens expire after 60 days)
- Verify page permissions
- Ensure image URLs are publicly accessible

### "Error posting to Instagram"
- Instagram requires images (not just text)
- Verify image URL is accessible
- Check Instagram Business Account connection

### Images not posting
- Ensure image URLs are publicly accessible
- For local development, use a service like ngrok to expose your server
- Or upload images to a CDN/cloud storage first

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use environment-specific tokens** (dev, staging, production)
3. **Rotate tokens regularly** (every 60 days for Facebook)
4. **Use least privilege** - only grant necessary permissions
5. **Monitor API usage** to detect unusual activity

## Rate Limits

- **Facebook**: ~200 posts/hour per page
- **Instagram**: ~25 posts/hour per account
- **WhatsApp**: Varies by tier (check Meta Business dashboard)

## Recommended setup order

1. Create the **Facebook App** and get Page token + Page ID → add to `.env`.
2. Link **Instagram Business** (or Creator) to the same Page and set `INSTAGRAM_BUSINESS_ACCOUNT_ID`.
3. Set up **WhatsApp Business API** (Meta or Twilio) and add the three WhatsApp vars to `.env`.
4. Set **`FRONTEND_URL`** to your public app URL (and ensure ad images are publicly reachable).
5. Set **`OPENROUTER_API_KEY`** for the in-app chatbot (get key at [openrouter.ai](https://openrouter.ai)).
6. Restart the backend and test: Publish from Ads (Facebook/Instagram/WhatsApp) and the Chatbot tab.

No code changes are required; setup is configuration and Meta/OpenRouter accounts only.

## Support

For API issues:
- [Facebook Graph API Docs](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)

