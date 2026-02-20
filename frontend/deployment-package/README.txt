DEPLOYMENT INSTRUCTIONS FOR CPANEL
===================================

QUICK START:
1. Upload the entire deployment-package folder to your cPanel
2. Extract it in your desired location (e.g., /home/username/marketing-app/)

BACKEND SETUP:
1. Navigate to backend/ folder in cPanel File Manager
2. Copy .env.example to .env
3. Edit .env and fill in all your API keys and MongoDB connection
4. In cPanel, go to Node.js Selector
5. Create new application:
   - Node.js Version: 18.x or 20.x
   - Application Root: /home/username/marketing-app/backend
   - Startup File: server.js
6. Click 'Run NPM Install'
7. Click 'Restart'

FRONTEND SETUP:
1. Copy all files from frontend/ folder to your public_html/ directory
2. Or create a subdomain and point it to frontend/ folder

MONGODB SETUP:
- Recommended: Use MongoDB Atlas (free tier available)
- Get connection string and update MONGODB_URI in .env

TEST:
- Visit your domain
- Register a new account
- Check Node.js logs for any errors

For detailed instructions, see DEPLOYMENT.md
