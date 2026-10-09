const fs = require('fs');
const path = require('path');

const headers = fs.readFileSync(path.join(__dirname, '..', 'public', '_headers'), 'utf8');
const csp = headers.match(/Content-Security-Policy:\s*(.+)/)[1];
const directive = (name) => csp.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `));

describe('framing', () => {
  it('sends no frame-ancestors, so any site can show the site in a frame', () => {
    expect(directive('frame-ancestors')).toBeUndefined();
  });

  it('sends no X-Frame-Options, which would block the frame for every parent', () => {
    expect(headers).not.toMatch(/x-frame-options/i);
  });
});

describe('scripts', () => {
  it("lets Bar Four's house rack register its audio worklets from blob: URLs", () => {
    const sources = directive('script-src').split(/\s+/);
    expect(sources).toContain('blob:');
    expect(sources).not.toContain('data:');
    expect(sources).not.toContain('*');
  });
});

describe('analytics', () => {
  it('lets Mixpanel load its SDK and recorder and send events and replays', () => {
    expect(directive('script-src').split(/\s+/)).toContain('https://cdn.mxpnl.com');
    expect(directive('connect-src').split(/\s+/)).toContain('https://*.mixpanel.com');
  });

  it('no longer allows Amplitude', () => {
    expect(csp).not.toMatch(/amplitude/i);
  });
});

describe('the rest of the security headers', () => {
  it('still denies plugins and restricts the base URI and form targets', () => {
    expect(directive('object-src')).toBe("object-src 'none'");
    expect(directive('base-uri')).toBe("base-uri 'self'");
    expect(directive('form-action')).toBe("form-action 'self'");
  });
});
