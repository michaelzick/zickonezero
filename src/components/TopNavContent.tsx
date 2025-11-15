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
import { LinkBoxContent, AnimatedMobileMenu, ThemeSwitcher } from '.';
import { MouseEvent, ReactElement } from 'react';

const NavContent = (): ReactElement => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();

  const handleNavClick = () => {
    if (isMobileMenuShown) {
      dispatch(showMobileMenu(false));
    }
  };

  return (
    <Nav id='site-nav' onClick={handleNavClick}>
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

      <MenuIcon onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        dispatch(showMobileMenu(!isMobileMenuShown));
      }}
        className={isMobileMenuShown ? 'change' : undefined}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
      </MenuIcon>

      <AnimatedMobileMenu isVisible={isMobileMenuShown} />
    </Nav>
  );
};

export default NavContent;
