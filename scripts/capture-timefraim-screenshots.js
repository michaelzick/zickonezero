#!/usr/bin/env node
/**
 * Recapture the TimeFraim UX showcase screenshots from the local screenshot
 * sandbox (see scripts/timefraim-sandbox/start.sh), never from real data.
 *
 * Captures desktop shots (1728x967 viewport at 2x, matching the other
 * showcases) and writes WebP files at quality 85 into
 * public/img/projects/timefraim/.
 *
 * How it stays deterministic and cursor-free:
 *   - Playwright's page.screenshot() never draws a mouse cursor; the pointer is
 *     parked in the page padding and the focused element blurred before every
 *     shot so no hover or focus ring appears.
 *   - The browser clock is fixed to Tue 2026-09-15 10:52 AM PDT, the day the
 *     sandbox seed populates, so the now-line and the elapsed timer are stable.
 *     The calendar-only shot views the seed's second day instead, with the
 *     clock fixed to Wed 2026-09-16 8:50 AM PDT.
 *   - Sign-in uses the Supabase admin magic-link API against the sandbox (the
 *     flow the TimeFraim repo documents for localhost), completed inside the
 *     page through the app's own Supabase client.
 *   - Data changes between shots go through SQL, never the app: the active
 *     timer is stopped (the app's timer routes stamp the real clock, which
 *     would disagree with the fixed browser time) and the seeded tasks are
 *     cleared for the calendar-only shot. The seed is restored when the script
 *     starts and finishes, so it can be re-run without restarting the sandbox.
 *
 * Requirements (not project dependencies):
 *   - the sandbox running: bash scripts/timefraim-sandbox/start.sh
 *   - playwright + a matching chromium (`npx playwright install chromium`)
 *   - cwebp on PATH (brew install webp)
 *   - the TimeFraim .env for SUPABASE_SERVICE_ROLE_KEY, ALLOWED_EMAIL and
 *     VITE_SUPABASE_URL (values are used in memory only, never printed)
 *
 * Usage:
 *   NODE_PATH=<node_modules containing playwright> \
 *     node --env-file=../timefraim/.env scripts/capture-timefraim-screenshots.js
 */
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects', 'timefraim');
const APP_URL = (process.env.TIMEFRAIM_APP_URL ?? 'http://127.0.0.1:6173').replace(/\/$/, '');
const SUPABASE_URL = (process.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:55331').replace(/\/$/, '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL = process.env.ALLOWED_EMAIL;

// Only ever run SQL against the sandbox database container.
const DB_CONTAINER = 'supabase_db_timefraim-shots';
const SEED_SQL = path.join(__dirname, 'timefraim-sandbox', 'seed.sql');

// Scenario from scripts/timefraim-sandbox/seed.sql.
const DATE = '2026-09-15';
const FIXED_NOW = '2026-09-15T17:52:00.000Z'; // 10:52 AM PDT
const RUNNING_TASK_ID = 'a1000000-0000-4000-8000-000000000002'; // Prototype the day planner timeline
const DETAIL_TASK_ID = 'a1000000-0000-4000-8000-000000000006'; // Refine the meeting search flow
const CALENDAR_DATE = '2026-09-16'; // holds only Google Calendar events
const CALENDAR_NOW = '2026-09-16T15:50:00.000Z'; // 8:50 AM PDT, just before the standup
const CALENDAR_EVENT_TITLE = 'Client kickoff';

// Deleting tasks cascades to schedule blocks and timer sessions; calendar
// events and the user, preference and Toggl rows are untouched.
const CLEAR_TASKS_SQL = 'delete from public.audit_logs; delete from public.tasks;';

const VIEWPORT = { width: 1728, height: 967 };
// Timeline geometry (apps/web/src/components/timeline-geometry.ts): the day
// runs 4:00-24:00 at 28px per 15 minutes, and the page (not the column)
// scrolls, so framing a planner shot means scrolling the window.
const TIMELINE_START_HOUR = 4;
const PX_PER_HOUR = 112;
const STICKY_TOP_PX = 24; // xl:top-6 on the sticky queue/detail columns

function requireEnv() {
  const missing = [];
  if (!SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!EMAIL) missing.push('ALLOWED_EMAIL');
  if (missing.length) {
    throw new Error(`Missing ${missing.join(', ')}. Run with node --env-file=<timefraim>/.env`);
  }
}

function runSql(sql) {
  execFileSync(
    'docker',
    ['exec', '-i', DB_CONTAINER, 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-q'],
    { input: sql, stdio: ['pipe', 'pipe', 'inherit'] },
  );
}

// Put the sandbox back to exactly what start.sh loaded: drop the task-related
// rows (a previous run stops the timer and clears them) and re-run the seed,
// whose inserts are all "on conflict do nothing".
function restoreSeed() {
  runSql(`${CLEAR_TASKS_SQL}\n${fs.readFileSync(SEED_SQL, 'utf8')}`);
}

async function mintMagicLinkToken() {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'magiclink', email: EMAIL }),
  });
  if (!response.ok) {
    throw new Error(`generate_link failed: ${response.status} ${await response.text()}`);
  }
  const body = await response.json();
  const tokenHash = body.hashed_token ?? body.properties?.hashed_token;
  if (!tokenHash) throw new Error('generate_link returned no hashed_token');
  return tokenHash;
}

async function signIn(page, tokenHash) {
  await page.goto(`${APP_URL}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(async (hash) => {
    // Vite serves the app's own client module, so the session lands in the
    // same storage the app reads (a plain visit to the action link does not).
    const { supabase } = await import('/src/lib/supabase.ts');
    const { error } = await supabase.auth.verifyOtp({ token_hash: hash, type: 'magiclink' });
    if (error) throw new Error(error.message);
  }, tokenHash);
  await waitForPlanner(page);
}

async function waitForPlanner(page) {
  await page.getByText('Task queue', { exact: false }).first().waitFor({ timeout: 30000 });
  await page.getByText('4:00', { exact: true }).first().waitFor({ timeout: 30000 });
  await page.waitForLoadState('networkidle');
}

async function setSectionOpen(page, controlsId, open) {
  const toggle = page.locator(`button[aria-controls="${controlsId}"]`).first();
  await toggle.waitFor({ timeout: 10000 });
  if ((await toggle.getAttribute('aria-expanded')) !== String(open)) {
    await toggle.click();
    await page.waitForTimeout(400);
  }
}

async function setCardOpen(page, namePattern, open) {
  const toggle = page.getByRole('button', { name: namePattern }).first();
  await toggle.waitFor({ timeout: 10000 });
  const expanded = await toggle.getAttribute('aria-expanded');
  if (expanded !== null && expanded !== String(open)) {
    await toggle.click();
    await page.waitForTimeout(400);
  }
}

// Scroll the window so the given hour sits just under the sticky column tops.
async function frameTimeline(page, hourAtTop) {
  await page.evaluate(({ hour, startHour, pxPerHour, stickyTop }) => {
    const label = Array.from(document.querySelectorAll('span')).find((el) => el.textContent?.trim() === '4:00');
    if (!label) throw new Error('timeline 4:00 label not found');
    // label -> 15-minute slot -> the absolutely positioned day container
    const container = label.parentElement?.parentElement;
    if (!container) throw new Error('timeline container not found');
    const top = window.scrollY + container.getBoundingClientRect().top;
    window.scrollTo({ top: top + (hour - startHour) * pxPerHour - stickyTop, behavior: 'instant' });
  }, { hour: hourAtTop, startHour: TIMELINE_START_HOUR, pxPerHour: PX_PER_HOUR, stickyTop: STICKY_TOP_PX });
  await page.waitForTimeout(600);
}

async function settle(page) {
  await page.evaluate(() => document.activeElement?.blur());
  await page.mouse.move(4, 4); // page padding: nothing to hover
  await page.waitForTimeout(600);
}

async function shoot(page, name, tmpDir) {
  await settle(page);
  const png = path.join(tmpDir, `${name}.png`);
  await page.screenshot({ path: png, animations: 'disabled' });
  execFileSync('cwebp', ['-q', '85', png, '-o', path.join(OUT_DIR, `${name}.webp`)], { stdio: 'pipe' });
  console.log(`captured ${name}.webp`);
}

async function openPlanner(page, query) {
  await page.goto(`${APP_URL}/?${query}`, { waitUntil: 'networkidle', timeout: 60000 });
  await waitForPlanner(page);
}

async function newContext(browser, { colorScheme, storageState, now = FIXED_NOW }) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    timezoneId: 'America/Los_Angeles',
    locale: 'en-US',
    colorScheme,
    reducedMotion: 'reduce',
    ...(storageState ? { storageState } : {}),
  });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date(now));
  return { context, page };
}

(async () => {
  requireEnv();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'timefraim-shots-'));
  restoreSeed();
  const browser = await chromium.launch();

  try {
    const { context, page } = await newContext(browser, { colorScheme: 'dark' });
    await signIn(page, await mintMagicLinkToken());
    const storageState = await context.storageState();

    // 1. Running timer: the seed leaves a timer active on the 10:30 block.
    await openPlanner(page, `date=${DATE}&task=${RUNNING_TASK_ID}`);
    await setSectionOpen(page, 'task-inbox-panel', false);
    await frameTimeline(page, 8.25);
    await shoot(page, 'timefraim-timer', tmpDir);

    // Stop it through SQL so the remaining shots (and the Board's timer
    // banner) reflect an idle planner with times that match the seed.
    runSql(
      "update public.timer_sessions set ended_at = started_at + interval '21 minutes', duration_seconds = 1260 where ended_at is null;",
    );

    // 2. Hero: queue beside the full day, with done tasks and activity open.
    await openPlanner(page, `date=${DATE}`);
    await setSectionOpen(page, 'task-inbox-panel', false); // also clears the default selection
    await setSectionOpen(page, 'task-detail-panel', false);
    await setCardOpen(page, /Done today/, true);
    await setCardOpen(page, /Recent changes/, true);
    await frameTimeline(page, 8.25);
    await shoot(page, 'timefraim-planner', tmpDir);

    // 3. Task detail: a queued task selected via its deep link.
    await openPlanner(page, `date=${DATE}&task=${DETAIL_TASK_ID}`);
    await setSectionOpen(page, 'task-inbox-panel', false);
    await page.waitForTimeout(500); // the deep link re-selects after the clear
    await frameTimeline(page, 8.25);
    await shoot(page, 'timefraim-task-detail', tmpDir);
    await context.close();

    // 4. Board in light mode, header included, no scroll.
    const light = await newContext(browser, { colorScheme: 'light', storageState });
    await light.page.goto(`${APP_URL}/board`, { waitUntil: 'networkidle', timeout: 60000 });
    await light.page.getByRole('heading', { name: 'Board' }).first().waitFor({ timeout: 30000 });
    await light.page.waitForTimeout(800);
    await shoot(light.page, 'timefraim-board', tmpDir);
    await light.context.close();

    // 5. Calendar-only day in light mode: with the seeded tasks cleared,
    //    Wednesday shows nothing but synced Google Calendar events. One event
    //    is selected so the detail column shows its card, and the clock moves
    //    to that morning so the now-line renders.
    runSql(CLEAR_TASKS_SQL);
    const calendar = await newContext(browser, { colorScheme: 'light', storageState, now: CALENDAR_NOW });
    await openPlanner(calendar.page, `date=${CALENDAR_DATE}`);
    await calendar.page
      .locator('[data-planner-selectable="true"]', { hasText: CALENDAR_EVENT_TITLE })
      .first()
      .click();
    await calendar.page.waitForTimeout(400);
    await frameTimeline(calendar.page, 8.25);
    await shoot(calendar.page, 'timefraim-calendar', tmpDir);
    await calendar.context.close();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await browser.close();
    fs.rmSync(tmpDir, { recursive: true, force: true });
    restoreSeed(); // leave the sandbox as start.sh seeded it
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
