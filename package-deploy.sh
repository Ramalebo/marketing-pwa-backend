#!/bin/bash

# Deployment Package Script for cPanel
# This script prepares the application for deployment

echo "🚀 Preparing deployment package..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create deployment directory
DEPLOY_DIR="deployment-package"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

echo -e "${YELLOW}📦 Creating deployment package...${NC}"

# Copy backend files
echo "Copying backend files..."
mkdir -p $DEPLOY_DIR/backend
cp -r backend/models $DEPLOY_DIR/backend/
cp -r backend/routes $DEPLOY_DIR/backend/
cp -r backend/middleware $DEPLOY_DIR/backend/
cp backend/server.js $DEPLOY_DIR/backend/
cp backend/package.json $DEPLOY_DIR/backend/
cp .env.example $DEPLOY_DIR/backend/.env.example

# Create uploads directory
mkdir -p $DEPLOY_DIR/backend/uploads
touch $DEPLOY_DIR/backend/uploads/.gitkeep

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend dist
echo "Copying frontend build..."
mkdir -p $DEPLOY_DIR/frontend
cp -r frontend/dist/* $DEPLOY_DIR/frontend/

# Create .htaccess for frontend
cat > $DEPLOY_DIR/frontend/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Create deployment instructions
cat > $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.txt << 'EOF'
DEPLOYMENT INSTRUCTIONS FOR CPANEL
===================================

1. Upload the entire contents of this package to your cPanel

2. Backend Setup:
   - Upload backend/ folder to: /home/your-username/marketing-app/backend/
   - Create .env file in backend/ directory (copy from .env.example)
   - Fill in all required environment variables
   - Run: npm install --production

3. Frontend Setup:
   - Upload all files from frontend/ to your public_html/ directory
   - Or create a subdomain and point it to frontend/ directory

4. Node.js Setup:
   - Use Node.js Selector in cPanel
   - Create application pointing to backend/server.js
   - Set Node.js version to 18.x or 20.x

5. MongoDB Setup:
   - Use MongoDB Atlas (recommended) or local MongoDB
   - Update MONGODB_URI in .env file

6. Start Application:
   - Restart Node.js application in cPanel
   - Or use PM2: pm2 start server.js

7. Test:
   - Visit your domain
   - Register a new account
   - Check backend logs for errors

For detailed instructions, see DEPLOYMENT.md
EOF

# Create zip file
echo "Creating zip archive..."
cd $DEPLOY_DIR
zip -r ../marketing-app-deployment.zip . -x "*.git*" "*.DS_Store"
cd ..

echo -e "${GREEN}✅ Deployment package created: marketing-app-deployment.zip${NC}"
echo -e "${GREEN}📁 Deployment files also available in: $DEPLOY_DIR/${NC}"
echo ""
echo "Next steps:"
echo "1. Upload marketing-app-deployment.zip to your cPanel"
echo "2. Extract it in your desired location"
echo "3. Follow DEPLOYMENT_INSTRUCTIONS.txt"
echo "4. See DEPLOYMENT.md for detailed guide"
