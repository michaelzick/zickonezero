const fs = require('fs');
const path = require('path');

const BASE_URL = (process.env.SITE_URL || 'https://www.zickonezero.com').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', 'out');
const OUTPUT_PATH = path.join(OUT_DIR, 'sitemap.xml');

const EXCLUDED_ROUTES = new Set(['/404', '/500', '/sitemap']);

const isHtmlFile = (file) => file.endsWith('.html');

function walkHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkHtmlFiles(entryPath));
    } else if (entry.isFile() && isHtmlFile(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function dedupe(list) {
  return Array.from(new Set(list));
}

function routeFromFile(filePath) {
  const relativePath = path.relative(OUT_DIR, filePath).split(path.sep).join('/');

  if (relativePath === 'index.html') {
    return '/';
  }

  if (relativePath.endsWith('/index.html')) {
    return `/${relativePath.slice(0, -'/index.html'.length)}`;
  }

  if (relativePath.endsWith('.html')) {
    return `/${relativePath.slice(0, -'.html'.length)}`;
  }

  return null;
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
  if (!fs.existsSync(OUT_DIR)) {
    console.error(
      `Expected export output at ${OUT_DIR}. Run "npm run build" before generating the sitemap.`
    );
    process.exit(1);
  }

  const routes = dedupe(
    walkHtmlFiles(OUT_DIR)
      .map(routeFromFile)
      .filter((route) => route && !EXCLUDED_ROUTES.has(route))
  ).sort();
  const xml = buildXml(routes);
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, xml, 'utf8');
  console.log(`Sitemap generated with ${routes.length} routes at ${OUTPUT_PATH}`);
}

module.exports = { routeFromFile, buildXml, EXCLUDED_ROUTES, OUT_DIR };

if (require.main === module) {
  main();
}
