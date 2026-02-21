# PlanetScale Setup - Complete Step-by-Step Guide

## 🎯 Goal
Set up free MySQL on PlanetScale and connect it to your Render backend.

**Why PlanetScale?**
- ✅ FREE tier (perfect for your app)
- ✅ Works perfectly with Render
- ✅ No hostname issues
- ✅ Easy to set up

---

## 📋 Step 1: Sign Up for PlanetScale (2 minutes)

### 1.1: Go to PlanetScale

1. **Open your browser**
2. **Go to**: https://planetscale.com
3. **Click** "Sign up" (top right)

### 1.2: Create Account

**Option A: Sign up with GitHub (Easiest)**
1. **Click** "Sign up with GitHub"
2. **Authorize** PlanetScale
3. **Done!**

**Option B: Sign up with Email**
1. **Enter** your email
2. **Enter** a password
3. **Click** "Sign up"
4. **Check** your email for verification
5. **Click** the verification link

---

## 📦 Step 2: Create Database (3 minutes)

### 2.1: Create New Database

1. **After logging in**, you'll see the PlanetScale dashboard
2. **Click** the **"New database"** button (big green button)
3. **OR** click **"Create database"** link

### 2.2: Fill in Database Details

**Fill in the form:**

- **Database name**: `marketing_pwa` (or any name you like)
- **Region**: Choose closest to you:
  - `US East (N. Virginia)` - if you're in US East
  - `US West (Oregon)` - if you're in US West
  - `EU (Ireland)` - if you're in Europe
  - `Asia Pacific (Mumbai)` - if you're in Asia
- **Plan**: Select **"Hobby"** (FREE tier)
- **Click** "Create database"

### 2.3: Wait for Creation

- **Wait** 10-30 seconds
- Database will be created
- You'll see the database dashboard

---

## 🔑 Step 3: Get Connection Details (2 minutes)

### 3.1: Open Connect Dialog

1. **In your database dashboard**, look for **"Connect"** button
2. **Click** "Connect"
3. **A modal/popup** will appear with connection options

### 3.2: Select Node.js

1. **In the connect dialog**, you'll see tabs like:
   - `General`
   - `Node.js`
   - `PHP`
   - `Python`
   - etc.
2. **Click** the **"Node.js"** tab

### 3.3: Copy Connection Details

**You'll see something like:**

```
Host: aws.connect.psdb.cloud
Username: xxxxxx
Password: pscale_pw_xxxxx
Database: marketing_pwa
Port: 3306
```

**OR** you might see a connection string like:
```
mysql://xxxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/marketing_pwa?sslaccept=strict
```

**Copy these values** - you'll need them for Render!

---

## ⚙️ Step 4: Update Render Environment Variables (3 minutes)

### 4.1: Go to Render Environment

1. **Go to** https://dashboard.render.com
2. **Click** on your `marketing-pwa-backend` service
3. **Click** "Environment" in the left sidebar

### 4.2: Update Database Variables

**Update or add these variables:**

**If you have a connection string:**
- Parse it to get individual values (see below)

**If you have individual values from PlanetScale:**

1. **Find or add** `DB_HOST`:
   - **Value**: `aws.connect.psdb.cloud` (or the host from PlanetScale)
   - **Click** "Save Changes"

2. **Find or add** `DB_PORT`:
   - **Value**: `3306`
   - **Click** "Save Changes"

3. **Find or add** `DB_NAME`:
   - **Value**: `marketing_pwa` (or your database name)
   - **Click** "Save Changes"

4. **Find or add** `DB_USER`:
   - **Value**: The username from PlanetScale (usually starts with random characters)
   - **Click** "Save Changes"

5. **Find or add** `DB_PASSWORD`:
   - **Value**: The password from PlanetScale (usually starts with `pscale_pw_`)
   - **Click** "Save Changes"

### 4.3: Keep Other Variables

**Make sure these are still set:**

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://dominantlogic.tech
```

---

## 📊 Step 5: Import Your Database Schema (5 minutes)

### 5.1: Open PlanetScale Console

1. **In PlanetScale dashboard**, click on your database
2. **Click** "Console" tab (or "SQL Editor")
3. **You'll see** a SQL query editor

### 5.2: Get Your Schema

1. **Open** your local file: `backend/database/schema-no-database.sql`
2. **Copy** ALL the content (Ctrl+A, Ctrl+C)

### 5.3: Run Schema in PlanetScale

1. **In PlanetScale Console**, paste the schema SQL
2. **Click** "Run" or press `Ctrl+Enter`
3. **Wait** for it to execute
4. **You should see** "Success" or table creation messages

**Note:** PlanetScale uses MySQL, so your schema should work as-is!

---

## ✅ Step 6: Test Connection (2 minutes)

### 6.1: Check Render Logs

1. **Go back to** Render dashboard
2. **Click** "Logs" tab
3. **Wait** for the service to restart (happens automatically after env var changes)
4. **Look for**:
   - ✅ `Connected to MySQL database` → **Success!**
   - ❌ Still seeing errors → Go to troubleshooting

### 6.2: Verify Database Connection

**If you see "Connected to MySQL database":**
- ✅ **Database is working!**
- ✅ **Your backend is ready!**

---

## 🔧 Step 7: Update Frontend (3 minutes)

### 7.1: Update .env.production

**In your local `frontend/.env.production`:**

```env
VUE_APP_API_URL=https://marketing-pwa-backend.onrender.com/api
```

**Replace with your actual Render URL if different!**

### 7.2: Rebuild Frontend

**In your terminal:**

```bash
cd frontend
npm run build
```

### 7.3: Upload to cPanel

1. **Upload** the `dist/` folder contents to `/public_html/`
2. **Replace** old files
3. **Update** `.htaccess` (remove API proxy - not needed)

---

## 🎉 Success!

**Your app should now work!**

**Test it:**
- Frontend: `https://dominantlogic.tech`
- Backend: `https://marketing-pwa-backend.onrender.com/api`
- Try registration/login - should work! 🎉

---

## 🆘 Troubleshooting

### Still Getting Connection Errors

**Check:**
1. **All environment variables** are set correctly in Render
2. **No typos** in hostname, username, password
3. **Database name** matches exactly
4. **Schema** was run successfully in PlanetScale

### "Access denied" Error

**Fix:**
- **Check** username and password are correct
- **Make sure** you copied the full password (it's long!)
- **Re-generate** password in PlanetScale if needed:
  - Go to database → "Settings" → "Passwords" → "New password"

### "Unknown database" Error

**Fix:**
- **Check** `DB_NAME` matches your PlanetScale database name exactly
- **Case-sensitive** - make sure it matches!

### Schema Import Failed

**Fix:**
- **Check** for syntax errors in your SQL
- **Run** tables one by one if needed
- **Check** PlanetScale console for specific error messages

---

## 📋 Quick Checklist

- [ ] PlanetScale account created
- [ ] Database created on PlanetScale
- [ ] Connection details copied
- [ ] Environment variables updated in Render
- [ ] Schema imported to PlanetScale
- [ ] Render logs show "Connected to MySQL database"
- [ ] Frontend `.env.production` updated
- [ ] Frontend rebuilt and uploaded
- [ ] Tested registration/login

---

## 🎯 What You'll Have

**Frontend**: `https://dominantlogic.tech` (on cPanel)
**Backend**: `https://marketing-pwa-backend.onrender.com` (on Render)
**Database**: `marketing_pwa` (on PlanetScale - FREE!)

**Everything working together!** ✅

---

## 🆘 Need Help?

**If you get stuck:**
1. **Share** what step you're on
2. **Share** any error messages
3. **I'll help** you fix it!

**Let's get your database connected! 🚀**
