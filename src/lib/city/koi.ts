/**
 * Geometry for the carp streamer at the end of the homepage route and the
 * lantern string below it (src/components/home/KoiStreamer.tsx).
 *
 * The carp is drawn once and shown through a chain of links. A link is a
 * window onto one stretch of the drawing and bends at its front joint, on the
 * centerline. Its window runs past the next joint in a notch: a little on the
 * centerline, where the next link pivots, and out toward the edges as far as
 * that link's sharpest bend opens a wedge there. So the overlap fills the
 * wedge with the same fabric, and its edge stays under the next link. Nothing
 * that would show a break crosses a joint: the scales sit in columns between
 * them, and the fins start clear of them. Coordinates are rounded, so the
 * static HTML and the hydrated page draw the same fish.
 */

type Point = readonly [number, number];

export type ChainWindow = {
  /** The link's joint, in drawing units. */
  from: number;
  /** The next joint, or the end of the drawing. */
  next: number;
  /** Where the window's notch points, on the centerline just past the next joint. */
  notch: number;
  /** Where the window ends at its top and bottom edges. */
  to: number;
};

/**
 * Degrees a link rests bent from the one before, at most (--sag in
 * styles/cityGap.ts), plus a little, added to its swing to size the notch.
 */
const REST_BEND = 2.5;

/**
 * How far a notch points past the next joint, so its clipped edge never meets
 * the next link's edge at the pivot, where the two would let the sky through.
 */
export const NOTCH_OVERLAP = 4;

/** Scales and fin stripes stay this far from a joint, clear of the bend. */
export const JOINT_CLEARANCE = 8;

export const KOI_WIDTH = 1000;
export const KOI_HEIGHT = 300;
const KOI_MID = KOI_HEIGHT / 2;

/**
 * The carp's joints, from the mouth at the mast: a stiff head that holds the
 * crest, body links that shorten toward the tail, then the tail fin.
 */
export const KOI_JOINTS = [0, 280, 370, 460, 548, 632, 712, 785, 850] as const;

/**
 * Degrees each link swings either way: the head rides the slow gusts, and
 * each link further back is looser.
 */
export const KOI_SWINGS = [2, 3, 3, 3, 3, 4, 4, 5, 7] as const;

// Half the carp's height along its length, from the mouth hoop to the root of
// the tail fin.
const KOI_HALF: readonly Point[] = [
  [22, 92], [50, 97.5], [100, 102.5], [160, 104.5], [220, 104.5], [280, 102.5], [360, 98],
  [440, 92], [520, 84], [600, 75], [680, 65], [760, 54], [820, 45], [850, 40.5], [870, 39],
];

const MOUTH_X = KOI_HALF[0][0];
const TAIL_ROOT_X = KOI_HALF[KOI_HALF.length - 1][0];

// The back and belly, as fractions of the half height from the centerline.
const BACK_LINE = 0.6;
const BELLY_LINE = 0.55;

// The sash along the centerline that carries the lettering, half its height.
export const SASH_HALF = 21;

const round = (value: number) => Math.round(value * 10) / 10;

const pointText = ([x, y]: Point) => `${round(x)} ${round(y)}`;

/** Each link's window onto a drawing width by height, given the chain's joints and swings. */
export const chainWindows = (
  joints: readonly number[],
  swings: readonly number[],
  width: number,
  height: number,
): ChainWindow[] =>
  joints.map((from, index) => {
    const next = joints[index + 1];
    if (next === undefined) {
      return { from, next: width, notch: width, to: width };
    }

    const bend = ((swings[index + 1] + REST_BEND) * Math.PI) / 180;
    const notch = next + NOTCH_OVERLAP;
    return { from, next, notch, to: round(notch + (height / 2) * Math.sin(bend)) };
  });

export const koiHalfHeight = (x: number): number => {
  if (x <= KOI_HALF[0][0]) {
    return KOI_HALF[0][1];
  }

  for (let index = 1; index < KOI_HALF.length; index += 1) {
    const [x1, h1] = KOI_HALF[index];
    if (x <= x1) {
      const [x0, h0] = KOI_HALF[index - 1];
      return h0 + ((h1 - h0) * (x - x0)) / (x1 - x0);
    }
  }

  return KOI_HALF[KOI_HALF.length - 1][1];
};

/** A smooth curve through the points (Catmull-Rom as cubic Béziers), from the first. */
const curveThrough = (points: readonly Point[]): string => {
  let path = '';
  for (let index = 0; index < points.length - 1; index += 1) {
    const before = points[Math.max(index - 1, 0)];
    const start = points[index];
    const end = points[index + 1];
    const after = points[Math.min(index + 2, points.length - 1)];
    const first: Point = [start[0] + (end[0] - before[0]) / 6, start[1] + (end[1] - before[1]) / 6];
    const second: Point = [end[0] - (after[0] - start[0]) / 6, end[1] - (after[1] - start[1]) / 6];
    path += `C${pointText(first)} ${pointText(second)} ${pointText(end)}`;
  }
  return path;
};

const edge = (offset: (half: number) => number): Point[] =>
  KOI_HALF.map(([x, half]) => [x, KOI_MID + offset(half)]);

/** The tail fin's outline, from the top of its root round both lobes to the bottom. */
const TAIL_OUTER = 'C905 102 958 54 996 20C986 66 962 116 934 150C962 184 986 234 996 280C958 246 905 198 870 189';

/** The whole fish, mouth to tail, for the clip and the outline. */
export const koiSilhouette = (): string => {
  const top = edge((half) => -half);
  const bottom = edge((half) => half).reverse();
  return `M${pointText(top[0])}${curveThrough(top)}${TAIL_OUTER}${curveThrough(bottom)}Z`;
};

/** The tail fin, whose root curves forward past the last joint on the centerline. */
export const koiTailFin = (): string =>
  `M${TAIL_ROOT_X} ${KOI_MID - koiHalfHeight(TAIL_ROOT_X)}${TAIL_OUTER}`
  + `C862 178 856 164 856 ${KOI_MID}C856 136 862 122 ${TAIL_ROOT_X} ${KOI_MID - koiHalfHeight(TAIL_ROOT_X)}Z`;

/** The dark back: everything above the back line, for drawing inside the clip. */
export const koiBack = (): string => {
  const line = edge((half) => -half * BACK_LINE).reverse();
  return `M${MOUTH_X} 0H${TAIL_ROOT_X}V${round(line[0][1])}${curveThrough(line)}Z`;
};

/** The pale belly: everything below the belly line, for drawing inside the clip. */
export const koiBelly = (): string => {
  const line = edge((half) => half * BELLY_LINE).reverse();
  return `M${MOUTH_X} ${KOI_HEIGHT}H${TAIL_ROOT_X}V${round(line[0][1])}${curveThrough(line)}Z`;
};

/** The cyan rim light just inside the top edge, from behind the mouth hoop to the tail. */
export const koiRim = (): string => {
  const inset = 3.5;
  const top = edge((half) => inset - half).filter(([x]) => x >= 50 && x <= 850);
  const start: Point = [36, KOI_MID + inset - koiHalfHeight(36)];
  return `M${pointText(start)}${curveThrough([start, ...top])}`;
};

export type ScaleColumn = {
  /** Where the column's scale tips sit; each scale bulges toward the tail from here. */
  x: number;
  /** How far each scale bulges. */
  depth: number;
};

// Two head columns between the gill and the crest, then two columns in each
// body link, so every gap between columns, joints included, is the same.
const HEAD_COLUMNS: readonly ScaleColumn[] = [
  { x: 198, depth: 29 },
  { x: 243, depth: 29 },
];

export const koiScaleColumns = (): ScaleColumn[] => {
  const columns = [...HEAD_COLUMNS];
  // The body links: every joint after the head, up to the tail fin's.
  for (let index = 1; index < KOI_JOINTS.length - 1; index += 1) {
    const from = KOI_JOINTS[index];
    const pitch = (KOI_JOINTS[index + 1] - from) / 2;
    const depth = pitch - 2 * JOINT_CLEARANCE;
    columns.push({ x: from + JOINT_CLEARANCE, depth }, { x: from + JOINT_CLEARANCE + pitch, depth });
  }
  return columns;
};

/**
 * Gold scale arcs in columns down the back and sides, alternate columns half
 * a scale apart. They stop at the belly and are hidden under the sash.
 */
export const koiScales = (): string => {
  let path = '';
  koiScaleColumns().forEach(({ x, depth }, column) => {
    const half = koiHalfHeight(x + depth / 2);
    const radius = half * 0.23;
    const offset = column % 2 === 0 ? 0 : 0.5;
    for (let row = -6; row <= 6; row += 1) {
      const center = KOI_MID + (row + offset) * radius * 2;
      const top = center - radius;
      const bottom = center + radius;
      const hiddenBySash = top > KOI_MID - SASH_HALF && bottom < KOI_MID + SASH_HALF;
      if (bottom < KOI_MID - half || top > KOI_MID + half * BELLY_LINE || hiddenBySash) {
        continue;
      }
      path += `M${round(x)} ${round(top)}A${round(depth)} ${round(radius)} 0 0 1 ${round(x)} ${round(bottom)}`;
    }
  });
  return path;
};

/** Paper lanterns on the string below the carp. */
export const LANTERN_COUNT = 9;

export type CordShape = {
  /** How far the post end sits below the mast end, in carp units. */
  fall: number;
  /** How far the cord sags below the straight line between its ends, halfway. */
  sag: number;
};

/**
 * On wide screens the cord falls toward the tower, under the carp's own
 * droop, so the tail clears it even at its lowest; on tall ones the carp
 * hangs steeply and the cord runs level, well below it.
 */
export const LANTERN_CORDS = {
  wide: { fall: 205, sag: 60 },
  tall: { fall: 0, sag: 130 },
} as const satisfies Record<string, CordShape>;

/** How far below the mast end the cord hangs a fraction t of the way across, in carp units. */
export const cordDrop = ({ fall, sag }: CordShape, t: number): number =>
  fall * t + 4 * sag * t * (1 - t);

/** How deep the cord's box is, in carp units: down to the cord's lowest point. */
export const cordDepth = (shape: CordShape): number => {
  const lowest = (shape.fall + 4 * shape.sag) / (8 * shape.sag);
  return round(cordDrop(shape, Math.min(Math.max(lowest, 0), 1)));
};

/**
 * The cord in a box 100 wide and as deep as the cord, one unit a carp unit
 * deep: a quadratic curve from the mast end to the post end, so x runs
 * evenly along it.
 */
export const lanternCord = (shape: CordShape): { viewBox: string; path: string } => ({
  viewBox: `0 0 100 ${cordDepth(shape)}`,
  path: `M0 0Q50 ${round(2 * shape.sag + shape.fall / 2)} 100 ${shape.fall}`,
});

export type LanternPoint = {
  /** Across the cord's box, as a percentage. */
  x: number;
  /** Where the lantern hangs from the cord, in carp units below the mast end, on wide and tall screens. */
  wide: number;
  tall: number;
};

/** Where each lantern hangs, evenly spaced along the cord, clear of both ends. */
export const lanternString = (count: number = LANTERN_COUNT): LanternPoint[] =>
  Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / (count + 1);
    return {
      x: round(t * 100),
      wide: round(cordDrop(LANTERN_CORDS.wide, t)),
      tall: round(cordDrop(LANTERN_CORDS.tall, t)),
    };
  });
