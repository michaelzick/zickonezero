import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { OpenInNewWindowIcon } from '@radix-ui/react-icons';

import useCurrentPath from '../hooks/useCurrentPath';
import { trackEvent } from '../lib/analytics';
import { NAV_MENUS, menuHoldsPath, type NavMenuConfig, type NavMenuKey } from './navMenus';
import TrackedLink from './TrackedLink';
import {
  NavLinkRow,
  NavMenu,
  NavMenuTrigger,
  NavDropdown,
  NavChevron
} from '../../styles/nav';

const HOVER_CLOSE_DELAY_MS = 120;

const LinkBoxContent = () => {
  const [openMenu, setOpenMenu] = useState<NavMenuKey | null>(null);
  const menuRefs = useRef<Partial<Record<NavMenuKey, HTMLDivElement | null>>>({});
  const hoverCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentPath = useCurrentPath();

  const clearHoverTimeout = () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  };

  const open = (menu: NavMenuConfig) => {
    clearHoverTimeout();
    if (openMenu !== menu.key) {
      trackEvent('nav_dropdown_open', {
        location: 'top_nav',
        label: menu.label,
        page_path: window.location.pathname,
      });
    }
    setOpenMenu(menu.key);
  };

  const closeAll = () => {
    clearHoverTimeout();
    setOpenMenu(null);
  };

  const scheduleCloseAll = () => {
    clearHoverTimeout();
    hoverCloseTimeout.current = setTimeout(closeAll, HOVER_CLOSE_DELAY_MS);
  };

  // Clear any pending hover-close timeout when the component unmounts.
  useEffect(() => () => {
    if (hoverCloseTimeout.current) {
      clearTimeout(hoverCloseTimeout.current);
      hoverCloseTimeout.current = null;
    }
  }, []);

  useEffect(() => {
    if (!openMenu) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const clickedInside = Object.values(menuRefs.current).some((node) => node?.contains(target));
      if (!clickedInside) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [openMenu]);

  return (
    <NavLinkRow>
      <TrackedLink
        href='/about'
        label='About'
        location='top_nav'
        section='primary'
        ariaCurrent={currentPath === '/about' ? 'page' : undefined}
      >
        About
      </TrackedLink>
      <TrackedLink
        href='/contact'
        label='Contact'
        location='top_nav'
        section='primary'
        ariaCurrent={currentPath === '/contact' ? 'page' : undefined}
      >
        Contact
      </TrackedLink>
      {NAV_MENUS.map((menu) => {
        const isOpen = openMenu === menu.key;

        return (
          <NavMenu
            key={menu.key}
            ref={(node: HTMLDivElement | null) => {
              menuRefs.current[menu.key] = node;
            }}
            onMouseEnter={() => open(menu)}
            onMouseLeave={scheduleCloseAll}
            onFocus={() => open(menu)}
            onBlur={(event: FocusEvent<HTMLDivElement>) => {
              const current = menuRefs.current[menu.key];
              const next = event.relatedTarget as Node | null;
              if (!current) return;
              if (next && current.contains(next)) return;
              closeAll();
            }}
          >
            <NavMenuTrigger
              type='button'
              onClick={() => open(menu)}
              aria-haspopup='true'
              aria-expanded={isOpen}
              data-active={menuHoldsPath(menu, currentPath) ? 'true' : undefined}
            >
              {menu.label}
              <NavChevron $isOpen={isOpen} aria-hidden='true'>
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </NavChevron>
            </NavMenuTrigger>
            <NavDropdown
              onMouseEnter={() => open(menu)}
              onMouseLeave={scheduleCloseAll}
              $isOpen={isOpen}
              aria-hidden={!isOpen}
            >
              {menu.links.map(({ href, label, icon, iconAlt }) => (
                <li key={href} onClick={closeAll}>
                  {menu.external ? (
                    <TrackedLink
                      href={href}
                      label={label}
                      location='top_nav'
                      section={menu.sections.desktop}
                      variant='desktop'
                      target='_blank'
                      rel='noopener noreferrer'
                      tabIndex={isOpen ? 0 : -1}
                    >
                      {label} <OpenInNewWindowIcon aria-hidden='true' />
                    </TrackedLink>
                  ) : (
                    <TrackedLink
                      href={href}
                      label={label}
                      location='top_nav'
                      section={menu.sections.desktop}
                      variant='desktop'
                      tabIndex={isOpen ? 0 : -1}
                      ariaCurrent={href === currentPath ? 'page' : undefined}
                    >
                      {icon ? <img className='case-logo' src={icon} alt={iconAlt || `${label} logo`} /> : null}
                      {label}
                    </TrackedLink>
                  )}
                </li>
              ))}
            </NavDropdown>
          </NavMenu>
        );
      })}
    </NavLinkRow>
  );
};

export default LinkBoxContent;
