# Deploy Backend to Render - Complete Guide

**Render is already in place.** Use this doc to check env vars, redeploy, or set up a new Render service. Health check: `https://<your-service>.onrender.com/health`.

## 🚀 Deploy now (quick)

1. **Push code to GitHub** (this repo; branch `main` or `master`).
2. **Render** → New → **Web Service** → Connect this repo.
3. **Settings:** Root Directory = `backend`, Build = `npm install`, Start = `npm start`.
4. **Environment:** Add all variables from the table in § 3.4 (DB_*, SMTP_*, FRONTEND_URL, JWT_SECRET, etc.).
5. **Create Web Service** – Render will build and deploy. Health check: `https://your-service.onrender.com/health`.
6. **Frontend:** Set `VUE_APP_API_URL=https://your-service.onrender.com/api` in `frontend/.env.production`, run `npm run build` in `frontend`, then upload `frontend/dist` to your host (e.g. cPanel at dominantlogic.tech).
7. **SQL:** Run migrations on your MySQL database once (see **Step 4.5**). To apply **all changes** (campaign/AdFlow columns, dashboard, outdoor, beacons) in one go, run `backend/sql/deploy_all_migrations.sql`.

### Redeploy after code changes

1. **Push** your latest code to the same branch (e.g. `main`) that Render uses. Render will auto-deploy.
2. **If this release adds new DB tables/columns:** Run the SQL migrations (Step 4.5). Use **`backend/sql/deploy_all_migrations.sql`** to apply all changes (campaign columns, dashboard, outdoor, beacons) in one go; safe to run (skips existing columns/tables if you use `--force` or run sections).
3. **Frontend:** If you changed the frontend, run `cd frontend && npm run build` and upload `frontend/dist` to cPanel.

---

## 🎯 Goal
Deploy your Node.js backend to Render (FREE) so it actually runs, then update your frontend to use it.

**Why Render?**
- ✅ FREE tier available
- ✅ Automatic deployments
- ✅ Built-in SSL
- ✅ No credit card required
- ✅ Runs Node.js properly

---

## 📋 Prerequisites

1. **GitHub account** (free) - Render connects to GitHub
2. **Render account** (free) - Sign up at https://render.com
3. **Your backend code** ready to deploy

---

## 🚀 Step 1: Prepare Backend for Render

### 1.1: Update server.js for Render

**Render provides the PORT automatically, so we need to adjust:**

The current `server.js` is fine, but we should remove the frontend serving part since frontend stays on cPanel.

### 1.2: Update package.json

**Make sure `package.json` has a start script:**

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

**Already correct! ✅**

### 1.3: Update CORS Settings

**We need to allow your frontend domain. Check `server.js`:**

Currently uses `app.use(cors())` which allows all origins. For production, we should be more specific, but for now this works.

---

## 📤 Step 2: Push Backend to GitHub

### 2.1: Create GitHub Repository

1. **Go to** https://github.com/new
2. **Repository name**: `marketing-pwa-backend` (or any name)
3. **Visibility**: Private (recommended) or Public
4. **DO NOT** initialize with README, .gitignore, or license
5. **Click** "Create repository"

### 2.2: Initialize Git in Backend Folder

**On your local machine:**

```bash
cd backend
git init
git add .
git commit -m "Initial commit - backend for Render"
```

### 2.3: Connect to GitHub

**Copy the commands from GitHub** (they'll show after creating repo):

```bash
git remote add origin https://github.com/YOUR_USERNAME/marketing-pwa-backend.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## 🌐 Step 3: Deploy to Render

### 3.1: Sign Up / Log In to Render

1. **Go to** https://render.com
2. **Click** "Get Started for Free"
3. **Sign up** with GitHub (easiest way)

### 3.2: Create New Web Service

1. **In Render dashboard**, click **"New +"**
2. **Select** **"Web Service"**
3. **Connect your GitHub repository**:
   - Click "Connect account" if not connected
   - Select your `marketing-pwa-backend` repository
   - Click "Connect"

### 3.3: Configure Web Service

**Fill in these settings:**

- **Name**: `marketing-pwa-backend` (or any name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend` (this repo has frontend + backend; Render must run from `backend`)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free** (select from dropdown)

### 3.4: Add Environment Variables

**Click "Environment" in the left sidebar (or "Advanced" → "Add Environment Variable").**

**Required – add these (use your real values where indicated):**

| Key | Value | Notes |
|-----|--------|------|
| `NODE_ENV` | `production` | |
| `PORT` | `10000` | Render sets this automatically; add if missing |
| `FRONTEND_URL` | `https://dominantlogic.tech` | For CORS |
| `JWT_SECRET` | (choose a long random string) | e.g. `openssl rand -hex 32` |
| `DB_HOST` | `169.239.218.62` | Your MySQL host |
| `DB_PORT` | `3306` | |
| `DB_NAME` | `dominan1_marketing_pwa` | |
| `DB_USER` | `dominan1_Onka` | |
| `DB_PASSWORD` | (your MySQL password) | |
| `SMTP_HOST` | `mail.dominantlogic.tech` | For email |
| `SMTP_PORT` | `465` | |
| `SMTP_USER` | `info@dominantlogic.tech` | |
| `SMTP_PASSWORD` | (your email password) | |
| `SMTP_SENDER_NAME` | `dominant logic` | Display name for sent emails |

**Do not set `USE_SQLITE`** on Render. When `DB_HOST` is set, the app uses MySQL.

**Optional:** `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (AI features); `SMS_PROVIDER_*` (SMS); Facebook/Meta vars for social posting.

### 3.5: Create the Service

1. **Click** "Create Web Service"
2. **Wait** 5-10 minutes for first deployment
3. **You'll see** build logs in real-time

### 3.6: Get Your Backend URL

**After deployment succeeds:**

1. **You'll see** a URL like: `https://marketing-pwa-backend.onrender.com`
2. **Copy this URL** - this is your backend API URL!
3. **Test it**: Visit `https://your-backend-url.onrender.com/api` (should show error or JSON)

---

## 🔧 Step 4: Fix Database Connection

### Option A: Use cPanel MySQL (If Allowed)

**If your cPanel MySQL allows external connections:**

1. **In cPanel**, go to "Remote MySQL"
2. **Add** Render's IP addresses (check Render docs)
3. **OR** add `%` to allow all (less secure but works)

**Update DB_HOST in Render:**
- Change `DB_HOST=localhost` to your cPanel MySQL host
- Usually: `domains.co.za` or an IP address

### Option B: Use Render's MySQL (Recommended)

1. **In Render**, click "New +" → "PostgreSQL" (or MySQL if available)
2. **Create** free database
3. **Update** environment variables in your web service:
   - `DB_HOST` = from database connection string
   - `DB_PORT` = from connection string
   - `DB_NAME` = from connection string
   - `DB_USER` = from connection string
   - `DB_PASSWORD` = from connection string
4. **Run** your schema SQL in the new database

### Option C: Use Free MySQL Service

**Use PlanetScale, Railway, or Aiven:**

1. **Sign up** for free MySQL
2. **Create** database
3. **Get** connection string
4. **Update** environment variables in Render
5. **Run** your schema SQL

### 3.7: DB_ALTER (optional)

On Render you can set **`DB_ALTER=1`** so Sequelize runs `sync({ alter: true })` and adds missing columns/tables on startup. If you prefer to manage schema yourself, leave it unset and run SQL migrations manually (see § 4.5).

---

## 📜 Step 4.5: Run SQL migrations (when you add new features)

When you deploy code that adds **new tables or columns**, run the matching SQL on your MySQL database once.

**Where to run:** cPanel → phpMyAdmin (select your DB) or any MySQL client connected to your production DB.

### Recommended: one script for all changes

**`backend/sql/deploy_all_migrations.sql`** – applies everything in order:

1. **Campaign / AdFlow columns** on `ads`: campaign, adset, platform, format, placement, ad_type, cta, headline, destination_url  
2. **Dashboard columns** on `ads`: channel, reach, engagement, spend  
3. **Outdoor / display columns** on `ads`: display_type, location, size, period, impressions_per_day, start_date, end_date  
4. **Beacon tables**: `beacons`, `beacon_events` (proximity marketing)

**How to run:**

1. Open phpMyAdmin, select your database (e.g. `dominan1_marketing_pwa`).
2. Click **Import** or **SQL**.
3. Paste the contents of `backend/sql/deploy_all_migrations.sql` (or upload the file).
4. Execute. If you get **Duplicate column** on some lines (columns already exist), either run the rest of the script from that point, or from the command line run: `mysql -u user -p dbname --force < deploy_all_migrations.sql` so it continues on error.

### Individual scripts (optional)

| Script | Purpose |
|--------|--------|
| `deploy_all_migrations.sql` | **All of the below in one file** (campaign + dashboard + outdoor + beacons). |
| `add_ad_platform_columns.sql` | Campaign/AdFlow columns only (campaign, headline, destination_url, etc.). |
| `add_dashboard_columns.sql` | channel, reach, engagement, spend. |
| `add_outdoor_columns.sql` | display_type, location, size, period, etc. |
| `add_beacon_tables.sql` | Creates `beacons` and `beacon_events`. |

**Alternative:** If you set **`DB_ALTER=1`** in Render, Sequelize can create new tables on deploy; you may still need to run the ads column migrations once if the ads table was created before those columns existed.

---

## 🎨 Step 5: Update Frontend to Use Render Backend

### 5.1: Update .env.production

**In your local `frontend/.env.production`:**

```env
VUE_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url` with your actual Render URL!**

### 5.2: Rebuild Frontend

```bash
cd frontend
npm run build
```

### 5.3: Upload New Frontend to cPanel

1. **Upload** the new `dist/` folder contents to `/public_html/`
2. **Replace** old files
3. **Keep** `.htaccess` (but remove API proxy rules - not needed anymore)

### 5.4: Update .htaccess (Remove API Proxy)

**Since backend is on Render, remove the API proxy:**

**In `/public_html/.htaccess`, remove or comment out:**

```apache
# Remove these lines - not needed anymore
# RewriteCond %{REQUEST_URI} ^/api
# RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

**Keep only the frontend routing:**

```apache
# Frontend routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ✅ Step 6: Test Everything

### 6.1: Test Backend

1. **Visit**: `https://your-backend-url.onrender.com/api`
2. **Should see**: Error or JSON response (not 503!)

### 6.2: Test Frontend

1. **Visit**: `https://dominantlogic.tech`
2. **Try** to register/login
3. **Check** browser console for errors
4. **Should work** now! 🎉

---

## 🔍 Troubleshooting

### Backend Shows "Application Error"

**Check Render logs:**
1. **In Render**, click your service
2. **Click** "Logs" tab
3. **Look for** error messages
4. **Common issues**:
   - Missing environment variables
   - Database connection failed
   - Port not set correctly

### Frontend Can't Connect to Backend

**Check:**
1. **CORS** - Backend should allow your frontend domain
2. **API URL** - Verify `.env.production` has correct Render URL
3. **Rebuild** frontend after changing `.env.production`

### Database Connection Failed

**Check:**
1. **Environment variables** in Render are correct
2. **Database** is accessible from Render (not localhost-only)
3. **Schema** is run in the database

---

## 📋 Quick Checklist

- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Environment variables added to Render
- [ ] **SQL migrations run** (e.g. `deploy_all_migrations.sql` for campaign + beacons + all columns)
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Database connection working
- [ ] Frontend `.env.production` updated
- [ ] Frontend rebuilt
- [ ] Frontend uploaded to cPanel
- [ ] `.htaccess` updated (removed API proxy)
- [ ] Tested registration/login

---

## 🎯 What You'll Have After This

**Frontend**: `https://dominantlogic.tech` (on cPanel)
**Backend**: `https://your-backend.onrender.com` (on Render)
**Database**: MySQL (on cPanel or Render)

**This is how 90% of production apps work!** ✅

---

## 🆘 Need Help?

**If you get stuck:**
1. **Check Render logs** for backend errors
2. **Check browser console** for frontend errors
3. **Share** the error message and I'll help fix it!

**Let's get your backend running! 🚀**
