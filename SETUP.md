# Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

**Note:** This is a POC version using in-memory storage. No database required!

## Installation Steps

### 1. Install Dependencies

From the root directory, run:
```bash
npm run install:all
```

This will install dependencies for:
- Root package.json
- Frontend (Vue.js)
- Backend (Express.js)

### 2. Configure Environment Variables

1. Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

2. Edit `backend/.env` and fill in your credentials (optional for POC - features will work without them but with limited functionality):

```env
PORT=3000
JWT_SECRET=your-secret-key-here-change-this
OPENAI_API_KEY=your-openai-api-key (optional - for AI features)
TWILIO_ACCOUNT_SID=your-twilio-account-sid (optional - for SMS)
TWILIO_AUTH_TOKEN=your-twilio-auth-token (optional - for SMS)
TWILIO_PHONE_NUMBER=your-twilio-phone-number (optional - for SMS)
EMAIL_HOST=smtp.gmail.com (optional - for Email)
EMAIL_PORT=587 (optional - for Email)
EMAIL_USER=your-email@gmail.com (optional - for Email)
EMAIL_PASS=your-email-password (optional - for Email)
FRONTEND_URL=http://localhost:8080
```

**Note:** For POC, you can skip API keys. The app will work but AI, SMS, and Email features will show error messages if not configured.

### 3. Run the Application

#### Development Mode (Both Frontend and Backend)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:3000
- Frontend development server on http://localhost:8080

#### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run serve
```

### 5. Create Your First Account

1. Open http://localhost:8080
2. Click "Register"
3. Check "Main User (Admin)" to create an admin account
4. Fill in your details and register

## Features Overview

### ✅ Implemented Features

1. **Dashboard** - Overview of clients, campaigns, notes, and ads
2. **Client Management** - Add/edit clients with:
   - Contact details (phone, email)
   - Social media links (Facebook, Instagram, Twitter, LinkedIn)
   - Location information
3. **Notes System** - Add notes that feed AI agent:
   - Categorize notes (general, preference, interaction, campaign)
   - Set priority levels
   - Mark as AI-relevant
   - Link to clients
4. **AI Ad Generation** - Generate ads using OpenAI:
   - Text-based ad generation
   - Upload images/videos
   - Manual ad creation
   - Link ads to clients
5. **Multi-User Support** - Main user can:
   - Add multiple users
   - Manage user roles (admin/user)
   - Activate/deactivate users
6. **Data Insights** - Analytics dashboard:
   - Total clients count
   - Clients by location
   - Contact information statistics
7. **AI Chatbot** - Customer service chatbot:
   - Responds on behalf of clients
   - Uses client context and notes
   - Personalized responses
8. **SMS Marketing** - Send SMS campaigns:
   - Single or bulk SMS
   - Quick send to clients
9. **Email Marketing** - Send email campaigns:
   - HTML and plain text support
   - Single or bulk emails

## API Integration Setup

### OpenAI (Required for AI Features)

1. Sign up at https://platform.openai.com/
2. Get your API key
3. Add to `backend/.env` as `OPENAI_API_KEY`

### Twilio (Required for SMS)

1. Sign up at https://www.twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add to `backend/.env`:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

### Email (Required for Email Marketing)

For Gmail:
1. Enable "Less secure app access" or use App Password
2. Add to `backend/.env`:
   - `EMAIL_HOST=smtp.gmail.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=your-email@gmail.com`
   - `EMAIL_PASS=your-app-password`

For other providers, update EMAIL_HOST and EMAIL_PORT accordingly.

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Backend Production

```bash
cd backend
npm start
```

Make sure to set `NODE_ENV=production` in your `.env` file.

## Troubleshooting

### API Errors
- Check that all API keys are set in .env
- Verify API credentials are valid
- Check backend console for error messages

### Frontend Not Loading
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify proxy settings in vue.config.js

### File Upload Issues
- Ensure `backend/uploads` directory exists
- Check file size limits (100MB default)
- Verify file types (images and videos only)

## Project Structure

```
AppCode/
├── frontend/          # Vue.js frontend
│   ├── src/
│   │   ├── views/    # Page components
│   │   ├── router/   # Vue Router
│   │   ├── store/    # Vuex store
│   │   └── plugins/  # Vuetify plugin
│   └── public/       # Static files
├── backend/           # Express.js backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── uploads/      # Uploaded files
└── package.json      # Root package.json
```

## Next Steps

1. Set up your API keys
2. Create your main user account
3. Add your first client
4. Create notes for AI context
5. Generate your first AI ad
6. Test SMS and Email features

