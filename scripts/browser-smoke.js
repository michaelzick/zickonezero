#!/usr/bin/env node
// Optional browser smoke test for the static export. It never runs with
// `npm test` or CI's checks job: run it by hand after `npm run build`.
//
// It serves out/ with the production headers from _headers (so the real
// Content-Security-Policy applies), blocks third-party requests, and loads key
// pages in headless Chromium at desktop and phone sizes. A page fails on a page
// error, a console error from the site itself, horizontal overflow, or a
// missing main heading. The homepage also has to start at night, keep a stored
// day mode, move its hero on scroll, and hold the hero still under reduced
// motion. Its Bar Four sign has to lead to the club, whose house rack opens on
// Neon Skyline and plays under the homepage's Content-Security-Policy, and by
// day the flight-case lid has to be down over the rack. The whole run stops after three
// minutes.
//
//   npm run test:browser [-- --screenshots <dir>]
//
// --screenshots saves a viewport PNG of each page for manual review.
// Requirements (not project dependencies): Playwright, from a global install
// (npm i -g playwright) or a local `npm install --no-save playwright`, plus
// `npx playwright install chromium`.
const fs = require('fs');
const http = require('http');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.join(__dirname, '..', 'out');
const TIME_LIMIT_MS = 3 * 60 * 1000;
// Mirrors THEME_STORAGE_KEY in src/theme/themeConfig.ts.
const THEME_STORAGE_KEY = 'zickonezero-theme';
const HERO = 'section[aria-labelledby="home-hero-title"]';
const RACK_PATCH = 'Neon Skyline';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'contact', path: '/contact/' },
  { name: 'demostoke', path: '/demostoke/' },
  { name: 'riptyde', path: '/riptyde/' },
  { name: 'bar-four', path: '/bar-four/' },
  { name: 'missing', path: '/no-such-page/', status: 404 },
];

const SIZES = [
  { name: 'desktop', options: { viewport: { width: 1440, height: 900 } } },
  {
    name: 'phone',
    options: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  },
];

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

const USAGE = 'Usage: npm run test:browser [-- --screenshots <dir>]';

/** Read the command line; `--screenshots <dir>` is the only option. */
function parseArgs(argv) {
  const options = { screenshotsDir: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== '--screenshots') {
      throw new Error(`Unknown option ${argv[index]}. ${USAGE}`);
    }
    if (!argv[index + 1] || argv[index + 1].startsWith('--')) {
      throw new Error(`--screenshots needs a directory. ${USAGE}`);
    }
    options.screenshotsDir = path.resolve(argv[index + 1]);
    index += 1;
  }
  return options;
}

/**
 * Map a URL path to a file under root as the static host does, a trailing
 * slash serving that folder's index.html. Null when the path escapes root.
 */
function resolveStaticPath(root, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (error) {
    return null;
  }
  if (decoded.includes('\0')) {
    return null;
  }

  const base = path.resolve(root);
  const file = path.join(base, decoded.endsWith('/') ? `${decoded}index.html` : decoded);
  return file === base || file.startsWith(`${base}${path.sep}`) ? file : null;
}

const contentTypeFor = (file) => CONTENT_TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';

/** The headers a host rule file (_headers) sends with every path, from its `/*` rule. */
function parseSiteHeaders(text) {
  const headers = {};
  let inSiteRule = false;
  text.split(/\r?\n/).forEach((line) => {
    if (!line.trim() || line.trim().startsWith('#')) {
      return;
    }
    if (!/^\s/.test(line)) {
      inSiteRule = line.trim() === '/*';
      return;
    }
    const separator = line.indexOf(':');
    if (inSiteRule && separator > 0) {
      headers[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    }
  });
  return headers;
}

/**
 * A static server for the export: files with the given headers, folders
 * redirected to their trailing-slash URL, and 404.html with a 404 status for
 * anything missing or outside root.
 */
function createStaticServer(root, headers = {}) {
  const base = path.resolve(root);
  const notFoundPage = path.join(base, '404.html');

  const sendFile = (response, status, file) => {
    response.writeHead(status, { ...headers, 'Content-Type': contentTypeFor(file) });
    fs.createReadStream(file).on('error', () => response.destroy()).pipe(response);
  };

  return http.createServer(async (request, response) => {
    const { pathname } = new URL(request.url, 'http://localhost');
    const file = resolveStaticPath(base, pathname);
    const stats = file && await fs.promises.stat(file).catch(() => null);

    if (stats?.isFile()) {
      sendFile(response, 200, file);
    } else if (stats?.isDirectory()) {
      response.writeHead(308, { ...headers, Location: `${pathname}/` });
      response.end();
    } else if (fs.existsSync(notFoundPage)) {
      sendFile(response, 404, notFoundPage);
    } else {
      response.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  });
}

/** Whether a URL belongs to another origin; those requests are blocked on purpose. */
function isThirdParty(url, origin) {
  try {
    return new URL(url).origin !== origin;
  } catch (error) {
    return false;
  }
}

/** Playwright from a local install, else the global one; null when neither exists. */
function loadPlaywright() {
  const load = (request) => {
    try {
      return require(request);
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        return null;
      }
      throw error;
    }
  };

  const local = load('playwright');
  if (local) {
    return local;
  }
  try {
    return load(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright'));
  } catch (error) {
    return null;
  }
}

/** Collect page errors and console errors from the site itself, never from blocked third parties. */
function watchErrors(tab, origin, page) {
  const errors = [];
  tab.on('pageerror', (error) => errors.push(`page error: ${error.message}`));
  tab.on('console', (message) => {
    const source = message.location().url;
    // The missing page answers 404 on purpose, and Chromium logs that.
    const expected404 = page.status === 404 && source === `${origin}${page.path}`;
    if (message.type() === 'error' && !isThirdParty(source, origin) && !expected404) {
      errors.push(`console error: ${message.text().trim()}`);
    }
  });
  return errors;
}

async function runSmokeTest({ screenshotsDir }) {
  if (!fs.existsSync(path.join(OUT_DIR, 'index.html'))) {
    throw new Error('No static export in out/. Run `npm run build` first.');
  }
  const playwright = loadPlaywright();
  if (!playwright) {
    throw new Error([
      'Playwright is not installed. It is not a project dependency; install it once with:',
      '  npm i -g playwright && npx playwright install chromium',
    ].join('\n'));
  }

  const headersFile = path.join(OUT_DIR, '_headers');
  const headers = fs.existsSync(headersFile) ? parseSiteHeaders(fs.readFileSync(headersFile, 'utf8')) : {};
  const server = createStaticServer(OUT_DIR, headers);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const failures = [];
  let visits = 0;
  if (screenshotsDir) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const deadline = setTimeout(() => {
    console.error(`Browser smoke test stopped: still running after ${TIME_LIMIT_MS / 60000} min.`);
    failures.forEach((failure) => console.error(`  ${failure}`));
    process.exit(1);
  }, TIME_LIMIT_MS);

  let browser;
  const shotPath = (name) => (screenshotsDir && name ? path.join(screenshotsDir, `${name}.png`) : null);

  /**
   * Decode the images in view before a screenshot. Screenshots fast-forward
   * animations, which can reveal an image (a gig card booting up) before its
   * async decode is done and capture an empty frame. Gives up after 5 s.
   */
  const decodeImagesInView = (tab) => tab.evaluate(() => Promise.race([
    Promise.all(Array.from(document.images)
      .filter((img) => {
        const { top, bottom } = img.getBoundingClientRect();
        return bottom > 0 && top < window.innerHeight;
      })
      .map((img) => img.decode().catch(() => {}))),
    new Promise((resolve) => {
      setTimeout(resolve, 5000);
    }),
  ]));

  const newContext = async (options) => {
    const context = await browser.newContext(options);
    await context.route('**/*', (route) => (
      isThirdParty(route.request().url(), origin) ? route.abort() : route.continue()
    ));
    return context;
  };

  /** Load a page, run the shared checks and any extra ones, and record what fails. */
  const visit = async (context, label, page, extraChecks, shotName) => {
    const where = `[${label}] ${page.path}`;
    const fail = (message) => failures.push(`${where}: ${message}`);
    const tab = await context.newPage();
    const errors = watchErrors(tab, origin, page);
    visits += 1;

    try {
      const response = await tab.goto(`${origin}${page.path}`, { waitUntil: 'load' });
      const status = page.status ?? 200;
      if (response?.status() !== status) {
        fail(`expected status ${status}, got ${response?.status()}`);
      }

      const heading = tab.locator('h1').first();
      await heading.waitFor({ state: 'visible', timeout: 10000 });
      if (!(await heading.innerText()).trim()) {
        fail('the main heading is empty');
      }
      // Let effects, prefetches, and fonts settle; a page that never idles still gets checked.
      await tab.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

      const width = await tab.evaluate(() => document.documentElement.scrollWidth);
      const windowWidth = tab.viewportSize().width;
      if (width > windowWidth) {
        fail(`the page is ${width - windowWidth}px wider than the ${windowWidth}px window`);
      }

      const file = shotPath(shotName);
      if (file) {
        await decodeImagesInView(tab);
        await tab.screenshot({ path: file, animations: 'disabled' });
      }
      await extraChecks?.(tab, fail);
    } catch (error) {
      fail(error.message.split('\n')[0]);
    } finally {
      errors.forEach(fail);
      await tab.close();
    }
  };

  /** Night by default, and the hero scene follows the scroll. */
  const homeChecks = (sizeName) => async (tab, fail) => {
    const theme = await tab.evaluate(() => document.documentElement.dataset.theme);
    if (theme !== 'dark') {
      fail(`expected night (data-theme="dark"), got ${theme}`);
    }

    await tab.evaluate(() => window.scrollTo(0, 400));
    await tab.waitForFunction(
      (hero) => Number(document.querySelector(hero)?.style.getPropertyValue('--p')) > 0,
      HERO,
      { timeout: 5000 },
    ).catch(() => fail('the hero did not move on scroll (--p stayed at 0)'));

    const districts = shotPath(`${sizeName}-home-districts`);
    if (districts) {
      await tab.evaluate(() => {
        const top = document.getElementById('case-studies')?.getBoundingClientRect().top ?? 0;
        window.scrollTo({ top: window.scrollY + top, behavior: 'instant' });
      });
      // Give the lazy thumbnails a moment to start loading after the jump.
      await tab.waitForTimeout(600);
      await decodeImagesInView(tab);
      await tab.screenshot({ path: districts, animations: 'disabled' });
    }
  };

  /** At night the booth's rack powers up on the starter patch. */
  const clubChecks = async (tab, fail) => {
    const patchName = tab.getByRole('textbox', { name: 'Patch name' });
    await patchName.waitFor({ state: 'visible', timeout: 15000 })
      .catch(() => fail('the rack never powered up at night'));
    const name = await patchName.inputValue().catch(() => null);
    if (name !== null && name !== RACK_PATCH) {
      fail(`expected the rack to open on ${RACK_PATCH}, got ${name}`);
    }
  };

  /**
   * The homepage sign leads to the club with a client-side navigation, so
   * the homepage's CSP is the one in force when Play All registers the rack's
   * blob: audio worklets.
   */
  const clubFromSignChecks = async (tab, fail) => {
    await tab.evaluate(() => {
      window.cspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => {
        window.cspViolations.push(`${event.violatedDirective} ${event.blockedURI}`);
      });
    });
    await tab.getByRole('link', { name: 'Bar Four' }).click();
    await tab.waitForURL('**/bar-four/', { timeout: 10000 });
    await clubChecks(tab, fail);

    await tab.getByRole('button', { name: 'Play all sequencers' }).click();
    await tab.getByRole('button', { name: 'Pause all sequencers' }).waitFor({ timeout: 10000 })
      .catch(() => fail('Play All did not start the rack'));
    // Give the worklets and the first bars time to fail loudly if they will.
    await tab.waitForTimeout(1500);
    const violations = await tab.evaluate(() => window.cspViolations);
    violations.forEach((violation) => fail(`CSP blocked ${violation}`));

    const file = shotPath('desktop-bar-four-playing');
    if (file) {
      await tab.screenshot({ path: file, animations: 'disabled' });
    }
    await tab.getByRole('button', { name: 'Pause all sequencers' }).click().catch(() => {});
  };

  try {
    browser = await playwright.chromium.launch();

    for (const size of SIZES) {
      const context = await newContext(size.options);
      for (const page of PAGES) {
        const checks = { home: homeChecks(size.name), 'bar-four': clubChecks };
        await visit(context, size.name, page, checks[page.name], `${size.name}-${page.name}`);
      }
      await context.close();
    }

    const desktop = SIZES[0].options;
    const home = PAGES[0];
    const club = PAGES.find((page) => page.name === 'bar-four');

    const signContext = await newContext(desktop);
    await visit(signContext, 'desktop, from the sign', home, clubFromSignChecks);
    await signContext.close();

    const dayContext = await newContext(desktop);
    await dayContext.addInitScript((key) => window.localStorage.setItem(key, 'light'), THEME_STORAGE_KEY);
    await visit(dayContext, 'desktop, day', home, async (tab, fail) => {
      const theme = await tab.evaluate(() => document.documentElement.dataset.theme);
      if (theme !== 'light') {
        fail(`expected the stored day mode (data-theme="light"), got ${theme}`);
      }
    }, 'desktop-home-day');
    await visit(dayContext, 'desktop, day', club, async (tab, fail) => {
      const wait = tab.getByRole('button', { name: 'Wait for dark' });
      await wait.waitFor({ state: 'visible', timeout: 5000 })
        .catch(() => fail('the club was not closed by day'));
      if (await tab.locator('.booth-rack').count()) {
        fail('the rack mounted by day');
      }
    }, 'desktop-bar-four-day');
    await dayContext.close();

    const stillContext = await newContext({ ...desktop, reducedMotion: 'reduce' });
    await visit(stillContext, 'desktop, reduced motion', home, async (tab, fail) => {
      await tab.evaluate(() => window.scrollTo(0, 400));
      await tab.waitForTimeout(500);
      const progress = await tab.evaluate((hero) => document.querySelector(hero)?.style.getPropertyValue('--p'), HERO);
      if (progress) {
        fail(`the hero moved under reduced motion (--p is ${progress})`);
      }
    });
    await stillContext.close();
  } finally {
    clearTimeout(deadline);
    await browser?.close();
    server.close();
    server.closeAllConnections();
  }

  return { failures, visits };
}

module.exports = {
  contentTypeFor,
  createStaticServer,
  isThirdParty,
  parseArgs,
  parseSiteHeaders,
  resolveStaticPath,
};

if (require.main === module) {
  (async () => {
    const options = parseArgs(process.argv.slice(2));
    const { failures, visits } = await runSmokeTest(options);
    if (failures.length) {
      console.error(`Browser smoke test failed: ${failures.length} problem(s) in ${visits} page visits.`);
      failures.forEach((failure) => console.error(`  ${failure}`));
      process.exitCode = 1;
      return;
    }
    console.log(`Browser smoke test passed: ${visits} page visits at desktop and phone sizes.`);
    if (options.screenshotsDir) {
      console.log(`Screenshots saved to ${options.screenshotsDir}`);
    }
  })().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
