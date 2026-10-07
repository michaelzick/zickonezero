import type { Ref } from 'react';

import ScrambleText from './ScrambleText';

type Props = {
  /** The next destination, such as "Head to Product Engineering". */
  objective: string;
  /** Travels to the next district, or returns to the hero. */
  onObjectiveClick: () => void;
  /** The distance readout, which the HUD rewrites as the page scrolls. */
  distanceRef: Ref<HTMLSpanElement>;
};

/**
 * The game-style quest tracker under the minimap: the current gig in red, its
 * objective in yellow (re-typed with a decode when it changes), and the
 * distance left to the end of the route. The objective is a button that fast
 * travels to the next stop; its stable label hides the decode from assistive
 * technology, and the label and distance are decoration.
 */
const QuestTracker = ({ objective, onObjectiveClick, distanceRef }: Props) => (
  <div className='quest'>
    <p className='quest-label' aria-hidden='true'>Current gig</p>
    <button type='button' className='quest-objective' aria-label={objective} onClick={onObjectiveClick}>
      <ScrambleText text={objective} />
    </button>
    <p className='quest-distance' aria-hidden='true'>
      <span ref={distanceRef}>-.- km</span>
    </p>
  </div>
);

export default QuestTracker;
