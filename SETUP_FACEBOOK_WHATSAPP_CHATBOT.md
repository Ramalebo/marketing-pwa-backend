# Setup: Facebook, WhatsApp, Chatbot & More

This guide walks you through setting up **Facebook**, **WhatsApp**, the **in-app AI chatbot**, and related features. Do them in any order; the chatbot is the quickest.

---

## What You’re Setting Up

| Feature | What it does | Where you configure it |
|--------|----------------|-------------------------|
| **In-app AI Chatbot** | Chat in your dashboard; uses your clients & notes as context | OpenRouter API key (no Facebook/WhatsApp needed) |
| **Facebook** | Post ads to your Facebook Page from the Ads page | Facebook App + Page token + Page ID |
| **Instagram** | Post ads to your Instagram Business account | Same Facebook App; Instagram Business Account ID |
| **WhatsApp** | Send ad messages to a phone number from the Ads page | WhatsApp Business API (Meta or Twilio) |

**Note:** The app does **not** include automated “chatbots” on Facebook Messenger or WhatsApp (e.g. auto-reply to DMs). Those would need separate webhooks and Meta app setup.

---

## 1. In-App AI Chatbot (Fastest)

The chatbot in your app uses **OpenRouter** (no Facebook or WhatsApp credentials).

### Steps

1. **Get an API key**
   - Go to [OpenRouter](https://openrouter.ai) → sign up → **Dashboard → API Keys** → **Generate API Key**.
   - Copy the key (starts with `sk-or-v1-...`).

2. **Add to Render**
   - Render Dashboard → your backend service → **Environment**.
   - Add:
     - **Key:** `OPENROUTER_API_KEY`  
     - **Value:** your key  
   - Optional: **Key:** `OPENROUTER_MODEL`  
     **Value:** `meta-llama/llama-3.2-3b-instruct:free`  
   - Save; Render will redeploy.

3. **Test**
   - Open your app → **Chatbot** tab → send a message. You should get an AI reply.

**More detail:** [ADD_OPENROUTER_KEY_TO_RENDER.md](ADD_OPENROUTER_KEY_TO_RENDER.md) and [RENDER_SQLITE_ENV_STEPS.md](RENDER_SQLITE_ENV_STEPS.md).

---

## 2. Facebook (Post to Your Page)

So you can **publish ads to your Facebook Page** from the Ads page.

### Steps

1. **Create a Facebook App**
   - Go to [Facebook Developers](https://developers.facebook.com/) → **My Apps** → **Create App**.
   - Choose **Business** → fill name and create.

2. **Add products** (in the app dashboard)
   - **Facebook Login** (if needed for token).
   - **Instagram Basic Display** (only if you want Instagram later).

3. **Get Page Access Token**
   - Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/).
   - Select your app → **Generate Access Token**.
   - Add permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish` (if using Instagram).
   - Generate token, then exchange it for a **long-lived token** (60 days) using Meta’s token debugger or their docs.
   - Copy the long-lived token.

4. **Get Facebook Page ID**
   - Open your **Facebook Page** → **About** → **Page Info**.
   - Find **Page ID** and copy it.

5. **Add to Render**
   - In Render → your backend → **Environment**, add:
     - `FACEBOOK_ACCESS_TOKEN` = your long-lived token  
     - `FACEBOOK_PAGE_ID` = your Page ID  
   - Ensure `FRONTEND_URL` is set to your live site (e.g. `https://dominantlogic.tech`) so image URLs work for Facebook.
   - Save and wait for redeploy.

6. **Test**
   - In the app: create an ad → **Publish** → choose **Facebook** → Publish. Check your Facebook Page.

**More detail:** [SOCIAL_MEDIA_SETUP.md](SOCIAL_MEDIA_SETUP.md) (Facebook & Instagram section).

---

## 3. Instagram (Post to Your Business Account)

So you can **publish ads to Instagram** from the Ads page.

### Steps

1. **Requirements**
   - Instagram **Business** or **Creator** account (not personal).
   - Account linked to the **same Facebook Page** you use above.

2. **Get Instagram Business Account ID**
   - In your Facebook App: use **Instagram Basic Display** or **Instagram Graph API** and connect your Instagram account.
   - Or call:  
     `GET https://graph.facebook.com/v18.0/{page-id}?fields=instagram_business_account&access_token={token}`  
     and read `instagram_business_account.id`.

3. **Add to Render**
   - `INSTAGRAM_BUSINESS_ACCOUNT_ID` = that ID.  
   - Same `FACEBOOK_ACCESS_TOKEN` and `FRONTEND_URL` as for Facebook.

4. **Test**
   - Create an ad with an image → **Publish** → **Instagram**. Check Instagram.

**More detail:** [SOCIAL_MEDIA_SETUP.md](SOCIAL_MEDIA_SETUP.md).

---

## 4. WhatsApp (Send Ad Messages to a Number)

So you can **send an ad as a WhatsApp message** to a phone number from the Ads page.

### Option A: Meta WhatsApp Business API

1. **Meta Business Suite**
   - Go to [Meta Business Suite](https://business.facebook.com/) → **WhatsApp** → **API Setup**.
   - Complete setup and get:
     - **Phone Number ID**
     - **Access Token**
     - **Business Account ID** (optional for some flows)

2. **Add to Render**
   - `WHATSAPP_PHONE_NUMBER_ID`  
   - `WHATSAPP_ACCESS_TOKEN`  
   - `WHATSAPP_BUSINESS_ACCOUNT_ID` (if you have it)

3. **Test**
   - In app: create an ad → **Publish** → **WhatsApp** → enter phone with country code (e.g. +27…) → Publish. Check WhatsApp.

### Option B: Twilio WhatsApp

- Use Twilio’s WhatsApp API and configure in Twilio Console; your backend would need to be updated to use Twilio’s endpoints instead of Meta’s (see [SOCIAL_MEDIA_SETUP.md](SOCIAL_MEDIA_SETUP.md)).

---

## Where to Put Variables

- **Local:** `backend/.env`
- **Production (Render):** Render Dashboard → your backend service → **Environment** tab.

Do **not** commit `.env` to Git. For Render, add each variable in the dashboard (see [RENDER_SQLITE_ENV_STEPS.md](RENDER_SQLITE_ENV_STEPS.md)).

---

## Quick Reference: Environment Variables

| Variable | Used for |
|----------|----------|
| `OPENROUTER_API_KEY` | In-app chatbot (required for chatbot) |
| `OPENROUTER_MODEL` | In-app chatbot (optional; default free model) |
| `FACEBOOK_ACCESS_TOKEN` | Facebook + Instagram posting |
| `FACEBOOK_PAGE_ID` | Facebook Page posts |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram posts |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp send |
| `WHATSAPP_ACCESS_TOKEN` | WhatsApp send |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | WhatsApp (optional) |
| `FRONTEND_URL` | Your site URL (e.g. `https://dominantlogic.tech`); needed for Facebook/Instagram image URLs |

---

## Suggested Order

1. **Chatbot** – one key on Render, no Meta account.
2. **Facebook** – App + Page token + Page ID.
3. **Instagram** – Link Business account to Page, add `INSTAGRAM_BUSINESS_ACCOUNT_ID`.
4. **WhatsApp** – Meta Business Suite API setup, then the three WhatsApp variables.

After each step, add the variables to Render, let it redeploy, then test in the app.

---

## Troubleshooting

- **Chatbot not replying:** Check Render logs; ensure `OPENROUTER_API_KEY` is set and deployment finished. See [OPENROUTER_SPENDING_LIMIT_FIX.md](OPENROUTER_SPENDING_LIMIT_FIX.md) if you see payment/spend errors.
- **“Facebook credentials not configured”:** Set `FACEBOOK_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` on Render.
- **“WhatsApp credentials not configured”:** Set `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN`.
- **Images not posting to Facebook/Instagram:** Ensure `FRONTEND_URL` is your live URL and ad images are publicly accessible (not localhost).

For more detail on social APIs: [SOCIAL_MEDIA_SETUP.md](SOCIAL_MEDIA_SETUP.md).
