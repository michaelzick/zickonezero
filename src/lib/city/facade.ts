import { createRandom, type Random } from './prng';
import type { NeonTone } from './skyline';

/**
 * Procedural alley walls for the homepage hero.
 *
 * One facade is a long strip of buildings seen face-on: storefront shutters at
 * street level, rows of windows above, air conditioners, drainpipes, and flat
 * neon signs. The hero turns it into a wall receding down the alley with a CSS
 * 3D rotation, so the browser does the perspective.
 *
 * Like the skyline, everything collapses into a few path strings (window rows
 * are dashed strokes) with integer coordinates, so the static HTML and the
 * hydrated client draw the same wall.
 */

export type FacadeOptions = {
  seed: number;
  /** viewBox width (the wall's length down the alley) and height. */
  length: number;
  height: number;
  /** Height of the storefront band along the street. */
  groundHeight: number;
  floorHeight: number;
  windowWidth: number;
  windowHeight: number;
  windowGap: number;
  /** Length of one building along the wall. */
  minSegment: number;
  maxSegment: number;
  /** Lowest roof, as a fraction of the height. */
  minRoof: number;
  /** Chance that a window starts a lit run. */
  litChance: number;
  /** Share of lit runs drawn in the cool window color. */
  coolShare: number;
  /** Chance that a window has an air conditioner hanging under it. */
  unitChance: number;
  maxUnits: number;
  /** Flat neon signs mounted on the wall. */
  signs: number;
  /**
   * Small details stop past this x: the far end of the wall is only a few
   * pixels wide on screen.
   */
  detailLength: number;
};

export type FacadeRect = { x: number; y: number; width: number; height: number };
export type FacadeShopfront = FacadeRect & { tone: NeonTone };
/** A flat neon sign; glyphs is a path of bars that reads as lettering from afar. */
export type FacadeSign = FacadeShopfront & { glyphs: string };

export type FacadeLayer = {
  length: number;
  height: number;
  /** Window size and spacing, for the dashed strokes that draw window rows. */
  windows: { width: number; height: number; gap: number };
  /**
   * The wall body, following each building's roof line. Alternate buildings
   * go in separate paths so the day street can paint them in two colors.
   */
  walls: [string, string];
  /** Floor ledges, the awning line, and the seams between buildings. */
  trim: string;
  /** Unlit window rows, drawn as dashed strokes. */
  panes: string;
  lit: string;
  cool: string;
  units: string;
  grilles: string;
  pipes: string;
  shutters: string;
  slats: string;
  /** Lit doorways and shop windows. */
  shopfronts: FacadeShopfront[];
  signs: FacadeSign[];
};

const SIGN_TONES: readonly NeonTone[] = ['magenta', 'cyan', 'amber', 'violet', 'red', 'cyan'];
const SHOP_TONES: readonly NeonTone[] = ['amber', 'cyan', 'magenta', 'amber'];

/** Hard caps so a misconfigured wall can never flood the DOM. */
export const MAX_FACADE_SIGNS = 8;
export const MAX_FACADE_UNITS = 40;

type Segment = { x: number; end: number; roof: number };

const circlePath = (cx: number, cy: number, r: number) => (
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`
);

const SIGN_PADDING = 7;
const GLYPH_GAP = 4;

/** One or two rows of bars, like lettering too far away to read. */
const signGlyphs = (sign: FacadeRect, random: Random): string => {
  const rows = sign.height > 36 ? 2 : 1;
  const rowHeight = (sign.height - SIGN_PADDING * 2) / rows;
  const barHeight = Math.max(4, Math.round(rowHeight * 0.5));
  const right = sign.x + sign.width - SIGN_PADDING;
  let path = '';

  for (let row = 0; row < rows; row += 1) {
    const y = Math.round(sign.y + SIGN_PADDING + row * rowHeight + (rowHeight - barHeight) / 2);
    for (let x = sign.x + SIGN_PADDING; ;) {
      const width = random.int(6, 19);
      if (x + width > right) {
        break;
      }
      path += `M${x} ${y}h${width}v${barHeight}h${-width}Z`;
      x += width + GLYPH_GAP;
    }
  }

  return path;
};

export const generateFacade = (options: FacadeOptions): FacadeLayer => {
  const random = createRandom(options.seed);
  const {
    length,
    height,
    groundHeight,
    floorHeight,
    windowWidth,
    windowHeight,
    windowGap,
    detailLength,
  } = options;

  const groundTop = height - groundHeight;
  const pitch = windowWidth + windowGap;
  const dash = Math.round(windowHeight / 2);

  const segments: Segment[] = [];
  for (let x = 0; x < length;) {
    const end = Math.min(length, x + random.int(options.minSegment, options.maxSegment));
    const roof = Math.round(height * random.range(0, 1 - options.minRoof));
    segments.push({ x, end, roof });
    x = end;
  }

  const walls: [string, string] = ['', ''];
  segments.forEach(({ x, end, roof }, index) => {
    walls[index % 2] += `M${x} ${height}V${roof}H${end}V${height}Z`;
  });

  let trim = `M0 ${groundTop}H${length}`;
  let panes = '';
  let lit = '';
  let cool = '';
  let units = '';
  let grilles = '';
  let pipes = '';
  let shutters = '';
  let slats = '';
  let unitCount = 0;
  const shopfronts: FacadeShopfront[] = [];
  const signs: FacadeSign[] = [];

  segments.forEach((segment, index) => {
    const { x, end, roof } = segment;
    const span = end - x;
    const columns = Math.floor((span - windowGap) / pitch);
    const rowStart = x + Math.round((span - (columns * pitch - windowGap)) / 2);

    if (index > 0) {
      trim += `M${x} ${roof}V${groundTop}`;
    }

    if (columns > 0) {
      const rowLength = columns * pitch - windowGap;

      for (let rowTop = groundTop - floorHeight; rowTop - roof > windowHeight; rowTop -= floorHeight) {
        const centerY = rowTop + Math.round((floorHeight - windowHeight) / 2) + dash;
        panes += `M${rowStart} ${centerY}h${rowLength}`;

        for (let column = 0; column < columns;) {
          if (!random.chance(options.litChance)) {
            column += 1;
            continue;
          }

          const run = Math.min(columns - column, random.int(1, 4));
          const segmentPath = `M${rowStart + column * pitch} ${centerY}h${run * pitch - windowGap}`;
          if (random.chance(options.coolShare)) {
            cool += segmentPath;
          } else {
            lit += segmentPath;
          }

          column += run + 1;
        }

        if (x < detailLength) {
          for (let column = 0; column < columns && unitCount < Math.min(options.maxUnits, MAX_FACADE_UNITS); column += 1) {
            if (!random.chance(options.unitChance)) {
              continue;
            }

            const unitWidth = Math.round(windowWidth * 0.86);
            const unitHeight = Math.round(floorHeight * 0.3);
            const unitX = rowStart + column * pitch + Math.round((windowWidth - unitWidth) / 2);
            const unitY = centerY + dash + 3;
            units += `M${unitX} ${unitY}h${unitWidth}v${unitHeight}h${-unitWidth}Z`;
            grilles += circlePath(
              unitX + Math.round(unitWidth * 0.62),
              unitY + Math.round(unitHeight / 2),
              Math.max(2, Math.round(unitHeight * 0.32)),
            );
            unitCount += 1;
          }
        }

        trim += `M${x} ${rowTop}h${span}`;
      }
    }

    if (x < detailLength) {
      if (random.chance(0.6)) {
        const pipeX = random.chance(0.5) ? x + 6 : end - 6;
        pipes += `M${pipeX} ${roof + 10}V${groundTop}`;
      }

      // Street level: a rolling shutter and, often, a lit doorway beside it.
      const doorWidth = Math.min(Math.round(span * 0.3), 90);
      const shutterX = x + 10;
      const shutterWidth = span - doorWidth - 30;
      const shutterTop = groundTop + Math.round(groundHeight * 0.22);
      if (shutterWidth > 30) {
        shutters += `M${shutterX} ${shutterTop}h${shutterWidth}V${height}h${-shutterWidth}Z`;
        for (let slatY = shutterTop + 6; slatY < height; slatY += 7) {
          slats += `M${shutterX} ${slatY}h${shutterWidth}`;
        }
      }

      if (random.chance(0.7)) {
        shopfronts.push({
          x: end - doorWidth - 10,
          y: shutterTop,
          width: doorWidth,
          height: height - shutterTop,
          tone: random.pick(SHOP_TONES),
        });
      }
    }
  });

  const signCount = Math.min(options.signs, MAX_FACADE_SIGNS);
  for (let attempt = 0; signs.length < signCount && attempt < signCount * 8; attempt += 1) {
    const segment = random.pick(segments);
    if (segment.x >= detailLength) {
      continue;
    }

    const span = segment.end - segment.x;
    const width = Math.round(Math.min(span * 0.7, random.range(60, 180)));
    const signHeight = Math.round(random.range(24, 46));
    const top = Math.max(segment.roof + 20, Math.round(groundTop - random.range(floorHeight * 0.4, floorHeight * 3.4)));
    if (top + signHeight > groundTop - 4) {
      continue;
    }

    const sign: FacadeSign = {
      x: segment.x + Math.round(random.range(8, Math.max(9, span - width - 8))),
      y: top,
      width,
      height: signHeight,
      tone: random.pick(SIGN_TONES),
      glyphs: '',
    };

    const overlaps = signs.some((other) => (
      sign.x < other.x + other.width + 12
      && other.x < sign.x + sign.width + 12
      && sign.y < other.y + other.height + 12
      && other.y < sign.y + sign.height + 12
    ));
    if (!overlaps) {
      sign.glyphs = signGlyphs(sign, random);
      signs.push(sign);
    }
  }

  return {
    length,
    height,
    windows: { width: windowWidth, height: windowHeight, gap: windowGap },
    walls,
    trim,
    panes,
    lit,
    cool,
    units,
    grilles,
    pipes,
    shutters,
    slats,
    shopfronts,
    signs,
  };
};
