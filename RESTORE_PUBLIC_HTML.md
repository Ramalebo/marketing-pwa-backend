# Restore public_html (cPanel)

Your `public_html` folder was deleted. Follow these steps to recreate it and put your site back.

---

## Step 1: Create the folder

1. In **cPanel** open **File Manager**.
2. Go to **`/home/dominan1`** (your home directory – click the house icon or type that path and click **Go**).
3. Click **+ Folder**.
4. Enter the name exactly: **`public_html`**
5. Click **Create New Folder**.

---

## Step 2: Set permissions (optional but recommended)

1. Right‑click **`public_html`** → **Change Permissions** (or select it and click Permissions).
2. Set to **755** (owner: read/write/execute; group and others: read/execute).
3. Save.

---

## Step 3: Upload your site

1. Open the **`public_html`** folder (double‑click it).
2. Click **Upload**.
3. Upload **all contents** of your **`frontend/dist/`** folder from your computer:
   - `index.html` (in the root of dist)
   - `js/` folder (with all files inside)
   - `css/` folder (with all files inside)
   - `img/` or other asset folders if present
   - `.htaccess` (if you have one in dist – needed for SPA routing)
   - Any other files/folders that are inside `dist/`
4. Upload the **contents** of `dist/`, not the `dist` folder itself. So inside `public_html` you should see `index.html`, `js/`, `css/`, etc. directly.

---

## Step 4: Add .htaccess for the app (if missing)

If your Vue app uses client-side routing, you need a `.htaccess` so the server serves `index.html` for all routes.

1. Inside **`public_html`**, click **+ File**.
2. File name: **`.htaccess`** (include the dot).
3. Edit the file and paste this:

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

4. Save.

---

## Step 5: Test

Open **https://dominantlogic.tech** (or your domain that points to this account). You should see your app.

---

## If your domain points elsewhere

Some setups use a subdomain or addon domain with its own folder (e.g. `public_html/dominantlogic.tech` or `marketing-app`). If your host told you to use a different folder for your domain, create that folder under `public_html` (or where they said) and upload the same `dist` contents there instead.
