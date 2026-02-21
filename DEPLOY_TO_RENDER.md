# Deploy Backend to Render - Complete Guide

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
- **Root Directory**: Leave empty (or `backend` if you put backend in a subfolder)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: **Free** (select from dropdown)

### 3.4: Add Environment Variables

**Click "Advanced" → "Add Environment Variable"**

**Add these one by one:**

```env
NODE_ENV=production
PORT=10000
```

**Then add your MySQL database credentials:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
```

**Then add:**

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=https://dominantlogic.tech
```

**⚠️ Important:** 
- Render's free tier MySQL might be different. You may need to:
  - Use your cPanel MySQL (if it allows external connections)
  - OR create a MySQL database on Render
  - OR use a free MySQL service like PlanetScale, Railway, or Aiven

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
