const fs = require('fs');
const path = require('path');

const headers = fs.readFileSync(path.join(__dirname, '..', 'public', '_headers'), 'utf8');
const csp = headers.match(/Content-Security-Policy:\s*(.+)/)[1];
const directive = (name) => csp.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name} `));

describe('framing', () => {
  it('lets only michaelzick.com show the site in a frame', () => {
    expect(directive('frame-ancestors').split(/\s+/).slice(1)).toEqual([
      'https://michaelzick.com',
      'https://www.michaelzick.com',
    ]);
  });

  it('sends no X-Frame-Options, which cannot name an allowed parent and would still block the frame', () => {
    expect(headers).not.toMatch(/x-frame-options/i);
  });
});

describe('the rest of the security headers', () => {
  it('still denies plugins and restricts the base URI and form targets', () => {
    expect(directive('object-src')).toBe("object-src 'none'");
    expect(directive('base-uri')).toBe("base-uri 'self'");
    expect(directive('form-action')).toBe("form-action 'self'");
  });
});
