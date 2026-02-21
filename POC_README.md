# Multi-Channel Marketing PWA - POC Version

## 🚀 Quick Start (No Database Required!)

This is a **Proof of Concept** version that uses **in-memory storage**. Perfect for testing and demos!

### Installation

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

4. **Register your first account:**
   - Click "Register"
   - Check "Main User (Admin)" to create an admin account
   - Fill in your details

That's it! No database setup needed! 🎉

## ⚠️ Important Notes

- **Data is stored in memory** - All data will be lost when you restart the server
- **No persistence** - This is for testing/demo purposes only
- **API Keys are optional** - The app works without them, but some features will show errors:
  - AI features (ad generation, chatbot) require OpenAI API key
  - SMS features require Twilio credentials
  - Email features require email SMTP credentials

## 🎯 What Works Out of the Box

✅ User authentication (register/login)  
✅ Client management (add/edit/delete clients)  
✅ Notes system  
✅ Data insights dashboard  
✅ File uploads (images/videos)  
✅ All UI features  

## 🔧 Optional: Add API Keys

To enable AI, SMS, and Email features, create `backend/.env`:

```env
JWT_SECRET=your-secret-key
OPENAI_API_KEY=sk-... (for AI features)
TWILIO_ACCOUNT_SID=... (for SMS)
TWILIO_AUTH_TOKEN=... (for SMS)
TWILIO_PHONE_NUMBER=... (for SMS)
EMAIL_USER=... (for Email)
EMAIL_PASS=... (for Email)
```

## 📝 Features

All features from the full version are available:
- Dashboard with statistics
- Client management (phone, email, social media, location)
- Notes that feed AI agent
- AI ad generation (with OpenAI key)
- Multi-user management
- Data insights and analytics
- AI chatbot (with OpenAI key)
- SMS marketing (with Twilio)
- Email marketing (with SMTP)

## 🆚 POC vs Full Version

| Feature | POC | Full Version |
|---------|-----|--------------|
| Storage | In-Memory | MongoDB |
| Data Persistence | ❌ Lost on restart | ✅ Persistent |
| Setup Complexity | ⚡ Simple | 🔧 Requires MongoDB |
| Best For | Testing, Demos | Production |

## 🐛 Troubleshooting

**Server won't start?**
- Make sure port 3000 and 8080 are available
- Check that Node.js is installed (v16+)

**Features not working?**
- Check browser console for errors
- Verify API keys in `.env` if using AI/SMS/Email features
- Check backend console for error messages

**Data disappeared?**
- This is normal! POC uses in-memory storage
- Restarting the server clears all data
- For persistent data, use the full version with MongoDB

## 📚 Next Steps

1. Test all features
2. Add API keys for full functionality
3. When ready for production, migrate to MongoDB version

Enjoy testing! 🎊

