# How to Test Your Application - Complete Guide

## 🎯 Testing Checklist

After uploading your frontend to cPanel, follow these steps to verify everything works.

---

## ✅ Step 1: Basic Site Loading (1 min)

### Test:
1. **Open your browser** (Chrome, Firefox, or Edge)
2. **Visit**: `https://dominantlogic.tech`
3. **What to check:**
   - ✅ Site loads (no blank page)
   - ✅ No "404 Not Found" errors
   - ✅ CSS styles are applied (site looks correct)
   - ✅ JavaScript is working (buttons, navigation work)

### If it doesn't load:
- Clear browser cache: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Try incognito/private mode
- Check if files uploaded correctly to cPanel

---

## ✅ Step 2: Check Browser Console (2 min)

### Open Developer Tools:
1. **Press** `F12` (or `Right-click` → "Inspect")
2. **Click** "Console" tab
3. **Look for errors:**
   - ❌ Red errors = Something is wrong
   - ⚠️ Yellow warnings = Usually OK, but check
   - ✅ No errors = Good!

### Common Errors to Check:
- **"Failed to load resource"** → Files not uploaded correctly
- **"CORS error"** → Backend CORS configuration issue
- **"Network error"** → Backend not accessible
- **"Cannot read property"** → JavaScript error

### What you should see:
- ✅ No red errors
- ✅ Maybe some info messages (normal)
- ✅ Vue app initialized successfully

---

## ✅ Step 3: Check API Connectivity (2 min)

### Test Backend Connection:
1. **In Developer Tools**, click **"Network"** tab
2. **Refresh** the page (`F5`)
3. **Look for** API calls:
   - Should see requests to: `https://marketing-pwa-backend.onrender.com/api/...`
   - Status should be `200` (green) or `201` (green)

### Test Backend Directly:
1. **Open new tab**
2. **Visit**: `https://marketing-pwa-backend.onrender.com/api/health` (if you have health endpoint)
   - OR try: `https://marketing-pwa-backend.onrender.com/api`
3. **What to check:**
   - ✅ Backend responds (not 404 or 503)
   - ✅ Returns JSON or some response

### If API calls fail:
- Check Render backend is running (check Render logs)
- Check CORS is configured in backend
- Check API URL in frontend is correct

---

## ✅ Step 4: Test User Registration (3 min)

### Test Registration:
1. **On your site**, find "Register" or "Sign Up" button
2. **Fill in the form:**
   - Name: `Test User`
   - Email: `test@example.com` (use a unique email)
   - Password: `Test123!` (or whatever your requirements are)
3. **Click** "Register" or "Sign Up"
4. **What to check:**
   - ✅ Form submits successfully
   - ✅ Success message appears
   - ✅ User is redirected to login or dashboard
   - ✅ No error messages

### Check Network Tab:
1. **In Developer Tools** → "Network" tab
2. **Look for** POST request to `/api/auth/register` (or similar)
3. **Click** on the request
4. **Check**:
   - Status: `200` or `201` (success)
   - Response: Should show user data or success message

### If registration fails:
- Check error message in browser console
- Check Network tab for failed request
- Check Render backend logs for errors
- Verify database connection (check Render logs)

---

## ✅ Step 5: Test User Login (2 min)

### Test Login:
1. **On your site**, find "Login" or "Sign In" button
2. **Enter credentials:**
   - Email: `test@example.com` (the one you just registered)
   - Password: `Test123!`
3. **Click** "Login" or "Sign In"
4. **What to check:**
   - ✅ Login successful
   - ✅ Redirected to dashboard/home
   - ✅ User session is created (check if you stay logged in)
   - ✅ No error messages

### Check Network Tab:
1. **Look for** POST request to `/api/auth/login` (or similar)
2. **Check**:
   - Status: `200` (success)
   - Response: Should contain JWT token or user data

### If login fails:
- Check if user was created (test registration again)
- Check error message in console
- Check backend logs

---

## ✅ Step 6: Verify Database (2 min)

### Check Data in Database:
1. **Go to** FreeSQLDatabase dashboard
2. **Click** "phpMyAdmin"
3. **Select** your database: `sql12815354`
4. **Click** on `users` table
5. **Click** "Browse" tab
6. **What to check:**
   - ✅ You should see the user you just registered
   - ✅ Email matches what you entered
   - ✅ Password is hashed (not plain text)
   - ✅ `createdAt` and `updatedAt` have timestamps

### If no data appears:
- Check if registration actually succeeded
- Check Render backend logs for database errors
- Verify database connection in Render

---

## ✅ Step 7: Test Other Features (Optional)

### Test Navigation:
- ✅ Click through different pages/routes
- ✅ Check if Vue Router works (no 404s)
- ✅ Check if navigation menu works

### Test Protected Routes:
- ✅ Try accessing pages that require login
- ✅ Should redirect to login if not authenticated
- ✅ Should allow access if logged in

### Test Logout:
- ✅ Click "Logout" button
- ✅ Should clear session
- ✅ Should redirect to login page

---

## 🆘 Common Issues and Fixes

### Issue: "CORS error" in console

**Error looks like:**
```
Access to fetch at 'https://marketing-pwa-backend.onrender.com/api/...' 
from origin 'https://dominantlogic.tech' has been blocked by CORS policy
```

**Fix:**
- Check Render backend `server.js` has CORS configured
- Make sure `FRONTEND_URL=https://dominantlogic.tech` is set in Render environment variables
- Check CORS allows your frontend domain

---

### Issue: "Network Error" or "Failed to fetch"

**Error looks like:**
```
Failed to fetch
NetworkError when attempting to fetch resource
```

**Fix:**
- Check Render backend is running (check Render dashboard)
- Check backend URL is correct: `https://marketing-pwa-backend.onrender.com`
- Check internet connection
- Check if backend is sleeping (free tier sleeps after inactivity)

---

### Issue: "404 Not Found" on routes

**Error looks like:**
```
GET https://dominantlogic.tech/dashboard 404 (Not Found)
```

**Fix:**
- Make sure `.htaccess` file exists in `public_html/`
- Check `.htaccess` has Vue Router rewrite rules
- Verify `mod_rewrite` is enabled (usually is on cPanel)

---

### Issue: "500 Internal Server Error"

**Error looks like:**
```
POST https://marketing-pwa-backend.onrender.com/api/auth/register 500
```

**Fix:**
- Check Render backend logs for error details
- Check database connection (should see "Connected to MySQL database" in logs)
- Check if database tables exist
- Check if environment variables are set correctly

---

### Issue: "401 Unauthorized" or "403 Forbidden"

**Error looks like:**
```
GET https://marketing-pwa-backend.onrender.com/api/users 401
```

**Fix:**
- Check if you're logged in
- Check if JWT token is being sent in requests
- Check if token is expired
- Try logging in again

---

## ✅ Success Indicators

**Everything is working if:**
- ✅ Site loads at `https://dominantlogic.tech`
- ✅ No console errors
- ✅ API calls go to Render backend
- ✅ Registration creates user in database
- ✅ Login works and creates session
- ✅ Data appears in FreeSQLDatabase
- ✅ Navigation works correctly

---

## 📋 Quick Test Checklist

- [ ] Site loads (no blank page)
- [ ] No console errors (F12 → Console)
- [ ] API calls visible in Network tab
- [ ] Backend responds (check Render URL directly)
- [ ] Registration works
- [ ] User appears in database (phpMyAdmin)
- [ ] Login works
- [ ] Session persists (stay logged in)
- [ ] Navigation works
- [ ] Protected routes work

---

## 🎯 What to Share If You Need Help

**If something doesn't work, share:**
1. **What you're testing** (registration, login, etc.)
2. **Error message** from browser console (F12 → Console)
3. **Network request** details (F12 → Network → click failed request)
4. **Render backend logs** (if backend errors)
5. **Screenshot** of the error (if possible)

---

## 🚀 You're Done!

**If all tests pass:**
- ✅ Your app is fully deployed and working!
- ✅ Frontend on cPanel
- ✅ Backend on Render
- ✅ Database on FreeSQLDatabase
- ✅ Everything connected!

**Congratulations! 🎉**
