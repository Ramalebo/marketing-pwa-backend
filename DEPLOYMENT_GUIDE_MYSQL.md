# Complete Deployment Guide - MySQL Version

## 🎯 What You Need to Deploy

Since we converted to MySQL, you need to upload:
1. **Updated Backend** (with Sequelize/MySQL code)
2. **Frontend** (rebuild with correct API URL)
3. **Database** (already set up ✅)
4. **Configuration** (.env file with MySQL credentials)

---

## 📦 Step 1: Prepare Frontend for Production

### Build Frontend Locally

1. **Open terminal** in your project folder
2. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
3. **Install dependencies** (if needed):
   ```bash
   npm install
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Wait** for build to complete
6. **Check** that `frontend/dist/` folder was created

---

## 📁 Step 2: Files to Upload to cPanel

### A. Backend Files (Upload to `/public_html/backend/`)

**Upload these files/folders:**
- ✅ `backend/config/` (NEW - database connection)
- ✅ `backend/models/` (UPDATED - Sequelize models)
- ✅ `backend/routes/` (UPDATED - Sequelize queries)
- ✅ `backend/middleware/` (UPDATED - auth middleware)
- ✅ `backend/database/` (NEW - SQL schema files)
- ✅ `backend/server.js` (UPDATED - MySQL connection)
- ✅ `backend/package.json` (UPDATED - Sequelize dependencies)

**DO NOT upload:**
- ❌ `node_modules/` (will be installed on server)
- ❌ `.env` (create on server manually)
- ❌ `.git/` (if exists)

---

### B. Frontend Files (Upload to `/public_html/`)

**Upload contents of `frontend/dist/` folder:**
- ✅ All files from `frontend/dist/` → `/public_html/`
- ✅ `index.html`
- ✅ `assets/` folder
- ✅ `logo.png` (if exists)
- ✅ `.htaccess` file (for routing)

**Important**: Upload the **contents** of `dist/`, not the `dist` folder itself!

---

## 🗂️ Step 3: Upload Files to cPanel

### Option A: Using File Manager

1. **In cPanel**, go to **"Files"** → **"File Manager"**
2. **Navigate to** `/home/dominan1/public_html/`

#### Upload Backend:
1. **Go to** `/public_html/backend/` (create if doesn't exist)
2. **Click** **"Upload"** button
3. **Select** backend files (config, models, routes, middleware, database folders, server.js, package.json)
4. **Wait** for upload to complete

#### Upload Frontend:
1. **Go to** `/public_html/`
2. **Delete old files** (if any) - keep `backend/` folder
3. **Click** **"Upload"** button
4. **Select** all files from `frontend/dist/` folder
5. **Upload** `.htaccess` file (from `frontend/deployment-package/frontend/.htaccess`)

---

### Option B: Using FTP (Faster for large files)

1. **Get FTP credentials** from cPanel → "FTP Accounts"
2. **Use FTP client** (FileZilla, WinSCP, etc.)
3. **Connect** to your server
4. **Upload** backend files to `/public_html/backend/`
5. **Upload** frontend files to `/public_html/`

---

## ⚙️ Step 4: Configure Backend .env File

1. **In File Manager**, go to `/public_html/backend/`
2. **Create** `.env` file (click "New File" → name it `.env`)
3. **Add this content**:

```env
PORT=3000
NODE_ENV=production

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc

# JWT Secret (CHANGE THIS to a random string!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Facebook/Instagram API Configuration
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
FACEBOOK_PAGE_ID=your-facebook-page-id

# Instagram Business Account
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-account-id

# WhatsApp Business API Configuration
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=your-whatsapp-business-account-id

# Frontend URL
FRONTEND_URL=https://dominantlogic.tech
```

4. **Save** the file

---

## 🔧 Step 5: Setup Node.js Application

1. **In cPanel**, go to **"Node.js Selector"**
2. **Find your backend app** OR **Create Application**:
   - **Node.js Version**: `18.x` or `20.x` (LTS)
   - **Application Root**: `/home/dominan1/public_html/backend`
   - **Application URL**: `/api` (or leave default)
   - **Application Startup File**: `server.js`
   - **Application Mode**: Production
3. **Click** **"Create"** (if new) or **"Edit"** (if exists)

---

## 📦 Step 6: Install Dependencies

1. **In Node.js Selector**, find your backend app
2. **Click**: **"Run NPM Install"**
3. **Wait** for installation (this installs Sequelize, mysql2, etc.)
4. **Check** for any errors

---

## 🚀 Step 7: Restart Backend

1. **In Node.js Selector**, click **"Restart"**
2. **Wait** 10-20 seconds
3. **Click**: **"View Logs"**
4. **Check for**:
   - ✅ `Connected to MySQL database`
   - ✅ `Database models synchronized`
   - ✅ `Server running on port 3000`
   - ❌ Any errors (fix if found)

---

## ✅ Step 8: Verify .htaccess File

1. **In File Manager**, go to `/public_html/`
2. **Check** `.htaccess` file exists
3. **Verify** it contains API proxy rules:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API Proxy - forward /api/* requests to backend
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
  
  # Frontend routing - redirect all other requests to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

---

## 🧪 Step 9: Test Your Application

1. **Visit**: `https://dominantlogic.tech`
2. **Test Registration**: Try creating a new account
3. **Check Database**: In phpMyAdmin, verify data appears in `users` table
4. **Test Other Features**: Create clients, notes, ads, etc.

---

## 📋 Deployment Checklist

### Backend:
- [ ] Backend files uploaded to `/public_html/backend/`
- [ ] `.env` file created with MySQL credentials
- [ ] Node.js application created/updated in Node.js Selector
- [ ] Dependencies installed (`npm install`)
- [ ] Backend restarted
- [ ] Logs show "Connected to MySQL database"

### Frontend:
- [ ] Frontend built (`npm run build`)
- [ ] `dist/` contents uploaded to `/public_html/`
- [ ] `.htaccess` file uploaded and configured
- [ ] `logo.png` uploaded (if exists)

### Database:
- [ ] MySQL database created (`dominan1_marketing_pwa`)
- [ ] Database user created (`dominan1_Onka`)
- [ ] SQL schema executed (all 7 tables created)
- [ ] Database password saved securely

### Testing:
- [ ] Website loads at `https://dominantlogic.tech`
- [ ] Registration works
- [ ] Login works
- [ ] Data appears in database
- [ ] No console errors

---

## 🆘 Troubleshooting

### Backend Won't Start:
- Check `.env` file exists and has correct MySQL credentials
- Check Node.js application root is correct
- Run "NPM Install" again
- Check logs for specific errors

### Database Connection Error:
- Verify database name: `dominan1_marketing_pwa`
- Verify username: `dominan1_Onka`
- Verify password is correct
- Check database exists in phpMyAdmin

### Frontend Shows 503 Error:
- Backend is not running - restart in Node.js Selector
- Check `.htaccess` has API proxy rules
- Verify backend is on port 3000

### Frontend Shows ERR_CONNECTION_REFUSED:
- Frontend was built with wrong API URL
- Rebuild frontend: `npm run build` (with `.env.production`)
- Re-upload `dist/` contents

---

## 🎉 Success!

Once all steps are complete:
- ✅ Website loads at `https://dominantlogic.tech`
- ✅ Backend connects to MySQL
- ✅ Registration/login works
- ✅ Data saves to database

**Your application is now live with MySQL! 🚀**
