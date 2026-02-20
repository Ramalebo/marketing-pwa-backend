const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const distDir = path.join(__dirname, '..', 'frontend', 'dist');
const zipPath = path.join(__dirname, '..', 'dist-cpanel.zip');

if (!fs.existsSync(distDir)) {
  console.error('frontend/dist not found. Run: npm run build');
  process.exit(1);
}

try { fs.unlinkSync(zipPath); } catch (_) {}

const isWin = process.platform === 'win32';
if (isWin) {
  execSync(
    `powershell -NoProfile -Command "Set-Location '${distDir.replace(/'/g, "''")}'; Compress-Archive -Path * -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force"`,
    { stdio: 'inherit' }
  );
} else {
  execSync(`cd "${distDir}" && zip -r "${zipPath}" . -x "*.DS_Store"`, { stdio: 'inherit' });
}

console.log('Created:', zipPath);
