#!/usr/bin/env node
/**
 * Capture the Riptyde case study's web screenshots from the live riptyde.app.
 *
 * Captures desktop shots (1728x967 viewport at 2x, matching the other case
 * studies) signed out, so no account data is on screen, and writes WebP files
 * at quality 85 into public/img/projects/riptyde/. Analytics are declined
 * before the first page loads (the same stored choice the site's "Turn off
 * analytics" button saves) and analytics hosts are blocked, so the consent
 * notice never appears and nothing is recorded. The pointer is parked in the
 * page corner before each shot so nothing is hovered, and Playwright's
 * page.screenshot() never draws a cursor.
 *
 * Requirements (not project dependencies):
 *   - playwright + a matching chromium (`npx playwright install chromium`)
 *   - cwebp on PATH (brew install webp)
 *   - network access for riptyde.app and its map tiles
 *
 * Usage:
 *   node scripts/capture-riptyde-web-screenshots.js
 *   Append a shot name (e.g. riptyde-web-spots) to recapture only that image.
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', 'riptyde');
const BASE_URL = (process.env.RIPTYDE_WEB_URL ?? 'https://riptyde.app').replace(/\/$/, '');
const VIEWPORT = { width: 1728, height: 967 };
const BLOCKED_HOSTS = /googletagmanager|google-analytics|analytics\.google|mixpanel|mxpnl|cloudflareinsights/;

const SHOTS = [
  // Today: Malibu First Point's forecast with the two-column desktop layout.
  { name: 'riptyde-web-home', path: '/spot/malibu-first-point' },
  // The Lineup beside the full-height spot map.
  { name: 'riptyde-web-spots', path: '/spots', waitForMap: true },
  // Beach cams beside the cam map.
  { name: 'riptyde-web-cams', path: '/cams', waitForMap: true },
  // The RAD-O-METER page for the same break.
  { name: 'riptyde-web-rad', path: '/spot/malibu-first-point/rad' },
  // Lowers scrolled to the bottom: the surf-quality chart and forecast report.
  { name: 'riptyde-web-chart', path: '/spot/lowers-trestles', scrollToBottom: true },
];

async function waitForMap(page) {
  try {
    await page.waitForFunction(() => {
      const canvas = document.querySelector('.maplibregl-canvas');
      return canvas && canvas.width > 0;
    }, null, { timeout: 30000 });
  } catch {
    console.warn('warning: the map never drew; capturing anyway');
  }
  await page.waitForTimeout(4000); // tiles fade in after the style loads
}

async function settle(page) {
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(2, 2); // page corner: nothing to hover
  await page.waitForTimeout(800);
}

async function capture(page, { name, path: pagePath, waitForMap: map, scrollToBottom }, tmpDir) {
  await page.goto(`${BASE_URL}${pagePath}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  // Spot rows and cards show ghost blocks until the live read lands.
  await page.waitForTimeout(4000);
  if (map) await waitForMap(page);
  if (scrollToBottom) {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1200);
  }
  await settle(page);
  const png = path.join(tmpDir, `${name}.png`);
  await page.screenshot({ path: png, animations: 'disabled' });
  execFileSync('cwebp', ['-q', '85', png, '-o', path.join(OUT_DIR, `${name}.webp`)], { stdio: 'pipe' });
  console.log(`captured ${name}.webp`);
}

(async () => {
  const requestedName = process.argv[2];
  const shots = requestedName ? SHOTS.filter((shot) => shot.name === requestedName) : SHOTS;
  if (shots.length === 0) throw new Error(`Unknown screenshot: ${requestedName}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'riptyde-web-shots-'));
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
      timezoneId: 'America/Los_Angeles',
      locale: 'en-US',
      reducedMotion: 'reduce',
    });
    await context.route(BLOCKED_HOSTS, (route) => route.abort());
    await context.addInitScript(() => {
      const consent = { version: 1, analytics: false, doNotSell: true, updatedAt: Date.now() };
      try { localStorage.setItem('riptyde.analytics.consent', JSON.stringify(consent)); } catch { /* private mode */ }
    });
    const page = await context.newPage();
    for (const shot of shots) await capture(page, shot, tmpDir);
    await context.close();
  } finally {
    await browser.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
