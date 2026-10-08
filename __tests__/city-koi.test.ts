import {
  JOINT_CLEARANCE,
  KOI_HEIGHT,
  KOI_JOINTS,
  KOI_SWINGS,
  KOI_WIDTH,
  NOTCH_OVERLAP,
  STREAMER_COLORS,
  STREAMER_HEIGHT,
  STREAMER_JOINTS,
  STREAMER_SWINGS,
  STREAMER_WIDTH,
  chainWindows,
  koiBack,
  koiBelly,
  koiRim,
  koiScaleColumns,
  koiScales,
  koiSilhouette,
  koiTailFin,
  streamerRibbon,
} from '../src/lib/city/koi';

// The largest --sag in styles/cityGap.ts, which adds to each link's swing.
const MAX_SAG = 2;

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

describe('carp streamer geometry', () => {
  it.each([
    ['carp', KOI_JOINTS, KOI_SWINGS, KOI_WIDTH, KOI_HEIGHT],
    ['five-color streamer', STREAMER_JOINTS, STREAMER_SWINGS, STREAMER_WIDTH, STREAMER_HEIGHT],
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

  it('draws the carp and the ribbons inside their drawings, rounded for hydration', () => {
    const carp = [koiSilhouette(), koiTailFin(), koiBack(), koiBelly(), koiRim(), koiScales()];
    const ribbons = STREAMER_COLORS.map((_, index) => streamerRibbon(index));

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

    ribbons.forEach((path) => {
      coordinates(path).forEach(([x, y]) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(STREAMER_WIDTH);
        expect(y).toBeGreaterThan(0);
        expect(y).toBeLessThan(STREAMER_HEIGHT);
      });
    });
  });
});
