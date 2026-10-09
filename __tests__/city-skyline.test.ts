import { createRandom, mulberry32 } from '../src/lib/city/prng';
import { generateSkyline, MAX_FLICKER_WINDOWS, SkylineOptions } from '../src/lib/city/skyline';

const OPTIONS: SkylineOptions = {
  seed: 1337,
  width: 1200,
  height: 420,
  minBuildingWidth: 52,
  maxBuildingWidth: 128,
  minHeight: 0.22,
  maxHeight: 0.7,
  minGap: -10,
  maxGap: 14,
  floorHeight: 9,
  litRowChance: 0.36,
  coolShare: 0.3,
  flickerCount: 14,
  windowWidth: 3,
  windowHeight: 4,
  neonStrips: 7,
  billboards: 3,
  beacons: 2,
};

const numbersIn = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe('city prng', () => {
  it('repeats the same sequence for the same seed', () => {
    const first = mulberry32(42);
    const second = mulberry32(42);
    const a = Array.from({ length: 50 }, () => first());
    const b = Array.from({ length: 50 }, () => second());

    expect(a).toEqual(b);
    expect(a.every((value) => value >= 0 && value < 1)).toBe(true);
  });

  it('gives different seeds different sequences', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });

  it('keeps integers within their inclusive bounds', () => {
    const random = createRandom(7);
    const values = Array.from({ length: 500 }, () => random.int(3, 6));

    expect(Math.min(...values)).toBe(3);
    expect(Math.max(...values)).toBe(6);
    expect(values.every(Number.isInteger)).toBe(true);
  });

  it('refuses to pick from an empty list', () => {
    expect(() => createRandom(1).pick([])).toThrow();
  });
});

describe('generateSkyline', () => {
  it('draws the same city for the same seed, so static HTML matches hydration', () => {
    expect(generateSkyline(OPTIONS)).toEqual(generateSkyline(OPTIONS));
    expect(generateSkyline({ ...OPTIONS, seed: 9 }).silhouette).not.toBe(generateSkyline(OPTIONS).silhouette);
  });

  it('writes integer path coordinates only', () => {
    const layer = generateSkyline(OPTIONS);

    [layer.silhouette, layer.litWindows, layer.coolWindows].forEach((path) => {
      expect(path).not.toBe('');
      expect(numbersIn(path).every(Number.isInteger)).toBe(true);
    });
  });

  it('caps flickering windows and keeps them inside the layer', () => {
    const layer = generateSkyline({ ...OPTIONS, flickerCount: 100 });

    expect(layer.flicker).toHaveLength(MAX_FLICKER_WINDOWS);
    layer.flicker.forEach((spot) => {
      expect(spot.width).toBe(OPTIONS.windowWidth);
      expect(spot.height).toBe(OPTIONS.windowHeight);
      expect(spot.y).toBeGreaterThanOrEqual(0);
      expect(spot.y + spot.height).toBeLessThanOrEqual(OPTIONS.height);
    });
  });

  it('places signs and beacons on visible buildings', () => {
    const layer = generateSkyline(OPTIONS);

    expect(layer.strips).toHaveLength(OPTIONS.neonStrips);
    expect(layer.billboards).toHaveLength(OPTIONS.billboards);
    expect(layer.beacons).toHaveLength(OPTIONS.beacons);
    expect(new Set(layer.billboards.map((board) => board.x)).size).toBe(OPTIONS.billboards);

    [...layer.strips, ...layer.billboards].forEach((sign) => {
      expect(sign.x + sign.width).toBeGreaterThan(-OPTIONS.maxBuildingWidth);
      expect(sign.x).toBeLessThan(OPTIONS.width);
      expect(sign.y + sign.height).toBeLessThanOrEqual(OPTIONS.height);
    });

    layer.beacons.forEach((beacon) => {
      expect(beacon.y).toBeLessThan(OPTIONS.height);
    });
  });

  it('can draw a plain layer with no signs or flicker', () => {
    const layer = generateSkyline({ ...OPTIONS, flickerCount: 0, neonStrips: 0, billboards: 0, beacons: 0 });

    expect(layer.flicker).toEqual([]);
    expect(layer.strips).toEqual([]);
    expect(layer.billboards).toEqual([]);
    expect(layer.beacons).toEqual([]);
  });
});
