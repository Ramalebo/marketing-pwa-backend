# How to Run SQL Schema in phpMyAdmin

## 🎯 Step-by-Step Guide

### Step 1: Access phpMyAdmin in cPanel

1. **In cPanel**, look at the top-right corner for **"Search Tools (/)"** search box
2. **Type**: `phpmyadmin` or `php`
3. **Click** on **"phpMyAdmin"**

**OR** manually find it:
- Look in **"Databases"** section
- Click **"phpMyAdmin"** icon

---

### Step 2: Select Your Database

1. **In phpMyAdmin**, look at the **left sidebar**
2. **You'll see a list of databases** (they start with `dominan1_`)
3. **Click** on your database: **`dominan1_marketing_pwa`**
4. **The database will expand** and show existing tables (if any)

---

### Step 3: Open SQL Tab

1. **At the top of phpMyAdmin**, you'll see several tabs:
   - Structure
   - SQL ← **Click this one!**
   - Search
   - Insert
   - Export
   - Import
   - etc.
2. **Click** the **"SQL"** tab

---

### Step 4: Paste SQL Schema

1. **In the SQL tab**, you'll see a large text box
2. **Open** the file: `backend/database/schema.sql`
3. **Copy ALL the content** from that file
4. **Paste it** into the SQL text box in phpMyAdmin

**IMPORTANT**: 
- Remove the `CREATE DATABASE` and `USE` lines since your database already exists
- Start from the first `CREATE TABLE` statement

---

### Step 5: Execute the SQL

1. **After pasting**, scroll down
2. **Click** the **"Go"** button (usually at the bottom right)
3. **Wait** a few seconds
4. **You should see**: "7 queries executed successfully" or similar

---

### Step 6: Verify Tables Created

1. **Look at the left sidebar** under `dominan1_marketing_pwa`
2. **You should see these tables**:
   - ✅ `users`
   - ✅ `clients`
   - ✅ `notes`
   - ✅ `ads`
   - ✅ `customer_contacts`
   - ✅ `post_history`
   - ✅ `templates`

---

## 📋 SQL to Run (Without CREATE DATABASE)

Since your database already exists, use this version:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  isMainUser BOOLEAN DEFAULT FALSE,
  createdBy INT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  businessName VARCHAR(255) NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  socialMediaFacebook VARCHAR(255) NULL,
  socialMediaInstagram VARCHAR(255) NULL,
  socialMediaTwitter VARCHAR(255) NULL,
  socialMediaLinkedin VARCHAR(255) NULL,
  socialMediaWebsite VARCHAR(255) NULL,
  locationAddress TEXT NULL,
  locationCity VARCHAR(100) NULL,
  locationState VARCHAR(100) NULL,
  locationCountry VARCHAR(100) NULL,
  locationZipCode VARCHAR(20) NULL,
  locationLat DECIMAL(10, 8) NULL,
  locationLng DECIMAL(11, 8) NULL,
  tags TEXT NULL,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_createdBy (createdBy),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  clientId INT NULL,
  category ENUM('general', 'preference', 'interaction', 'campaign', 'other') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  aiRelevant BOOLEAN DEFAULT TRUE,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  type ENUM('image', 'video', 'carousel', 'story') NOT NULL,
  aiGenerated BOOLEAN DEFAULT FALSE,
  aiPrompt TEXT NULL,
  contentImages TEXT NULL,
  contentVideos TEXT NULL,
  contentText TEXT NULL,
  status ENUM('draft', 'pending', 'approved', 'published', 'archived') DEFAULT 'draft',
  clientId INT NULL,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer Contacts table
CREATE TABLE IF NOT EXISTS customer_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phoneNumber VARCHAR(50) NOT NULL,
  clientId INT NOT NULL,
  tags TEXT NULL,
  notes TEXT NULL,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clientId (clientId),
  INDEX idx_createdBy (createdBy),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post History table
CREATE TABLE IF NOT EXISTS post_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  adId INT NOT NULL,
  platform ENUM('facebook', 'instagram', 'whatsapp') NOT NULL,
  postId VARCHAR(255) NULL,
  status ENUM('success', 'failed', 'pending') DEFAULT 'pending',
  message TEXT NULL,
  error TEXT NULL,
  publishedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdBy INT NOT NULL,
  FOREIGN KEY (adId) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_adId (adId),
  INDEX idx_platform (platform),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('email', 'sms', 'social') NOT NULL,
  subject VARCHAR(255) NULL,
  content TEXT NOT NULL,
  variables TEXT NULL,
  createdBy INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_type (type),
  INDEX idx_createdBy (createdBy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 🆘 Troubleshooting

### Can't Find phpMyAdmin:
- **Search** in cPanel: Type "phpmyadmin" in search box
- **Look** in "Databases" section
- **Ask** your hosting provider if phpMyAdmin is available

### Database Not Showing:
- **Refresh** the page
- **Check** you're logged into the correct cPanel account
- **Verify** database name: `dominan1_marketing_pwa`

### SQL Errors:
- **Check** for syntax errors (missing semicolons, quotes, etc.)
- **Run tables one at a time** if bulk execution fails
- **Check** error message for specific issues

### "Table already exists":
- **This is OK!** The `IF NOT EXISTS` clause prevents errors
- **Tables are created** successfully

---

## ✅ After Running SQL

1. **Verify** all 7 tables appear in left sidebar
2. **Click** on a table (e.g., `users`) to see its structure
3. **Update** your backend `.env` file with MySQL credentials:
   ```
   DB_HOST=localhost
   DB_NAME=dominan1_marketing_pwa
   DB_USER=dominan1_Onka
   DB_PASSWORD=your_database_password
   ```
4. **Restart** your backend in Node.js Selector
5. **Check logs** for: "Connected to MySQL database"

---

**Once tables are created, your app is ready to use MySQL! 🎉**
