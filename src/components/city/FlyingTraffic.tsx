import { CSSProperties } from 'react';

import { TrafficLane } from '../../../styles/city';

type Lane = {
  top: string;
  scale: number;
  /** Seconds to cross the screen; far lanes are slower. */
  duration: number;
  /** Negative delays start cars mid-route so the sky is never empty. */
  delay: number;
  reverse: boolean;
  wideOnly: boolean;
};

const LANES: readonly Lane[] = [
  { top: '15%', scale: 0.5, duration: 64, delay: -8, reverse: false, wideOnly: true },
  { top: '19%', scale: 0.62, duration: 52, delay: -31, reverse: true, wideOnly: false },
  { top: '24%', scale: 0.78, duration: 41, delay: -5, reverse: false, wideOnly: false },
  { top: '28%', scale: 0.56, duration: 70, delay: -44, reverse: true, wideOnly: true },
  { top: '33%', scale: 0.95, duration: 31, delay: -17, reverse: false, wideOnly: false },
  { top: '21%', scale: 0.46, duration: 80, delay: -60, reverse: false, wideOnly: true },
];

/** Distant flying cars crossing the sky between the skyline layers. */
const FlyingTraffic = () => (
  <>
    {LANES.map((lane, index) => (
      <TrafficLane
        key={`lane-${index}`}
        data-reverse={lane.reverse}
        data-wide-only={lane.wideOnly}
        style={{ top: lane.top, '--car-scale': lane.scale } as CSSProperties}
      >
        <span
          className='car'
          style={{ animationDuration: `${lane.duration}s`, animationDelay: `${lane.delay}s` }}
        >
          <span className='car-body' />
        </span>
      </TrafficLane>
    ))}
  </>
);

export default FlyingTraffic;
