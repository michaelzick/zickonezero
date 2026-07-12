import { SITE_NAME, SITE_URL } from './siteConfig';

export type JsonLd = Record<string, unknown>;

export const DEFAULT_DESCRIPTION =
  'Product Management, Engineering Management, UX Design, Frontend Development, Git/DevOps, and Creative Direction.';

export const DEFAULT_OG_IMAGE = '/img/lifeguard-tower-transparent.webp';

const SAME_AS = [
  'https://github.com/michaelzick',
  'https://linkedin.com/in/michaelzick',
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

export const personJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Michael Zick',
  url: SITE_URL,
  jobTitle: 'Product Leader',
  worksFor: {
    '@type': 'Organization',
    name: SITE_NAME,
  },
  sameAs: SAME_AS,
});

export const webSiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
});

export const profilePageJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Michael Zick',
    url: absoluteUrl('/about/'),
    jobTitle: 'Product Leader',
    sameAs: SAME_AS,
  },
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
    name: 'Michael Zick',
    url: SITE_URL,
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
