# What to Do Next – Step-by-Step Guide

Follow these steps in order. Tick each when done.

---

## Step 1: Set up the database tables (once)

1. Log in to **cPanel** (where your site and MySQL live).
2. Open **phpMyAdmin**.
3. In the left panel, click the database **`dominan1_marketing_pwa`**.
4. Click the **SQL** tab.
5. Open the file **`backend/sql/cpanel_mysql_setup.sql`** from this project.
6. Copy **all** its contents and paste into the SQL box in phpMyAdmin.
7. Click **Go**.
8. If it runs without errors, the tables are ready. You only need to do this once (or when you want to reset the database).

---

## Step 2: Add environment variables on Render

1. Go to **https://dashboard.render.com** and sign in.
2. Click your **backend service** (the Node API for this app).
3. In the left menu, click **Environment**.
4. Add **each** variable below. Click **Add Environment Variable** and enter **Key** and **Value**. Replace the placeholders with your real values.

**Required (copy these):**

| Key | Value |
|-----|--------|
| NODE_ENV | production |
| PORT | 10000 |
| JWT_SECRET | dominantlogic-jwt-secret-change-in-production-2024 |
| FRONTEND_URL | https://dominantlogic.tech |
| DB_HOST | 169.239.218.62 |
| DB_PORT | 3306 |
| DB_NAME | dominan1_marketing_pwa |
| DB_USER | *(your cPanel MySQL username, e.g. dominan1_xxxxx)* |
| DB_PASSWORD | *(your cPanel MySQL password)* |

**Domain email (so the app sends from your domain):**

| Key | Value |
|-----|--------|
| SMTP_HOST | mail.dominantlogic.tech |
| SMTP_PORT | 465 |
| SMTP_USER | *(your full email, e.g. noreply@dominantlogic.tech)* |
| SMTP_PASSWORD | *(password for that email)* |
| SMTP_SENDER_NAME | Marketing Platform |

5. Click **Save Changes**. Render will redeploy the backend automatically.
6. **Do not** add `USE_SQLITE` when using MySQL (Option B).

**Note:** In cPanel → **Remote MySQL®**, add Render’s outbound IP (or allow the host that connects) so Render can connect to your MySQL at 169.239.218.62. If you’re not sure how, ask your host (Domains.co.za) how to allow remote MySQL access for an external service.

---

## Step 3: Push the latest backend to GitHub (if you changed code)

1. Open a terminal in the project folder.
2. Run:
   ```bash
   cd c:\temp\AppCode\backend
   git add -A
   git status
   git commit -m "Domain email SMTP, optional auth, MySQL setup"
   git push origin main
   ```
3. If your Render service is connected to this GitHub repo, it will deploy the new code after the push.

---

## Step 4: Build the frontend

1. In the project folder, run:
   ```bash
   cd c:\temp\AppCode\frontend
   npm run build
   ```
2. Wait until it finishes. The built files will be in **`frontend/dist/`**.

---

## Step 5: Upload the frontend to your server (cPanel)

1. Log in to **cPanel** (same place as your domain and MySQL).
2. Open **File Manager** and go to **`public_html`** (or the folder that serves your site **https://dominantlogic.tech**).
3. Upload **all the contents** of the **`frontend/dist/`** folder into that folder.
   - Upload the **contents** (index.html, js/, css/, .htaccess, etc.), not the `dist` folder itself.
   - Overwrite existing files when asked.
4. Make sure **`.htaccess`** is present in the same folder (it should be inside `dist/` and will be uploaded with the rest). It is needed for the app’s routes to work.

---

## Step 6: Test the live app

1. Open **https://dominantlogic.tech** in your browser.
2. You should see the app without a login screen (dashboard or similar).
3. Try:
   - Creating a client
   - Sending an email (to test domain email)
   - Using another feature you care about
4. If something fails, open the browser **Developer Tools** (F12) → **Console** and **Network** tabs and check for red errors. For “cannot connect” or “network error”, the frontend may be pointing to the wrong backend URL (see below).

---

## If the app can’t reach the backend

- The frontend is built with **`VUE_APP_API_URL=https://marketing-pwa-backend.onrender.com/api`** (in `frontend/.env.production`).
- If your backend URL is different, edit **`frontend/.env.production`**, set:
  ```env
  VUE_APP_API_URL=https://YOUR_ACTUAL_BACKEND_URL/api
  ```
  then run **Step 4** again and **Step 5** again (rebuild and re-upload).

---

## Quick checklist

- [ ] Step 1: Run `cpanel_mysql_setup.sql` in phpMyAdmin on `dominan1_marketing_pwa`
- [ ] Step 2: Add all environment variables on Render (DB_*, SMTP_*, etc.)
- [ ] Step 3: Push backend to GitHub (if you have new code)
- [ ] Step 4: Run `npm run build` in `frontend`
- [ ] Step 5: Upload contents of `frontend/dist/` to `public_html`
- [ ] Step 6: Test https://dominantlogic.tech

After that, your app should be live with MySQL and domain email.
