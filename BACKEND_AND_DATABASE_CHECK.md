# Backend & Database Setup - Step by Step Guide

## 🔍 Part 1: Check if Backend is Running

### Step 1: Find Node.js Selector in cPanel

1. **In cPanel**, look at the top-right corner for **"Search Tools (/)"** search box
2. **Type**: `node` or `nodejs` or `application`
3. **Click** on **"Setup Node.js App"** or **"Node.js Selector"**

**OR** manually find it:
- Look in **"Software"** section
- Or **"Advanced"** section
- Or use the search bar at the top

---

### Step 2: Check Backend Status

1. **In Node.js Selector**, you'll see a list of applications
2. **Look for your backend app** (might be named "marketing-app" or similar)
3. **Check the Status column**:
   - ✅ **"Running"** = Backend is active
   - ❌ **"Stopped"** = Backend is not running
   - ⚠️ **"Error"** = Backend has an error

---

### Step 3: View Backend Logs

1. **Find your backend application** in the list
2. **Click** on the application name or **"View Logs"** button
3. **Check the logs** for:
   - ✅ `Connected to MongoDB` = Database connected successfully
   - ✅ `Server running on port 3000` = Backend is running
   - ❌ `MongoDB connection error` = Database connection failed
   - ❌ `Error: Cannot find module` = Missing dependencies

---

## 🚀 Part 2: Make Sure Backend is Running

### If Backend is NOT Running:

#### Option A: Start the Backend

1. **In Node.js Selector**, find your backend app
2. **Click** the **"Start"** or **"Restart"** button
3. **Wait** 10-20 seconds
4. **Refresh** the page - status should show "Running"

#### Option B: Create Backend Application (If it doesn't exist)

1. **In Node.js Selector**, click **"Create Application"**
2. **Fill in the details**:
   - **Node.js Version**: Select `18.x` or `20.x` (LTS version)
   - **Application Root**: `/home/dominan1/public_html/backend` (or wherever your backend is)
   - **Application URL**: Leave default or set to `/api`
   - **Application Startup File**: `server.js`
   - **Application Mode**: Production
3. **Click** **"Create"**
4. **Click** **"Run NPM Install"** (if dependencies aren't installed)
5. **Click** **"Restart"** to start the application

---

### If Backend Shows Errors:

#### Check Common Issues:

1. **Missing Dependencies**:
   - Click **"Run NPM Install"** in Node.js Selector
   - Wait for installation to complete
   - Click **"Restart"**

2. **Missing .env File**:
   - Go to **File Manager**
   - Navigate to your backend folder: `/home/dominan1/public_html/backend/`
   - Check if `.env` file exists
   - If not, create it (see Part 3 below)

3. **Database Connection Error**:
   - Check MongoDB connection string in `.env` file
   - Verify MongoDB Atlas is set up (see Part 3)

4. **Wrong Application Root**:
   - In Node.js Selector, check **"Application Root"**
   - Should point to: `/home/dominan1/public_html/backend/`
   - Update if incorrect

---

## 🗄️ Part 3: Create Database (MongoDB)

**IMPORTANT**: Your cPanel shows MySQL/MariaDB options, but your app uses **MongoDB**. cPanel typically doesn't have MongoDB built-in, so you need to use **MongoDB Atlas** (cloud database - FREE).

---

### Step 1: Create MongoDB Atlas Account

1. **Go to**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Click**: "Try Free" or "Sign Up"
3. **Sign up** with your email
4. **Verify** your email

---

### Step 2: Create Free Cluster

1. **After login**, click **"Build a Database"**
2. **Choose**: **"M0 FREE"** (Free Shared Cluster)
3. **Cloud Provider**: Choose closest region (e.g., AWS)
4. **Region**: Choose closest to South Africa (e.g., `eu-west-1` - Europe)
5. **Cluster Name**: Leave default or name it `marketing-cluster`
6. **Click**: **"Create"**
7. **Wait** 3-5 minutes for cluster to be created

---

### Step 3: Create Database User

1. **In MongoDB Atlas**, you'll see security prompts
2. **Click**: **"Create Database User"**
3. **Authentication Method**: Password
4. **Username**: `marketing-user` (or your choice)
5. **Password**: 
   - Click **"Autogenerate Secure Password"** 
   - **IMPORTANT**: Copy and save this password!
6. **Database User Privileges**: "Atlas admin" (default)
7. **Click**: **"Create Database User"**

---

### Step 4: Whitelist IP Address

1. **In MongoDB Atlas**, click **"Network Access"** (left sidebar)
2. **Click**: **"Add IP Address"**
3. **Click**: **"Allow Access from Anywhere"** button
   - This sets IP to `0.0.0.0/0`
   - **Note**: Less secure but works for testing
4. **Click**: **"Confirm"**
5. **Wait** 1-2 minutes

---

### Step 5: Get Connection String

1. **In MongoDB Atlas**, click **"Database"** (left sidebar)
2. **Click**: **"Connect"** button on your cluster
3. **Choose**: **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. **Copy** the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 6: Update Connection String

1. **Replace** `<username>` with your database username (e.g., `marketing-user`)
2. **Replace** `<password>` with your database password
3. **Add database name**: Replace `?retryWrites=true&w=majority` with `/marketing-pwa?retryWrites=true&w=majority`

**Final connection string should look like**:
```
mongodb+srv://marketing-user:YourPassword123@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority
```

---

### Step 7: Add to Backend .env File

1. **In cPanel File Manager**, navigate to:
   - `/home/dominan1/public_html/backend/`
2. **Find or create** `.env` file
3. **Add or update** these lines:
   ```env
   PORT=3000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://marketing-user:YourPassword123@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```
   (Replace with your actual MongoDB connection string)
4. **Save** the file

---

### Step 8: Restart Backend

1. **Go back to Node.js Selector** in cPanel
2. **Find your backend application**
3. **Click**: **"Restart"**
4. **Wait** 10-20 seconds
5. **Click**: **"View Logs"**
6. **Look for**: `Connected to MongoDB` message

---

## ✅ Verification Checklist

### Backend Status:
- [ ] Node.js Selector shows backend as "Running"
- [ ] Logs show "Server running on port 3000"
- [ ] Logs show "Connected to MongoDB"
- [ ] No error messages in logs

### Database Status:
- [ ] MongoDB Atlas account created
- [ ] Cluster created and running
- [ ] Database user created
- [ ] IP address whitelisted (0.0.0.0/0)
- [ ] Connection string added to `.env` file
- [ ] Backend logs show "Connected to MongoDB"

---

## 🔧 Troubleshooting

### Backend Won't Start:
1. **Check logs** in Node.js Selector
2. **Run NPM Install** if dependencies are missing
3. **Check Application Root** is correct
4. **Verify** `server.js` exists in backend folder

### Database Connection Fails:
1. **Check** connection string in `.env` file
2. **Verify** username and password are correct
3. **Check** IP address is whitelisted in MongoDB Atlas
4. **Wait** 1-2 minutes after whitelisting IP
5. **Check** backend logs for specific error messages

### 503 Service Unavailable Error:
- This means backend is not running or not accessible
- **Fix**: Start backend in Node.js Selector
- **Fix**: Check `.htaccess` has API proxy rules
- **Fix**: Verify backend is on port 3000

---

## 🎯 Quick Summary

1. **Check Backend**: Node.js Selector → Find app → Check status
2. **Start Backend**: Node.js Selector → Click "Start" or "Restart"
3. **Create Database**: MongoDB Atlas (free) → Create cluster → Get connection string
4. **Add to .env**: File Manager → backend/.env → Add MONGODB_URI
5. **Restart Backend**: Node.js Selector → Restart → Check logs

**Once backend shows "Running" and logs show "Connected to MongoDB", your app should work! 🎉**
