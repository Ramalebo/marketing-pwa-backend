# Node.js Setup Options for cPanel

## 🎯 Recommended: Use cPanel Node.js Selector (Easiest)

**This is the standard way and should work on most cPanel hosts.**

### Step 1: Find Node.js Selector

1. **In cPanel**, use the **search box** (top-right)
2. **Type**: `node` or `nodejs` or `application`
3. **Click**: **"Setup Node.js App"** or **"Node.js Selector"**

**If you can't find it:**
- Look in **"Software"** section
- Look in **"Advanced"** section
- Contact your hosting provider to enable Node.js Selector

---

### Step 2: Create/Configure Application

1. **Click**: **"Create Application"** (if no apps exist)
   **OR** click on existing app to edit

2. **Fill in**:
   - **Node.js Version**: `18.x` or `20.x` (LTS)
   - **Application Root**: `/home/dominan1/public_html/backend`
   - **Application Startup File**: `server.js`
   - **Application Mode**: Production
   - **Application URL**: Leave default or `/api`

3. **Click**: **"Create"** or **"Save"**

---

### Step 3: Install Dependencies

1. **Click**: **"Run NPM Install"**
2. **Wait** 2-5 minutes
3. **Check** for completion message

---

### Step 4: Start Backend

1. **Click**: **"Start"** or **"Restart"**
2. **Click**: **"View Logs"**
3. **Look for**: `Connected to MySQL database`

---

## 🔧 Alternative: SSH Method (If Node.js Selector Not Available)

**⚠️ Only use this if Node.js Selector is not available in your cPanel!**

### Prerequisites:
- SSH access enabled on your hosting account
- Terminal/SSH client (PuTTY, Terminal, etc.)

---

### Step 1: Get SSH Credentials

1. **In cPanel**, go to **"SSH Access"** or **"Terminal"**
2. **Note**:
   - Host: `domains.co.za` or your server IP
   - Port: Usually `22`
   - Username: `dominan1`
   - Password: Your cPanel password

---

### Step 2: Connect via SSH

**Using Terminal (Mac/Linux):**
```bash
ssh dominan1@domains.co.za
```

**Using PuTTY (Windows):**
1. Open PuTTY
2. Enter host: `domains.co.za`
3. Port: `22`
4. Click "Open"
5. Enter username: `dominan1`
6. Enter password

---

### Step 3: Install Node.js via nvm (Node Version Manager)

```bash
# Navigate to home directory
cd ~

# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18 (LTS)
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

---

### Step 4: Navigate to Backend Directory

```bash
cd ~/public_html/backend
```

---

### Step 5: Install Dependencies

```bash
npm install --production
```

**Wait** for installation to complete (2-5 minutes)

---

### Step 6: Create .env File (If Not Exists)

```bash
nano .env
```

**Paste this content:**
```env
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dominan1_marketing_pwa
DB_USER=dominan1_Onka
DB_PASSWORD=43MYhu32bBJ5qmc
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://dominantlogic.tech
```

**Save**: `Ctrl+X`, then `Y`, then `Enter`

---

### Step 7: Run Backend with PM2 (Process Manager)

**Install PM2 globally:**
```bash
npm install -g pm2
```

**Start backend:**
```bash
cd ~/public_html/backend
pm2 start server.js --name "marketing-backend"
```

**Save PM2 configuration:**
```bash
pm2 save
pm2 startup
```

**Check status:**
```bash
pm2 status
pm2 logs marketing-backend
```

---

### Step 8: Verify Backend is Running

**Check logs:**
```bash
pm2 logs marketing-backend
```

**Look for:**
```
Connected to MySQL database
Server running on port 3000
```

---

## ⚠️ Important Notes for SSH Method

### Port Restrictions:
- **Shared hosting** may block custom ports
- Backend might need to run on a different port
- Check with your hosting provider

### Process Management:
- Use **PM2** to keep backend running
- Backend will stop if you close SSH session without PM2
- PM2 keeps it running in background

### .htaccess Proxy:
- Still need `.htaccess` in `/public_html/`
- Proxy should point to `http://localhost:3000`
- May need to adjust port if 3000 is blocked

---

## 🆚 Comparison

| Method | Pros | Cons |
|--------|------|------|
| **cPanel Node.js Selector** | ✅ Easy to use<br>✅ Built-in process management<br>✅ No SSH needed | ❌ May not be available on all hosts |
| **SSH Method** | ✅ More control<br>✅ Works if Selector unavailable | ❌ Requires SSH access<br>❌ More complex<br>❌ Need to manage processes manually |

---

## 🎯 Recommendation

**Try cPanel Node.js Selector FIRST:**
1. It's easier
2. Built-in process management
3. No SSH needed
4. Automatic restarts

**Only use SSH method if:**
- Node.js Selector is not available
- You have SSH access
- You're comfortable with command line

---

## ✅ Quick Decision Guide

**Do you see "Node.js Selector" or "Setup Node.js App" in cPanel?**
- ✅ **YES** → Use cPanel method (easier!)
- ❌ **NO** → Check if SSH is available → Use SSH method

---

**Most cPanel hosts have Node.js Selector - try that first! 🚀**
