# Super Simple Steps - Don't Worry!

## 🎯 Just 3 Things to Do

---

## ✅ Step 1: Wait for Build to Finish (5-10 minutes)

**In Render dashboard:**
- Just wait for the build to complete
- When it says "Live" → Move to Step 2

**That's it for now!** ☕

---

## ✅ Step 2: Add Environment Variables (5 minutes)

**In Render:**
1. Click "Environment" (left sidebar)
2. Click "Add Environment Variable"
3. Add these **one by one**:

```
NODE_ENV = production
PORT = 10000
DB_HOST = domains.co.za
DB_PORT = 3306
DB_NAME = dominan1_marketing_pwa
DB_USER = dominan1_Onka
DB_PASSWORD = 43MYhu32bBJ5qmc
JWT_SECRET = any-random-text-here
FRONTEND_URL = https://dominantlogic.tech
```

**Just copy and paste each one!**

---

## ✅ Step 3: Enable Remote MySQL (2 minutes)

**In cPanel:**
1. Search for "Remote MySQL"
2. Add: `%` (just the percent sign)
3. Click "Add"

**Done!**

---

## 🎉 That's It!

**After these 3 steps:**
- Check Render logs
- If you see "Connected to MySQL database" → **Success!**
- If you see an error → **Tell me what it says, I'll fix it!**

---

## 🆘 If You Get Stuck

**Just tell me:**
1. What step you're on
2. What error you see (if any)
3. **I'll help you fix it!**

**Don't worry - we'll get it working!** 😊
