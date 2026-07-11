#!/usr/bin/env node
/**
 * Recapture the Nice Guy University case-study screenshots from the live site.
 *
 * Captures desktop (1728x967 viewport at 2x, matching the DemoStoke/Antisyphon
 * screenshots) and writes WebP files at quality 85 into
 * public/img/nice-guy-university/.
 *
 * Requirements (not project dependencies):
 *   - npm i -g playwright (or npx) + `npx playwright install chromium`
 *   - cwebp on PATH (brew install webp)
 *
 * Usage:
 *   node scripts/capture-ngu-screenshots.js
 *
 * Admin pages require an authenticated session. Sign in through a Playwright
 * window, save the storage state JSON, and pass it via NGU_STORAGE_STATE:
 *   NGU_STORAGE_STATE=/path/to/state.json node scripts/capture-ngu-screenshots.js
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'nice-guy-university');
const HANDSHAKE_SECONDS = 4.0; // hero video moment where the two men shake hands

const PAGES = [
  { name: 'ngu-home', url: 'https://www.niceguyuniversity.com/', freezeVideoAt: HANDSHAKE_SECONDS },
  { name: 'ngu-courses', url: 'https://www.niceguyuniversity.com/courses' },
  { name: 'ngu-course-detail', url: 'https://www.niceguyuniversity.com/course/introduction-to-nice-guy-recovery' },
  { name: 'ngu-how-it-works', url: 'https://www.niceguyuniversity.com/how-it-works' },
  { name: 'ngu-coach-profile', url: 'https://www.niceguyuniversity.com/coaches/michael-zick' },
];

const ADMIN_PAGES = [
  { name: 'ngu-admin-analytics', url: 'https://www.niceguyuniversity.com/admin/analytics?tab=course-completion' },
  { name: 'ngu-admin-reviews', url: 'https://www.niceguyuniversity.com/admin/reviews?status=all' },
];

async function dismissCouponModal(page) {
  const dialog = page.locator('[role="dialog"], [class*="modal" i]').first();
  try {
    await dialog.waitFor({ state: 'visible', timeout: 6000 });
  } catch {
    return; // no modal appeared
  }
  const closeBtn = page.locator('[role="dialog"] button[aria-label*="lose" i]').first();
  if (await closeBtn.count()) await closeBtn.click();
  else await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
}

async function freezeVideos(page, seconds) {
  await page.evaluate(async (t) => {
    const videos = [...document.querySelectorAll('video')];
    await Promise.all(videos.map(async (v) => {
      v.autoplay = false;
      v.onplay = () => v.pause();
      v.pause();
      v.currentTime = t;
      await new Promise((res) => v.addEventListener('seeked', res, { once: true }));
      v.pause();
    }));
  }, seconds);
}

async function capture(page, { name, url, freezeVideoAt }, tmpDir) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await dismissCouponModal(page);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2500); // settle fonts, images, animations
  if (freezeVideoAt != null) {
    await freezeVideos(page, freezeVideoAt);
    await page.waitForTimeout(300);
  }
  const png = path.join(tmpDir, `${name}.png`);
  await page.screenshot({ path: png });
  execFileSync('cwebp', ['-q', '85', png, '-o', path.join(OUT_DIR, `${name}.webp`)], { stdio: 'pipe' });
  console.log(`captured ${name}.webp`);
}

(async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ngu-shots-'));
  const storageState = process.env.NGU_STORAGE_STATE;
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1728, height: 967 },
    deviceScaleFactor: 2,
    ...(storageState ? { storageState } : {}),
  });
  const page = await context.newPage();

  for (const pageDef of PAGES) await capture(page, pageDef, tmpDir);

  if (storageState) {
    for (const pageDef of ADMIN_PAGES) await capture(page, pageDef, tmpDir);
  } else {
    console.log('NGU_STORAGE_STATE not set - skipping admin pages.');
  }

  await browser.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
})();
