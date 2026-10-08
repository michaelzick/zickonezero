import {
  BANNER_BOTTOM,
  BANNER_HEIGHT,
  BANNER_HOIST,
  BANNER_JOINTS,
  BANNER_LETTERING,
  BANNER_SWINGS,
  BANNER_TOP,
  BANNER_WIDTH,
  JOINT_CLEARANCE,
  KOI_HEIGHT,
  KOI_JOINTS,
  KOI_SWINGS,
  KOI_WIDTH,
  NOTCH_OVERLAP,
  bannerField,
  bannerHems,
  chainWindows,
  koiBack,
  koiBelly,
  koiRim,
  koiScaleColumns,
  koiScales,
  koiSilhouette,
  koiTailFin,
} from '../src/lib/city/koi';

// The largest --sag in styles/cityGap.ts, which adds to each link's swing.
const MAX_SAG = 2;

// Orbitron's capitals stand 0.72em tall.
const CAP_HEIGHT = 0.72;

// The points of an absolute path (M, L, H, V, C, A, Z), control points included.
const coordinates = (path: string): [number, number][] => {
  const tokens = path.match(/[MLHVCAZ]|-?\d+(?:\.\d+)?/g) ?? [];
  const points: [number, number][] = [];
  let command = '';
  let x = 0;
  let y = 0;
  let index = 0;
  const take = (count: number) => {
    const values = tokens.slice(index, index + count).map(Number);
    index += count;
    return values;
  };
  while (index < tokens.length) {
    if (/[A-Z]/.test(tokens[index])) {
      command = tokens[index];
      index += 1;
      if (command === 'Z') {
        continue;
      }
    }
    if (command === 'H') {
      [x] = take(1);
    } else if (command === 'V') {
      [y] = take(1);
    } else if (command === 'A') {
      [x, y] = take(7).slice(5);
    } else if (command === 'C') {
      const [x1, y1, x2, y2, endX, endY] = take(6);
      points.push([x1, y1], [x2, y2]);
      [x, y] = [endX, endY];
    } else {
      [x, y] = take(2);
    }
    points.push([x, y]);
  }
  return points;
};

describe('carp streamer and banner geometry', () => {
  it.each([
    ['carp', KOI_JOINTS, KOI_SWINGS, KOI_WIDTH, KOI_HEIGHT],
    ['banner', BANNER_JOINTS, BANNER_SWINGS, BANNER_WIDTH, BANNER_HEIGHT],
  ])('gives each %s link a window that fills the wedge its next joint opens', (_, joints, swings, width, height) => {
    const windows = chainWindows(joints, swings, width, height);

    expect(windows).toHaveLength(joints.length);
    expect(windows[0].from).toBe(0);
    windows.slice(0, -1).forEach((view, index) => {
      expect(view.next).toBe(windows[index + 1].from);
      expect(view.notch).toBe(view.next + NOTCH_OVERLAP);
      // At its top and bottom edges, the window covers the next link's sharpest bend.
      const bend = ((swings[index + 1] + MAX_SAG) * Math.PI) / 180;
      expect(view.to - view.notch).toBeGreaterThan((height / 2) * Math.sin(bend));
    });
    expect(windows[windows.length - 1]).toEqual({
      from: joints[joints.length - 1],
      next: width,
      notch: width,
      to: width,
    });
  });

  it('keeps the scales and the tail fin clear of every joint', () => {
    const joints = KOI_JOINTS.slice(1);

    koiScaleColumns().forEach(({ x, depth }) => {
      joints.forEach((joint) => {
        expect(joint <= x - JOINT_CLEARANCE || joint >= x + depth + JOINT_CLEARANCE).toBe(true);
      });
    });

    // The fin starts past the last link's notch, so only the tail link draws it.
    const finX = coordinates(koiTailFin()).map(([x]) => x);
    expect(Math.min(...finX)).toBeGreaterThan(KOI_JOINTS[KOI_JOINTS.length - 1] + NOTCH_OVERLAP);
  });

  it('spells ZICKONEZERO CREATIVE across the banner with ONE set apart', () => {
    expect(BANNER_LETTERING.map(({ text }) => text)).toEqual(['ZICK', 'ONE', 'ZERO', 'CREATIVE']);
    expect(BANNER_LETTERING.filter(({ tone }) => tone === 'one').map(({ text }) => text)).toEqual(['ONE']);

    // In reading order, each chunk inside the field and ahead of the fluttering tail links.
    BANNER_LETTERING.forEach(({ x, width, y, size }, index) => {
      expect(x).toBeGreaterThan(BANNER_HOIST);
      expect(x + width).toBeLessThan(BANNER_JOINTS[2]);
      expect(y - size * CAP_HEIGHT).toBeGreaterThan(BANNER_TOP);
      expect(y).toBeLessThan(BANNER_BOTTOM);
      if (index > 0) {
        const before = BANNER_LETTERING[index - 1];
        expect(x).toBeGreaterThanOrEqual(before.x + before.width);
      }
    });

    // The wordmark's chunks meet, so it reads as one word.
    const [zick, one, zero] = BANNER_LETTERING;
    expect(one.x).toBe(zick.x + zick.width);
    expect(zero.x).toBe(one.x + one.width);

    // CREATIVE is smaller, centered on the wordmark's capitals.
    const creative = BANNER_LETTERING[3];
    expect(creative.size).toBeLessThan(zick.size);
    expect(creative.y - (creative.size * CAP_HEIGHT) / 2).toBeCloseTo(zick.y - (zick.size * CAP_HEIGHT) / 2, 0);
  });

  it('keeps every banner joint clear of the lettering, so no letter kinks', () => {
    BANNER_JOINTS.slice(1).forEach((joint) => {
      BANNER_LETTERING.forEach(({ x, width }) => {
        expect(joint <= x - JOINT_CLEARANCE || joint >= x + width + JOINT_CLEARANCE).toBe(true);
      });
    });
  });

  it('draws the carp and the banner inside their drawings, rounded for hydration', () => {
    const carp = [koiSilhouette(), koiTailFin(), koiBack(), koiBelly(), koiRim(), koiScales()];
    const banner = [bannerField(), bannerHems()];

    carp.forEach((path) => {
      expect(path).not.toBe('');
      expect(path).not.toMatch(/\d\.\d{2,}/);
      coordinates(path).forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(KOI_WIDTH);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(KOI_HEIGHT);
      });
    });

    banner.forEach((path) => {
      expect(path).not.toMatch(/\d\.\d{2,}/);
      coordinates(path).forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(BANNER_WIDTH);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(BANNER_HEIGHT);
      });
    });
  });
});
