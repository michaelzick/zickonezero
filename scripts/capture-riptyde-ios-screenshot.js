#!/usr/bin/env node
/**
 * Save the booted iOS Simulator's screen as a Riptyde case-study screenshot.
 *
 * Takes a PNG with `xcrun simctl io <device> screenshot`, crops it from the top
 * to the 1284:2778 shape of the original set (so every phone fits the same
 * bezel), scales it to 642x1389, and writes a quality 85 WebP to
 * public/img/projects/riptyde/<name>.webp. The Simulator sometimes draws the
 * Dynamic Island into the frame, so a frame with a black pill at the top center
 * is retaken.
 *
 * Before capturing, build the sibling `riptyde` app into a simulator, sign in
 * there, and give it a clean status bar. Leave the clock alone so it matches
 * the times the app shows:
 *   xcrun simctl status_bar <device> override --dataNetwork wifi \
 *     --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 \
 *     --batteryState charged --batteryLevel 100
 *
 * Usage:
 *   node scripts/capture-riptyde-ios-screenshot.js <name> [device]
 * The device defaults to "booted".
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', 'riptyde');
const WIDTH = 642;
const HEIGHT = 1389;
const ATTEMPTS = 10;

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

// The island sits centered about 30pt from the top; the app never paints pure
// black there.
const showsIsland = async (file, width) => {
  const scale = width / 440;
  const pixels = await sharp(file)
    .extract({ left: Math.round(width / 2 - 20), top: Math.round(30 * scale), width: 40, height: 10 })
    .removeAlpha()
    .raw()
    .toBuffer();
  for (let i = 0; i < pixels.length; i += 3) {
    if (pixels[i] > 4 || pixels[i + 1] > 4 || pixels[i + 2] > 4) return false;
  }
  return true;
};

const main = async () => {
  const [name, device = 'booted'] = process.argv.slice(2);
  if (!name || !/^[a-z0-9-]+$/.test(name)) {
    console.error('Usage: node scripts/capture-riptyde-ios-screenshot.js <name> [device]');
    process.exit(1);
  }

  const raw = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'riptyde-shot-')), 'screen.png');
  let width = 0;
  let height = 0;
  for (let attempt = 1; ; attempt += 1) {
    execFileSync('xcrun', ['simctl', 'io', device, 'screenshot', '--type=png', raw], { stdio: 'ignore' });
    ({ width, height } = await sharp(raw).metadata());
    if (!(await showsIsland(raw, width))) break;
    if (attempt === ATTEMPTS) throw new Error(`The Dynamic Island was in all ${ATTEMPTS} frames`);
    await wait(700);
  }

  const cropHeight = Math.min(height, Math.round((width * HEIGHT) / WIDTH));
  const out = path.join(OUT_DIR, `${name}.webp`);
  await sharp(raw)
    .extract({ left: 0, top: 0, width, height: cropHeight })
    .resize(WIDTH, HEIGHT)
    .webp({ quality: 85 })
    .toFile(out);
  fs.rmSync(path.dirname(raw), { recursive: true, force: true });
  console.log(`saved ${path.relative(process.cwd(), out)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
