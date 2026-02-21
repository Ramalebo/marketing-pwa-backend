# Add Mailtrap API Token to Render

## Your Mailtrap API Token
```
445b61ff9d92f5cdddef
```

**⚠️ Important:** Save this token! It won't be shown again.

---

## Quick Steps to Add to Render

### Step 1: Go to Render Dashboard
1. Go to: **https://dashboard.render.com**
2. Log in to your account
3. Find and click on your backend service: **`marketing-pwa-backend`**

### Step 2: Open Environment Variables
1. Click on the **"Environment"** tab (in the left sidebar)
2. You'll see a list of existing environment variables

### Step 3: Add Mailtrap API Token
1. Click **"Add Environment Variable"** button
2. In the **Key** field, enter: `MAILTRAP_API_TOKEN`
3. In the **Value** field, paste: `445b61ff9d92f5cdddef`
4. Click **"Save Changes"**

### Step 4: Add Sender Email (Optional but Recommended)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, enter: `MAILTRAP_SENDER_EMAIL`
3. In the **Value** field, enter: `noreply@dominantlogic.tech` (or your preferred sender email)
4. Click **"Save Changes"**

### Step 5: Add Sender Name (Optional)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, enter: `MAILTRAP_SENDER_NAME`
3. In the **Value** field, enter: `Marketing Platform` (or your preferred name)
4. Click **"Save Changes"**

### Step 6: Redeploy (Important!)
1. After adding the variables, Render will automatically trigger a new deployment
2. Wait 2-3 minutes for the deployment to complete
3. Check the **"Logs"** tab to ensure deployment succeeded

---

## What Changed

✅ **Updated to use Mailtrap API** (better than SMTP!)
- Faster performance
- Better for bulk sending
- Advanced features available

✅ **Code updated:**
- `backend/routes/email.js` - Now uses Mailtrap API
- `backend/package.json` - Added `mailtrap` package
- `.env.example` - Updated with new variables

---

## Verify It's Working

After deployment, test email sending:
1. Go to your frontend: **https://dominantlogic.tech**
2. Navigate to the **Email** section
3. Try sending an email to a client
4. If it sends successfully, the API token is working! ✅

---

## Your Environment Variables Should Look Like:

```
MAILTRAP_API_TOKEN=445b61ff9d92f5cdddef
MAILTRAP_SENDER_EMAIL=noreply@dominantlogic.tech
MAILTRAP_SENDER_NAME=Marketing Platform
```

---

## Next Steps

1. ✅ Push updated code to GitHub (I'll do this for you)
2. ✅ Add Mailtrap API token to Render (you need to do this)
3. ✅ Wait for deployment
4. ✅ Test email sending

---

**That's it! Your email features should now work with the Mailtrap API.** 🎉
