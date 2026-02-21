# Deployment Guide for cPanel (domains.co.za)

This guide will help you deploy the Multi-Channel Marketing Platform to your cPanel hosting on domains.co.za.

## Prerequisites

1. cPanel access to your domains.co.za account
2. Node.js support (Node.js Selector in cPanel)
3. MongoDB database (MongoDB can be set up through cPanel or use MongoDB Atlas)
4. SSH access (if available) or Terminal access in cPanel

## Step 1: Prepare Your Application

### 1.1 Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This will create a `dist` folder in the `frontend` directory with the production-ready files.

### 1.2 Install Backend Dependencies

```bash
cd backend
npm install --production
```

## Step 2: Upload Files to cPanel

### 2.1 Using File Manager

1. Log into your cPanel account
2. Navigate to **File Manager**
3. Go to your domain's root directory (usually `public_html` or `domains/yourdomain.co.za/public_html`)
4. Create a new folder called `marketing-app` (or your preferred name)
5. Upload the following structure:

```
marketing-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   └── dist/  (all files from frontend/dist)
└── .htaccess
```

### 2.2 Using SSH/Terminal (Recommended)

If you have SSH access, you can use `scp` or `rsync`:

```bash
# From your local machine
scp -r backend/ your-username@domains.co.za:/home/your-username/marketing-app/
scp -r frontend/dist/* your-username@domains.co.za:/home/your-username/marketing-app/frontend/
```

## Step 3: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your server IP address
5. Get your connection string

### Option B: Local MongoDB (if available in cPanel)

1. Check if MongoDB is available in your cPanel
2. Create a database through cPanel
3. Note the connection details

## Step 4: Configure Environment Variables

1. In cPanel File Manager, navigate to `marketing-app/backend/`
2. Create a `.env` file (or edit if it exists)
3. Add the following configuration:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketing-pwa
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
INSTAGRAM_ACCOUNT_ID=your-instagram-account-id
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
VUE_APP_API_URL=https://yourdomain.co.za
```

**Important:** Replace all placeholder values with your actual credentials.

## Step 5: Set Up Node.js Application

### 5.1 Using Node.js Selector in cPanel

1. In cPanel, find **Node.js Selector**
2. Click **Create Application**
3. Configure:
   - **Node.js Version:** Select the latest LTS version (18.x or 20.x)
   - **Application Root:** `/home/your-username/marketing-app/backend`
   - **Application URL:** `/` or `/api` (depending on your setup)
   - **Application Startup File:** `server.js`
   - **Passenger Log File:** Leave default or set custom path
4. Click **Create**

### 5.2 Install Dependencies

1. In the Node.js Selector, find your application
2. Click **Run NPM Install**
3. Or use Terminal/SSH:

```bash
cd ~/marketing-app/backend
npm install --production
```

## Step 6: Configure .htaccess for Frontend

Create or edit `.htaccess` in your `public_html` or domain root:

```apache
# Redirect all requests to index.html for Vue Router
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# API Proxy (if needed)
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

## Step 7: Set Up Application Structure

### Recommended Structure:

```
/home/your-username/
├── marketing-app/
│   ├── backend/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── uploads/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env
│   └── frontend/
│       └── dist/
└── public_html/ (or domains/yourdomain.co.za/public_html/)
    └── (frontend files copied here)
```

### Copy Frontend Files:

```bash
# Copy frontend dist files to public_html
cp -r ~/marketing-app/frontend/dist/* ~/public_html/
```

## Step 8: Start the Application

### 8.1 Using Node.js Selector

1. In Node.js Selector, find your application
2. Click **Restart** or **Start**

### 8.2 Using Terminal/SSH

```bash
cd ~/marketing-app/backend
node server.js
```

### 8.3 Using PM2 (Recommended for Production)

If PM2 is available:

```bash
npm install -g pm2
cd ~/marketing-app/backend
pm2 start server.js --name marketing-app
pm2 save
pm2 startup
```

## Step 9: Configure Domain/Subdomain

### Option A: Main Domain

If deploying to main domain:
- Frontend files go in `public_html/`
- Backend runs on a subdomain or port

### Option B: Subdomain (Recommended)

1. Create subdomain `app.yourdomain.co.za` in cPanel
2. Point it to `marketing-app/frontend/dist`
3. Backend API can be at `api.yourdomain.co.za` or same domain with `/api` path

## Step 10: Update Frontend API URL

1. Edit `frontend/dist/index.html` or rebuild with correct API URL
2. Or set environment variable before building:

```bash
cd frontend
VUE_APP_API_URL=https://yourdomain.co.za npm run build
```

## Step 11: Set Up SSL Certificate

1. In cPanel, go to **SSL/TLS Status**
2. Install Let's Encrypt certificate for your domain
3. Force HTTPS redirect

## Step 12: Create Uploads Directory

```bash
mkdir -p ~/marketing-app/backend/uploads
chmod 755 ~/marketing-app/backend/uploads
```

## Step 13: Test the Application

1. Visit your domain: `https://yourdomain.co.za`
2. Try to register/login
3. Check backend logs for any errors

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check MongoDB URI in `.env`
   - Verify network access (whitelist IP in MongoDB Atlas)
   - Check MongoDB service is running

2. **Port Already in Use**
   - Change PORT in `.env` to an available port
   - Check if another application is using port 3000

3. **Module Not Found**
   - Run `npm install` in backend directory
   - Check `package.json` dependencies

4. **Permission Denied**
   - Set correct file permissions:
     ```bash
     chmod 755 ~/marketing-app/backend
     chmod 644 ~/marketing-app/backend/.env
     ```

5. **Frontend Not Loading**
   - Check `.htaccess` configuration
   - Verify files are in correct directory
   - Check browser console for errors

## Maintenance

### Update Application:

1. Upload new files
2. Run `npm install` if dependencies changed
3. Restart Node.js application
4. Clear browser cache

### View Logs:

- Node.js logs: Check in Node.js Selector or PM2 logs
- Application logs: Check `backend/logs/` if configured
- Error logs: Check cPanel Error Log

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS (SSL certificate installed)
- [ ] Keep `.env` file secure (not in public directory)
- [ ] Regularly update dependencies
- [ ] Use strong MongoDB credentials
- [ ] Limit API access if possible
- [ ] Set up firewall rules if available

## Support

For issues specific to domains.co.za hosting, contact their support team.

For application-specific issues, check the logs and error messages.
