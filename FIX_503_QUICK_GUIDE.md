# Fix 503 Error - Quick Action Guide

## 🎯 Goal: Get Your App Working Without 503 Error

A **503 error** means your **backend is not running** or **not accessible**. Let's fix it step by step.

---

## ✅ Step 1: Check if Backend is Running

### In cPanel:

1. **Search** for "node" in cPanel search box (top-right)
2. **Click** "Node.js Selector" or "Setup Node.js App"
3. **Look** at the Status column:
   - ✅ **"Running"** → Go to Step 2
   - ❌ **"Stopped"** → Go to Step 3
   - ⚠️ **"Error"** → Go to Step 4

---

## 🚀 Step 2: If Status is "Running" but Still 503

**Check the logs:**

1. **Click** "View Logs" or "Logs" button
2. **Scroll to bottom** (most recent messages)
3. **Look for**:
   - ✅ `Connected to MySQL database` → Backend is working! Check Step 6
   - ❌ `Cannot find module 'sequelize'` → Go to Step 5
   - ❌ `Access denied for user` → Go to Step 7
   - ❌ `Unknown database` → Go to Step 7

---

## ▶️ Step 3: If Status is "Stopped"

**Start the backend:**

1. **Click** "Start" or "Restart" button
2. **Wait** 10-20 seconds
3. **Refresh** the page
4. **Check status** - should show "Running"
5. **Try your app again**

**If it won't start**, go to Step 4.

---

## ⚠️ Step 4: If Status is "Error"

**View the error:**

1. **Click** "View Logs"
2. **Scroll to bottom** - read the error message
3. **Common errors:**
   - `Cannot find module` → Go to Step 5
   - `Access denied` or `Unknown database` → Go to Step 7
   - `Port already in use` → Change PORT in .env

---

## 📦 Step 5: Install Dependencies

**If you see "Cannot find module 'sequelize'" or similar:**

1. **In Node.js Selector**, find your backend app
2. **Click** "Run NPM Install"
3. **Wait** 2-5 minutes (don't close the page!)
4. **When finished**, click "Restart"
5. **Check logs** - should show "Connected to MySQL database"

---

## ✅ Step 6: Verify Backend is Working

**After restarting, logs should show:**

```
Connected to MySQL database
Database models synchronized
Server running on port 3000
```

**If you see these:**
- ✅ **Backend is working!**
- ✅ **Try your app again - 503 should be gone!**

---

## 🔧 Step 7: Fix Database Connection

**If you see "Access denied" or "Unknown database":**

1. **In cPanel**, go to "File Manager"
2. **Navigate to**: `/public_html/backend/`
3. **Click** on `.env` file
4. **Click** "Edit"
5. **Verify** these lines are correct:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
```

6. **Check**:
   - No extra spaces
   - No quotes around values
   - Database name includes prefix: `dominan1_marketing_pwa`
   - Username includes prefix: `dominan1_Onka`

7. **Click** "Save Changes"
8. **Go back** to Node.js Selector
9. **Click** "Restart"
10. **Check logs** again

---

## 🆕 Step 8: Create Application (If It Doesn't Exist)

**If you don't see any applications:**

1. **Click** "Create Application"
2. **Fill in**:
   - **Node.js Version**: `18.x` or `20.x`
   - **Application Root**: `/home/dominan1/public_html/backend`
   - **Application Startup File**: `server.js`
   - **Application Mode**: Production
3. **Click** "Create"
4. **Click** "Run NPM Install" (wait for completion)
5. **Click** "Restart"
6. **Check logs**

---

## 📋 Quick Diagnostic Checklist

**Before trying your app again, verify:**

- [ ] Backend status shows "Running" in Node.js Selector
- [ ] Logs show "Connected to MySQL database"
- [ ] Logs show "Server running on port 3000"
- [ ] No error messages in logs
- [ ] `.env` file exists in `/public_html/backend/`
- [ ] `.env` has correct MySQL credentials

---

## 🎯 Most Common Fix

**90% of 503 errors are fixed by:**

1. **Click** "Run NPM Install" in Node.js Selector
2. **Wait** for completion
3. **Click** "Restart"
4. **Check logs** for "Connected to MySQL database"

**That's it!** 🎉

---

## 🆘 Still Not Working?

**Share these details:**

1. **Backend status** (Running/Stopped/Error)
2. **Error message** from logs (scroll to bottom)
3. **Screenshot** of Node.js Selector (if possible)

**I'll help you fix the specific issue!**

---

## ✅ Success Indicators

**When backend is working, you'll see in logs:**

```
Connected to MySQL database
Database models synchronized
Server running on port 3000
```

**Then your app will work without 503 error!** 🚀
