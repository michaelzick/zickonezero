# ZICKONEZERO - Agent Orientation (Claude Code)

This document is the canonical project brief for AI coding agents. Read it at the start of every session instead of re-exploring the repo. Keep it current: see [Maintaining this file](#maintaining-this-file).

Sibling files [AGENTS.md](AGENTS.md) (Codex) and [GEMINI.md](GEMINI.md) (Gemini CLI) mirror this content for other harnesses. Update all three together when code structure changes.

---

## 1. Project overview

**ZICKONEZERO** is a statically exported portfolio and case-study site for Michael Zick / ZICKONEZERO Creative. It presents project work, case studies, product/service pages, and analytics-instrumented navigation/CTA flows.

Primary flows:
- Home portfolio: a living neon city the visitor walks through on scroll, from the "I Dream in Features" alley past a holo billboard and three work districts to an open stretch of city above the footer, with a minimap HUD for fast travel and a lightbox gallery.
- Case studies: reusable project showcase layouts for DemoStoke, Antisyphon Training, Nice Guy University, and related work.
- Product/service pages: DemoStoke, DemoStoke Fleet Ops, Find Your Flow State, Who's In Charge, Riptyde, TimeFraim, 12 Step Meetings, Bars of Sand, and about pages.
- Contact: `/contact` posts to the Cloudflare Worker in `workers/contact/` (deployed at `https://zickonezero-contact.zickonezero.workers.dev/api/contact`), which relays through Brevo SMTP.
- Static publishing: `next build` exports the site with `output: 'export'` and regenerates `public/sitemap.xml`.

## 2. Tech stack

- **Framework:** Next.js 15 Pages Router with React 19 and TypeScript.
- **Rendering:** Static export via `next.config.js` (`output: 'export'`, `trailingSlash: true`, unoptimized images).
- **State:** Redux Toolkit with typed hooks in `src/hooks.ts`.
- **Styling:** styled-components 5, SCSS globals, and shared theme constants in `styles/theme.ts`. Fonts (Orbitron, Rajdhani, Share Tech Mono) are self-hosted from `@fontsource` packages through `next/font/local`.
- **UI libraries:** Radix UI icons/select/tabs, `fslightbox-react`.
- **Analytics:** Google Tag Manager plus Amplitude-style event helpers in `src/lib/analytics.ts`.
- **Tooling:** npm, Node 24.x, Jest + React Testing Library, ESLint, TypeScript. An optional Playwright smoke test runs only on request (Playwright is not a project dependency).

## 3. Repository layout

```
zickonezero/
+-- pages/               # Next Pages Router pages
+-- src/
|   +-- components/      # Site navigation, homepage, case-study, analytics, and shared components
|   +-- components/city/ # Persistent city scenery and neon signage
|   +-- components/hud/  # HUD widgets: clock, quest tracker, scramble text, time-of-day and sound toggles
|   +-- components/home/ # Homepage scenes: hero alley, billboard, districts, minimap HUD
|   +-- data/            # Static JSON content used by portfolio pages
|   +-- components/*/    # Feature-specific case-study/user-story components
|   +-- hooks/           # Browser interaction hooks
|   +-- lib/             # Analytics, SEO, and contact helpers
|   +-- lib/city/        # Framework-free city engine: seeded generators, routes, scroll, weather, sound
|   +-- theme/           # Day/night theme context, theme bootstrap, and self-hosted fonts
|   +-- test/            # Test render and matchMedia helpers
|   +-- *.Slice.ts       # Redux Toolkit slices
+-- styles/              # styled-components exports, page-specific style modules, globals
+-- public/              # Static images, favicon assets, generated sitemap/robots, and host config (_headers, _redirects)
+-- scripts/             # Build-time utilities (sitemap), the test time limit, the browser smoke test, screenshot capture scripts, and the TimeFraim screenshot sandbox
+-- workers/contact/     # Cloudflare Worker (own package) that emails contact-form submissions via Brevo SMTP
+-- __tests__/           # Jest and React Testing Library tests
+-- skills/              # Repo-local coding and agent-brief maintenance skills
+-- .github/workflows/   # CI, security automation, and the manual browser test workflow
+-- next.config.js
+-- tsconfig.json
+-- package.json
```

## 4. Application structure

### 4.1 Next app

- **Root wrapper:** `pages/_app.tsx` imports global SCSS, wraps pages with Redux and `AppThemeProvider`, sets the self-hosted font variables (`src/theme/FontVariables.tsx`) and the time-of-day `theme-color` meta (`src/theme/ThemeColorMeta.tsx`), installs GTM/site analytics, and renders only the shared viewport plus icon/manifest links in `<Head>`. It mounts the persistent city once, outside the page, so it stays alive across navigation: `CityBackdrop` (its camera follows `router.pathname`), `WeatherCanvas` (daytime dust, dimmed off the homepage), and `FastTravelTransition`. Pages and shared components read the normalized route from `CurrentPathContext` (`src/hooks/useCurrentPath.ts`) instead of `useRouter()`, which throws outside a mounted router.
- **Per-page SEO:** every page renders its own `<Seo>` (`src/components/Seo.tsx`) for the title, canonical (trailing-slash, absolute), description, Open Graph/Twitter tags, and JSON-LD. Metadata copy lives inline per page; `ProjectShowcase` pages single-source `title`/`summary`/`heroImage` into local consts shared by `<Seo>` and `<ProjectShowcase>`. There is no global head/meta component. All page social images declare their actual dimensions and descriptive alt text; the default share image, `public/img/og/i-dream-in-features.jpg`, is a 1200x630 capture of the night hero with the HUD, nav links, and hero panel hidden.
- **Document:** `pages/_document.tsx` handles server document structure for styled-components, renders each route's neon accent into `<html data-accent>` from `getRouteMeta`, and runs `THEME_BOOTSTRAP_SCRIPT` (`src/theme/themeConfig.ts`) at the top of `<body>` so a stored day choice applies before first paint.
- **Home page:** `pages/index.tsx` loads work data with `getStaticProps`, syncs it into Redux via `useEffect`, and passes it to `MainContent` as a prop.
- **Content pages:** top-level files in `pages/` render about, contact, case-study, DemoStoke, Antisyphon, Nice Guy University, and product pages.
- **Contact page:** `pages/contact.tsx` renders `src/components/ContactContent.tsx`, which posts JSON to `NEXT_PUBLIC_CONTACT_ENDPOINT` (default `DEFAULT_CONTACT_ENDPOINT`, the deployed workers.dev URL) via `src/lib/contactForm.ts`, tracks `contact_form_submit_*` events, and includes a honeypot `website` field.
- **Static export:** `next.config.js` keeps the app static-host friendly. Static data helpers live under `src/` instead of `pages/api` so the exported site does not expose accidental API routes.

### 4.2 State, content, and UI

- **Redux store:** `src/store.ts` combines `worksDataSlice` and `showMobileMenuSlice`.
- **Typed hooks:** `src/hooks.ts` exports `useAppDispatch` and `useAppSelector`.
- **Homepage:** `src/components/MainContent.tsx` composes the walk through the city from `src/components/home/`: `HeroScene` (a sticky 3D alley under the "I Dream in Features" `NeonSign`; scrolling writes `--p` from 0 to 1 to walk the camera in), `HoloBillboard` (a sticky tower screen that pans through product screenshots), three `District`s, and a decorative `CityGap` (`styles/home.ts`) most of a screen tall, where the persistent city shows through clearly before the footer. The hero's CTAs are "See Case Studies" and a "Contact" link. It also owns lightbox state, mobile menu state, analytics events, and the active district, which sets the city glow through `setCityAccent` (magenta, cyan, then amber). Each district (Case Studies, Product Engineering, Web Development) is a glass city block tinted by the muted `--home-section-{case,product,web}-{bg,border}` tokens in `styles/globals.scss` (night defaults with day overrides) and wraps a `GridContent` grid of gig cards. Passing `carouselLabel` to `GridContent` turns its grid into a labelled horizontal scroll-snap carousel at phone width, with prev/next buttons driven by `src/hooks/useHorizontalGallery.ts`. `HomeHud` is the "Homepage sections" nav: a minimap with district pins, a player arrow that walks the route on scroll, a clock, and a quest tracker on wide screens (its objective, such as "Head to Case Studies", is a button that fast travels to that district), or the same buttons as a bottom bar on narrow or short screens. Its fast travel uses the eased, interruptible jumps in `src/lib/city/scroll.ts` and lands on the unchanged district heading ids (`case-studies`, `ux-design`, `web-development`).
- **Living city modules:** `src/lib/city/` is framework-free and holds the engine: `prng.ts` (seeded generators), `skyline.ts`/`facade.ts`/`minimap.ts` (procedural SVG geometry as a few path strings with integer coordinates), `routes.ts` (each route's fast-travel label, accent, and skyline camera position), `accent.ts`, `scrollSignal.ts` (one shared rAF-throttled scroll listener that never re-renders React), `scroll.ts`, `weather.ts` (batched canvas rain and dust; the site only draws dust), and `sound.ts`/`ambience.ts`. Every layout decision comes from a fixed seed so the static HTML matches hydration; keep `Math.random` for post-mount visuals only. `src/components/city/` renders the persistent scenery (`CityBackdrop`, `Skyline`, `FlyingTraffic`, `WeatherCanvas`, `FastTravelTransition`) and the signage (`AlleyWall`, `NeonSign`, `LedTicker`); `src/components/hud/` holds `HudClock`, `QuestTracker`, `ScrambleText`, `TimeOfDayToggle`, and `SoundToggle`. Decorative scenery, Japanese signs (marked `lang="ja"`), and HUD readouts are `aria-hidden`; headings, links, and buttons keep their real text, and `NeonSign` keeps a heading's exact accessible name by rendering letters as inline spans.
- **Day, night, sound, and fonts:** night (`dark`) is the default city and day (`light`) is the visitor's opt-in, stored as `zickonezero-theme`; anything else, including the retired `system` value, resolves to night. `src/theme/ThemeContext.tsx` toggles it with a view-transition crossfade (`document.startViewTransition`, timed by the `::view-transition-*(root)` rules in `styles/globals.scss`); without View Transitions support or under reduced motion the switch is instant. Do not animate the color tokens themselves: transitioning inherited custom properties on `:root` restyles and repaints the whole homepage every frame, which stalled and flashed it. Sound is muted by default, stored as `zickonezero-sound`, and only starts from a click, tap, or key press; the synthesized Web Audio graph in `src/lib/city/ambience.ts` (a steady murmur and traffic drone, with no rain, neon buzz, or passing-car bursts, which sounded like static and honking) loads the first time sound is turned on, and browsers without Web Audio drop the toggle after hydration. The Orbitron (display), Rajdhani (HUD), and Share Tech Mono (readout) faces are defined in `src/theme/fonts.ts` and exposed on `:root` as `--font-display`, `--font-hud`, and `--font-mono`, so no font CDN is involved.
- **Motion safety:** reduced motion keeps every scene still and readable: the hero sets no `--p`, the billboard becomes a still wall of panels, weather draws one still frame (as it also does under Save-Data), fast travel skips the shutters, in-page jumps are instant, and `ScrambleText` swaps text without the effect. `styles/globals.scss` also shortens every animation and transition under `prefers-reduced-motion`. Neon power-on follows WCAG 2.3.1: no dip goes fully dark and nothing flashes more than three times a second (see `styles/neon.ts`). There is no rain at night: `WeatherCanvas` hides itself after dark (it only draws daytime dust) the hero has no near-rain or steam layers, and the ambient sound (`src/lib/city/ambience.ts`) has no rain hiss, because those full-screen night layers pushed Chrome to drop and redraw the page, which flickered after scrolling to the bottom and back up. Nothing in the city blinks on a loop: the neon letters, billboard screen, beacons, and skyline windows stay steady after they power on, since recurring dips read as rendering glitches, especially at night. Power-on effects (the `NeonSign` ignition, the billboard warming up, the gig cards booting) play only on the first page load: `pages/_app.tsx` calls `markCityStarted` (`src/lib/city/powerOn.ts`) after it mounts, later pages arrive already lit, and `src/hooks/usePowerOn.ts` arms standby in a layout effect and never for content already on screen, so client navigation, the back button, and restored scroll never blink content out and back in.
- **Inner pages:** the HUD primitives in `styles/hud.ts` (notched glass frames, scanlines, neon and HUD buttons, and the toggle buttons) dress the navigation, the homepage HUD, and the inner pages. `ProjectShowcase` opens on a holo-billboard hero, About is a dossier, Contact is a "secure channel" terminal (`styles/contact.ts`), and the 404 page (h1 "Page not found") shows a vitals monitor that flatlines. Each route glows in its own accent from `src/lib/city/routes.ts`: case studies magenta, product pages cyan, About violet, Contact and 404 red, and Home cyan.
- **Project showcases:** `src/components/ProjectShowcase.tsx` provides the reusable case-study shell with hero, section cards, lightbox, and tracking. Pass `imageOrientation='portrait'` for phone-screenshot showcases (e.g. Riptyde) so section images are height-capped and centered instead of filling the column. The required `projectLink` supports optional `additionalProjectLinks`, displayed in order with matching tracking and wrapping. UX and case-study hero project links use “Website”; Riptyde uses “App Store” for its App Store link and “Web App” for riptyde.app.
- **TimeFraim and 12 Step Meetings:** `/timefraim` and `/12-step-meetings` use the landscape showcase with four UX sections each. Their WebP images live in `public/img/projects/timefraim/` and `public/img/projects/12-step-meetings/`; TimeFraim captures come from the isolated local sandbox in `scripts/timefraim-sandbox/` (seeded sample planner data, never real data) and 12 Step Meetings captures come from the live site. Both projects have 512px icon squares and follow Bars of Sand, Riptyde, and DemoStoke Fleet Ops in the homepage Product Engineering grid (`src/data/worksData.json` is reversed at load time, so the last entries show first). The shared `src/components/projectLinks.ts` list drives the desktop navigation, mobile navigation, and footer Product Engineering links, ordered Bars of Sand, Riptyde, DemoStoke Fleet Ops, TimeFraim, 12 Step Meetings, then the remaining projects.
- **Bars of Sand:** `/bars-of-sand` uses the landscape showcase with five UX sections and links to the Worker-hosted app at `https://bars-of-sand.zickonezero.workers.dev/`. Its WebP images in `public/img/projects/bars-of-sand/` were converted to sRGB from supplied desktop screenshots (no capture script), and its 512px icon square is rasterized from the sibling `bars-of-sand` repo's `src/app/icon.svg`. It leads the homepage Product Engineering grid and the shared project links.
- **Crawlable interactive content:** the About biography remains rendered inside a native `hidden` container while its modal is closed. DemoStoke, Antisyphon, and Nice Guy University render both tab panels in the static HTML, using `hidden` to show only the active panel and matching tab IDs/`aria-controls`/`aria-labelledby`. Inactive desktop section navigation is not rendered. Preserve this content-in-HTML behavior when editing tabs or the About modal.
- **Case-study modules:** `src/components/demostoke/`, `src/components/antisyphon/`, `src/components/niceguyuniversity/`, and `src/components/userstories/` hold page-specific content and section data.
- **Static data:** `src/data/worksData.json` feeds the homepage portfolio grid through `src/lib/getWorksData.ts`. Its `thumb` paths point at 512px homepage copies in `public/img/home/cards/`, and the billboard slides use 1920px copies in `public/img/home/billboard/` (both made with sharp from the full-size originals, which inner pages and menus keep using). Keep homepage images near 2x their displayed size and `decoding='sync'`: the full-size captures decoded to over 200 MB, so Chrome evicted them while the visitor was at the bottom of the page, and async decoding then painted the cards and billboard blank on the way back up.
- **Design tokens/styles:** `styles/globals.scss` owns the city tokens: night defaults with `html[data-theme='light']` day overrides, the `:root[data-accent]` neon families mapped to `--city-accent`, registered `@property` values, and the reduced-motion rule. `styles/theme.ts` exposes them to styled-components as `var()` references alongside breakpoints and fonts. `styles/index.js` and `styles/projectShowcases.js` hold the shared and showcase components; the city modules have their own files (`city.ts`, `facade.ts`, `neon.ts`, `home.ts`, `billboard.ts`, `district.ts`, `homeHud.ts`, `nav.ts`, `hud.ts`, `contact.ts`), each pointing at the component it styles.
- **jsdom-safe CSS:** Jest's CSS parser drops a whole styled-components sheet when it meets `@supports`, `@container`, `@layer`, or `@property`, so styled-components use only `@media` and keyframes; put the others in `styles/globals.scss`. Start theme and accent selectors with `html` (`html[data-theme='light'] &`), never `:root`: styled-components 5 glues a selector that opens with a pseudo-class onto the component's own class, so it never matches.
- **Top navigation:** `src/components/TopNavContent.tsx` is a HUD bar (`styles/nav.ts`) holding the brand, the links, `TimeOfDayToggle`, and `SoundToggle`. Desktop links use explicit fluid gaps and vertically centered 44px controls. The full link row switches to the phone "city map" menu at `THEME.breakpoints.largeTablet` (1137px), before the brand and longer Product Engineering label become crowded; Escape closes it and returns focus to its button, and the expanded menu scrolls within the viewport on shorter screens. The scrolled bar's glass and `backdrop-filter` live on its `::before` layer, not the bar itself, because Chrome flickers the descendants of a `backdrop-filter` element (the dropdowns and city map); open menus are opaque at night (`--menu-bg`) so nothing animated reads through them. The bar's height is load-bearing (fixed tab bars and page paddings sit below it): keep it at 78px above 600px wide and about 134.7px at 600px and below.

### 4.3 Build utilities

- `scripts/generate-sitemap.js` scans top-level page files, skips reserved/API-like pages, and writes both `public/sitemap.xml` and `public/robots.txt` (which allows all crawlers and points at the absolute sitemap URL). Both generated files are git-ignored and rebuilt by `prebuild`. The sitemap omits optional `lastmod` values until reliable per-page content dates are available; do not substitute the build date.
- `scripts/capture-ngu-screenshots.js` recaptures the Nice Guy University case-study screenshots from the live site as 2x-desktop WebP images (requires Playwright and cwebp, which are not project dependencies).
- `scripts/capture-timefraim-screenshots.js` recaptures the TimeFraim showcase screenshots from the local screenshot sandbox as 2x-desktop WebP images (three dark planner shots, the Board in light mode, and a light calendar-only planner day captured after clearing the seeded tasks through SQL), signing in with a Supabase magic link and fixing the browser clock to the seeded days; it restores the seed when it starts and finishes, so it can be re-run without restarting the sandbox. Run it with `node --env-file=<timefraim>/.env` after `scripts/timefraim-sandbox/start.sh` (same Playwright/cwebp requirements).
- `scripts/timefraim-sandbox/start.sh`, `stop.sh`, and `seed.sql` run an isolated local Supabase project (`timefraim-shots`, started with `supabase start --workdir`) seeded with the sample planner days and start the sibling `timefraim` checkout's app against it on the app's usual ports; they never touch the real `supabase_db_timefraim` volume. Requires Docker, the Supabase CLI, corepack/pnpm, and the `timefraim` repo with its `.env`.
- `scripts/capture-12-step-meetings-screenshots.js` recaptures the 12 Step Meetings showcase screenshots from the live 12stepmeetings.org as 2x-desktop WebP images, driving each view through query parameters with a ticking fake clock so the upcoming order and map tiles are stable (same Playwright/cwebp requirements). Pass a shot name to capture only that image. The “Find a meeting that fits” section opens with “Finding support should be easy and intuitive.” and describes program, day, time, and location filters. Its list image has program, day, and time filters active and the location menu open to city suggestions for “Santa”, before a location is selected. Capturing this native browser menu requires a visible Chromium window, macOS Screen Recording access, and a 2x display at least 1728x1087 logical pixels, using the calibrated content rectangle documented in the script.
- `scripts/configure-static-hosting.js` reads a complete DigitalOcean AppSpec JSON from stdin and emits a corrected spec without deploying. It sets `error_document: 404.html` on the `zickonezero` static component, removes its homepage catch-all, adds host-scoped 301 redirects from `/case-studies` and `/case-studies/` to `https://www.zickonezero.com/demostoke/`, and canonicalizes the apex hostname to `www`. It preserves other components and host routes and refuses an unexpected component or ingress. See `README.md` for the deployment workflow.
- Sitemap/robots host generation comes from `src/lib/siteConfig.js` (`NEXT_PUBLIC_SITE_URL` / `SITE_URL`, default `https://www.zickonezero.com`).
- `scripts/run-tests.js` backs `npm test`: it runs Jest in band, passes extra arguments through (`npm test -- __tests__/seo.test.tsx`), and stops a run still going after 3 minutes with exit code 1 (SIGTERM, then SIGKILL after a 5-second grace). `--watch` and `--watchAll` run without the limit.
- `scripts/browser-smoke.js` backs the optional `npm run test:browser`. After `npm run build`, it serves `out/` from a built-in static server that applies the production `public/_headers` `/*` rule (so CSP violations surface), blocks third-party requests, and drives headless Chromium through `/`, `/about/`, `/contact/`, `/demostoke/`, `/riptyde/`, and a missing page at desktop (1440x900) and phone (390x844) sizes. It fails on an unexpected status, page errors, site console errors, horizontal overflow, or a missing or empty h1, and on the homepage it checks night by default, the stored day theme, the scroll-driven hero, and a still hero under reduced motion. `--screenshots <dir>` saves a PNG per check. It stops itself after 3 minutes. Playwright is not a project dependency: install it with `npm i -g playwright` (or `npm install --no-save playwright`), then `npx playwright install chromium`.

### 4.4 Contact worker

- **Hosting context:** the exported site is served directly by Cloudflare Worker `zickonezero` with static assets; the portfolio has no server runtime. `workers/contact/` is a standalone Cloudflare Worker package (own `package.json`, `wrangler.jsonc`, `tsconfig.json`) deployed to the ZICKONEZERO Cloudflare account at `https://zickonezero-contact.zickonezero.workers.dev`. The `zickonezero.com` zone is in the same account. The site continues calling the contact Worker cross-origin; its origins are allowlisted via `ALLOWED_ORIGINS` and named in the CSP `connect-src` in `public/_headers`.
- **Behavior:** `workers/contact/src/index.ts` validates the JSON body with the pure helpers in `workers/contact/src/contact.ts` (shared with `__tests__/contact-worker.test.ts`), enforces an `Origin` allowlist (`ALLOWED_ORIGINS` var), applies a best-effort per-isolate rate limit (5 per IP per hour, `429` + `Retry-After`), silently accepts honeypot hits, and sends via `worker-mailer` over Brevo SMTP (`smtp-relay.brevo.com:587`, STARTTLS).
- **Secrets:** `BREVO_USER`, `BREVO_SMTP_PASSWORD`, `BREVO_FROM` (`mzick@zickonezero.com`), and `BREVO_TO` are Worker secrets (`npx wrangler secret put`). Local dev reads them from the git-ignored `workers/contact/.dev.vars` (see `.dev.vars.example`).
- **Commands:** `npm run dev` / `npm run deploy` / `npm run typecheck` inside `workers/contact/`. The root `tsconfig.json` excludes the Worker entry file because it depends on `@cloudflare/workers-types`.

## 5. Commands

Root scripts:

```bash
npm run agent-briefs:sync   # regenerate CLAUDE.md and GEMINI.md from AGENTS.md
npm run agent-briefs:check  # fail if CLAUDE.md or GEMINI.md drift from AGENTS.md
npm run dev                 # Next dev server
npm run lint                # ESLint CLI across JS/TS source
npm run typecheck           # TypeScript no-emit check
npm test                    # Jest test suite, run in band and stopped after 3 minutes
npm run build               # regenerate sitemap and build/export the static site
npm run check               # agent brief sync check + lint + typecheck + test + build
npm run sitemap             # regenerate public/sitemap.xml only
npm run test:browser        # optional headless Chromium smoke test of out/ (after npm run build)
```

CI runs `npm ci`, `agent-briefs:check`, lint, typecheck, a `workers/contact` install + typecheck, tests (a step capped at 3 minutes), and production build on Node 24.x. CI never runs a browser. The **Browser tests** workflow (`.github/workflows/browser-tests.yml`) runs only when started by hand from the Actions tab: it builds the site, installs Playwright for that run, runs `npm run test:browser` (capped at 3 minutes), and uploads the screenshots as the `browser-screenshots` artifact.

Security automation runs Gitleaks, dependency review, CodeQL, and a production dependency audit at high severity (`npm audit --omit=dev --audit-level=high`). Next.js stays on the patched 15.5 release line with matching `eslint-config-next`; Sharp uses 0.35.5 or later. The root `package.json` overrides Next's pinned PostCSS with 8.5.28 for security fixes; retain that override until Next's own dependency is patched. The full audit's remaining findings are development-only (`braces` and `sprintf-js`, which have no patched releases, through Jest 29, Sass's file watcher, and `eslint-config-next`); clear them by upgrading those tools, not by forcing overrides.

The site is Cloudflare Worker `zickonezero`, serving `out/` from this repository's `main` branch through Workers Builds (Node 24, `npm run build`, `npx wrangler@4.133.0 deploy`). Non-production branches build with Node 24 and `npm run build`, then use `npx wrangler@4.135.0 preview` for a stable branch URL. The required empty `previews` block keeps previews isolated while reusing top-level static asset settings. Older branches must incorporate this configuration before preview builds can succeed. Root `wrangler.jsonc` configures custom domains `zickonezero.com` and `www.zickonezero.com`, static assets, trailing-slash handling, and `404-page` fallback. `public/_headers` and `public/_redirects` are applied by Cloudflare. `_redirects` 301s the removed `/michael-zick-coaching` route (bare, trailing-slash, and descendants) to `https://www.niceguyuniversity.com/`. Framing: the site sends neither `X-Frame-Options` nor CSP `frame-ancestors`, so any site can show it in a frame, as Nice Guy University can (the michaelzick.com landing page frames it in its Internet Search window). `__tests__/security-headers.test.js` guards this. The zone's **Canonical apex to www** Redirect Rule preserves path/query and uses HTTPS. The former DigitalOcean static component remains in shared app `demostoke` (`8b602f38-1268-4375-bef4-46d9001db792`) as an owner-managed rollback until archival; the migration does not archive that app. The legacy spec-transform script remains for rollback; keep raw specs outside the repo and use complete raw API specs with `update_all_source_versions: false` for hosting-only updates. The CSP allows the inline GTM/theme/Amplitude bootstraps and styled-components inline styles that the static export requires. Environment variables: `NEXT_PUBLIC_SITE_URL` / `SITE_URL` set the canonical origin (see `src/lib/siteConfig.js`); `NEXT_PUBLIC_AMPLITUDE_API_KEY` overrides the public browser analytics key; `NEXT_PUBLIC_CONTACT_ENDPOINT` overrides the contact form endpoint (default is the deployed workers.dev URL; set it to `http://localhost:8787/api/contact` in `.env.local` when running the Worker locally).

## 6. Conventions

- **Runtime:** use Node 24.x and npm. Keep `package-lock.json` authoritative.
- **Pages:** add route files under `pages/`; top-level page filenames become routes and are picked up by the sitemap generator unless reserved or skipped.
- **Components:** use PascalCase component exports; keep route/page composition thin and move reusable behavior into `src/components`, `src/hooks`, or feature folders.
- **Styling:** prefer existing styled-components and theme constants before adding new style primitives. Keep SCSS global changes broad and intentional.
- **Images:** static images live under `public/img/`; use accurate alt text for inspectable product and portfolio imagery.
- **Analytics:** use `trackEvent`, `trackLinkClick`, and existing tracked link components for navigational and CTA events.
- **Brand name:** render visible "ZICKONEZERO" through `src/components/BrandName.tsx` so ONE stays accent-colored (ZICK**ONE**ZERO); keep plain text in titles, metadata, and analytics labels.
- **Role copy:** product engineering encompasses frontend and full-stack development; pair it with UX design rather than redundant development roles. Use `Product Engineer` and `UX designer` for people, `product engineering` and `UX design` for disciplines, and `Product Engineering` for navigation and section headings.
- **Effects:** clean up timers, animation frames, observers, and browser listeners. Respect reduced-motion checks where animation is significant, and give every new moving scene a still, readable reduced-motion state. Pause continuous work (canvas frames, audio) in hidden tabs, and keep scroll-driven updates in CSS custom properties or refs rather than React state.
- **City art:** all scenery, signage, and copy is original. Do not copy assets, logos, typefaces, or trademarked place and company names from games, films, or other brands.
- **Tests:** co-locate broad behavior tests in `__tests__/`; use React Testing Library for user-visible behavior and Jest for build utilities. Use `mockMatchMedia`/`restoreMatchMedia` from `src/test/matchMedia.ts` for reduced-motion and viewport cases. Keep the suite well under the 3-minute cap; a hung or slow test fails the run.
- **Validation:** do not mark work done while lint, typecheck, tests, or build fail. Browser tests are opt-in: run `npm run test:browser` or the manual Browser tests workflow only when the user asks, and keep them out of `npm test`, `npm run check`, and `ci.yml`.
- **Coding standards:** use `skills/coding-standards/SKILL.md` before implementation, refactors, UI state handling, error handling, performance-sensitive changes, tests, and reviews.
- **Agent briefs:** when meaningful project facts change, update `AGENTS.md`, run `npm run agent-briefs:sync`, and keep `CLAUDE.md` / `GEMINI.md` in lockstep.

## 7. Key files map

| Path | What lives here |
|---|---|
| [pages/_app.tsx](pages/_app.tsx) | App providers, analytics scripts, fonts, and the persistent city layers |
| [pages/_document.tsx](pages/_document.tsx) | Route accent on `<html>` and the pre-paint theme bootstrap |
| [pages/index.tsx](pages/index.tsx) | Home page data loading and `MainContent` entry |
| [pages/nice-guy-university.tsx](pages/nice-guy-university.tsx) | Nice Guy University case-study route |
| [pages/timefraim.tsx](pages/timefraim.tsx) | TimeFraim planner UX showcase |
| [pages/12-step-meetings.tsx](pages/12-step-meetings.tsx) | Recovery meeting directory UX showcase |
| [pages/bars-of-sand.tsx](pages/bars-of-sand.tsx) | Browser surf lab UX showcase |
| [src/components/MainContent.tsx](src/components/MainContent.tsx) | Homepage city walk: hero, billboard, districts, open city gap, HUD fast travel, lightbox |
| [src/components/home/HeroScene.tsx](src/components/home/HeroScene.tsx) | Scroll-driven 3D alley under the "I Dream in Features" sign |
| [src/components/home/HomeHud.tsx](src/components/home/HomeHud.tsx) | Minimap HUD (bottom bar on small screens) that is the homepage section nav |
| [src/components/city/CityBackdrop.tsx](src/components/city/CityBackdrop.tsx) | Persistent sky, skyline, traffic, and fog behind every page |
| [src/components/city/NeonSign.tsx](src/components/city/NeonSign.tsx) | Neon lettering that keeps a heading's accessible name |
| [src/lib/city/routes.ts](src/lib/city/routes.ts) | Per-route accent, camera position, and fast-travel label |
| [src/lib/city/sound.ts](src/lib/city/sound.ts) | Opt-in, remembered ambient sound state |
| [src/theme/themeConfig.ts](src/theme/themeConfig.ts) | Night/day storage key, default, browser colors, and bootstrap script |
| [src/components/NiceGuyUniversityContent.tsx](src/components/NiceGuyUniversityContent.tsx) | Nice Guy University tabbed case-study shell |
| [src/components/ProjectShowcase.tsx](src/components/ProjectShowcase.tsx) | Reusable case-study layout (landscape or portrait screenshots) |
| [pages/contact.tsx](pages/contact.tsx) | Contact page route |
| [src/components/ContactContent.tsx](src/components/ContactContent.tsx) | Contact form UI and submission states |
| [src/lib/contactForm.ts](src/lib/contactForm.ts) | Contact form client validation and endpoint call |
| [workers/contact/src/index.ts](workers/contact/src/index.ts) | Cloudflare Worker (workers.dev) handling contact submissions via Brevo SMTP |
| [workers/contact/src/contact.ts](workers/contact/src/contact.ts) | Pure contact validation and email builder |
| [src/components/niceguyuniversity/](src/components/niceguyuniversity/) | Nice Guy University case-study and product-screen section data |
| [src/components/TrackedLink.tsx](src/components/TrackedLink.tsx) | Analytics-aware links |
| [src/components/BrandName.tsx](src/components/BrandName.tsx) | ZICKONEZERO wordmark with the accent-colored ONE |
| [src/components/Seo.tsx](src/components/Seo.tsx) | Per-page title, canonical, OG/Twitter, and JSON-LD head tags |
| [src/components/SiteAnalyticsScripts.tsx](src/components/SiteAnalyticsScripts.tsx) | Site analytics bootstrap |
| [src/lib/analytics.ts](src/lib/analytics.ts) | Analytics event helpers |
| [src/lib/seo.ts](src/lib/seo.ts) | SEO defaults, `absoluteUrl`, and JSON-LD builders |
| [src/lib/siteConfig.js](src/lib/siteConfig.js) | Canonical `SITE_URL`/`SITE_NAME` shared by the app and the sitemap script |
| [src/lib/getWorksData.ts](src/lib/getWorksData.ts) | Static work data loader |
| [src/data/worksData.json](src/data/worksData.json) | Portfolio grid content |
| [src/store.ts](src/store.ts) | Redux store setup |
| [styles/index.js](styles/index.js) | Shared styled-components exports |
| [styles/theme.ts](styles/theme.ts) | Theme constants and tokens |
| [styles/globals.scss](styles/globals.scss) | City tokens, day overrides, accents, registered properties, reduced motion |
| [src/test/matchMedia.ts](src/test/matchMedia.ts) | `matchMedia` overrides for reduced-motion and viewport tests |
| [scripts/generate-sitemap.js](scripts/generate-sitemap.js) | Sitemap generation without synthetic modification dates |
| [scripts/configure-static-hosting.js](scripts/configure-static-hosting.js) | Scoped DigitalOcean 404 and canonical redirect spec transform |
| [scripts/run-tests.js](scripts/run-tests.js) | `npm test`: Jest in band under the 3-minute limit |
| [scripts/browser-smoke.js](scripts/browser-smoke.js) | Optional headless Chromium smoke test of the static export |
| [README.md](README.md) | Local workflow, tests, living-city conventions, crawlability, and static-host deployment requirements |
| [wrangler.jsonc](wrangler.jsonc) | Cloudflare static assets, custom domains, and 404/trailing-slash routing |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Automated CI checks |
| [.github/workflows/security.yml](.github/workflows/security.yml) | Security scanning |
| [.github/workflows/browser-tests.yml](.github/workflows/browser-tests.yml) | Manual-only browser smoke test with a screenshots artifact |
| [skills/coding-standards/SKILL.md](skills/coding-standards/SKILL.md) | Production coding standards |
| [skills/sync-agent-briefs/SKILL.md](skills/sync-agent-briefs/SKILL.md) | Agent brief sync workflow |

---

## Maintaining this file

**Whenever you change the codebase in a way this document describes, update it in the same change.** Examples that require an update:

- Adding, removing, renaming, or re-homing top-level directories, route groups, feature folders, or build scripts.
- Changing root `package.json` scripts, CI/security workflows, lint/typecheck/test/build policy, or Node/npm assumptions.
- Changing static export behavior, sitemap behavior, analytics setup, or environment variables.
- Changing a file listed in [Key files map](#7-key-files-map), or adding something that belongs in it.

Treat `AGENTS.md` as the canonical source for the mirrored harness briefs. After updating it, run `npm run agent-briefs:sync` and `npm run agent-briefs:check` so [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) stay aligned.

Do **not** use this file for ephemeral notes, debugging logs, or session history. It is a durable project map, not a journal.
