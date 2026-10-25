#!/usr/bin/env node
/**
 * Render the Riptyde case study's opening hero, a 3456x1944 composite of
 * three phone screens on Riptyde's own navy halftone, and its 640, 960, 1440,
 * and 1920px copies, into public/img/projects/riptyde/.
 *
 * The phones wear the site's phone bezel (ShowcaseImage's portrait frame in
 * styles/projectShowcases.js) with the app's hard ink offset shadow, and the
 * backdrop borrows the app's palette and halftone and stripe patterns from
 * SurfStyle.swift in the sibling riptyde repo. The three screens it shows
 * appear nowhere else on the UX Case Study tab, so keep that true when
 * swapping one.
 *
 * Requirements (not project dependencies):
 *   - npm i -g playwright (or npx) + `npx playwright install chromium`
 * Sharp, which writes the WebP files, is a project dependency.
 *
 * Usage:
 *   node scripts/render-riptyde-hero.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { pathToFileURL } = require('url');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'public', 'img', 'projects', 'riptyde');
const OUT = path.join(DIR, 'riptyde-case-study-hero.webp');
const COPY_WIDTHS = [640, 960, 1440, 1920];

const WIDTH = 3456;
const HEIGHT = 1944;

// SurfStyle.swift
const NAVY = '#0B2A4A';
const INK = '#0A0F1F';
const BLUE = '#1E5BD8';
const LIME = '#C8F23A';
const FUCHSIA = '#FF2D87';
const SKY = '#74C7E8';

// Left to right; the middle phone stands taller and in front.
const PHONES = [
  { file: 'riptyde-spots.webp', height: 1480, lift: 120 },
  { file: 'riptyde-home.webp', height: 1720, lift: 0 },
  { file: 'riptyde-rad-page.webp', height: 1480, lift: -120 },
];
const SCREEN_RATIO = 642 / 1389;
const GAP = 150;

const phoneMarkup = ({ file, height, lift }, index) => {
  const width = Math.round(height * SCREEN_RATIO);
  // The site's bezel is 0.45em on a 22rem-wide phone, rounded 2.1em.
  const bezel = Math.round(width * 0.0205);
  const radius = Math.round(width * 0.0955);
  return `<img class="phone${index === 1 ? ' center' : ''}" src="${pathToFileURL(path.join(DIR, file))}"
    style="width:${width}px;height:${height}px;border-width:${bezel}px;border-radius:${radius}px;transform:translateY(${lift}px)">`;
};

const html = () => `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }

  body {
    position: relative;
    background-color: ${NAVY};
    /* SurfStyle's halftone: 1.2pt dots every 7pt, scaled up. */
    background-image: radial-gradient(circle, rgba(116, 199, 232, 0.2) 5px, transparent 5.5px);
    background-size: 30px 30px;
  }

  /* A low sun behind the middle phone. */
  .sun {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 2100px;
    height: 2100px;
    margin: -852px 0 0 -1050px;
    border-radius: 50%;
    background: ${LIME};
    box-shadow: 28px 28px 0 ${INK};
  }

  /* Water: the app's -45 degree stripes, under the sun. */
  .sea {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 640px;
    background: repeating-linear-gradient(-45deg, ${BLUE} 0 52px, ${NAVY} 52px 74px);
    border-top: 14px solid ${INK};
  }

  .sea::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 34px;
    background: ${FUCHSIA};
    border-bottom: 14px solid ${INK};
  }

  .phones {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${GAP}px;
  }

  .phone {
    display: block;
    box-sizing: border-box;
    border-style: solid;
    border-color: #06090f;
    background: #06090f;
    object-fit: cover;
    box-shadow: 0 0 0 3px ${SKY}, 34px 34px 0 ${INK};
  }

  .phone.center { position: relative; z-index: 1; box-shadow: 0 0 0 3px ${SKY}, 42px 42px 0 ${INK}; }
</style>
</head>
<body>
  <div class="sun"></div>
  <div class="sea"></div>
  <div class="phones">${PHONES.map(phoneMarkup).join('')}</div>
</body>
</html>`;

const main = async () => {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'riptyde-hero-'));
  const page = path.join(workDir, 'hero.html');
  fs.writeFileSync(page, html());

  const browser = await chromium.launch();
  try {
    const tab = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
    await tab.goto(pathToFileURL(page).href);
    await tab.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
    const capture = await tab.screenshot({ type: 'png' });
    await sharp(capture).webp({ quality: 85 }).toFile(OUT);
    console.log(`Wrote ${path.relative(ROOT, OUT)}`);
    for (const width of COPY_WIDTHS) {
      const copy = OUT.replace(/\.webp$/, `-${width}w.webp`);
      await sharp(capture).resize(width).webp({ quality: 80 }).toFile(copy);
      console.log(`Wrote ${path.relative(ROOT, copy)}`);
    }
  } finally {
    await browser.close();
    fs.rmSync(workDir, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
