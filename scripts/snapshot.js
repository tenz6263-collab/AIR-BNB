// Headless screenshots of the local build for visual checks.
//   node scripts/snapshot.js [baseUrl]
// Writes PNGs to .snapshots/ (git-ignored): listing at several scroll
// offsets, the photo tour, the lightbox and the amenities modal.
const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));

const base = process.argv[2] || 'http://localhost:5173';
const outDir = path.join(__dirname, '..', '.snapshots');
fs.mkdirSync(outDir, { recursive: true });

const shot = async (page, name) => {
  await page.screenshot({ path: path.join(outDir, `${name}.png`), captureBeyondViewport: false });
  console.log(`saved ${name}.png`);
};

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();
  await page.goto(base, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

  const offsets = [0, 690, 1500, 2280, 2730, 3330, 4100, 4950, 5700];
  for (const y of offsets) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 300));
    await shot(page, `listing-${String(y).padStart(4, '0')}`);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('button::-p-text(Show all photos)');
  await new Promise((r) => setTimeout(r, 600));
  await page.waitForNetworkIdle({ idleTime: 300, timeout: 15000 }).catch(() => {});
  await shot(page, 'tour-top');
  await page.click('#tour-room-3 button');
  await new Promise((r) => setTimeout(r, 500));
  await shot(page, 'lightbox');
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, 'lightbox-next');
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 400));

  await page.click('button::-p-text(Show all 50 amenities)');
  await new Promise((r) => setTimeout(r, 400));
  await shot(page, 'amenities-modal');

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
