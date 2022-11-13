import Link from 'next/link';

import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import {
  useAppDispatch,
} from '../hooks';

import { LinkBoxMobile, NewTabGlyph } from '../../styles';

const LinkBoxMobileContent = () => {
  const dispatch = useAppDispatch();

  return (
    <LinkBoxMobile>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <Link href='/about'>About</Link>
      </li>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <a href='https://github.com/michaelzick' target='_blank' rel='noopener noreferrer'>GitHub
          <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
        </a>
      </li>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <a href='https://linkedin.com/in/michaelzick' target='_blank' rel='noopener noreferrer'>LinkedIn
          <NewTabGlyph src='img/icons8-new-tab-50.png' alt='new tab icon' />
        </a>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
