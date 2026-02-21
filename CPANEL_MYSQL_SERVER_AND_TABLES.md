# cPanel MySQL: Server Name and Table Setup

## Where you see the server name

In **phpMyAdmin** (your screenshot):

- At the top it says **"Server: localhost:3306"** – that is your MySQL server.
- **Server name** = `localhost` (or `127.0.0.1`)
- **Port** = `3306`
- **Database** = `dominan1_marketing_pwa` (from the left panel)

So for your app, the “server” is **localhost** when the backend runs on the **same** cPanel server. When the backend runs **off** cPanel (e.g. on Render), you use the **remote MySQL host** (see below).

---

## 1. Create the tables in phpMyAdmin

1. In the **left panel**, click the database **`dominan1_marketing_pwa`**.
2. Open the **SQL** tab.
3. Copy the contents of **`backend/sql/cpanel_mysql_setup.sql`** and paste into the query box.
4. Click **Go** to run the script.

That creates (or replaces) all tables: `users`, `clients`, `notes`, `ads`, `customer_contacts`, `post_history`, `templates`.

---

## 2. Backend .env when backend runs on the SAME cPanel server

If your Node backend runs on the same hosting as cPanel (e.g. Node.js on cPanel):

In **`backend/.env`** use (replace with your real MySQL user and password from cPanel):

```env
# Do NOT set USE_SQLITE (or set USE_SQLITE=false) so the app uses MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_xxxxx
DB_PASSWORD=your_mysql_password_from_cpanel
```

- **DB_HOST** = **localhost** (same as “Server: localhost” in phpMyAdmin).
- **DB_USER** / **DB_PASSWORD** = the MySQL user you created in cPanel for this database (e.g. in “MySQL® Databases” → “MySQL Users” and “Add User To Database”).

---

## 3. Backend .env when backend runs elsewhere (e.g. Render)

If the backend runs on **Render** or another server:

1. In cPanel go to **“Remote MySQL®”** (or “Remote Database Access”).
2. Add the **external IP or host** that will connect (e.g. Render’s outbound IP or host they give you).
3. Use the **remote** host in `.env`, for example:
   - Sometimes cPanel shows a host like: `localhost` (only if the app is on the same server), or  
   - A hostname like: `cp62.domains.co.za` or `yourdomain.com` (use what cPanel shows for “Remote MySQL” / “Host”).

Then in **`backend/.env`** on Render:

```env
DB_HOST=cp62.domains.co.za
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_xxxxx
DB_PASSWORD=your_mysql_password
```

(Replace `cp62.domains.co.za` with the actual remote MySQL host shown in your cPanel.)

---

## Summary

| In phpMyAdmin        | For backend .env (same server) | For backend .env (e.g. Render)   |
|---------------------|---------------------------------|-----------------------------------|
| Server: localhost:3306 | `DB_HOST=localhost`            | Use “Remote MySQL” host from cPanel |
| Database: dominan1_marketing_pwa | `DB_NAME=dominan1_marketing_pwa` | Same |
| Your MySQL user     | `DB_USER=dominan1_xxxxx`       | Same |
| Your MySQL password | `DB_PASSWORD=...`               | Same |

Tables: run **`backend/sql/cpanel_mysql_setup.sql`** in phpMyAdmin on **`dominan1_marketing_pwa`** once to create all tables.
