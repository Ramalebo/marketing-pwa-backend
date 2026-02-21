# Deploy Now – Checklist

Do these in order. Frontend is already built (`frontend/dist/` is ready).

---

## 1. Database (if not done yet)

- Log in to **cPanel** → **phpMyAdmin**
- Select database **`dominan1_marketing_pwa`**
- **SQL** tab → paste contents of **`backend/sql/cpanel_mysql_setup.sql`** → **Go**

---

## 2. Backend env on Render

- Go to **https://dashboard.render.com** → your **backend** service → **Environment**
- Add (or update) these. Replace placeholders with your real values.

| Key | Value |
|-----|--------|
| NODE_ENV | production |
| PORT | 10000 |
| JWT_SECRET | dominantlogic-jwt-secret-change-in-production-2024 |
| FRONTEND_URL | https://dominantlogic.tech |
| DB_HOST | 169.239.218.62 |
| DB_PORT | 3306 |
| DB_NAME | dominan1_marketing_pwa |
| DB_USER | *your cPanel MySQL username* |
| DB_PASSWORD | *your cPanel MySQL password* |
| SMTP_HOST | mail.dominantlogic.tech |
| SMTP_PORT | 465 |
| SMTP_USER | *e.g. noreply@dominantlogic.tech* |
| SMTP_PASSWORD | *email password* |
| SMTP_SENDER_NAME | Marketing Platform |

- **Save**. Render will redeploy.
- In cPanel → **Remote MySQL®**: allow Render to connect (add IP or host if required).

---

## 3. Push backend to GitHub (so Render deploys latest)

Backend repo: **https://github.com/Ramalebo/marketing-pwa-backend**

```bash
cd c:\temp\AppCode\backend
git add -A
git status
git commit -m "Deploy latest"
git push origin main
```

Render will redeploy from GitHub when you push to `main`. (`.env` is not pushed; set variables in Render.)

---

## 4. Upload frontend

- **cPanel** → **File Manager** → go to **`public_html`** (folder for https://dominantlogic.tech)
- Upload **all contents** of **`c:\temp\AppCode\frontend\dist\`**
  - Upload the **contents** (index.html, js/, css/, .htaccess, etc.), not the `dist` folder
  - Overwrite when asked
- Ensure **`.htaccess`** is there (for SPA routing)

---

## 5. Test

- Open **https://dominantlogic.tech**
- Try: Dashboard, Clients, add a client, any dropdown

---

**Backend URL used by frontend:** `https://marketing-pwa-backend.onrender.com/api`  
To change it: edit `frontend/.env.production` → `VUE_APP_API_URL=...` → run `npm run build` again → re-upload `dist/`.
