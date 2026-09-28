import { ReactElement } from 'react';

// The text stays "ZICKONEZERO" so copy, search, and screen readers see one
// word; ZICK and ZERO are accent-colored and ONE keeps the plain text color
// (see `.brand-name` in styles/globals.scss) so the parts are easy to tell apart.
const BrandName = (): ReactElement => (
  <span className='brand-name'>ZICK<span className='brand-one'>ONE</span>ZERO</span>
);

export default BrandName;
