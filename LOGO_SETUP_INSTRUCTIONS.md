# Logo Setup Instructions

## 📸 Step 1: Copy Your Logo File

Your Dominant Logic logo image needs to be placed in the `frontend/public/` folder.

1. **Locate your logo file** (the PNG image you provided)
2. **Copy it** to: `frontend/public/logo.png`
3. **Make sure the filename is exactly**: `logo.png`

### Recommended Logo Specifications:
- **Format**: PNG (with transparency if possible)
- **Size**: At least 512x512 pixels (for best quality)
- **Aspect Ratio**: Your logo can be any aspect ratio, but square works best for icons
- **Background**: Transparent or black (matches your logo design)

---

## ✅ Step 2: Verify Logo Placement

After copying, your `frontend/public/` folder should contain:

```
frontend/public/
├── index.html
├── manifest.json
└── logo.png          ← Your logo file here
```

---

## 🎨 Step 3: Where the Logo Appears

The logo will now appear in:

1. **Navigation Drawer** (left sidebar) - Top section
2. **App Bar** (top header) - Left side next to the title
3. **Login/Register Page** - Above the login form
4. **Browser Tab** (favicon) - Small icon in browser tab
5. **PWA Icons** - When installed as a Progressive Web App

---

## 🔄 Step 4: Rebuild Frontend

After adding the logo file:

1. **Rebuild the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload the new build** to `public_html/` on cPanel (including the logo file)

---

## 🖼️ Alternative: Using Different Logo Sizes

If you want to use different logo sizes for different purposes:

1. **Create multiple versions**:
   - `logo.png` - Main logo (for navigation/app bar)
   - `logo-icon-192.png` - 192x192px (for PWA icon)
   - `logo-icon-512.png` - 512x512px (for PWA icon)
   - `favicon.png` - Small icon for browser tab (32x32px or 64x64px)

2. **Update `manifest.json`** to use specific icon files:
   ```json
   "icons": [
     {
       "src": "/logo-icon-192.png",
       "sizes": "192x192",
       "type": "image/png"
     },
     {
       "src": "/logo-icon-512.png",
       "sizes": "512x512",
       "type": "image/png"
     }
   ]
   ```

3. **Update `index.html`** favicon:
   ```html
   <link rel="icon" href="<%= BASE_URL %>favicon.png">
   ```

---

## ⚠️ Troubleshooting

### Logo Not Showing?

1. **Check file path**: Make sure `logo.png` is in `frontend/public/` (not `frontend/src/`)
2. **Check filename**: Must be exactly `logo.png` (case-sensitive)
3. **Clear browser cache**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)
4. **Check browser console**: Look for 404 errors for `/logo.png`
5. **After build**: Make sure logo is copied to `frontend/dist/` after building

### Logo Looks Blurry?

- Use a higher resolution image (at least 512x512px)
- Use PNG format for better quality
- Make sure the image isn't being scaled up too much

### Logo Too Big/Small?

The logo is set to:
- **Navigation drawer**: `max-width: 180px; max-height: 60px`
- **App bar**: `max-height: 40px; max-width: 150px`
- **Login page**: `max-width: 250px; max-height: 100px`

You can adjust these in:
- `frontend/src/App.vue` (for navigation drawer and app bar)
- `frontend/src/views/Login.vue` (for login page)

---

## 📝 Notes

- The logo will automatically hide if the file doesn't exist (no broken image icon)
- The logo uses `object-fit: contain` to maintain aspect ratio
- The logo background should match your app theme (black background works well with your logo design)

---

**After adding the logo file and rebuilding, your Dominant Logic branding will be visible throughout the application!** 🎉
