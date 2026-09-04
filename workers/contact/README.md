# zickonezero-contact Worker

Cloudflare Worker that receives POSTs from the site's `/contact` form and relays
them through Brevo SMTP (`smtp-relay.brevo.com:587`) using the same
`BREVO_USER` / `BREVO_SMTP_PASSWORD` / `BREVO_FROM` / `BREVO_TO` variables the
michaelzick.com contact route uses.

The static site itself is hosted on DigitalOcean and proxied by Cloudflare, so
this Worker is bound to the route `www.zickonezero.com/api/contact` and the
browser talks to it same-origin.

## Local development

```bash
cd workers/contact
cp .dev.vars.example .dev.vars   # then fill in BREVO_USER / BREVO_SMTP_PASSWORD
npm install
npm run dev                       # http://localhost:8787/api/contact
```

Point the Next dev server at it by adding to the repo-root `.env.local`:

```
NEXT_PUBLIC_CONTACT_ENDPOINT=http://localhost:8787/api/contact
```

## Deploy

```bash
cd workers/contact
npx wrangler secret put BREVO_USER
npx wrangler secret put BREVO_SMTP_PASSWORD
npx wrangler secret put BREVO_FROM        # mzick@zickonezero.com
npx wrangler secret put BREVO_TO
npm run deploy
```

## Request contract

`POST /api/contact` with JSON `{ name, email, message, website }` where
`website` is a honeypot that must stay empty. Responses are JSON
`{ success: boolean, error?: string, requestId?: string }` with `400` for
validation errors, `403` for a disallowed `Origin`, `413` for oversized bodies,
`500` when secrets are missing, and `502` when Brevo rejects the send.
