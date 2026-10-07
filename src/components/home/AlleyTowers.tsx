import type { CSSProperties } from 'react';

// These stand beyond the alley walls, on the same camera track. Each has a
// fixed silhouette and reveal point so walking back restores the same fog.
const TOWERS = [
  {
    x: -540, depth: 4500, width: 300, height: 258, reveal: 0.04, gain: 1.12,
    shape: 'M12 1000V130h32V80h84v50h60v870Z',
    side: 'M146 130h42v870h-42Z',
    crown: 'M44 80h84M86 80V18M76 18h20',
  },
  {
    x: 420, depth: 4200, width: 280, height: 238, reveal: 0.12, gain: 1.22,
    shape: 'M12 1000V154h22v-50h40V56h50v48h42v50h22v846Z',
    side: 'M148 154h40v846h-40Z',
    crown: 'M74 56h50M99 56V6M89 104h20',
  },
  {
    x: -240, depth: 3420, width: 250, height: 198, reveal: 0.18, gain: 1.34,
    shape: 'M12 1000V110h32V68h100v42h44v890Z',
    side: 'M146 110h42v890h-42Z',
    crown: 'M44 68h100M64 68V32M124 68V44',
  },
  {
    x: 34, depth: 3260, width: 300, height: 198, reveal: 0.24, gain: 1.44,
    shape: 'M12 1000V170h20V98h36V42h64v56h36v72h20v830Z',
    side: 'M148 170h40v830h-40Z',
    crown: 'M68 42h64M100 42V4M88 98h24',
  },
  {
    x: 290, depth: 3580, width: 230, height: 190, reveal: 0.3, gain: 1.55,
    shape: 'M12 1000V116L68 56h64l56 60v884Z',
    side: 'M146 106l42 10v884h-42Z',
    crown: 'M68 56h64M100 56V22M40 116h120',
  },
] as const;

// Batched dashed rows give the towers scale without a DOM node per window.
const windowRows = (phase: number) => {
  const rows = { unlit: '', warm: '', cool: '' };
  for (let y = 190, floor = 0; y < 980; y += 22, floor += 1) {
    rows.unlit += `M26 ${y}h146`;
    if ((floor + phase) % 3 === 0) {
      rows.cool += `M48 ${y}h58`;
    } else if ((floor + phase) % 4 === 0) {
      rows.warm += `M114 ${y}h58`;
    }
  }
  return rows;
};

const DETAILS = TOWERS.map((_, index) => windowRows(index));

/** Original vertical megastructures emerging through fog ahead of the hero. */
const AlleyTowers = () => (
  <div className='distant-towers' aria-hidden='true'>
    {TOWERS.map(({ x, depth, width, height, reveal, gain, shape, side, crown }, index) => (
      <div
        key={depth}
        className='plane distant-tower'
        style={{
          '--tower-x': `${x}px`, '--tower-depth': `${-depth}px`,
          '--tower-width': `${width}px`, '--tower-height': `${height}vh`,
          '--tower-reveal': reveal, '--tower-gain': gain,
        } as CSSProperties}
      >
        <svg data-art viewBox='0 0 200 1000' preserveAspectRatio='none' focusable='false'>
          <path className='tower-body' d={shape} />
          <path className='tower-side' d={side} />
          <path className='tower-ribs' d='M36 174v826M142 174v826M12 174h176M12 612h176' />
          <path className='tower-windows tower-unlit' d={DETAILS[index].unlit} />
          <path className='tower-windows tower-warm' d={DETAILS[index].warm} />
          <path className='tower-windows tower-cool' d={DETAILS[index].cool} />
          <path className='tower-crown' d={crown} />
          <path className='tower-light' d='M22 202v345M178 640v212' />
        </svg>
      </div>
    ))}
  </div>
);

export default AlleyTowers;
