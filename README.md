# ZICKONEZERO Creative

Michael Zick’s portfolio and case-study site, built with Next.js Pages Router,
React, TypeScript, and styled-components. Production is a static export.

## Local development

Use Node 24.x and npm:

```sh
npm ci
npm run dev
```

Run `npm run check` before shipping. It checks the agent briefs, lint, TypeScript,
tests, and the production build. `npm run build` generates the sitemap and robots
file, then exports the complete site into `out/`.

## Tests

`npm test` runs Jest in band and stops any run still going after 3 minutes, so a
hung test fails fast instead of stalling; CI's test step has the same limit. Pass
Jest arguments after `--`, for example `npm test -- __tests__/seo.test.tsx`.
Watch mode (`npm test -- --watch`) has no limit.

An optional browser smoke test loads the exported site in headless Chromium at
desktop and phone sizes. It fails on page or console errors (including CSP
violations), horizontal overflow, or a homepage scene that stops responding to
scroll, theme, or reduced motion. It is not part of `npm test`, `npm run check`,
or CI, and it stops itself after 3 minutes. Playwright is not a project
dependency, so install it once, globally or for this checkout only:

```sh
npm i -g playwright            # or: npm install --no-save playwright
npx playwright install chromium
npm run build
npm run test:browser
```

Add `-- --screenshots <dir>` to save a PNG for each check; pick a folder outside
the repository. On GitHub, start the **Browser tests** workflow from the Actions
tab. It runs the same test and uploads its screenshots as the
`browser-screenshots` artifact.

## Living city

The site is a neon city. One persistent backdrop (sky, skyline, flying traffic,
fog, dust by day, and snow on About) mounts once in `pages/_app.tsx` and pans to each page's
spot in the city as visitors navigate. The homepage walks from a weathered futuristic alley past a holo billboard
and three work districts to open city
above the footer, with a minimap HUD for fast travel.

- The alley opens on "Michael Zick is ZICKONEZERO Creative" in a bottom-left introduction,
  balanced by a top-right tube-neon Night Market sign with a plain Russian
  translation underneath. Two letters have brief, shallow flickers every few seconds; these
  pause offscreen or in hidden tabs and stay lit under reduced motion or
  Save-Data. Small paper scraps drift near the
  worn street, pause offscreen or in hidden tabs, and stay still under reduced
  motion or Save-Data. Five vertical towers emerge through fog as the camera
  advances, reaching full contrast just before the hero leaves the viewport.
  Their reveal reverses on the way back and stays visible under reduced motion.
  The drone recedes down the alley toward the towers. Mouse movement changes
  the camera parallax without a pointer glow, and ONE keeps its accent color
  without glowing throughout the site.
- The Current Gig objective points to the next district in route order, then
  offers "Return to surface" at Web Development to scroll back to the hero.
- Night is the default. The nav's time-of-day toggle switches to day, and the
  choice is remembered.
- Sound stays off until a visitor turns it on. It is synthesized in the browser
  with Web Audio, so there are no audio files, and the choice is remembered.
- All art is original. The scenery is generated from seeded SVG, CSS, and canvas
  code, and the fonts are self-hosted. Keep new signage and copy original too.
- Everything that moves has a still state under reduced motion. To preview it,
  turn on "Reduce motion" in your operating system's accessibility settings, or
  open Chrome DevTools' **Rendering** panel and set **Emulate CSS media feature
  prefers-reduced-motion** to `reduce`.

See [AGENTS.md](AGENTS.md) for the module map and the CSS rules that keep the
city testable in Jest.

## Search and sharing

Every public page owns its title, description, canonical, social image metadata,
and JSON-LD through `src/components/Seo.tsx`. Image dimensions must match the
actual asset; provide descriptive alt text for custom social images.

The About biography and secondary case-study panels are present in exported HTML.
Native `hidden` containers preserve the modal/tab presentation. Keep the content
rendered when changing those interactions, and maintain unique IDs and working
tab-to-panel accessibility relationships.

The generated sitemap includes all public routes and omits `lastmod` until a
reliable per-page content-date source exists. A build date is not a content date.

## Cloudflare hosting

Cloudflare Worker `zickonezero` serves the static `out/` export on
`www.zickonezero.com` and `zickonezero.com`. `wrangler.jsonc` declares the
custom domains, trailing-slash handling, and real 404 responses. The zone's
**Canonical apex to www** Redirect Rule sends HTTP and HTTPS apex requests to
`https://www.zickonezero.com`, preserving paths and query strings.

`public/_redirects` preserves the legacy `/case-studies` redirect (including
its descendants), sends the removed `/michael-zick-coaching` route to
`https://www.niceguyuniversity.com/`, and `public/_headers` configures the
security headers.
The contact form continues using the separate `zickonezero-contact` Worker.

Workers Builds uses this GitHub repository's `main` branch with Node 24,
`npm run build`, and `npx wrangler@4.133.0 deploy`. For a manual deployment:

```sh
npm ci
npm run build
npx wrangler@4.133.0 deploy
```

After deployment, verify real HTTP responses: existing routes return their own
HTML and canonical, missing routes/assets return 404, legacy paths return 301,
social assets have an image content type, and `sitemap.xml` includes new pages.

### DigitalOcean rollback

The former static component remains inside the shared DigitalOcean `demostoke`
app (`8b602f38-1268-4375-bef4-46d9001db792`) until the owner archives it.
`scripts/configure-static-hosting.js` remains available for rollback hosting
configuration. Preserve complete raw AppSpec exports privately outside the
repository; they can contain secrets and older doctl serializers can drop
ingress fields. Hosting-only API updates require
`update_all_source_versions: false` and preservation of unrelated components.

See [AGENTS.md](AGENTS.md) for the project map and the separate contact Worker.

### Branch previews

Workers Builds builds every non-production branch with Node 24 and `npm run build`,
then runs `npx wrangler@4.135.0 preview` (Wrangler 4.135.0 or later). The empty
`previews` block in `wrangler.jsonc` enables isolated branch previews; static assets
and routing settings remain at the top level. Each branch has a stable preview URL
that updates on subsequent pushes. Production continues to deploy from `main`.

For branches created before this configuration was added, merge current `main`
before pushing to get a working preview build.

The contact Worker keeps its production origin allowlist; contact-form email
delivery is not enabled for arbitrary preview origins.
