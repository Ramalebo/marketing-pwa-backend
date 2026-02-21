# 🔑 Free API Keys Guide - Where to Get Them

## 📋 Services Your App Uses:

1. **OpenAI** - AI Chatbot & Ad Generation
2. **Twilio** - SMS Marketing
3. **Email (Gmail/SMTP)** - Email Marketing
4. **Facebook/Instagram** - Social Media Posting (optional)
5. **WhatsApp Business** - WhatsApp Messaging (optional)

---

## 1. 🤖 OpenAI API Key (Chatbot & AI Ad Generation)

### **Free Tier:**
- ✅ **$5 free credit** when you sign up
- ✅ **Pay-as-you-go** after that (very cheap)
- ✅ **No credit card required** for initial $5

### **How to Get:**
1. **Go to:** https://platform.openai.com/signup
2. **Sign up** with email or Google account
3. **Verify your email**
4. **Go to:** https://platform.openai.com/api-keys
5. **Click "Create new secret key"**
6. **Copy the key** (starts with `sk-`)
7. **Add to Render:** Go to Render dashboard → Your backend service → Environment → Add:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

### **Cost After Free Tier:**
- GPT-4: ~$0.03 per 1K tokens (very cheap for testing)
- GPT-3.5: ~$0.0015 per 1K tokens (super cheap)

---

## 2. 📱 Twilio API (SMS Marketing)

### **Free Tier:**
- ✅ **$15.50 free credit** when you sign up
- ✅ **Trial account** - no credit card required initially
- ✅ **Can send SMS** to verified phone numbers only (during trial)

### **How to Get:**
1. **Go to:** https://www.twilio.com/try-twilio
2. **Sign up** with email
3. **Verify your phone number**
4. **Get your credentials:**
   - **Account SID** (starts with `AC`)
   - **Auth Token** (shown once - save it!)
   - **Phone Number** (get a free trial number)
5. **Add to Render:**
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### **Cost After Free Tier:**
- SMS: ~$0.0075 per message (very cheap)
- Phone number: ~$1/month

### **⚠️ Trial Limitations:**
- Can only send to **verified phone numbers** during trial
- To send to any number, upgrade to paid account (but still very cheap)

---

## 3. 📧 Email (Gmail SMTP) - FREE!

### **Free Tier:**
- ✅ **Completely FREE** with Gmail
- ✅ **No limits** (within Gmail's daily limits)
- ✅ **No credit card required**

### **How to Set Up:**
1. **Use your Gmail account** (or create one)
2. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Marketing PWA"
   - Copy the 16-character password
4. **Add to Render:**
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### **Gmail Limits:**
- **500 emails/day** (free account)
- **2,000 emails/day** (Google Workspace)

---

## 4. 📘 Facebook/Instagram API (Optional)

### **Free Tier:**
- ✅ **Completely FREE**
- ✅ **No credit card required**
- ✅ **Requires Facebook Developer account**

### **How to Get:**
1. **Go to:** https://developers.facebook.com/
2. **Create a Facebook App**
3. **Get App ID and App Secret**
4. **Get Page Access Token** (for posting)
5. **Add to Render:**
   ```
   FACEBOOK_APP_ID=your-app-id
   FACEBOOK_APP_SECRET=your-app-secret
   FACEBOOK_ACCESS_TOKEN=your-page-access-token
   FACEBOOK_PAGE_ID=your-page-id
   ```

### **Limitations:**
- Free, but requires Facebook Developer account setup
- Can post to your own pages only

---

## 5. 💬 WhatsApp Business API (Optional)

### **Free Tier:**
- ✅ **FREE** via Twilio (if you have Twilio account)
- ✅ **Or use Meta Business API** (free but complex setup)

### **Via Twilio:**
- If you have Twilio account, you can add WhatsApp
- **Cost:** ~$0.005 per message (very cheap)

### **Via Meta:**
- **Free** but requires:
  - Facebook Business account
  - WhatsApp Business account
  - Complex verification process

---

## 🎯 Quick Setup Priority:

### **Essential (Start Here):**
1. ✅ **OpenAI** - For chatbot and AI ad generation ($5 free)
2. ✅ **Gmail SMTP** - For email marketing (FREE)
3. ✅ **Twilio** - For SMS ($15.50 free credit)

### **Optional (Later):**
4. Facebook/Instagram - For social media posting
5. WhatsApp - For WhatsApp messaging

---

## 📝 How to Add to Render:

1. **Go to:** https://dashboard.render.com
2. **Find your backend service**
3. **Click "Environment"** tab
4. **Click "Add Environment Variable"**
5. **Add each key:**
   ```
   OPENAI_API_KEY=sk-...
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+1...
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```
6. **Click "Save Changes"**
7. **Render will auto-restart** with new keys

---

## 💰 Total Cost Estimate:

### **Free Tier (Testing):**
- OpenAI: $5 free credit
- Twilio: $15.50 free credit
- Gmail: FREE
- **Total: $0** (for testing)

### **After Free Tier (Production):**
- OpenAI: ~$5-10/month (light usage)
- Twilio: ~$5-20/month (depending on SMS volume)
- Gmail: FREE
- **Total: ~$10-30/month** (very affordable!)

---

## 🚀 Recommended Order:

1. **Start with Gmail** (FREE, easiest)
2. **Add OpenAI** ($5 free, enables AI features)
3. **Add Twilio** ($15.50 free, enables SMS)
4. **Add Facebook/WhatsApp later** (if needed)

---

**Start with Gmail and OpenAI - they're the easiest and most useful!** 🎉
