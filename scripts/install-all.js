// Installs backend and frontend dependencies (cross-platform postinstall).
const { execSync } = require('node:child_process');
const path = require('node:path');

for (const dir of ['backend', 'frontend']) {
  console.log(`\n> installing ${dir}`);
  execSync('npm install', { cwd: path.join(__dirname, '..', dir), stdio: 'inherit' });
}
