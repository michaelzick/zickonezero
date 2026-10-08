import type { FacadeLayer } from '../../lib/city/facade';
import { startsOff } from '../../lib/city/windowLights';

type Props = {
  facade: FacadeLayer;
  /** SVG preserveAspectRatio; the hero stretches its walls to fit. */
  fit?: string;
};

/**
 * One generated wall of buildings, drawn face-on: the hero turns two into an
 * alley, and the billboard hangs on another. Window rows are dashed strokes,
 * so a whole wall is a few dozen nodes. Colors come from the classes in
 * styles/facade.ts.
 */
const AlleyWall = ({ facade, fit = 'none' }: Props) => {
  const { windows } = facade;
  const windowRow = {
    strokeWidth: windows.height,
    strokeDasharray: `${windows.width} ${windows.gap}`,
  };

  return (
    <svg
      data-art
      viewBox={`0 0 ${facade.length} ${facade.height}`}
      preserveAspectRatio={fit}
      focusable='false'
      aria-hidden='true'
    >
      <path className='wall-a' d={facade.walls[0]} />
      <path className='wall-b' d={facade.walls[1]} />
      <path className='trim' d={facade.trim} />
      <path className='panes' d={facade.panes} {...windowRow} />
      <path className='lit' d={facade.lit} {...windowRow} />
      <path className='cool' d={facade.cool} {...windowRow} />
      {/* Covers that switch single lights off: the wall, then its unlit pane. */}
      {facade.flicker.map((spot, index) => (
        <g
          key={`flicker-${spot.x}-${spot.y}`}
          className={`flicker-window${startsOff(index) ? ' is-off' : ''}`}
        >
          <rect className={`wall-${spot.wall}`} x={spot.x} y={spot.y} width={spot.width} height={spot.height} />
          <rect className='flicker-pane' x={spot.x} y={spot.y} width={spot.width} height={spot.height} />
        </g>
      ))}
      <path className='pipes' d={facade.pipes} />
      <path className='units' d={facade.units} />
      <path className='grilles' d={facade.grilles} />
      <path className='shutters' d={facade.shutters} />
      <path className='slats' d={facade.slats} />
      {facade.shopfronts.map((shop) => (
        <rect
          key={`shop-${shop.x}`}
          className={`shop tone-${shop.tone}`}
          x={shop.x}
          y={shop.y}
          width={shop.width}
          height={shop.height}
        />
      ))}
      <g className='signs'>
        {facade.signs.map((sign) => (
          <g key={`sign-${sign.x}-${sign.y}`} className={`tone-${sign.tone}`}>
            <rect className='sign-box' x={sign.x} y={sign.y} width={sign.width} height={sign.height} rx={3} />
            <path className='sign-glyphs' d={sign.glyphs} />
          </g>
        ))}
      </g>
    </svg>
  );
};

export default AlleyWall;
