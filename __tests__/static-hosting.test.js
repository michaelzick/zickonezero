const { configureStaticHosting } = require('../scripts/configure-static-hosting');

const route = (host, name) => ({
  match: { authority: { exact: host }, path: { prefix: '/' } },
  component: { name },
});
const fixture = () => ({
  name: 'shared-app',
  domains: [{ domain: 'www.zickonezero.com', type: 'ALIAS' }],
  services: [{ name: 'marketplace', instance_count: 2 }],
  static_sites: [
    { name: 'zickonezero', github: { repo: 'michaelzick/zickonezero', branch: 'main' }, output_dir: 'out', catchall_document: 'index.html' },
    { name: 'another-site', catchall_document: 'index.html' },
  ],
  ingress: { rules: [
    route('www.demostoke.com', 'marketplace'),
    route('zickonezero.com', 'zickonezero'),
    route('www.zickonezero.com', 'zickonezero'),
    route('fleet.demostoke.com', 'another-site'),
  ] },
});

it('uses the exported 404 without changing other components or source revisions', () => {
  const before = fixture();
  const next = configureStaticHosting(before);
  expect(next.static_sites[0]).toEqual({ ...before.static_sites[0], catchall_document: undefined, error_document: '404.html' });
  expect(next.static_sites[1]).toEqual(before.static_sites[1]);
  expect(next.services).toEqual(before.services);
  expect(next.domains).toEqual(before.domains);
  expect(before.static_sites[0].catchall_document).toBe('index.html');
  expect(next.ingress.rules).toContainEqual(before.ingress.rules[0]);
  expect(next.ingress.rules).toContainEqual(before.ingress.rules[3]);
});

it('scopes the legacy path-prefix redirects to the two site hosts', () => {
  const next = configureStaticHosting(fixture());
  expect(next.ingress.rules.slice(0, 2)).toEqual(expect.arrayContaining(
    ['zickonezero.com', 'www.zickonezero.com'].map((host) => ({
      match: { authority: { exact: host }, path: { prefix: '/case-studies' } },
      redirect: { authority: 'www.zickonezero.com', scheme: 'https', uri: '/demostoke/', redirect_code: 301 },
    }))
  ));
  expect(next.ingress.rules).toContainEqual({
    match: { authority: { exact: 'zickonezero.com' }, path: { prefix: '/' } },
    redirect: { authority: 'www.zickonezero.com', scheme: 'https', redirect_code: 301 },
  });
  expect(next.ingress.rules).toContainEqual(route('www.zickonezero.com', 'zickonezero'));
});

it('is safe to rerun without duplicating redirects', () => {
  const next = configureStaticHosting(fixture());
  expect(configureStaticHosting(next)).toEqual(next);
});

it('refuses an unrelated site or an ambiguous shared ingress', () => {
  const wrongRepo = fixture();
  wrongRepo.static_sites[0].github.repo = 'someone/else';
  expect(() => configureStaticHosting(wrongRepo)).toThrow('Expected the michaelzick/zickonezero');
  const missingIngress = fixture();
  delete missingIngress.ingress;
  expect(() => configureStaticHosting(missingIngress)).toThrow('refusing to change shared ingress');
});
