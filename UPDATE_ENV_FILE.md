# Update Backend .env File

## ✅ Your MySQL Credentials

- **Database Name**: `dominan1_marketing_pwa`
- **Database User**: `dominan1_Onka`
- **Database Password**: `43MYhu32bBJ5qmc`
- **Database Host**: `localhost`
- **Database Port**: `3306`

---

## 📝 Step-by-Step: Update .env File

### Step 1: Access File Manager in cPanel

1. **In cPanel**, go to **"Files"** section
2. **Click**: **"File Manager"**

---

### Step 2: Navigate to Backend Folder

1. **In File Manager**, navigate to:
   - `/home/dominan1/public_html/backend/`
   - OR wherever your backend folder is located

---

### Step 3: Create or Edit .env File

1. **Look for** `.env` file in the backend folder
2. **If it exists**: Click on it → Click **"Edit"**
3. **If it doesn't exist**: Click **"New File"** → Name it `.env` → Click **"Create"**

---

### Step 4: Add MySQL Configuration

**Copy and paste this into your `.env` file:**

```env
PORT=3000
NODE_ENV=production

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc

# JWT Secret (CHANGE THIS to a random secure string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API Key
OPENAI_API_KEY=your-openai-api-key

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Facebook/Instagram API Configuration
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-access-token
FACEBOOK_PAGE_ID=your-facebook-page-id

# Instagram Business Account
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-account-id

# WhatsApp Business API Configuration
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=your-whatsapp-business-account-id

# Frontend URL
FRONTEND_URL=https://dominantlogic.tech
```

**Important Notes:**
- ✅ **MySQL credentials are already filled in** (DB_NAME, DB_USER, DB_PASSWORD)
- ⚠️ **Keep your existing API keys** if you already have them configured
- ⚠️ **Change JWT_SECRET** to a random secure string (for security)

---

### Step 5: Save the File

1. **Click**: **"Save Changes"** or **"Save"**
2. **Close** the editor

---

## 🔄 Next Steps

### 1. Install Dependencies

1. **In cPanel**, go to **Node.js Selector**
2. **Find your backend application**
3. **Click**: **"Run NPM Install"**
4. **Wait** for installation to complete (this installs `sequelize` and `mysql2`)

---

### 2. Restart Backend

1. **In Node.js Selector**, click **"Restart"**
2. **Wait** 10-20 seconds
3. **Click**: **"View Logs"**

---

### 3. Check Logs

**Look for these success messages:**
- ✅ `Connected to MySQL database`
- ✅ `Database models synchronized`
- ✅ `Server running on port 3000`

**If you see errors:**
- ❌ `Access denied for user` → Check username and password
- ❌ `Unknown database` → Check database name
- ❌ `Cannot find module 'sequelize'` → Run NPM Install again

---

## ✅ Verification

1. **Test Registration**: Try registering a new user on your website
2. **Check Database**: In phpMyAdmin, check the `users` table - you should see new data
3. **Test Other Features**: Create clients, notes, ads, etc.

---

## 🔒 Security Reminder

- ✅ **Never commit `.env` file to Git**
- ✅ **Keep your database password secure**
- ✅ **Change JWT_SECRET to a random string**
- ✅ **Don't share your `.env` file publicly**

---

**Once your backend restarts and shows "Connected to MySQL database", your app is ready! 🎉**
