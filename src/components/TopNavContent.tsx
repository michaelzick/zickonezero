import Link from 'next/link';

import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { Title, Nav, MenuIcon } from '../../styles';
import { LinkBoxContent, LinkBoxMobileContent, ThemeSwitcher } from '.';
import { ReactElement } from 'react';

const NavContent = (): ReactElement => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  return (
    <Nav>
      <Title isMobileMenuShown={isMobileMenuShown}
        onClick={() => dispatch(showMobileMenu(false))}>
        <Link href='/'>
          ZICKONEZERO Creative
        </Link>
        <ThemeSwitcher />
      </Title>

      <LinkBoxContent />

      <MenuIcon onClick={() => dispatch(showMobileMenu(!isMobileMenuShown))}
        className={isMobileMenuShown && 'change'}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </MenuIcon>

      {isMobileMenuShown ? <LinkBoxMobileContent /> : null}
    </Nav>
  );
};

export default NavContent;
