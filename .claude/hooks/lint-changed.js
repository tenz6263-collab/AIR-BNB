// PostToolUse hook: runs after every Edit/Write. Rejects the edit (exit 2)
// when a frontend file contains a raw hex colour that already has a token, or
// when a component imports a module CSS file that does not exist.
const fs = require('fs');
const path = require('path');

let payload = '';
try {
  payload = fs.readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
let input;
try {
  input = JSON.parse(payload);
} catch {
  process.exit(0);
}
const file = input?.tool_input?.file_path;
if (!file || !/frontend[\\/]src[\\/].+\.(jsx|css)$/.test(file) || !fs.existsSync(file)) process.exit(0);
if (/tokens\.css$|icons[\\/]index\.jsx$/.test(file)) process.exit(0);

const src = fs.readFileSync(file, 'utf8');
const problems = [];

const TOKENISED = {
  '#ff385c': 'var(--rausch)',
  '#717171': 'var(--muted-2)',
  '#6a6a6a': 'var(--muted)',
  '#dddddd': 'var(--line)',
  '#ebebeb': 'var(--line-soft)',
  '#f7f7f7': 'var(--grey-100)',
  '#f2f2f2': 'var(--grey-200)',
  '#b0b0b0': 'var(--line-strong)',
};
if (file.endsWith('.css')) {
  for (const [hex, token] of Object.entries(TOKENISED)) {
    if (src.toLowerCase().includes(hex)) problems.push(`use ${token} instead of ${hex}`);
  }
}

if (file.endsWith('.jsx')) {
  const m = src.match(/from '\.\/([\w-]+\.module\.css)'/);
  if (m && !fs.existsSync(path.join(path.dirname(file), m[1]))) problems.push(`missing stylesheet ${m[1]}`);
}

if (problems.length) {
  console.error(`[lint-changed] ${path.basename(file)}: ${problems.join('; ')}`);
  process.exit(2);
}
