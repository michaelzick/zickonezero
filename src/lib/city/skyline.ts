import { createRandom } from './prng';

/**
 * Procedural skyline layers for the city backdrop.
 *
 * Each layer collapses to a handful of SVG path strings (one silhouette, two
 * window paths drawn as dashed strokes) so the DOM stays tiny no matter how
 * many buildings there are. Coordinates are integers so the server-rendered
 * path strings match the hydrated ones exactly.
 */

export type NeonTone = 'magenta' | 'cyan' | 'violet' | 'amber' | 'red';

export type SkylineOptions = {
  seed: number;
  /** viewBox width and height. Buildings stand on the bottom edge. */
  width: number;
  height: number;
  minBuildingWidth: number;
  maxBuildingWidth: number;
  /** Building heights as fractions of the layer height. */
  minHeight: number;
  maxHeight: number;
  /** Spacing between buildings; negative values overlap them. */
  minGap: number;
  maxGap: number;
  /** Vertical distance between window rows. */
  floorHeight: number;
  /** Chance that a floor has a lit run of windows. */
  litRowChance: number;
  /** Share of lit runs drawn in the cool (cyan) window color. */
  coolShare: number;
  /** Upper bound for the covers whose lights switch, drawn from the main stream. */
  flickerCount: number;
  /**
   * More switching covers, picked from their own stream, so asking for them
   * never moves anything else on the layer.
   */
  extraFlicker?: number;
  /** Size of one window and the gap after it, so covers fit whole dashes. */
  windowWidth: number;
  windowHeight: number;
  windowGap: number;
  neonStrips: number;
  billboards: number;
  beacons: number;
};

export type SkylineRect = { x: number; y: number; width: number; height: number };
export type NeonStrip = SkylineRect & { tone: NeonTone };
export type Billboard = SkylineRect & { tone: NeonTone };
export type Beacon = { x: number; y: number };

export type SkylineLayer = {
  width: number;
  height: number;
  silhouette: string;
  litWindows: string;
  coolWindows: string;
  flicker: SkylineRect[];
  strips: NeonStrip[];
  billboards: Billboard[];
  beacons: Beacon[];
};

type Building = { x: number; width: number; top: number; roof: number; antenna: number };

const NEON_TONES: readonly NeonTone[] = ['magenta', 'cyan', 'violet', 'amber', 'cyan', 'magenta', 'red'];

/** Hard cap so a misconfigured layer can never flood the DOM. */
export const MAX_FLICKER_WINDOWS = 32;

// Extra covers are picked from their own stream (see SkylineOptions.extraFlicker).
const FLICKER_SEED_OFFSET = 7919;

/** A run of lit windows on one floor: where it starts and how many windows it holds. */
type LitRun = { x: number; y: number; windows: number };

/**
 * A cover's size cycles through a single window and rooms of two and three,
 * set by its index, so it costs no random draws.
 */
const roomSize = (index: number, run: LitRun) => Math.min(1 + (index % 3), run.windows);

/** The building outline and its highest point (where a beacon would sit). */
const roofShape = (building: Building, baseline: number): { path: string; peak: Beacon } => {
  const { x, width, top, antenna } = building;
  const right = x + width;
  const center = x + Math.round(width / 2);

  // 0: flat, 1: stepped crown, 2: slanted, 3: antenna mast
  switch (building.roof) {
    case 1: {
      const inset = Math.max(2, Math.round(width * 0.22));
      const crown = Math.max(4, Math.round(width * 0.35));
      return {
        path: `M${x} ${baseline}V${top}H${x + inset}V${top - crown}H${right - inset}V${top}H${right}V${baseline}Z`,
        peak: { x: center, y: top - crown },
      };
    }
    case 2: {
      const rise = Math.max(4, Math.round(width * 0.4));
      return {
        path: `M${x} ${baseline}V${top}L${right} ${top - rise}V${baseline}Z`,
        peak: { x: right - 1, y: top - rise },
      };
    }
    case 3:
      return {
        path: `M${x} ${baseline}V${top}H${center - 1}V${top - antenna}H${center + 1}V${top}H${right}V${baseline}Z`,
        peak: { x: center, y: top - antenna },
      };
    default:
      return {
        path: `M${x} ${baseline}V${top}H${right}V${baseline}Z`,
        peak: { x: center, y: top },
      };
  }
};

export const generateSkyline = (options: SkylineOptions): SkylineLayer => {
  const random = createRandom(options.seed);
  const { width, height } = options;
  const buildings: Building[] = [];

  let cursor = -random.int(0, options.maxBuildingWidth);
  while (cursor < width) {
    const buildingWidth = random.int(options.minBuildingWidth, options.maxBuildingWidth);
    const buildingHeight = Math.round(height * random.range(options.minHeight, options.maxHeight));

    buildings.push({
      x: cursor,
      width: buildingWidth,
      top: height - buildingHeight,
      roof: random.next() < 0.5 ? 0 : random.int(1, 3),
      antenna: random.int(6, 18),
    });
    cursor += buildingWidth + random.int(options.minGap, options.maxGap);
  }

  const shapes = buildings.map((building) => roofShape(building, height));
  const silhouette = shapes.map((shape) => shape.path).join('');

  const lit: string[] = [];
  const cool: string[] = [];
  const litRuns: LitRun[] = [];
  const pitch = options.windowWidth + options.windowGap;

  buildings.forEach((building) => {
    const pad = Math.max(2, Math.round(building.width * 0.12));
    const usable = building.width - pad * 2;
    if (usable < options.windowWidth * 2) {
      return;
    }

    for (let y = building.top + options.floorHeight; y < height - options.floorHeight; y += options.floorHeight) {
      if (!random.chance(options.litRowChance)) {
        continue;
      }

      const start = building.x + pad + random.int(0, Math.floor(usable / 3));
      const end = building.x + pad + usable - random.int(0, Math.floor(usable / 3));
      const length = end - start;
      if (length < options.windowWidth * 2) {
        continue;
      }

      const segment = `M${start} ${y}h${length}`;
      if (random.chance(options.coolShare)) {
        cool.push(segment);
      } else {
        lit.push(segment);
      }

      // Dashes start at the segment start, one window per pitch.
      litRuns.push({
        x: start,
        y: y - Math.round(options.windowHeight / 2),
        windows: Math.floor((length + options.windowGap) / pitch),
      });
    }
  });

  // A cover over `count` windows of a run, starting `offset` windows in.
  const cover = (run: LitRun, offset: number, count: number): SkylineRect => ({
    x: run.x + offset * pitch,
    y: run.y,
    width: count * pitch - options.windowGap,
    height: options.windowHeight,
  });

  // The first covers start at their run's first window. These picks come from
  // the main stream, so their count is fixed where later signs depend on it.
  const flickerTarget = Math.min(options.flickerCount, MAX_FLICKER_WINDOWS, litRuns.length);
  const flicker: SkylineRect[] = [];
  const taken = new Set<number>();
  while (flicker.length < flickerTarget) {
    const index = random.int(0, litRuns.length - 1);
    if (!taken.has(index)) {
      taken.add(index);
      flicker.push(cover(litRuns[index], 0, roomSize(flicker.length, litRuns[index])));
    }
  }

  // Extra covers anywhere along other runs, from their own stream.
  const extraRandom = createRandom(options.seed + FLICKER_SEED_OFFSET);
  const extraTarget = Math.min(
    flicker.length + (options.extraFlicker ?? 0),
    MAX_FLICKER_WINDOWS,
    litRuns.length,
  );
  while (flicker.length < extraTarget) {
    const index = extraRandom.int(0, litRuns.length - 1);
    if (!taken.has(index)) {
      taken.add(index);
      const run = litRuns[index];
      const count = roomSize(flicker.length, run);
      flicker.push(cover(run, extraRandom.int(0, run.windows - count), count));
    }
  }

  const visible = buildings
    .map((building, index) => ({ building, peak: shapes[index].peak }))
    .filter(({ building }) => building.x + building.width > 0 && building.x < width);

  const strips: NeonStrip[] = [];
  const stripCandidates = visible.filter(({ building }) => building.width >= options.minBuildingWidth + 4);
  for (let i = 0; i < options.neonStrips && stripCandidates.length > 0; i += 1) {
    const { building } = random.pick(stripCandidates);
    const buildingHeight = height - building.top;
    const stripHeight = Math.max(8, Math.round(buildingHeight * random.range(0.18, 0.4)));
    strips.push({
      x: building.x + random.int(1, Math.max(1, building.width - 4)),
      y: building.top + random.int(4, Math.max(4, buildingHeight - stripHeight - 4)),
      width: random.int(2, 3),
      height: stripHeight,
      tone: random.pick(NEON_TONES),
    });
  }

  // At most one billboard per building, on the wider and taller ones.
  const billboards: Billboard[] = [];
  const billboardCandidates = visible.filter(
    ({ building }) => building.width >= options.minBuildingWidth * 1.3 && height - building.top > height * 0.3,
  );
  for (let i = 0; i < options.billboards && billboardCandidates.length > 0; i += 1) {
    const [{ building }] = billboardCandidates.splice(random.int(0, billboardCandidates.length - 1), 1);
    const boardWidth = Math.round(building.width * random.range(0.45, 0.75));
    const boardHeight = Math.max(8, Math.round(boardWidth * random.range(0.35, 0.6)));
    billboards.push({
      x: building.x + Math.round((building.width - boardWidth) / 2),
      y: building.top + random.int(6, Math.max(6, Math.round((height - building.top) * 0.3))),
      width: boardWidth,
      height: boardHeight,
      tone: random.pick(NEON_TONES),
    });
  }

  const beacons: Beacon[] = [...visible]
    .sort((a, b) => a.peak.y - b.peak.y)
    .slice(0, options.beacons)
    .map(({ peak }) => ({ x: peak.x, y: peak.y - 2 }));

  return {
    width,
    height,
    silhouette,
    litWindows: lit.join(''),
    coolWindows: cool.join(''),
    flicker,
    strips,
    billboards,
    beacons,
  };
};
