# Railway MySQL - Quick Setup Guide

## 🎯 Fastest Free MySQL Setup

---

## Step 1: Sign Up for Railway (2 min)

1. **Go to** https://railway.app
2. **Click** "Start a New Project"
3. **Sign up** with GitHub (easiest) or email
4. **Verify** email if needed

---

## Step 2: Create MySQL Database (2 min)

1. **In Railway dashboard**, click **"New Project"**
2. **Click** "New" button
3. **Select** "Database"
4. **Click** "Add MySQL"
5. **Wait** 30-60 seconds for database to be created

---

## Step 3: Get Connection Details (1 min)

1. **Click** on your MySQL database
2. **Click** "Variables" tab
3. **You'll see** these variables:

```
MYSQLHOST = xxxxxx.railway.app
MYSQLPORT = 3306
MYSQLDATABASE = railway
MYSQLUSER = root
MYSQLPASSWORD = xxxxxx
```

**Copy these values!**

---

## Step 4: Update Render Environment Variables (3 min)

1. **Go to** Render → your service → "Environment"
2. **Add/Update** these variables:

```
DB_HOST = (value from MYSQLHOST - e.g., xxxxxx.railway.app)
DB_PORT = (value from MYSQLPORT - usually 3306)
DB_NAME = (value from MYSQLDATABASE - usually railway)
DB_USER = (value from MYSQLUSER - usually root)
DB_PASSWORD = (value from MYSQLPASSWORD)
```

**Keep other variables:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://dominantlogic.tech
```

---

## Step 5: Import Schema (3 min)

1. **In Railway**, click your MySQL database
2. **Click** "Data" tab (or "Query" tab)
3. **Open** `backend/database/schema-no-database.sql`
4. **Copy** all the SQL
5. **Paste** into Railway query editor
6. **Click** "Run" or execute

---

## Step 6: Check Render Logs (1 min)

1. **Go to** Render → "Logs"
2. **Wait** for service to restart
3. **Look for**: `Connected to MySQL database`

**If you see it → Success!** 🎉

---

## ✅ Done!

**Your backend is now connected to free MySQL on Railway!**

**Test it:**
- Backend: `https://marketing-pwa-backend.onrender.com/api`
- Frontend: Update and test!

---

## 🆘 Troubleshooting

**"Access denied"**
→ Check username/password are correct

**"Unknown database"**
→ Check DB_NAME matches Railway database name

**Still errors?**
→ Share the error message and I'll help!

---

**Railway MySQL is FREE and works perfectly!** 🚀
