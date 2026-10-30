import { ReactElement } from 'react';

// The brand reads "ZICK ONE ZERO" as three words; only ONE is accent-colored
// (see `.brand-one` in styles/globals.scss) to set it apart from ZICK and ZERO.
const BrandName = (): ReactElement => (
  <span className='brand-name'>ZICK <span className='brand-one'>ONE</span> ZERO</span>
);

export default BrandName;
