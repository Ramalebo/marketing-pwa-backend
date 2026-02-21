# GitHub deployment

## Push code to GitHub

From the project root:

```bash
git add .
git commit -m "Your message (e.g. Schedule posts, dropdown fixes, deploy workflow)"
git push origin master
```

If your default branch on GitHub is `main`:

```bash
git push origin master:main
```

Or use the existing script:

```bash
npm run push
```

(After committing; that script pushes `master` to both `origin/master` and `origin/main`.)

---

## Automatic build on push

A **GitHub Actions** workflow runs on every push to `master` or `main`:

1. **Workflow:** `.github/workflows/deploy.yml`
2. **What it does:** Installs dependencies, builds the frontend, creates `dist-cpanel.zip`.
3. **Artifact:** The zip is uploaded as an artifact for **30 days**.

### Download the deploy zip from GitHub

1. Open your repo: **https://github.com/Ramalebo/marketing-pwa-backend**
2. Go to **Actions**.
3. Click the latest **“Build and package for deploy”** run (green check).
4. Scroll to **Artifacts** and download **dist-cpanel**.
5. Unzip and upload the contents to your cPanel `public_html` (or your host’s web root).

You can also run the workflow manually: **Actions** → **Build and package for deploy** → **Run workflow**.

---

## Backend (e.g. Render)

If you use **Render** (or similar) with GitHub:

1. Connect the repo in the Render dashboard.
2. Set **Root Directory** to `backend` if the service expects the backend at the root.
3. Build: `npm install`
4. Start: `npm start` (or `node server.js` / your start script).
5. Each push to `master`/`main` will trigger a new deploy.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Push code: `git add . && git commit -m "..." && git push origin master` |
| 2 | Frontend zip is built automatically; download from **Actions** → Artifacts. |
| 3 | Upload the zip contents to cPanel (or your static host). |
| 4 | Backend deploys automatically if Render/repo is connected. |
