#!/usr/bin/env node
/**
 * Capture the Rackloose case study's screenshots from the live studio at
 * www.rackloose.com, from Mike OS on michaelzick.com, and from Bar
 * Four's booth on www.zickonezero.com, into public/img/projects/rackloose/.
 *
 * Studio shots fill a 1728x967 window at 2x, the size of the other case
 * studies' captures, with the Rackloose window expanded and a factory preset
 * playing so steps, LEDs, and meters are lit. Close-ups lay the rack out
 * 1280px wide and crop a 16:9 frame around the named devices at 2.7x, so they
 * come out 3456px wide too. Phone shots are 393x852 at 3x, cropped to the
 * 1284:2778 shape the site's phone bezel holds and saved at 642x1389. The
 * opening hero also gets the 640, 960, 1440, and 1920px copies its srcset
 * offers (see src/lib/responsiveImages.ts).
 *
 * Every shot gets a fresh browser context, so no patch, preset, or setting
 * carries over. Status toasts are hidden, focus is cleared, the pointer is
 * parked in a corner (Playwright never draws a cursor), and analytics hosts
 * are blocked; Mike OS's consent prompt is declined. Audio plays into the
 * headless browser only.
 *
 * Requirements (not project dependencies):
 *   - playwright + a matching chromium (`npx playwright install chromium`)
 *   - cwebp on PATH (brew install webp)
 *   - network access for the three sites
 * Sharp, which saves the phone shots, is a project dependency.
 *
 * Usage:
 *   node scripts/capture-rackloose-screenshots.js
 *   Append shot names (e.g. rackloose-rear) to recapture only those images.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', 'rackloose');
const STUDIO_URL = 'https://www.rackloose.com/';
const MIKE_OS_URL = 'https://www.michaelzick.com/';
const BAR_FOUR_URL = 'https://www.zickonezero.com/bar-four/';
const BLOCKED_HOSTS = /googletagmanager|google-analytics|analytics\.google|mixpanel|mxpnl|cloudflareinsights/;
const HIDE_TOASTS = '[class*=_toast_] { display: none !important; }';

const DESKTOP = { viewport: { width: 1728, height: 967 }, deviceScaleFactor: 2 };
const CLOSE_UP = { viewport: { width: 1280, height: 1700 }, deviceScaleFactor: 2.7 };
const PHONE = { viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const PHONE_OUT = { width: 642, height: 1389 };
// The widths HERO_COPY_WIDTHS in src/lib/responsiveImages.ts expects beside a hero.
const HERO_COPY_WIDTHS = [640, 960, 1440, 1920];

const SHOTS = [
  // The opening hero: Bone Orchard playing, DICTATOR's clip across the top.
  { name: 'rackloose-hero', preset: 'Bone Orchard', play: true, keys: true, heroCopies: true },
  // High Dive's front panel, playing, with the keys showing.
  { name: 'rackloose-front', preset: 'High Dive', play: true, keys: true },
  // The rack in its own window, as the standalone page opens it.
  { name: 'rackloose-window', windowed: true, preset: 'Digital Boogie', play: true, keys: true },
  { name: 'rackloose-rear', preset: 'Bone Orchard', play: true, flip: true },
  // A cable on its way from a spare jack, with the free jacks it fits lit.
  { name: 'rackloose-patching', preset: 'High Dive', flip: true, drag: { from: 'STEP–16 Pitch · 1V/oct output 2', to: 'SIEVE Cutoff CV input', reach: 0.72 } },
  { name: 'rackloose-presets', preset: 'Neon Skyline', play: true, open: 'Presets' },
  { name: 'rackloose-add-device', preset: 'High Dive', open: 'Add device' },
  { name: 'rackloose-guide', preset: 'High Dive', open: 'Open user guide' },
  { name: 'rackloose-rear-mix', preset: 'Neon Skyline', play: true, flip: true, scrollTo: 'SPACE' },

  // Close-ups, cropped around the devices named.
  { name: 'rackloose-voice', closeUp: ['SOLID', 'SIEVE', 'LEVEL', 'CONTOUR'], preset: 'High Dive', play: true },
  { name: 'rackloose-aurora', closeUp: ['AURORA'], preset: 'Neon Skyline', play: true },
  { name: 'rackloose-prism', closeUp: ['PRISM'], preset: 'Neon Skyline', play: true },
  { name: 'rackloose-oracle', closeUp: ['ORACLE'], preset: 'Undertow', play: true },
  { name: 'rackloose-monarch', closeUp: ['MONARCH'], preset: 'High Dive', play: true },
  { name: 'rackloose-skitter', closeUp: ['SKITTER'], preset: 'High Dive', play: true },
  { name: 'rackloose-boom', closeUp: ['BOOM'], preset: 'High Dive', play: true },
  { name: 'rackloose-strike', closeUp: ['STRIKE'], preset: 'Neon Skyline', play: true },
  { name: 'rackloose-forge', closeUp: ['FORGE'], preset: 'Bone Orchard', play: true },
  { name: 'rackloose-piano-roll', closeUp: ['DICTATOR'], preset: 'Bone Orchard', play: true, edit: 'Edit DICTATOR #1 notes' },
  { name: 'rackloose-talon', closeUp: ['TALON'], preset: 'Bone Orchard', play: true },
  { name: 'rackloose-brit', closeUp: ['BRIT'], preset: 'Neon Skyline', play: true },
  { name: 'rackloose-valve', closeUp: ['VALVE', 'MAIN'], preset: 'High Dive', play: true },
  { name: 'rackloose-rust', closeUp: ['RUST', 'CONSOLE'], preset: 'Bone Orchard', play: true },
  { name: 'rackloose-cohere', closeUp: ['COHERE', 'MAIN'], preset: 'Neon Skyline', play: true },
  { name: 'rackloose-space', closeUp: ['ECHO', 'SPACE'], preset: 'Undertow', play: true },

  // Phones.
  { name: 'rackloose-phone-front', phone: true, preset: 'High Dive', play: true, keys: true },
  { name: 'rackloose-phone-rear', phone: true, preset: 'High Dive', play: true, flip: true },
  { name: 'rackloose-phone-skitter', phone: true, preset: 'High Dive', play: true, scrollTo: 'SKITTER' },

  // Hosts.
  { name: 'rackloose-mike-os', host: 'mike-os', preset: 'Trap Soul', play: true },
  { name: 'rackloose-club-booth', host: 'bar-four', play: true },
];

const wait = (page, ms) => page.waitForTimeout(ms);

const press = (shot, locator) => (shot.phone ? locator.tap() : locator.click());

async function settle(page) {
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(1, 1);
  await wait(page, 600);
}

const deviceIn = (scope, name) => scope.locator(`article[aria-label^="${name} "]`).first();

// Scrolls the rack so the named device sits near its top.
async function scrollRackTo(page, scope, name) {
  const rack = scope.locator('[class*=_rack_]').first();
  const top = await deviceIn(scope, name).evaluate((article) => article.offsetTop);
  await rack.evaluate((element, offset) => { element.scrollTop = offset - 12; }, top);
  await wait(page, 500);
}

// Loads a factory preset, turns audio on, and starts every sequencer.
async function prepareRack(page, scope, shot) {
  if (shot.preset) {
    await press(shot, scope.getByRole('button', { name: 'Presets', exact: true }));
    await press(shot, scope.getByRole('button', { name: shot.preset, exact: true }));
  }
  if (!shot.keys) await press(shot, scope.getByRole('button', { name: 'Hide keys' }));
  if (shot.play) {
    await press(shot, scope.getByRole('button', { name: 'Enable audio' }));
    await wait(page, 800);
    await press(shot, scope.getByRole('button', { name: /play all/i }));
  }
  if (shot.flip) {
    await press(shot, scope.getByRole('button', { name: /flip rack/i }));
    await wait(page, 800);
  }
  if (shot.edit) await scope.getByRole('button', { name: shot.edit }).click();
  if (shot.scrollTo) await scrollRackTo(page, scope, shot.scrollTo);
  if (shot.open) {
    await press(shot, scope.getByRole('button', { name: shot.open, exact: shot.open === 'Presets' }));
    await wait(page, 600);
  }
  // Let the sequencers run a bar so lights and meters are mid-flight.
  if (shot.play) await wait(page, 2600);
}

async function openStudio(page, shot) {
  await page.goto(STUDIO_URL, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: HIDE_TOASTS });
  if (!shot.windowed) await press(shot, page.getByRole('button', { name: 'Expand Rackloose window' }));
  await prepareRack(page, page, shot);
}

async function openMikeOs(page, shot) {
  await page.goto(MIKE_OS_URL, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: HIDE_TOASTS });
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await page.getByRole('button', { name: 'Close', exact: true }).first().click();
  await page.getByRole('button', { name: 'Rackloose', exact: true }).dblclick();
  await page.locator('[class*=_rack_] article').first().waitFor();
  await prepareRack(page, page, { ...shot, keys: true });
}

async function openBarFour(page, shot) {
  await page.goto(BAR_FOUR_URL, { waitUntil: 'networkidle' });
  const booth = page.locator('.booth-rack');
  await booth.locator('article').first().waitFor({ timeout: 30000 });
  await page.addStyleTag({ content: HIDE_TOASTS });
  await page.locator('#house-music-title').evaluate((title) => {
    window.scrollTo({ top: title.getBoundingClientRect().top + window.scrollY - 150 });
  });
  await wait(page, 800);
  await prepareRack(page, booth, { ...shot, keys: true });
}

// Drags a cable most of the way from one jack to another and holds it there.
async function holdCable(page, { from, to, reach }) {
  const start = await page.getByRole('button', { name: from }).first().boundingBox();
  const end = await page.getByRole('button', { name: to }).first().boundingBox();
  const x0 = start.x + start.width / 2;
  const y0 = start.y + start.height / 2;
  const x1 = x0 + (end.x + end.width / 2 - x0) * reach;
  const y1 = y0 + (end.y + end.height / 2 - y0) * reach;
  await page.mouse.move(x0, y0);
  await page.mouse.down();
  for (let step = 1; step <= 24; step += 1) {
    await page.mouse.move(x0 + ((x1 - x0) * step) / 24, y0 + ((y1 - y0) * step) / 24);
  }
  await wait(page, 400);
}

// A 16:9 frame the rack's width, around the named devices.
async function closeUpClip(page, names) {
  const rack = page.locator('[class*=_rack_]').first();
  const boxes = await Promise.all(names.map((name) => deviceIn(page, name).evaluate((article) => ({
    top: article.offsetTop,
    height: article.offsetHeight,
  }))));
  const top = Math.min(...boxes.map((box) => box.top));
  const bottom = Math.max(...boxes.map((box) => box.top + box.height));
  const rackBox = await rack.boundingBox();
  const height = Math.round((rackBox.width * 9) / 16);
  const fits = bottom - top <= height;
  const frameTop = fits ? top - (height - (bottom - top)) / 2 : top - 10;
  await rack.evaluate((element, offset) => { element.scrollTop = Math.max(0, offset); }, frameTop - 40);
  await wait(page, 500);
  const scrolled = await rack.evaluate((element) => element.scrollTop);
  const y = Math.min(rackBox.y + rackBox.height - height, Math.max(rackBox.y, rackBox.y + frameTop - scrolled));
  return { x: rackBox.x, y, width: rackBox.width, height };
}

async function capture(browser, shot, tmpDir) {
  const device = shot.phone ? PHONE : shot.closeUp ? CLOSE_UP : DESKTOP;
  const context = await browser.newContext({
    ...device,
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
  });
  await context.route(BLOCKED_HOSTS, (route) => route.abort());
  const page = await context.newPage();

  try {
    if (shot.host === 'mike-os') await openMikeOs(page, shot);
    else if (shot.host === 'bar-four') await openBarFour(page, shot);
    else await openStudio(page, shot);

    const png = path.join(tmpDir, `${shot.name}.png`);
    if (shot.drag) {
      await holdCable(page, shot.drag);
      await page.screenshot({ path: png });
      await page.mouse.up();
    } else if (shot.closeUp) {
      const clip = await closeUpClip(page, shot.closeUp);
      await settle(page);
      await page.screenshot({ path: png, clip });
    } else {
      await settle(page);
      await page.screenshot({ path: png });
    }

    const out = path.join(OUT_DIR, `${shot.name}.webp`);
    if (shot.phone) {
      const { width, height } = await sharp(png).metadata();
      const cropHeight = Math.min(height, Math.round((width * PHONE_OUT.height) / PHONE_OUT.width));
      await sharp(png)
        .extract({ left: 0, top: 0, width, height: cropHeight })
        .resize(PHONE_OUT.width, PHONE_OUT.height)
        .webp({ quality: 85 })
        .toFile(out);
    } else {
      execFileSync('cwebp', ['-q', '85', png, '-o', out], { stdio: 'pipe' });
    }
    if (shot.heroCopies) {
      const { width: naturalWidth } = await sharp(png).metadata();
      for (const width of HERO_COPY_WIDTHS.filter((copyWidth) => copyWidth < naturalWidth)) {
        await sharp(png).resize(width).webp({ quality: 80 }).toFile(path.join(OUT_DIR, `${shot.name}-${width}w.webp`));
      }
    }
    console.log(`captured ${shot.name}.webp`);
  } finally {
    await context.close();
  }
}

(async () => {
  const requested = process.argv.slice(2);
  const unknown = requested.filter((name) => !SHOTS.some((shot) => shot.name === name));
  if (unknown.length > 0) throw new Error(`Unknown screenshot: ${unknown.join(', ')}`);
  const shots = requested.length > 0 ? SHOTS.filter((shot) => requested.includes(shot.name)) : SHOTS;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rackloose-shots-'));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

  try {
    for (const shot of shots) await capture(browser, shot, tmpDir);
  } finally {
    await browser.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
