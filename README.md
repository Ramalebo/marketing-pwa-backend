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

- **Frontend**: Vue.js 3, Vuetify 3, Vue Router, Vuex
- **Backend**: Node.js, Express, In-Memory Storage (POC)
- **PWA**: Service Worker, Web App Manifest
- **AI**: OpenAI Integration (optional)
- **SMS**: Twilio (optional)
- **Email**: Nodemailer (optional)

**Note:** This is a POC version using in-memory storage. Data will be lost on server restart.

## Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables:
- Copy `backend/.env.example` to `backend/.env` and fill in your credentials

3. Run development servers:
```bash
npm run dev
```
   - Frontend: http://localhost:8080 (uses backend at http://localhost:3000)
   - See **LOCAL_AND_DEPLOY.md** for local run and deployment steps.

## Project Structure

```
AppCode/
├── frontend/          # Vue.js frontend application
├── backend/           # Express.js backend API
├── package.json       # Root package.json
└── README.md
```

