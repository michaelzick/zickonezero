import styled, { css } from 'styled-components';
import { THEME } from './theme';
import {
  hudFrame,
  hudNotch,
  hudScrollbar,
  notchPolygon,
  notchStrokes,
  scanlines,
  screenOverlay
} from './hud';

// Accessible heading that is hidden from sighted users but exposed to
// assistive tech and search crawlers (used for image-only hero sections).
export const VisuallyHidden = styled.h1`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Container = styled.div`
  text-align: center;
  font-family: ${THEME.fonts.body};
  height: 100%;
  position: relative;

  // Inline UI icons sit at text size; city art opts out with data-art.
  svg:not([data-art]) {
    width: 1em;
    height: 1em;
    margin-left: 0.2em;
    flex-shrink: 0;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    // Hide the full screen icon in Lightbox
    .fslightbox-toolbar-button:nth-child(1) {
      display: none;
    }
  }
`;

export const WhiteTransitionAnchor = styled.a`
  color: ${THEME.colors.white};
  text-decoration-color: var(--city-accent);
  text-underline-offset: 0.18em;
  transition: color 0.25s ease, text-shadow 0.25s ease;
  ${props => props.large && 'font-size: 1.3em;'}

  &:hover {
    color: var(--city-accent);
    text-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) var(--city-glow);
  }
`;

export const PitchDeckLink = styled(WhiteTransitionAnchor)`
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
  margin-top: 0.4em;
  padding: 0.25em 0;
  color: var(--city-accent);
  font-family: ${THEME.fonts.mono};
  font-size: 0.9em;
  letter-spacing: 0.02em;
  text-decoration: none;

  &:hover {
    color: ${THEME.colors.white};
  }

  &.pitch-link-mobile {
    display: none;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    margin-left: 0;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.85em;
    padding: 0.35em 0;

    &.pitch-link-desktop {
      display: none;
    }

    &.pitch-link-mobile {
      display: inline-flex;
    }
  }
`;

export const Wrapper = styled.div`
  ${props => {
    if (props.isAtPage && props.$isProjectPage) return 'padding-top: 7em;';
    // The homepage hero runs full-bleed under the transparent nav.
    if (props.isHomePage) return 'padding-top: 0;';
    return 'padding-top: 5em;';
  }}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px); z-index: 300;'}
  ${props => props.isHomePage && `
    position: relative;
  `}

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    ${props => {
      if (props.isAtPage && props.$isProjectPage) return 'padding-top: 6em;';
      if (props.isHomePage) return 'padding-top: 0;';
      return 'padding-top: 5.2em;';
    }}
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    ${props => {
      if (props.isHomePage) return 'padding-top: 0;';
      if (props.isAtPage && props.$isProjectPage) return 'padding-top: 7em;';
      if (props.isAtPage) return 'padding-top: 13.5em;';
      return 'padding-top: 8.7em;';
    }}
  }
`;

export const FullBorderImage = styled.img`
  border: 1px solid var(--glass-border);
  border-radius: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const BioBox = styled.div`
  display: flex;
  justify-content: center;
  padding: ${props => props.noLeftRightPadding ? '4em 0' : '4em'};
  padding-top: ${props => props.noTopPadding ? '0' : '4em'};
  ${props => props.noBottomPadding && 'padding-bottom: 0;'}
  ${props => props.someTopPadding && 'padding-top: 1em;'}
  width: 100%;
  font-size: 25px;
  text-align: left;
  min-height: 84%;
  height: auto;

.biobox-inner {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 50em;

    &.demostoke-inner {
      max-width: 62em;

      .ds-logo,
      .at-logo,
      .ngu-logo {
        width: 6em;
      }

      section {
        scroll-margin-top: 10em;

        @media (max-width: ${THEME.breakpoints.largeTablet}) {
          scroll-margin-top: 7.2em;
        }

        @media (max-width: ${THEME.breakpoints.smallTablet}) {
          scroll-margin-top: 6.2em;
        }

        h3 {
          color: ${THEME.colors.orange};
        }
      }
    }

    span {
      a {
        text-decoration: none;
      }
    }

    .headshot {
      background: #000;
      border-radius: ${THEME.radii.md};
      overflow: hidden;

      img {
        display: block;
        border-radius: ${THEME.radii.md};
        width: 100%;
        height: auto;
        max-width: 18em;
        opacity: 0.9;
      }
    }

    .product-screenshot {
      max-width: 27em;

      img {
        width: 100%;
        height: auto;
        border-radius: ${THEME.radii.md};

        &.antisyphon-image {
          cursor: pointer;
          border: 1.5px solid ${THEME.colors.white};
          border-radius: ${THEME.radii.md};
          box-shadow: 0 30px 38px -30px rgb(0 0 0 / 75%);
          transition: border-color 0.2s ease;

          &:hover {
            border-color: ${THEME.colors.hotRed};
          }
        }
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      ${props => !props.isAboutPage && 'flex-direction: column;'}
      ${props => props.top && 'padding-top: 1.5em;'}
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      flex-direction: column;
    }
  }

  .text-wrapper {
    ${props => props.isAboutPage ? 'max-width: 27em; margin-right: 1em;' : 'max-width: 23em;'}
    ${props => props.direction && `margin-${props.direction}: 2em;`}

    a {
      transition: all 0.3s;
      color: ${THEME.colors.white};

      &:hover {
        color: ${THEME.colors.hotRed};
      }
    }

    .underline {
      text-decoration: underline;
      transition: all 0.3s;

      &:hover {
        color: ${THEME.colors.hotRed};
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      max-width: 22em;

      h2.gets-mobile-margin {
        margin-top: 1em;
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      margin-left: 0;
      margin-bottom: 2.5em;

      &.bottom {
        margin-bottom: 1em;
      }
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      max-width: none;
    }
  }

  h2.antisyphon {
    margin: 0;
  }

  .story-section {
    margin-top: 2.5em;

    &#section-tldr {
      margin-top: clamp(1.1em, 3.2vw, 1.6em);
    }
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    height: auto;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    padding: 1em;
    ${props => props.noBottomPadding && 'padding-bottom: 0;'}
    ${props => props.someTopPadding && 'padding-top: 1em;'}
  }
`;

/*
 * The footer is the city directory: a dark glass plate under a neon rule, a
 * decorative directory heading, and one lit column per district (magenta
 * case studies, cyan product engineering, amber links).
 */
export const Footer = styled.footer`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 100%;
  padding: 2.25em clamp(1.25em, 4vw, 3em) 2em;
  border-top: 1px solid var(--glass-border);
  background: linear-gradient(to bottom, rgba(var(--color-dark-rgb), 0.78), rgba(var(--color-dark-rgb), 0.95));
  font-family: ${THEME.fonts.hud};
  text-align: left;

  /* The neon rule along the top edge. */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    right: 0;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--neon-magenta), var(--neon-cyan) 50%, var(--neon-amber));
    box-shadow: 0 0 calc(12px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.4);
  }

  .footer-directory {
    display: flex;
    align-items: center;
    gap: 0.9em;
    margin: 0;
    color: var(--hud-ink-dim);
    font-family: ${THEME.fonts.mono};
    font-size: 0.78em;
    letter-spacing: 0.22em;
    text-transform: uppercase;

    span[lang] {
      color: var(--neon-cyan);
      font-family: ${THEME.fonts.cjk};
      letter-spacing: 0.12em;
    }

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--glass-border), transparent);
    }
  }

  html[data-theme='light'] & .footer-directory {
    color: var(--color-grey);
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    gap: 1.5em;
    padding: 2em 1.5em;
  }
`;

export const FooterInner = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2em;
  width: 100%;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    grid-template-columns: 1fr;
    gap: 1.8em;
  }
`;

export const FooterColumn = styled.div`
  --footer-tone: var(--neon-cyan);
  --footer-glow: rgba(47, 243, 255, 0.45);
  display: flex;
  flex-direction: column;
  gap: 0.75em;
  align-items: flex-start;

  &:nth-child(1) {
    --footer-tone: var(--neon-magenta);
    --footer-glow: rgba(255, 43, 214, 0.45);
  }

  &:nth-child(3) {
    --footer-tone: var(--neon-amber);
    --footer-glow: rgba(255, 176, 59, 0.45);
  }
`;

export const FooterColumnTitle = styled.h3`
  margin: 0;
  padding-left: 0.65em;
  border-left: 3px solid var(--footer-tone, var(--neon-cyan));
  color: var(--footer-tone, var(--neon-cyan));
  font-family: ${THEME.fonts.hud};
  font-size: 0.95em;
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.2;
  text-align: left;
  text-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) var(--footer-glow, transparent);
  text-transform: uppercase;
`;

export const FooterColumnLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-start;

  li {
    margin: 0;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    color: ${THEME.colors.white};
    font-size: 1.02em;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-decoration: none;
    transition: color 0.2s ease, text-shadow 0.2s ease;

    /* A route marker, left out of the link's name. */
    &::before {
      content: '▸';
      content: '▸' / '';
      color: var(--footer-tone, var(--neon-cyan));
      opacity: 0.45;
      transition: opacity 0.2s ease, transform 0.2s ${THEME.easing.out};
    }

    &:hover,
    &:focus-visible {
      color: var(--footer-tone, var(--neon-cyan));
      text-shadow: 0 0 calc(8px * var(--neon-glow-strength, 1)) var(--footer-glow, transparent);
    }

    &:hover::before,
    &:focus-visible::before {
      opacity: 1;
      transform: translateX(2px);
    }

    svg {
      width: 0.9em;
      height: 0.9em;
    }
  }
`;

export const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5em;
  width: 100%;
  padding-top: 1.1em;
  border-top: 1px dashed var(--glass-border);
  color: ${THEME.colors.grey};
  font-family: ${THEME.fonts.mono};
  font-size: 0.8em;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;
  }
`;

export const DemoStokeTitle = styled.h2`
  color: ${THEME.colors.white};
  font-size: clamp(1.55em, 3.5vw, 2.15em);
  line-height: 1.1;
  margin: 0 0 0.45em;
  padding-top: ${props => (props.$noMobileTopPad ? '0' : 'clamp(0.65em, 1.8vw, 1.1em)')};

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-top: 0;
  }
`;

/* Data readout tables: glass rows with an accent rail; the tinted variant
   adds scanlines. */
export const DemoStokeTwoColumnLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  padding: clamp(0.9em, 2vw, 1.45em) clamp(1.2em, 3vw, 2em);
  border: 1px solid var(--glass-border);
  border-left: 2px solid var(--city-accent);
  background: ${props => props.$variant === 'tinted'
    ? `${scanlines}, rgba(var(--color-dark-rgb), 0.45)`
    : 'rgba(var(--color-dark-rgb), 0.25)'};
`;

export const DemoStokeTwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(0.95em, 3vw, 2.6em);
  row-gap: 0.35em;
  align-items: baseline;
  padding: 0.45em 0;

  &:not(:last-child) {
    border-bottom: ${props => props.$isBorderless ? 'none' : '1px dashed var(--glass-border)'};
    padding-bottom: clamp(0.75em, 1.8vw, 1.1em);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    padding: 0.6em 0;
  }
`;

export const DemoStokeTwoColumnHeader = styled.div`
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.05em, 2vw, 1.25em);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const DemoStokeTwoColumnCopy = styled.div`
  color: ${THEME.colors.white};
  line-height: 1.55;

  .plain-lines {
    margin: 0;

    ul& {
      padding-left: 1.1em;
      list-style: disc;
    }

    li {
      margin: 0 0 0.5em;
    }

    li:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0 0 0.6em;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
`;

export const DemoStokeTldrSection = styled.div`
`;

export const DemoStokeTldrRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(1em, 3vw, 2.35em);
  align-items: flex-start;
  > * {
    min-width: 0;
  }

  ${props => props.$reverse && `
    & > :first-child {
      order: 2;
    }

    & > :nth-child(2) {
      order: 1;
    }
  `}

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    gap: 0.9em;

    ${props => props.$reverse && `
      & > :first-child {
        order: 1;
      }

      & > :nth-child(2) {
        order: 2;
      }
    `}
  }
`;

export const DemoStokeTldrTitle = styled.h3`
  margin: 0 0 0.35em;
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.55em, 3.5vw, 2.15em);
  font-weight: 700;
  line-height: 1.05;
  color: ${THEME.colors.white};
  letter-spacing: 0.02em;
`;

export const DemoStokeTldrCopy = styled.div`
  color: ${THEME.colors.white};
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;

  a {
    font-weight: 600;
    color: ${THEME.colors.white};
    text-decoration-color: var(--city-accent);
    text-underline-offset: 0.18em;
    transition: color 0.2s ease;

    &:hover {
      color: var(--city-accent);
    }
  }

  .plain-lines {
    margin: 0;

    ul& {
      padding-left: 1.1em;
      list-style: disc;
    }

    li {
      margin: 0 0 0.5em;
    }

    li::marker {
      color: var(--city-accent);
    }

    li:last-child {
      margin-bottom: 0;
    }
  }
`;

export const DemoStokeTldrImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 2px;
  border: 1px solid var(--glass-border);
  object-fit: contain;
  box-shadow: 0 24px 38px -30px var(--shadow-deep);
  display: block;
`;

export const DemoStokeTldrList = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.35em, 3.4vw, 2.7em);

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    gap: clamp(1em, 2.6vw, 1.6em);
  }
`;

export const DemoStokeMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(4em, 8vw, 6.5em);

  h3 {
    font-size: clamp(1.15em, 2.8vw, 1.75em);
  }
`;

export const DemoStokeMethodCard = styled.div`
  width: 100%;
`;

export const DemoStokeMethodRow = styled(DemoStokeTldrRow)`
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: center;
  gap: clamp(1.2em, 3vw, 2.2em);

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    gap: 1em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: 0.8em;
  }
`;

export const DemoStokeAccordion = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.55em;
`;

/* Accordion items are notched glass plates; the edge lights up in the
   accent when open or hovered. */
export const DemoStokeAccordionItem = styled.div`
  --item-notch: 10px;
  --item-edge: ${props => props.$isOpen ? 'var(--city-accent)' : 'var(--glass-border)'};
  border: 1px solid var(--item-edge);
  background-color: rgba(var(--color-dark-rgb), 0.4);
  background-image: ${notchStrokes('var(--item-notch)', 'var(--item-edge)')};
  background-origin: border-box;
  background-repeat: no-repeat;
  ${hudNotch('var(--item-notch)')}
  box-shadow: ${props => props.$isOpen ? 'inset 0 0 28px -14px var(--city-glow)' : 'none'};
  transition: border-color 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    --item-edge: var(--city-accent);
  }
`;

export const DemoStokeAccordionHeader = styled.button`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1em;
  padding: 0.95em 1.05em;
  cursor: pointer;
  color: ${THEME.colors.white};

  /* The item is clipped, so the ring sits inside it. */
  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -5px;
  }
`;

export const DemoStokeAccordionTitle = styled.span`
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.1em, 2vw, 1.3em);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const DemoStokeAccordionChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1em;
  height: 2.1em;
  padding: 0;
  flex-shrink: 0;
  color: ${props => props.$isOpen ? 'var(--city-accent)' : 'inherit'};
  background: transparent;
  border: none;
  box-shadow: none;
  transform-origin: center;

  svg {
    width: 1.35em;
    height: 1.35em;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transform-origin: center;
    transition: transform 0.2s ease;
  }
`;

export const DemoStokeAccordionContent = styled.div`
  overflow: hidden;
  max-height: ${props => props.$isOpen ? '420px' : '0px'};
  opacity: ${props => props.$isOpen ? 1 : 0};
  padding: ${props => props.$isOpen ? '0 1.05em 1.05em' : '0 1.05em 0'};
  transition: max-height 0.3s ease, opacity 0.25s ease, padding 0.25s ease;

  @media (max-width: ${THEME.breakpoints.phone}) {
    max-height: ${props => props.$isOpen ? '1200px' : '0px'};
  }
`;

export const DemoStokeAccordionCopy = styled.div`
  color: ${THEME.colors.white};
  font-size: 0.98em;
  line-height: 1.65;

  .plain-lines {
    margin: 0;

    ul& {
      padding-left: 1.1em;
      list-style: disc;
    }

    li {
      margin: 0 0 0.5em;
    }

    li:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0 0 0.6em;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
`;

export const DemoStokeTwoUp = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(1.1em, 3vw, 2.4em);
  align-items: flex-start;
  width: 100%;

  & > section {
    margin: 0;

    h3 {
      margin: 0 0 0.4em;
    }

    p {
      margin: 0;
    }
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

export const DemoStokeWhyImageFrame = styled.div`
  margin-top: clamp(1em, 2vw, 1.5em);
  overflow: hidden;
  box-shadow: 0 16px 38px -24px var(--shadow-deep);

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export const DemoStokeScrollSection = styled.section`
  margin-top: 0.2em;
`;

export const DemoStokeScrollRow = styled.div`
  display: flex;
  gap: clamp(0.9em, 2vw, 1.35em);
  overflow-x: auto;
  padding: 0.4em 0.2em 0.5em;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  ${hudScrollbar}

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-right: 0.25em;
  }
`;

export const DemoStokeScrollItem = styled.div`
  position: relative;
  min-width: clamp(12.8em, 45vw, 15em);
  max-width: 18em;
  flex: 0 0 auto;
  border: 1px solid var(--glass-border);
  overflow: hidden;
  background: ${THEME.colors.darkest};
  cursor: pointer;
  scroll-snap-align: start;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  ${screenOverlay}

  &:hover {
    border-color: var(--city-accent);
    box-shadow: 0 0 14px -4px var(--city-glow);
  }

  /* The row scrolls and clips, so the ring sits inside the item. */
  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -4px;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-width: 11.5em;
    max-width: 11.5em;
  }
`;

export const DemoStokeScrollImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 16 / 9;
`;

export const DemoStokeScrollHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75em;
  margin: 0.3em 0 0.3em;

  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: 0.5em;
  }
`;

export const DemoStokeScrollControls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.65em;
`;

/* Notched square HUD buttons with a 44px minimum target. */
export const DemoStokeScrollButton = styled.button`
  all: unset;
  --btn-notch: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: max(44px, 1.8em);
  height: max(44px, 1.8em);
  border: 1px solid var(--glass-border);
  background-color: rgba(var(--color-dark-rgb), 0.6);
  background-image: ${notchStrokes('var(--btn-notch)', 'var(--city-accent)')};
  background-origin: border-box;
  background-repeat: no-repeat;
  ${hudNotch('var(--btn-notch)')}
  color: ${THEME.colors.white};
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover:enabled {
    transform: translateY(-1px);
    border-color: var(--city-accent);
    color: var(--city-accent);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -5px;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    display: block;
    transform: translateX(-0.10em);
  }
`;

export const DemoStokeMiniCardRow = styled.div`
  display: flex;
  gap: clamp(0.9em, 2vw, 1.35em);
  overflow-x: auto;
  padding: 0.35em 0.2em 0.5em;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  ${hudScrollbar}

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-right: 0.25em;
  }
`;

/* Notched glass cards; the clip keeps focus rings inside the card. */
export const DemoStokeMiniCard = styled.button`
  all: unset;
  --card-notch: 12px;
  --card-edge: var(--glass-border);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: clamp(13em, 48vw, 15.5em);
  max-width: 18em;
  padding: clamp(1em, 2.3vw, 1.4em);
  border: 1px solid var(--card-edge);
  background-color: rgba(var(--color-dark-rgb), 0.55);
  background-image:
    ${notchStrokes('var(--card-notch)', 'var(--card-edge)')},
    linear-gradient(160deg, var(--glass-highlight), transparent 45%);
  background-origin: border-box;
  background-repeat: no-repeat;
  ${hudNotch('var(--card-notch)')}
  color: ${THEME.colors.white};
  scroll-snap-align: start;
  text-align: left;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;

  &:hover,
  &:focus-visible {
    --card-edge: var(--city-accent);
    box-shadow: inset 0 0 30px -14px var(--city-glow);
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -5px;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-width: 12em;
    max-width: 12em;
  }
`;

export const DemoStokeMiniCardTitle = styled.div`
  margin: 0 0 0.5em;
  color: ${THEME.colors.white};
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.05em, 2vw, 1.25em);
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.15;
`;

export const DemoStokeMiniCardPreview = styled.div`
  color: ${THEME.colors.white};
  opacity: 0.92;
  line-height: 1.6;
  font-size: 0.98em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  p {
    margin: 0;
  }
`;

export const DemoStokeMiniCardHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin-top: auto;
  padding-top: clamp(0.6em, 1vw, 0.85em);
  color: var(--city-accent);
  font-family: ${THEME.fonts.mono};
  font-size: 0.78em;
  letter-spacing: 0.16em;
  text-transform: uppercase;

  &::after {
    content: '↗';
    content: '↗' / '';
    font-size: 1.1em;
  }
`;

export const DemoStokeStoryHero = styled.img`
  width: 100%;
  display: block;
  border-radius: 0;
  border: 1px solid var(--glass-border);
  object-fit: cover;
  object-position: top;
  margin: 0;
  box-shadow: 0 12px 28px -20px var(--shadow-deep);
`;

export const DemoStokeHeroAbstractLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(1em, 3vw, 2.6em);
  align-items: stretch;
  margin: clamp(0.8em, 2vw, 1.3em) 0 clamp(1.2em, 2.6vw, 2em);

  ${DemoStokeStoryHero} {
    height: 100%;
  }

  ${DemoStokeTldrSection} {
    min-height: 100%;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    gap: clamp(0.8em, 2.2vw, 1.3em);

    ${DemoStokeStoryHero} {
      height: auto;
    }

    ${DemoStokeTldrSection} {
      min-height: 0;
    }
  }
`;

/*
 * Dialogs: a "shard reader" with a dark glass plate and light ink in both
 * themes. Portal it to the body when it opens inside a glass panel, since
 * the panel's stacking context would hold it under the fixed nav.
 */
export const DemoStokeMiniCardModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1em, 3vw, 2em);
  background: var(--modal-scrim);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
`;

export const DemoStokeMiniCardModal = styled.div`
  ${hudFrame({ blur: false })}
  --hud-notch: 20px;
  --hud-frame-bg: ${scanlines}, var(--modal-bg);
  /* The plate stays dark by day, so keep the night sheen and teal, and a
     yellow focus ring that reads on it in both themes. */
  --glass-highlight: rgba(255, 255, 255, 0.06);
  --hud-teal: #5ef6e6;
  --focus-ring: var(--hud-yellow);
  width: min(720px, 95vw);
  max-height: 88vh;
  overflow: hidden;
  padding: clamp(1.2em, 2.5vw, 1.85em);
  color: var(--hud-ink);
  filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.5));
`;

export const DemoStokeMiniCardModalClose = styled.button`
  all: unset;
  position: absolute;
  /* Clear the plate's notched corner with room to breathe. */
  top: 1em;
  right: calc(var(--hud-notch, 20px) + 0.6em);
  z-index: 1;
  width: 2em;
  height: 2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--hud-ink);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--hud-panel-border);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  svg {
    width: 1em;
    height: 1em;
    display: block;
    transform: translateX(-0.09em);
  }

  &:hover {
    color: var(--hud-yellow);
    border-color: var(--hud-yellow);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 3px;
  }
`;

export const DemoStokeMiniCardModalTitle = styled.h4`
  margin: 0 0 0.65em;
  padding-right: 2em;
  color: var(--hud-ink);
  font-family: ${THEME.fonts.hud};
  font-size: clamp(1.25em, 2.3vw, 1.5em);
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.15;
  text-transform: uppercase;
  text-shadow: 0 0 0.5em var(--city-glow);
`;

export const DemoStokeMiniCardModalCopy = styled.div`
  color: var(--hud-ink);
  line-height: 1.7;
  font-size: 1em;
  max-height: calc(88vh - 4em);
  overflow-y: auto;
  padding-right: 0.4em;
  ${hudScrollbar}

  p {
    margin: 0 0 0.8em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--hud-ink);
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: var(--hud-yellow);
    text-underline-offset: 0.18em;

    &:hover {
      color: var(--hud-yellow);
    }
  }
`;

/*
 * HUD tabs: notched plates with stroked notch diagonals. The plate itself is
 * clipped, so focus rings sit inside it. Active tabs fill with the brand
 * accent and white text; the case-study tab tests read those declarations
 * from the [data-active='true'] rules, so keep them explicit.
 */
export const HudTabButton = styled.button.attrs(({ $isActive }) => ({
  'data-active': $isActive ? 'true' : 'false',
}))`
  all: unset;
  box-sizing: border-box;
  --tab-notch: 9px;
  --tab-edge: var(--glass-border);
  position: relative;
  width: 100%;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6em;
  padding: 0.55em 1em;
  border: 1px solid var(--tab-edge);
  ${hudNotch('var(--tab-notch)')}
  background-color: rgba(var(--color-dark-rgb), 0.55);
  background-image: ${notchStrokes('var(--tab-notch)', 'var(--tab-edge)')};
  background-origin: border-box;
  background-repeat: no-repeat;
  color: ${THEME.colors.white};
  font-family: ${THEME.fonts.hud};
  font-size: 1.05em;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.15;
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  overflow-wrap: break-word;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  &[data-active='true'] {
    --tab-edge: ${THEME.colors.accent};
    background-color: ${THEME.colors.accent};
    border-color: ${THEME.colors.accent};
    color: #fff;
    box-shadow: inset 0 0 18px rgba(255, 255, 255, 0.16), inset 0 -2px 0 rgba(255, 255, 255, 0.5);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.45);
  }

  &:not([data-active='true']):hover {
    --tab-edge: var(--city-accent);
    background-color: rgba(var(--color-dark-rgb), 0.82);
    color: var(--city-accent);
    box-shadow: inset 0 0 18px -6px var(--city-glow);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: -5px;
  }

  &[data-active='true']:focus-visible {
    outline-color: #fff;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.79em;
    letter-spacing: 0.08em;
  }
`;

export const CaseStudyTopTabButton = styled(HudTabButton)`
  --tab-edge: var(--case-study-top-tab-border);
  background-color: var(--case-study-top-tab-bg);
  color: var(--case-study-top-tab-color);

  /* A status diamond, lit on the active tab. */
  &::before {
    content: '';
    flex-shrink: 0;
    width: 0.5em;
    height: 0.5em;
    background: currentColor;
    clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
    opacity: 0.45;
    transition: opacity 0.25s ease;
  }

  &[data-active='true'] {
    --tab-edge: ${THEME.colors.accent};
    background-color: ${THEME.colors.accent};
    border-color: ${THEME.colors.accent};
    color: #fff;
  }

  &[data-active='true']::before,
  &:hover::before {
    opacity: 1;
  }
`;

const sidebarTabButtonStyles = css`
  --tab-notch: 7px;
  --tab-edge: var(--section-tab-border);
  background-color: var(--section-tab-bg);
  color: var(--section-tab-color);

  &[data-active='true'] {
    --tab-edge: ${THEME.colors.accent};
    background-color: ${THEME.colors.accent};
    border-color: ${THEME.colors.accent};
    color: #fff;
  }
`;

/* The rails' glass plate and the reading-progress line along their foot. */
const railPlate = (notch) => css`
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid var(--glass-border);
    background:
      ${notchStrokes(notch, 'var(--glass-border)')},
      linear-gradient(180deg, var(--glass-highlight), transparent 65%),
      rgba(var(--color-dark-rgb), 0.9);
    clip-path: ${notchPolygon(notch)};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    bottom: 3px;
    left: 12px;
    height: 2px;
    background: linear-gradient(90deg, var(--city-accent), var(--neon-cyan));
    box-shadow: 0 0 8px var(--city-glow);
    transform: scaleX(var(--page-progress, 0));
    transform-origin: left center;
    pointer-events: none;
  }

  @media (min-width: 601px) {
    &::before {
      background:
        ${notchStrokes(notch, 'var(--glass-border)')},
        linear-gradient(180deg, var(--glass-highlight), transparent 65%),
        rgba(var(--color-dark-rgb), 0.8);
      -webkit-backdrop-filter: blur(10px) saturate(130%);
      backdrop-filter: blur(10px) saturate(130%);
    }
  }
`;

export const SectionTabsWrapper = styled.div`
  position: fixed;
  top: var(--sidebar-tabs-top, calc(5em + 4.4em));
  left: 50%;
  transform: translate(-50%, ${props => props.$isVisible ? '0' : '-10px'});
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 0.4em;
  width: min(calc(100% - 2.4em), 62em);
  padding: 0.4em 0.4em 0.6em;
  counter-reset: rail;
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  transition: opacity 0.28s ease, transform 0.28s ease;
  z-index: 94;
  ${railPlate('12px')}

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: none;
    position: static;
  }
`;

export const SectionTabButton = styled(HudTabButton)`
  ${sidebarTabButtonStyles}
  flex: 1 1 0;
  min-width: 0;
  width: auto;
  padding: 0.5em 0.8em;
  font-size: 0.72em;
  letter-spacing: 0.1em;
  line-height: 1.2;
  counter-increment: rail;

  /* Segment numbers come from a counter so the button text stays the label. */
  &::before {
    content: counter(rail, decimal-leading-zero);
    content: counter(rail, decimal-leading-zero) / '';
    flex-shrink: 0;
    font-family: ${THEME.fonts.mono};
    font-size: 0.8em;
    font-weight: 400;
    letter-spacing: 0.04em;
    opacity: 0.6;
  }

  &[data-active='true']::before {
    opacity: 1;
  }

  @media (max-width: 1280px) {
    font-size: 0.65em;
    padding: 0.5em 0.65em;
  }
`;

export const SectionTabsMobileWrapper = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: flex;
    position: ${props => props.$isFixed ? 'fixed' : 'sticky'};
    top: var(--mobile-tabs-top, 8.5em);
    z-index: 94;
    width: 100%;
    padding: 0 1.2em;
    margin: 0 auto 1.25em;
  }
`;

export const SectionTabsMobileInner = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 0.35em;
  width: 100%;
  max-width: 46em;
  margin: 0 auto;
  padding: 0.35em 0.35em 0.55em;
  ${railPlate('10px')}
`;

export const SectionTabsMobileButton = styled(HudTabButton)`
  ${sidebarTabButtonStyles}
  flex: 1 1 0;
  min-width: 0;
  width: auto;
  padding: 0.55em 0.45em;
  font-size: 0.95em;
  letter-spacing: 0.08em;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.8em;
    letter-spacing: 0.05em;
  }
`;

/*
 * The case-study tab bar docks under the nav as a glass HUD strip with an
 * accent rule. Its top offsets match the nav heights, which the section
 * rails and their scroll math read back.
 */
export const DemoStokeTabsBar = styled.div`
  position: fixed;
  top: 5em;
  left: 0;
  right: 0;
  display: flex;
  gap: 0.6em;
  padding: 0.4em 1em 0.45em;
  z-index: 95;
  border-bottom: 1px solid var(--glass-border);
  background: linear-gradient(180deg, rgba(var(--color-dark-rgb), 0.95), rgba(var(--color-dark-rgb), 0.86));
  box-shadow: 0 14px 28px -24px var(--shadow-deep);

  /* The nav ends a few pixels above this bar's offset; fill that seam so
     scrolling copy never peeks through between the two glass layers. */
  &::before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 100%;
    left: 0;
    height: 3px;
    background: rgba(var(--color-dark-rgb), 0.95);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: -1px;
    left: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--city-accent) 20%, var(--city-accent) 80%, transparent);
    opacity: 0.7;
    pointer-events: none;
  }

  @media (min-width: 601px) {
    background: linear-gradient(180deg, rgba(var(--color-dark-rgb), 0.88), rgba(var(--color-dark-rgb), 0.74));
    -webkit-backdrop-filter: blur(12px) saturate(130%);
    backdrop-filter: blur(12px) saturate(130%);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    top: 4.9em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 8.48em;
  }
`;
