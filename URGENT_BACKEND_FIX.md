# 🚨 URGENT: Backend 500 Error Fix

## ❌ The Problem:
You're getting **500 errors** on `/api/auth/login` and `/api/auth/register`. This is because:

1. **Database columns are still in camelCase** (`isMainUser`, `isActive`, `createdBy`)
2. **Sequelize models expect snake_case** (`is_main_user`, `is_active`, `created_by`)
3. **The database migration hasn't been run yet**

## ✅ The Fix:

### **Step 1: Run Database Migration** (CRITICAL!)

You **MUST** run the database column rename migration first:

1. **Go to FreeSQLDatabase.com phpMyAdmin**
2. **Select database:** `sql12815354`
3. **Click "SQL" tab**
4. **First, find foreign key names:**
   ```sql
   SELECT CONSTRAINT_NAME, TABLE_NAME 
   FROM information_schema.KEY_COLUMN_USAGE 
   WHERE TABLE_SCHEMA = 'sql12815354' 
   AND REFERENCED_TABLE_NAME IS NOT NULL;
   ```
5. **Drop all foreign keys** (use names from query above)
6. **Run column rename migration** from `FIX_DATABASE_STEP_BY_STEP.sql`
7. **Re-add foreign keys** (optional)

**OR** use `COMPLETE_FIX_WITH_FOREIGN_KEYS.sql` (replace constraint names first)

---

### **Step 2: Update Backend Code** (I just fixed this)

I've updated `backend/models/User.js` to use `field` mappings for snake_case columns.

**You need to:**
1. **Push backend changes to GitHub:**
   ```bash
   cd C:\temp\AppCode\backend
   git add models/User.js
   git commit -m "Fix User model to use snake_case column names"
   git push origin main
   ```
2. **Wait 2-3 minutes** for Render to auto-deploy

---

## 🎯 Quick Summary:

1. **Run database migration** (rename columns to snake_case) ← **DO THIS FIRST!**
2. **Push backend code** (User model fix) ← **DO THIS SECOND!**
3. **Wait for Render to deploy**
4. **Try login/register again** - should work!

---

## ⚠️ Important:

**The database migration is CRITICAL!** Without it, the backend will keep getting 500 errors because it can't find the columns it expects.

---

**Run the database migration NOW, then push the backend code!** 🚀
