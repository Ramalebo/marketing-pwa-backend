# Upload Frontend to cPanel - Quick Guide

## ✅ Frontend Built Successfully!
Your frontend is now built with the Render backend URL and ready to upload!

---

## 📋 Step-by-Step Upload Instructions

### Step 1: Locate Your Built Files

**Your built files are in:**
```
C:\temp\AppCode\frontend\dist\
```

**This folder contains:**
- `index.html`
- `js/` folder (all JavaScript files)
- `css/` folder (all CSS files)
- `fonts/` folder (if any)
- `img/` folder (if any)
- Other assets

---

### Step 2: Access cPanel File Manager

1. **Log into** your cPanel account at `domains.co.za`
2. **Click** "File Manager" in cPanel
3. **Navigate to** your domain's root directory:
   - Usually: `public_html/`
   - OR: `domains/dominantlogic.tech/public_html/`

---

### Step 3: Backup Current Files (Optional but Recommended)

**Before uploading new files:**
1. **Select all files** in `public_html/`
2. **Right-click** → "Compress" → Create a ZIP backup
3. **Name it**: `backup-2026-01-26.zip` (or today's date)

---

### Step 4: Delete Old Frontend Files

**In cPanel File Manager:**
1. **Select all files** in `public_html/` (or your domain root)
2. **Delete** them (or move to a backup folder)
3. **Keep** `.htaccess` if you have one (we'll update it if needed)

---

### Step 5: Upload New Files

**Option A: Using File Manager Upload**
1. **Click** "Upload" button in File Manager
2. **Select all files** from `C:\temp\AppCode\frontend\dist\`
3. **Upload** them to `public_html/`

**Option B: Using ZIP Upload (Faster)**
1. **On your computer**, create a ZIP of the `dist` folder contents
2. **Upload** the ZIP to `public_html/`
3. **Right-click** the ZIP → "Extract"
4. **Delete** the ZIP file after extraction

---

### Step 6: Verify .htaccess File

**Make sure you have a `.htaccess` file in `public_html/` with:**

```apache
# Redirect all requests to index.html for Vue Router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**If you don't have one:**
1. **Create** a new file called `.htaccess` in `public_html/`
2. **Paste** the code above
3. **Save**

---

### Step 7: Set Correct File Permissions

**In File Manager:**
1. **Select** `index.html`
2. **Right-click** → "Change Permissions"
3. **Set to**: `644` (read/write for owner, read for others)
4. **Apply** to all files

---

### Step 8: Test Your Site

1. **Visit**: `https://dominantlogic.tech`
2. **Open** browser Developer Tools (F12)
3. **Check Console** for any errors
4. **Try to register** a new user
5. **Check Network tab** - API calls should go to:
   - `https://marketing-pwa-backend.onrender.com/api/...`

---

## ✅ Success Checklist

- [ ] Frontend built successfully (`dist` folder created)
- [ ] Backed up old files (optional)
- [ ] Deleted old files from `public_html/`
- [ ] Uploaded all files from `dist/` to `public_html/`
- [ ] `.htaccess` file is in place
- [ ] File permissions set correctly
- [ ] Tested site at `https://dominantlogic.tech`
- [ ] API calls going to Render backend
- [ ] Registration/login working

---

## 🆘 Troubleshooting

### "404 Not Found" on Routes

**Fix:**
- Make sure `.htaccess` file exists in `public_html/`
- Check `.htaccess` has the Vue Router rewrite rules
- Verify `mod_rewrite` is enabled (usually is on cPanel)

### "API Error" or "Network Error"

**Fix:**
- Check browser console for exact error
- Verify API URL in Network tab is: `https://marketing-pwa-backend.onrender.com/api`
- Check Render backend is running (check Render logs)
- Check CORS is configured correctly in backend

### "Cannot GET /" or Blank Page

**Fix:**
- Make sure `index.html` is in `public_html/` root
- Check file permissions (should be 644)
- Clear browser cache (Ctrl+Shift+R)

### Files Not Loading (CSS/JS)

**Fix:**
- Check file paths in `index.html` are correct
- Make sure all files uploaded (check `js/` and `css/` folders exist)
- Check file permissions

---

## 🎯 What You Should See

**When everything works:**
- ✅ Site loads at `https://dominantlogic.tech`
- ✅ Vue app loads correctly
- ✅ API calls go to `https://marketing-pwa-backend.onrender.com/api`
- ✅ Registration/login works
- ✅ No console errors

---

## 🚀 You're Almost Done!

**After uploading:**
1. **Test** your site
2. **Try** registering a new user
3. **Check** if data saves to FreeSQLDatabase (via phpMyAdmin)

**Everything should be working now!** 🎉

---

## 🆘 Need Help?

**If something doesn't work:**
1. Share what error you see
2. Check browser console (F12)
3. Check Render backend logs
4. I'll help you fix it!
