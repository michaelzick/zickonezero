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
import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';

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
          <TrackedLink href='/' label='ZICKONEZERO Creative' location='top_nav' section='brand'>
            <span className='brand-line brand-first'>ZICKONEZERO</span>
            <span className='brand-line brand-second'>Creative</span>
          </TrackedLink>
        </Title>
        <ThemeSwitcher />
      </ThemeSwitcherWrapper>

      <LinkBoxContent />

      <MenuIcon onClick={(event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        trackEvent('mobile_menu_toggle', {
          location: 'top_nav',
          expanded: !isMobileMenuShown,
          page_path: window.location.pathname,
        });
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
