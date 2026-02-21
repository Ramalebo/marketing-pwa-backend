# Quick Start: Deploy to Render in 10 Minutes

## 🎯 Fastest Path to Working Backend

---

## Step 1: Push Backend to GitHub (5 min)

### On Your Local Machine:

```bash
# Navigate to backend folder
cd backend

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/marketing-pwa-backend.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

---

## Step 2: Deploy to Render (5 min)

### 2.1: Sign Up
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub

### 2.2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. **Connect** your GitHub repo
3. **Fill in**:
   - **Name**: `marketing-pwa-backend`
   - **Region**: Closest to you
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

### 2.3: Add Environment Variables

**Click "Advanced" → Add these:**

```env
NODE_ENV=production
PORT=10000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
JWT_SECRET=your-super-secret-jwt-key-change-this
FRONTEND_URL=https://dominantlogic.tech
```

### 2.4: Deploy
1. Click **"Create Web Service"**
2. Wait 5-10 minutes
3. Copy your backend URL (e.g., `https://marketing-pwa-backend.onrender.com`)

---

## Step 3: Update Frontend (2 min)

### 3.1: Update .env.production

**In `frontend/.env.production`:**

```env
VUE_APP_API_URL=https://your-backend-url.onrender.com/api
```

**Replace with your actual Render URL!**

### 3.2: Rebuild & Upload

```bash
cd frontend
npm run build
```

**Then upload `dist/` contents to cPanel `/public_html/`**

---

## Step 4: Fix Database (If Needed)

**Render can't connect to `localhost` MySQL!**

### Option A: Use cPanel MySQL (If External Access Allowed)

1. In cPanel → "Remote MySQL"
2. Add Render's IP (or `%` for all)
3. Update `DB_HOST` in Render to your MySQL host

### Option B: Create Render Database

1. In Render → "New +" → "PostgreSQL" (or MySQL)
2. Create free database
3. Update environment variables with new DB credentials
4. Run your schema SQL in new database

---

## ✅ Done!

**Your backend is now live on Render!**

**Test it:**
- Backend: `https://your-backend.onrender.com/api`
- Frontend: `https://dominantlogic.tech`

**Should work now! 🎉**

---

## 🆘 Common Issues

**"Application Error" on Render:**
- Check logs in Render dashboard
- Verify all environment variables are set
- Check database connection

**Frontend can't connect:**
- Verify `.env.production` has correct Render URL
- Rebuild frontend after changing `.env.production`
- Check browser console for CORS errors

**Database connection failed:**
- Render can't use `localhost` - need external MySQL
- Create database on Render or use external service
- Update environment variables

---

**Need help? Share the error message!** 🔧
