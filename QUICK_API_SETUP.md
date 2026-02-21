# ⚡ Quick API Setup - Step by Step

## 🎯 Start Here (5 Minutes):

### **1. Gmail Email (FREE - 2 minutes)**

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to: https://myaccount.google.com/apppasswords
4. Create app password: "Marketing PWA"
5. Copy the 16-character password
6. Add to Render:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx
   ```

---

### **2. OpenAI (FREE $5 Credit - 3 minutes)**

1. Go to: https://platform.openai.com/signup
2. Sign up (email or Google)
3. Verify email
4. Go to: https://platform.openai.com/api-keys
5. Click "Create new secret key"
6. Copy key (starts with `sk-`)
7. Add to Render:
   ```
   OPENAI_API_KEY=sk-xxxxxxxxxxxxx
   ```

---

### **3. Twilio SMS (FREE $15.50 Credit - 5 minutes)**

1. Go to: https://www.twilio.com/try-twilio
2. Sign up with email
3. Verify phone number
4. Get from dashboard:
   - Account SID (starts with `AC`)
   - Auth Token (click to reveal)
   - Get a phone number (free trial number)
5. Add to Render:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
   TWILIO_PHONE_NUMBER=+1234567890
   ```

---

## ✅ After Setup:

1. **Wait 1-2 minutes** for Render to restart
2. **Test your app:**
   - Try AI ad generation (needs OpenAI)
   - Try chatbot (needs OpenAI)
   - Try sending email (needs Gmail)
   - Try sending SMS (needs Twilio)

---

## 🎉 That's It!

You now have:
- ✅ Email marketing (FREE)
- ✅ AI features ($5 free credit)
- ✅ SMS marketing ($15.50 free credit)

**Total cost: $0 for testing!** 🚀
