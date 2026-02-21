# Multi-Channel Marketing Software (PWA)

A comprehensive Progressive Web App for multi-channel marketing with SMS, Email, AI Automation, and Third Party integrations.

## Features

- **AI Ad Generation**: Generate ads using AI with support for uploading videos and images in multiple formats
- **Client Management**: Add and manage client contact details (phone numbers, emails, social media)
- **AI Notes System**: Add notes and information that feed the AI agent for better decision making
- **Multi-User Support**: Main user can add and manage multiple users on the platform
- **Data Insights**: Analytics dashboard with customer location data
- **Chatbot**: AI-powered chatbot to respond to customers on behalf of clients
- **SMS Marketing**: Send SMS campaigns to clients
- **Email Marketing**: Create and send email campaigns
- **AI Automation**: Automated marketing workflows

## Tech Stack

- **Frontend**: Vue.js 3, Vuetify 3, Vue Router, Vuex (PWA with Service Worker)
- **Backend**: Node.js, Express
- **Database**: MySQL (production, e.g. Render) or SQLite (local dev)
- **Email**: Nodemailer (domain SMTP, e.g. mail.dominantlogic.tech)
- **AI**: OpenRouter (optional; Chatbot, Ad generation, Hashtags)
- **SMS**: SMSProvider or similar (optional)

## Production (Render already in place)

- **Backend** runs on **Render** (Node.js Web Service). Root directory: `backend`. Health check: `/health`.
- **Database**: MySQL (set `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` in Render Environment).
- **Frontend** is built and hosted separately (e.g. cPanel at **dominantlogic.tech**). It calls the Render API via `VUE_APP_API_URL`.

**Documentation (Render already in place):**
- **DEPLOY_TO_RENDER.md** – Render env vars (DB, SMTP, FRONTEND_URL, JWT_SECRET), health check, redeploy and frontend build/upload.
- **LOCAL_AND_DEPLOY.md** – Run locally and deploy overview (points to DEPLOY_TO_RENDER.md for production).
- **backend/.env.example** – All optional env vars (OpenRouter, SMS, Facebook/Meta, etc.).

## Installation (local development)

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
- Copy `backend/.env.example` to `backend/.env` and fill in your credentials (for local: `USE_SQLITE=true` and `JWT_SECRET` are enough to start).

3. Run development servers:
```bash
npm run dev
```
- Frontend: http://localhost:8080 (uses backend at http://localhost:3000)
- See **LOCAL_AND_DEPLOY.md** for full local and deployment steps.

## Project Structure

```
AppCode/
├── frontend/          # Vue.js frontend application
├── backend/           # Express.js backend API (deployed to Render)
├── render.yaml        # Render blueprint (rootDir: backend)
├── package.json       # Root package.json
└── README.md
```

