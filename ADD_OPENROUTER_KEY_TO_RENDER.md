# Add OpenRouter API Key to Render

## Your OpenRouter API Key
```
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
```

---

## Quick Steps to Add to Render

### Step 1: Go to Render Dashboard
1. Go to: **https://dashboard.render.com**
2. Log in to your account
3. Find and click on your backend service: **`marketing-pwa-backend`** (or whatever you named it)

### Step 2: Open Environment Variables
1. Click on the **"Environment"** tab (in the left sidebar)
2. You'll see a list of existing environment variables

### Step 3: Add OpenRouter API Key
1. Click **"Add Environment Variable"** button
2. In the **Key** field, enter: `OPENROUTER_API_KEY`
3. In the **Value** field, paste: `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`
4. Click **"Save Changes"**

### Step 4: Add OpenRouter Model (Optional but Recommended)
1. Click **"Add Environment Variable"** again
2. In the **Key** field, enter: `OPENROUTER_MODEL`
3. In the **Value** field, enter: `meta-llama/llama-3.2-3b-instruct:free`
4. Click **"Save Changes"**

### Step 5: Redeploy (Important!)
1. After adding the variables, Render will automatically trigger a new deployment
2. Wait 2-3 minutes for the deployment to complete
3. Check the **"Logs"** tab to ensure deployment succeeded

---

## Verify It's Working

After deployment, test the chatbot:
1. Go to your frontend: **https://dominantlogic.tech**
2. Navigate to the **Chatbot** section
3. Ask a question like: "Hello, can you help me?"
4. If you get a response, the API key is working! ✅

---

## What This Enables

Once added, your OpenRouter API key will enable:
- ✅ **AI Chatbot** - Chat with AI assistant
- ✅ **AI Ad Generation** - Generate marketing ad content
- ✅ **AI Hashtag Generation** - Generate hashtags for social media posts

---

## Troubleshooting

**If chatbot doesn't work:**
1. Check Render logs for errors
2. Verify the API key is correct (no extra spaces)
3. Make sure the deployment completed successfully
4. Try a different free model: `google/gemini-flash-1.5:free`

**Common Errors:**
- `401 Unauthorized` - API key is incorrect
- `429 Too Many Requests` - Free tier rate limit (wait a minute)
- `500 Internal Server Error` - Check Render logs

---

## Your Environment Variables Should Look Like:

```
OPENROUTER_API_KEY=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
OPENROUTER_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

---

**That's it! Your AI features should now be working.** 🎉
