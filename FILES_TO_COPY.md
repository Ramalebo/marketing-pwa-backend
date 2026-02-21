# Files to Copy After Rebuilding Frontend

## 📦 Step 1: Build the Frontend

On your local computer, run:
```bash
cd frontend
npm run build
```

This creates a `frontend/dist/` folder with all production files.

---

## 📋 Step 2: Files to Copy to `public_html/`

After building, copy **ALL files and folders** from `frontend/dist/` to `public_html/` on cPanel.

### What's in `frontend/dist/` after build:

```
dist/
├── index.html                    ← Main HTML file (REQUIRED)
├── manifest.json                 ← PWA manifest (REQUIRED)
├── service-worker.js            ← PWA service worker (REQUIRED)
├── service-worker.js.map         ← Source map (optional but recommended)
├── workbox-*.js                  ← Workbox library (REQUIRED)
├── workbox-*.js.map              ← Source map (optional but recommended)
├── css/                          ← All CSS files (REQUIRED)
│   └── app.*.css
├── js/                           ← All JavaScript files (REQUIRED)
│   ├── app.*.js
│   ├── chunk-vendors.*.js
│   └── ...
├── fonts/                        ← Font files (if any)
│   └── ...
└── img/                          ← Image assets (if any)
    └── ...
```

---

## ✅ What to Do in cPanel File Manager

### Option A: Upload All Files (Recommended)

1. **Navigate to** `public_html/` in cPanel File Manager

2. **Delete old frontend files** (but KEEP these):
   - ✅ `.htaccess` (keep this - you'll update it separately)
   - ✅ `backend/` folder (keep this - it's your backend)
   - ✅ Any other folders/files that aren't from the old frontend build

3. **Upload ALL files from** `frontend/dist/`:
   - Select all files in `frontend/dist/`
   - Upload to `public_html/`
   - **Overwrite** if prompted

### Option B: Manual Selection

If you prefer to select files manually, copy these:

**Required Files:**
- ✅ `index.html`
- ✅ `manifest.json`
- ✅ `service-worker.js`
- ✅ `service-worker.js.map` (optional)
- ✅ `workbox-*.js` (any file starting with `workbox-`)
- ✅ `workbox-*.js.map` (optional)

**Required Folders:**
- ✅ `css/` folder (with all contents)
- ✅ `js/` folder (with all contents)
- ✅ `fonts/` folder (if it exists, with all contents)
- ✅ `img/` folder (if it exists, with all contents)

---

## 🔄 Step 3: Update .htaccess

After copying files, update `.htaccess` in `public_html/`:

1. **Edit** `.htaccess` file
2. **Replace** content with the content from `HTACCESS_WITH_API_PROXY.txt`
3. **Save**

---

## ⚠️ Important Notes

### DO NOT Copy:
- ❌ `frontend/src/` folder (source code - not needed)
- ❌ `frontend/public/` folder (source files - not needed)
- ❌ `frontend/node_modules/` (dependencies - not needed)
- ❌ `frontend/.env` or `.env.production` (environment files - not needed in production)
- ❌ `frontend/package.json` or `package-lock.json` (not needed)

### DO NOT Delete:
- ❌ `backend/` folder in `public_html/` (your backend code)
- ❌ `.htaccess` (you'll update it, not delete it)

### File Permissions:
After uploading, set permissions:
- **Files**: `644` (rw-r--r--)
- **Folders**: `755` (rwxr-xr-x)

---

## 🚀 Quick Checklist

- [ ] Built frontend with `npm run build` (creates `frontend/dist/`)
- [ ] Deleted old frontend files from `public_html/` (kept `.htaccess` and `backend/`)
- [ ] Copied ALL files from `frontend/dist/` to `public_html/`
- [ ] Updated `.htaccess` with API proxy rules
- [ ] Set file permissions (644 for files, 755 for folders)
- [ ] Tested the website

---

## 📁 Final Structure in `public_html/`

After copying, your `public_html/` should look like:

```
public_html/
├── .htaccess                    ← Updated with API proxy
├── index.html                   ← From dist/
├── manifest.json                ← From dist/
├── service-worker.js            ← From dist/
├── workbox-*.js                 ← From dist/
├── css/                         ← From dist/
├── js/                          ← From dist/
├── fonts/                       ← From dist/ (if exists)
├── img/                         ← From dist/ (if exists)
└── backend/                     ← Your backend (keep this!)
    ├── server.js
    ├── routes/
    ├── models/
    └── ...
```

---

**That's it!** After copying these files and updating `.htaccess`, your frontend should work with the production API URL.
