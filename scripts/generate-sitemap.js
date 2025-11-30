const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.SITE_URL || 'https://www.zickonezero.com';
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

const IGNORE_FILES = new Set([
  '_app',
  '_document',
  '_error',
  '404',
  '500',
]);

const isPageFile = (file) => /\.(js|jsx|ts|tsx)$/.test(file);

function walkPages(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      routes.push(...walkPages(entryPath));
    } else if (entry.isFile() && isPageFile(entry.name)) {
      const name = entry.name.replace(/\.(js|jsx|ts|tsx)$/, '');
      if (IGNORE_FILES.has(name) || name.startsWith('[')) continue;

      const relPath = path.relative(PAGES_DIR, entryPath);
      const segments = relPath.split(path.sep);
      segments[segments.length - 1] = name;
      let route = '/' + segments.join('/').replace(/index$/, '');
      if (route.endsWith('/') && route !== '/') {
        route = route.slice(0, -1);
      }

      routes.push(route || '/');
    }
  }

  return routes;
}

function dedupe(list) {
  return Array.from(new Set(list));
}

function buildXml(urls) {
  const lastmod = new Date().toISOString().split('T')[0];
  const urlsXml = urls
    .map(
      (url) => `<url><loc>${BASE_URL}${url}</loc><lastmod>${lastmod}</lastmod></url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urlsXml +
    `</urlset>`;
}

function main() {
  const routes = dedupe(walkPages(PAGES_DIR)).sort();
  const xml = buildXml(routes);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`Sitemap generated with ${routes.length} routes at ${OUTPUT_PATH}`);
}

main();
