# Recreate tables in cPanel phpMyAdmin

Use this to recreate the Marketing PWA tables in your MySQL database **dominan1_marketing_pwa**.

---

## Steps

### 1. Open phpMyAdmin

- In **cPanel**, find **Databases** → **phpMyAdmin** and open it.

### 2. Select the database

- In the **left sidebar**, click **`dominan1_marketing_pwa`**.
- If you don’t see it, create the database in cPanel → **MySQL® Databases** first, then open phpMyAdmin again.

### 3. Open the SQL tab

- With **dominan1_marketing_pwa** selected, click the **SQL** tab at the top.

### 4. Paste and run the script

- Open this file on your computer:  
  **`c:\temp\AppCode\backend\sql\cpanel_mysql_setup.sql`**
- Select **all** the text (Ctrl+A), copy (Ctrl+C).
- In phpMyAdmin, paste into the big **SQL** box (Ctrl+V).
- Click **Go** (or **Execute**).

### 5. Check the result

- You should see a green success message.
- In the left sidebar, under **dominan1_marketing_pwa**, you should see these tables:
  - **users**
  - **clients**
  - **notes**
  - **ads**
  - **customer_contacts**
  - **post_history**
  - **templates**

---

## What the script does

- Drops the old tables (if they exist) in the right order.
- Creates all 7 tables again with the correct columns and foreign keys.
- Safe to run again if something went wrong (it will drop and recreate).

---

## If you get an error

- **“Database not found”** → Create **dominan1_marketing_pwa** in cPanel → MySQL® Databases, then run the SQL again.
- **“Access denied”** → Use the MySQL user that has **All privileges** on **dominan1_marketing_pwa** (same user as in Render env: **DB_USER** / **DB_PASSWORD**).
- **“Foreign key” error** → The script already uses `SET FOREIGN_KEY_CHECKS = 0` so this is rare; if it still happens, say which line phpMyAdmin shows and we can adjust.

After this, your Render backend (with the same DB name, user, and password in **RENDER_ENV_VARIABLES.txt**) will use these tables.
