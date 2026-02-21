# Run Locally & Deploy

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

### Backend (Render)

1. **Push backend to GitHub**  
   Use a repo that contains the **backend** (e.g. `backend/` as root, or your full AppCode with Render set to use `backend` as root).

2. **Create a Web Service on Render**  
   - [Render Dashboard](https://dashboard.render.com) → New → Web Service  
   - Connect the GitHub repo  
   - **Root directory:** `backend` (if repo is full app) or leave blank if repo is backend-only  
   - **Build:** `npm install`  
   - **Start:** `npm start`  
   - **Plan:** Free  

3. **Environment variables (Render → Environment)**  
   Minimum for SQLite:

   | Key           | Value                          |
   |---------------|---------------------------------|
   | `USE_SQLITE`  | `true`                          |
   | `NODE_ENV`    | `production`                    |
   | `PORT`        | `10000`                         |
   | `JWT_SECRET`  | *(long random secret)*          |
   | `FRONTEND_URL`| `https://your-frontend-domain.com` |

   Remove any MySQL vars (`DB_HOST`, `DB_USER`, etc.) if using SQLite only.  
   Add `OPENROUTER_API_KEY`, `MAILTRAP_*`, `SMS_PROVIDER_*` etc. as needed (see `backend/.env.example`).

4. **Deploy**  
   Render will build and start the service. Note the backend URL (e.g. `https://your-app.onrender.com`).

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

For more detail: `DEPLOY_NOW_CHECKLIST.md`, `DEPLOY_TO_RENDER.md`, `RENDER_SQLITE_ENV_STEPS.md`.
