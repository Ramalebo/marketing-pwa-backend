# Step-by-Step Upload Guide - Live Instructions

Based on your cPanel setup, here's exactly what to do:

## 📦 STEP 1: Prepare Your ZIP File (On Your Computer)

1. **Go to**: `C:\temp\AppCode\`
2. **Right-click** on `deployment-package` folder
3. **Select**: "Send to" > "Compressed (zipped) folder"
4. **Wait** for `deployment-package.zip` to be created
5. **Note the location** of the ZIP file

---

## 📤 STEP 2: Upload to cPanel File Manager

### In Your cPanel File Manager (which you have open):

1. **Navigate to**: `/home/dominan1/` (you're already there!)

2. **Click the "Upload" button** at the top toolbar

3. **Click "Select File"** or drag and drop your `deployment-package.zip`

4. **Wait** for upload to complete (you'll see progress)

5. **Once uploaded**, you'll see `deployment-package.zip` in your file list

---

## 📂 STEP 3: Extract the ZIP File

1. **Find** `deployment-package.zip` in your file list

2. **Right-click** on `deployment-package.zip`

3. **Select "Extract"** or "Extract All"

4. **Choose location**: Extract to `/home/dominan1/` (current directory)

5. **Click "Extract Files"**

6. **Wait** for extraction (may take a minute)

7. **You should now see** a `deployment-package` folder with:
   - `backend/` folder
   - `frontend/` folder
   - Documentation files

---

## ⚙️ STEP 4: Move Files to Application Folder

I see you already have an `Application` folder in `public_html`. Let's organize:

### Option A: Use Existing Application Structure

1. **Navigate to**: `public_html/Application/` (you can see it in your file tree)

2. **Backend Setup**:
   - Go to `/home/dominan1/deployment-package/backend/`
   - **Select all files** (Ctrl+A)
   - **Copy** them
   - Navigate to `/home/dominan1/` (or create `/home/dominan1/marketing-app/backend/`)
   - **Paste** the backend files there

3. **Frontend Setup**:
   - Go to `/home/dominan1/deployment-package/frontend/`
   - **Select all files** (Ctrl+A)
   - **Copy** them
   - Navigate to `public_html/Application/frontend/` (or `public_html/`)
   - **Paste** all frontend files there

### Option B: Create New Structure (Recommended)

1. **In File Manager**, navigate to `/home/dominan1/`

2. **Create folder**: Click "+ Folder" button, name it `marketing-app`

3. **Move backend**:
   - Go to `deployment-package/backend/`
   - Select all files
   - **Move** them to `/home/dominan1/marketing-app/backend/`

4. **Move frontend**:
   - Go to `deployment-package/frontend/`
   - Select all files
   - **Move** them to `public_html/` (for main domain)
   - OR to `public_html/Application/frontend/` (if using subfolder)

---

## 🔧 STEP 5: Configure Backend (.env File)

1. **Navigate to** your backend folder (e.g., `/home/dominan1/marketing-app/backend/`)

2. **Find** `.env.example` file

3. **Right-click** > **"Copy"**

4. **Right-click** in same folder > **"Paste"**

5. **Rename** the copied file:
   - Right-click on the copy
   - Select "Rename"
   - Change name to `.env` (remove `.example`)

6. **Edit** `.env` file:
   - Right-click on `.env`
   - Select "Edit" or "Code Edit"
   - Fill in your values (see below)

### Required .env Values:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketing-pwa
JWT_SECRET=change-this-to-a-random-secret-key
OPENAI_API_KEY=sk-your-key-here
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FACEBOOK_APP_ID=your-id
FACEBOOK_APP_SECRET=your-secret
FACEBOOK_ACCESS_TOKEN=your-token
INSTAGRAM_ACCOUNT_ID=your-id
WHATSAPP_PHONE_NUMBER_ID=your-id
WHATSAPP_ACCESS_TOKEN=your-token
VUE_APP_API_URL=https://dominantlogic.tech
```

**Important**: 
- Replace `VUE_APP_API_URL` with your actual domain: `https://dominantlogic.tech`
- Get MongoDB connection string from MongoDB Atlas
- Add your API keys

7. **Save** the file

---

## 🚀 STEP 6: Set Up Node.js Application

1. **In cPanel**, find **"Node.js Selector"** or **"Setup Node.js App"**

2. **Click "Create Application"**

3. **Fill in the form**:
   ```
   Node.js Version: 18.x or 20.x (latest LTS)
   Application Mode: Production
   Application Root: /home/dominan1/marketing-app/backend
   Application URL: / (or leave default)
   Application Startup File: server.js
   ```

4. **Click "Create"**

5. **After creation**, you'll see your app listed

6. **Click "Run NPM Install"** button
   - This installs all dependencies
   - Wait 2-5 minutes

7. **Click "Restart"** to start the application

8. **Check logs** to ensure it started successfully

---

## 🌐 STEP 7: Set Up Frontend

### For Main Domain (dominantlogic.tech):

1. **Navigate to**: `public_html/` in File Manager

2. **Copy all files** from `deployment-package/frontend/` to `public_html/`

3. **Make sure** `.htaccess` file is included

4. **Verify** these files are in `public_html/`:
   - `index.html`
   - `.htaccess`
   - `js/` folder
   - `css/` folder
   - `fonts/` folder
   - `manifest.json`

### For Subdomain (if using):

1. Create subdomain in cPanel (e.g., `app.dominantlogic.tech`)

2. Point it to a folder like `/home/dominan1/app/`

3. Copy frontend files there

---

## 🔒 STEP 8: Set Up SSL Certificate

1. **In cPanel**, go to **"SSL/TLS Status"**

2. **Select** `dominantlogic.tech`

3. **Click "Run AutoSSL"** or install **Let's Encrypt**

4. **Wait** for installation

5. **Enable "Force HTTPS Redirect"** if available

---

## 🗄️ STEP 9: Set Up MongoDB (If Not Done)

### Quick MongoDB Atlas Setup:

1. **Go to**: https://www.mongodb.com/cloud/atlas

2. **Sign up** (free account)

3. **Create Cluster** (choose free tier)

4. **Create Database User**:
   - Username: `marketing-app`
   - Password: (create strong password - SAVE IT!)

5. **Network Access**:
   - Click "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (for testing) OR your server IP
   - Click "Confirm"

6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `marketing-pwa`

7. **Update .env file** with the connection string

---

## ✅ STEP 10: Test Your Application

1. **Visit**: `https://dominantlogic.tech` (or your domain)

2. **You should see**: Login/Register page

3. **Register** a new account (this becomes your main user)

4. **Check backend**:
   - In Node.js Selector, view logs
   - Should see "Server running on port 3000"
   - Should see "Connected to MongoDB"

5. **Test features**:
   - Create a client
   - Add a note
   - Create an ad
   - View dashboard

---

## 🔍 Troubleshooting

### If Frontend Doesn't Load:

1. **Check** `.htaccess` is in `public_html/`
2. **Verify** all files were uploaded
3. **Clear browser cache** (Ctrl+F5)
4. **Check browser console** (F12) for errors

### If Backend Doesn't Start:

1. **Check logs** in Node.js Selector
2. **Verify** `.env` file has all values
3. **Check** MongoDB connection string
4. **Verify** PORT 3000 is available

### If API Calls Fail:

1. **Check** `VUE_APP_API_URL` in `.env` matches your domain
2. **Verify** backend is running
3. **Check** CORS settings
4. **View** browser Network tab (F12) for errors

---

## 📞 Quick Reference

- **Backend Location**: `/home/dominan1/marketing-app/backend/`
- **Frontend Location**: `public_html/` (for main domain)
- **Domain**: `dominantlogic.tech`
- **Node.js App**: Set up in Node.js Selector
- **MongoDB**: Use MongoDB Atlas (free tier)

---

**You're ready! Follow these steps one by one. 🚀**
