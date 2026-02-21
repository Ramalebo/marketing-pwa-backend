# 📦 Files to Upload to cPanel

## 🎯 Location to Upload From:
**`C:\temp\AppCode\frontend\dist\`**

## 🎯 Location to Upload To:
**cPanel `public_html/`** (your website root)

---

## ✅ Files and Folders to Upload:

### **Upload ALL of these:**

1. **`index.html`** ← Main HTML file
2. **`.htaccess`** ← Important! For routing
3. **`logo.png`** ← Your logo
4. **`manifest.json`** ← PWA manifest
5. **`service-worker.js`** ← Service worker
6. **`workbox-49cd14e3.js`** ← Service worker helper
7. **`css/` folder** ← Upload entire folder with all CSS files
8. **`js/` folder** ← Upload entire folder with all JS files
9. **`fonts/` folder** ← Upload entire folder with all font files

### **Optional (but recommended):**
- All `.map` files (for debugging)

---

## 📋 Step-by-Step Upload Instructions:

### 1. **Open cPanel File Manager**
   - Log into your cPanel
   - Click "File Manager"

### 2. **Navigate to `public_html/`**
   - This is your website root

### 3. **Delete Old Files (Optional - Backup First!)**
   - Select all files in `public_html/`
   - Right-click → "Compress" (to backup)
   - Then delete old files

### 4. **Upload New Files**
   - Go to: `C:\temp\AppCode\frontend\dist\`
   - **Select ALL files and folders:**
     - `index.html`
     - `.htaccess`
     - `logo.png`
     - `manifest.json`
     - `service-worker.js`
     - `workbox-49cd14e3.js`
     - `css/` folder (entire folder)
     - `js/` folder (entire folder)
     - `fonts/` folder (entire folder)
   - Drag and drop OR use "Upload" button
   - Upload to `public_html/`

### 5. **Verify Upload**
   After upload, `public_html/` should contain:
   ```
   public_html/
   ├── index.html
   ├── .htaccess
   ├── logo.png
   ├── manifest.json
   ├── service-worker.js
   ├── workbox-49cd14e3.js
   ├── css/
   │   └── (all CSS files)
   ├── js/
   │   └── (all JS files)
   └── fonts/
       └── (all font files)
   ```

---

## ⚠️ Important Notes:

- ✅ **Upload the ENTIRE `dist/` folder contents**
- ✅ **Make sure `.htaccess` is uploaded** (it's hidden by default on Windows)
- ✅ **Upload folders as folders** (not individual files from inside)
- ✅ **After upload, test:** `https://dominantlogic.tech`

---

## 🚀 Quick Upload:

**Easiest method:**
1. Open `C:\temp\AppCode\frontend\dist\` in Windows Explorer
2. Select ALL files and folders (Ctrl+A)
3. Compress to ZIP
4. Upload ZIP to cPanel `public_html/`
5. Extract ZIP in cPanel
6. Delete ZIP file

---

**That's it! Upload everything from `frontend/dist/` to `public_html/`!** ✅
