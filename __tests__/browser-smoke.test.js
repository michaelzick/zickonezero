const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const {
  contentTypeFor,
  createStaticServer,
  isThirdParty,
  parseArgs,
  parseSiteHeaders,
  resolveStaticPath,
} = require('../scripts/browser-smoke');

describe('parseArgs', () => {
  it('takes no options, or a screenshot folder', () => {
    expect(parseArgs([])).toEqual({ screenshotsDir: null });
    expect(parseArgs(['--screenshots', 'shots'])).toEqual({ screenshotsDir: path.resolve('shots') });
  });

  it.each([
    [['--screenshots'], '--screenshots needs a directory'],
    [['--screenshots', '--headed'], '--screenshots needs a directory'],
    [['--headed'], 'Unknown option --headed'],
  ])('rejects %j', (argv, message) => {
    expect(() => parseArgs(argv)).toThrow(message);
  });
});

describe('resolveStaticPath', () => {
  const root = path.resolve('/srv/site');

  it.each([
    ['/', 'index.html'],
    ['/about/', 'about/index.html'],
    ['/_next/static/chunks/app.js', '_next/static/chunks/app.js'],
    ['/img/a%20b.webp', 'img/a b.webp'],
  ])('maps %p into the export', (pathname, file) => {
    expect(resolveStaticPath(root, pathname)).toBe(path.join(root, file));
  });

  it.each([
    '/../secret.txt',
    '/%2e%2e/secret.txt',
    '/..%2fsecret.txt',
    '/img/%2e%2e/%2e%2e/secret.txt',
    '/a%00b',
    '/%E0%A4%A',
  ])('refuses %p', (pathname) => {
    expect(resolveStaticPath(root, pathname)).toBeNull();
  });
});

describe('contentTypeFor', () => {
  it.each([
    ['page.html', 'text/html; charset=utf-8'],
    ['chunk.js', 'text/javascript; charset=utf-8'],
    ['font.woff2', 'font/woff2'],
    ['SHOT.WEBP', 'image/webp'],
    ['_headers', 'application/octet-stream'],
  ])('serves %p as %p', (file, type) => {
    expect(contentTypeFor(file)).toBe(type);
  });
});

describe('parseSiteHeaders', () => {
  it('reads the headers of the /* rule only', () => {
    const text = [
      '# Site-wide',
      '/*',
      '  X-Content-Type-Options: nosniff',
      "  Content-Security-Policy: default-src 'self'; img-src 'self' data:",
      '',
      '/img/*',
      '  Cache-Control: max-age=31536000',
    ].join('\n');

    expect(parseSiteHeaders(text)).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:",
    });
  });

  it('applies the production Content-Security-Policy', () => {
    const headers = parseSiteHeaders(fs.readFileSync(path.join(__dirname, '..', 'public', '_headers'), 'utf8'));
    expect(headers['Content-Security-Policy']).toMatch(/^default-src 'self';/);
  });
});

describe('isThirdParty', () => {
  const origin = 'http://127.0.0.1:4000';

  it.each([
    [`${origin}/about/`, false],
    ['http://127.0.0.1:40001/about/', true],
    ['https://www.googletagmanager.com/gtm.js', true],
    ['', false],
  ])('treats %p as third party: %p', (url, expected) => {
    expect(isThirdParty(url, origin)).toBe(expected);
  });
});

describe('createStaticServer', () => {
  let dir;
  let server;

  const get = (urlPath) => new Promise((resolve, reject) => {
    const { port } = server.address();
    http.get({ host: '127.0.0.1', port, path: urlPath, agent: false }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
    }).on('error', reject);
  });

  beforeAll(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'browser-smoke-'));
    const site = path.join(dir, 'site');
    fs.mkdirSync(path.join(site, 'about'), { recursive: true });
    fs.writeFileSync(path.join(site, 'index.html'), '<h1>Home</h1>');
    fs.writeFileSync(path.join(site, 'about', 'index.html'), '<h1>About</h1>');
    fs.writeFileSync(path.join(site, '404.html'), '<h1>Page not found</h1>');
    fs.writeFileSync(path.join(site, 'app.js'), 'void 0;');
    fs.writeFileSync(path.join(dir, 'secret.txt'), 'outside the export');

    server = createStaticServer(site, { 'X-Content-Type-Options': 'nosniff' });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  });

  afterAll(() => {
    server.close();
    server.closeAllConnections();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('serves pages and assets with their types and the site headers', async () => {
    const home = await get('/');
    expect(home).toMatchObject({ status: 200, body: '<h1>Home</h1>' });
    expect(home.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(home.headers['x-content-type-options']).toBe('nosniff');

    await expect(get('/about/')).resolves.toMatchObject({ status: 200, body: '<h1>About</h1>' });
    const script = await get('/app.js');
    expect(script.headers['content-type']).toBe('text/javascript; charset=utf-8');
  });

  it('adds the trailing slash to a folder', async () => {
    const response = await get('/about');
    expect(response.status).toBe(308);
    expect(response.headers.location).toBe('/about/');
  });

  it('answers a missing page with 404.html and a 404 status', async () => {
    await expect(get('/no-such-page/')).resolves.toMatchObject({ status: 404, body: '<h1>Page not found</h1>' });
  });

  it('never serves a file outside the export', async () => {
    const response = await get('/..%2fsecret.txt');
    expect(response.status).toBe(404);
    expect(response.body).not.toContain('outside the export');
  });
});
