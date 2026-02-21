# Test Meta compliance (privacy & data deletion) locally

Quick steps to run the backend and verify the URLs you will add in Meta App Basic Settings.

## 1. Create local `.env`

In the **backend** folder:

```bash
cd backend
copy .env.example .env
```

(On macOS/Linux: `cp .env.example .env`.)

## 2. Set your Facebook App credentials in `.env`

Edit `backend/.env` and set at least:

```env
FACEBOOK_APP_ID=1246834607297359
FACEBOOK_APP_SECRET=5223073f147c67e8b7572ad2dc3f20e6
```

Add or change other variables as needed (e.g. `USE_SQLITE=true`, `JWT_SECRET`, `PORT=3000`).

## 3. Install dependencies and start the backend

```bash
cd backend
npm install
npm run dev
```

Wait until you see: `Server running on port 3000` (or your `PORT`).

## 4. Test the compliance URLs

In your browser, open:

| What | URL |
|------|-----|
| **Test/health** (lists all URLs) | http://localhost:3000/api/meta/ok |
| **Privacy policy** | http://localhost:3000/api/meta/privacy |
| **Data deletion instructions** | http://localhost:3000/api/meta/data-deletion |

- **`/api/meta/ok`** – Returns JSON with `ok: true` and the full URLs. Use this to confirm the server is running and that `FACEBOOK_APP_SECRET` is set (`appSecretConfigured: true`).
- **`/api/meta/privacy`** – HTML privacy policy page.
- **`/api/meta/data-deletion`** – HTML data deletion instructions page.

## 5. Use these URLs in Meta Dashboard

For **local testing only**, Meta cannot open `http://localhost:...`. So in Meta App Basic Settings you must use a **public** URL:

- Deploy your backend (e.g. to Render), then use:
  - Privacy policy URL: `https://YOUR_BACKEND_URL/api/meta/privacy`
  - User data deletion: `https://YOUR_BACKEND_URL/api/meta/data-deletion`

To test the **content** of the pages locally, use the `http://localhost:3000/api/meta/...` URLs in your browser. Once you’re happy, deploy and paste the `https://...` versions into Meta.

## Troubleshooting

- **"Cannot GET /api/meta/ok"** – Backend not running or wrong port. Run `npm run dev` from `backend` and use the port shown in the log.
- **`appSecretConfigured: false`** – `FACEBOOK_APP_SECRET` is missing or wrong in `backend/.env`. Fix and restart the server.
- **CORS or 404 from frontend** – The compliance pages are meant to be opened in a new tab or used as URLs in Meta; the frontend can link to them if needed.
