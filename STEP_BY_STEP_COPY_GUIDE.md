# Step-by-Step: What to Copy for Deployment

## 📍 Your Local Files Location
**All files are in**: `C:\temp\AppCode\`

---

## 📦 STEP 1: Copy Backend Folder

### What to Copy:
**From**: `C:\temp\AppCode\backend\`  
**To**: `/home/dominan1/public_html/backend/` (on server)

### Copy These Folders/Files:

```
C:\temp\AppCode\backend\
├── config\              ✅ COPY THIS FOLDER
├── models\              ✅ COPY THIS FOLDER
├── routes\              ✅ COPY THIS FOLDER
├── middleware\          ✅ COPY THIS FOLDER
├── database\            ✅ COPY THIS FOLDER
├── server.js            ✅ COPY THIS FILE
└── package.json         ✅ COPY THIS FILE
```

### ❌ DO NOT Copy:
- `node_modules\` (will be installed on server)
- `.env` (you'll create this manually on server)
- `.git\` (if exists)
- `data\` (old store - not needed)

### How to Copy:
1. **Open File Explorer**
2. **Go to**: `C:\temp\AppCode\backend\`
3. **Select** these items:
   - Hold `Ctrl` and click: `config`, `models`, `routes`, `middleware`, `database` folders
   - Hold `Ctrl` and click: `server.js`, `package.json` files
4. **Right-click** → **Copy** (or `Ctrl+C`)
5. **Upload to server**: `/public_html/backend/`

---

## 📝 STEP 2: Create .env File on Server

### ⚠️ DO NOT Copy .env from Local!

**Instead, CREATE it on the server:**

1. **In cPanel File Manager**, go to `/public_html/backend/`
2. **Click**: "New File"
3. **Name it**: `.env`
4. **Click**: "Create"
5. **Click**: "Edit"
6. **Paste this content**:

```env
PORT=3000
NODE_ENV=production

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc

# JWT Secret (CHANGE THIS!)
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

7. **Click**: "Save Changes"

---

## 📄 STEP 3: Copy .htaccess File

### What to Copy:
**From**: `C:\temp\AppCode\frontend\deployment-package\frontend\.htaccess`  
**OR** create it with the content below  
**To**: `/home/dominan1/public_html/` (root, NOT in backend folder!)

### Option A: Copy Existing File

1. **Open File Explorer**
2. **Go to**: `C:\temp\AppCode\frontend\deployment-package\frontend\`
3. **Find**: `.htaccess` file
4. **Copy** it
5. **Upload to server**: `/public_html/` (root directory)

### Option B: Create on Server

1. **In cPanel File Manager**, go to `/public_html/`
2. **Click**: "New File"
3. **Name it**: `.htaccess`
4. **Click**: "Create"
5. **Click**: "Edit"
6. **Paste this content**:

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

7. **Click**: "Save Changes"

---

## 🌐 STEP 4: Build and Copy Frontend

### Step 4.1: Build Frontend First

1. **Open Terminal/Command Prompt**
2. **Navigate to frontend**:
   ```bash
   cd C:\temp\AppCode\frontend
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```
4. **Wait** for build to complete
5. **Check** that `dist\` folder was created

### Step 4.2: Copy Frontend Files

**From**: `C:\temp\AppCode\frontend\dist\` (ALL CONTENTS)  
**To**: `/home/dominan1/public_html/` (root directory)

### What to Copy:

```
C:\temp\AppCode\frontend\dist\
├── index.html          ✅ COPY THIS FILE
├── assets\             ✅ COPY THIS FOLDER (all files inside)
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── logo.png            ✅ COPY THIS (if exists)
```

### How to Copy:

1. **Open File Explorer**
2. **Go to**: `C:\temp\AppCode\frontend\dist\`
3. **Select ALL files and folders** (`Ctrl+A`)
4. **Copy** (`Ctrl+C`)
5. **Upload to server**: `/public_html/` (root directory)

**Important**: Upload the **contents** of `dist\`, not the `dist` folder itself!

---

## 📋 Complete Checklist

### Backend:
- [ ] `config\` folder copied to `/public_html/backend/`
- [ ] `models\` folder copied to `/public_html/backend/`
- [ ] `routes\` folder copied to `/public_html/backend/`
- [ ] `middleware\` folder copied to `/public_html/backend/`
- [ ] `database\` folder copied to `/public_html/backend/`
- [ ] `server.js` copied to `/public_html/backend/`
- [ ] `package.json` copied to `/public_html/backend/`
- [ ] `.env` file created in `/public_html/backend/` (with MySQL credentials)

### Frontend:
- [ ] Frontend built (`npm run build`)
- [ ] `index.html` copied to `/public_html/`
- [ ] `assets\` folder copied to `/public_html/`
- [ ] `logo.png` copied to `/public_html/` (if exists)
- [ ] `.htaccess` file in `/public_html/` (root)

---

## 🗂️ Final File Structure on Server

After copying, your server should look like this:

```
/home/dominan1/public_html/
├── index.html              ✅ (from frontend/dist/)
├── assets/                 ✅ (from frontend/dist/)
├── logo.png                ✅ (from frontend/dist/)
├── .htaccess               ✅ (routing configuration)
└── backend/                ✅ (backend folder)
    ├── config/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── database/
    ├── server.js
    ├── package.json
    └── .env                 ✅ (created manually)
```

---

## ✅ After Copying

1. **Install Dependencies**: Node.js Selector → "Run NPM Install"
2. **Restart Backend**: Node.js Selector → "Restart"
3. **Check Logs**: Should show "Connected to MySQL database"
4. **Test Website**: Visit `https://dominantlogic.tech`

---

**That's it! Follow these steps in order! 🚀**
