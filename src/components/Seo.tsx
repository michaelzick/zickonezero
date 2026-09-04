import Head from 'next/head';

import { SITE_NAME } from '../lib/siteConfig';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  type JsonLd,
} from '../lib/seo';

const SITE_TAGLINE = 'Product, UX & Development';
// Intrinsic size and alt text of the default brand OG image, used when a page falls back to it.
const DEFAULT_OG_IMAGE_SIZE = 1182;
const DEFAULT_OG_IMAGE_ALT = 'ZICKONEZERO Creative lifeguard tower mark';

export type SeoProps = {
  title?: string;
  description?: string;
  path: string;
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  type?: string;
  jsonLd?: JsonLd | JsonLd[];
  noIndex?: boolean;
};

const Seo = ({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  type = 'website',
  jsonLd,
  noIndex = false,
}: SeoProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
  const metaDescription = description ?? DEFAULT_DESCRIPTION;
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(ogImage);
  const isDefaultImage = ogImage === DEFAULT_OG_IMAGE;
  const resolvedWidth = ogImageWidth ?? (isDefaultImage ? DEFAULT_OG_IMAGE_SIZE : undefined);
  const resolvedHeight = ogImageHeight ?? (isDefaultImage ? DEFAULT_OG_IMAGE_SIZE : undefined);
  const resolvedImageAlt = ogImageAlt ?? (isDefaultImage ? DEFAULT_OG_IMAGE_ALT : undefined);
  const jsonLdItems = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title key="title">{pageTitle}</title>
      <meta key="description" name="description" content={metaDescription} />
      <link key="canonical" rel="canonical" href={canonical} />
      {noIndex ? <meta key="robots" name="robots" content="noindex, nofollow" /> : null}

      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:title" property="og:title" content={pageTitle} />
      <meta key="og:description" property="og:description" content={metaDescription} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:url" property="og:url" content={canonical} />
      <meta key="og:image" property="og:image" content={image} />
      {resolvedWidth ? (
        <meta key="og:image:width" property="og:image:width" content={String(resolvedWidth)} />
      ) : null}
      {resolvedHeight ? (
        <meta key="og:image:height" property="og:image:height" content={String(resolvedHeight)} />
      ) : null}
      {resolvedImageAlt ? (
        <meta key="og:image:alt" property="og:image:alt" content={resolvedImageAlt} />
      ) : null}

      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:title" name="twitter:title" content={pageTitle} />
      <meta key="twitter:description" name="twitter:description" content={metaDescription} />
      <meta key="twitter:url" name="twitter:url" content={canonical} />
      <meta key="twitter:image" name="twitter:image" content={image} />
      {resolvedImageAlt ? (
        <meta key="twitter:image:alt" name="twitter:image:alt" content={resolvedImageAlt} />
      ) : null}

      {jsonLdItems.map((item, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
};

export default Seo;
