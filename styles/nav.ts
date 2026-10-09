import styled, { css, keyframes } from 'styled-components';

import { HudIconButton, notchPolygon } from './hud';
import { THEME } from './theme';

/*
 * The top HUD bar on every page (src/components/TopNavContent.tsx), its
 * desktop dropdowns, and the phone "city map" menu.
 *
 * The bar's height is load-bearing: fixed tab bars and page paddings sit at
 * 4.9em/5em (tablet/desktop) and 8.48em (phone) from the top. Restyles must
 * keep it at 78px above 600px wide and about 134.7px at 600px and below.
 *
 * Only @media and keyframes here; see styles/hud.ts for why.
 */

/** A one-shot RGB split on hover. The text itself never changes. */
const rgbSplit = keyframes`
  0% { text-shadow: -2px 0 var(--neon-magenta), 2px 0 var(--neon-cyan); }
  30% { text-shadow: 2px 0 var(--neon-magenta), -2px 0 var(--neon-cyan); }
  60% { text-shadow: -1px 0 var(--neon-magenta), 1px 0 var(--neon-cyan); }
  100% { text-shadow: none; }
`;

const signalPulse = keyframes`
  0% { transform: rotate(45deg) scale(0.55); opacity: 0.9; }
  70%, 100% { transform: rotate(45deg) scale(1.8); opacity: 0; }
`;

const mapBoot = keyframes`
  from { clip-path: inset(0 0 100% 0); }
  to { clip-path: inset(0 0 0 0); }
`;

const mapShutdown = keyframes`
  from { clip-path: inset(0 0 0 0); opacity: 1; }
  to { clip-path: inset(0 0 100% 0); opacity: 0.4; }
`;

const mapItemIn = keyframes`
  from { opacity: 0; transform: translate3d(-14px, 0, 0); }
  to { opacity: 1; transform: none; }
`;

const glitchOnHover = css`
  &:hover {
    animation: ${rgbSplit} 0.36s steps(1, end) 1;
  }
`;

/** An underline that sweeps in on hover and stays lit for the current page. */
const sweepUnderline = css`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    height: 2px;
    background: var(--city-accent);
    box-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) var(--city-accent);
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.28s ${THEME.easing.out};
  }

  &:hover::after,
  &:focus-visible::after,
  &[aria-current='page']::after,
  &[data-active='true']::after {
    transform: scaleX(1);
  }
`;

const hudLabel = css`
  font-family: ${THEME.fonts.hud};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const NavBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${THEME.z.nav};
  display: flex;
  gap: 1.5em;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1em clamp(1em, 2.5vw, 2.5em);
  border-bottom: 2px solid transparent;
  background-color: transparent;
  background-image: linear-gradient(to bottom, rgba(var(--color-dark-rgb), 0.72), rgba(var(--color-dark-rgb), 0));
  /* Size the scrim to the border box so it never repeats under the border. */
  background-origin: border-box;
  background-repeat: no-repeat;
  transition: background-color 0.35s ease, border-color 0.35s ease;

  /* A neon rule that lights once the page scrolls under the bar. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--city-accent) 20%, var(--neon-magenta) 64%, transparent);
    opacity: 0;
    transition: opacity 0.35s ease;
    pointer-events: none;
  }

  /*
   * The scrolled glass lives on this layer behind the bar's contents, not on
   * the bar itself: Chrome flickers the descendants of a backdrop-filter
   * element, and the dropdowns and city map are the bar's descendants.
   */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    transition: background-color 0.35s ease;
  }

  &[data-scrolled='true'] {
    border-bottom-color: var(--glass-border);
  }

  &[data-scrolled='true']::before {
    background-color: var(--glass-bg-strong);
  }

  &[data-scrolled='true']::after {
    opacity: calc(0.2 + 0.7 * var(--neon-glow-strength, 1));
  }

  a {
    color: var(--color-white);
    text-decoration: none;
  }

  @media (min-width: 601px) {
    &[data-scrolled='true']::before {
      -webkit-backdrop-filter: blur(14px) saturate(150%);
      backdrop-filter: blur(14px) saturate(150%);
    }
  }

  /* Phones skip the blur, so the bar needs denser glass to keep copy
     scrolling underneath from reading through. */
  @media (max-width: ${THEME.breakpoints.phone}) {
    &[data-scrolled='true']::before {
      background-color: rgba(var(--color-dark-rgb), 0.97);
    }
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    padding: 1em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    align-items: flex-start;
  }
`;

export const NavBrandGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.9em;
  min-width: 0;

  @media (max-width: ${THEME.breakpoints.phone}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4em;
  }
`;

/**
 * The brand. Rendered as a <p> (not an <h1>) so each page's own content
 * heading is the single, page-descriptive <h1>. Its box matches the original
 * 2.1em brand at a 1.3 line height so the bar keeps its height.
 */
export const NavBrand = styled.p`
  display: flex;
  align-items: center;
  gap: 0.24em;
  min-height: 1.3em;
  margin: 0;
  font-size: 2.1em;
  line-height: 1.3;
  white-space: nowrap;

  .signal {
    position: relative;
    flex-shrink: 0;
    width: 0.26em;
    height: 0.26em;
    margin: 0 0.12em;
  }

  .signal::before,
  .signal::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: rotate(45deg);
  }

  .signal::before {
    background: var(--neon-magenta);
    box-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) var(--neon-magenta);
  }

  .signal::after {
    inset: -0.12em;
    border: 1.5px solid var(--neon-magenta);
    opacity: 0;
    animation: ${signalPulse} 2.8s ${THEME.easing.out} infinite;
  }

  a {
    display: inline-flex;
    align-items: baseline;
    font-family: ${THEME.fonts.hud};
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-white);
    ${glitchOnHover}
  }

  .brand-first {
    margin-right: 0.35em;
  }

  .brand-tag {
    font-size: 0.5em;
    font-weight: 600;
    letter-spacing: 0.36em;
    color: var(--color-grey);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    align-items: flex-start;
    min-height: 1.1em;
    font-size: 1.9em;
    line-height: 1.1;
    white-space: normal;

    a {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.05em;
    }

    .brand-first {
      margin-right: 0;
    }

    .signal {
      margin-top: 0.3em;
    }
  }
`;

export const NavControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;

  /* The 44px targets overhang 2.2px each way, so the stacked phone bar keeps
     its original height. */
  @media (max-width: ${THEME.breakpoints.phone}) {
    margin-block: -2.2px;
  }
`;

export const NavLinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 2vw, 2.5rem);
  flex-shrink: 0;
  white-space: nowrap;

  > a {
    ${hudLabel}
    ${sweepUnderline}
    ${glitchOnHover}
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    transition: color 0.2s ease;
  }

  > a:hover,
  > a:focus-visible,
  > a[aria-current='page'] {
    color: var(--city-accent);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: none;
  }
`;

export const NavMenu = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  color: var(--color-white);
`;

export const NavMenuTrigger = styled.button`
  ${hudLabel}
  ${sweepUnderline}
  ${glitchOnHover}
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible,
  &[aria-expanded='true'],
  &[data-active='true'] {
    color: var(--city-accent);
  }

  &[aria-expanded='true']::after {
    transform: scaleX(1);
  }
`;

type ChevronProps = { $isOpen: boolean };

export const NavChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  flex-shrink: 0;

  svg {
    width: 1em;
    height: 1em;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.25;
    stroke-linecap: square;
    transform: ${(props: ChevronProps) => (props.$isOpen ? 'rotate(180deg)' : 'none')};
    transition: transform 0.25s ${THEME.easing.out};
  }
`;

type OpenProps = { $isOpen: boolean };

/** Glass dropdown with an accent bar and a corner bracket. */
export const NavDropdown = styled.ul`
  position: absolute;
  top: calc(100% + 0.5em);
  right: 0;
  z-index: ${THEME.z.dropdown};
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.25em 0.9em;
  margin: 0;
  padding: 1em 1em 0.9em;
  list-style: none;
  /* Opaque at night, so nothing animated shows through an open menu. */
  background-color: var(--menu-bg);
  background-image: linear-gradient(var(--scanline) 1px, transparent 1px);
  background-size: 100% 3px;
  border: 1px solid var(--glass-border);
  box-shadow: 0 18px 40px var(--shadow-deep);
  opacity: ${(props: OpenProps) => (props.$isOpen ? 1 : 0)};
  transform: ${(props: OpenProps) => (props.$isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  pointer-events: ${(props: OpenProps) => (props.$isOpen ? 'auto' : 'none')};
  transition: opacity 0.2s ease, transform 0.25s ${THEME.easing.out};

  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 34%;
    height: 2px;
    background: var(--city-accent);
    box-shadow: 0 0 calc(12px * var(--neon-glow-strength, 1)) var(--city-accent);
  }

  &::after {
    content: '';
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 14px;
    height: 14px;
    border-right: 2px solid var(--city-accent);
    border-bottom: 2px solid var(--city-accent);
  }

  li {
    display: flex;
    margin: 0;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.55em;
    width: 100%;
    min-height: 44px;
    padding: 0.3em 0.75em 0.3em 0.6em;
    border-left: 2px solid transparent;
    font-family: ${THEME.fonts.hud};
    font-size: 1.15em;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
  }

  a:hover,
  a:focus-visible,
  a[aria-current='page'] {
    color: var(--city-accent);
    border-left-color: var(--city-accent);
    background-color: rgba(var(--color-dark-rgb), 0.6);
  }

  .case-logo {
    width: 1.7em;
    height: 1.7em;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }
`;

/** Three bars that fold into an X inside a notched HUD square. */
export const MenuButton = styled(HudIconButton)`
  display: none;
  flex-shrink: 0;
  width: 44px;
  height: 44px;

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border: 1px solid var(--glass-border);
    background: rgba(var(--color-dark-rgb), 0.4);
    clip-path: ${notchPolygon('7px')};
    transition: border-color 0.25s ease;
  }

  .bar {
    position: absolute;
    left: 11px;
    width: 22px;
    height: 2px;
    background: currentColor;
    transition: transform 0.3s ${THEME.easing.out}, opacity 0.2s ease;
  }

  .bar:nth-child(1) {
    top: 14px;
  }

  .bar:nth-child(2) {
    top: 21px;
    left: 19px;
    width: 14px;
    background: var(--city-accent);
  }

  .bar:nth-child(3) {
    top: 28px;
  }

  &:hover::before,
  &[aria-expanded='true']::before {
    border-color: var(--city-accent);
  }

  &[aria-expanded='true'] .bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  &[aria-expanded='true'] .bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  &[aria-expanded='true'] .bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: inline-flex;
  }
`;

const mapEntry = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4em;
  width: 100%;
  min-height: 48px;
  padding: 0;
  border: 0;
  background: none;
  font-family: ${THEME.fonts.hud};
  font-size: 1.45em;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.1;
  text-align: left;
  text-transform: uppercase;
  color: var(--color-white);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: var(--city-accent);
  }
`;

const mapReadout = css`
  display: block;
  font-family: ${THEME.fonts.mono};
  font-size: 0.72em;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

type MapProps = { $isAnimating: boolean };

/**
 * The phone and tablet menu: a full-screen city map behind the bar. It sits
 * at z-index -1 inside the bar's stacking context, so the brand, toggles,
 * and close button stay on top. The exit animation must finish within the
 * 300ms unmount delay in AnimatedMobileMenu, and it never disables pointer
 * events (tests click into the menu in its exit state).
 */
export const CityMapMenu = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  margin: 0;
  padding: calc(4.9em + 1.25em) clamp(1.25em, 6vw, 3em) 1.5em;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
  counter-reset: map-item;
  /* Opaque, so nothing animated shows through the open map. */
  background-color: rgb(var(--color-dark-rgb));
  background-image:
    radial-gradient(ellipse 80% 40% at 90% 100%, rgba(47, 243, 255, 0.1), transparent 70%),
    linear-gradient(var(--scanline) 1px, transparent 1px),
    linear-gradient(90deg, var(--scanline) 1px, transparent 1px);
  background-size: auto, 32px 32px, 32px 32px;
  animation: ${(props: MapProps) => (props.$isAnimating
    ? css`${mapBoot} 0.42s ${THEME.easing.out} both`
    : css`${mapShutdown} 0.26s ease-in forwards`)};

  &::before {
    ${mapReadout}
    content: 'City map // choose a destination';
    content: 'City map // choose a destination' / '';
    margin-bottom: 0.75em;
    color: var(--city-accent);
  }

  &::after {
    ${mapReadout}
    content: 'Loc ▸ ' attr(data-location);
    content: 'Loc ▸ ' attr(data-location) / '';
    margin-top: auto;
    padding-top: 1.5em;
    color: var(--color-grey);
  }

  > li {
    counter-increment: map-item;
    display: grid;
    grid-template-columns: 2.4em minmax(0, 1fr);
    align-items: start;
    padding: 0.3em 0;
    border-bottom: 1px solid var(--glass-border);
    animation: ${mapItemIn} 0.4s ${THEME.easing.out} both;
  }

  > li:nth-child(2) {
    animation-delay: 0.05s;
  }

  > li:nth-child(3) {
    animation-delay: 0.1s;
  }

  > li:nth-child(4) {
    animation-delay: 0.15s;
  }

  > li:nth-child(5) {
    animation-delay: 0.2s;
  }

  > li::before {
    content: counter(map-item, decimal-leading-zero);
    content: counter(map-item, decimal-leading-zero) / '';
    display: flex;
    align-items: center;
    height: 48px;
    font-family: ${THEME.fonts.mono};
    font-size: 0.75em;
    color: var(--city-accent);
  }

  > li > a {
    ${mapEntry}
    grid-column: 2;
  }

  > li > a[aria-current='page'] {
    color: var(--city-accent);
  }

  > li > ul {
    grid-column: 2;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-top: calc(8.48em + 1em);
  }
`;

export const NavAccordionButton = styled.button`
  ${mapEntry}

  &[aria-expanded='true'] {
    color: var(--city-accent);
  }
`;

export const NavAccordionList = styled.ul`
  display: ${(props: OpenProps) => (props.$isOpen ? 'grid' : 'none')};
  gap: 0.1em;
  margin: 0 0 0.6em;
  padding: 0;
  list-style: none;

  li {
    margin: 0;
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.65em;
    min-height: 44px;
    padding: 0 0.6em;
    border-left: 2px solid transparent;
    font-family: ${THEME.fonts.hud};
    font-size: 1.2em;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: color 0.2s ease, border-color 0.2s ease;
  }

  a:hover,
  a:focus-visible,
  a[aria-current='page'] {
    color: var(--city-accent);
    border-left-color: var(--city-accent);
  }

  .case-logo {
    width: 1.6em;
    height: 1.6em;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }
`;
