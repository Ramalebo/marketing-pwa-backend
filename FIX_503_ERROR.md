# Fix 503 Service Unavailable Error

## 🔴 Problem: 503 Error on Registration

**Error**: `Failed to load resource: the server responded with a status of 503`  
**Meaning**: Backend is not running or not accessible

---

## ✅ Step-by-Step Fix

### Step 1: Check if Backend is Running

1. **In cPanel**, go to **"Node.js Selector"**
   - Search for "node" in cPanel search box
   - Click on **"Setup Node.js App"** or **"Node.js Selector"**

2. **Find your backend application** in the list

3. **Check Status**:
   - ✅ **"Running"** = Backend is active (go to Step 2)
   - ❌ **"Stopped"** = Backend is not running (go to Step 3)
   - ⚠️ **"Error"** = Backend has an error (go to Step 4)

---

### Step 2: If Backend Shows "Running" but Still 503

**Check the logs:**

1. **In Node.js Selector**, click **"View Logs"** or **"Logs"**
2. **Look for errors**:
   - ❌ `Cannot find module 'sequelize'` → Go to Step 5
   - ❌ `Access denied for user` → Go to Step 6
   - ❌ `Unknown database` → Go to Step 6
   - ❌ `ECONNREFUSED` → Database connection issue
   - ✅ `Connected to MySQL database` → Good! Check Step 7

---

### Step 3: If Backend is "Stopped"

**Start the backend:**

1. **In Node.js Selector**, find your backend app
2. **Click**: **"Start"** or **"Restart"** button
3. **Wait** 10-20 seconds
4. **Refresh** the page - status should show "Running"
5. **Try registration again**

**If it won't start**, go to Step 4.

---

### Step 4: If Backend Shows "Error"

**Check logs for specific error:**

1. **Click**: **"View Logs"**
2. **Read the error message** - it will tell you what's wrong

**Common errors and fixes:**

#### Error: "Cannot find module 'sequelize'"
**Fix**: Dependencies not installed
- **In Node.js Selector**, click **"Run NPM Install"**
- **Wait** for installation to complete
- **Click**: **"Restart"**

#### Error: "Access denied for user 'dominan1_Onka'"
**Fix**: Wrong database credentials
- **Check** `.env` file in `/public_html/backend/`
- **Verify**:
  - `DB_NAME=dominan1_marketing_pwa`
  - `DB_USER=dominan1_Onka`
  - `DB_PASSWORD=43MYhu32bBJ5qmc`
- **Save** and **Restart** backend

#### Error: "Unknown database"
**Fix**: Database name is wrong
- **Check** `.env` file
- **Verify** `DB_NAME=dominan1_marketing_pwa` (with your username prefix)
- **Save** and **Restart** backend

#### Error: "ECONNREFUSED" or "Connection refused"
**Fix**: Database connection issue
- **Check** MySQL is running (should be automatic on cPanel)
- **Verify** database exists in phpMyAdmin
- **Check** `.env` file has correct credentials

---

### Step 5: Install Dependencies

**If you see "Cannot find module" errors:**

1. **In Node.js Selector**, find your backend app
2. **Click**: **"Run NPM Install"**
3. **Wait** for installation (may take 2-5 minutes)
4. **Check** for any errors during installation
5. **Click**: **"Restart"**
6. **Check logs** again

---

### Step 6: Verify .env File

**Make sure `.env` file is correct:**

1. **In File Manager**, go to `/public_html/backend/`
2. **Click** on `.env` file
3. **Click**: **"Edit"**
4. **Verify** these lines are correct:

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
```

5. **Save** the file
6. **Restart** backend in Node.js Selector

---

### Step 7: Verify Node.js Application Settings

**Check application configuration:**

1. **In Node.js Selector**, find your backend app
2. **Click**: **"Edit"** or **"Settings"**
3. **Verify**:
   - **Application Root**: `/home/dominan1/public_html/backend`
   - **Application Startup File**: `server.js`
   - **Node.js Version**: `18.x` or `20.x` (LTS)
   - **Application Mode**: Production
4. **Save** if you made changes
5. **Restart** the application

---

### Step 8: Check .htaccess File

**Verify API proxy is working:**

1. **In File Manager**, go to `/public_html/`
2. **Check** `.htaccess` file exists
3. **Verify** it contains:

```apache
# API Proxy - forward /api/* requests to backend
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

4. **If missing**, add it (see deployment guide)

---

## 🔍 Quick Diagnostic Checklist

Run through these checks:

- [ ] Backend status shows "Running" in Node.js Selector
- [ ] Logs show "Connected to MySQL database"
- [ ] Logs show "Server running on port 3000"
- [ ] `.env` file exists in `/public_html/backend/`
- [ ] `.env` has correct MySQL credentials
- [ ] Dependencies installed (no "Cannot find module" errors)
- [ ] Node.js app root is `/home/dominan1/public_html/backend`
- [ ] Startup file is `server.js`
- [ ] `.htaccess` has API proxy rules

---

## 🆘 Still Not Working?

### Check Backend Logs for Specific Error:

1. **In Node.js Selector**, click **"View Logs"**
2. **Scroll to the bottom** (most recent errors)
3. **Copy the error message** and check:

**Common Error Messages:**

| Error | Fix |
|-------|-----|
| `Cannot find module 'sequelize'` | Run NPM Install |
| `Access denied for user` | Check DB_USER and DB_PASSWORD in .env |
| `Unknown database` | Check DB_NAME in .env |
| `ECONNREFUSED` | Database not accessible |
| `Port 3000 already in use` | Another app using port 3000 |
| `SyntaxError` | Code error - check server.js |

---

## ✅ Success Indicators

**When backend is working, logs should show:**

```
Connected to MySQL database
Database models synchronized
Server running on port 3000
```

**Then try registration again - it should work!**

---

## 📞 Need More Help?

**Share these details:**
1. Backend status (Running/Stopped/Error)
2. Error message from logs
3. Screenshot of Node.js Selector
4. Contents of `.env` file (hide password)

**I'll help you fix the specific issue! 🔧**
