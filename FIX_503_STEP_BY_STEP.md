# Fix 503 Error - Step-by-Step Guide

## 🎯 Goal
Get your backend running so registration works!

---

## 📍 Step 1: Find Node.js Selector in cPanel

### How to Find It:

1. **In cPanel**, look at the **top-right corner** for a search box
   - It says **"Search Tools (/)"** or has a magnifying glass icon

2. **Type**: `node` or `nodejs` or `application`

3. **Click** on **"Setup Node.js App"** or **"Node.js Selector"**

**OR** manually find it:
- Look in **"Software"** section
- Or **"Advanced"** section
- Scroll down and look for Node.js icon

---

## 🔍 Step 2: Check Backend Status

1. **In Node.js Selector**, you'll see a list of applications
2. **Look for your backend app** (might be named "marketing-app" or "backend" or similar)
3. **Check the Status column**:
   - ✅ **"Running"** = Backend is active → Go to Step 3
   - ❌ **"Stopped"** = Backend is not running → Go to Step 4
   - ⚠️ **"Error"** = Backend has an error → Go to Step 5

---

## ✅ Step 3: If Status Shows "Running" but Still 503

**Check the logs:**

1. **Click** on your backend application name
2. **OR** click **"View Logs"** or **"Logs"** button
3. **Scroll to the bottom** (most recent messages)
4. **Look for**:
   - ✅ `Connected to MySQL database` → Good! Check Step 8
   - ✅ `Server running on port 3000` → Good! Check Step 8
   - ❌ `Cannot find module 'sequelize'` → Go to Step 6
   - ❌ `Access denied for user` → Go to Step 7
   - ❌ `Unknown database` → Go to Step 7

---

## 🚀 Step 4: If Status Shows "Stopped"

**Start the backend:**

1. **Find your backend app** in the list
2. **Click** the **"Start"** or **"Restart"** button
3. **Wait** 10-20 seconds
4. **Refresh** the page
5. **Check status** - should now show "Running"
6. **Try registration again** on your website

**If it won't start or shows "Error"**, go to Step 5.

---

## ⚠️ Step 5: If Status Shows "Error"

**View the error:**

1. **Click** on your backend application name
2. **OR** click **"View Logs"** or **"Logs"** button
3. **Scroll to the bottom** - you'll see the error message
4. **Read the error** and follow the fix below

---

## 📦 Step 6: Fix "Cannot find module 'sequelize'"

**This means dependencies aren't installed:**

1. **In Node.js Selector**, find your backend app
2. **Click**: **"Run NPM Install"** button
3. **Wait** 2-5 minutes for installation to complete
   - You'll see progress messages
   - Don't close the page!
4. **When finished**, you'll see "Installation completed" or similar
5. **Click**: **"Restart"** button
6. **Wait** 10-20 seconds
7. **Check logs** - should now show "Connected to MySQL database"

---

## 🔧 Step 7: Fix Database Connection Errors

**If you see "Access denied" or "Unknown database":**

1. **In cPanel**, go to **"File Manager"**
2. **Navigate to**: `/public_html/backend/`
3. **Click** on `.env` file
4. **Click**: **"Edit"**
5. **Verify** these lines are exactly correct:

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
   - Database name includes your username prefix: `dominan1_marketing_pwa`
   - Username includes your username prefix: `dominan1_Onka`
   - Password is correct: `43MYhu32bBJ5qmc`

7. **Click**: **"Save Changes"**
8. **Go back** to Node.js Selector
9. **Click**: **"Restart"**
10. **Check logs** again

---

## ✅ Step 8: Verify Backend is Working

**After restarting, check logs should show:**

```
Connected to MySQL database
Database models synchronized
Server running on port 3000
```

**If you see these messages:**
- ✅ **Backend is working!**
- ✅ **Try registration again** on your website
- ✅ **It should work now!**

---

## 🆘 Common Issues & Quick Fixes

| Problem | Solution |
|---------|----------|
| **Can't find Node.js Selector** | Search for "node" in cPanel search box |
| **No applications listed** | Click "Create Application" (see Step 9) |
| **"Run NPM Install" button grayed out** | Wait a moment, refresh page, try again |
| **Installation takes too long** | Normal - can take 5+ minutes, be patient |
| **Still shows "Stopped" after restart** | Check logs for specific error |
| **Logs show "Port 3000 already in use"** | Another app using port - change port in .env |

---

## 🆕 Step 9: Create Application (If It Doesn't Exist)

**If you don't see any applications:**

1. **In Node.js Selector**, click **"Create Application"** button
2. **Fill in**:
   - **Node.js Version**: Select `18.x` or `20.x` (LTS)
   - **Application Root**: `/home/dominan1/public_html/backend`
   - **Application URL**: Leave default or `/api`
   - **Application Startup File**: `server.js`
   - **Application Mode**: Production
3. **Click**: **"Create"**
4. **Click**: **"Run NPM Install"** (wait for completion)
5. **Click**: **"Restart"**
6. **Check logs**

---

## 📋 Quick Checklist

Before trying registration again, verify:

- [ ] Backend status shows "Running"
- [ ] Logs show "Connected to MySQL database"
- [ ] Logs show "Server running on port 3000"
- [ ] No error messages in logs
- [ ] `.env` file has correct MySQL credentials

---

## 🎯 What to Do Right Now

1. **Open cPanel**
2. **Search** for "node" → Click "Node.js Selector"
3. **Check** backend status
4. **If "Stopped"** → Click "Start" or "Restart"
5. **If "Error"** → Click "View Logs" → Read error → Fix it
6. **If "Cannot find module"** → Click "Run NPM Install" → Wait → Restart
7. **Check logs** for "Connected to MySQL database"
8. **Try registration** on your website

---

**Once logs show "Connected to MySQL database" and "Server running on port 3000", your 503 error will be fixed! 🎉**
