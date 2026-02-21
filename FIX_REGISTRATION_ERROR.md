# Fix Registration Error After Deployment

## 🔴 Problem
After publishing, you're getting `ERR_CONNECTION_REFUSED` errors when trying to register. The frontend is trying to connect to `localhost:3000`, which doesn't exist on the production server.

## ✅ Solution

### Step 1: Rebuild Frontend with Production API URL

1. **On your local computer**, navigate to the project:
   ```bash
   cd frontend
   ```

2. **The `.env.production` file has been created** with:
   ```
   VUE_APP_API_URL=https://dominantlogic.tech/api
   ```

3. **Rebuild the frontend**:
   ```bash
   npm run build
   ```

4. **Upload the new build** to `public_html/` on cPanel:
   - Delete old files in `public_html/` (except `.htaccess` and `backend/` folder)
   - Upload all new files from `frontend/dist/` to `public_html/`

### Step 2: Update .htaccess to Proxy API Requests

Your `.htaccess` file needs to proxy API requests to the backend. Update it in cPanel File Manager:

1. **Navigate to** `public_html/` in File Manager
2. **Edit** `.htaccess` file
3. **Replace** the content with:

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

**Note**: If `mod_proxy` is not enabled on your server, you'll need to use Option B below.

### Step 3: Verify Backend is Running

1. **In cPanel**, go to **Node.js Selector**
2. **Check** if your backend application is:
   - ✅ Created
   - ✅ Running (status should be "Running")
   - ✅ Has correct Application Root: `/home/dominan1/marketing-app/backend` (or wherever your backend is)
   - ✅ Has correct Startup File: `server.js`

3. **If not running**:
   - Click **Run NPM Install** (if dependencies aren't installed)
   - Click **Restart** to start the application

### Step 4: Check Backend Location

Based on your file structure, the backend is in `public_html/backend/`. This is **unusual** but can work. However, you need to:

1. **Verify** the Node.js Selector Application Root points to the correct location
2. **If backend is in** `public_html/backend/`, the Application Root should be:
   ```
   /home/dominan1/public_html/backend
   ```
   (Replace `dominan1` with your actual cPanel username)

### Alternative: If mod_proxy Doesn't Work

If the `.htaccess` proxy doesn't work (you'll still get connection errors), use one of these options:

#### Option A: Use Subdomain for API

1. **Create subdomain** in cPanel:
   - Go to **Subdomains**
   - Create: `api.dominantlogic.tech`
   - Point to: `/home/dominan1/api/` (or any directory)

2. **Update `.env.production`**:
   ```
   VUE_APP_API_URL=https://api.dominantlogic.tech
   ```

3. **Move backend** to the subdomain directory OR set up Node.js app for the subdomain

4. **Rebuild and redeploy** frontend

#### Option B: Use Full Backend URL from Node.js Selector

1. **Check Node.js Selector** for your backend application URL
2. **It might be something like**: `http://dominantlogic.tech:3000` or a different port
3. **Update `.env.production`** with that URL:
   ```
   VUE_APP_API_URL=http://dominantlogic.tech:3000/api
   ```
   (Use the actual URL from Node.js Selector)

4. **Rebuild and redeploy** frontend

## 🔍 Troubleshooting

### Still Getting Connection Errors?

1. **Check browser console** (F12) for exact error messages
2. **Verify backend is running**:
   - Check Node.js Selector status
   - Check backend logs in Node.js Selector
3. **Test backend directly**:
   - Try accessing: `https://dominantlogic.tech/api/auth/register` (or your backend URL)
   - Should return JSON (even if error, it means backend is reachable)
4. **Check CORS settings** in `backend/server.js`:
   - Should allow requests from `https://dominantlogic.tech`
5. **Check file permissions**:
   - `.htaccess`: 644
   - Files: 644
   - Folders: 755

### Backend Not Starting?

1. **Check `.env` file** in backend directory:
   - Must have `MONGODB_URI` set
   - Must have `JWT_SECRET` set
   - Other API keys can be placeholder for now
2. **Check Node.js Selector logs**:
   - Look for error messages
   - Common issues: missing dependencies, wrong Node.js version, MongoDB connection errors
3. **Verify MongoDB connection**:
   - Test your MongoDB URI
   - Check if IP is whitelisted (for MongoDB Atlas)

## 📋 Quick Checklist

- [ ] Frontend rebuilt with `.env.production` file
- [ ] New frontend build uploaded to `public_html/`
- [ ] `.htaccess` updated with API proxy rules
- [ ] Backend Node.js app is running in Node.js Selector
- [ ] Backend `.env` file is configured
- [ ] MongoDB connection is working
- [ ] Test registration again

## 🚀 After Fixing

Once registration works:
1. Test login
2. Test other API endpoints
3. Verify file uploads work
4. Check that all features are accessible

---

**Need more help?** Check the backend logs in Node.js Selector for specific error messages.
