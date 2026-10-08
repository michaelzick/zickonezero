/**
 * The foreground of the day end scene (CityGapScene): a row of rooftops in
 * front of the city, with a water tower, stair bulkheads, AC units, and an
 * antenna, and a window washer's gondola working its way down the tallest
 * building. Original art, static SVG; the gondola and its cables are HTML
 * layers placed in the same box as the roofs, so they stay on their building
 * at every size, and only their transforms move (styles/cityGap.ts).
 */

type Roof = {
  x: number;
  width: number;
  /** The top of the parapet, in the 1600x360 drawing. */
  top: number;
  tone: number;
};

// Deep teal in three shades, overlapping so no sky shows between them. The
// third, tallest, carries the gondola.
const TONES = ['#1d5a63', '#174d55', '#226a72'] as const;

const ROOFS: readonly Roof[] = [
  { x: 0, width: 214, top: 188, tone: 1 },
  { x: 204, width: 268, top: 128, tone: 0 },
  { x: 462, width: 300, top: 58, tone: 2 },
  { x: 752, width: 262, top: 150, tone: 1 },
  { x: 1004, width: 290, top: 98, tone: 0 },
  { x: 1284, width: 316, top: 172, tone: 2 },
];

const HEIGHT = 360;
const CAP = 7;
const WINDOW_W = 20;
const WINDOW_H = 26;
const PITCH_X = 38;
const PITCH_Y = 48;
const INSET = 18;

// Window reflections, a few catching more of the sky. Fixed, so the static
// HTML and the hydrated page draw the same ones.
const windows = (bright: boolean) => ROOFS.map(({ x, width, top }) => {
  const columns = Math.floor((width - INSET * 2 + PITCH_X - WINDOW_W) / PITCH_X);
  const start = x + Math.round((width - (columns * PITCH_X - (PITCH_X - WINDOW_W))) / 2);
  let path = '';
  for (let row = 0; top + 30 + row * PITCH_Y + WINDOW_H < HEIGHT; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (((column * 3 + row * 7 + x) % 5 === 0) === bright) {
        path += `M${start + column * PITCH_X} ${top + 30 + row * PITCH_Y}h${WINDOW_W}v${WINDOW_H}h${-WINDOW_W}z`;
      }
    }
  }
  return path;
}).join('');

const PANES = windows(false);
const BRIGHT_PANES = windows(true);

const CAPS = ROOFS.map(({ x, width, top }) => `M${x} ${top}h${width}v${CAP}h${-width}z`).join('');
const SHADOWS = ROOFS.map(({ x, width, top }) => `M${x} ${top + CAP}h${width}v4h${-width}z`).join('');

// Rooftop gear, in the shadow color: stair bulkheads, AC units, vents, the
// antenna, and the davit that holds the gondola's cables.
const GEAR = [
  // Bulkheads with their doors cut out by the trim path below.
  'M252 96h66v32h-66z', 'M1060 66h72v32h-72z',
  // AC units.
  'M362 112h40v16h-40z', 'M412 116h34v12h-34z', 'M800 132h46v18h-46z', 'M856 136h34v14h-34z',
  'M1346 156h44v16h-44z', 'M1404 160h30v12h-30z', 'M1170 84h12v14h-12z', 'M1196 88h10v10h-10z',
  // The antenna on the tall building.
  'M718 58V6h4v52z', 'M708 22h24v3h-24z', 'M711 36h18v3h-18z',
  // The davit: a post on the parapet and the arm the cables hang from.
  'M598 58V42h6v16z', 'M572 38h96v6h-96z',
].join('');

const DOORS = 'M276 106h18v22h-18zM1088 74h18v24h-18z';

const WaterTower = () => (
  <g>
    <path d='M60 188V150M80 188V150M100 188V150M120 188V150M58 170H122' fill='none' stroke='#12393f' strokeWidth='4' />
    <path d='M52 112H128V150H52Z' fill='#b05e42' />
    <path d='M52 122H128M52 140H128' fill='none' stroke='#7a3c2a' strokeWidth='3' />
    <path d='M48 112L90 90L132 112Z' fill='#12393f' />
  </g>
);

// The gondola's box in the drawing: cables from the davit arm at x 590 and
// 650, from y 44 to y 300.
const RIG = { x: 560, y: 44, width: 120, height: 256 };
const pct = (value: number, of: number) => `${((value / of) * 100).toFixed(3)}%`;

const Gondola = () => (
  <div
    className='gondola-rig'
    style={{
      left: pct(RIG.x, 1600),
      top: pct(RIG.y, HEIGHT),
      width: pct(RIG.width, 1600),
      height: pct(RIG.height, HEIGHT),
    }}
  >
    <span className='gondola-cable' style={{ left: pct(30, RIG.width) }} />
    <span className='gondola-cable' style={{ left: pct(90, RIG.width) }} />
    <div className='gondola'>
      <svg data-art viewBox={`0 0 ${RIG.width} ${RIG.height}`} focusable='false'>
        {/* The washer: hard hat, overalls, and a squeegee on a pole against the glass. */}
        <path d='M68 18L82 4' stroke='#4b5a61' strokeWidth='3' strokeLinecap='round' />
        <path d='M76 0L88 8' stroke='#12393f' strokeWidth='5' strokeLinecap='round' />
        <path d='M45 22H59V48H45Z' fill='#c06a4c' />
        <path d='M58 26L69 18' stroke='#c06a4c' strokeWidth='5' strokeLinecap='round' />
        <circle cx='52' cy='15' r='6' fill='#e9c9a4' />
        <path d='M44 13C44 4 60 4 60 13Z' fill='#ffcf6a' />
        {/* The cradle: stirrups where the cables meet it, its rails, and the deck. */}
        <path d='M30 14V50M90 14V50' stroke='#f3e2c0' strokeWidth='4' strokeLinecap='round' />
        <path d='M26 28H94M26 40H94' stroke='#f3e2c0' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M22 50H98V58H22Z' fill='#12393f' />
        <path d='M26 58L32 63H88L94 58Z' fill='#c06a4c' />
      </svg>
    </div>
  </div>
);

const DayRooftops = () => (
  <div className='roofs'>
    <svg data-art viewBox={`0 0 1600 ${HEIGHT}`} focusable='false'>
      {ROOFS.map(({ x, width, top, tone }) => (
        <path key={x} d={`M${x} ${top}h${width}V${HEIGHT}H${x}Z`} fill={TONES[tone]} />
      ))}
      <path d={PANES} fill='#a5dde2' opacity='0.5' />
      <path d={BRIGHT_PANES} fill='#e6f4f1' opacity='0.75' />
      <path d={SHADOWS} fill='#12393f' opacity='0.6' />
      <path d={CAPS} fill='#f3e2c0' />
      <WaterTower />
      <path d={GEAR} fill='#12393f' />
      <path d={DOORS} fill='#c06a4c' />
    </svg>
    <Gondola />
  </div>
);

export default DayRooftops;
