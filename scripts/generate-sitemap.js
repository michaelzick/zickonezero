const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.SITE_URL || 'https://www.zickonezero.com').replace(/\/$/, '');
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const OUTPUT_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Next.js reserved filenames and directories to skip
const SKIPPED_NAMES = new Set(['_app', '_document', '_error', '404', '500']);
const PAGE_EXTENSIONS = /\.(tsx|ts|js|jsx)$/;

function getPageFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) continue; // skip api/ and other subdirs
    if (entry.name.startsWith('_')) continue; // skip _app, _document, etc.
    if (!PAGE_EXTENSIONS.test(entry.name)) continue;
    files.push(path.join(dir, entry.name));
  }

  return files;
}

function routeFromPageFile(filePath) {
  const basename = path.basename(filePath).replace(PAGE_EXTENSIONS, '');

  if (SKIPPED_NAMES.has(basename)) return null;
  if (basename === 'index') return '/';

  // Add trailing slash to match next.config.js trailingSlash: true
  return `/${basename}/`;
}

function buildXml(urls) {
  const lastmod = new Date().toISOString().slice(0, 10);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const url of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${BASE_URL}${url}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');

  return `${lines.join('\n')}\n`;
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error(`Expected pages directory at ${PAGES_DIR}.`);
    process.exit(1);
  }

  const routes = getPageFiles(PAGES_DIR)
    .map(routeFromPageFile)
    .filter(Boolean)
    .sort();

  const xml = buildXml(routes);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`Sitemap generated with ${routes.length} routes at ${OUTPUT_PATH}`);
}

module.exports = { routeFromPageFile, getPageFiles, buildXml, PAGES_DIR };

if (require.main === module) {
  main();
}
