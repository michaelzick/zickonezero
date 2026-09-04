export const CONTACT_LINKS = [
  { href: '/contact', label: 'Contact', external: false },
  { href: 'https://github.com/michaelzick', label: 'GitHub', external: true },
  { href: 'https://linkedin.com/in/michaelzick', label: 'LinkedIn', external: true }
] as const;

// The Contact page has its own primary nav item, so the nav dropdown/accordion
// only list the external profiles; the footer shows everything.
export const EXTERNAL_LINKS = CONTACT_LINKS.filter((link) => link.external);
