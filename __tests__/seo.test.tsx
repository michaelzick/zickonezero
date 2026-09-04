import { render } from '@testing-library/react';
import type { ReactNode } from 'react';

// Render next/head children inline so the emitted tags are queryable in jsdom.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import Seo from '../src/components/Seo';
import { creativeWorkJsonLd } from '../src/lib/seo';

const ORIGIN = 'https://www.zickonezero.com';

describe('Seo', () => {
  it('renders a trailing-slash canonical rooted at the site origin', () => {
    render(<Seo title='About Michael Zick' path='/about/' />);
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${ORIGIN}/about/`
    );
  });

  it('applies the title template for interior pages', () => {
    render(<Seo title='About Michael Zick' path='/about/' />);
    expect(document.title).toBe('About Michael Zick | ZICKONEZERO Creative');
  });

  it('uses the brand and tagline as the home page title when no title is provided', () => {
    render(<Seo path='/' />);
    expect(document.title).toBe('ZICKONEZERO Creative | Product, UX & Development');
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

  it('emits parseable JSON-LD with absolute URLs', () => {
    const jsonLd = creativeWorkJsonLd({
      name: 'DemoStoke UX Case Study',
      description: 'A unified gear marketplace.',
      path: '/demostoke/',
      image: '/img/demostoke/case-study/ds-hero-surf.webp',
    });
    render(<Seo path='/demostoke/' jsonLd={jsonLd} />);

    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const parsed = JSON.parse(script?.textContent ?? '{}');
    expect(parsed['@type']).toBe('CreativeWork');
    expect(parsed.url).toBe(`${ORIGIN}/demostoke/`);
    expect(parsed.image).toBe(`${ORIGIN}/img/demostoke/case-study/ds-hero-surf.webp`);
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

  it('omits the robots meta by default', () => {
    render(<Seo path='/' />);
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });
});
