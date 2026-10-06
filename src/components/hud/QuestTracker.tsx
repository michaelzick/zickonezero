import type { Ref } from 'react';

import ScrambleText from './ScrambleText';

type Props = {
  /** The current objective, such as "Explore Product Engineering". */
  objective: string;
  /** The distance readout, which the HUD rewrites as the page scrolls. */
  distanceRef: Ref<HTMLSpanElement>;
};

/**
 * The game-style quest tracker under the minimap: the current gig in red, its
 * objective in yellow (re-typed with a decode when it changes), and the
 * distance left to the street level. It repeats what the page already says,
 * so it is hidden from assistive technology.
 */
const QuestTracker = ({ objective, distanceRef }: Props) => (
  <div className='quest' aria-hidden='true'>
    <p className='quest-label'>Current gig</p>
    <p className='quest-objective'>
      <ScrambleText text={objective} />
    </p>
    <p className='quest-distance'>
      <span ref={distanceRef}>-.- km</span>
    </p>
  </div>
);

export default QuestTracker;
