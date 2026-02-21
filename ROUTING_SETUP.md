# Routing Setup Guide for cPanel

## 🔴 Current Issue: 403 Error

You're getting "Access to dominantlogic.tech was denied" (HTTP ERROR 403). This is likely because:
1. Frontend routing isn't configured properly
2. API routing isn't set up
3. File permissions might be wrong

---

## 🌐 PART 1: Frontend Routing (Fix 403 Error)

### Step 1: Verify .htaccess File

1. **In File Manager**, navigate to `public_html/`

2. **Check if `.htaccess` exists**:
   - Click "View" tab in File Manager
   - Check "Show Hidden Files" or look for `.htaccess`
   - If you don't see it, it might be hidden

3. **If .htaccess is missing**, create it:
   - Click "+ File" button
   - Name it: `.htaccess` (with the dot at the beginning)
   - Click "Create"
   - Right-click and select "Edit"
   - Paste this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Handle Angular/React/Vue Router - redirect all requests to index.html
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

4. **Save** the file

### Step 2: Check File Permissions

1. **In File Manager**, navigate to `public_html/`

2. **Select** `index.html`

3. **Right-click** > **"Permissions"**

4. **Set permissions**:
   - Files: `644` (rw-r--r--)
   - Folders: `755` (rwxr-xr-x)

5. **Apply to all files** if needed

---

## 🔌 PART 2: API Routing (Connect Frontend to Backend)

### Option A: Proxy API Requests (Recommended)

Since your backend runs on port 3000, you need to proxy API requests. Update your `.htaccess`:

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
```

**Note**: This requires `mod_proxy` to be enabled. If it doesn't work, use Option B.

### Option B: Use Subdomain for API (Alternative)

1. **Create subdomain** in cPanel:
   - Go to "Subdomains"
   - Create: `api.dominantlogic.tech`
   - Point to: `/home/dominan1/api/` (or similar)

2. **Update frontend API URL**:
   - In your `.env` or build config, set:
   ```
   VUE_APP_API_URL=https://api.dominantlogic.tech
   ```

3. **Rebuild frontend** with new API URL

### Option C: Use Same Domain with Different Path

Update your frontend to use the full backend URL:

1. **Check your backend URL** from Node.js Selector
2. **Update frontend configuration** to use that URL
3. **Rebuild frontend** if needed

---

## 🔧 PART 3: Update Frontend API Configuration

### If Frontend is Already Built:

You need to update the API base URL. Check your frontend build:

1. **In File Manager**, go to `public_html/js/`

2. **Find** the main JavaScript file (usually `app.*.js`)

3. **Check** if it has hardcoded API URLs

4. **If needed**, you may need to rebuild frontend with correct API URL

### Rebuild Frontend with Correct API URL:

1. **On your computer**, edit `frontend/.env` or create it:

```env
VUE_APP_API_URL=https://dominantlogic.tech
```

Or if using subdomain:
```env
VUE_APP_API_URL=https://api.dominantlogic.tech
```

2. **Rebuild**:
```bash
cd frontend
npm run build
```

3. **Upload** new build files to `public_html/`

---

## 🛣️ PART 4: Backend API Routes

Your backend should have these routes (already configured):

```
/api/auth/*          - Authentication
/api/users/*         - User management
/api/clients/*       - Client management
/api/notes/*         - Notes
/api/ads/*           - Ads
/api/email/*         - Email marketing
/api/sms/*           - SMS marketing
/api/chatbot/*       - AI Chatbot
/api/insights/*      - Analytics
/api/social-media/*  - Social media posting
/api/upload/*        - File uploads
/api/customer-contacts/* - Customer contacts
```

**Backend URL**: `http://localhost:3000` (internal) or your Node.js app URL

---

## 🔄 PART 5: Complete Routing Setup

### Full .htaccess Configuration:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # API Proxy (if mod_proxy is enabled)
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
  
  # Don't rewrite files that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API calls
  RewriteCond %{REQUEST_URI} !^/api
  
  # Rewrite everything else to index.html for Vue Router
  RewriteRule . /index.html [L]
</IfModule>

# Security
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## ✅ PART 6: Testing Routing

### Test Frontend:

1. **Visit**: `https://dominantlogic.tech`
2. **Should see**: Login/Register page (not 403 error)
3. **Try navigating**: Should work without page reload

### Test API:

1. **Open browser console** (F12)
2. **Try to register/login**
3. **Check Network tab** for API calls
4. **Should see**: API requests going to `/api/auth/login` or similar

### Common Issues:

**403 Error Still Appears:**
- Check `.htaccess` file exists and has correct content
- Check file permissions (644 for files, 755 for folders)
- Check if `mod_rewrite` is enabled (contact hosting support)

**API Calls Fail:**
- Check backend is running (Node.js Selector)
- Check API URL in frontend matches backend
- Check CORS settings in backend
- Check browser console for errors

**404 on Routes:**
- Verify `.htaccess` rewrite rules
- Check Vue Router is configured correctly
- Clear browser cache

---

## 🔍 PART 7: Verify Current Setup

### Check These:

1. **Backend Location**: `/home/dominan1/marketing-app/backend/`
2. **Backend Running**: Check Node.js Selector - should be "Running"
3. **Frontend Location**: `public_html/` with all files
4. **.htaccess File**: In `public_html/` with correct content
5. **File Permissions**: 644 for files, 755 for folders
6. **API URL**: Matches your backend URL

---

## 📋 Routing Checklist

- [ ] `.htaccess` file exists in `public_html/`
- [ ] `.htaccess` has Vue Router rewrite rules
- [ ] API proxy configured (if using same domain)
- [ ] OR subdomain created for API (if using subdomain)
- [ ] Frontend API URL configured correctly
- [ ] File permissions set correctly (644/755)
- [ ] Backend is running
- [ ] Can access frontend without 403 error
- [ ] API calls work from frontend

---

## 🆘 Quick Fix for 403 Error

**Immediate Steps:**

1. **Create/Update `.htaccess`** in `public_html/`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

2. **Set permissions**:
   - `.htaccess`: 644
   - `index.html`: 644
   - Folders: 755

3. **Clear browser cache** and try again

4. **If still 403**, contact hosting support to enable `mod_rewrite`

---

**This should fix your routing and 403 error! 🚀**
