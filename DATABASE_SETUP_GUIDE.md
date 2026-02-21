# Database Setup Guide for cPanel Hosting

## 🗄️ Setting Up MongoDB Database

Your application needs a MongoDB database. You have two options:

---

## ✅ Option A: MongoDB Atlas (Recommended - FREE)

MongoDB Atlas is a cloud database service with a free tier. This is the easiest and most reliable option.

### Step 1: Create MongoDB Atlas Account

1. **Go to**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Click**: "Try Free" or "Sign Up"
3. **Sign up** with your email (Google account works too)
4. **Verify** your email address

---

### Step 2: Create a Cluster

1. **After logging in**, you'll see "Deploy a cloud database"
2. **Choose**: "M0 FREE" (Free Shared Cluster)
3. **Select Cloud Provider**: 
   - Choose the closest region to your server (e.g., AWS, Google Cloud)
   - For South Africa, choose a region like `eu-west-1` (Europe) or closest available
4. **Cluster Name**: Leave default or name it `marketing-app-cluster`
5. **Click**: "Create Cluster"
6. **Wait** 3-5 minutes for cluster to be created

---

### Step 3: Create Database User

1. **In MongoDB Atlas**, you'll see a security prompt
2. **Click**: "Create Database User"
3. **Authentication Method**: Password
4. **Username**: `marketing-app-user` (or your choice)
5. **Password**: 
   - Click "Autogenerate Secure Password" OR create your own
   - **IMPORTANT**: Copy and save this password! You'll need it.
6. **Database User Privileges**: "Atlas admin" (default)
7. **Click**: "Create Database User"

---

### Step 4: Whitelist IP Address

1. **In MongoDB Atlas**, click "Network Access" (left sidebar)
2. **Click**: "Add IP Address"
3. **Choose one**:
   - **Option 1 (Recommended for testing)**: 
     - Click "Allow Access from Anywhere"
     - IP Address: `0.0.0.0/0`
     - **Note**: This allows access from anywhere (less secure but works for testing)
   - **Option 2 (More secure)**:
     - Find your server's IP address (ask your hosting provider or check cPanel)
     - Add that specific IP address
4. **Click**: "Confirm"
5. **Wait** 1-2 minutes for changes to take effect

---

### Step 5: Get Connection String

1. **In MongoDB Atlas**, click "Database" (left sidebar)
2. **Click**: "Connect" button on your cluster
3. **Choose**: "Connect your application"
4. **Driver**: Node.js
5. **Version**: 5.5 or later
6. **Copy** the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace** `<username>` with your database username (e.g., `marketing-app-user`)
8. **Replace** `<password>` with your database password
9. **Add database name** at the end: Replace `?retryWrites=true&w=majority` with `/marketing-pwa?retryWrites=true&w=majority`

**Final connection string should look like**:
```
mongodb+srv://marketing-app-user:YourPassword123@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority
```

---

### Step 6: Add Connection String to Your Backend

1. **In cPanel File Manager**, navigate to your backend folder:
   - Usually: `/home/your-username/marketing-app/backend/` or `/home/your-username/public_html/backend/`
2. **Find or create** `.env` file
3. **Add or update** this line:
   ```env
   MONGODB_URI=mongodb+srv://marketing-app-user:YourPassword123@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority
   ```
   (Replace with your actual connection string)
4. **Save** the file

---

## 🔍 Option B: Check if cPanel Has MongoDB

Some hosting providers offer MongoDB directly in cPanel.

### Step 1: Check cPanel for MongoDB

1. **Log into cPanel**
2. **Look for**:
   - "MongoDB Databases"
   - "Database Tools" → "MongoDB"
   - "Remote MySQL" or "Database" section
3. **If you see MongoDB option**:
   - Create a new MongoDB database
   - Note the connection details
   - Use the connection string in your `.env` file

### Step 2: If MongoDB is NOT Available

- **Use MongoDB Atlas** (Option A above) - it's free and works perfectly

---

## ✅ Verify Database Connection

### Test Connection from Backend

1. **In cPanel**, go to **Node.js Selector**
2. **Find your backend application**
3. **Click**: "View Logs" or "Logs"
4. **Look for**: `Connected to MongoDB` message
5. **If you see errors**, check:
   - Connection string is correct
   - Password is correct (no extra spaces)
   - IP address is whitelisted
   - Database name is correct

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 FREE tier)
- [ ] Database user created (username and password saved)
- [ ] IP address whitelisted (0.0.0.0/0 for testing)
- [ ] Connection string copied
- [ ] Connection string updated in backend `.env` file
- [ ] Backend restarted in Node.js Selector
- [ ] Connection verified in logs

---

## 🔧 Common Issues

### "Authentication failed"
- **Check**: Username and password are correct
- **Check**: No extra spaces in connection string
- **Check**: Password doesn't contain special characters that need URL encoding

### "Connection timeout"
- **Check**: IP address is whitelisted in MongoDB Atlas
- **Check**: Network Access settings allow your IP
- **Try**: Using `0.0.0.0/0` for testing

### "Database not found"
- **Check**: Database name in connection string matches what you created
- **Note**: MongoDB Atlas creates the database automatically on first use

---

## 🎯 Next Steps

After setting up the database:

1. **Update `.env` file** with `MONGODB_URI`
2. **Restart backend** in Node.js Selector
3. **Test registration** - it should create users in the database
4. **Check MongoDB Atlas** → "Browse Collections" to see your data

---

**Your database is now ready! 🎉**
