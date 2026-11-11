const fs = require('fs');
const path = require('path');

const rules = fs.readFileSync(path.join(__dirname, '..', 'public', '_redirects'), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => {
    const [from, to, status] = line.split(/\s+/);
    return { from, to, status };
  });

describe('removed Michael Zick Coaching route', () => {
  it.each([
    '/michael-zick-coaching',
    '/michael-zick-coaching/',
    '/michael-zick-coaching/*',
  ])('permanently redirects %s to Nice Guy University', (from) => {
    expect(rules).toContainEqual({ from, to: 'https://www.niceguyuniversity.com/', status: '301' });
  });
});

describe('removed DemoStoke Fleet Ops route', () => {
  it.each([
    '/demostoke-fleet-ops',
    '/demostoke-fleet-ops/',
    '/demostoke-fleet-ops/*',
  ])('permanently redirects %s to DemoStoke, which now covers Fleet Ops', (from) => {
    expect(rules).toContainEqual({ from, to: 'https://www.zickonezero.com/demostoke/', status: '301' });
  });
});
