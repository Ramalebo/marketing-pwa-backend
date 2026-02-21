# Render Environment – Static Database (SQLite Only)

**This project uses the built-in static (SQLite) database only. We do not use FreeSQLDatabase or any external MySQL.**

Follow these steps in the Render dashboard so your backend uses SQLite and never tries to connect to MySQL.

---

## Step 1: Open your backend service

1. Go to **https://dashboard.render.com**
2. Log in
3. Click your **backend service** (e.g. `marketing-pwa-backend`)

---

## Step 2: Open the Environment tab

1. In the left sidebar, click **Environment**
2. You’ll see the list of environment variables

---

## Step 3: Set these variables (add or edit)

Add or update each of these. Names are case-sensitive; no spaces before/after values.

| Key | Value |
|-----|--------|
| `USE_SQLITE` | `true` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | *(pick a long random string, e.g. `my-super-secret-jwt-key-2024-change-this`)* |
| `FRONTEND_URL` | `https://dominantlogic.tech` |

- For each row: click **Add Environment Variable** (or **Edit** if it already exists), enter **Key** and **Value**, then save.
- **JWT_SECRET:** Replace the example with your own long, random string (at least 20 characters).

---

## Step 4: Remove all MySQL variables (required – we use static only)

**You must remove these so the app does not try to connect to MySQL.** If any are present, the app may still attempt a connection and you’ll see “Access denied” or connection errors.

Delete every one of these if they exist:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

To delete: click the variable → **Delete** (or trash icon). After this, only SQLite (static) is used.

---

## Step 5: Optional – keep these if you use them

You can leave these as they are if you already use them:

- **AI (Chatbot, Ads, Hashtags):** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (e.g. `meta-llama/llama-3.2-3b-instruct:free`)
- **Email:** `MAILTRAP_API_TOKEN`, `MAILTRAP_SENDER_EMAIL`, `MAILTRAP_SENDER_NAME`
- **SMS:** `SMS_PROVIDER_USERNAME`, `SMS_PROVIDER_PASSWORD`, `SMS_PROVIDER_SENDER`
- **Facebook / Instagram / WhatsApp posting:** Add only if you use social publishing from the Ads page: `FACEBOOK_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_BUSINESS_ACCOUNT_ID`. See [SOCIAL_MEDIA_SETUP.md](SOCIAL_MEDIA_SETUP.md). `FRONTEND_URL` (Step 3) is the base URL for ad images when posting to Facebook/Instagram.

If you don’t use a feature, you can leave its variables unset.

---

## Step 6: Save and redeploy

1. Click **Save Changes** (if Render shows it)
2. Render will **auto-redeploy** your service (often 1–3 minutes)
3. In the left sidebar, open **Logs** and wait until you see something like:
   - `Connected to SQLite database`
   - `Database models synchronized`
   - `Server running on port 10000`

---

## Quick checklist

- [ ] `USE_SQLITE` = `true`
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `JWT_SECRET` = *(your secret)*
- [ ] `FRONTEND_URL` = `https://dominantlogic.tech`
- [ ] `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` removed or unset
- [ ] Save → wait for redeploy → check Logs for “Connected to SQLite database”

---

## If something goes wrong

- **Still says “MySQL connection error” or “Access denied”:** The app is still trying MySQL. Make sure `USE_SQLITE` is exactly `true` (lowercase) and **all** `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` are **deleted** from Environment. Then Manual Deploy → Deploy latest commit.
- **“Application failed to start”:** In Logs, check the error. Often it’s a typo in a variable name or a missing `JWT_SECRET`.
