# Deploy to Railway - Complete Guide (No GitHub Needed)

## 🎯 Why Railway?

- ✅ **FREE tier** with generous limits
- ✅ **Direct deployment** from local machine
- ✅ **Easy CLI** (simpler than Render)
- ✅ **Great documentation**
- ✅ **No GitHub required** (but can use it if you want)

---

## 📋 Prerequisites

1. **Railway account** - Sign up at https://railway.app
2. **Node.js installed** on your local machine
3. **Your backend code** ready

---

## 🚀 Step 1: Install Railway CLI

### Windows (PowerShell):

```powershell
npm install -g @railway/cli
```

### Mac/Linux:

```bash
npm install -g @railway/cli
```

**Verify:**
```bash
railway --version
```

---

## 🔐 Step 2: Login to Railway

```bash
railway login
```

**This will:**
1. Open your browser
2. Ask you to authorize
3. Return to terminal when done

---

## 📦 Step 3: Prepare Your Backend

### 3.1: Navigate to Backend

```bash
cd backend
```

### 3.2: Create railway.json (Optional)

**Create `railway.json` in your backend folder:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🌐 Step 4: Create New Project

### 4.1: Initialize Railway Project

**In your `backend` folder:**

```bash
railway init
```

**This will:**
1. Create a new Railway project
2. Link it to your account
3. Set up deployment configuration

### 4.2: Or Create via Dashboard

1. **Go to** https://railway.app/dashboard
2. **Click** "New Project"
3. **Select** "Empty Project"
4. **Copy** the project ID or link it via CLI

---

## ⚙️ Step 5: Set Environment Variables

### 5.1: Via CLI

```bash
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set DB_HOST=your-db-host
railway variables set DB_PORT=3306
railway variables set DB_NAME=dominan1_marketing_pwa
railway variables set DB_USER=dominan1_Onka
railway variables set DB_PASSWORD=43MYhu32bBJ5qmc
railway variables set JWT_SECRET=your-secret-key
railway variables set FRONTEND_URL=https://dominantlogic.tech
```

### 5.2: Via Dashboard

1. **Go to** Railway dashboard
2. **Click** your project
3. **Click** "Variables" tab
4. **Add** each variable manually

---

## 🚀 Step 6: Deploy!

### 6.1: Deploy Current Code

```bash
railway up
```

**This will:**
1. Upload your code
2. Build your app
3. Deploy it
4. Show you the URL

### 6.2: Monitor Deployment

**Watch logs:**

```bash
railway logs
```

**Or in dashboard:**
1. **Click** your service
2. **Click** "Deployments" tab
3. **View** logs

---

## ✅ Step 7: Get Your Backend URL

**After deployment:**

1. **In Railway dashboard**, click your service
2. **Click** "Settings" tab
3. **Find** "Generate Domain" button
4. **Click** it to get your URL

**Or via CLI:**

```bash
railway domain
```

**You'll get a URL like:** `https://your-app.up.railway.app`

---

## 🔧 Step 8: Fix Database Connection

**Railway can't use `localhost` MySQL!**

### Option A: Use Railway's PostgreSQL (Easiest)

1. **In Railway dashboard**, click "New" → "Database" → "PostgreSQL"
2. **Create** database
3. **Get** connection details
4. **Update** environment variables

### Option B: Use External MySQL

**Use PlanetScale, Aiven, or other free MySQL service:**

1. **Sign up** for free MySQL
2. **Create** database
3. **Get** connection string
4. **Update** environment variables in Railway

---

## 🎨 Step 9: Update Frontend

### 9.1: Update .env.production

**In `frontend/.env.production`:**

```env
VUE_APP_API_URL=https://your-app.up.railway.app/api
```

**Replace with your actual Railway URL!**

### 9.2: Rebuild Frontend

```bash
cd frontend
npm run build
```

### 9.3: Upload to cPanel

1. **Upload** `dist/` contents to `/public_html/`
2. **Update** `.htaccess` (remove API proxy)

---

## 🔄 Step 10: Update Code (Future Deployments)

**When you make changes:**

```bash
cd backend
railway up
```

**That's it!** Railway redeploys automatically.

---

## 📋 Quick Checklist

- [ ] Railway CLI installed
- [ ] Logged in to Railway
- [ ] Project created
- [ ] Environment variables set
- [ ] Database configured
- [ ] Code deployed (`railway up`)
- [ ] Backend URL copied
- [ ] Frontend `.env.production` updated
- [ ] Frontend rebuilt and uploaded
- [ ] Tested registration/login

---

## 🆘 Troubleshooting

### "Command not found: railway"

**Fix:**
```bash
npm install -g @railway/cli
```

### "Not logged in"

**Fix:**
```bash
railway login
```

### Deployment fails

**Check logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Database connection failed
- Build errors

---

## ✅ Success!

**Your backend is now live on Railway!**

**Test it:**
- Backend: `https://your-app.up.railway.app/api`
- Frontend: `https://dominantlogic.tech`

**Should work now! 🎉**

---

## 🆘 Need Help?

**If you get stuck:**
1. **Check** `railway logs` for errors
2. **Share** the error message
3. **I'll help** you fix it!

**Let's get your backend running! 🚀**
