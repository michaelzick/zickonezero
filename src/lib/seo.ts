import { SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from './siteConfig';

export type JsonLd = Record<string, unknown>;

export const DEFAULT_DESCRIPTION =
  'Product Management, Engineering Management, product engineering, UX design, Git/DevOps, and Creative Direction.';

export const DEFAULT_OG_IMAGE = '/img/og/zickonezero-card.png';

const SAME_AS = [
  'https://github.com/michaelzick',
  'https://www.linkedin.com/in/michaelzick',
];

/**
 * Resolve a site-relative path (or pass through an already-absolute URL) to an
 * absolute URL rooted at the canonical site origin.
 */
export const absoluteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

const HOME_URL = absoluteUrl('/');

// Every page names the same Person by this id, so search engines treat the
// mentions as one person rather than several.
export const PERSON_ID = `${HOME_URL}#person`;

const personNode = (): JsonLd => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Michael Zick',
  url: HOME_URL,
  jobTitle: ['Product Engineer', 'UX designer'],
  sameAs: SAME_AS,
});

export const personJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  ...personNode(),
  worksFor: {
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
  },
});

export const webSiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: SITE_ALTERNATE_NAMES,
  url: HOME_URL,
});

export const profilePageJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: absoluteUrl('/about/'),
  mainEntity: personNode(),
});

export const contactPageJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact',
  url: absoluteUrl('/contact/'),
  mainEntity: personNode(),
});

export type CreativeWorkInput = {
  name: string;
  description: string;
  path: string;
  image?: string;
};

export const creativeWorkJsonLd = ({ name, description, path, image }: CreativeWorkInput): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name,
  description,
  url: absoluteUrl(path),
  image: absoluteUrl(image ?? DEFAULT_OG_IMAGE),
  author: {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Michael Zick',
    url: HOME_URL,
  },
});

export type SoftwareApplicationInput = {
  /** The product's name, e.g. 'Riptyde'. */
  name: string;
  description: string;
  /** This site's page about the product. */
  path: string;
  /** Where the live product runs. */
  appUrl: string;
  /** An app store listing, when there is one. */
  downloadUrl?: string;
  applicationCategory: string;
  operatingSystem: string;
  image?: string;
  /** A product Michael built for a client: he is a contributor, not its author. */
  clientProduct?: boolean;
};

/** A live product Michael shipped, described by this site's page about it. */
export const softwareApplicationJsonLd = ({
  name,
  description,
  path,
  appUrl,
  downloadUrl,
  applicationCategory,
  operatingSystem,
  image,
  clientProduct = false,
}: SoftwareApplicationInput): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  description,
  url: appUrl,
  ...(downloadUrl ? { downloadUrl } : {}),
  applicationCategory,
  operatingSystem,
  image: absoluteUrl(image ?? DEFAULT_OG_IMAGE),
  [clientProduct ? 'contributor' : 'author']: {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Michael Zick',
    url: HOME_URL,
  },
  subjectOf: {
    '@type': 'WebPage',
    url: absoluteUrl(path),
  },
});

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export const breadcrumbJsonLd = (items: BreadcrumbItem[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
