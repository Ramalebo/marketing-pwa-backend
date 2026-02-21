# GitHub Deployment - Quick Start

## 🎯 Fastest Path - 5 Steps

---

## Step 1: Create GitHub Repo (2 min)

1. **Go to** https://github.com/new
2. **Name**: `marketing-pwa-backend`
3. **Visibility**: Private or Public
4. **DO NOT** check any boxes
5. **Click** "Create repository"

---

## Step 2: Push Code to GitHub (3 min)

**In PowerShell/Terminal:**

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/marketing-pwa-backend.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

**If asked for password**, use a Personal Access Token:
- GitHub → Settings → Developer settings → Personal access tokens
- Generate token with `repo` permission
- Use token as password

---

## Step 3: Connect to Render (2 min)

1. **Go to** https://render.com
2. **Sign up** with GitHub (one click!)
3. **Click** "New +" → "Web Service"
4. **Select** your `marketing-pwa-backend` repo
5. **Fill in**:
   - Name: `marketing-pwa-backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: `free`

---

## Step 4: Add Environment Variables (3 min)

**In Render, click "Advanced" → Add:**

```env
NODE_ENV=production
PORT=10000
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
JWT_SECRET=your-secret-key
FRONTEND_URL=https://dominantlogic.tech
```

**⚠️ Replace database values!**

---

## Step 5: Deploy & Get URL (5 min)

1. **Click** "Create Web Service"
2. **Wait** for deployment (5-10 min)
3. **Copy** your URL: `https://your-app.onrender.com`
4. **Update** frontend `.env.production`:
   ```env
   VUE_APP_API_URL=https://your-app.onrender.com/api
   ```
5. **Rebuild** frontend: `cd frontend && npm run build`
6. **Upload** to cPanel

---

## ✅ Done!

**Your backend is live! 🎉**

---

## 🔄 Update Code Later

**Just push to GitHub:**

```bash
cd backend
git add .
git commit -m "Your changes"
git push
```

**Render auto-deploys!** 🚀

---

## 🆘 Common Issues

**"Authentication failed"**
→ Use Personal Access Token instead of password

**"Database connection failed"**
→ Use external database (not localhost) - see `DATABASE_FOR_RENDER.md`

**"503 error"**
→ Check Render logs for specific error

---

**Need help? Share the error!** 🔧
