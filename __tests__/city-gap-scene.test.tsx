import { render } from '@testing-library/react';

import CityGapScene from '../src/components/home/CityGapScene';
import { KOI_JOINTS, STREAMER_JOINTS } from '../src/lib/city/koi';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]';

const ownText = (element: Element) => [...element.childNodes]
  .filter((node) => node.nodeType === Node.TEXT_NODE)
  .map((node) => node.textContent ?? '')
  .join('')
  .trim();

describe('end-of-route city scene', () => {
  afterEach(() => {
    restoreMatchMedia();
  });

  it('renders the night carp streamer and the day airship as decoration only', () => {
    const { container } = render(<CityGapScene />);
    const scene = container.firstElementChild as HTMLElement;

    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene.querySelector('.gap-night .koi')).toBeInTheDocument();
    expect(scene.querySelector('.gap-day .ship')).toBeInTheDocument();
    expect(scene.querySelectorAll(FOCUSABLE)).toHaveLength(0);
    scene.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  it('writes every word on the carp or the airship, with nothing floating', () => {
    const { container } = render(<CityGapScene />);
    const koi = container.querySelector('.koi') as HTMLElement;

    const crest = [...koi.querySelectorAll('text')].find((text) => text.textContent === '夢');
    expect(crest).toHaveAttribute('lang', 'ja');
    expect(koi).toHaveTextContent('I dream of the feature');

    // The airship keeps its emblem and marquee.
    expect(container.querySelector('.ship-emblem-glyph')).toHaveAttribute('lang', 'ja');
    expect(container.querySelector('.ship-ticker')).toHaveTextContent('I dream of the feature');
    expect(container.querySelector('.ship-ticker .brand-one')).toHaveTextContent('ONE');

    const worded = [...container.querySelectorAll('*')].filter((element) => ownText(element) !== '');
    expect(worded.length).toBeGreaterThan(0);
    worded.forEach((element) => {
      expect(element.closest('.koi, .ship')).not.toBeNull();
    });
  });

  it('chains each streamer into links that each bend from the one before', () => {
    const { container } = render(<CityGapScene />);

    [
      ['.koi-fish', KOI_JOINTS],
      ['.koi-streamer', STREAMER_JOINTS],
    ].forEach(([selector, joints]) => {
      const links = [...container.querySelectorAll(`${selector} .koi-link`)];
      expect(links).toHaveLength((joints as readonly number[]).length);
      links.slice(1).forEach((link, index) => {
        expect(link.parentElement).toBe(links[index]);
      });

      // Each link's window starts at its joint and runs past the next one.
      links.forEach((link, index) => {
        const [from, , width] = (link.querySelector(':scope > svg')?.getAttribute('viewBox') ?? '')
          .split(' ')
          .map(Number);
        const list = joints as readonly number[];
        expect(from).toBe(list[index]);
        if (index < list.length - 1) {
          expect(from + width).toBeGreaterThan(list[index + 1]);
        } else {
          expect(from + width).toBe(1000);
        }
      });
    });

    // Every link shows a drawing defined once in the scene.
    const uses = container.querySelectorAll('use');
    expect(uses).toHaveLength(KOI_JOINTS.length + STREAMER_JOINTS.length);
    uses.forEach((use) => {
      const id = use.getAttribute('href')?.replace(/^#/, '') ?? '';
      expect(container.querySelector(`[id="${id}"]`)).not.toBeNull();
    });
  });

  it('manages its ambient motion and holds a still frame under reduced motion', () => {
    const { container, unmount } = render(<CityGapScene />);
    expect(container.firstElementChild).toHaveAttribute('data-scene-motion');
    unmount();

    mockMatchMedia(REDUCED_MOTION_QUERY);
    const still = render(<CityGapScene />);

    expect(still.container.firstElementChild).toHaveAttribute('data-scene-motion', 'still');
  });
});
