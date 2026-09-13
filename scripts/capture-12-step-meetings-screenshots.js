#!/usr/bin/env node
/**
 * Recapture the 12 Step Meetings UX showcase screenshots from the live site.
 *
 * Captures desktop shots (1728x967 viewport at 2x, matching the other
 * showcases) and writes WebP files at quality 85 into
 * public/img/projects/12-step-meetings/.
 *
 * The site is a static, account-free app whose state lives in the query
 * string (view, program, day, time of day, location, radius, sort), so each
 * shot is a URL plus at most one click. The browser clock is a fake clock that
 * starts at Tue 2026-09-15 5:30 PM PDT so the "upcoming" ordering is stable.
 * It keeps ticking rather than being frozen because Leaflet fades tiles in by
 * comparing Date.now() with each tile's load time, and a frozen clock leaves
 * every tile invisible. The pointer is parked in the page corner before each
 * shot so nothing is hovered, and Playwright's page.screenshot() never draws
 * a cursor.
 *
 * Requirements (not project dependencies):
 *   - playwright + a matching chromium (`npx playwright install chromium`)
 *   - cwebp on PATH (brew install webp)
 *   - network access for the site and OpenStreetMap tiles
 *   - the location-menu shot uses macOS screencapture with Screen Recording
 *     access and a 2x display at least 1728x1087 logical pixels. Chromium's
 *     native city suggestions are omitted by page.screenshot(). Its visible
 *     window is positioned for the content-only capture rectangle below.
 *
 * Usage:
 *   NODE_PATH=<node_modules containing playwright> node scripts/capture-12-step-meetings-screenshots.js
 *   Append a shot name (e.g. 12-step-meetings-filters) to recapture only that image.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', '12-step-meetings');
const BASE_URL = (process.env.TWELVE_STEP_MEETINGS_URL ?? 'https://www.12stepmeetings.org').replace(/\/$/, '');
const CLOCK_START = '2026-09-16T00:30:00.000Z'; // Tue 2026-09-15 5:30 PM PDT
const VIEWPORT = { width: 1728, height: 967 };

const SHOTS = [
  {
    // Hero: upcoming meetings near Santa Monica beside the map.
    name: '12-step-meetings-hybrid',
    query: 'loc=Santa+Monica&r=5&sort=upcoming',
    waitForMap: true,
  },
  {
    // "One place to start" section: the hero view with the Al-Anon program
    // chip selected.
    name: '12-step-meetings-al-anon',
    query: 'p=Al-Anon&loc=Santa+Monica&r=5&sort=upcoming',
    waitForMap: true,
  },
  {
    // "Find a meeting that fits": program, day, time, and location controls.
    // Program, day, and time filters are active; the location menu shows
    // native city suggestions before a location is selected.
    name: '12-step-meetings-filters',
    query: 'view=list&p=AA,CoDA&d=2&t=evening&sort=upcoming',
    openLocation: 'Santa',
  },
  {
    // Full map around a ZIP search with clustered markers.
    name: '12-step-meetings-map',
    query: 'view=map&zip=91101&r=10&sort=distance',
    waitForMap: true,
  },
  {
    // Meeting detail drawer over the hybrid view.
    name: '12-step-meetings-detail',
    query: 'p=NA&loc=Santa+Monica&r=5&sort=distance',
    openMeeting: 'Solutions',
    waitForMap: true,
  },
];

async function waitForTiles(page) {
  try {
    await page.waitForFunction(() => {
      const tiles = document.querySelectorAll('.leaflet-tile');
      return tiles.length > 0 && Array.from(tiles).every((tile) => tile.classList.contains('leaflet-tile-loaded'));
    }, null, { timeout: 30000 });
  } catch {
    console.warn('warning: some map tiles were still loading; capturing anyway');
  }
  await page.waitForTimeout(2500); // let the fit-to-results animation finish painting
}

async function openDropdown(page, label) {
  await page.locator('button[aria-haspopup="true"]', { hasText: label }).first().click();
  await page.locator(`[role="group"][aria-label="${label} options"]`).waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);
}

async function openMeeting(page, name) {
  const rows = page.locator('button[aria-current]');
  await rows.first().waitFor({ timeout: 30000 });
  let row = rows.filter({ hasText: name }).first();
  if ((await row.count()) === 0) {
    console.warn(`warning: no meeting named "${name}" in the results; opening the first row instead`);
    row = rows.first();
  }
  await row.click();
  await page.locator('aside[role="dialog"]').waitFor({ timeout: 10000 });
  await page.waitForTimeout(600);
}

async function settle(page) {
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(2, 2); // page corner: nothing to hover
  await page.waitForTimeout(600);
}

async function captureLocationMenu(page, search, png) {
  await page.bringToFront();
  await page.addStyleTag({ content: 'input { caret-color: transparent !important; }' });
  const location = page.getByRole('combobox', { name: 'City or zip code for proximity' });
  await location.click();
  await location.pressSequentially(search, { delay: 100 });
  await location.evaluate((input) => input.showPicker());
  await page.mouse.move(2, 2);
  await page.waitForTimeout(1000);
  // Calibrated for macOS Chromium: window top 33 + browser chrome 87.
  // Keep focus on the input: blurring dismisses the native suggestion menu.
  execFileSync('screencapture', ['-x', '-R0,120,1728,967', png], { stdio: 'pipe' });
  // Convert the display's embedded color profile before cwebp strips metadata.
  const normalized = await sharp(png).toColourspace('srgb').png().toBuffer();
  fs.writeFileSync(png, normalized);
}

async function capture(page, { name, query, waitForMap, openDropdown: dropdown, openMeeting: meeting, openLocation: location }, tmpDir) {
  await page.goto(`${BASE_URL}/?${query}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.getByText('12 Step Meetings', { exact: false }).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(1500); // fonts and the results list
  if (waitForMap) await waitForTiles(page);
  if (dropdown) await openDropdown(page, dropdown);
  if (meeting) await openMeeting(page, meeting);
  await settle(page);
  const png = path.join(tmpDir, `${name}.png`);
  if (location) await captureLocationMenu(page, location, png);
  else await page.screenshot({ path: png, animations: 'disabled' });
  execFileSync('cwebp', ['-q', '85', png, '-o', path.join(OUT_DIR, `${name}.webp`)], { stdio: 'pipe' });
  console.log(`captured ${name}.webp`);
}

(async () => {
  const requestedName = process.argv[2];
  const shots = requestedName ? SHOTS.filter((shot) => shot.name === requestedName) : SHOTS;
  if (shots.length === 0) throw new Error(`Unknown screenshot: ${requestedName}`);
  const needsNativeMenu = shots.some((shot) => shot.openLocation);
  if (needsNativeMenu && process.platform !== 'darwin') {
    throw new Error('The native location-menu capture requires macOS screencapture.');
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), '12-step-shots-'));
  const browser = await chromium.launch({ headless: !needsNativeMenu });

  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      timezoneId: 'America/Los_Angeles',
      locale: 'en-US',
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    if (needsNativeMenu) {
      const session = await context.newCDPSession(page);
      const { windowId } = await session.send('Browser.getWindowForTarget');
      // Extra window height prevents Chromium from scaling the emulated viewport.
      await session.send('Browser.setWindowBounds', {
        windowId, bounds: { left: 0, top: 33, width: 1728, height: 1080 },
      });
      await session.detach();
    }
    await page.clock.install({ time: new Date(CLOCK_START) });

    for (const shot of shots) await capture(page, shot, tmpDir);

    // The showcase copy names OA among the programs; flag it if the live data
    // no longer includes it so the copy can be updated.
    if ((await page.locator('button[title="Overeaters Anonymous"]').count()) === 0) {
      console.warn('warning: no "OA" program chip on the live site; check the section copy in pages/12-step-meetings.tsx');
    }
    await context.close();
  } finally {
    await browser.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
