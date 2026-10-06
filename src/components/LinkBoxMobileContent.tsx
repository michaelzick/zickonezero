import { MouseEvent, useState } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import {
  showMobileMenu,
} from '../showMobileMenuSlice';
import {
  useAppDispatch,
} from '../hooks';
import useCurrentPath from '../hooks/useCurrentPath';
import { trackEvent } from '../lib/analytics';
import { getRouteMeta } from '../lib/city/routes';
import { NAV_MENUS, type NavMenuKey } from './navMenus';
import TrackedLink from './TrackedLink';
import {
  CityMapMenu,
  NavAccordionButton,
  NavAccordionList,
  NavChevron
} from '../../styles/nav';

/** Referenced by the menu button's aria-controls. */
export const MOBILE_MENU_ID = 'site-city-map';

type LinkBoxMobileContentProps = {
  isAnimating?: boolean;
};

const LinkBoxMobileContent = ({ isAnimating = true }: LinkBoxMobileContentProps) => {
  const dispatch = useAppDispatch();
  const [openMenu, setOpenMenu] = useState<NavMenuKey | null>(null);
  const currentPath = useCurrentPath();

  const handleCloseMenu = () => dispatch(showMobileMenu(false));

  const toggleMenu = (key: NavMenuKey, label: string) => {
    const expanded = openMenu === key;
    if (!expanded) {
      trackEvent('nav_dropdown_open', {
        location: 'mobile_nav',
        label,
        page_path: window.location.pathname,
      });
    }
    setOpenMenu(expanded ? null : key);
  };

  return (
    <CityMapMenu
      id={MOBILE_MENU_ID}
      $isAnimating={isAnimating}
      data-location={getRouteMeta(currentPath ?? '/').label}
      onClick={(event: MouseEvent<HTMLUListElement>) => event.stopPropagation()}>
      <li onClick={handleCloseMenu}>
        <TrackedLink
          href='/about'
          label='About'
          location='mobile_nav'
          section='primary'
          variant='mobile'
          ariaCurrent={currentPath === '/about' ? 'page' : undefined}
        >
          About
        </TrackedLink>
      </li>
      <li onClick={handleCloseMenu}>
        <TrackedLink
          href='/contact'
          label='Contact'
          location='mobile_nav'
          section='primary'
          variant='mobile'
          ariaCurrent={currentPath === '/contact' ? 'page' : undefined}
        >
          Contact
        </TrackedLink>
      </li>
      {NAV_MENUS.map((menu) => {
        const isOpen = openMenu === menu.key;

        return (
          <li key={menu.key}>
            <NavAccordionButton
              type='button'
              onClick={() => toggleMenu(menu.key, menu.label)}
              aria-expanded={isOpen}>
              {menu.label}
              <NavChevron $isOpen={isOpen} aria-hidden='true'>
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </NavChevron>
            </NavAccordionButton>
            <NavAccordionList $isOpen={isOpen}>
              {menu.links.map(({ href, label, icon, iconAlt }) => (
                <li key={href} onClick={handleCloseMenu}>
                  {menu.external ? (
                    <TrackedLink
                      href={href}
                      label={label}
                      location='mobile_nav'
                      section={menu.sections.mobile}
                      variant='mobile'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {label} <OpenInNewWindowIcon aria-hidden='true' />
                    </TrackedLink>
                  ) : (
                    <TrackedLink
                      href={href}
                      label={label}
                      location='mobile_nav'
                      section={menu.sections.mobile}
                      variant='mobile'
                      ariaCurrent={href === currentPath ? 'page' : undefined}
                    >
                      {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                      {label}
                    </TrackedLink>
                  )}
                </li>
              ))}
            </NavAccordionList>
          </li>
        );
      })}
    </CityMapMenu>
  );
};

export default LinkBoxMobileContent;
