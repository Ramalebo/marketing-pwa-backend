# Backend Setup Guide for cPanel

## ⚠️ Important: Backend Location

The **backend folder should NOT be in `public_html`**. It needs to be in a separate location and run as a Node.js application.

## 📁 Recommended Structure

```
/home/dominan1/
├── marketing-app/
│   └── backend/          ← Backend goes here
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       ├── uploads/
│       ├── server.js
│       ├── package.json
│       └── .env
└── public_html/          ← Frontend goes here
    ├── index.html
    ├── .htaccess
    ├── css/
    ├── js/
    └── fonts/
```

---

## 📂 STEP 1: Move Backend to Correct Location

### In cPanel File Manager:

1. **Navigate to**: `/home/dominan1/` (root of your home directory)

2. **Check if you have** `deployment-package` folder:
   - If yes, go to `deployment-package/backend/`
   - If no, you need to upload and extract first

3. **Create backend location**:
   - Click **"+ Folder"** button
   - Name it: `marketing-app`
   - Click **"Create"**
   - Open `marketing-app` folder
   - Create another folder inside: `backend`

4. **Move backend files**:
   - Go to `deployment-package/backend/` (or wherever your backend files are)
   - **Select all files** (Ctrl+A or click "Select All")
   - Click **"Move"** button
   - Navigate to `/home/dominan1/marketing-app/backend/`
   - Click **"Move Files"**

5. **Verify** you have these in `/home/dominan1/marketing-app/backend/`:
   - `models/` folder
   - `routes/` folder
   - `middleware/` folder
   - `server.js`
   - `package.json`
   - `.env.example`

---

## ⚙️ STEP 2: Create .env File

1. **Navigate to**: `/home/dominan1/marketing-app/backend/`

2. **Find** `.env.example` file

3. **Copy it**:
   - Right-click `.env.example`
   - Select **"Copy"**
   - Right-click in same folder
   - Select **"Paste"**

4. **Rename**:
   - Right-click the copied file
   - Select **"Rename"**
   - Change name to `.env` (remove `.example`)

5. **Edit** `.env` file:
   - Right-click `.env`
   - Select **"Edit"** or **"Code Edit"**
   - Fill in your values (see configuration below)

---

## 🔧 STEP 3: Configure .env File

**Required Configuration:**

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketing-pwa?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-change-this
OPENAI_API_KEY=sk-your-openai-api-key-here
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-app-password
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
INSTAGRAM_ACCOUNT_ID=your-instagram-account-id
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
VUE_APP_API_URL=https://dominantlogic.tech
```

**Important Notes:**
- `VUE_APP_API_URL` should be: `https://dominantlogic.tech`
- `MONGODB_URI` - Get from MongoDB Atlas (see MongoDB setup below)
- `JWT_SECRET` - Use a long random string (at least 32 characters)
- Other API keys are optional but needed for those features

6. **Save** the file

---

## 🚀 STEP 4: Set Up Node.js Application in cPanel

1. **In cPanel**, find **"Node.js Selector"** or **"Setup Node.js App"**
   - Usually in "Software" section
   - Or search for "Node.js" in cPanel search

2. **Click "Create Application"** button

3. **Fill in the form**:
   ```
   Node.js Version: 18.x or 20.x (choose latest LTS)
   Application Mode: Production
   Application Root: /home/dominan1/marketing-app/backend
   Application URL: / (or leave default)
   Application Startup File: server.js
   Application Entry Point: server.js
   ```

4. **Click "Create"**

5. **After creation**, you'll see your application in the list

6. **Install Dependencies**:
   - Find your application in the list
   - Click **"Run NPM Install"** button
   - Wait 2-5 minutes for installation
   - You should see "Installation completed successfully"

7. **Start Application**:
   - Click **"Restart"** button
   - Application should start

8. **Check Status**:
   - Application should show as "Running"
   - Click **"View Logs"** to see startup messages
   - Should see: "Server running on port 3000"
   - Should see: "Connected to MongoDB" (if MongoDB is configured)

---

## 🗄️ STEP 5: Set Up MongoDB (If Not Done)

### Quick MongoDB Atlas Setup:

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Sign up** for free account
3. **Create Cluster** (choose free M0 tier)
4. **Create Database User**:
   - Click "Database Access"
   - Click "Add New Database User"
   - Username: `marketing-app`
   - Password: Create strong password (SAVE IT!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Network Access**:
   - Click "Network Access"
   - Click "Add IP Address"
   - For testing: Add `0.0.0.0/0` (allows all IPs - less secure)
   - OR add your server's IP address (more secure)
   - Click "Confirm"

6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" and version "5.5 or later"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

7. **Update .env file**:
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://marketing-app:yourpassword@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority`

---

## ✅ STEP 6: Verify Backend is Running

1. **Check Node.js Application Status**:
   - In Node.js Selector, your app should show "Running"
   - Status should be green/active

2. **View Logs**:
   - Click on your application
   - Click "View Logs" or check "Error Log"
   - Should see:
     ```
     Connected to MongoDB
     Server running on port 3000
     ```

3. **Test API** (optional):
   - Try accessing: `https://dominantlogic.tech:3000/api/` (if port is accessible)
   - Or test from frontend once it's set up

---

## 🔍 Troubleshooting Backend Issues

### Backend Won't Start:

1. **Check .env file**:
   - Make sure all required fields are filled
   - No typos in values
   - MongoDB URI is correct

2. **Check Logs**:
   - View error logs in Node.js Selector
   - Look for specific error messages

3. **Common Errors**:
   - **MongoDB Connection Error**: Check connection string, IP whitelist
   - **Port Already in Use**: Change PORT in .env to different port
   - **Module Not Found**: Run "Run NPM Install" again

### MongoDB Connection Issues:

1. **Verify Connection String**:
   - Check username and password are correct
   - Check database name is included
   - Check IP is whitelisted in MongoDB Atlas

2. **Test Connection**:
   - Try connecting from MongoDB Compass (desktop app)
   - Or test from Node.js terminal

---

## 📋 Backend Checklist

- [ ] Backend folder moved to `/home/dominan1/marketing-app/backend/`
- [ ] `.env` file created from `.env.example`
- [ ] `.env` file configured with all values
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string added to `.env`
- [ ] Node.js application created in cPanel
- [ ] Application Root points to `/home/dominan1/marketing-app/backend`
- [ ] Startup File is `server.js`
- [ ] NPM Install completed successfully
- [ ] Application is running
- [ ] Logs show "Connected to MongoDB"
- [ ] Logs show "Server running on port 3000"

---

## 🎯 Next Steps

Once backend is running:
1. ✅ Backend is set up and running
2. ⏭️ Frontend is already in `public_html/` (I can see it's there)
3. ⏭️ Fix the 403 error (see Frontend Setup Guide)
4. ⏭️ Test the application

---

**Your backend should be at: `/home/dominan1/marketing-app/backend/`**
