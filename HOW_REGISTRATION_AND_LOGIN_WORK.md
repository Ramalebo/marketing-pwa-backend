# How Registration and Login Work

This document explains how sign-up and sign-in work in your app, from the browser to the backend and the SQLite database.

---

## Overview

- **Registration:** User enters name, email, password (and optionally “Main User”). Backend creates a row in the **users** table (SQLite), hashes the password, and returns a **JWT token** + user info. Frontend stores the token and redirects to the dashboard.
- **Login:** User enters email and password. Backend finds the user, checks the password, and returns a **JWT token** + user info. Frontend stores the token and redirects to the dashboard.
- **Protected pages:** Every API call that needs “logged in” sends the token in the `Authorization` header. The backend verifies the token and loads the user; if the token is missing or invalid, it returns 401 and the frontend redirects to the login page.

---

## 1. Registration flow

### User action

1. User opens **https://dominantlogic.tech** (or your frontend URL).
2. Clicks **“Register”** on the login card.
3. Fills in: **Full Name**, **Email**, **Password**, and optionally **“Main User (Admin)”**.
4. Clicks **“Create Account”**.

### Frontend (Vue)

1. **Login.vue** calls `this.$store.dispatch('register', this.registerForm)` with `{ name, email, password, isMainUser }`.
2. **Store** (`store/index.js`) sends `POST /auth/register` to the backend (e.g. `https://marketing-pwa-backend.onrender.com/api/auth/register`).
3. When the response is successful:
   - Store saves **token** and **user** in Vuex state and **localStorage**.
   - Axios default header is set: `Authorization: Bearer <token>`.
   - Router redirects to **/dashboard**.

### Backend (Node/Express)

1. **Route:** `POST /api/auth/register` in `backend/routes/auth.js`.
2. Backend:
   - Normalizes email (lowercase, trim).
   - Checks if that email already exists in the **users** table (SQLite). If yes → `400 User already exists`.
   - Creates a new **User** with Sequelize: `User.create({ email, password, name, isMainUser, role })`.
   - **User model** has a `beforeCreate` hook that **hashes the password** with bcrypt (plain password is never stored).
   - Generates a **JWT** with `jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })`.
   - Responds with `201` and body: `{ token, user: { id, email, name, role, isMainUser } }` (no password).

### Database (SQLite)

- One new row is inserted into the **users** table in `backend/data/database.sqlite`.
- Stored fields include: `id`, `email`, **hashed password**, `name`, `role`, `is_main_user`, `is_active`, `createdAt`, `updatedAt`.

So: **registration = one new user in SQLite + JWT and user info returned and stored in the browser.**

---

## 2. Login flow

### User action

1. User is on the login page.
2. Enters **Email** and **Password**.
3. Clicks **“Sign In”**.

### Frontend (Vue)

1. **Login.vue** calls `this.$store.dispatch('login', this.loginForm)` with `{ email, password }`.
2. **Store** sends `POST /auth/login` to the backend.
3. On success:
   - Store saves **token** and **user** in state and **localStorage**.
   - Sets `Authorization: Bearer <token>` for future requests.
   - Router redirects to **/dashboard**.

### Backend (Node/Express)

1. **Route:** `POST /api/auth/login` in `backend/routes/auth.js`.
2. Backend:
   - Finds user by email: `User.findOne({ where: { email } })` in SQLite.
   - If no user → `401 Invalid credentials`.
   - Compares password with `user.comparePassword(password)` (bcrypt compare).
   - If wrong password → `401 Invalid credentials`.
   - If `!user.isActive` → `401 Account is inactive`.
   - Generates JWT (same as registration): `jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })`.
   - Responds with `200` and `{ token, user: { id, email, name, role, isMainUser } }`.

So: **login = look up user in SQLite, check password, then return JWT + user info; frontend stores them and goes to dashboard.**

---

## 3. How the app “remembers” you’re logged in

- **Token** and **user** are stored in **localStorage** (and in Vuex).
- On page load, the store reads `localStorage.getItem('token')` and, if present, sets `axios.defaults.headers.common['Authorization'] = 'Bearer ' + token`.
- So every request to the API (clients, notes, chatbot, etc.) automatically sends the token.
- **Router** uses `beforeEach`: if a route has `meta: { requiresAuth: true }` and there is no token, it redirects to **/login**; if the route has `requiresGuest: true` and there is a token, it redirects to **/dashboard**.

So: **registration and login both end with “token + user in localStorage and in Vuex”; after that, the app uses the token on every API call and the router blocks or allows pages based on that.**

---

## 4. How protected API calls work

- Example: Dashboard loads data with `GET /api/clients`, `GET /api/insights`, etc.
- Frontend sends: `Authorization: Bearer <your-jwt>`.
- **Backend middleware** (`backend/middleware/auth.js`):
  - Reads the token from the `Authorization` header.
  - Verifies it with `jwt.verify(token, JWT_SECRET)` and gets `userId`.
  - Loads the user from SQLite: `User.findByPk(decoded.userId)`.
  - If user is missing or inactive → `401`.
  - Otherwise attaches `req.user` and continues; the route handler can use `req.user.id`, etc.

If the token is **expired** or **invalid**, the backend returns **401**. The frontend **axios response interceptor** catches 401, clears token/user and redirects to **/login**.

So: **after registration or login, all protected APIs use the same JWT; the backend validates it against SQLite and your JWT_SECRET.**

---

## 5. With SQLite (static database) only

- There is **no FreeSQLDatabase** (no external MySQL). All users are stored in **SQLite**: `backend/data/database.sqlite` on the server (e.g. on Render).
- **Registration** creates a row in the **users** table in that file.
- **Login** reads from that same table and checks the hashed password.
- **JWT_SECRET** on Render must match what you use to sign tokens; if you change it, existing tokens become invalid and everyone must log in again.

So: **registration and login work the same way; the only difference is that the “database” is the SQLite file on the server, not MySQL.**

---

## 6. Quick reference

| Step              | Registration | Login |
|-------------------|-------------|--------|
| User fills        | Name, email, password, (Main User) | Email, password |
| Frontend sends    | `POST /auth/register` | `POST /auth/login` |
| Backend           | Create user in SQLite, hash password, return JWT + user | Find user, check password, return JWT + user |
| Frontend then     | Store token + user, redirect to /dashboard | Same |
| Later API calls   | Send `Authorization: Bearer <token>` | Same |
| Backend checks    | JWT valid + user in SQLite + active | Same |

If you want, we can add a short “Troubleshooting” section (e.g. “User already exists”, “Invalid credentials”, “401 after deploy”) to this doc.
