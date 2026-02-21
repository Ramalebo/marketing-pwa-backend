# Quick Fix for 503 Error

## 🔴 The Problem
**503 Service Unavailable** means your backend is not running or not accessible.

---

## ✅ Quick Fix (3 Steps)

### Step 1: Check Backend Status

1. **In cPanel**, search for **"Node.js"** or **"Node.js Selector"**
2. **Open** "Setup Node.js App" or "Node.js Selector"
3. **Find** your backend application
4. **Check Status**:
   - ❌ **"Stopped"** → Click **"Start"** or **"Restart"**
   - ⚠️ **"Error"** → Go to Step 2
   - ✅ **"Running"** → Go to Step 3

---

### Step 2: If Backend Shows "Error"

**View the logs:**

1. **Click**: **"View Logs"** or **"Logs"**
2. **Look for** the error message

**Common Errors & Quick Fixes:**

| Error | Quick Fix |
|-------|-----------|
| `Cannot find module 'sequelize'` | Click **"Run NPM Install"** → Wait → Click **"Restart"** |
| `Access denied for user` | Check `.env` file - verify `DB_USER` and `DB_PASSWORD` |
| `Unknown database` | Check `.env` file - verify `DB_NAME=dominan1_marketing_pwa` |
| `ECONNREFUSED` | Database connection issue - check MySQL is running |

---

### Step 3: Verify .env File

1. **In File Manager**, go to `/public_html/backend/`
2. **Open** `.env` file
3. **Verify** these lines:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
```

4. **Save** if you made changes
5. **Restart** backend in Node.js Selector

---

## ✅ Success Check

**After restarting, check logs should show:**

```
Connected to MySQL database
Database models synchronized
Server running on port 3000
```

**Then try registration again - it should work!**

---

## 🆘 Still Not Working?

**Share with me:**
1. What does the backend status show? (Running/Stopped/Error)
2. What error message appears in the logs?
3. Screenshot of Node.js Selector

**I'll help you fix it! 🔧**
