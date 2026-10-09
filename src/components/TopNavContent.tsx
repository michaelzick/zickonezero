import {
  useAppSelector,
  useAppDispatch
} from '../hooks';
import {
  showMobileMenu,
  getMobileMenuState
} from '../showMobileMenuSlice';

import {
  MenuButton,
  NavBar,
  NavBrand,
  NavBrandGroup,
  NavControls
} from '../../styles/nav';
import AnimatedMobileMenu from './AnimatedMobileMenu';
import LinkBoxContent from './LinkBoxContent';
import { MouseEvent, ReactElement, useEffect, useRef } from 'react';
import useScrolledPast from '../hooks/useScrolledPast';
import { trackEvent } from '../lib/analytics';
import TrackedLink from './TrackedLink';
import BrandName from './BrandName';
import { MOBILE_MENU_ID } from './LinkBoxMobileContent';
import SoundToggle from './hud/SoundToggle';
import TimeOfDayToggle from './hud/TimeOfDayToggle';

/** Scroll distance before the bar turns from clear to glass. */
const GLASS_THRESHOLD_PX = 12;

type NavContentProps = {
  /** Runs before the brand link navigates; preventDefault keeps the visitor on the page. */
  onBrandClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

const NavContent = ({ onBrandClick }: NavContentProps = {}): ReactElement => {
  const { isMobileMenuShown } = useAppSelector(getMobileMenuState);
  const dispatch = useAppDispatch();
  const isScrolled = useScrolledPast(GLASS_THRESHOLD_PX);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes the city map and hands focus back to its button.
  useEffect(() => {
    if (!isMobileMenuShown) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(showMobileMenu(false));
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isMobileMenuShown]);

  const handleNavClick = () => {
    if (isMobileMenuShown) {
      dispatch(showMobileMenu(false));
    }
  };

  return (
    <NavBar
      id='site-nav'
      data-scrolled={isScrolled || isMobileMenuShown ? 'true' : 'false'}
      onClick={handleNavClick}
    >
      <NavBrandGroup>
        <NavBrand onClick={() => dispatch(showMobileMenu(false))}>
          <span className='signal' aria-hidden='true' />
          <TrackedLink
            href='/'
            label='ZICKONEZERO Creative'
            location='top_nav'
            section='brand'
            onClick={onBrandClick}
          >
            <span className='brand-line brand-first'><BrandName /></span>
            <span className='brand-line brand-second'><span className='brand-tag'>Creative</span></span>
          </TrackedLink>
        </NavBrand>
        <NavControls>
          <TimeOfDayToggle />
          <SoundToggle />
        </NavControls>
      </NavBrandGroup>

      <LinkBoxContent />

      <MenuButton
        ref={menuButtonRef}
        type='button'
        aria-label='Menu'
        aria-expanded={isMobileMenuShown}
        aria-controls={MOBILE_MENU_ID}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          trackEvent('mobile_menu_toggle', {
            location: 'top_nav',
            expanded: !isMobileMenuShown,
            page_path: window.location.pathname,
          });
          dispatch(showMobileMenu(!isMobileMenuShown));
        }}
      >
        <span className='bar' aria-hidden='true' />
        <span className='bar' aria-hidden='true' />
        <span className='bar' aria-hidden='true' />
      </MenuButton>

      <AnimatedMobileMenu isVisible={isMobileMenuShown} />
    </NavBar>
  );
};

export default NavContent;
