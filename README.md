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

## DigitalOcean hosting

The `zickonezero` static component is inside the shared `demostoke` App Platform
app (`8b602f38-1268-4375-bef4-46d9001db792`). Its source is
`michaelzick/zickonezero`, branch `main`, and its output directory is `out`.
Local branch changes are not live until that code is deployed.

Production requires:

- `error_document: 404.html` and no `catchall_document` on this component.
- HTTP 301 redirects for `/case-studies` and `/case-studies/` on both site hosts
  to `https://www.zickonezero.com/demostoke/`. App Platform accepts path-prefix
  matching, so this also redirects descendants of that legacy path.
- An apex-host redirect to `www.zickonezero.com`, preserving the requested path.
- The existing component route for `www.zickonezero.com`.

`public/_redirects` and `public/_headers` use Netlify/Cloudflare Pages syntax;
DigitalOcean routing must be configured in the app spec instead.

To prepare a scoped hosting update, retrieve the **complete raw AppSpec** from
the DigitalOcean API and save it privately outside the repository. Older doctl
versions can discard newer ingress fields when serializing specs. App specs may
contain secrets, so do not commit them.

```sh
node scripts/configure-static-hosting.js < current-spec.json > updated-spec.json
```

This command only transforms JSON. Review the diff, validate with
`POST /v2/apps/propose` using the existing `app_id`, then submit the complete
updated `spec` to `PUT /v2/apps/{app_id}` with
`update_all_source_versions: false` for a hosting-only update. Preserve unrelated
components and routes, and keep the prior spec for rollback.

After deployment, verify real HTTP responses: existing routes return their own
HTML and canonical, missing routes/assets return 404, legacy paths return 301,
social assets have an image content type, and `sitemap.xml` includes new pages.

See [AGENTS.md](AGENTS.md) for the project map and the separate contact Worker.
