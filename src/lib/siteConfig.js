// Single source of truth for the canonical site origin and brand name.
// CommonJS so the sitemap build script (Node) and the React app (webpack)
// can both consume it. See siteConfig.d.ts for the typed surface.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.zickonezero.com'
).replace(/\/$/, '');

module.exports = {
  SITE_URL,
  SITE_NAME: 'ZICKONEZERO Creative',
};
