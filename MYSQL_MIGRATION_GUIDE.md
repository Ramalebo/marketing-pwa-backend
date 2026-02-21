# MySQL Migration Guide

## ✅ Conversion Complete!

Your application has been successfully converted from MongoDB to MySQL! Here's what was changed:

---

## 📋 What Was Changed

### 1. **Dependencies Updated**
- ❌ Removed: `mongoose`
- ✅ Added: `sequelize` and `mysql2`

### 2. **Database Connection**
- ✅ Created: `backend/config/database.js` - Sequelize connection
- ✅ Updated: `backend/server.js` - Uses Sequelize instead of Mongoose

### 3. **All Models Converted**
- ✅ `User.js` - Sequelize model with password hashing hooks
- ✅ `Client.js` - Sequelize model with transformed fields
- ✅ `Note.js` - Sequelize model
- ✅ `Ad.js` - Sequelize model with JSON fields for content
- ✅ `CustomerContact.js` - Sequelize model
- ✅ `PostHistory.js` - Sequelize model
- ✅ `Template.js` - Sequelize model
- ✅ `models/index.js` - Model associations and exports

### 4. **All Routes Updated**
- ✅ `auth.js` - Uses Sequelize queries
- ✅ `users.js` - Uses Sequelize queries
- ✅ `clients.js` - Uses Sequelize with data transformation
- ✅ `notes.js` - Uses Sequelize with associations
- ✅ `ads.js` - Uses Sequelize with content transformation
- ✅ `customer-contacts.js` - Uses Sequelize queries
- ✅ `templates.js` - Uses Sequelize queries
- ✅ `post-history.js` - Uses Sequelize with associations
- ✅ `chatbot.js` - Uses Sequelize models
- ✅ `insights.js` - Uses Sequelize queries
- ✅ `social-media.js` - Uses Sequelize models
- ✅ `sms.js` - Uses Sequelize models
- ✅ `email.js` - Uses Sequelize models

### 5. **Middleware Updated**
- ✅ `auth.js` - Uses Sequelize `findByPk` instead of `findById`

---

## 🗄️ Step 1: Create MySQL Database in cPanel

### Option A: Using cPanel Database Wizard

1. **In cPanel**, go to **"Databases"** section
2. **Click**: **"MySQL Database Wizard"**
3. **Step 1 - Create Database**:
   - Database Name: `marketing_pwa` (or your choice)
   - Click **"Next Step"**
4. **Step 2 - Create Database User**:
   - Username: `marketing_user` (or your choice)
   - Password: Create a strong password (save it!)
   - Click **"Create User"**
5. **Step 3 - Add User to Database**:
   - Select the user you just created
   - Select the database you just created
   - Check **"ALL PRIVILEGES"**
   - Click **"Make Changes"**
6. **Note the connection details**:
   - Database Name: `dominan1_marketing_pwa` (with your username prefix)
   - Database User: `dominan1_marketing_user` (with your username prefix)
   - Database Host: Usually `localhost` (check cPanel for exact host)

---

## 📝 Step 2: Run SQL Schema

1. **In cPanel**, go to **"Databases"** → **"phpMyAdmin"**
2. **Select your database** from the left sidebar
3. **Click** the **"SQL"** tab
4. **Copy and paste** the contents of `backend/database/schema.sql`
5. **Click** **"Go"** to execute
6. **Verify** all tables were created:
   - `users`
   - `clients`
   - `notes`
   - `ads`
   - `customer_contacts`
   - `post_history`
   - `templates`

---

## ⚙️ Step 3: Update Backend .env File

1. **In cPanel File Manager**, navigate to `/home/dominan1/public_html/backend/`
2. **Create or edit** `.env` file
3. **Add MySQL configuration**:

```env
PORT=3000
NODE_ENV=production

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_marketing_user
DB_PASSWORD=your_database_password_here

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Other API keys (OpenAI, Twilio, etc.)
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
FACEBOOK_PAGE_ID=your-facebook-page-id
INSTAGRAM_BUSINESS_ACCOUNT_ID=your-instagram-business-account-id
WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=your-whatsapp-business-account-id
FRONTEND_URL=https://dominantlogic.tech
```

**Important**: Replace:
- `DB_NAME` with your actual database name (e.g., `dominan1_marketing_pwa`)
- `DB_USER` with your actual database username (e.g., `dominan1_marketing_user`)
- `DB_PASSWORD` with your actual database password

---

## 🔄 Step 4: Install Dependencies & Restart Backend

1. **In cPanel**, go to **Node.js Selector**
2. **Find your backend application**
3. **Click**: **"Run NPM Install"** (this will install Sequelize and mysql2)
4. **Wait** for installation to complete
5. **Click**: **"Restart"** to restart the backend
6. **Click**: **"View Logs"** to check for:
   - ✅ `Connected to MySQL database`
   - ✅ `Database models synchronized`
   - ❌ Any errors

---

## ✅ Step 5: Verify Everything Works

1. **Check backend logs** - Should show "Connected to MySQL database"
2. **Test registration** - Try registering a new user
3. **Check database** - In phpMyAdmin, verify data is being created
4. **Test other features** - Create clients, notes, ads, etc.

---

## 🔧 Important Notes

### Data Structure Changes:
- **IDs**: Changed from MongoDB `_id` (ObjectId) to MySQL `id` (INTEGER)
- **Nested Objects**: Flattened to separate columns (e.g., `socialMedia.facebook` → `socialMediaFacebook`)
- **Arrays**: Stored as JSON strings in TEXT fields (e.g., `tags`, `contentImages`)
- **Timestamps**: Uses MySQL `TIMESTAMP` with auto-update

### API Response Format:
- All IDs are converted to strings for consistency with frontend
- Nested objects are reconstructed in route handlers
- Arrays are parsed from JSON strings

---

## 📋 Quick Checklist

- [ ] MySQL database created in cPanel
- [ ] Database user created and granted privileges
- [ ] SQL schema executed in phpMyAdmin
- [ ] `.env` file updated with MySQL credentials
- [ ] Dependencies installed (`npm install` in Node.js Selector)
- [ ] Backend restarted
- [ ] Logs show "Connected to MySQL database"
- [ ] Test registration works
- [ ] Data appears in phpMyAdmin

---

## 🆘 Troubleshooting

### "Access denied for user"
- **Check**: Database username and password in `.env`
- **Check**: User has privileges on the database
- **Check**: Database name includes username prefix (e.g., `dominan1_marketing_pwa`)

### "Unknown database"
- **Check**: Database name in `.env` matches the one you created
- **Check**: Database exists in phpMyAdmin

### "Table doesn't exist"
- **Run**: SQL schema script in phpMyAdmin
- **Check**: All tables were created successfully

### "Cannot find module 'sequelize'"
- **Run**: "Run NPM Install" in Node.js Selector
- **Wait**: For installation to complete

---

**Your application is now using MySQL! 🎉**
