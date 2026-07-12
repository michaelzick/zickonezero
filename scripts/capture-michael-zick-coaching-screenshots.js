#!/usr/bin/env node
/**
 * Recapture the Michael Zick Coaching case-study screenshots from the live site.
 *
 * Captures desktop (1728x967 viewport at 2x, matching the DemoStoke/Antisyphon
 * screenshots) and mobile (810x1080 at 2x, matching the previous mobile shot)
 * and writes WebP files at quality 85 into
 * public/img/projects/michael-zick-coaching/.
 *
 * The Nice Guy University coupon modal is suppressed via its sessionStorage
 * flag (with a dismiss fallback), and the sticky NGU promo banner is removed -
 * the fixed header is shifted up to fill its slot - so the shots stay focused
 * on the coaching brand.
 *
 * Requirements (not project dependencies):
 *   - npm i -g playwright + `npx playwright install chromium`
 *   - cwebp on PATH (brew install webp)
 *
 * Usage:
 *   node scripts/capture-michael-zick-coaching-screenshots.js
 *
 * If the script fails with "Cannot find module 'playwright'", either install
 * it globally (see above) or point NODE_PATH at any node_modules that has it,
 * e.g. an npx cache entry:
 *   NODE_PATH=~/.npm/_npx/<hash>/node_modules node scripts/capture-michael-zick-coaching-screenshots.js
 * (find one with: find ~/.npm/_npx -maxdepth 3 -name playwright -type d)
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', 'michael-zick-coaching');

// Scrolled sections use scrollToText/scrollOffset like the NGU capture script:
// the offset is the gap left above the anchor text so headings clear the
// sticky nav and the section frames like the shot it replaces.
const DESKTOP_PAGES = [
  { name: 'mz-home-ngrc', url: 'https://www.michaelzick.com/' },
  {
    name: 'mz-protocol-ngrc',
    url: 'https://www.michaelzick.com/',
    scrollToText: 'The Approval Exit Protocol',
    scrollOffset: 200,
    // The protocol section is shorter than the viewport; end the shot just
    // above the next section so its heading is not sliced mid-letter.
    clipAboveText: 'Real Clients. Real Results.',
  },
  {
    name: 'mz-testimonial-ngrc',
    url: 'https://www.michaelzick.com/testimonials',
    scrollToText: 'Ryan I.',
    scrollOffset: 250,
  },
];

const MOBILE_PAGES = [
  { name: 'mz-mobile-ngrc', url: 'https://www.michaelzick.com/' },
];

async function dismissCouponModal(page) {
  const dialog = page.locator('[role="dialog"], [class*="modal" i]').first();
  try {
    await dialog.waitFor({ state: 'visible', timeout: 3000 });
  } catch {
    return; // no modal appeared
  }
  const closeBtn = page.locator('[role="dialog"] button[aria-label*="lose" i]').first();
  if (await closeBtn.count()) await closeBtn.click();
  else await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
}

async function hidePromoBanner(page) {
  await page.evaluate(() => {
    document.querySelector('aside[aria-label="Nice Guy University promotion"]')?.remove();
    const header = document.querySelector('header');
    if (header) {
      // The fixed header is offset below the banner; snap it to the top
      // without animating its 500ms transition.
      header.style.transition = 'none';
      header.style.top = '0px';
    }
  });
}

async function capture(page, { name, url, scrollToText, scrollOffset, settleMs, clipAboveText }, tmpDir) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await dismissCouponModal(page);
  await hidePromoBanner(page);
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2500); // settle fonts, images, animations
  if (scrollToText) {
    await page.getByText(scrollToText, { exact: false }).first().evaluate((node, offset) => {
      const rect = node.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + rect.top - offset, behavior: 'instant' });
    }, scrollOffset ?? 200);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(settleMs ?? 1500);
  }
  let clip;
  if (clipAboveText) {
    const cutoffTop = await page.getByText(clipAboveText, { exact: false }).first().evaluate((node) => {
      const target = node.closest('section') ?? node;
      return Math.round(target.getBoundingClientRect().top);
    });
    const viewport = page.viewportSize();
    clip = { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, cutoffTop - 8) };
  }
  const png = path.join(tmpDir, `${name}.png`);
  await page.screenshot({ path: png, ...(clip ? { clip } : {}) });
  execFileSync('cwebp', ['-q', '85', png, '-o', path.join(OUT_DIR, `${name}.webp`)], { stdio: 'pipe' });
  console.log(`captured ${name}.webp`);
}

async function captureViewport(browser, viewport, pages, tmpDir) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
  // Pre-seed the flag the site sets after showing the coupon modal so it
  // never opens mid-capture.
  await context.addInitScript(() => sessionStorage.setItem('nguPromoSeen', 'true'));
  const page = await context.newPage();
  for (const pageDef of pages) await capture(page, pageDef, tmpDir);
  await context.close();
}

(async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mzc-shots-'));
  const browser = await chromium.launch();

  await captureViewport(browser, { width: 1728, height: 967 }, DESKTOP_PAGES, tmpDir);
  await captureViewport(browser, { width: 810, height: 1080 }, MOBILE_PAGES, tmpDir);

  await browser.close();
  fs.rmSync(tmpDir, { recursive: true, force: true });
})();
