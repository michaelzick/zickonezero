import { act, render } from '@testing-library/react';
import { useRef } from 'react';

import useScrollProgress from '../src/hooks/useScrollProgress';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

// The scene starts 100px down the page and is 2,768px tall, so with a 768px
// viewport its scroll track is 2,000px long.
const SCENE_TOP = 100;
const SCENE_HEIGHT = 2768;

const Scene = ({ pastAt }: { pastAt?: number }) => {
  const ref = useRef<HTMLElement>(null);
  useScrollProgress(ref, { pastAt });
  return <section ref={ref} data-testid='scene' />;
};

const setScroll = async (y: number) => {
  window.scrollY = y;
  await act(async () => {
    window.dispatchEvent(new Event('scroll'));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
};

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 768 });
    jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(SCENE_HEIGHT);
    // The rect is relative to the viewport, so it moves up as the page scrolls.
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      top: SCENE_TOP - window.scrollY,
    } as DOMRect));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restoreMatchMedia();
  });

  it('writes how far the scene has been scrolled through, clamped from 0 to 1', async () => {
    const { getByTestId } = render(<Scene pastAt={0.34} />);
    const scene = getByTestId('scene');

    expect(scene.style.getPropertyValue('--p')).toBe('0.0000');
    expect(scene).not.toHaveAttribute('data-scrolled-past');

    await setScroll(600);
    expect(scene.style.getPropertyValue('--p')).toBe('0.2500');
    expect(scene).not.toHaveAttribute('data-scrolled-past');

    await setScroll(1100);
    expect(scene.style.getPropertyValue('--p')).toBe('0.5000');
    expect(scene).toHaveAttribute('data-scrolled-past');

    await setScroll(9000);
    expect(scene.style.getPropertyValue('--p')).toBe('1.0000');

    await setScroll(0);
    expect(scene.style.getPropertyValue('--p')).toBe('0.0000');
    expect(scene).not.toHaveAttribute('data-scrolled-past');
  });

  it('measures from where the scene sits when it mounts mid-page', async () => {
    window.scrollY = 1100;

    const { getByTestId } = render(<Scene />);

    expect(getByTestId('scene').style.getPropertyValue('--p')).toBe('0.5000');
  });

  it('leaves the scene still under reduced motion', async () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const { getByTestId } = render(<Scene pastAt={0.34} />);

    await setScroll(1100);

    expect(getByTestId('scene').style.getPropertyValue('--p')).toBe('');
    expect(getByTestId('scene')).not.toHaveAttribute('data-scrolled-past');
  });

  it('cleans up after itself', async () => {
    const { getByTestId, unmount } = render(<Scene pastAt={0.34} />);
    const scene = getByTestId('scene');
    await setScroll(1100);

    unmount();

    expect(scene.style.getPropertyValue('--p')).toBe('');
    expect(scene).not.toHaveAttribute('data-scrolled-past');
  });
});
