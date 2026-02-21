# Deploy with SQLite (Static Database – No FreeSQLDatabase)

**This project uses the static (SQLite) database only.** No FreeSQLDatabase or other external MySQL.

You run the app with the **built-in SQLite database**; no external database signup or credentials are needed.

---

## How it works

- **SQLite** = single file database stored inside the backend (`backend/data/database.sqlite`).
- Tables are created automatically on startup via Sequelize `sync()`.
- Set **`USE_SQLITE=true`** (and do **not** set MySQL vars) to use SQLite.

---

## Local run

1. In `backend/.env` set:
   ```env
   USE_SQLITE=true
   ```
2. Start backend: `cd backend && npm install && npm start`.
3. The file `backend/data/database.sqlite` is created on first run. Register a user and use the app as usual.

---

## Deploy to Render (no external DB)

1. **Environment variables** in Render dashboard:
   - Set **`USE_SQLITE`** = `true`
   - Set **`NODE_ENV`** = `production`
   - Set **`PORT`** = `10000`
   - Set **`JWT_SECRET`** (and `FRONTEND_URL`, OpenRouter, Mailtrap, etc. as needed)
   - **Do not set** `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (they are ignored when `USE_SQLITE=true`).

2. **Deploy** as usual (e.g. push to GitHub; Render builds and runs `npm start`).

3. **Important – Render free tier:**  
   The server filesystem is **ephemeral**. The SQLite file is created at runtime but **is deleted on every new deploy or restart**. So:
   - After each deploy you start with an **empty database** (no users, no clients).
   - You must **register again** and re-add data after each deploy.
   - For **persistent data** without an external DB you’d need Render’s **persistent disk** (paid) or keep using FreeSQLDatabase/another hosted MySQL.

---

## When to use which

| Use case | Recommendation |
|----------|----------------|
| Simplest deploy, no DB signup | `USE_SQLITE=true` on Render (accept that data resets on deploy). |
| Local dev without MySQL | `USE_SQLITE=true` in `backend/.env`. |
| Persistent data on Render | Use FreeSQLDatabase (or other MySQL) and leave `USE_SQLITE` unset. |

---

## Switching back to MySQL

- Remove or set **`USE_SQLITE`** to `false`.
- Set **`DB_HOST`**, **`DB_USER`**, **`DB_PASSWORD`**, **`DB_NAME`** (and optionally **`DB_PORT`**) in `.env` or Render.
- Restart the backend; it will use MySQL again.
