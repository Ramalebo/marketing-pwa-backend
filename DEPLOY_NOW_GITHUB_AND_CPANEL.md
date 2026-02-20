# Deploy Now – GitHub + cPanel

## ✅ GitHub – push to both branches
Latest code is on:
**https://github.com/Ramalebo/marketing-pwa-backend**
- Branches: **master** and **main** (both kept in sync).
- To push future changes to both: run **`npm run push`** (from project root).
- Render: use branch **main** or **master**; both have the same code.

---

## 📤 cPanel – Upload frontend (dominantlogic.tech)

Your **backend** runs on **Render**. Your **frontend** is static files you upload to cPanel so https://dominantlogic.tech serves the app.

### 0. Build and zip (on your PC)
From project root run:
```bash
npm run deploy:cpanel
```
This builds the frontend and creates **`dist-cpanel.zip`** at the project root.

### 1. Built frontend location (on your PC)
- **Folder:** `c:\temp\AppCode\frontend\dist\` – upload the **contents** of this folder to public_html.
- **Zip (easier):** `c:\temp\AppCode\dist-cpanel.zip` – upload to public_html, then in cPanel right‑click → **Extract**, then delete the zip.

### 2. In cPanel
1. Log in to cPanel (e.g. domains.co.za).
2. Open **File Manager** → go to **public_html** (or the folder your domain uses).
3. **Optional:** Backup: select all → Compress → name e.g. `backup-public_html.zip`.
4. **Delete** everything inside `public_html` (or the contents of the folder your domain points to).
5. **Upload** the **contents** of `frontend\dist\` into `public_html`:
   - Upload **index.html** (in root of public_html).
   - Upload **js/** folder (with all files inside).
   - Upload **css/** folder.
   - Upload **fonts/** folder.
   - Upload **logo.png**, **manifest.json**, **service-worker.js**, **workbox-*.js**.
   - Upload **.htaccess** (from dist – needed for Vue Router).

**Or faster:** Zip the **contents** of `frontend\dist` (not the dist folder itself), upload the zip to public_html, then in cPanel right‑click the zip → **Extract** → delete the zip.

### 3. .htaccess (Vue Router)
Ensure `public_html` has a `.htaccess` with:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
Your `frontend\dist` build already includes an `.htaccess` – upload it with the rest.

### 4. Check
- Open **https://dominantlogic.tech** – the app should load.
- App calls the API at **https://marketing-pwa-backend.onrender.com/api** (set in frontend `.env.production` at build time).

---

## Backend (Render)
- Backend is already on Render; it redeploys when you push to GitHub (if Render is connected to the repo).
- Env vars (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SMTP_*, etc.) are set in **Render → Your service → Environment**.
- Do **not** set USE_SQLITE on Render; with DB_HOST set it uses MySQL.

### Fix: "Cannot find module .../src/server.js"
The server lives in **backend/** not **src/**. In Render Dashboard:
1. Open your **Web Service** → **Settings**.
2. Set **Root Directory** to **`backend`** (not `src`, not empty).
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Save and trigger **Manual Deploy**.  
The repo root also has a **render.yaml** so Blueprint deploys use `rootDir: backend`.

---

## Quick recap
| Step            | Where        | Action |
|-----------------|-------------|--------|
| GitHub          | Done        | Code pushed to master |
| Frontend (cPanel)| public_html | Upload contents of `frontend\dist` |
| Backend         | Render      | Auto from GitHub or manual deploy |
| API URL         | Already set | Frontend build uses Render API URL |
