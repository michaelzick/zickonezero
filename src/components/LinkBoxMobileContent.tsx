import Link from 'next/link';

import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import {
  useAppDispatch,
} from '../hooks';

import { Button, LinkBoxMobile } from '../../styles';

const LinkBoxMobileContent = () => {
  const dispatch = useAppDispatch();

  return (
    <LinkBoxMobile>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <Button href='https://linkedin.com/in/michaelzick' target='_blank' rel='noreferrer'>LinkedIn</Button>
      </li>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <a href='https://github.com/michaelzick' target='_blank' rel='noreferrer'>GitHub</a>
      </li>
      <li onClick={() => dispatch(showMobileMenu(false))}>
        <Link href='/about'>About</Link>
      </li>
    </LinkBoxMobile>
  );
};

export default LinkBoxMobileContent;
