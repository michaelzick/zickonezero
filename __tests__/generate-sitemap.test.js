const path = require('path');
const { routeFromFile, buildXml, EXCLUDED_ROUTES, OUT_DIR } = require('../scripts/generate-sitemap');

describe('generate-sitemap', () => {
  describe('routeFromFile', () => {
    it('converts root index.html to /', () => {
      expect(routeFromFile(path.join(OUT_DIR, 'index.html'))).toBe('/');
    });

    it('converts nested index.html to directory route', () => {
      expect(routeFromFile(path.join(OUT_DIR, 'about', 'index.html'))).toBe('/about');
    });

    it('converts deeply nested paths', () => {
      expect(routeFromFile(path.join(OUT_DIR, 'demostoke-fleet-ops', 'index.html'))).toBe('/demostoke-fleet-ops');
    });

    it('converts bare .html files to routes', () => {
      expect(routeFromFile(path.join(OUT_DIR, 'page.html'))).toBe('/page');
    });
  });

  describe('EXCLUDED_ROUTES', () => {
    it('excludes /404', () => {
      expect(EXCLUDED_ROUTES.has('/404')).toBe(true);
    });

    it('excludes /500', () => {
      expect(EXCLUDED_ROUTES.has('/500')).toBe(true);
    });

    it('excludes /sitemap', () => {
      expect(EXCLUDED_ROUTES.has('/sitemap')).toBe(true);
    });

    it('does not exclude valid routes', () => {
      expect(EXCLUDED_ROUTES.has('/')).toBe(false);
      expect(EXCLUDED_ROUTES.has('/about')).toBe(false);
    });
  });

  describe('buildXml', () => {
    it('produces valid XML with correct structure', () => {
      const xml = buildXml(['/', '/about']);
      expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('</urlset>');
    });

    it('includes all provided URLs with base domain', () => {
      const xml = buildXml(['/', '/about', '/demostoke']);
      expect(xml).toContain('<loc>https://www.zickonezero.com/</loc>');
      expect(xml).toContain('<loc>https://www.zickonezero.com/about</loc>');
      expect(xml).toContain('<loc>https://www.zickonezero.com/demostoke</loc>');
    });

    it('includes lastmod dates in YYYY-MM-DD format', () => {
      const xml = buildXml(['/']);
      expect(xml).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    });

    it('produces one <url> block per route', () => {
      const xml = buildXml(['/', '/about', '/demostoke']);
      const urlCount = (xml.match(/<url>/g) || []).length;
      expect(urlCount).toBe(3);
    });
  });
});
