import { ReactElement } from 'react';

// The text stays "ZICKONEZERO" so copy, search, and screen readers see one
// word; only ONE is accent-colored (see `.brand-one` in styles/globals.scss)
// to make the ZICK / ONE / ZERO parts easy to tell apart.
const BrandName = (): ReactElement => (
  <span className='brand-name'>ZICK<span className='brand-one'>ONE</span>ZERO</span>
);

export default BrandName;
