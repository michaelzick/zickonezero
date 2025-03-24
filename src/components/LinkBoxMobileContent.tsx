import Link from 'next/link';

import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import {
  useAppDispatch,
} from '../hooks';

import { NewTabSVG } from './svg/NewTab';
import { LinkBoxMobile } from '../../styles';

const LinkBoxMobileContent = () => {
  const dispatch = useAppDispatch();

  return (
    <LinkBoxMobile>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <Link href='/about'>About</Link>
      </li>
      {/* <li onClick={() => dispatch(showMobileMenu(false))}>
        <Link href='/product-and-engineering'>Product & Engineering</Link>
      </li> */}
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
          <NewTabSVG />
        </a>
      </li>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
          <NewTabSVG />
        </a>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
