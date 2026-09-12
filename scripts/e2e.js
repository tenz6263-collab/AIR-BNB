// Behavioural checks against a running build (default http://localhost:5173).
//   node scripts/e2e.js [baseUrl]
// Drives the page with a real (headless) Chrome: deep links, history, the
// keyboard flow through tour and lightbox, and focus restoration.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const puppeteer = require('puppeteer-core');

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((p) => fs.existsSync(p));

const base = process.argv[2] || 'http://localhost:5173';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push(['ok', name]);
  } catch (err) {
    results.push(['FAIL', `${name}: ${err.message}`]);
  }
}

const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return el.getAttribute('aria-label') || el.textContent.trim().slice(0, 30) || el.tagName;
  });
const search = (page) => page.evaluate(() => location.search);
const visible = (page, label) =>
  page.evaluate((l) => {
    const el = document.querySelector(`[aria-label="${l}"]`);
    return el ? getComputedStyle(el).visibility === 'visible' : false;
  }, label);

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', defaultViewport: { width: 1440, height: 900 } });
  const page = await browser.newPage();

  await check('deep link opens the lightbox at the requested photo', async () => {
    await page.goto(`${base}/?modal=PHOTO_TOUR_SCROLLABLE&modalItem=1010`, { waitUntil: 'networkidle0' });
    await wait(500);
    assert.equal(await visible(page, 'Photo viewer'), true);
    const counter = await page.$eval('[aria-label="Photo viewer"] [class*=counter]', (e) => e.textContent);
    assert.equal(counter, '11 of 43');
    const title = await page.$eval('[aria-label="Photo viewer"] [class*=title]', (e) => e.textContent);
    assert.equal(title, 'Full kitchen');
  });

  await check('browser back closes lightbox, then tour', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('button::-p-text(Show all photos)');
    await wait(400);
    await page.click('#tour-room-0 button');
    await wait(400);
    assert.equal(await visible(page, 'Photo viewer'), true);
    await page.goBack();
    await wait(400);
    assert.equal(await visible(page, 'Photo viewer'), false);
    assert.equal(await visible(page, 'Photo tour'), true);
    await page.goBack();
    await wait(400);
    assert.equal(await visible(page, 'Photo tour'), false);
    assert.equal(await search(page), '');
  });

  await check('keyboard flow: tour -> lightbox -> arrows -> escape restores focus', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.focus('button::-p-text(Show all photos)');
    await page.keyboard.press('Enter');
    await wait(500);
    assert.equal(await active(page), 'Back');
    assert.equal(await page.evaluate(() => document.body.classList.contains('is-locked')), true);
    assert.equal(await page.evaluate(() => document.querySelector('main').closest('[inert]') !== null), true);
    for (let i = 0; i < 13; i += 1) await page.keyboard.press('Tab');
    assert.match(await active(page), /image 2$/);
    await page.keyboard.press('Enter');
    await wait(400);
    assert.equal(await active(page), 'Close');
    assert.match(await search(page), /modalItem=1001/);
    await page.keyboard.press('ArrowRight');
    await wait(300);
    assert.match(await search(page), /modalItem=1002/);
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('ArrowLeft');
    await wait(300);
    assert.match(await search(page), /modalItem=1000/);
    const prevDisabled = await page.$eval('[aria-label="Previous"]', (b) => b.disabled);
    assert.equal(prevDisabled, true);
    await page.keyboard.press('Escape');
    await wait(300);
    // Focus returns to the thumbnail that opened the lightbox (image 2).
    assert.match(await active(page), /image 2$/);
    await page.keyboard.press('Escape');
    await wait(300);
    assert.equal(await active(page), 'Show all photos');
    assert.equal(await page.evaluate(() => document.body.classList.contains('is-locked')), false);
    assert.equal(await page.evaluate(() => document.querySelector('[inert]')), null);
  });

  await check('hero tile opens the tour scrolled to its room', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.click('[aria-label$="image 4"]');
    await wait(900);
    const top = await page.evaluate(() => document.getElementById('tour-room-3').getBoundingClientRect().top);
    assert.ok(top > 0 && top < 120, `room top was ${top}`);
  });

  await check('amenities modal traps focus and restores it', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.focus('button::-p-text(Show all 50 amenities)');
    await page.keyboard.press('Enter');
    await wait(400);
    assert.equal(await active(page), 'Close');
    await page.keyboard.press('Tab');
    assert.equal(await active(page), 'Close');
    await page.keyboard.press('Escape');
    await wait(300);
    assert.equal(await active(page), 'Show all 50 amenities');
  });

  await check('save persists across reloads', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    const before = await page.$eval('[aria-pressed]', (b) => b.getAttribute('aria-pressed'));
    await page.click('[aria-pressed]');
    await wait(300);
    await page.reload({ waitUntil: 'networkidle0' });
    const after = await page.$eval('[aria-pressed]', (b) => b.getAttribute('aria-pressed'));
    assert.notEqual(before, after);
    await page.click('[aria-pressed]');
    await wait(300);
  });

  await check('sticky nav appears after the hero and tracks sections', async () => {
    await page.goto(base, { waitUntil: 'networkidle0' });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    const at = async (y) => {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await wait(450); // nav fades over 250ms
      return page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Listing sections"]');
        const bar = nav.parentElement.parentElement;
        const activeLink = nav.querySelector('a[class*=active]');
        return [getComputedStyle(bar).opacity === '1', activeLink ? activeLink.textContent : null];
      });
    };
    assert.deepEqual(await at(0), [false, 'Photos']);
    assert.deepEqual(await at(700), [true, 'Photos']);
    assert.deepEqual(await at(1900), [true, 'Amenities']);
    assert.deepEqual(await at(2800), [true, 'Reviews']);
    assert.deepEqual(await at(4100), [true, 'Location']);
  });

  await browser.close();
  for (const [status, name] of results) console.log(`${status.padEnd(4)} ${name}`);
  const failed = results.filter(([s]) => s === 'FAIL').length;
  console.log(`\n${results.length - failed}/${results.length} passed`);
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
