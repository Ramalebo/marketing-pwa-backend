# Where to Put Variables & What to Change to Deploy

## 1. Backend variables – where they go

### Option A: Backend on **Render** (recommended)

You do **not** create a `.env` file on Render. You set variables in the **Render Dashboard**:

1. Go to [dashboard.render.com](https://dashboard.render.com) → your **backend service**.
2. Click **Environment** in the left sidebar.
3. Add each variable below (Key + Value). Click **Save** after adding/editing.

**Required for Render:**

| Key | Value | Notes |
|-----|--------|--------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render sets this; 10000 is typical on free tier. |
| `JWT_SECRET` | *(long random string)* | e.g. 32+ characters, keep secret. |
| `FRONTEND_URL` | `https://dominantlogic.tech` | Your live frontend URL (for CORS). |

**If using cPanel MySQL (your `dominan1_marketing_pwa`):**

| Key | Value |
|-----|--------|
| `DB_HOST` | `localhost` or the **remote MySQL host** cPanel gives you (e.g. `cp62.domains.co.za`). |
| `DB_PORT` | `3306` |
| `DB_NAME` | `dominan1_marketing_pwa` |
| `DB_USER` | Your cPanel MySQL username (e.g. `dominan1_xxxxx`) |
| `DB_PASSWORD` | Your cPanel MySQL password |

- **Do not set** `USE_SQLITE` (or set `USE_SQLITE=false`) when using MySQL.

**If using SQLite on Render (no MySQL):**

| Key | Value |
|-----|--------|
| `USE_SQLITE` | `true` |

- **Do not set** `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (or remove them).

**Optional (add when you need the feature):**

| Key | Example value |
|-----|----------------|
| `OPENROUTER_API_KEY` | From openrouter.ai |
| `MAILTRAP_API_TOKEN` | From mailtrap.io |
| `MAILTRAP_SENDER_EMAIL` | noreply@yourdomain.com |
| `SMS_PROVIDER_USERNAME` | From SMS Provider |
| `SMS_PROVIDER_PASSWORD` | |
| `SMS_PROVIDER_SENDER` | Sender ID |

---

### Option B: Backend runs **locally** or on **your own server**

Put variables in a file:

**File:** `backend/.env`  
(Copy from `backend/.env.example` and fill in values.)

- Never commit `.env` to Git (it should be in `.gitignore`).
- Same variable names as in the table above; use your real DB credentials and URLs.

---

## 2. Frontend variables – where they go

The frontend only needs **one** variable for deploy: the backend API URL.

**File:** `frontend/.env.production`

```env
VUE_APP_API_URL=https://YOUR_BACKEND_URL/api
```

**What to change:**

- If backend is on **Render**:  
  `VUE_APP_API_URL=https://marketing-pwa-backend.onrender.com/api`  
  (or your actual Render backend URL + `/api`.)
- If backend is on **your server**:  
  `VUE_APP_API_URL=https://api.yourdomain.com/api`  
  (use your real backend URL.)

This file is read at **build time**. After you change it, you must run **`npm run build`** again in the frontend folder.

---

## 3. What must change to deploy

### Backend

| Item | Change |
|------|--------|
| **Code** | Push latest backend to GitHub (Render deploys from there). |
| **Variables** | Set in **Render → Environment** (see table above). No `.env` on Render. |
| **Database** | Either: (1) **MySQL** – set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and do **not** set `USE_SQLITE`, or (2) **SQLite** – set `USE_SQLITE=true` and leave MySQL vars unset. |
| **Tables** | If using cPanel MySQL, run `backend/sql/cpanel_mysql_setup.sql` in phpMyAdmin on `dominan1_marketing_pwa` once. |

### Frontend

| Item | Change |
|------|--------|
| **API URL** | Set `VUE_APP_API_URL` in **`frontend/.env.production`** to your live backend URL + `/api`. |
| **Build** | Run `cd frontend && npm run build`. |
| **Upload** | Upload the **contents** of **`frontend/dist/`** to your web root (e.g. cPanel `public_html`). |

---

## 4. Deploy steps (short)

1. **Backend**
   - Set **Environment** variables on Render (see section 1).
   - If using cPanel MySQL: run **`backend/sql/cpanel_mysql_setup.sql`** in phpMyAdmin on **`dominan1_marketing_pwa`**.
   - Push backend to GitHub; Render will deploy. Copy the backend URL (e.g. `https://xxx.onrender.com`).

2. **Frontend**
   - In **`frontend/.env.production`** set:
     ```env
     VUE_APP_API_URL=https://YOUR_BACKEND_URL/api
     ```
   - Run: `cd frontend && npm run build`.
   - Upload everything inside **`frontend/dist/`** to **`public_html`** (or your site root).

3. **Check**
   - Backend: open `https://YOUR_BACKEND_URL` (404 is OK).
   - Frontend: open `https://dominantlogic.tech` (or your URL), use the app, check browser console for errors.

---

## 5. Quick reference

| Variable / file | Where to put it | When it’s used |
|-----------------|------------------|----------------|
| Backend (DB, JWT, etc.) | **Render Dashboard → Environment** (or `backend/.env` on your server) | When the backend starts and on each request. |
| `VUE_APP_API_URL` | **`frontend/.env.production`** | At **build** time; then upload `frontend/dist/`. |
| Database tables | Run **`backend/sql/cpanel_mysql_setup.sql`** in **phpMyAdmin** on **`dominan1_marketing_pwa`** | Once before first deploy (or when resetting DB). |

After you set the variables and run the SQL (if using MySQL), push backend and build + upload frontend as above to complete deploy.
