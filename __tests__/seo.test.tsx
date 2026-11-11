import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import path from 'path';
import sharp from 'sharp';

// Render next/head children inline so the emitted tags are queryable in jsdom.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import Seo from '../src/components/Seo';
import {
  contactPageJsonLd,
  creativeWorkJsonLd,
  softwareApplicationJsonLd,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  itemListJsonLd,
  PERSON_ID,
  personJsonLd,
  profilePageJsonLd,
  webSiteJsonLd,
} from '../src/lib/seo';

const ORIGIN = 'https://www.zickonezero.com';

describe('Seo', () => {
  it('reports the actual default social image dimensions', async () => {
    const { width, height } = await sharp(path.join(process.cwd(), 'public', DEFAULT_OG_IMAGE)).metadata();
    render(<Seo path='/' />);
    expect(document.querySelector('meta[property="og:image:width"]')).toHaveAttribute('content', String(width));
    expect(document.querySelector('meta[property="og:image:height"]')).toHaveAttribute('content', String(height));
  });

  it('renders a trailing-slash canonical rooted at the site origin', () => {
    render(<Seo title='About Michael Zick' path='/about/' />);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/about/`
    );
  });

  it('applies the title template for interior pages', () => {
    render(<Seo title='About Michael Zick' path='/about/' />);
    expect(document.title).toBe('About Michael Zick | ZICK ONE ZERO Creative');
  });

  it('uses the brand and tagline as the home page title when no title is provided', () => {
    render(<Seo path='/' />);
    expect(document.title).toBe('ZICK ONE ZERO Creative | Michael Zick, Product Engineer & UX Designer');
  });

  it('exposes an absolute og:image URL by default', () => {
    render(<Seo path='/' />);
    const content = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    expect(content).toMatch(new RegExp(`^${ORIGIN}/img/`));
  });

  it('resolves a relative ogImage prop to an absolute URL', () => {
    render(<Seo path='/demostoke/' ogImage='/img/demostoke/case-study/ds-hero-surf.webp' />);
    expect(
      document.querySelector('meta[property="og:image"]')?.getAttribute('content')
    ).toBe(`${ORIGIN}/img/demostoke/case-study/ds-hero-surf.webp`);
  });

  it('emits og:image:alt and twitter:image:alt when ogImageAlt is set', () => {
    render(<Seo path='/riptyde/' ogImage='/img/projects/riptyde/riptyde-hero.webp' ogImageAlt='Riptyde home screen' />);
    expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute('content', 'Riptyde home screen');
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toHaveAttribute('content', 'Riptyde home screen');
  });

  it('falls back to a brand alt for the default og:image', () => {
    render(<Seo path='/' />);
    expect(document.querySelector('meta[property="og:image:alt"]')?.getAttribute('content')).toMatch(/ZICK ONE ZERO/);
  });

  it('omits image alt tags when a custom image has no alt', () => {
    render(<Seo path='/demostoke/' ogImage='/img/demostoke/case-study/ds-hero-surf.webp' />);
    expect(document.querySelector('meta[property="og:image:alt"]')).toBeNull();
    expect(document.querySelector('meta[name="twitter:image:alt"]')).toBeNull();
  });

  it('builds a ContactPage schema pointing at the contact route', () => {
    const jsonLd = contactPageJsonLd();
    expect(jsonLd['@type']).toBe('ContactPage');
    expect(jsonLd.url).toBe(`${ORIGIN}/contact/`);
    const mainEntity = jsonLd.mainEntity as { '@type': string; sameAs: string[] };
    expect(mainEntity['@type']).toBe('Person');
    expect(mainEntity.sameAs).toContain('https://github.com/michaelzick');
  });

  it('emits parseable JSON-LD with absolute URLs', () => {
    const jsonLd = creativeWorkJsonLd({
      name: 'Bars of Sand',
      description: 'A browser surf lab.',
      path: '/bars-of-sand/',
      image: '/img/projects/bars-of-sand/hero.webp',
    });
    render(<Seo path='/bars-of-sand/' jsonLd={jsonLd} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script?.textContent ?? '{}');
    expect(parsed['@type']).toBe('CreativeWork');
    expect(parsed.url).toBe(`${ORIGIN}/bars-of-sand/`);
    expect(parsed.image).toBe(`${ORIGIN}/img/projects/bars-of-sand/hero.webp`);
  });

  it('describes a flagship as the live app, with this site’s page as its subject', () => {
    const app = softwareApplicationJsonLd({
      name: 'Riptyde',
      description: 'Surf forecasts.',
      path: '/riptyde/',
      appUrl: 'https://riptyde.app/',
      downloadUrl: 'https://apps.apple.com/us/app/riptyde/id6793336480',
      applicationCategory: 'SportsApplication',
      operatingSystem: 'iOS, Web',
    });

    expect(app['@type']).toBe('SoftwareApplication');
    expect(app.url).toBe('https://riptyde.app/');
    expect(app.downloadUrl).toBe('https://apps.apple.com/us/app/riptyde/id6793336480');
    expect((app.author as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    expect(app.subjectOf).toEqual({ '@type': 'WebPage', url: `${ORIGIN}/riptyde/` });
  });

  it('credits Michael as a contributor on a client product', () => {
    const app = softwareApplicationJsonLd({
      name: 'Antisyphon Training',
      description: 'Security training.',
      path: '/antisyphon-training/',
      appUrl: 'https://www.antisyphontraining.com/',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      clientProduct: true,
    });

    expect(app.author).toBeUndefined();
    expect(app.downloadUrl).toBeUndefined();
    expect((app.contributor as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });

  it('renders each entry when jsonLd is an array', () => {
    render(
      <Seo
        path='/'
        jsonLd={[
          { '@type': 'WebSite' },
          { '@type': 'Person' },
        ]}
      />
    );
    expect(document.querySelectorAll('script[type="application/ld+json"]').length).toBe(2);
  });

  it('adds a noindex robots meta when noIndex is set', () => {
    render(<Seo title='Page Not Found' path='/404/' noIndex />);
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute('content')
    ).toContain('noindex');
  });

  it('omits the canonical from a page kept out of search', () => {
    render(<Seo title='Page Not Found' path='/404/' noIndex />);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('escapes "<" in JSON-LD so the data cannot close its script tag', () => {
    render(<Seo path='/' jsonLd={{ '@type': 'Thing', name: '</script><b>x</b>' }} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script?.innerHTML).not.toContain('</script>');
    expect(JSON.parse(script?.textContent ?? '{}').name).toBe('</script><b>x</b>');
  });

  it('names the same Person on every page', () => {
    expect(PERSON_ID).toBe(`${ORIGIN}/#person`);
    expect(personJsonLd()['@id']).toBe(PERSON_ID);
    expect((profilePageJsonLd().mainEntity as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    expect((contactPageJsonLd().mainEntity as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    const work = creativeWorkJsonLd({ name: 'Riptyde', description: 'Surf forecasts.', path: '/riptyde/' });
    expect((work.author as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });

  it('gives the person the same titles the site shows', () => {
    expect(personJsonLd().jobTitle).toEqual(['Product Engineer', 'UX Designer']);
  });

  it('describes the person in the same words as the default description', () => {
    expect(personJsonLd().description).toBe(DEFAULT_DESCRIPTION);
    expect(DEFAULT_DESCRIPTION).toMatch(/Product Engineer and UX Designer/);
    expect(personJsonLd().knowsAbout).toEqual(expect.arrayContaining(['Product engineering', 'UX design']));
  });

  it('lists pages in order with absolute URLs', () => {
    const list = itemListJsonLd('Flagship Products', [
      { name: 'Riptyde', path: '/riptyde/' },
      { name: 'Rackloose', path: '/rackloose/' },
    ]);
    expect(list['@type']).toBe('ItemList');
    expect(list.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Riptyde', url: `${ORIGIN}/riptyde/` },
      { '@type': 'ListItem', position: 2, name: 'Rackloose', url: `${ORIGIN}/rackloose/` },
    ]);
  });

  it('uses the trailing-slash home URL for the site and the person', () => {
    expect(webSiteJsonLd().url).toBe(`${ORIGIN}/`);
    expect(personJsonLd().url).toBe(`${ORIGIN}/`);
  });

  it('names the brand ZICK ONE ZERO and keeps the one-word spelling as an alternate', () => {
    const organization = personJsonLd().worksFor as Record<string, unknown>;
    for (const node of [webSiteJsonLd(), organization]) {
      expect(node.name).toBe('ZICK ONE ZERO Creative');
      expect(node.alternateName).toEqual(['ZICKONEZERO Creative', 'ZICKONEZERO']);
    }
  });

  it('omits the robots meta by default', () => {
    render(<Seo path='/' />);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
