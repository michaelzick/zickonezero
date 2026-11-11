const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const llms = fs.readFileSync(path.join(ROOT, 'public/llms.txt'), 'utf8');
const { CASE_STUDIES_LINKS } = require('../src/components/caseStudiesLinks');

const siteLinks = [...llms.matchAll(/\]\(https:\/\/www\.zickonezero\.com(\/[^)]*)\)/g)].map((match) => match[1]);

describe('llms.txt', () => {
  it('starts with the site name and a one-line summary', () => {
    expect(llms).toMatch(/^# ZICK ONE ZERO Creative\n\n> .*Michael Zick/);
  });

  it('links only to pages that exist, with trailing slashes', () => {
    expect(siteLinks.length).toBeGreaterThan(0);
    for (const link of siteLinks) {
      expect(link).toMatch(/\/$/);
      expect(fs.existsSync(path.join(ROOT, 'pages', `${link.slice(1, -1)}.tsx`))).toBe(true);
    }
  });

  it('lists every flagship product in nav order', () => {
    const section = llms.split('## Flagship Products')[1].split('\n## ')[0];
    const listed = [...section.matchAll(/\]\(https:\/\/www\.zickonezero\.com(\/[^)]*)\/\)/g)].map((match) => match[1]);
    expect(listed).toEqual(CASE_STUDIES_LINKS.map(({ href }) => href));
  });
});
