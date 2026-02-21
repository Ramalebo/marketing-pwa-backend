# Deploy to Server – Step-by-Step

Follow these steps to get the app live. You need: **backend** (API) and **frontend** (what users open in the browser).

---

## Part 1: Backend (API server)

### Option A – Deploy backend to Render (recommended, free tier)

1. **Push your code to GitHub**
   - Create a repo (e.g. `marketing-pwa` or `marketing-pwa-backend`).
   - If the repo contains both `frontend` and `backend`:
     - In Render you’ll set **Root Directory** to `backend`.
   - Push your code:
     ```bash
     cd c:\temp\AppCode
     git add .
     git commit -m "Deploy backend and frontend"
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
     git push -u origin main
     ```

2. **Create a Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
   - Connect your GitHub repo.
   - **Root Directory:** `backend` (if your repo is the full AppCode folder).
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

3. **Set environment variables** (Render → your service → **Environment**)

   | Key | Value |
   |-----|--------|
   | `USE_SQLITE` | `true` |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `JWT_SECRET` | *(pick a long random string, e.g. 32+ characters)* |
   | `FRONTEND_URL` | `https://your-domain.com` *(your frontend URL)* |

   Remove any MySQL variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`) if you use SQLite only.

   Optional (for AI, email, SMS):  
   `OPENROUTER_API_KEY`, `MAILTRAP_API_TOKEN`, `MAILTRAP_SENDER_EMAIL`, `SMS_PROVIDER_USERNAME`, `SMS_PROVIDER_PASSWORD`, `SMS_PROVIDER_SENDER` (see `backend/.env.example`).

4. **Deploy**
   - Click **Create Web Service**. Render will build and start the backend.
   - Copy your backend URL, e.g. `https://your-app-name.onrender.com`.

---

### Option B – Deploy backend on your own server (VPS/cPanel Node)

1. Upload the **`backend`** folder to the server (e.g. via FTP/SFTP or Git).
2. On the server:
   ```bash
   cd backend
   npm install --production
   ```
3. Create `backend/.env` with the same variables as in Option A (at least `USE_SQLITE`, `NODE_ENV`, `PORT`, `JWT_SECRET`, `FRONTEND_URL`).
4. Run the backend (e.g. with PM2 or your host’s Node runner):
   ```bash
   node server.js
   ```
   Or use PM2: `pm2 start server.js --name marketing-api`
5. Note your backend URL, e.g. `https://api.yourdomain.com` or `https://yourdomain.com:3000`.

---

## Part 2: Frontend (static site)

### 1. Set the API URL

Edit **`frontend/.env.production`** and set your **backend API URL**:

```env
VUE_APP_API_URL=https://YOUR_BACKEND_URL/api
```

Examples:
- Render: `VUE_APP_API_URL=https://marketing-pwa-backend.onrender.com/api`
- Your server: `VUE_APP_API_URL=https://api.yourdomain.com/api`

### 2. Build the frontend

From the project root:

```bash
cd c:\temp\AppCode\frontend
npm run build
```

The built files will be in **`frontend/dist/`**.

### 3. Upload frontend to your server

**If using cPanel / Apache (e.g. dominantlogic.tech):**

1. Open **File Manager** → go to `public_html` (or your site root).
2. Upload **all contents** of `frontend/dist/` into that folder (overwrite when asked).
3. Ensure **`.htaccess`** is present in the same folder (it’s in `frontend/public/.htaccess` and is copied into `dist/` when you build). If you built before adding it, copy `frontend/public/.htaccess` into `public_html` manually. It should contain:

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

**If using Nginx:**  
Use a try_files rule so all routes serve `index.html` (Vue Router SPA). Example:

```nginx
location / {
  root /path/to/dist;
  try_files $uri $uri/ /index.html;
}
```

**If using Vercel / Netlify:**  
Connect the repo, set **Root** to `frontend`, **Build command** to `npm run build`, **Publish directory** to `dist`, and add env var `VUE_APP_API_URL` = your backend API URL.

---

## Part 3: Check after deploy

1. **Backend**
   - Open `https://YOUR_BACKEND_URL` → 404 or “Cannot GET /” is normal.
   - Test login: e.g. POST `https://YOUR_BACKEND_URL/api/auth/login` with `{ "email": "test@test.com", "password": "test" }` (or use the frontend).

2. **Frontend**
   - Open your site URL (e.g. `https://dominantlogic.tech`).
   - Register / log in and use the app. In the browser console (F12) there should be no CORS or network errors.

3. **CORS**
   - Backend already allows `FRONTEND_URL`. Ensure `FRONTEND_URL` in the backend env matches your frontend URL exactly (e.g. `https://dominantlogic.tech`).

---

## Quick reference

| Step | Action |
|------|--------|
| 1 | Push code to GitHub (repo with `backend` folder) |
| 2 | Render: New Web Service → Root `backend` → set env vars → Deploy |
| 3 | Set `frontend/.env.production` → `VUE_APP_API_URL=https://YOUR_BACKEND_URL/api` |
| 4 | Run `cd frontend && npm run build` |
| 5 | Upload contents of `frontend/dist/` to `public_html` (and `.htaccess` if needed) |
| 6 | Test site and API |

Your production build is in **`frontend/dist/`** and is ready to upload after you set `VUE_APP_API_URL` and run `npm run build` in `frontend`.
