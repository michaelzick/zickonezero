#!/usr/bin/env node
// Read a complete DigitalOcean AppSpec JSON from stdin and emit the corrected
// spec. This is a local transform: it never calls the hosting API or deploys.
const fs = require('fs');

const HOSTS = ['zickonezero.com', 'www.zickonezero.com'];
const LEGACY_PATHS = ['/case-studies', '/case-studies/'];

function configureStaticHosting(spec) {
  const next = JSON.parse(JSON.stringify(spec));
  const site = next.static_sites?.find(({ name }) => name === 'zickonezero');
  if (site?.github?.repo !== 'michaelzick/zickonezero' || site.output_dir !== 'out') {
    throw new Error('Expected the michaelzick/zickonezero static site exporting to out.');
  }
  const rules = next.ingress?.rules;
  if (!Array.isArray(rules) || !HOSTS.every((host) => rules.some((rule) => (
    rule.match?.authority?.exact === host && rule.match?.path?.prefix === '/'
      && (rule.component?.name === site.name || (
        host === HOSTS[0] && rule.redirect?.authority === HOSTS[1]
      ))
  )))) {
    throw new Error('Expected explicit ZICKONEZERO host routes; refusing to change shared ingress.');
  }

  delete site.catchall_document;
  site.error_document = '404.html';

  // App Platform currently validates prefix matches only. Its path prefix is
  // segment-based, covering the legacy route and descendants, not lookalike names.
  const redirects = HOSTS.map((host) => ({
    match: { authority: { exact: host }, path: { prefix: '/case-studies' } },
    redirect: { authority: HOSTS[1], scheme: 'https', uri: '/demostoke/', redirect_code: 301 },
  }));

  next.ingress.rules = [
    ...redirects,
    ...rules.filter((rule) => !(
      HOSTS.includes(rule.match?.authority?.exact)
        && LEGACY_PATHS.includes(rule.match?.path?.exact ?? rule.match?.path?.prefix)
    )).map((rule) => {
      if (rule.match?.authority?.exact === HOSTS[0] && rule.match?.path?.prefix === '/') {
        return {
          match: rule.match,
          redirect: { authority: HOSTS[1], scheme: 'https', redirect_code: 301 },
        };
      }
      return rule;
    }),
  ];
  return next;
}

module.exports = { configureStaticHosting };

if (require.main === module) {
  try {
    process.stdout.write(`${JSON.stringify(configureStaticHosting(JSON.parse(fs.readFileSync(0, 'utf8'))), null, 2)}\n`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
