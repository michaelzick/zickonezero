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
its descendants), and `public/_headers` configures the security headers.
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
