# FreeSQLDatabase - Super Simple Setup

## 🎯 Just 4 Steps!

---

## ✅ Step 1: Create Database (2 min)

**In FreeSQLDatabase:**
1. **Click** "Create Database"
2. **Name**: `marketing_pwa`
3. **Click** "Create"
4. **Copy** the connection details shown:
   - Hostname (e.g., `sql12.freesqldatabase.com`)
   - Port: `3306`
   - Database name
   - Username
   - Password

---

## ✅ Step 2: Import Schema in phpMyAdmin (3 min)

1. **In FreeSQLDatabase**, click **"phpMyAdmin"** link
2. **Login** with your FreeSQLDatabase username/password
3. **Click** your database name in left sidebar
4. **Click** "SQL" tab at top
5. **Open** `backend/database/schema-no-database.sql`
6. **Copy** all the SQL
7. **Paste** into phpMyAdmin SQL box
8. **Click** "Go"

**You should see 7 tables created!** ✅

---

## ✅ Step 3: Update Render (3 min)

**In Render → Environment, add:**

```
DB_HOST = (hostname from FreeSQLDatabase)
DB_PORT = 3306
DB_NAME = marketing_pwa
DB_USER = (your FreeSQLDatabase username)
DB_PASSWORD = (your FreeSQLDatabase password)
```

**Keep these:**
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-secret-key
FRONTEND_URL=https://dominantlogic.tech
```

---

## ✅ Step 4: Check Logs (1 min)

1. **Render → Logs**
2. **Look for**: `Connected to MySQL database`
3. **If you see it → Success!** 🎉

---

## 🎉 Done!

**That's it! Your backend is connected!**

**Test it:**
- Backend: `https://marketing-pwa-backend.onrender.com/api`
- Frontend: Update `.env.production` and test!

---

## 🆘 If You Get Errors

**Share the error message and I'll help fix it!**

**Let's get it working!** 🚀
