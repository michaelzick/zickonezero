import { CASE_STUDIES_LINKS } from './caseStudiesLinks';
import { EXTERNAL_LINKS } from './contactLinks';
import { PROJECT_LINKS } from './projectLinks';

export type NavMenuLink = {
  href: string;
  label: string;
  icon?: string;
  iconAlt?: string;
};

export type NavMenuKey = 'case-studies' | 'projects' | 'links';

export type NavMenuConfig = {
  key: NavMenuKey;
  label: string;
  /** Analytics section names for the desktop dropdown and the mobile accordion. */
  sections: { desktop: string; mobile: string };
  links: readonly NavMenuLink[];
  /** External profiles open in a new tab. */
  external: boolean;
};

/** The grouped menus shared by the desktop dropdowns and the phone city map. */
export const NAV_MENUS: readonly NavMenuConfig[] = [
  {
    key: 'case-studies',
    label: 'Case Studies',
    sections: { desktop: 'case_studies_dropdown', mobile: 'case_studies_accordion' },
    links: CASE_STUDIES_LINKS,
    external: false,
  },
  {
    key: 'projects',
    label: 'Product Engineering',
    sections: { desktop: 'ux_design_dropdown', mobile: 'ux_design_accordion' },
    links: PROJECT_LINKS,
    external: false,
  },
  {
    key: 'links',
    label: 'Links',
    sections: { desktop: 'links_dropdown', mobile: 'links_accordion' },
    links: EXTERNAL_LINKS,
    external: true,
  },
];

/** True when the menu holds the page being viewed. */
export const menuHoldsPath = (menu: NavMenuConfig, path: string | null): boolean =>
  path !== null && menu.links.some(({ href }) => href === path);
