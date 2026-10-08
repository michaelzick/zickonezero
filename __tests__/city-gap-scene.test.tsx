import { render } from '@testing-library/react';

import CityGapScene from '../src/components/home/CityGapScene';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const FOCUSABLE = 'a, button, input, select, textarea, [tabindex]';

describe('end-of-route city scene', () => {
  afterEach(() => {
    restoreMatchMedia();
  });

  it('renders the night hologram and the day airship as decoration only', () => {
    const { container } = render(<CityGapScene />);
    const scene = container.firstElementChild as HTMLElement;

    expect(scene).toHaveAttribute('aria-hidden', 'true');
    expect(scene.querySelector('.gap-night .holo')).toBeInTheDocument();
    expect(scene.querySelector('.gap-day .ship')).toBeInTheDocument();
    expect(scene.querySelectorAll(FOCUSABLE)).toHaveLength(0);
    scene.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('focusable', 'false');
    });
  });

  it('marks its Japanese text and carries the new line on both pieces', () => {
    const { container } = render(<CityGapScene />);

    expect(container.querySelector('.holo-kana')).toHaveAttribute('lang', 'ja');
    expect(container.querySelector('.holo-caption')).toHaveTextContent('I dream of the feature');
    expect(container.querySelector('.ship-ticker')).toHaveTextContent('I dream of the feature');
    expect(container.querySelector('.ship-ticker .brand-one')).toHaveTextContent('ONE');
  });

  it('manages its ambient motion and holds a still frame under reduced motion', () => {
    const { container, unmount } = render(<CityGapScene />);
    expect(container.firstElementChild).toHaveAttribute('data-scene-motion');
    unmount();

    mockMatchMedia(REDUCED_MOTION_QUERY);
    const still = render(<CityGapScene />);
    const scene = still.container.firstElementChild as HTMLElement;

    expect(scene).toHaveAttribute('data-scene-motion', 'still');
    expect(scene.style.getPropertyValue('--p')).toBe('');
  });
});
