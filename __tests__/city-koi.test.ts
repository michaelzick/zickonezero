import {
  JOINT_CLEARANCE,
  KOI_HEIGHT,
  KOI_JOINTS,
  KOI_SWINGS,
  KOI_WIDTH,
  LANTERN_CORDS,
  LANTERN_COUNT,
  NOTCH_OVERLAP,
  chainWindows,
  cordDepth,
  cordDrop,
  koiBack,
  koiBelly,
  koiRim,
  koiScaleColumns,
  koiScales,
  koiSilhouette,
  koiTailFin,
  lanternCord,
  lanternString,
} from '../src/lib/city/koi';

// The largest --sag in styles/cityGap.ts, which adds to each link's swing.
const MAX_SAG = 2;

// The points of an absolute path (M, L, H, V, C, Q, A, Z), control points included.
const coordinates = (path: string): [number, number][] => {
  const tokens = path.match(/[MLHVCQAZ]|-?\d+(?:\.\d+)?/g) ?? [];
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
    } else if (command === 'Q') {
      const [x1, y1, endX, endY] = take(4);
      points.push([x1, y1]);
      [x, y] = [endX, endY];
    } else {
      [x, y] = take(2);
    }
    points.push([x, y]);
  }
  return points;
};

describe('carp streamer and lantern geometry', () => {
  it('gives each carp link a window that fills the wedge its next joint opens', () => {
    const windows = chainWindows(KOI_JOINTS, KOI_SWINGS, KOI_WIDTH, KOI_HEIGHT);

    expect(windows).toHaveLength(KOI_JOINTS.length);
    expect(windows[0].from).toBe(0);
    windows.slice(0, -1).forEach((view, index) => {
      expect(view.next).toBe(windows[index + 1].from);
      expect(view.notch).toBe(view.next + NOTCH_OVERLAP);
      // At its top and bottom edges, the window covers the next link's sharpest bend.
      const bend = ((KOI_SWINGS[index + 1] + MAX_SAG) * Math.PI) / 180;
      expect(view.to - view.notch).toBeGreaterThan((KOI_HEIGHT / 2) * Math.sin(bend));
    });
    expect(windows[windows.length - 1]).toEqual({
      from: KOI_JOINTS[KOI_JOINTS.length - 1],
      next: KOI_WIDTH,
      notch: KOI_WIDTH,
      to: KOI_WIDTH,
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

  it('draws the carp inside its drawing, rounded for hydration', () => {
    const carp = [koiSilhouette(), koiTailFin(), koiBack(), koiBelly(), koiRim(), koiScales()];

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

  });

  it.each(Object.entries(LANTERN_CORDS))('fits the %s lantern cord to its box, from the mast end to the post end', (_, shape) => {
    const { viewBox, path } = lanternCord(shape);
    const [, , width, depth] = viewBox.split(' ').map(Number);

    expect(width).toBe(100);
    expect(depth).toBe(cordDepth(shape));
    expect(depth).toBeGreaterThanOrEqual(shape.fall);
    expect(path).not.toMatch(/\d\.\d{2,}/);

    const points = coordinates(path);
    expect(points[0]).toEqual([0, 0]);
    expect(points[points.length - 1]).toEqual([100, shape.fall]);

    // The curve the path draws, sampled: it matches cordDrop and never leaves the box.
    const [, [, control]] = points;
    for (let t = 0; t <= 1; t += 0.05) {
      const y = 2 * t * (1 - t) * control + t * t * shape.fall;
      expect(y).toBeCloseTo(cordDrop(shape, t), 6);
      expect(y).toBeLessThanOrEqual(depth + 0.05);
    }
    // It sags below the straight line between its ends.
    expect(cordDrop(shape, 0.5)).toBeCloseTo(shape.fall / 2 + shape.sag, 6);
  });

  it('hangs the lanterns evenly along the cord, clear of both ends', () => {
    const lanterns = lanternString();

    expect(lanterns).toHaveLength(LANTERN_COUNT);
    lanterns.forEach(({ x, wide, tall }, index) => {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(100);
      expect(x).toBeCloseTo(((index + 1) * 100) / (LANTERN_COUNT + 1), 1);
      // On the cord in each shape, inside its box.
      expect(wide).toBeCloseTo(cordDrop(LANTERN_CORDS.wide, x / 100), 1);
      expect(tall).toBeCloseTo(cordDrop(LANTERN_CORDS.tall, x / 100), 1);
      expect(wide).toBeLessThanOrEqual(cordDepth(LANTERN_CORDS.wide));
      expect(tall).toBeLessThanOrEqual(cordDepth(LANTERN_CORDS.tall));
      [x, wide, tall].forEach((value) => {
        expect(String(value)).not.toMatch(/\.\d{2,}/);
      });
    });

    // The wide cord falls toward the tower, so each lantern hangs lower than the
    // one before until the last; the level one is symmetric.
    lanterns.slice(1).forEach(({ wide }, index) => {
      expect(wide).toBeGreaterThan(lanterns[index].wide);
    });
    lanterns.forEach(({ tall }, index) => {
      expect(tall).toBeCloseTo(lanterns[LANTERN_COUNT - 1 - index].tall, 1);
    });
  });
});
