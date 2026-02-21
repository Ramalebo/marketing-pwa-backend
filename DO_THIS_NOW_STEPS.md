# What to Do Now – Step by Step

Follow these steps in order. No FreeSQLDatabase – we use the static (SQLite) database only.

---

## Part 1: Render (backend) – use SQLite only

### Step 1: Open Render

1. Go to **https://dashboard.render.com**
2. Log in
3. Click your **backend service** (e.g. `marketing-pwa-backend`)

---

### Step 2: Open Environment

1. In the left sidebar, click **Environment**
2. You’ll see the list of environment variables

---

### Step 3: Set these variables

Add or edit each of these (exact names, no spaces before/after values):

| Key | Value |
|-----|--------|
| `USE_SQLITE` | `true` |
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | `58b0ba887188b6fc517ac2593c4b8a235611751047e46be8c165f2a56f45d9c8` *(or your own long random string)* |
| `FRONTEND_URL` | `https://dominantlogic.tech` |

- For each row: click **Add Environment Variable** (or **Edit** if it exists), type **Key** and **Value**, then save.

---

### Step 4: Remove all MySQL variables

**Delete** these if they exist (click the variable → Delete / trash icon):

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Do not leave any of these set. We use static (SQLite) only.

---

### Step 5: Save and redeploy

1. Click **Save Changes** if Render shows it
2. Render will redeploy (wait 1–3 minutes)
3. In the left sidebar, click **Logs**
4. Wait until you see:
   - `Connected to SQLite database`
   - `Database models synchronized`
   - `Server running on port 10000`

If you still see “MySQL” or “Access denied”, go back to Step 3 and Step 4 and make sure `USE_SQLITE` is `true` and all `DB_*` variables are **deleted**, then trigger **Manual Deploy** → **Deploy latest commit**.

---

## Part 2: Frontend (cPanel) – upload the built site

### Step 6: Open cPanel

1. Log in to your **cPanel** (for dominantlogic.tech)
2. Open **File Manager**
3. Go to **public_html** (or the folder that serves your site)

---

### Step 7: Upload the frontend build

1. On your computer, open the folder: **`frontend/dist`** (inside your project)
2. Select **all** files and folders inside `dist` (e.g. `index.html`, `js/`, `css/`, `fonts/`, `logo.png`, `manifest.json`, `service-worker.js`, etc.)
3. In cPanel File Manager, **upload** them into **public_html**
4. When asked, choose **Overwrite** existing files

---

### Step 8: Check .htaccess (for Vue Router)

1. In **public_html**, look for a file named **`.htaccess`**
2. If it’s **missing**, create it (New File → name: `.htaccess`) and put this inside:

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

3. If it **exists**, make sure it has the lines above (or similar) so that direct URLs like `/dashboard` work

---

## Part 3: Test

### Step 9: Test the site

1. Open a browser and go to **https://dominantlogic.tech**
2. You should see the app (login/register page)
3. Click **Register** and create an account (e.g. name, email, password)
4. After registering, log in
5. Try: Dashboard, add a client, open Chatbot – everything should load and call the API

---

### Step 10: If something fails

- **Site doesn’t load or blank page:** Check that all files from `frontend/dist` are in `public_html` and that `index.html` is there
- **“Network error” or API errors:** In Render → **Logs**, check that you see `Connected to SQLite database` and no MySQL errors; in the browser press F12 → **Network** and see if requests to `https://marketing-pwa-backend.onrender.com/api/...` succeed
- **Still “Access denied” or MySQL in logs:** In Render → **Environment**, remove every `DB_*` variable, set `USE_SQLITE` = `true`, save, then **Manual Deploy** again

---

## Quick checklist

- [ ] Render: `USE_SQLITE` = `true`, `NODE_ENV`, `PORT`, `JWT_SECRET`, `FRONTEND_URL` set
- [ ] Render: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` **all deleted**
- [ ] Render: Save → redeploy → Logs show “Connected to SQLite database”
- [ ] cPanel: All contents of `frontend/dist` uploaded to `public_html`
- [ ] cPanel: `.htaccess` present (with rewrite rules)
- [ ] Browser: https://dominantlogic.tech loads, register/login works, app works

When all boxes are done, you’re finished.
