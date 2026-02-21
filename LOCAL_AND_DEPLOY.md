# Run Locally & Deploy

**Production:** The backend is already deployed on **Render**. Frontend is at **dominantlogic.tech** (e.g. cPanel). For Render env vars, re-deploys, and health check, see **DEPLOY_TO_RENDER.md**.

---

## Part 1: Run locally

### 1. Install dependencies (once)

```bash
cd c:\temp\AppCode
npm run install:all
```

### 2. Backend environment (optional for basic run)

- Copy `backend\.env.example` to `backend\.env`
- For local run you only need:
  - `USE_SQLITE=true`
  - `JWT_SECRET=any-secret-for-local`
- Add `OPENROUTER_API_KEY` (and others) when you need AI, email, SMS.

### 3. Start both servers

```bash
npm run dev
```

- **Backend:** http://localhost:3000  
- **Frontend:** http://localhost:8080 (Vue CLI default)

The frontend is configured to use `http://localhost:3000/api` when running in development (see `frontend/.env.development` and `frontend/src/store/index.js`).

### 4. Use the app

- Open http://localhost:8080
- Register a user and log in
- Create clients, notes, ads, send SMS/email (once APIs are configured in `.env`)

---

## Part 2: Deploy

### Backend (Render – already in place)

The app is set up to run the backend on **Render** with **MySQL** (not SQLite). Use the same GitHub repo with **Root directory:** `backend`.

1. **Render Web Service**  
   - [Render Dashboard](https://dashboard.render.com) → your **marketing-pwa-backend** service  
   - **Root directory:** `backend`  
   - **Build:** `npm install`  
   - **Start:** `npm start`  
   - **Health check:** `https://your-service.onrender.com/health`

2. **Environment variables (Render → Environment)**  
   When **DB_HOST** is set, the app uses **MySQL**. Do **not** set `USE_SQLITE` on Render.  
   Required: `NODE_ENV`, `PORT`, `FRONTEND_URL`, `JWT_SECRET`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and for email: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_SENDER_NAME`.  
   Full list and values: **DEPLOY_TO_RENDER.md** (§ 3.4).

3. **Redeploy**  
   Push to GitHub; Render auto-deploys. Or use Manual Deploy in the dashboard.

### Frontend (production build → your host)

1. **Point frontend to your backend**  
   Set in `frontend/.env.production`:
   ```env
   VUE_APP_API_URL=https://your-app.onrender.com/api
   ```
   (Replace with your actual Render backend URL.)

2. **Build**
   ```bash
   cd frontend
   npm run build
   ```

3. **Upload `frontend/dist/`** to your host:
   - **cPanel:** Upload contents of `dist/` to `public_html` (or site root). Add `.htaccess` for Vue Router (see DEPLOY_NOW_CHECKLIST.md).
   - **Vercel/Netlify:** Connect the repo, set root to `frontend`, build command `npm run build`, publish directory `dist`. Set env `VUE_APP_API_URL` to your Render API URL.
   - **Any static host:** Serve the contents of `dist/` as the site root; ensure SPA fallback (all routes → `index.html`).

### Quick checks after deploy

- Backend: open `https://your-backend.onrender.com` (404 on `/` is OK; try `/api/auth/login` with POST to confirm API is up).
- Frontend: open your site URL; log in and use the app; confirm no CORS or network errors in the browser console.

---

## Summary

| Task        | Command / Action                                      |
|------------|--------------------------------------------------------|
| Run locally| `npm run install:all` then `npm run dev`               |
| Backend URL (local) | `http://localhost:3000/api` (set via `.env.development`) |
| Backend URL (prod)  | Set in Render env and in `frontend/.env.production` as `VUE_APP_API_URL` |
| Deploy backend | Push to GitHub → Render Web Service → set env vars   |
| Deploy frontend | Set `VUE_APP_API_URL` → `npm run build` in `frontend` → upload `dist/` |

For more detail: **DEPLOY_TO_RENDER.md** (Render env vars, MySQL, SMTP, full steps).
