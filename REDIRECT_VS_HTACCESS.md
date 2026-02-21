# Redirects vs .htaccess - What You Need

## ⚠️ Important: You DON'T Need Redirects Page

The **Redirects** page in cPanel is for simple URL redirects (like redirecting `old-page.html` to `new-page.html`).

For a **Vue.js application**, you need **`.htaccess`** file instead, NOT redirects.

---

## 🔄 What Each Does

### Redirects Page (What you're looking at):
- **Purpose**: Simple URL redirects
- **Example**: Redirect `www.example.com/old` → `www.example.com/new`
- **Use case**: Moving pages, changing URLs
- **NOT for**: Single Page Applications (SPA) like Vue.js

### .htaccess File (What you NEED):
- **Purpose**: Server configuration and routing
- **For Vue.js**: Routes all requests to `index.html` for client-side routing
- **Location**: In `public_html/` folder
- **Required**: Yes, for Vue Router to work

---

## ✅ What You Should Do

### Option 1: Skip Redirects Page (Recommended)

**You don't need to set up anything on the Redirects page.**

Instead:
1. **Go to File Manager**
2. **Navigate to** `public_html/`
3. **Create/Edit** `.htaccess` file (see below)

### Option 2: Set Up www Redirect (Optional)

If you want to redirect `www.dominantlogic.tech` → `dominantlogic.tech` (or vice versa):

1. **On Redirects page**:
   - **Type**: Permanent (301)
   - **Source**: `dominantlogic.tech`
   - **Path**: Leave empty (for root)
   - **Redirects to**: `https://dominantlogic.tech` (or `https://www.dominantlogic.tech`)
   - **www. redirection**: Choose your preference
   - Click **"Add"**

**But this is optional** - your `.htaccess` can handle this too.

---

## 📝 Create .htaccess File Instead

### In File Manager:

1. **Navigate to**: `public_html/`

2. **Create `.htaccess` file**:
   - Click **"+ File"**
   - Name: `.htaccess` (with the dot)
   - Click **"Create"**

3. **Edit `.htaccess`**:
   - Right-click `.htaccess`
   - Select **"Edit"** or **"Code Edit"**
   - Paste this content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Force HTTPS (optional but recommended)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Force non-www (optional - choose www or non-www)
  RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
  RewriteRule ^(.*)$ https://%1/$1 [R=301,L]
  
  # API Proxy - forward /api/* to backend
  RewriteCond %{REQUEST_URI} ^/api
  RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
  
  # Vue Router - redirect all requests to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

4. **Save** the file

---

## 🎯 Summary

### For Your Vue.js App:

✅ **DO THIS**:
- Create `.htaccess` in `public_html/`
- Configure it for Vue Router
- Set up API proxy if needed

❌ **DON'T DO THIS**:
- Don't set up redirects on the Redirects page (unless you want www redirect)
- Don't redirect your main domain
- Don't use redirects for routing

---

## 🔍 If You Still Want www Redirect

If you want to force `www.dominantlogic.tech` → `dominantlogic.tech`:

**On Redirects Page:**
- **Type**: Permanent (301)
- **Source**: `www.dominantlogic.tech`
- **Path**: `/` (or leave empty)
- **Redirects to**: `https://dominantlogic.tech`
- **www. redirection**: "Only redirect with www."
- Click **"Add"**

**OR** use `.htaccess` (already included in the code above).

---

## ✅ Action Items

1. **Close the Redirects page** (you don't need it)
2. **Go to File Manager**
3. **Create `.htaccess`** in `public_html/`
4. **Paste the configuration** above
5. **Save** and test your site

---

**The `.htaccess` file is what you need, not the Redirects page! 🚀**
