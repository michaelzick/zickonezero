import { render } from '@testing-library/react';

import CityGapScene from '../src/components/home/CityGapScene';
import {
  KOI_JOINTS,
  KOI_WIDTH,
  LANTERN_COUNT,
} from '../src/lib/city/koi';
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

  it('renders the night carp and the day airship scene as decoration only', () => {
    const { container } = render(<CityGapScene />);
    const scene = container.firstElementChild as HTMLElement;

    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene.querySelector('.gap-night .koi')).toBeInTheDocument();
    expect(scene.querySelectorAll('.gap-night .koi-lantern')).toHaveLength(LANTERN_COUNT);
    expect(scene.querySelectorAll('.gap-night .koi-cord')).toHaveLength(2);
    expect(scene.querySelector('.gap-night .koi-roof svg')).toBeInTheDocument();
    expect(scene.querySelector('.gap-night .koi-midrise svg')).toBeInTheDocument();
    expect(scene.querySelector('.gap-night .koi-tower svg')).toBeInTheDocument();
    expect(scene.querySelector('.gap-day .ship')).toBeInTheDocument();
    expect(scene.querySelectorAll('.gap-day .cloud').length).toBeGreaterThanOrEqual(3);
    expect(scene.querySelectorAll('.gap-day .drone .drone-parcel').length).toBeGreaterThanOrEqual(3);
    expect(scene.querySelector('.gap-day .roofs svg')).toBeInTheDocument();
    expect(scene.querySelector('.gap-day .roofs .gondola')).toBeInTheDocument();
    expect(scene.querySelectorAll('.gap-day .roofs .gondola-cable')).toHaveLength(2);
    expect(scene.querySelectorAll(FOCUSABLE)).toHaveLength(0);
    scene.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  it('hangs the lanterns on the string below the carp, behind it, with nothing written on them', () => {
    const { container } = render(<CityGapScene />);
    const koi = container.querySelector('.koi') as HTMLElement;
    const lanterns = koi.querySelector('.koi-lanterns') as HTMLElement;
    const fish = koi.querySelector('.koi-fish') as HTMLElement;

    // Drawn before the carp, so the carp flies in front of the string.
    expect(lanterns.compareDocumentPosition(fish) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(lanterns.textContent).toBe('');

    const lit = [...lanterns.querySelectorAll('.koi-lantern')];
    lit.forEach((lantern, index) => {
      expect(lantern.querySelector('.koi-lantern-glow')).not.toBeNull();
      expect(lantern.querySelector('use')).toHaveAttribute('href', '#gap-koi-lantern-art');
      if (index > 0) {
        const before = parseFloat((lit[index - 1] as HTMLElement).style.getPropertyValue('--lx'));
        expect(parseFloat((lantern as HTMLElement).style.getPropertyValue('--lx'))).toBeGreaterThan(before);
      }
    });
    expect(koi.querySelector('#gap-koi-lantern-art text')).toBeNull();
  });

  it('flies two police drones, one each way, behind the carp, with a red and a blue light each', () => {
    const { container } = render(<CityGapScene />);
    const night = container.querySelector('.gap-night') as HTMLElement;
    const drones = [...night.querySelectorAll('.police-drone')];

    expect(drones.map((drone) => drone.getAttribute('data-heading')).sort()).toEqual(['east', 'west']);
    drones.forEach((drone) => {
      expect(drone.querySelectorAll('.police-siren.is-red')).toHaveLength(1);
      expect(drone.querySelectorAll('.police-siren.is-blue')).toHaveLength(1);
      expect(drone.querySelector('.police-beam')).not.toBeNull();
      expect(drone.textContent).toBe('');
      // Behind the carp and its rig, which come later in the scene.
      expect(drone.compareDocumentPosition(night.querySelector('.koi') as Element) & Node.DOCUMENT_POSITION_FOLLOWING)
        .toBeTruthy();
    });
  });

  it('writes every word on the carp or the airship, with nothing floating', () => {
    const { container } = render(<CityGapScene />);
    const koi = container.querySelector('.koi') as HTMLElement;

    const crest = [...koi.querySelectorAll('text')].find((text) => text.textContent === '夢');
    expect(crest).toHaveAttribute('lang', 'ja');
    expect(koi).toHaveTextContent('I dream of the feature');

    // The carp carries the only lettering at night; nothing says ZICKONEZERO CREATIVE.
    const lettering = [...koi.querySelectorAll('text')].map((text) => text.textContent);
    expect(lettering).toEqual(['I dream of the feature', '夢']);
    expect(container.querySelector('.gap-night')).not.toHaveTextContent(/ZICKONEZERO|CREATIVE/i);

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

  it('chains the carp into links that each bend from the one before, at the top of the mast', () => {
    const { container } = render(<CityGapScene />);

    expect(container.querySelectorAll('.koi-chain')).toHaveLength(1);
    const links = [...container.querySelectorAll('.koi-fish .koi-link')];
    expect(links).toHaveLength(KOI_JOINTS.length);
    links.slice(1).forEach((link, index) => {
      expect(link.parentElement).toBe(links[index]);
    });

    // Each link's window starts at its joint and runs past the next one.
    links.forEach((link, index) => {
      const [from, , width] = (link.querySelector(':scope > svg')?.getAttribute('viewBox') ?? '')
        .split(' ')
        .map(Number);
      expect(from).toBe(KOI_JOINTS[index]);
      if (index < KOI_JOINTS.length - 1) {
        expect(from + width).toBeGreaterThan(KOI_JOINTS[index + 1]);
      } else {
        expect(from + width).toBe(KOI_WIDTH);
      }
    });

    // Every link and lantern shows a drawing defined once in the scene.
    const uses = container.querySelectorAll('use');
    expect(uses).toHaveLength(KOI_JOINTS.length + LANTERN_COUNT);
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
