import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type RefObject } from 'react';

import HomeHud, { formatDistance, type HudDistrict } from '../src/components/home/HomeHud';
import {
  MINIMAP_HEIGHT,
  MINIMAP_ROUTE,
  MINIMAP_STOPS,
  MINIMAP_WIDTH,
  buildMinimapBlocks,
  locateOnRoute,
  routePath,
  type MapPoint,
} from '../src/lib/city/minimap';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';
import { renderWithProviders } from '../src/test/renderWithProviders';

const DISTRICTS: readonly HudDistrict[] = [
  { section: 'case-studies', label: 'Case Studies', title: 'Case Studies', tone: 'case' },
  { section: 'ux', label: 'Product Engineering', title: 'Product Engineering', tone: 'product' },
  { section: 'ui', label: 'Web Dev', title: 'Web Development', tone: 'web' },
];

// The start, the three districts, and the end of the route, a thousand pixels apart.
const STOPS = [0, 1000, 2000, 3000, 4000];

type Rect = { x: number; y: number; width: number; height: number };

const parseRects = (path: string): Rect[] => (
  Array.from(path.matchAll(/M(\d+) (\d+)h(\d+)v(\d+)h-\d+z/g), ([, x, y, width, height]) => ({
    x: Number(x),
    y: Number(y),
    width: Number(width),
    height: Number(height),
  }))
);

const isInside = ({ x, y }: MapPoint, rect: Rect) => (
  x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height
);

/** Every whole-pixel point along the route's streets. */
const walkRoute = (): MapPoint[] => MINIMAP_ROUTE.slice(1).flatMap((to, index) => {
  const from = MINIMAP_ROUTE[index];
  const steps = Math.max(Math.abs(to.x - from.x), Math.abs(to.y - from.y));
  return Array.from({ length: steps + 1 }, (_, step) => ({
    x: from.x + ((to.x - from.x) * step) / steps,
    y: from.y + ((to.y - from.y) * step) / steps,
  }));
});

const isOnRoute = (point: MapPoint) => MINIMAP_ROUTE.slice(1).some((to, index) => {
  const from = MINIMAP_ROUTE[index];
  const within = (value: number, a: number, b: number) => value >= Math.min(a, b) - 1e-6 && value <= Math.max(a, b) + 1e-6;
  return within(point.x, from.x, to.x) && within(point.y, from.y, to.y);
});

describe('minimap geometry', () => {
  it('draws the route as one path through every vertex', () => {
    const path = routePath();

    expect(path.startsWith(`M${MINIMAP_ROUTE[0].x} ${MINIMAP_ROUTE[0].y}`)).toBe(true);
    expect(path.match(/L/g)).toHaveLength(MINIMAP_ROUTE.length - 1);
  });

  it('builds the same blocks every time, inside the map', () => {
    const art = buildMinimapBlocks();
    const rects = [...parseRects(art.blocks), ...parseRects(art.parks)];

    expect(buildMinimapBlocks()).toEqual(art);
    expect(parseRects(art.parks)).toHaveLength(4);
    rects.forEach((rect) => {
      expect(rect.x).toBeGreaterThanOrEqual(0);
      expect(rect.y).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width).toBeLessThanOrEqual(MINIMAP_WIDTH);
      expect(rect.y + rect.height).toBeLessThanOrEqual(MINIMAP_HEIGHT);
    });
  });

  it('keeps the route on the streets, never through a building or park', () => {
    const art = buildMinimapBlocks();
    const rects = [...parseRects(art.blocks), ...parseRects(art.parks)];

    walkRoute().forEach((point) => {
      expect(rects.filter((rect) => isInside(point, rect))).toEqual([]);
    });
  });

  it('runs down the map the way the page scrolls, Case Studies first', () => {
    const stopYs = MINIMAP_STOPS.map((vertex) => MINIMAP_ROUTE[vertex].y);

    stopYs.slice(1).forEach((y, index) => {
      expect(y).toBeGreaterThan(stopYs[index]);
    });
  });

  it('puts the player on each stop as the page reaches it', () => {
    STOPS.forEach((scroll, index) => {
      const fix = locateOnRoute(scroll, STOPS);
      const stop = MINIMAP_ROUTE[MINIMAP_STOPS[index]];

      expect(fix.x).toBeCloseTo(stop.x);
      expect(fix.y).toBeCloseTo(stop.y);
    });
  });

  it('starts at the alley and ends at the street level, whatever the scroll', () => {
    const start = locateOnRoute(-300, STOPS);
    const end = locateOnRoute(99999, STOPS);

    // The route leaves the start heading south, down the map.
    expect(start).toEqual({ ...MINIMAP_ROUTE[0], heading: 180, progress: 0 });
    expect(end).toMatchObject(MINIMAP_ROUTE[MINIMAP_ROUTE.length - 1]);
    expect(end.progress).toBe(1);
  });

  it('walks the streets steadily and faces the way it walks', () => {
    // Halfway to Product Engineering, the route runs east along a street.
    const east = locateOnRoute(1500, STOPS);
    expect(east.x).toBeCloseTo(52);
    expect(east.y).toBeCloseTo(52);
    expect(east.heading).toBeCloseTo(90);

    // Halfway to Web Development, it runs back west.
    const west = locateOnRoute(2500, STOPS);
    expect(west.x).toBeCloseTo(48);
    expect(west.y).toBeCloseTo(88);
    expect(west.heading).toBeCloseTo(-90);

    let previous = 0;
    for (let scroll = 0; scroll <= 4000; scroll += 25) {
      const fix = locateOnRoute(scroll, STOPS);
      expect(isOnRoute(fix)).toBe(true);
      expect(fix.progress).toBeGreaterThanOrEqual(previous);
      expect(fix.progress).toBeLessThanOrEqual(1);
      previous = fix.progress;
    }
  });

  it('skips to the end when the page is too short to reach the later stops', () => {
    const shortPage = [0, 1000, 1000, 1000, 1000];

    expect(locateOnRoute(999, shortPage).progress).toBeLessThan(0.2);
    expect(locateOnRoute(1000, shortPage)).toMatchObject({ ...MINIMAP_ROUTE[MINIMAP_ROUTE.length - 1], progress: 1 });
  });

  it.each([
    [0, '0 m'],
    [-200, '0 m'],
    [1000, '250 m'],
    [3984, '1.0 km'],
    [4000, '1.0 km'],
    [8000, '2.0 km'],
  ])('reads %p pixels as %p', (pixels, text) => {
    expect(formatDistance(pixels)).toBe(text);
  });
});

describe('HomeHud', () => {
  const setScroll = async (y: number) => {
    window.scrollY = y;
    await act(async () => {
      window.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  };

  const renderHud = ({
    active = null,
    parkRef = createRef<HTMLElement>(),
  }: { active?: HudDistrict['section'] | null; parkRef?: RefObject<HTMLElement | null> } = {}) => {
    const onTravel = jest.fn();
    const onReturnToSurface = jest.fn();
    const measureStops = () => STOPS;
    const view = renderWithProviders(
      <HomeHud
        districts={DISTRICTS}
        active={active}
        onTravel={onTravel}
        onReturnToSurface={onReturnToSurface}
        measureStops={measureStops}
        parkRef={parkRef}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Homepage sections' });
    const pins = () => within(within(nav).getByRole('list')).getAllByRole('button');
    const player = view.container.querySelector<HTMLElement>('.hud-player')!;
    const rerender = (nextActive: HudDistrict['section'] | null) => view.rerender(
      <HomeHud
        districts={DISTRICTS}
        active={nextActive}
        onTravel={onTravel}
        onReturnToSurface={onReturnToSurface}
        measureStops={measureStops}
        parkRef={parkRef}
      />,
    );

    return { ...view, nav, pins, player, onTravel, onReturnToSurface, rerender };
  };

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 768 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    restoreMatchMedia();
    delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
  });

  it('is a nav of district pins over a decorative map', () => {
    const { pins, container } = renderHud();

    const districtPins = pins();
    expect(districtPins.map((pin) => pin.textContent)).toEqual(['Case Studies', 'Product Engineering', 'Web Dev']);
    districtPins.forEach((pin) => expect(pin).not.toHaveAttribute('aria-current'));

    // Each pin sits on its district's stop, top to bottom in route order.
    expect(districtPins[0].style.getPropertyValue('--pin-x')).toBe(`${MINIMAP_ROUTE[MINIMAP_STOPS[1]].x}px`);
    expect(districtPins[0].style.getPropertyValue('--pin-y')).toBe(`${MINIMAP_ROUTE[MINIMAP_STOPS[1]].y}px`);
    const pinYs = districtPins.map((pin) => parseFloat(pin.style.getPropertyValue('--pin-y')));
    expect(pinYs).toEqual([...pinYs].sort((a, b) => a - b));
    expect(new Set(pinYs).size).toBe(pinYs.length);

    expect(container.querySelector('.hud-map-art')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.hud-clock')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(container.querySelector('.quest-label')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.quest-distance')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.hud-readouts')).toHaveTextContent('Head to Case Studies');
  });

  it('heads to Case Studies from the quest objective', async () => {
    const user = userEvent.setup();
    const animate = jest.fn();
    HTMLElement.prototype.animate = animate;
    const { nav, onTravel } = renderHud();

    await user.click(within(nav).getByRole('button', { name: 'Head to Case Studies' }));

    expect(onTravel).toHaveBeenCalledWith('case-studies', 'Case Studies');
    expect(animate).toHaveBeenCalledTimes(1);
  });

  it('heads to Web Development after Product Engineering', async () => {
    const user = userEvent.setup();
    const { nav, onTravel } = renderHud({ active: 'ux' });

    await user.click(within(nav).getByRole('button', { name: 'Head to Web Development' }));

    expect(onTravel).toHaveBeenCalledWith('ui', 'Web Dev');
  });

  it('advances the objective through the route and resets it when returning', async () => {
    const user = userEvent.setup();
    const { nav, rerender, onTravel, onReturnToSurface } = renderHud({ active: 'case-studies' });

    await user.click(within(nav).getByRole('button', { name: 'Head to Product Engineering' }));
    expect(onTravel).toHaveBeenLastCalledWith('ux', 'Product Engineering');

    rerender('ux');
    await user.click(within(nav).getByRole('button', { name: 'Head to Web Development' }));
    expect(onTravel).toHaveBeenLastCalledWith('ui', 'Web Dev');

    rerender('ui');
    await user.click(within(nav).getByRole('button', { name: 'Return to surface' }));
    expect(onReturnToSurface).toHaveBeenCalledTimes(1);
    expect(onTravel).toHaveBeenCalledTimes(2);

    rerender(null);
    expect(within(nav).getByRole('button', { name: 'Head to Case Studies' })).toBeInTheDocument();
  });

  it('fast travels from a pin', async () => {
    const user = userEvent.setup();
    const animate = jest.fn();
    HTMLElement.prototype.animate = animate;
    const { nav, onTravel } = renderHud();

    await user.click(within(nav).getByRole('button', { name: 'Product Engineering' }));

    expect(onTravel).toHaveBeenCalledWith('ux', 'Product Engineering');
    expect(animate).toHaveBeenCalledTimes(1);
    expect(animate).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ duration: 420 }));
  });

  it('travels without the map glitch under reduced motion', async () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const user = userEvent.setup();
    const animate = jest.fn();
    HTMLElement.prototype.animate = animate;
    const { nav, onTravel } = renderHud();

    await user.click(within(nav).getByRole('button', { name: 'Web Dev' }));

    expect(onTravel).toHaveBeenCalledWith('ui', 'Web Dev');
    expect(animate).not.toHaveBeenCalled();
  });

  it('marks the current district and the ones already visited', async () => {
    const { pins, container, rerender } = renderHud({ active: 'ux' });

    const [caseStudies, product, web] = pins();
    expect(product).toHaveAttribute('aria-current', 'true');
    expect(caseStudies).not.toHaveAttribute('aria-current');
    expect(caseStudies).toHaveAttribute('data-state', 'visited');
    expect(web).not.toHaveAttribute('data-state');
    expect(container.querySelector('.map-district.tone-product')).toHaveAttribute('data-active', '');

    await waitFor(() => {
      expect(container.querySelector('.quest-objective')).toHaveTextContent('Head to Web Development');
    });

    rerender('ui');

    expect(web).toHaveAttribute('aria-current', 'true');
    expect(product).toHaveAttribute('data-state', 'visited');
    await waitFor(() => {
      expect(container.querySelector('.quest-objective')).toHaveTextContent('Return to surface');
    });
  });

  it('walks the player and the distance readout with the scroll', async () => {
    const { nav, pins, player, container } = renderHud();

    expect(player.style.transform).toBe('translate3d(36.0px, 8.0px, 0)');
    expect(nav.style.getPropertyValue('--hud-progress')).toBe('0.0000');
    expect(container.querySelector('.quest-distance')).toHaveTextContent('1.0 km');
    expect(nav).toHaveAttribute('data-hero', '');

    await setScroll(4000);

    expect(player.style.transform).toBe('translate3d(120.0px, 136.0px, 0)');
    expect(nav.style.getPropertyValue('--hud-progress')).toBe('1.0000');
    expect(container.querySelector('.quest-distance')).toHaveTextContent('0 m');
    expect(nav).not.toHaveAttribute('data-hero');

    // At the end of the route every district counts as visited, and the
    // objective still points into the city.
    pins().forEach((pin) => expect(pin).toHaveAttribute('data-state', 'visited'));
    expect(container.querySelector('.quest-objective')).toHaveTextContent('Head to Case Studies');
  });

  it('faces down the route from the first frame, without spinning round', () => {
    const { player } = renderHud();

    expect(player.style.getPropertyValue('--heading')).toBe('180deg');
  });

  it('turns the player around when the visitor scrolls back up', async () => {
    const { player } = renderHud();
    // Facing, in whole degrees from north, whichever way the turns unwrapped.
    const facing = () => ((parseFloat(player.style.getPropertyValue('--heading')) % 360) + 360) % 360;

    await setScroll(1000);
    expect(facing()).toBe(180);

    for (const y of [980, 960, 940]) {
      await setScroll(y);
    }

    expect(facing()).toBe(0);
  });

  it('tucks away while the footer is on screen', () => {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);
    const parkRef = { current: footer };

    const { nav } = renderHud({ parkRef });

    expect(nav).toHaveAttribute('data-parked', '');
    footer.remove();
  });

  it('comes back for keyboard focus and tucks away again on blur', async () => {
    const user = userEvent.setup();
    const { nav } = renderHud();

    await user.tab();
    expect(within(nav).getByRole('button', { name: 'Case Studies' })).toHaveFocus();
    expect(nav).toHaveAttribute('data-focus', '');

    await user.tab();
    expect(nav).toHaveAttribute('data-focus', '');

    act(() => {
      (document.activeElement as HTMLElement).blur();
    });
    expect(nav).not.toHaveAttribute('data-focus');
  });
});
