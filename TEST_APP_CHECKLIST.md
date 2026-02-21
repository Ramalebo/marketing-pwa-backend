# Test the app – quick checklist

Use this to confirm everything works (locally or after deploy).

---

## Local URLs (when you run `npm run dev`)

- **App (frontend):** http://localhost:8081  
- **API (backend):** http://localhost:3000  

---

## 1. App loads

- [ ] Open http://localhost:8081 (or https://dominantlogic.tech if testing live)
- [ ] You see the app (sidebar “Dominant Logic”, header with page title)
- [ ] No blank page; no console errors (F12 → Console)

---

## 2. Navigation

- [ ] **Overview** (Dashboard) – shows Active Campaigns + Channel Performance
- [ ] **Campaigns** – loads
- [ ] **Analytics** – loads
- [ ] **Clients** – loads
- [ ] **Social Platforms** (Post History) – loads
- [ ] **Email** – loads
- [ ] **SMS** – loads
- [ ] Sidebar active state (green highlight) matches current page

---

## 3. Clients

- [ ] **Add Client** opens the form
- [ ] Fill Name, Phone, Email → **Save** → client appears in the table
- [ ] **Search** filters the list
- [ ] **Edit** (pencil) opens the same client in the form
- [ ] **Delete** asks for confirmation and removes the client

---

## 4. Dropdowns

- [ ] On **Clients** or **Post History** (e.g. Platform), open a dropdown
- [ ] List appears **on top** (not behind sidebar or card)
- [ ] You can select an option and it works

---

## 5. Header / user

- [ ] **New Campaign** button goes to Campaigns
- [ ] User name (or “User”) and menu work
- [ ] **Logout** goes to Dashboard (no login screen if auth is disabled)

---

## 6. API / data (if backend is running)

- [ ] Dashboard shows campaigns (or “No active campaigns”)
- [ ] Clients list loads from API (not only from local state)
- [ ] No red errors in browser **Network** tab (F12 → Network) for API calls

---

## If something fails

- **Blank page:** Check browser Console (F12) for errors
- **“Network Error” / API fails:** Backend not running or wrong URL. Local: use http://localhost:3000. Live: check `VUE_APP_API_URL` in frontend build and Render backend URL
- **Dropdowns behind content:** Hard refresh (Ctrl+F5); we fixed overlay z-index and attach to body
- **Database errors (live):** Check Render env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and that you ran `cpanel_mysql_setup.sql` in phpMyAdmin
