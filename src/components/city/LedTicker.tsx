import { Fragment } from 'react';

import { LedTickerRoot } from '../../../styles/neon';

type Props = {
  phrases: readonly string[];
  className?: string;
};

/**
 * A scrolling LED banner. It is decorative scenery: the same phrases are
 * part of the page's real copy elsewhere, so the banner is hidden from
 * assistive technology. Two copies of the phrases make the loop seamless.
 */
const LedTicker = ({ phrases, className }: Props) => (
  <LedTickerRoot className={className} aria-hidden='true'>
    <div className='ticker-track'>
      {[0, 1].map((copy) => phrases.map((phrase) => (
        <Fragment key={`${copy}-${phrase}`}>
          <span className='ticker-item'>{phrase}</span>
          <span className='ticker-gem'>◆</span>
        </Fragment>
      )))}
    </div>
  </LedTickerRoot>
);

export default LedTicker;
