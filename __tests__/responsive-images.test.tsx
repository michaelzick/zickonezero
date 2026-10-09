import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import AntisyphonContent from '../src/components/AntisyphonContent';
import DemoStokeContent from '../src/components/DemoStokeContent';
import NiceGuyUniversityContent from '../src/components/NiceGuyUniversityContent';
import ProjectShowcase from '../src/components/ProjectShowcase';
import {
  HERO_COPY_WIDTHS,
  HERO_IMAGE_SIZES,
  HERO_IMAGE_WIDTHS,
  heroImageSources,
  widthSrcSet,
} from '../src/lib/responsiveImages';
import { renderWithProviders } from '../src/test/renderWithProviders';

const publicPath = (url: string) => path.join(process.cwd(), 'public', url);

const parseSrcSet = (srcSet: string | null) => (srcSet ?? '').split(', ').map((candidate) => {
  const [url, width] = candidate.split(' ');
  return { url, width: Number(width.replace(/w$/, '')) };
});

describe('widthSrcSet', () => {
  it('lists each copy by width and ends with the original', () => {
    expect(widthSrcSet('/img/a/shot.webp', [960, 1440], 1920)).toBe(
      '/img/a/shot-960w.webp 960w, /img/a/shot-1440w.webp 1440w, /img/a/shot.webp 1920w',
    );
  });
});

describe('Opening hero image copies', () => {
  it.each(Object.entries(HERO_IMAGE_WIDTHS))('%s has its declared width and a copy at each narrower width', async (src, naturalWidth) => {
    expect((await sharp(publicPath(src)).metadata()).width).toBe(naturalWidth);

    const { srcSet, sizes } = heroImageSources(src);
    const candidates = parseSrcSet(srcSet ?? null);
    expect(candidates.map(({ width }) => width)).toEqual([...HERO_COPY_WIDTHS.filter((width) => width < naturalWidth), naturalWidth]);
    expect(candidates[candidates.length - 1].url).toBe(src);
    expect(sizes).toBe(HERO_IMAGE_SIZES);

    for (const { url, width } of candidates.slice(0, -1)) {
      expect((await sharp(publicPath(url)).metadata()).width).toBe(width);
    }
  });

  it('gives an image without copies neither srcset nor sizes', () => {
    expect(heroImageSources('/img/squares/king-512.webp')).toEqual({});
  });

  // A showcase page added later gets copies too, unless its hero is already small.
  it('covers every showcase page hero wider than the smallest copy', async () => {
    const pagesDir = path.join(process.cwd(), 'pages');
    const heroSources = fs.readdirSync(pagesDir)
      .map((file) => fs.readFileSync(path.join(pagesDir, file), 'utf8').match(/const HERO_IMAGE = \{ src: '([^']+)'/)?.[1])
      .filter((src): src is string => Boolean(src));
    expect(heroSources.length).toBeGreaterThan(5);

    for (const src of heroSources) {
      if (!HERO_IMAGE_WIDTHS[src]) {
        expect((await sharp(publicPath(src)).metadata()).width).toBeLessThanOrEqual(HERO_COPY_WIDTHS[0]);
      }
    }
  });
});

describe('Opening hero images', () => {
  it('serves the showcase hero from its copies', () => {
    const src = '/img/projects/timefraim/timefraim-planner.webp';
    renderWithProviders(
      <ProjectShowcase
        title='Static showcase'
        heroImage={{ src, alt: 'Static hero' }}
        roleBullets={['product engineering']}
        projectLink={{ href: 'https://example.com' }}
        sections={[]}
      />,
    );

    const hero = document.querySelector('[data-section-index="-1"] img');
    expect(hero).toHaveAttribute('src', src);
    expect(hero).toHaveAttribute('srcset', heroImageSources(src).srcSet);
    expect(hero).toHaveAttribute('sizes', HERO_IMAGE_SIZES);
  });

  it.each([
    ['DemoStoke', DemoStokeContent],
    ['Antisyphon', AntisyphonContent],
    ['Nice Guy University', NiceGuyUniversityContent],
  ] as const)('serves the %s introduction image from its copies', (_name, Content) => {
    renderWithProviders(<Content />);

    const intro = document.querySelector('[data-animate-id="section-intro"] img');
    const src = intro?.getAttribute('src') ?? '';
    expect(HERO_IMAGE_WIDTHS[src]).toBeDefined();
    expect(intro).toHaveAttribute('srcset', heroImageSources(src).srcSet);
    expect(intro).toHaveAttribute('sizes', HERO_IMAGE_SIZES);
  });
});
