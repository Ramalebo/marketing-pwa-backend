# Deploy Now – Checklist

## Backend (Render) – Done

- **Pushed to GitHub:** `marketing-pwa-backend` → `main` (commit: SQLite support + deploy config).
- **Render** will auto-deploy from GitHub. Check: https://dashboard.render.com → your service → **Logs**.

### Render environment variables (set in Dashboard → Environment)

If using **SQLite** (no FreeSQLDatabase):

| Key | Value |
|-----|--------|
| `USE_SQLITE` | `true` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | (your secret) |
| `FRONTEND_URL` | `https://dominantlogic.tech` |

Remove or leave unset: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

If using **MySQL** (FreeSQLDatabase): leave `USE_SQLITE` unset and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` as before.

Optional: `OPENROUTER_API_KEY`, `MAILTRAP_API_TOKEN`, `SMS_PROVIDER_*` (see QUICK_SETUP_CHECKLIST.txt).

---

## Frontend (cPanel) – Your step

1. **Upload** the contents of **`frontend/dist/`** to cPanel **File Manager** → **`public_html`** (or your site root).
2. **Overwrite** existing files when prompted.
3. Ensure **`.htaccess`** is in `public_html` (for Vue Router). If missing, add:
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
4. **Test:** https://dominantlogic.tech — register/login and use the app.

---

## Quick verify

- Backend: https://marketing-pwa-backend.onrender.com (or your Render URL) — should respond (e.g. 404 on `/` is OK; API routes should work).
- Frontend: https://dominantlogic.tech — loads, no console errors, API calls go to Render.

---

**Backend URL in frontend:** Already set in `frontend/.env.production`:  
`VUE_APP_API_URL=https://marketing-pwa-backend.onrender.com/api`  
No change needed unless your Render URL is different.
