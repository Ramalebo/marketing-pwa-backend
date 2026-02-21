@echo off
REM Deployment Package Script for cPanel (Windows)
echo Preparing deployment package...

REM Create deployment directory
if exist deployment-package rmdir /s /q deployment-package
mkdir deployment-package

echo Copying backend files...
mkdir deployment-package\backend
xcopy /E /I backend\models deployment-package\backend\models
xcopy /E /I backend\routes deployment-package\backend\routes
xcopy /E /I backend\middleware deployment-package\backend\middleware
copy backend\server.js deployment-package\backend\
copy backend\package.json deployment-package\backend\
copy .env.example deployment-package\backend\.env.example

REM Create uploads directory
mkdir deployment-package\backend\uploads
echo. > deployment-package\backend\uploads\.gitkeep

echo Building frontend...
cd frontend
call npm install
call npm run build
cd ..

echo Copying frontend build...
mkdir deployment-package\frontend
xcopy /E /I frontend\dist deployment-package\frontend

REM Create .htaccess
echo ^<IfModule mod_rewrite.c^> > deployment-package\frontend\.htaccess
echo   RewriteEngine On >> deployment-package\frontend\.htaccess
echo   RewriteBase / >> deployment-package\frontend\.htaccess
echo   RewriteRule ^index\.html$ - [L] >> deployment-package\frontend\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-f >> deployment-package\frontend\.htaccess
echo   RewriteCond %%{REQUEST_FILENAME} !-d >> deployment-package\frontend\.htaccess
echo   RewriteRule . /index.html [L] >> deployment-package\frontend\.htaccess
echo ^</IfModule^> >> deployment-package\frontend\.htaccess

echo.
echo Deployment package created in: deployment-package\
echo.
echo Next steps:
echo 1. Zip the deployment-package folder
echo 2. Upload to your cPanel
echo 3. Extract and follow DEPLOYMENT.md instructions
echo.
pause
