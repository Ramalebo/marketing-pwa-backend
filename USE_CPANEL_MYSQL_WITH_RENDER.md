# Use cPanel MySQL with Render - Step-by-Step Guide

## 🎯 Goal
Connect your Render backend to your existing MySQL database on domains.co.za

---

## ⚠️ Important Notes

**Render can't use `localhost` MySQL!** You need to:
1. Enable remote MySQL access in cPanel
2. Find your MySQL hostname (not `localhost`)
3. Update Render environment variables with the correct hostname

---

## 📋 Step 1: Find Your MySQL Hostname

### Option A: Check cPanel MySQL Databases

1. **In cPanel**, go to **"MySQL Databases"**
2. **Look for** connection details or hostname
3. **Common hostnames**:
   - `domains.co.za`
   - `mysql.domains.co.za`
   - `localhost` (but this won't work from Render)
   - An IP address

### Option B: Check phpMyAdmin

1. **In cPanel**, go to **"phpMyAdmin"**
2. **Look at the top** - it might show the hostname
3. **Or check** the connection string

### Option C: Contact Your Hosting Provider

**If you can't find it:**
- Contact domains.co.za support
- Ask: "What is the MySQL hostname for external connections?"
- They'll tell you the correct hostname

---

## 🔓 Step 2: Enable Remote MySQL Access

### 2.1: Go to Remote MySQL in cPanel

1. **In cPanel**, search for **"Remote MySQL"**
2. **OR** go to **"Databases"** → **"Remote MySQL"**

### 2.2: Add Render's IP Addresses

**Render uses these IP ranges** (check Render docs for latest):
- You can add specific IPs if Render provides them
- **OR** add `%` to allow all IPs (less secure but works)

**To add:**
1. **In Remote MySQL**, you'll see a field to add IP addresses
2. **Add**: `%` (allows all IPs) **OR** specific Render IPs
3. **Click** "Add Host" or "Add"

**⚠️ Security Note:**
- Using `%` allows any IP to connect (less secure)
- Better to use specific IPs if Render provides them
- For testing, `%` is fine

---

## 🔧 Step 3: Update Render Environment Variables

### 3.1: Go to Render Dashboard

1. **Click** on your `marketing-pwa-backend` service
2. **Click** "Environment" in left sidebar
3. **Click** "Add Environment Variable" for each

### 3.2: Update Database Variables

**Update these variables:**

```env
DB_HOST=domains.co.za
```

**OR** use the hostname you found (could be):
- `mysql.domains.co.za`
- An IP address
- Another hostname your provider gave you

**Keep these the same:**
```env
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
```

**Other variables:**
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://dominantlogic.tech
```

### 3.3: Save and Restart

1. **After adding/updating** all variables
2. **Render will automatically restart** the service
3. **OR** manually trigger a redeploy

---

## ✅ Step 4: Test Connection

### 4.1: Check Render Logs

1. **In Render**, click **"Logs"** tab
2. **Look for**:
   - ✅ `Connected to MySQL database` → **Success!**
   - ❌ `Access denied` → Wrong credentials or remote access not enabled
   - ❌ `Unknown database` → Wrong database name
   - ❌ `ECONNREFUSED` → Wrong hostname or port

### 4.2: Common Errors and Fixes

**Error: "Access denied for user"**
- **Fix**: Check username/password are correct
- **Fix**: Make sure Remote MySQL has your IP/`%` added

**Error: "Unknown database"**
- **Fix**: Check database name is correct: `dominan1_marketing_pwa`

**Error: "ECONNREFUSED" or "Connection refused"**
- **Fix**: Wrong hostname - try `domains.co.za` or `mysql.domains.co.za`
- **Fix**: Check port is `3306`
- **Fix**: Make sure Remote MySQL is enabled

**Error: "Host is not allowed to connect"**
- **Fix**: Add Render's IP or `%` to Remote MySQL in cPanel

---

## 🔍 Step 5: Find Correct Hostname (If Still Not Working)

### Try These Hostnames:

1. **`domains.co.za`** (most common)
2. **`mysql.domains.co.za`**
3. **`localhost`** (won't work from Render, but try if others fail)
4. **Your server IP** (if you know it)

### Test Each One:

1. **Update** `DB_HOST` in Render
2. **Wait** for service to restart
3. **Check logs** for connection success
4. **Try next** if it fails

---

## 📋 Quick Checklist

- [ ] Found MySQL hostname (not `localhost`)
- [ ] Enabled Remote MySQL in cPanel
- [ ] Added `%` or Render IPs to Remote MySQL
- [ ] Updated `DB_HOST` in Render environment variables
- [ ] Updated other database variables in Render
- [ ] Service restarted/redeployed
- [ ] Checked logs for "Connected to MySQL database"
- [ ] No connection errors in logs

---

## 🆘 Still Not Working?

**Share these details:**
1. **What hostname** you're using for `DB_HOST`
2. **Error message** from Render logs
3. **Whether** Remote MySQL is enabled in cPanel
4. **What** shows in cPanel MySQL Databases section

**I'll help you fix it!**

---

## ✅ Success!

**When it works, you'll see in logs:**
```
Connected to MySQL database
Database models synchronized
Server running on port 10000
```

**Then your backend will work with your existing database!** 🎉
