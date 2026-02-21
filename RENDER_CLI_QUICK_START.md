# Quick Start: Deploy to Render WITHOUT GitHub

## 🎯 Fastest Path - 5 Steps

---

## Step 1: Install Render CLI (2 min)

**Open PowerShell or Terminal:**

```bash
npm install -g render-cli
```

**Verify:**
```bash
render --version
```

---

## Step 2: Login to Render (1 min)

```bash
render login
```

**This opens your browser - authorize it, then return to terminal.**

---

## Step 3: Navigate to Backend (30 sec)

```bash
cd backend
```

---

## Step 4: Create Service (2 min)

**Option A: Interactive Wizard**

```bash
render services:create --interactive
```

**Answer the prompts:**
- Service type: `web`
- Name: `marketing-pwa-backend`
- Environment: `node`
- Build: `npm install`
- Start: `npm start`
- Plan: `free`

**Option B: Quick Create**

```bash
render services:create web --name marketing-pwa-backend --env node --build-command "npm install" --start-command "npm start" --plan free
```

---

## Step 5: Set Environment Variables (2 min)

**Set each one:**

```bash
render env:set NODE_ENV=production
render env:set PORT=10000
render env:set DB_HOST=your-db-host
render env:set DB_PORT=3306
render env:set DB_NAME=dominan1_marketing_pwa
render env:set DB_USER=dominan1_Onka
render env:set DB_PASSWORD=43MYhu32bBJ5qmc
render env:set JWT_SECRET=your-secret-key
render env:set FRONTEND_URL=https://dominantlogic.tech
```

**⚠️ Replace database values with your actual credentials!**

---

## Step 6: Deploy! (3 min)

```bash
render deploy
```

**Wait for deployment to complete.**

**Get your URL:**
```bash
render services:list
```

**Or check dashboard:** https://dashboard.render.com

---

## Step 7: Update Frontend

**In `frontend/.env.production`:**
```env
VUE_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Rebuild:**
```bash
cd frontend
npm run build
```

**Upload to cPanel.**

---

## ✅ Done!

**Your backend is live! 🎉**

---

## 🔄 Update Code Later

**When you make changes:**

```bash
cd backend
render deploy
```

**That's it!**

---

## 🆘 Common Issues

**"Command not found"**
→ Install: `npm install -g render-cli`

**"Not logged in"**
→ Login: `render login`

**"Database connection failed"**
→ Use external database (not localhost) - see `DATABASE_FOR_RENDER.md`

---

**Need help? Share the error!** 🔧
