import Link from 'next/link';

import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import { Title, Nav, MenuIcon, ThemeSwitcherWrapper } from '../../styles';
import { LinkBoxContent, LinkBoxMobileContent, ThemeSwitcher } from '.';
import { ReactElement } from 'react';

const NavContent = (): ReactElement => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  const handleNavClick = () => {
    if (isMobileMenuShown) {
      dispatch(showMobileMenu(false));
    }
  };

  return (
    <Nav onClick={handleNavClick}>
      <ThemeSwitcherWrapper className="theme-switcher-container"
        isMobileMenuShown={isMobileMenuShown}>
        <Title isMobileMenuShown={isMobileMenuShown}
          onClick={() => dispatch(showMobileMenu(false))}>
          <Link href='/'>
            <span className='brand-line brand-first'>ZICKONEZERO</span>
            <span className='brand-line brand-second'>Creative</span>
          </Link>
        </Title>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>

      <LinkBoxContent />

      <MenuIcon onClick={(event) => {
        event.stopPropagation();
        dispatch(showMobileMenu(!isMobileMenuShown));
      }}
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
