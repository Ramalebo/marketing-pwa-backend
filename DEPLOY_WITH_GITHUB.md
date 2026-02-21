# Deploy to Render with GitHub - Simple Guide

## 🎯 Goal
Deploy your backend to Render using GitHub (easiest method!)

---

## 📋 Prerequisites

1. **GitHub account** (free) - Sign up at https://github.com if needed
2. **Render account** (free) - Sign up at https://render.com
3. **Your backend code** ready

---

## 🚀 Step 1: Create GitHub Repository

### 1.1: Go to GitHub

1. **Go to** https://github.com/new
2. **Repository name**: `marketing-pwa-backend` (or any name you like)
3. **Visibility**: 
   - **Private** (recommended - only you can see it)
   - **Public** (anyone can see it)
4. **DO NOT** check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. **Click** "Create repository"

---

## 📤 Step 2: Push Backend to GitHub

### 2.1: Open Terminal/PowerShell

**Navigate to your backend folder:**

```bash
cd backend
```

### 2.2: Initialize Git (If Not Already Done)

```bash
git init
```

### 2.3: Add All Files

```bash
git add .
```

### 2.4: Commit

```bash
git commit -m "Initial commit - backend for Render"
```

### 2.5: Connect to GitHub

**Replace `YOUR_USERNAME` with your GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/marketing-pwa-backend.git
git branch -M main
git push -u origin main
```

**You'll be asked for your GitHub username and password (or token).**

**If you get authentication errors**, use a Personal Access Token:
1. **Go to** GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. **Generate new token** with `repo` permissions
3. **Use the token** as your password when pushing

---

## 🌐 Step 3: Deploy to Render

### 3.1: Sign Up / Log In to Render

1. **Go to** https://render.com
2. **Click** "Get Started for Free"
3. **Sign up** with GitHub (easiest - one click!)

### 3.2: Create New Web Service

1. **In Render dashboard**, click **"New +"**
2. **Select** **"Web Service"**
3. **Connect your GitHub repository**:
   - If not connected, click "Connect account" or "Configure account"
   - **Select** your `marketing-pwa-backend` repository
   - **Click** "Connect"

### 3.3: Configure Web Service

**Fill in these settings:**

- **Name**: `marketing-pwa-backend` (or any name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (should auto-detect)
- **Root Directory**: Leave empty (unless backend is in a subfolder)
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
- Render can't use `localhost` MySQL - you'll need an external database
- See `DATABASE_FOR_RENDER.md` for database setup options

### 3.5: Create the Service

1. **Click** "Create Web Service"
2. **Wait** 5-10 minutes for first deployment
3. **You'll see** build logs in real-time
4. **Watch** for errors

### 3.6: Get Your Backend URL

**After deployment succeeds:**

1. **You'll see** a URL like: `https://marketing-pwa-backend.onrender.com`
2. **Copy this URL** - this is your backend API URL!
3. **Test it**: Visit `https://your-backend-url.onrender.com/api` (should show error or JSON, not 503!)

---

## 🔧 Step 4: Fix Database Connection

**Render can't use `localhost` MySQL!** You need an external database.

### Option A: Use Render's PostgreSQL (Easiest - FREE)

1. **In Render dashboard**, click **"New +"** → **"PostgreSQL"**
2. **Create** free database
3. **Get** connection details from the database dashboard
4. **Update** environment variables in your web service:
   - `DB_HOST` = from database connection string
   - `DB_PORT` = from connection string (usually 5432)
   - `DB_NAME` = from connection string
   - `DB_USER` = from connection string
   - `DB_PASSWORD` = from connection string
5. **Update** your backend code to use PostgreSQL (see `DATABASE_FOR_RENDER.md`)

### Option B: Use Free MySQL Service

**Use PlanetScale, Railway, or Aiven:**

1. **Sign up** for free MySQL at https://planetscale.com (recommended)
2. **Create** database
3. **Get** connection string
4. **Update** environment variables in Render
5. **Run** your schema SQL in the new database

**See `DATABASE_FOR_RENDER.md` for detailed database setup!**

---

## 🎨 Step 5: Update Frontend

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
3. **Update** `.htaccess` (remove API proxy - not needed anymore)

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

## 🔄 Step 7: Update Code (Future Deployments)

**When you make changes to your backend:**

1. **Make changes** in your local `backend` folder
2. **Commit and push** to GitHub:

```bash
cd backend
git add .
git commit -m "Your change description"
git push
```

3. **Render will automatically deploy** your changes!
4. **Check** Render dashboard for deployment status

**That's it!** No manual deployment needed - Render watches GitHub and auto-deploys.

---

## 📋 Quick Checklist

- [ ] GitHub account created
- [ ] GitHub repository created
- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] Web service created on Render
- [ ] GitHub repository connected to Render
- [ ] Environment variables added to Render
- [ ] Database configured (external MySQL or PostgreSQL)
- [ ] Backend deployed successfully
- [ ] Backend URL copied
- [ ] Frontend `.env.production` updated
- [ ] Frontend rebuilt
- [ ] Frontend uploaded to cPanel
- [ ] `.htaccess` updated (removed API proxy)
- [ ] Tested registration/login

---

## 🔍 Troubleshooting

### GitHub Push Fails

**If you get authentication errors:**

1. **Use Personal Access Token** instead of password:
   - GitHub → Settings → Developer settings → Personal access tokens
   - Generate token with `repo` permissions
   - Use token as password when pushing

### Backend Shows "Application Error"

**Check Render logs:**
1. **In Render**, click your service
2. **Click** "Logs" tab
3. **Look for** error messages
4. **Common issues**:
   - Missing environment variables
   - Database connection failed
   - Build errors

### Frontend Can't Connect to Backend

**Check:**
1. **CORS** - Backend should allow your frontend domain (already configured)
2. **API URL** - Verify `.env.production` has correct Render URL
3. **Rebuild** frontend after changing `.env.production`

### Database Connection Failed

**Check:**
1. **Environment variables** in Render are correct
2. **Database** is accessible from Render (not localhost-only)
3. **Schema** is run in the database

---

## ✅ Success Indicators

**When backend is working, you'll see in Render logs:**

```
Connected to MySQL database
Database models synchronized
Server running on port 10000
```

**Then your app will work!** 🚀

---

## 🎯 What You'll Have After This

**Frontend**: `https://dominantlogic.tech` (on cPanel)
**Backend**: `https://your-backend.onrender.com` (on Render)
**Database**: MySQL/PostgreSQL (external service)
**GitHub**: Your code repository (for version control)

**This is how 90% of production apps work!** ✅

---

## 🆘 Need Help?

**If you get stuck:**
1. **Check Render logs** for backend errors
2. **Check browser console** for frontend errors
3. **Share** the error message and I'll help fix it!

**Let's get your backend running! 🚀**
