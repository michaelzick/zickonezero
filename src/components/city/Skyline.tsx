import type { SkylineLayer } from '../../lib/city/skyline';

export type SkylineWindows = {
  /** Window size and spacing in viewBox units, matching the generator. */
  width: number;
  gap: number;
  height: number;
};

type Props = {
  layer: SkylineLayer;
  windows: SkylineWindows;
};

/**
 * Draws one generated skyline layer. Lit window runs are single paths with a
 * dashed stroke, so hundreds of windows cost three DOM nodes. Colors come from
 * the city tokens via classes styled in styles/city.ts.
 */
const Skyline = ({ layer, windows }: Props) => {
  const dash = `${windows.width} ${windows.gap}`;

  return (
    <svg
      data-art
      viewBox={`0 0 ${layer.width} ${layer.height}`}
      preserveAspectRatio='xMidYMax slice'
      focusable='false'
      aria-hidden='true'
    >
      <path className='silhouette' d={layer.silhouette} />
      {layer.billboards.map((board, index) => (
        <g key={`board-${index}`} className={`tone-${board.tone}`}>
          <rect
            className='billboard-glow'
            x={board.x - 4}
            y={board.y - 4}
            width={board.width + 8}
            height={board.height + 8}
          />
          <rect className='billboard' x={board.x} y={board.y} width={board.width} height={board.height} />
          <path
            className='billboard-copy'
            d={`M${board.x + Math.round(board.width * 0.18)} ${board.y + Math.round(board.height * 0.36)}h${Math.round(board.width * 0.62)}M${board.x + Math.round(board.width * 0.18)} ${board.y + Math.round(board.height * 0.66)}h${Math.round(board.width * 0.38)}`}
          />
        </g>
      ))}
      <path className='windows windows-warm' d={layer.litWindows} strokeWidth={windows.height} strokeDasharray={dash} />
      <path className='windows windows-cool' d={layer.coolWindows} strokeWidth={windows.height} strokeDasharray={dash} />
      {layer.flicker.map((spot, index) => (
        <rect
          key={`flicker-${index}`}
          className='flicker-window'
          x={spot.x}
          y={spot.y}
          width={spot.width}
          height={spot.height}
        />
      ))}
      {layer.strips.map((strip, index) => (
        <g key={`strip-${index}`} className={`tone-${strip.tone}`}>
          <rect
            className='strip-glow'
            x={strip.x - 3}
            y={strip.y - 3}
            width={strip.width + 6}
            height={strip.height + 6}
          />
          <rect className='strip' x={strip.x} y={strip.y} width={strip.width} height={strip.height} />
        </g>
      ))}
      {layer.beacons.map((beacon, index) => (
        <circle
          key={`beacon-${index}`}
          className='beacon'
          cx={beacon.x}
          cy={beacon.y}
          r={1.6}
          style={{ animationDelay: `${(-index * 0.9).toFixed(1)}s` }}
        />
      ))}
    </svg>
  );
};

export default Skyline;
