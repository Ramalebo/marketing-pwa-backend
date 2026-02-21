# 🔧 Fix "Unknown column" Error

## ❌ The Problem:
You're getting error **#1054 - Unknown column 'businessName' in 'clients'**.

This means:
- The column might already be renamed to `business_name`, OR
- The column doesn't exist, OR
- The table structure is different than expected

## ✅ The Fix:

### **Step 1: Check Current Column Names**

1. **Go to phpMyAdmin**
2. **Select database:** `sql12815354`
3. **Click "SQL" tab**
4. **Run this query** (from `CHECK_CURRENT_COLUMNS.sql`):

```sql
SHOW COLUMNS FROM clients;
SHOW COLUMNS FROM users;
SHOW COLUMNS FROM notes;
SHOW COLUMNS FROM ads;
```

5. **Look at the results** - see which columns are:
   - **camelCase** (need to rename): `businessName`, `phoneNumber`, `createdBy`, etc.
   - **snake_case** (already correct): `business_name`, `phone_number`, `created_by`, etc.

---

### **Step 2: Rename Only Existing Columns**

Based on what you see in Step 1, run **only the ALTER statements** for columns that:
- **Still have camelCase names** (need renaming)
- **Don't already exist as snake_case**

**Example:**
- If you see `businessName` → run: `ALTER TABLE clients CHANGE COLUMN businessName business_name VARCHAR(255) NULL;`
- If you see `business_name` → **skip it** (already correct)
- If you see neither → **skip it** (column doesn't exist)

---

### **Step 3: Rename One Column at a Time**

Run each `ALTER TABLE` statement **one at a time**:

```sql
-- Example: If businessName exists, run this:
ALTER TABLE clients CHANGE COLUMN businessName business_name VARCHAR(255) NULL;

-- Then check if it worked, then run the next one:
ALTER TABLE clients CHANGE COLUMN phoneNumber phone_number VARCHAR(50) NOT NULL;

-- Continue one by one...
```

---

## 🎯 Quick Summary:

1. **Check current columns** (`SHOW COLUMNS FROM table_name;`)
2. **Identify which need renaming** (camelCase → snake_case)
3. **Rename one at a time** (skip if already renamed or doesn't exist)
4. **Test after each rename**

---

## ⚠️ Important:

- **Don't try to rename columns that don't exist**
- **Don't try to rename columns that are already snake_case**
- **Run one ALTER statement at a time** to see which ones work

---

**Check your current columns first, then rename only what needs renaming!** 🔍
