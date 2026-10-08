/**
 * More of the night end scene's foreground (KoiStreamer): a mid-rise beside
 * the carp's rooftop, low enough for the lanterns to hang over, and a tower
 * across the street, where the lantern string from the mast is tied. Original
 * art, static SVG in the night palette. The lit windows are fixed and never
 * switch, so the static HTML and the hydrated page agree and nothing repaints.
 * Both are placed with the rig's own lengths (styles/cityGap.ts), so the cord
 * always ends on the tower.
 */

type Grid = {
  /** The first column and row, and the pitch between them, in drawing units. */
  x: number;
  y: number;
  columns: number;
  rows: number;
  pitchX: number;
  pitchY: number;
  width: number;
  height: number;
  /** Whether the window at a column and row is lit. */
  lit: (column: number, row: number) => boolean;
};

const windowPaths = ({ x, y, columns, rows, pitchX, pitchY, width, height, lit }: Grid) => {
  let dark = '';
  let bright = '';
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const pane = `M${x + column * pitchX} ${y + row * pitchY}h${width}v${height}h${-width}z`;
      if (lit(column, row)) {
        bright += pane;
      } else {
        dark += pane;
      }
    }
  }
  return { dark, bright };
};

// The mid-rise, in its 500x900 drawing, which runs on below the scene: gear
// on the near half of the roof and the parapet at 56.
const MID_WINDOWS = windowPaths({
  x: 26, y: 80, columns: 13, rows: 25, pitchX: 36, pitchY: 32, width: 18, height: 16,
  lit: (column, row) => (column * 5 + row * 3) % 7 < 2 || (column === 9 && row < 3),
});

// The tower, in its 300x1200 drawing: gear on the roof, the parapet at 60,
// and smaller windows than the low roofs', so it reads as tall.
const TOWER_WINDOWS = windowPaths({
  x: 48, y: 86, columns: 10, rows: 39, pitchX: 24, pitchY: 28, width: 12, height: 15,
  lit: (column, row) => (column * 7 + row * 11) % 9 < 3,
});

const NightRooftops = () => (
  <>
    <div className='koi-midrise'>
      <svg viewBox='0 0 500 900' data-art focusable='false'>
        {/* A stair bulkhead, AC units, vent stacks, and a dish. */}
        <path
          className='koi-midrise-art'
          d='M30 22H102V56H30ZM42 30H58V56H42ZM128 38H178V56H128ZM190 44H232V56H190ZM252 34H257V56H252ZM264 40H269V56H264ZM0 56H500V900H0Z'
        />
        <path className='koi-midrise-art' d='M84 10A18 18 0 0 0 116 22ZM98 16H101V22H98Z' />
        <path className='koi-roof-rim' d='M0 56.5H500' />
        <path className='koi-roof-window' d={MID_WINDOWS.dark} />
        <path className='koi-roof-window is-lit' d={MID_WINDOWS.bright} />
      </svg>
    </div>

    <div className='koi-tower'>
      <svg viewBox='0 0 300 1200' data-art focusable='false'>
        {/* A water tank on its stand and an antenna, clear of the left corner, where the lanterns' post can stand. */}
        <path
          className='koi-tower-art'
          d='M172 14L211 2L250 14ZM172 14H250V44H172ZM178 44H182V60H178ZM207 44H211V60H207ZM240 44H244V60H240ZM176 50H246V52H176ZM118 8H122V60H118ZM110 22H130V25H110ZM113 36H127V39H113ZM0 60H300V1200H0Z'
        />
        <path className='koi-tower-ledge' d='M0 60H300V70H0ZM0 360H300V366H0ZM0 700H300V706H0ZM0 1040H300V1046H0Z' />
        <path className='koi-tower-rim' d='M0 60.5H300' />
        {/* An empty blade sign on the street side, its letters off, below the lanterns' tie. */}
        <path className='koi-tower-sign' d='M8 240H34V600H8Z' />
        <path className='koi-roof-window' d={TOWER_WINDOWS.dark} />
        <path className='koi-roof-window is-lit' d={TOWER_WINDOWS.bright} />
        {/* A steady red beacon atop the antenna. */}
        <circle cx='120' cy='8' r='8' fill='url(#gap-koi-beacon)' />
        <circle cx='120' cy='8' r='3.5' fill='#ff4f45' />
      </svg>
    </div>
  </>
);

export default NightRooftops;
