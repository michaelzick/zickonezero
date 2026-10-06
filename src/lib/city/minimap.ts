/**
 * The homepage minimap: a top-down street grid, the route north through the
 * three districts, and where the player stands on it for a scroll position.
 *
 * Coordinates are the map's own CSS pixels (the map renders at 1:1), so the
 * HTML pins and player line up with the SVG streets. Everything is fixed or
 * derived from fixed numbers, so the static HTML matches the client.
 */

export type MapPoint = { x: number; y: number };

export const MINIMAP_WIDTH = 216;
export const MINIMAP_HEIGHT = 144;

/** Street centerlines: avenues run north-south at these x, streets east-west at these y. */
const AVENUES = [8, 36, 64, 92, 120, 148, 176, 204];
const STREETS = [20, 56, 92, 128];
const STREET_HALF_WIDTH = 3;

/** Grid cells (avenue gap, street gap) drawn as parks instead of buildings. */
const PARK_CELLS = new Set(['7:1', '6:4', '1:0', '7:3']);

/**
 * The route, walked north as the page scrolls: the alley at the bottom, the
 * Case Studies, Product Engineering, and Web Development districts, then the
 * street level at the top.
 */
export const MINIMAP_ROUTE: readonly MapPoint[] = [
  { x: 36, y: 136 },
  { x: 36, y: 108 },
  { x: 36, y: 92 },
  { x: 64, y: 92 },
  { x: 64, y: 72 },
  { x: 64, y: 56 },
  { x: 36, y: 56 },
  { x: 36, y: 36 },
  { x: 36, y: 20 },
  { x: 120, y: 20 },
  { x: 120, y: 8 },
];

/** Route vertices of the stops: the start, the three districts, the end. */
export const MINIMAP_STOPS: readonly number[] = [0, 1, 4, 7, 10];

/** The block beside each district's pin, which lights in the district's color. */
export const MINIMAP_DISTRICT_BLOCKS: readonly string[] = [
  'M39 95h22v30h-22z',
  'M67 59h22v30h-22z',
  'M39 23h22v30h-22z',
];

/** Side gigs dotted around the map: decoration. */
export const MINIMAP_POIS: readonly (MapPoint & { kind: 'gig' | 'fixer' | 'shop' })[] = [
  { x: 176, y: 110, kind: 'gig' },
  { x: 160, y: 38, kind: 'fixer' },
  { x: 198, y: 140, kind: 'shop' },
  { x: 106, y: 128, kind: 'fixer' },
];

const rectPath = (x: number, y: number, width: number, height: number) => (
  `M${x} ${y}h${width}v${height}h${-width}z`
);

/** Building blocks and parks as two path strings. */
export const buildMinimapBlocks = (): { blocks: string; parks: string } => {
  const xs = [0, ...AVENUES, MINIMAP_WIDTH];
  const ys = [0, ...STREETS, MINIMAP_HEIGHT];
  const blocks: string[] = [];
  const parks: string[] = [];

  for (let column = 0; column < xs.length - 1; column += 1) {
    for (let row = 0; row < ys.length - 1; row += 1) {
      // Map edges have no street to inset from.
      const left = xs[column] + (column === 0 ? 0 : STREET_HALF_WIDTH);
      const right = xs[column + 1] - (column === xs.length - 2 ? 0 : STREET_HALF_WIDTH);
      const top = ys[row] + (row === 0 ? 0 : STREET_HALF_WIDTH);
      const bottom = ys[row + 1] - (row === ys.length - 2 ? 0 : STREET_HALF_WIDTH);
      const width = right - left;
      const height = bottom - top;

      if (width < 4 || height < 4) {
        continue;
      }

      if (PARK_CELLS.has(`${column}:${row}`)) {
        parks.push(rectPath(left, top, width, height));
      } else if ((column + row) % 3 === 0 && height > 16) {
        // Some blocks are two buildings with a service alley between them.
        const split = Math.round(height / 2);
        blocks.push(rectPath(left, top, width, split - 1));
        blocks.push(rectPath(left, top + split + 1, width, height - split - 1));
      } else {
        blocks.push(rectPath(left, top, width, height));
      }
    }
  }

  return { blocks: blocks.join(''), parks: parks.join('') };
};

export const routePath = (route: readonly MapPoint[] = MINIMAP_ROUTE): string => (
  route.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('')
);

export type RouteFix = MapPoint & {
  /** Heading in degrees clockwise from north (up the map). */
  heading: number;
  /** How far along the whole route, from 0 to 1. */
  progress: number;
};

const segmentLength = (a: MapPoint, b: MapPoint) => Math.hypot(b.x - a.x, b.y - a.y);

const headingOf = (a: MapPoint, b: MapPoint) => (Math.atan2(b.x - a.x, a.y - b.y) * 180) / Math.PI;

/**
 * Places the player on the route for scroll position y. Stop i sits at route
 * vertex stopVertices[i] and is reached at scroll position stopScrolls[i];
 * between two stops the player walks the streets at a steady pace.
 */
export const locateOnRoute = (
  y: number,
  stopScrolls: readonly number[],
  route: readonly MapPoint[] = MINIMAP_ROUTE,
  stopVertices: readonly number[] = MINIMAP_STOPS,
): RouteFix => {
  const lastLeg = stopVertices.length - 2;
  let leg = 0;
  while (leg < lastLeg && y >= stopScrolls[leg + 1]) {
    leg += 1;
  }

  const from = stopScrolls[leg];
  const to = stopScrolls[leg + 1];
  let legProgress: number;
  if (to > from) {
    legProgress = Math.min(Math.max((y - from) / (to - from), 0), 1);
  } else {
    legProgress = y >= to ? 1 : 0;
  }

  const lengths = route.slice(1).map((point, index) => segmentLength(route[index], point));
  const totalLength = lengths.reduce((sum, length) => sum + length, 0);
  const firstVertex = stopVertices[leg];
  const lastVertex = stopVertices[leg + 1];
  const walkedBefore = lengths.slice(0, firstVertex).reduce((sum, length) => sum + length, 0);
  const legLength = lengths.slice(firstVertex, lastVertex).reduce((sum, length) => sum + length, 0);

  let remaining = legProgress * legLength;
  for (let vertex = firstVertex; vertex < lastVertex; vertex += 1) {
    const length = lengths[vertex];
    if (remaining <= length || vertex === lastVertex - 1) {
      const a = route[vertex];
      const b = route[vertex + 1];
      const fraction = length > 0 ? Math.min(remaining / length, 1) : 1;

      return {
        x: a.x + (b.x - a.x) * fraction,
        y: a.y + (b.y - a.y) * fraction,
        heading: headingOf(a, b),
        progress: totalLength > 0 ? (walkedBefore + legProgress * legLength) / totalLength : 0,
      };
    }

    remaining -= length;
  }

  // A leg with no streets: stay on its stop.
  const stop = route[firstVertex];
  return { x: stop.x, y: stop.y, heading: 0, progress: totalLength > 0 ? walkedBefore / totalLength : 0 };
};
