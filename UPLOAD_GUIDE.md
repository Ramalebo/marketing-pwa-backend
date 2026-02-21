# Step-by-Step Upload Guide for cPanel

## 📦 Step 1: Create ZIP File

1. **Open File Explorer** and navigate to:
   ```
   C:\temp\AppCode\
   ```

2. **Right-click** on the `deployment-package` folder

3. Select **"Send to"** > **"Compressed (zipped) folder"**

4. This will create `deployment-package.zip` in the same location

5. **Wait** for the ZIP file to be created (may take a minute)

---

## 🌐 Step 2: Access cPanel

1. Go to your cPanel login page (usually: `https://domains.co.za:2083` or your domain's cPanel URL)

2. **Log in** with your cPanel credentials

3. Once logged in, you'll see the cPanel dashboard

---

## 📤 Step 3: Upload ZIP File to cPanel

### Option A: Using File Manager (Recommended)

1. In cPanel, find and click **"File Manager"**

2. Navigate to your **home directory** (usually `/home/username/` or `/home/dominan1/`)

3. Click **"Upload"** button at the top

4. Click **"Select File"** or drag and drop `deployment-package.zip`

5. **Wait** for upload to complete (may take a few minutes depending on file size)

6. Once uploaded, you'll see `deployment-package.zip` in your file list

### Option B: Using FTP (Alternative)

1. Use an FTP client (FileZilla, WinSCP, etc.)

2. Connect to your server using FTP credentials

3. Navigate to your home directory

4. Upload `deployment-package.zip`

---

## 📂 Step 4: Extract the ZIP File

1. In **File Manager**, locate `deployment-package.zip`

2. **Right-click** on the ZIP file

3. Select **"Extract"** or **"Extract All"**

4. Choose extraction location (recommended: `/home/username/marketing-app/`)

5. Click **"Extract Files"**

6. **Wait** for extraction to complete

7. You should now see a `deployment-package` folder with:
   - `backend/` folder
   - `frontend/` folder
   - Documentation files

---

## ⚙️ Step 5: Set Up Backend

### 5.1 Create .env File

1. Navigate to `deployment-package/backend/` in File Manager

2. You should see `.env.example` file

3. **Right-click** on `.env.example` and select **"Copy"**

4. **Right-click** in the same folder and select **"Paste"**

5. **Rename** the copied file to `.env` (remove `.example`)

6. **Right-click** on `.env` and select **"Edit"** or **"Code Edit"**

7. **Fill in** all the required values:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketing-pwa
JWT_SECRET=your-super-secret-random-string-here
OPENAI_API_KEY=sk-your-openai-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-token
INSTAGRAM_ACCOUNT_ID=your-instagram-id
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
VUE_APP_API_URL=https://yourdomain.co.za
```

8. **Save** the file

### 5.2 Set Up Node.js Application

1. In cPanel, find and click **"Node.js Selector"** or **"Setup Node.js App"**

2. Click **"Create Application"** button

3. Fill in the form:
   - **Node.js Version:** Select **18.x** or **20.x** (latest LTS)
   - **Application Mode:** Production
   - **Application Root:** `/home/username/marketing-app/backend` (or your path)
   - **Application URL:** `/` or leave default
   - **Application Startup File:** `server.js`
   - **Application Entry Point:** `server.js`

4. Click **"Create"**

5. After creation, you'll see your application listed

6. Click **"Run NPM Install"** button (this installs all dependencies)

7. **Wait** for installation to complete (may take 2-5 minutes)

8. Click **"Restart"** button to start the application

---

## 🌍 Step 6: Set Up Frontend

### Option A: Deploy to Main Domain

1. In File Manager, navigate to `public_html/` (or your domain's root)

2. **Delete** any existing files (or backup first)

3. Navigate to `deployment-package/frontend/`

4. **Select all files** (Ctrl+A or Cmd+A)

5. **Copy** all files

6. Navigate back to `public_html/`

7. **Paste** all files

8. **Verify** `.htaccess` file is there (it should be included)

### Option B: Deploy to Subdomain (Recommended)

1. In cPanel, go to **"Subdomains"**

2. Create a new subdomain (e.g., `app.yourdomain.co.za`)

3. Point it to a folder like `/home/username/app/`

4. Copy all files from `deployment-package/frontend/` to that folder

5. Make sure `.htaccess` is included

---

## 🔒 Step 7: Set Up SSL Certificate

1. In cPanel, go to **"SSL/TLS Status"**

2. Select your domain

3. Click **"Run AutoSSL"** or install **Let's Encrypt** certificate

4. **Wait** for certificate installation

5. Enable **"Force HTTPS Redirect"** if available

---

## 🗄️ Step 8: Set Up MongoDB

### Using MongoDB Atlas (Recommended - Free Tier Available)

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Sign up** for a free account

3. Create a new **Cluster** (choose free tier)

4. Create a **Database User**:
   - Username: `marketing-app`
   - Password: (create a strong password)
   - Save the password!

5. **Whitelist IP Address**:
   - Click "Network Access"
   - Add your server's IP address
   - Or add `0.0.0.0/0` for testing (less secure)

6. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `marketing-pwa`

7. **Update .env file** with the connection string:
   ```
   MONGODB_URI=mongodb+srv://marketing-app:yourpassword@cluster0.xxxxx.mongodb.net/marketing-pwa?retryWrites=true&w=majority
   ```

---

## ✅ Step 9: Test the Application

1. **Visit your domain** in a browser:
   - Main domain: `https://yourdomain.co.za`
   - Or subdomain: `https://app.yourdomain.co.za`

2. You should see the **Login/Register** page

3. **Register a new account** (this will be your main user)

4. **Check backend logs**:
   - In Node.js Selector, click on your application
   - View logs for any errors

5. **Test features**:
   - Create a client
   - Add a note
   - Create an ad
   - Test the dashboard

---

## 🔧 Troubleshooting

### Backend Not Starting

1. **Check logs** in Node.js Selector
2. **Verify .env file** has all required variables
3. **Check MongoDB connection** - ensure IP is whitelisted
4. **Verify PORT** - make sure port 3000 is available

### Frontend Not Loading

1. **Check .htaccess** file is in the root directory
2. **Verify all files** were uploaded correctly
3. **Check browser console** for errors (F12)
4. **Clear browser cache** and try again

### MongoDB Connection Error

1. **Verify connection string** in .env file
2. **Check IP whitelist** in MongoDB Atlas
3. **Test connection** from your server
4. **Check username/password** are correct

### API Not Working

1. **Verify VUE_APP_API_URL** in .env matches your domain
2. **Check backend is running** (Node.js application status)
3. **Verify CORS** settings in server.js
4. **Check browser network tab** for API errors

---

## 📞 Need Help?

- Check `DEPLOYMENT.md` for detailed instructions
- Check `DEPLOYMENT_SUMMARY.md` for quick reference
- Review backend logs in Node.js Selector
- Check cPanel error logs

---

## 🎉 Success Checklist

- [ ] ZIP file created
- [ ] Uploaded to cPanel
- [ ] Extracted successfully
- [ ] .env file created and configured
- [ ] Node.js application created
- [ ] Dependencies installed (npm install)
- [ ] Backend started
- [ ] Frontend files uploaded
- [ ] .htaccess file in place
- [ ] SSL certificate installed
- [ ] MongoDB connected
- [ ] Application accessible via browser
- [ ] Can register/login
- [ ] Can create clients/ads

---

**You're all set! 🚀**
