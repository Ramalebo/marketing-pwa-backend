# Database Setup for Render Deployment

## ⚠️ Critical Issue: Render Can't Use `localhost` MySQL

**Your cPanel MySQL database uses `localhost`**, which only works on the same server. Render runs on a different server, so it **cannot connect to `localhost`**.

---

## ✅ Solution Options

### Option 1: Use Render's PostgreSQL (Easiest - FREE)

**Render offers free PostgreSQL databases!**

1. **In Render dashboard**, click **"New +"** → **"PostgreSQL"**
2. **Fill in**:
   - **Name**: `marketing-pwa-db`
   - **Database**: `marketing_pwa`
   - **User**: Auto-generated
   - **Region**: Same as your web service
   - **Plan**: **Free**
3. **Click** "Create Database"
4. **Copy** the connection details:
   - Internal Database URL (for Render services)
   - External Database URL (if needed)

**Then update your backend code to use PostgreSQL instead of MySQL:**

**Install PostgreSQL driver:**
```bash
npm install pg pg-hstore
```

**Update `backend/config/database.js`:**
```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DB_NAME,
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
```

**Update environment variables in Render:**
- Remove MySQL variables
- Add: `DATABASE_URL` = (from Render database connection string)

**Convert your MySQL schema to PostgreSQL:**
- Most SQL is compatible
- Change `AUTO_INCREMENT` to `SERIAL`
- Change `BOOLEAN` to `BOOLEAN` (same)
- Change `TEXT` to `TEXT` (same)

---

### Option 2: Use External MySQL Service (FREE Options)

**Use a free MySQL hosting service:**

#### A. PlanetScale (Recommended)

1. **Sign up** at https://planetscale.com
2. **Create** free database
3. **Get** connection string
4. **Update** environment variables in Render:
   - `DB_HOST` = from connection string
   - `DB_PORT` = 3306
   - `DB_NAME` = your database name
   - `DB_USER` = your username
   - `DB_PASSWORD` = your password

#### B. Railway

1. **Sign up** at https://railway.app
2. **Create** MySQL database
3. **Get** connection details
4. **Update** environment variables in Render

#### C. Aiven

1. **Sign up** at https://aiven.io
2. **Create** MySQL service (free tier available)
3. **Get** connection string
4. **Update** environment variables

---

### Option 3: Use cPanel MySQL with External Access (If Allowed)

**This only works if your hosting allows external MySQL connections:**

1. **In cPanel**, go to **"Remote MySQL"**
2. **Add** Render's IP addresses:
   - Check Render documentation for IP ranges
   - OR add `%` to allow all (less secure)
3. **Find** your MySQL hostname:
   - Usually: `domains.co.za` or an IP
   - Check in cPanel → MySQL Databases
4. **Update** environment variables in Render:
   - `DB_HOST` = your MySQL hostname (NOT `localhost`)
   - `DB_PORT` = 3306
   - `DB_NAME` = `dominan1_marketing_pwa`
   - `DB_USER` = `dominan1_Onka`
   - `DB_PASSWORD` = `43MYhu32bBJ5qmc`

**⚠️ Most shared hosting blocks external MySQL connections for security!**

---

## 🎯 Recommended Approach

**For fastest deployment:**

1. **Use Render's PostgreSQL** (Option 1)
2. **Convert your schema** to PostgreSQL
3. **Update database config** in backend
4. **Deploy** to Render

**OR**

1. **Use PlanetScale MySQL** (Option 2A)
2. **Keep your MySQL code** as-is
3. **Just update** environment variables
4. **Deploy** to Render

---

## 📋 Quick Checklist

- [ ] Choose database option (PostgreSQL or external MySQL)
- [ ] Create database on chosen service
- [ ] Get connection details
- [ ] Update backend code (if switching to PostgreSQL)
- [ ] Run your schema SQL in new database
- [ ] Update environment variables in Render
- [ ] Test database connection
- [ ] Deploy backend to Render

---

## 🔧 Converting MySQL Schema to PostgreSQL

**If you choose PostgreSQL, here's a quick conversion:**

**MySQL:**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  isActive BOOLEAN DEFAULT TRUE
);
```

**PostgreSQL:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  isActive BOOLEAN DEFAULT TRUE
);
```

**Main changes:**
- `INT AUTO_INCREMENT` → `SERIAL`
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`
- Everything else is mostly the same!

---

## 🆘 Need Help?

**If you get stuck:**
1. **Share** which database option you chose
2. **Share** the error message
3. **I'll help** you fix it!

**Let's get your database connected! 🚀**
