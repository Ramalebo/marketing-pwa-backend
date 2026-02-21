# Files to Upload - Quick Checklist

## 📦 Backend Files (Upload to `/public_html/backend/`)

### Required Files:
```
backend/
├── config/
│   └── database.js          ✅ NEW - MySQL connection
├── models/
│   ├── User.js             ✅ UPDATED - Sequelize
│   ├── Client.js           ✅ UPDATED - Sequelize
│   ├── Note.js             ✅ UPDATED - Sequelize
│   ├── Ad.js               ✅ UPDATED - Sequelize
│   ├── CustomerContact.js  ✅ UPDATED - Sequelize
│   ├── PostHistory.js      ✅ UPDATED - Sequelize
│   ├── Template.js         ✅ UPDATED - Sequelize
│   └── index.js            ✅ NEW - Model associations
├── routes/
│   ├── auth.js             ✅ UPDATED - Sequelize
│   ├── users.js            ✅ UPDATED - Sequelize
│   ├── clients.js          ✅ UPDATED - Sequelize
│   ├── notes.js            ✅ UPDATED - Sequelize
│   ├── ads.js              ✅ UPDATED - Sequelize
│   ├── customer-contacts.js ✅ UPDATED - Sequelize
│   ├── templates.js        ✅ UPDATED - Sequelize
│   ├── post-history.js     ✅ UPDATED - Sequelize
│   ├── chatbot.js          ✅ UPDATED - Sequelize
│   ├── insights.js         ✅ UPDATED - Sequelize
│   ├── social-media.js     ✅ UPDATED - Sequelize
│   ├── sms.js              ✅ UPDATED - Sequelize
│   ├── email.js            ✅ UPDATED - Sequelize
│   ├── hashtags.js         ✅ (no changes)
│   └── upload.js           ✅ (no changes)
├── middleware/
│   └── auth.js             ✅ UPDATED - Sequelize
├── database/
│   ├── schema.sql          ✅ NEW - SQL schema
│   └── schema-no-database.sql ✅ NEW - SQL without CREATE DATABASE
├── server.js                ✅ UPDATED - MySQL connection
└── package.json             ✅ UPDATED - Sequelize dependencies
```

### DO NOT Upload:
- ❌ `node_modules/` (install on server)
- ❌ `.env` (create manually on server)
- ❌ `.git/` (version control)
- ❌ `data/store.js` (old in-memory store - not needed)

---

## 🌐 Frontend Files (Upload to `/public_html/`)

### After Building (`npm run build`):

Upload **contents** of `frontend/dist/` folder:

```
public_html/
├── index.html              ✅ Main HTML file
├── assets/                 ✅ All JS, CSS files
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── logo.png                ✅ Your logo (if exists)
└── .htaccess               ✅ Routing configuration
```

### .htaccess Content:

Make sure `.htaccess` in `/public_html/` contains:

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

## 📝 Configuration Files

### Backend .env (Create on Server):

**Location**: `/public_html/backend/.env`

**Content**:
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
JWT_SECRET=your-super-secret-jwt-key
# ... other API keys
```

---

## 🗄️ Database (Already Done ✅)

- ✅ Database: `dominan1_marketing_pwa`
- ✅ User: `dominan1_Onka`
- ✅ Password: `43MYhu32bBJ5qmc`
- ✅ Tables: All 7 tables created

---

## 🚀 Quick Upload Steps

1. **Build Frontend**: `cd frontend && npm run build`
2. **Upload Backend**: Upload all backend files to `/public_html/backend/`
3. **Upload Frontend**: Upload `dist/` contents to `/public_html/`
4. **Create .env**: Create `.env` in `/public_html/backend/` with MySQL credentials
5. **Install Dependencies**: Node.js Selector → "Run NPM Install"
6. **Restart Backend**: Node.js Selector → "Restart"
7. **Test**: Visit `https://dominantlogic.tech`

---

## ✅ Verification

After upload, verify:
- [ ] Backend files in `/public_html/backend/`
- [ ] Frontend files in `/public_html/`
- [ ] `.htaccess` in `/public_html/`
- [ ] `.env` in `/public_html/backend/`
- [ ] Node.js app configured
- [ ] Dependencies installed
- [ ] Backend running
- [ ] Website loads

---

**Ready to deploy! 🎉**
