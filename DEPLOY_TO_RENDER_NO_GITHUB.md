# Deploy to Render WITHOUT GitHub - Complete Guide

## 🎯 Goal
Deploy your Node.js backend to Render directly from your local machine, **no GitHub needed!**

**We'll use Render CLI** - deploy directly from your computer.

---

## 📋 Prerequisites

1. **Render account** (free) - Sign up at https://render.com
2. **Node.js installed** on your local machine (for Render CLI)
3. **Your backend code** ready to deploy

---

## 🚀 Step 1: Install Render CLI

### On Windows (PowerShell):

```powershell
# Install Render CLI globally
npm install -g render-cli

# Verify installation
render --version
```

### On Mac/Linux:

```bash
# Install Render CLI globally
npm install -g render-cli

# Verify installation
render --version
```

**If you get permission errors**, use `sudo` (Mac/Linux) or run PowerShell as Administrator (Windows).

---

## 🔐 Step 2: Login to Render

**In your terminal/PowerShell:**

```bash
render login
```

**This will:**
1. Open your browser
2. Ask you to authorize Render CLI
3. Return to terminal when done

**You should see**: "Successfully logged in!"

---

## 📦 Step 3: Prepare Your Backend

### 3.1: Navigate to Backend Folder

```bash
cd backend
```

### 3.2: Create render.yaml (Optional but Helpful)

**Create `render.yaml` in your backend folder:**

```yaml
services:
  - type: web
    name: marketing-pwa-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DB_HOST
        sync: false
      - key: DB_PORT
        sync: false
      - key: DB_NAME
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASSWORD
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: FRONTEND_URL
        value: https://dominantlogic.tech
```

**This file helps Render understand your app structure.**

---

## 🌐 Step 4: Deploy to Render

### 4.1: Create New Service

**In your terminal (still in `backend` folder):**

```bash
render services:create
```

**This will prompt you with questions:**

1. **Service type**: Select `web` (for web service)
2. **Name**: `marketing-pwa-backend` (or any name)
3. **Environment**: `node`
4. **Build command**: `npm install`
5. **Start command**: `npm start`
6. **Region**: Choose closest to you
7. **Plan**: Select `free`

**OR** use the interactive wizard:

```bash
render services:create --interactive
```

### 4.2: Alternative: Use render.yaml

**If you created `render.yaml`:**

```bash
render deploy
```

**This will read `render.yaml` and create the service automatically.**

---

## ⚙️ Step 5: Set Environment Variables

### 5.1: Set Variables via CLI

**Set each variable one by one:**

```bash
render env:set NODE_ENV=production
render env:set PORT=10000
render env:set DB_HOST=localhost
render env:set DB_PORT=3306
render env:set DB_NAME=dominan1_marketing_pwa
render env:set DB_USER=dominan1_Onka
render env:set DB_PASSWORD=43MYhu32bBJ5qmc
render env:set JWT_SECRET=your-super-secret-jwt-key-change-this
render env:set FRONTEND_URL=https://dominantlogic.tech
```

**⚠️ Important:** Replace the database credentials with your actual values!

### 5.2: Or Set via Render Dashboard

1. **Go to** https://dashboard.render.com
2. **Click** on your service
3. **Click** "Environment" tab
4. **Click** "Add Environment Variable"
5. **Add** each variable manually

---

## 🔧 Step 6: Fix Database Connection

**Render can't use `localhost` MySQL!** You need an external database.

### Option A: Use Render's PostgreSQL (Easiest)

1. **In Render dashboard**, click **"New +"** → **"PostgreSQL"**
2. **Create** free database
3. **Get** connection details
4. **Update** environment variables with new DB credentials

### Option B: Use Free MySQL Service

**Use PlanetScale, Railway, or Aiven:**

1. **Sign up** for free MySQL
2. **Create** database
3. **Get** connection string
4. **Update** environment variables in Render

**See `DATABASE_FOR_RENDER.md` for detailed database setup!**

---

## 🚀 Step 7: Deploy Your Code

### 7.1: Deploy Current Code

**In your terminal (in `backend` folder):**

```bash
render deploy
```

**This will:**
1. Upload your code to Render
2. Build your app (`npm install`)
3. Start your service
4. Show you the deployment URL

### 7.2: Monitor Deployment

**Watch the logs:**

```bash
render logs --tail
```

**Or check in dashboard:**
1. **Go to** https://dashboard.render.com
2. **Click** your service
3. **Click** "Logs" tab

---

## ✅ Step 8: Get Your Backend URL

**After deployment:**

1. **In Render dashboard**, click your service
2. **You'll see** a URL like: `https://marketing-pwa-backend.onrender.com`
3. **Copy this URL** - this is your backend API URL!

**Or get it via CLI:**

```bash
render services:list
```

---

## 🎨 Step 9: Update Frontend

### 9.1: Update .env.production

**In `frontend/.env.production`:**

```env
VUE_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Replace with your actual Render URL!**

### 9.2: Rebuild Frontend

```bash
cd frontend
npm run build
```

### 9.3: Upload to cPanel

1. **Upload** `dist/` contents to `/public_html/`
2. **Update** `.htaccess` (remove API proxy - not needed)

---

## 🔄 Step 10: Update Code (Future Deployments)

**When you make changes to your backend:**

1. **Make changes** in your local `backend` folder
2. **Deploy again**:

```bash
cd backend
render deploy
```

**That's it!** Render will rebuild and redeploy automatically.

---

## 📋 Quick Checklist

- [ ] Render CLI installed (`npm install -g render-cli`)
- [ ] Logged in to Render (`render login`)
- [ ] Created service on Render
- [ ] Environment variables set
- [ ] Database configured (external MySQL or PostgreSQL)
- [ ] Code deployed (`render deploy`)
- [ ] Backend URL copied
- [ ] Frontend `.env.production` updated
- [ ] Frontend rebuilt and uploaded
- [ ] Tested registration/login

---

## 🆘 Troubleshooting

### "Command not found: render"

**Fix**: Install Render CLI:
```bash
npm install -g render-cli
```

### "Not logged in"

**Fix**: Login first:
```bash
render login
```

### "Service not found"

**Fix**: Create service first:
```bash
render services:create
```

### Deployment fails

**Check logs:**
```bash
render logs --tail
```

**Common issues:**
- Missing environment variables
- Database connection failed
- Build errors

---

## 🎯 Alternative: Use Render Dashboard (No CLI)

**If you prefer not to use CLI:**

1. **Go to** https://dashboard.render.com
2. **Click** "New +" → "Web Service"
3. **Select** "Deploy without Git" (if available)
4. **Upload** your backend folder as a ZIP file
5. **Configure** settings manually

**Note**: This method may not be available on all Render plans. CLI is more reliable.

---

## ✅ Success!

**Your backend is now live on Render!**

**Test it:**
- Backend: `https://your-backend.onrender.com/api`
- Frontend: `https://dominantlogic.tech`

**Should work now! 🎉**

---

## 🆘 Need Help?

**If you get stuck:**
1. **Check** `render logs --tail` for errors
2. **Share** the error message
3. **I'll help** you fix it!

**Let's get your backend running! 🚀**
