# Deploy to cPanel – Do This Now

## Build and zip (already done)

From project root you ran:
```bash
npm run deploy:cpanel
```
- **Built folder:** `c:\temp\AppCode\frontend\dist\`
- **Zip file:** `c:\temp\AppCode\dist-cpanel.zip` ← upload this to cPanel

---

## Upload to cPanel (dominantlogic.tech)

### 1. Log in
- Go to your cPanel (e.g. **domains.co.za**).
- Open **File Manager**.

### 2. Go to website root
- Navigate to **public_html** (or the folder your domain **dominantlogic.tech** uses).

### 3. Backup (optional)
- Select all files in `public_html` → Right‑click → **Compress** → save as e.g. `backup-public_html-2026-02-20.zip`.

### 4. Clear old frontend
- Delete everything inside `public_html` (or move to a backup folder).
- You can keep the backup zip somewhere else if you made one.

### 5. Upload and extract
- **Upload** `c:\temp\AppCode\dist-cpanel.zip` into `public_html`.
- **Right‑click** the zip → **Extract**.
- **Delete** the zip file after extraction (so only the extracted files remain).

### 6. Check .htaccess
After extraction, `public_html` must contain a file named **`.htaccess`** (it’s inside the zip).  
If your host hides dotfiles, enable “Show hidden files” in File Manager.  
The `.htaccess` should contain (Vue Router SPA rules):
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

### 7. Test
- Open **https://dominantlogic.tech**
- Hard refresh: **Ctrl+Shift+R**
- Try login/register; API calls should go to **https://marketing-pwa-backend.onrender.com/api**

---

## Quick checklist

| Step | Done |
|------|------|
| Build + zip created (`dist-cpanel.zip`) | ✅ |
| cPanel → File Manager → `public_html` | |
| Backup current `public_html` (optional) | |
| Delete old files in `public_html` | |
| Upload `dist-cpanel.zip` → Extract → Delete zip | |
| Confirm `.htaccess` is present | |
| Test https://dominantlogic.tech | |

---

## If you need to rebuild the zip later

From project root:
```bash
npm run deploy:cpanel
```
Then upload the new `dist-cpanel.zip` to cPanel and repeat steps 4–7 above.
