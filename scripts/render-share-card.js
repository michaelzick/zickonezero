#!/usr/bin/env node
/**
 * Redraw the wordmark on the default share card, public/img/og/zickonezero-card.png,
 * in the homepage hero card's type: "ZICKONEZERO" over "CREATIVE", with the
 * short divider under it in the logo's cyan.
 *
 * Only the wordmark band to the right of the logo and the divider change. The
 * script loads the card, paints that band with the card's flat background,
 * sets the text with the hero's rules scaled up, and repaints the divider, so
 * the logo, name, and disciplines stay pixel-identical. Re-running it is safe:
 * it repaints the same pixels.
 *
 * The rules mirror .hero-title, .brand-name, and .hero-creative in
 * styles/home.ts and .brand-one in styles/globals.scss (night colors), measured
 * at a 1440px-wide window, where the title is 3.2vw = 46.08px.
 *
 * Requirements (not project dependencies):
 *   - npm i -g playwright (or npx) + `npx playwright install chromium`
 * Sharp, which compresses the PNG, is a project dependency.
 *
 * Usage:
 *   node scripts/render-share-card.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const CARD = path.join(ROOT, 'public', 'img', 'og', 'zickonezero-card.png');
const ORBITRON = path.join(ROOT, 'node_modules', '@fontsource-variable', 'orbitron', 'files', 'orbitron-latin-wght-normal.woff2');

const WIDTH = 1200;
const HEIGHT = 630;
const BACKGROUND = 'rgb(0, 2, 8)';

// The band holding the wordmark: right of the logo (which ends at x 458) and
// above the divider (which starts at y 355). The card is flat BACKGROUND here.
const BAND = { left: 530, top: 180, width: WIDTH - 530, height: 170 };

// The divider between the wordmark and the name, a crisp 120x3 rule, in the
// cyan of the logo's Z and zero (public/img/brand/zickonezero-mark-v4.png).
const DIVIDER = { left: 557, top: 355, width: 120, height: 3 };
const LOGO_CYAN = '#15fcfd';

// The hero title is 46.08px at 1440px wide. Scaled so the wordmark spans the
// card's existing 560-1083px, it keeps the layout's balance.
const HERO_TITLE_PX = 46.08;
const SCALE = 57 / HERO_TITLE_PX;
const px = (value) => `${(value * SCALE).toFixed(2)}px`;

// Where the title box sits so the Z's ink starts at x 560 and its cap top at y 205.
const TITLE_POSITION = { left: 557, top: 184 };

const html = () => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face {
    font-family: 'Orbitron';
    src: url('${pathToFileURL(ORBITRON)}') format('woff2');
    font-weight: 400 900;
  }

  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }

  body {
    background: url('${pathToFileURL(CARD)}') no-repeat;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .band {
    position: absolute;
    left: ${BAND.left}px;
    top: ${BAND.top}px;
    width: ${BAND.width}px;
    height: ${BAND.height}px;
    background: ${BACKGROUND};
  }

  .divider {
    position: absolute;
    left: ${DIVIDER.left}px;
    top: ${DIVIDER.top}px;
    width: ${DIVIDER.width}px;
    height: ${DIVIDER.height}px;
    background: ${LOGO_CYAN};
  }

  /* .hero-title */
  .title {
    position: absolute;
    left: ${TITLE_POSITION.left}px;
    top: ${TITLE_POSITION.top}px;
    margin: 0;
    color: #e9f6ff;
    font-family: 'Orbitron';
    font-size: ${px(HERO_TITLE_PX)};
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 1.2;
    white-space: nowrap;
  }

  /* .hero-title .brand-name */
  .brand-name {
    display: block;
    margin-top: ${px(4)};
    font-size: 1.15em;
    letter-spacing: -0.025em;
  }

  /* .brand-name .brand-one: --color-accent at night */
  .brand-one { color: #e81ea8; }

  /* .hero-creative */
  .creative {
    display: block;
    margin-top: ${px(6)};
    font-size: 0.5em;
    letter-spacing: 0.16em;
    line-height: 1.35;
    text-transform: uppercase;
  }
</style>
</head>
<body>
  <div class="band"></div>
  <div class="divider"></div>
  <h1 class="title"><span class="brand-name">ZICK<span class="brand-one">ONE</span>ZERO</span><span class="creative">Creative</span></h1>
</body>
</html>`;

const main = async () => {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'share-card-'));
  const page = path.join(workDir, 'card.html');
  fs.writeFileSync(page, html());

  const browser = await chromium.launch();
  try {
    const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    await tab.goto(pathToFileURL(page).href);
    await tab.evaluate(() => document.fonts.ready);
    // The page reads the card as its background, so capture before overwriting it.
    const capture = await tab.screenshot({ type: 'png' });
    // Lossless on purpose: a palette (which sharp's effort option turns on)
    // would shift the logo's edge pixels.
    const png = await sharp(capture).png({ compressionLevel: 9, adaptiveFiltering: false, palette: false }).toBuffer();
    fs.writeFileSync(CARD, png);
    console.log(`Wrote ${path.relative(ROOT, CARD)}`);
  } finally {
    await browser.close();
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
