# ZICKONEZERO - Agent Orientation (Claude Code)

This document is the canonical project brief for AI coding agents. Read it at the start of every session instead of re-exploring the repo. Keep it current: see [Maintaining this file](#maintaining-this-file).

Sibling files [AGENTS.md](AGENTS.md) (Codex) and [GEMINI.md](GEMINI.md) (Gemini CLI) mirror this content for other harnesses. Update all three together when code structure changes.

---

## 1. Project overview

**ZICKONEZERO** is a statically exported portfolio and case-study site for Michael Zick / ZICKONEZERO Creative. It presents project work, case studies, product/service pages, and analytics-instrumented navigation/CTA flows.

Primary flows:
- Home portfolio: animated intro, tabbed work sections, thumbnail grid, and lightbox gallery.
- Case studies: reusable project showcase layouts for DemoStoke, Antisyphon Training, Nice Guy University, and related work.
- Product/service pages: DemoStoke, DemoStoke Fleet Ops, Find Your Flow State, Who's In Charge, Riptyde, coaching, and about pages.
- Contact: `/contact` posts to the Cloudflare Worker in `workers/contact/` (deployed at `https://zickonezero-contact.zickonezero.workers.dev/api/contact`), which relays through Brevo SMTP.
- Static publishing: `next build` exports the site with `output: 'export'` and regenerates `public/sitemap.xml`.

## 2. Tech stack

- **Framework:** Next.js 15 Pages Router with React 19 and TypeScript.
- **Rendering:** Static export via `next.config.js` (`output: 'export'`, `trailingSlash: true`, unoptimized images).
- **State:** Redux Toolkit with typed hooks in `src/hooks.ts`.
- **Styling:** styled-components 5, SCSS globals, and shared theme constants in `styles/theme.ts`.
- **UI libraries:** Radix UI icons/select/tabs, `fslightbox-react`.
- **Analytics:** Google Tag Manager plus Amplitude-style event helpers in `src/lib/analytics.ts`.
- **Tooling:** npm, Node 24.x, Jest + React Testing Library, Storybook 8, ESLint, TypeScript.

## 3. Repository layout

```
zickonezero/
+-- pages/               # Next Pages Router pages
+-- src/
|   +-- components/      # Site navigation, homepage, case-study, analytics, and shared components
|   +-- data/            # Static JSON content used by portfolio pages
|   +-- components/*/    # Feature-specific case-study/user-story components
|   +-- hooks/           # Browser interaction hooks
|   +-- lib/             # Analytics helpers
|   +-- stories/         # Storybook examples and component stories
|   +-- test/            # Test render utilities
|   +-- *.Slice.ts       # Redux Toolkit slices
+-- styles/              # styled-components exports, page-specific style modules, globals
+-- public/              # Static images, favicon assets, generated sitemap/robots, and host config (_headers, _redirects)
+-- scripts/             # Build-time utilities such as sitemap generation
+-- workers/contact/     # Cloudflare Worker (own package) that emails contact-form submissions via Brevo SMTP
+-- __tests__/           # Jest and React Testing Library tests
+-- skills/              # Repo-local coding and agent-brief maintenance skills
+-- .storybook/          # Storybook configuration
+-- .github/workflows/   # CI and security automation
+-- next.config.js
+-- tsconfig.json
+-- package.json
```

## 4. Application structure

### 4.1 Next app

- **Root wrapper:** `pages/_app.tsx` imports global SCSS, wraps pages with Redux and `AppThemeProvider`, installs GTM/site analytics, and renders only the shared viewport plus icon/manifest/theme-color links in `<Head>`.
- **Per-page SEO:** every page renders its own `<Seo>` (`src/components/Seo.tsx`) for the title, canonical (trailing-slash, absolute), description, Open Graph/Twitter tags, and JSON-LD. Metadata copy lives inline per page; `ProjectShowcase` pages single-source `title`/`summary`/`heroImage` into local consts shared by `<Seo>` and `<ProjectShowcase>`. There is no global head/meta component.
- **Document:** `pages/_document.tsx` handles server document structure for styled-components.
- **Home page:** `pages/index.tsx` loads work data with `getStaticProps`, syncs it into Redux via `useEffect`, and passes it to `MainContent` as a prop.
- **Content pages:** top-level files in `pages/` render about, contact, case-study, coaching, DemoStoke, Antisyphon, Nice Guy University, and product pages.
- **Contact page:** `pages/contact.tsx` renders `src/components/ContactContent.tsx`, which posts JSON to `NEXT_PUBLIC_CONTACT_ENDPOINT` (default `DEFAULT_CONTACT_ENDPOINT`, the deployed workers.dev URL) via `src/lib/contactForm.ts`, tracks `contact_form_submit_*` events, and includes a honeypot `website` field.
- **Static export:** `next.config.js` keeps the app static-host friendly. Static data helpers live under `src/` instead of `pages/api` so the exported site does not expose accidental API routes.

### 4.2 State, content, and UI

- **Redux store:** `src/store.ts` combines `worksDataSlice` and `showMobileMenuSlice`.
- **Typed hooks:** `src/hooks.ts` exports `useAppDispatch` and `useAppSelector`.
- **Homepage:** `src/components/MainContent.tsx` coordinates tabs, scroll animation, lightbox state, mobile menu state, analytics events, and work-grid rendering.
- **Project showcases:** `src/components/ProjectShowcase.tsx` provides the reusable case-study shell with hero, section cards, lightbox, and tracking. Pass `imageOrientation='portrait'` for phone-screenshot showcases (e.g. Riptyde) so section images are height-capped and centered instead of filling the column.
- **Case-study modules:** `src/components/demostoke/`, `src/components/antisyphon/`, `src/components/niceguyuniversity/`, and `src/components/userstories/` hold page-specific content and section data.
- **Static data:** `src/data/worksData.json` feeds the homepage portfolio grid through `src/lib/getWorksData.ts`.
- **Design tokens/styles:** `styles/index.js`, `styles/projectShowcases.js`, `styles/*.ts`, and `styles/globals.scss` define shared styled-components and page themes.

### 4.3 Build utilities

- `scripts/generate-sitemap.js` scans top-level page files, skips reserved/API-like pages, and writes both `public/sitemap.xml` and `public/robots.txt` (which allows all crawlers and points at the absolute sitemap URL). Both generated files are git-ignored and rebuilt by `prebuild`.
- `scripts/capture-ngu-screenshots.js` recaptures the Nice Guy University case-study screenshots from the live site as 2x-desktop WebP images (requires Playwright and cwebp, which are not project dependencies).
- `scripts/capture-michael-zick-coaching-screenshots.js` recaptures the Michael Zick Coaching case-study screenshots from the live michaelzick.com as 2x desktop and mobile WebP images, suppressing the coupon modal and promo banner (same Playwright/cwebp requirements).
- Sitemap/robots host generation comes from `src/lib/siteConfig.js` (`NEXT_PUBLIC_SITE_URL` / `SITE_URL`, default `https://www.zickonezero.com`).
- Storybook config lives in `.storybook/` and uses `@storybook/nextjs`.

### 4.4 Contact worker

- **Hosting context:** the exported site is served from DigitalOcean App Platform (static) and proxied by Cloudflare, so there is no server runtime in this repo. `workers/contact/` is a standalone Cloudflare Worker package (own `package.json`, `wrangler.jsonc`, `tsconfig.json`) deployed to the ZICKONEZERO Cloudflare account at `https://zickonezero-contact.zickonezero.workers.dev`. The `zickonezero.com` zone is not in that account, so the site calls the Worker cross-origin (its origins are allowlisted via `ALLOWED_ORIGINS` and named in the CSP `connect-src` in `public/_headers`); a same-origin `/api/contact` zone route only becomes possible if the zone moves into the account.
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
npm test                    # Jest test suite, run in band
npm run build               # regenerate sitemap and build/export the static site
npm run check               # agent brief sync check + lint + typecheck + test + build
npm run storybook           # Storybook on port 6006
npm run build-storybook     # static Storybook build
npm run sitemap             # regenerate public/sitemap.xml only
```

CI runs `npm ci`, `agent-briefs:check`, lint, typecheck, a `workers/contact` install + typecheck, tests, and production build on Node 24.x.

Security automation runs Gitleaks, dependency review, CodeQL, and a production dependency audit at high severity (`npm audit --omit=dev --audit-level=high`). Stable Next releases may still report moderate advisories (e.g. Next's bundled postcss) in npm audit until patched stable versions are available; those remain visible but non-blocking at the high threshold unless the project intentionally moves to a patched stable release.

Static-host security headers and redirects live in `public/_headers` and `public/_redirects` (Netlify/Cloudflare Pages format). The CSP allows the inline GTM/theme/Amplitude bootstraps and styled-components inline styles that the static export requires. Environment variables: `NEXT_PUBLIC_SITE_URL` / `SITE_URL` set the canonical origin (see `src/lib/siteConfig.js`); `NEXT_PUBLIC_AMPLITUDE_API_KEY` overrides the public browser analytics key; `NEXT_PUBLIC_CONTACT_ENDPOINT` overrides the contact form endpoint (default is the deployed workers.dev URL; set it to `http://localhost:8787/api/contact` in `.env.local` when running the Worker locally).

## 6. Conventions

- **Runtime:** use Node 24.x and npm. Keep `package-lock.json` authoritative.
- **Pages:** add route files under `pages/`; top-level page filenames become routes and are picked up by the sitemap generator unless reserved or skipped.
- **Components:** use PascalCase component exports; keep route/page composition thin and move reusable behavior into `src/components`, `src/hooks`, or feature folders.
- **Styling:** prefer existing styled-components and theme constants before adding new style primitives. Keep SCSS global changes broad and intentional.
- **Images:** static images live under `public/img/`; use accurate alt text for inspectable product and portfolio imagery.
- **Analytics:** use `trackEvent`, `trackLinkClick`, and existing tracked link components for navigational and CTA events.
- **Effects:** clean up timers, animation frames, observers, and browser listeners. Respect reduced-motion checks where animation is significant.
- **Tests:** co-locate broad behavior tests in `__tests__/`; use React Testing Library for user-visible behavior and Jest for build utilities.
- **Validation:** do not mark work done while lint, typecheck, tests, or build fail. Do not run browser UI tests unless the user explicitly asks for them.
- **Coding standards:** use `skills/coding-standards/SKILL.md` before implementation, refactors, UI state handling, error handling, performance-sensitive changes, tests, and reviews.
- **Agent briefs:** when meaningful project facts change, update `AGENTS.md`, run `npm run agent-briefs:sync`, and keep `CLAUDE.md` / `GEMINI.md` in lockstep.

## 7. Key files map

| Path | What lives here |
|---|---|
| [pages/_app.tsx](pages/_app.tsx) | App providers, analytics scripts, global metadata |
| [pages/index.tsx](pages/index.tsx) | Home page data loading and `MainContent` entry |
| [pages/nice-guy-university.tsx](pages/nice-guy-university.tsx) | Nice Guy University case-study route |
| [src/components/MainContent.tsx](src/components/MainContent.tsx) | Homepage animation, section tabs, gallery/lightbox |
| [src/components/NiceGuyUniversityContent.tsx](src/components/NiceGuyUniversityContent.tsx) | Nice Guy University tabbed case-study shell |
| [src/components/ProjectShowcase.tsx](src/components/ProjectShowcase.tsx) | Reusable case-study layout (landscape or portrait screenshots) |
| [pages/contact.tsx](pages/contact.tsx) | Contact page route |
| [src/components/ContactContent.tsx](src/components/ContactContent.tsx) | Contact form UI and submission states |
| [src/lib/contactForm.ts](src/lib/contactForm.ts) | Contact form client validation and endpoint call |
| [workers/contact/src/index.ts](workers/contact/src/index.ts) | Cloudflare Worker (workers.dev) handling contact submissions via Brevo SMTP |
| [workers/contact/src/contact.ts](workers/contact/src/contact.ts) | Pure contact validation and email builder |
| [src/components/niceguyuniversity/](src/components/niceguyuniversity/) | Nice Guy University case-study and product-screen section data |
| [src/components/TrackedLink.tsx](src/components/TrackedLink.tsx) | Analytics-aware links |
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
| [scripts/generate-sitemap.js](scripts/generate-sitemap.js) | Sitemap generation |
| [.github/workflows/ci.yml](.github/workflows/ci.yml) | Automated CI checks |
| [.github/workflows/security.yml](.github/workflows/security.yml) | Security scanning |
| [skills/coding-standards/SKILL.md](skills/coding-standards/SKILL.md) | Production coding standards |
| [skills/sync-agent-briefs/SKILL.md](skills/sync-agent-briefs/SKILL.md) | Agent brief sync workflow |

---

## Maintaining this file

**Whenever you change the codebase in a way this document describes, update it in the same change.** Examples that require an update:

- Adding, removing, renaming, or re-homing top-level directories, route groups, feature folders, or build scripts.
- Changing root `package.json` scripts, CI/security workflows, lint/typecheck/test/build policy, or Node/npm assumptions.
- Changing static export behavior, sitemap behavior, Storybook setup, analytics setup, or environment variables.
- Changing a file listed in [Key files map](#7-key-files-map), or adding something that belongs in it.

Treat `AGENTS.md` as the canonical source for the mirrored harness briefs. After updating it, run `npm run agent-briefs:sync` and `npm run agent-briefs:check` so [CLAUDE.md](CLAUDE.md) and [GEMINI.md](GEMINI.md) stay aligned.

Do **not** use this file for ephemeral notes, debugging logs, or session history. It is a durable project map, not a journal.
