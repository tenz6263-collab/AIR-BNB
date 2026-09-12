// Builds the submission zip: source, docs, .claude config, assets - without
// node_modules, build output or git internals. Uses bsdtar (bundled with
// Windows 10+ and macOS) so the archive has standard forward-slash paths.
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const root = path.join(__dirname, '..');
const out = path.join(root, 'airbnb-clone-submission.zip');
const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'abnb-'));
const target = path.join(staging, 'airbnb-clone');

const SKIP = new Set(['node_modules', 'dist', '.git', '.env', '.snapshots', 'airbnb-clone-submission.zip', 'Playpower Labs Assignment Airbnb-Clone App.pdf']);

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (SKIP.has(path.basename(src))) return;
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) copy(path.join(src, entry), path.join(dest, entry));
  } else {
    fs.copyFileSync(src, dest);
  }
}

copy(root, target);
if (fs.existsSync(out)) fs.unlinkSync(out);

const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:/Windows', 'System32', 'tar.exe') : 'tar';
execSync(`"${tar}" -a -cf "${out}" -C "${staging}" airbnb-clone`, { stdio: 'inherit' });

fs.rmSync(staging, { recursive: true, force: true });
console.log(`created ${out} (${(fs.statSync(out).size / 1024 / 1024).toFixed(1)} MB)`);
