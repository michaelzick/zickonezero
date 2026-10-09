import { createRandom } from './prng';

/**
 * A seeded wall of record shelves for Bar Four (src/components/barfour/).
 *
 * Spines are grouped by tone into one path each, so the whole wall is a
 * handful of SVG nodes however many records it holds. Coordinates are whole
 * units, so the static HTML and the hydrated page draw the same wall.
 */

export type RecordWallOptions = {
  seed: number;
  width: number;
  height: number;
  /** Shelf rows, top to bottom. */
  rows: number;
  shelfThickness: number;
  minSpine: number;
  maxSpine: number;
  /** Records per run between gaps. */
  minRun: number;
  maxRun: number;
  /** Most a spine sits below the full shelf height (7-inch singles, dividers). */
  maxDrop: number;
  /** Sleeves turned face-out, dealt across the rows. */
  sleeves: number;
};

export type RecordSleeve = {
  x: number;
  y: number;
  size: number;
  tone: number;
};

export type RecordWall = {
  width: number;
  height: number;
  /** Every shelf board as one path. */
  shelves: string;
  /** One path per tone; index matches RECORD_TONES. */
  spines: readonly string[];
  sleeves: readonly RecordSleeve[];
};

/**
 * Tone classes, from the dark sleeves most records wear to the few bright
 * ones that catch the light. The bag weights the draw toward the dark ones.
 */
export const RECORD_TONES = ['slate', 'plum', 'umber', 'teal', 'ochre', 'amber', 'magenta', 'cyan'] as const;
const TONE_BAG = [0, 0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7];

const MARGIN = 8;
const RUN_GAP = 6;

export const generateRecordWall = (options: RecordWallOptions): RecordWall => {
  const {
    seed, width, height, rows, shelfThickness, minSpine, maxSpine, minRun, maxRun, maxDrop,
  } = options;
  const random = createRandom(seed);
  const rowHeight = Math.floor(height / rows);
  const clearance = rowHeight - shelfThickness - 6;
  const sleeveSize = clearance - 2;
  const spines = RECORD_TONES.map(() => [] as string[]);
  const shelves: string[] = [];
  const sleeves: RecordSleeve[] = [];

  // Deal the face-out sleeves round the rows from a seeded one. Each lands at
  // a spot toward either side, clear of the title in the middle and early
  // enough in its row that the run before it can't push it off the end.
  const firstRow = random.int(0, rows - 1);
  const sleeveSpots: number[][] = Array.from({ length: rows }, () => []);
  for (let index = 0; index < options.sleeves; index += 1) {
    const spot = random.chance(0.5)
      ? random.int(Math.round(width * 0.04), Math.round(width * 0.24))
      : random.int(Math.round(width * 0.62), Math.round(width * 0.74));
    sleeveSpots[(firstRow + index) % rows].push(spot);
  }

  for (let row = 0; row < rows; row += 1) {
    const shelfTop = (row + 1) * rowHeight - shelfThickness;
    const spots = sleeveSpots[row].sort((a, b) => a - b);
    shelves.push(`M0 ${shelfTop}h${width}v${shelfThickness}h${-width}z`);

    let x = MARGIN;
    while (x < width - MARGIN) {
      if (spots.length > 0 && x >= spots[0]) {
        spots.shift();
        if (x + sleeveSize <= width - MARGIN) {
          sleeves.push({ x, y: shelfTop - sleeveSize, size: sleeveSize, tone: random.pick(TONE_BAG) });
          x += sleeveSize + RUN_GAP;
          continue;
        }
      }

      const run = random.int(minRun, maxRun);
      for (let index = 0; index < run && x < width - MARGIN; index += 1) {
        const spine = Math.min(random.int(minSpine, maxSpine), width - MARGIN - x);
        const drop = random.chance(0.12) ? random.int(Math.ceil(maxDrop / 2), maxDrop) : random.int(0, 3);
        const tall = clearance - drop;
        spines[random.pick(TONE_BAG)].push(`M${x} ${shelfTop - tall}h${spine}v${tall}h${-spine}z`);
        x += spine + 1;
      }
      x += random.int(RUN_GAP, RUN_GAP * 3);
    }
  }

  return {
    width,
    height,
    shelves: shelves.join(''),
    spines: spines.map((parts) => parts.join('')),
    sleeves,
  };
};
