# Complete Setup Guide - Add All API Keys to Render

This guide will walk you through adding all the API keys to Render so your platform works fully.

---

## 📋 What You Need

**Already Have:**
- ✅ OpenRouter API Key: `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`
- ✅ Mailtrap API Token: `445b61ff9d92f5cdddef`

**Need from Client:**
- ⏳ SMSProvider Username
- ⏳ SMSProvider Password
- ⏳ SMSProvider Sender ID

---

## 🚀 Step-by-Step: Add to Render

### Step 1: Go to Render Dashboard

1. Open your browser
2. Go to: **https://dashboard.render.com**
3. Log in to your account
4. You'll see your services listed

---

### Step 2: Open Your Backend Service

1. Find and click on: **`marketing-pwa-backend`** (or whatever you named it)
2. You'll see the service overview page

---

### Step 3: Open Environment Variables

1. In the left sidebar, click **"Environment"**
2. You'll see a list of existing environment variables
3. Scroll down to see all variables

---

## 🔑 Step 4: Add OpenRouter API Key (If Not Already Added)

### 4.1: Check if Already Added
- Look for `OPENROUTER_API_KEY` in the list
- If it exists, skip to Step 5

### 4.2: Add OpenRouter API Key
1. Click **"Add Environment Variable"** button (top right)
2. In the **Key** field, type: `OPENROUTER_API_KEY`
3. In the **Value** field, paste: `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`
4. Click **"Save Changes"**

### 4.3: Add OpenRouter Model (Optional)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, type: `OPENROUTER_MODEL`
3. In the **Value** field, type: `meta-llama/llama-3.2-3b-instruct:free`
   - **Note:** The system has automatic fallbacks, so this is optional
   - If you want a different primary model, you can change this later
4. Click **"Save Changes"**

**✅ OpenRouter Setup Complete!**

---

## 📧 Step 5: Add Mailtrap API Token

### 5.1: Add Mailtrap API Token
1. Click **"Add Environment Variable"** button
2. In the **Key** field, type: `MAILTRAP_API_TOKEN`
3. In the **Value** field, paste: `445b61ff9d92f5cdddef`
4. Click **"Save Changes"**

### 5.2: Add Sender Email (Recommended)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, type: `MAILTRAP_SENDER_EMAIL`
3. In the **Value** field, type: `noreply@dominantlogic.tech`
   - Or use your preferred sender email
4. Click **"Save Changes"**

### 5.3: Add Sender Name (Optional)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, type: `MAILTRAP_SENDER_NAME`
3. In the **Value** field, type: `Marketing Platform`
   - Or use your preferred sender name
4. Click **"Save Changes"**

**✅ Mailtrap Setup Complete!**

---

## 📱 Step 6: Add SMSProvider (When You Get Credentials)

**⚠️ Skip this step for now if you don't have SMSProvider credentials yet.**

### 6.1: Add SMSProvider Username
1. Click **"Add Environment Variable"** button
2. In the **Key** field, type: `SMS_PROVIDER_USERNAME`
3. In the **Value** field, paste: `[username from client]`
4. Click **"Save Changes"**

### 6.2: Add SMSProvider Password
1. Click **"Add Environment Variable"** again
2. In the **Key** field, type: `SMS_PROVIDER_PASSWORD`
3. In the **Value** field, paste: `[password from client]`
4. Click **"Save Changes"**

### 6.3: Add SMSProvider Sender ID
1. Click **"Add Environment Variable"** again
2. In the **Key** field, type: `SMS_PROVIDER_SENDER`
3. In the **Value** field, paste: `[sender-id from client]`
4. Click **"Save Changes"**

**✅ SMSProvider Setup Complete!**

---

## ✅ Step 7: Verify All Variables

**Your environment variables should look like this:**

```
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=google/gemini-flash-1.5:free
MAILTRAP_API_TOKEN=445b61ff9d92f5cdddef
MAILTRAP_SENDER_EMAIL=noreply@dominantlogic.tech
MAILTRAP_SENDER_NAME=Marketing Platform
SMS_PROVIDER_USERNAME=[when you get it]
SMS_PROVIDER_PASSWORD=[when you get it]
SMS_PROVIDER_SENDER=[when you get it]
```

---

## 🔄 Step 8: Wait for Auto-Deployment

1. After adding variables, Render **automatically starts a new deployment**
2. You'll see a notification or the deployment will start automatically
3. Go to the **"Logs"** tab to watch the deployment
4. Wait **2-3 minutes** for deployment to complete
5. Look for: **"Deploy successful"** or **"Your service is live"**

---

## 🧪 Step 9: Test Everything

### Test Chatbot:
1. Go to: **https://dominantlogic.tech**
2. Navigate to **Chatbot** section
3. Ask a question: "Hello, can you help me?"
4. ✅ Should get an AI response

### Test Email:
1. Go to **Email** section
2. Try sending an email to a client
3. ✅ Should send successfully

### Test SMS (When SMSProvider is added):
1. Go to **SMS** section
2. Try sending an SMS
3. ✅ Should send successfully

---

## 🆘 Troubleshooting

### If Chatbot Doesn't Work:

**Check:**
1. Is `OPENROUTER_API_KEY` added correctly?
2. Check Render logs for errors
3. Try waiting 1-2 minutes (free models may be busy)
4. Check if deployment completed successfully

**Common Errors:**
- `401 Unauthorized` → API key is wrong
- `429 Rate Limited` → Wait a minute, fallback will try other models
- `500 Internal Server Error` → Check Render logs

### If Email Doesn't Work:

**Check:**
1. Is `MAILTRAP_API_TOKEN` added correctly?
2. Is sender email valid?
3. Check Render logs for errors
4. Verify Mailtrap token is active in Mailtrap dashboard

**Common Errors:**
- `401 Unauthorized` → Token is wrong
- `Invalid sender` → Check sender email format
- `Rate limit` → Free tier limit reached (4,000/month)

### If Deployment Fails:

**Check:**
1. Go to **"Logs"** tab in Render
2. Look for error messages
3. Common issues:
   - Missing dependencies → Check `package.json`
   - Syntax errors → Check code
   - Environment variable issues → Check variable names

---

## 📝 Quick Reference

### Required Variables (Must Have):
- ✅ `OPENROUTER_API_KEY` - For AI features
- ✅ `MAILTRAP_API_TOKEN` - For email sending

### Recommended Variables (Should Have):
- ✅ `OPENROUTER_MODEL` - Better reliability
- ✅ `MAILTRAP_SENDER_EMAIL` - Professional emails
- ✅ `MAILTRAP_SENDER_NAME` - Brand identity

### Optional Variables (When Available):
- ⏳ `SMS_PROVIDER_USERNAME` - SMS sending
- ⏳ `SMS_PROVIDER_PASSWORD` - SMS sending
- ⏳ `SMS_PROVIDER_SENDER` - SMS sender ID

---

## ✅ Checklist

**Before You Start:**
- [ ] Have Render dashboard open
- [ ] Have API keys ready
- [ ] Have 10-15 minutes

**During Setup:**
- [ ] Added `OPENROUTER_API_KEY`
- [ ] Added `OPENROUTER_MODEL` (recommended)
- [ ] Added `MAILTRAP_API_TOKEN`
- [ ] Added `MAILTRAP_SENDER_EMAIL`
- [ ] Added `MAILTRAP_SENDER_NAME`
- [ ] Added SMSProvider variables (when available)

**After Setup:**
- [ ] Waited for deployment (2-3 minutes)
- [ ] Checked deployment logs
- [ ] Tested chatbot
- [ ] Tested email
- [ ] Tested SMS (when available)

---

## 🎉 You're Done!

Once all variables are added and deployment completes, your platform will be fully functional!

**Need Help?**
- Check Render logs for errors
- Verify all variable names are correct (case-sensitive!)
- Make sure no extra spaces in values
- Wait for deployment to complete before testing

---

**Estimated Time:** 10-15 minutes

**Difficulty:** Easy - Just copy and paste! 🚀
