# 🔧 Fix Foreign Key Error (#1025)

## ❌ The Problem:
You're getting error **#1025** when trying to rename columns. This happens because MySQL can't rename columns that are referenced by foreign key constraints.

## ✅ Solution Options:

### **Option 1: Use the Safe Migration Script** (Recommended)

I've created `FIX_DATABASE_COLUMNS_SAFE.sql` which:
1. Drops all foreign key constraints first
2. Renames all columns
3. Re-adds the foreign key constraints

**Steps:**
1. Open phpMyAdmin
2. Select database: `sql12815354`
3. Click "SQL" tab
4. Copy and paste **entire contents** of `FIX_DATABASE_COLUMNS_SAFE.sql`
5. Click "Go"

---

### **Option 2: Manual Step-by-Step** (If Option 1 fails)

#### Step 1: Find Foreign Key Names

Run this query first to see what foreign keys exist:

```sql
SELECT CONSTRAINT_NAME, TABLE_NAME 
FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'sql12815354' 
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

#### Step 2: Drop Foreign Keys

For each foreign key found, run:
```sql
ALTER TABLE [table_name] DROP FOREIGN KEY [constraint_name];
```

For example:
```sql
ALTER TABLE clients DROP FOREIGN KEY clients_ibfk_1;
ALTER TABLE notes DROP FOREIGN KEY notes_ibfk_1;
-- etc. for all foreign keys
```

#### Step 3: Rename Columns

Use `FIX_DATABASE_STEP_BY_STEP.sql` - run each `ALTER TABLE` statement **one at a time**.

#### Step 4: Re-add Foreign Keys

After all columns are renamed, re-add the foreign keys using the schema file.

---

### **Option 3: Simplest - Drop and Recreate** (If you have no important data)

If your database is empty or you can afford to lose data:

1. **Drop all tables:**
```sql
DROP TABLE IF EXISTS post_history;
DROP TABLE IF EXISTS templates;
DROP TABLE IF EXISTS customer_contacts;
DROP TABLE IF EXISTS ads;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;
```

2. **Run the corrected schema:**
   - Use `backend/database/schema-no-database.sql` but with **snake_case** column names
   - I'll create a corrected version for you

---

## 🎯 Recommended Approach:

**Try Option 1 first** (`FIX_DATABASE_COLUMNS_SAFE.sql`). If it fails, use **Option 2** (step-by-step).

---

**Let me know which option you want to try, or if you get any errors!** 🚀
