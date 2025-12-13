import styled, { keyframes, css } from 'styled-components';
import * as Select from '@radix-ui/react-select';
import { THEME } from './theme';

const phraseCycle = keyframes`
  0%, 25% { transform: translateY(0); opacity: 1; }
  30% { transform: translateY(-100%); opacity: 0; }
  31%, 100% { transform: translateY(100%); opacity: 0; }
`;

export const Container = styled.div`
  background-size: cover;
  text-align: center;
  font-family: Roboto, sans-serif;
  height: 100%;
  position: relative;

  svg {
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

export const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;

  .page-header {
    margin: 0;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;

    .ds-logo {
      width: clamp(3.5rem, 28vw, 5.25rem);
      height: auto;
    }

    .tab-header {
      font-size: 1.05em;
      text-align: left;
      margin: 0;
    }
  }
`;

export const WhiteTransitionAnchor = styled.a`
  transition: all 0.3s;
  color: ${THEME.colors.white};
  ${props => props.large && 'font-size: 1.3em;'}

  &:hover {
    color: ${THEME.colors.hotRed};
  }
`;

export const DemoStokeExternalLink = styled(WhiteTransitionAnchor)`
  display: inline-flex;
  justify-self: start;
  align-items: center;
  gap: 0.35em;
  line-height: 1.15;
  width: max-content;

  svg {
    width: 1.05em;
    height: 1.05em;
    margin-left: 0;
  }
`;

export const PitchDeckLink = styled(WhiteTransitionAnchor)`
  display: inline-flex;
  align-items: center;
  gap: 0.2em;
  margin-top: 0.4em;
  font-size: 0.95em;
  padding: 0.25em 0;

  &.pitch-link-mobile {
    display: none;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    margin-left: 0;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.9em;
    padding: 0.35em 0;

    &.pitch-link-desktop {
      display: none;
    }

    &.pitch-link-mobile {
      display: inline-flex;
    }
  }
`;

export const WorkSectionHeader = styled.span`
  display: inline-block;
  font-family: monospace;
  font-size: 2em;
  padding: 0 0.5em;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.3em;
  }
`;

export const AnimatedHeadlineWrapper = styled.h1`
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap;
  gap: 0.35em;
  max-width: 100em;
  width: 100%;
  margin: 0 auto 1em;
  padding: 0 0.5em;
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  font-size: 1.8em;
  font-weight: 500;
  line-height: 1.1;
  text-align: left;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    font-size: 1.5em;
    margin: 0 auto 0.9em;
    padding: 0 0.5em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.2em;
    gap: 0.25em;
    margin: 0 auto 0.8em;
    padding: 0 0.5em;
  }
`;

export const AnimatedHeadlineStatic = styled.span`
  white-space: nowrap;
  display: inline-flex;
  align-items: baseline;
`;

export const AnimatedHeadlineDynamic = styled.span`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  overflow: hidden;
  min-height: 1.25em;
  line-height: 1.25;
  min-width: 0;
`;

export const AnimatedHeadlineTrack = styled.span`
  position: absolute;
  inset: 0;
  display: block;
`;

export const AnimatedHeadlinePhrase = styled.span`
  position: absolute;
  left: 0;
  top: 0;
  display: inline-flex;
  align-items: center;
  width: 100%;
  min-height: 1.25em;
  line-height: 1.25;
  color: ${THEME.colors.hotRed};
  transform: translateY(100%);
  opacity: 0;
  animation: ${phraseCycle} 12s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
  animation-fill-mode: forwards;
  will-change: transform, opacity;
`;

export const AnimatedHeadlineSizer = styled.span`
  visibility: hidden;
  pointer-events: none;
  display: block;
  width: 100%;
  min-height: 1.25em;
  white-space: normal;
`;

export const Wrapper = styled.div`
  ${props => {
    if (props.isAtPage && props.$isProjectPage) return 'padding-top: 7em;';
    if (props.isHomePage) return 'padding-top: 7.7em;';
    return 'padding-top: 5em;';
  }}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px); z-index: 300;'}
  ${props => props.isHomePage && `
    position: relative;
  `}
  background-color: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    ${props => {
      if (props.isAtPage && props.$isProjectPage) return 'padding-top: 6em;';
      if (props.isHomePage) return 'padding-top: 6.9em;';
      return 'padding-top: 5.2em;';
    }}
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    ${props => {
      if (props.isHomePage) return 'padding-top: 9.6em;';
      if (props.isAtPage && props.$isProjectPage) return 'padding-top: 7em;';
      if (props.isAtPage) return 'padding-top: 13.5em;';
      return 'padding-top: 8.7em;';
    }}
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 1em 3em 1em 2.5em;
  display: flex;
  border-bottom: 2px dotted ${THEME.colors.grey};
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 400;
  background-color: ${THEME.colors.dark};
  transition: filter 0.3s;

  a {
    transition: all 0.3s;
    font-family: Roboto, sans-serif;
    color: ${THEME.colors.white};
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    text-decoration: none;

    &:hover {
      color: ${THEME.colors.hotRed};
    }
  }

  svg {
    color: inherit;
    fill: currentColor;
    margin-left: 0;
    transition: color 0.3s;
  }

  @media (max-width: 979px) {
    padding: 1em 1em;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    padding: 1em 1em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    align-items: flex-start;
  }
`;

export const MenuIcon = styled.div`
  display: none;
  cursor: pointer;

  .bar1, .bar2, .bar3 {
    width: 35px;
    height: 5px;
    background-color: ${THEME.colors.white};
    margin: 6px 0;
    transition: 0.4s;
  }

  &.change {
    .bar1 {
      transform: translate(0, 11px) rotate(-45deg);
    }
    .bar2 {opacity: 0;}
    .bar3 {
      transform: translate(0, -11px) rotate(45deg);
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: inline-block;
  }
`;

export const Button = styled.a`
  cursor: pointer;
  position: relative;
  display: flex;
  overflow: hidden;
  height: 44px;
  padding: 0 3em;
  justify-content: center;
  align-items: center;
  grid-auto-columns: 1fr;
  grid-template-columns: auto;
  grid-template-rows: auto;
  border-radius: ${THEME.radii.md};
  background-color: ${props => props.bgColor || THEME.colors.grey};
  transition: transform 150ms,box-shadow 150ms,-webkit-transform 150ms;
  color: #fff;
  font-size: 16px;
  line-height: 1.4em;
  font-weight: 500;
  text-align: center;
  letter-spacing: .5px;
  &:hover {
    box-shadow: 0 10px 20px -8px rgb(0 0 0 / 53%);
  }
`;

export const GridContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 1em;
  background-color: ${THEME.colors.dark};

  .grid {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 100em;

    @media (max-width: ${THEME.breakpoints.phone}) {
      width: 100%;
      flex-direction: column;
    }
  }
`;

export const Image = styled.img`
  width: 100%;
  border-radius: ${THEME.radii.md};
  border: 1.5px solid ${THEME.colors.white};
`;

export const FullBorderImage = styled(Image)`
  border: none;
  border-radius: ${THEME.radii.md};
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const Thumb = styled.div`
  text-align: center;
  font-family: Roboto, sans-serif;
  margin: 3em 2em 1.5em;
  color: ${THEME.colors.white};

  img {
    transition: all 0.3s;
    border-radius: ${THEME.radii.md};
    cursor: pointer;
  }

  h3 {
    transition: all 0.3s;
    margin: 0.6em 0 0;
  }

  p {
    transition: all 0.3s;
    width: 240px;
    text-align: center;
    margin: 0 auto;
    line-height: 1.4;

    .external-link-icon {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      position: relative;
      top: -0.05em;

      svg {
        width: 0.95em;
        height: 0.95em;
      }
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    display: inline;

    &:hover {
      color: inherit;
    }
  }

  &:hover {
    h3, p {
      color: ${THEME.colors.hotRed};
      cursor: pointer;
    }
  }

  .thumb-media {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: ${THEME.radii.md};
  }

  .neon-trail-thumb {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0.9;
    transition: opacity 0.2s ease-out;
    border-radius: ${THEME.radii.md};
  }

  .thumb-media .cursor-dot {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    mix-blend-mode: screen;
    opacity: 0;
    transform: translate3d(-9999px, -9999px, 0);
    transition: opacity 0.2s ease-out;
  }

  .thumb-dot {
    width: 12px;
    height: 12px;
    box-shadow: 0 0 14px hsla(170, 100%, 65%, 0.8);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    margin: 2em 0 1em;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 2.1em;
  font-family: system-ui;
  line-height: 1.3;
  white-space: nowrap;
  transition: all 0.3s;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}

  a {
    display: inline-flex;
    align-items: baseline;
    text-decoration: none;
    color: ${THEME.colors.white};
    transition: color 0.3s;

    &:hover {
      color: ${THEME.colors.hotRed};
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      font-size: 0.8em;
    }

    @media (max-width: ${THEME.breakpoints.phone}) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.05em;
      white-space: normal;
    }
  }

  .brand-line {
    display: inline;
    &.brand-first {
      margin-right: 0.18em;
    }

    @media (max-width: ${THEME.breakpoints.phone}) {
      display: block;
      margin-right: 0;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.9em;
    white-space: normal;
    line-height: 1.1;
  }
`;

export const LinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 29em;

  a {
    margin-top: 0.8em;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const CaseStudiesChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05em;
  height: 1.05em;
  flex-shrink: 0;
  vertical-align: middle;

  svg {
    width: 1.05em;
    height: 1.05em;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transform-origin: center;
    transition: transform 0.2s ease;
    color: inherit;
  }
`;

export const CaseStudiesDesktopWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-top: 0.8em;
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  cursor: pointer;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const CaseStudiesTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  padding: 0;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${THEME.colors.hotRed};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotRed};
    outline-offset: 4px;
  }
`;

export const CaseStudiesDropdown = styled.ul`
  position: absolute;
  top: calc(100% + 0.65em);
  right: 0;
  list-style: none;
  margin: 0;
  padding: 0.75em 1em;
  background: ${THEME.colors.darkest};
  border-radius: ${THEME.radii.md};
  border: 2px solid ${THEME.colors.white};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-auto-rows: auto;
  gap: 0.9em 1.2em;
  min-width: auto;
  align-items: center;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  z-index: 500;

  li {
    margin: 0;
    width: auto;
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
  }

  a {
    color: ${THEME.colors.white};
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
    text-align: left;
    white-space: nowrap;
    width: auto;
    align-self: center;
    padding-bottom: 0;
    text-decoration: none;
    font-size: 1.3em;
    margin: 0;

    .case-logo {
      width: 1.8em;
      height: 1.8em;
      border-radius: ${THEME.radii.md};
      object-fit: cover;
      flex-shrink: 0;
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const LinkBoxMobile = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  list-style: none;
  position: absolute;
  top: 3.4em;
  right: 1em;
  padding: 1.2em 1.5em;
  min-width: 15.5em;
  width: 15.5em;
  background: ${THEME.colors.darkest};
  z-index: 400;
  border-radius: ${THEME.radii.md};
  border: 2px solid ${THEME.colors.white};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  animation: ${props => props.$isAnimating
    ? 'slideInFromRight 0.3s ease-out forwards'
    : 'slideOutToRight 0.3s ease-in forwards'};

  @keyframes slideInFromRight {
    from {
      transform: translateX(calc(100% + 1em));
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutToRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(calc(100% + 1em));
      opacity: 0;
    }
  }

  li {
    &:not(:first-child) {
      margin-top: 1.5em;
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 0.45em;
      justify-content: flex-start;
      color: ${THEME.colors.white};

      &:hover {
        color: ${THEME.colors.hotRed};
      }

      .case-logo {
        width: 1.45em;
        height: 1.45em;
        border-radius: ${THEME.radii.md};
        object-fit: cover;
        flex-shrink: 0;
      }
    }
  }

  .contact-accordion {
    button {
      padding: 0;
      border-bottom: none;
      justify-content: space-between;
      text-align: left;
      color: ${THEME.colors.white};
      margin: 0;

      &:hover {
        color: ${THEME.colors.hotRed};
        border-color: ${THEME.colors.hotRed};
      }
    }
  }
`;

export const CaseStudiesAccordionButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: none;
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  font-size: 1em;
  padding: 0 0 0.2em;
  cursor: pointer;
  gap: 0.25em;

  &:hover {
    color: ${THEME.colors.hotRed};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotRed};
    outline-offset: 4px;
  }
`;

export const CaseStudiesAccordionList = styled.ul`
  list-style: none;
  width: 100%;
  margin: ${props => props.$isOpen ? '1em 0 0' : '0'};
  padding: 0;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 1.1em;
  max-height: none;
  overflow: visible;
  opacity: 1;
  transition: none;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};

  li {
    margin: 0;
  }

  li:not(:first-child) {
    margin-top: 0;
  }

  a {
    border-bottom: none;
    color: ${THEME.colors.white};
    display: inline-flex;
    align-items: center;
    width: 100%;
    align-self: flex-start;
    padding-bottom: 0.1em;
    justify-content: flex-start;
    margin: 0;
  }
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
      .at-logo {
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
      img {
        border-radius: ${THEME.radii.md};
        width: 100%;
        height: auto;
        max-width: 18em;
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

export const DemoStokeContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(4.8em, 5.5em);
  gap: clamp(1.5em, 3vw, 2.8em);
  align-items: flex-start;
  width: 100%;
  & > * {
    min-width: 0;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

export const AntisyphonColumnsWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2.5em 4em;
  width: 100%;
  font-size: 25px;
  text-align: left;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    padding: 6em 1.5em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 2em 1.5em;
  }
`;

export const AntisyphonColumnsInner = styled.div`
  width: 100%;
  max-width: 62em;
`;

export const AntisyphonHeader = styled(FlexBox)`
  .page-header {
    color: ${THEME.colors.white};
  }

  .at-logo {
    width: 6em;
    height: auto;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    margin-bottom: 1.5em;
  }
`;

export const SectionTabsWrapper = styled.div`
  position: sticky;
  top: var(--sidebar-tabs-top, calc(5em + 4.4em));
  display: flex;
  flex-direction: column;
  gap: 0.65em;
  width: 100%;
  max-width: 5.5em;
  align-self: flex-start;
  padding: 0.45em;
  border-radius: ${THEME.radii.md};
  background-color: transparent;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: none;
    position: static;
  }
`;

export const SectionHeader = styled.h2`
  padding: 1.2em 0 0.6em;
  margin: 0;
  text-align: center;
  font-family: Roboto, sans-serif;
  font-size: 2em;
  background: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 1.1em 0 0.8em;
  }
`;

export const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  gap: 2em;
  padding: 2.5em 2em 2em;
  width: 100%;
  border-top: 1px solid ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  text-align: left;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    padding: 2em 1.5em;
    gap: 1.5em;
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
  display: flex;
  flex-direction: column;
  gap: 0.6em;
  align-items: flex-start;
`;

export const FooterColumnTitle = styled.h3`
  margin: 0;
  font-size: 0.9em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${THEME.colors.orange};
  text-align: left;
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
    gap: 0.25em;
    color: ${THEME.colors.white};
    text-decoration: none;
    font-size: 0.95em;
    transition: color 0.2s ease;

    &:hover {
      color: ${THEME.colors.hotRed};
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
  font-size: 0.85em;
  color: ${THEME.colors.grey};
  padding-top: 1em;
  width: 100%;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;
  }
`;

export const DemoStokeTitle = styled.h2`
  color: ${THEME.colors.demostoke};
  font-size: clamp(1.55em, 3.5vw, 2.15em);
  line-height: 1.1;
  margin: 0 0 0.45em;
  padding-top: clamp(0.65em, 1.8vw, 1.1em);

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-top: 0;
  }
`;

export const DemoStokeList = styled.ul`
  padding: ${props => props.$frameless ? '0' : '0.8em 1.8em'};
  font-size: 0.9em;
  font-weight: lighter;
  list-style: none;
  border: ${props => props.$frameless ? 'none' : `1px solid ${THEME.colors.grey}`};
  border-radius: ${props => props.$frameless ? '0' : THEME.radii.md};
  margin-bottom: 0;

  li {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
    column-gap: 0.55em;
    ${props => props.spaced && 'padding: 0.7em 0;'}

    p {
      margin-bottom: 0;
    }
  }

  li::before {
    content: '⚡️';
    display: inline-block;
  }

  li.monetization::before {
    content: '💵';
  }

  li.complaint::before {
    content: '⛔️';
  }

  li.next-step::before {
    content: '👉🏻';
  }

  li.persona::before {
    content: '👤';
  }

  li.learning::before {
    content: '💡';
  }

  li.interview::before {
    content: '📝';
  }

  li.prototype::before {
    content: '🤙🏻';
  }

  li.crystal::before {
    content: '🔮';
  }

  li.heart::before {
    content: '💜';
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: ${props => props.$frameless ? '0' : '0.8em 1.8em'};
  }
`;

export const DemoStokeTwoColumnLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.35em;
  padding: clamp(0.9em, 2vw, 1.45em) clamp(1.2em, 3vw, 2em);
  border: ${props => props.$variant === 'tinted' ? 'none' : `1px solid ${THEME.colors.grey}`};
  border-radius: ${THEME.radii.md};
  background: ${props => props.$variant === 'tinted' ? 'rgba(37, 99, 235, 0.08)' : 'transparent'};
`;

export const DemoStokeTwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(0.95em, 3vw, 2.6em);
  row-gap: 0.35em;
  align-items: baseline;
  padding: 0.45em 0;

  &:not(:last-child) {
    border-bottom: ${props => props.$isBorderless ? 'none' : `1px solid ${THEME.colors.grey}`};
    padding-bottom: clamp(0.75em, 1.8vw, 1.1em);
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
    padding: 0.6em 0;
  }
`;

export const DemoStokeTwoColumnHeader = styled.div`
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  font-size: clamp(1.05em, 2vw, 1.25em);
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
  width: 100%;
  padding: clamp(1.1em, 2.8vw, 1.8em) clamp(1.2em, 3vw, 2.1em);
  border-radius: ${THEME.radii.md};
  background: rgba(37, 99, 235, 0.08);
  border: none;
  box-shadow: 0 18px 38px -30px rgb(0 0 0 / 70%);
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
  font-size: clamp(1.55em, 3.5vw, 2.15em);
  line-height: 1.1;
  color: ${THEME.colors.white};
  letter-spacing: 0.01em;
`;

export const DemoStokeTldrCopy = styled.div`
  color: ${THEME.colors.white};
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;

  a {
    font-weight: 600;
    color: ${THEME.colors.white};
    transition: color 0.2s ease;

    &:hover {
      color: ${THEME.colors.hotRed};
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

    li:last-child {
      margin-bottom: 0;
    }
  }
`;

export const DemoStokeTldrImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: ${THEME.radii.md};
  border: 1.5px solid ${THEME.colors.grey};
  object-fit: contain;
  box-shadow: 0 30px 38px -30px rgb(0 0 0 / 75%);
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
  gap: clamp(3.5em, 7vw, 6em);

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

export const DemoStokeAccordionItem = styled.div`
  border: 1px solid ${THEME.colors.white};
  border-radius: ${THEME.radii.md};
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.005));
  box-shadow: ${props => props.$isOpen ? '0 14px 28px -16px rgb(0 0 0 / 70%)' : 'none'};
  transition: border-color 0.2s ease, box-shadow 0.3s ease, transform 0.2s ease;

  &:hover {
    border-color: ${THEME.colors.hotRed};
    transform: translateY(-1px);
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
`;

export const DemoStokeAccordionTitle = styled.span`
  font-size: clamp(1.1em, 2vw, 1.3em);
  font-weight: 700;
  letter-spacing: 0.01em;
`;

export const DemoStokeAccordionChevron = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1em;
  height: 2.1em;
  padding: 0;
  flex-shrink: 0;
  color: ${props => props.$isOpen ? THEME.colors.hotRed : 'inherit'};
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

export const DemoStokeStoryCardGrid = styled(DemoStokeTwoUp)`
  gap: clamp(1.2em, 3vw, 2.6em);
  align-items: stretch;
`;

export const DemoStokeStoryCard = styled.section`
  position: relative;
  isolation: isolate;
  padding: clamp(1.15em, 2.4vw, 1.65em);
  border-radius: ${THEME.radii.md};
  background:
    radial-gradient(120% 140% at 12% 12%, rgba(0, 215, 255, 0.22), rgba(2, 8, 23, 0)),
    linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(0, 113, 227, 0.12));
  box-shadow: 0 18px 36px -28px rgb(0 0 0 / 85%), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border: none;
  overflow: hidden;
  color: ${THEME.colors.white};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(90% 90% at 85% 10%, rgba(255, 0, 101, 0.12), rgba(255, 0, 101, 0));
    opacity: 0.9;
    pointer-events: none;
  }

  h3 {
    margin: 0 0 0.5em;
    color: ${THEME.colors.demostoke};
    letter-spacing: 0.01em;
    font-weight: 700;
  }

  p {
    margin: 0;
    line-height: 1.65;
    color: ${THEME.colors.white};
    opacity: 0.94;
  }
`;

export const DemoStokeBorderBox = styled.div`
  width: 100%;
  background: transparent;
  padding: ${props => props.$noPadding ? '0' : '1.05em 1.6em'};
  font-size: 0.95em;
  line-height: 1.6;
  border: 1px solid ${THEME.colors.grey};
  border-radius: ${THEME.radii.md};
  color: ${THEME.colors.white};
  overflow: hidden;

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: ${props => props.$noPadding ? '0' : '0.9em 1.1em'};
  }
`;

export const DemoStokeWhyImageFrame = styled.div`
  margin-top: clamp(1em, 2vw, 1.5em);
  border-radius: ${THEME.radii.md};
  overflow: hidden;
  box-shadow: 0 16px 38px -24px rgb(0 0 0 / 75%);

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
  padding: 0.4em 0.2em 0.2em;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.grey};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-right: 0.25em;
  }
`;

export const DemoStokeScrollItem = styled.div`
  min-width: clamp(12.8em, 45vw, 15em);
  max-width: 18em;
  flex: 0 0 auto;
  border: 1.5px solid ${THEME.colors.white};
  border-radius: ${THEME.radii.md};
  overflow: hidden;
  background: transparent;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${THEME.colors.hotRed};
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

export const DemoStokeScrollButton = styled.button`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  border: 1px solid ${THEME.colors.grey};
  color: ${THEME.colors.white};
  background: ${THEME.colors.darkest};
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover:enabled {
    transform: translateY(-1px);
    border-color: ${THEME.colors.white};
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
  padding: 0.35em 0.2em 0.3em;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${THEME.colors.grey};
    border-radius: 999px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding-right: 0.25em;
  }
`;

export const DemoStokeMiniCard = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-width: clamp(13em, 48vw, 15.5em);
  max-width: 18em;
  padding: clamp(1em, 2.3vw, 1.4em);
  border-radius: ${THEME.radii.md};
  background: transparent;
  border: 1.5px solid ${THEME.colors.white};
  box-shadow: none;
  color: ${THEME.colors.white};
  scroll-snap-align: start;
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.2s ease, border-color 0.25s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: none;
    border-color: ${THEME.colors.hotRed};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 3px;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    min-width: 12em;
    max-width: 12em;
  }
`;

export const DemoStokeMiniCardTitle = styled.div`
  font-weight: 700;
  color: ${THEME.colors.demostoke};
  letter-spacing: 0.01em;
  margin: 0 0 0.5em;
  font-size: clamp(1.02em, 2vw, 1.2em);
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
  gap: 0.3em;
  color: ${THEME.colors.white};
  opacity: 0.75;
  font-size: 0.86em;
  letter-spacing: 0.02em;
  margin-top: auto;
  padding-top: clamp(0.6em, 1vw, 0.85em);

  &::after {
    content: '↗';
    font-size: 0.95em;
  }
`;

export const DemoStokeStoryHero = styled.img`
  width: 100%;
  display: block;
  border-radius: ${THEME.radii.md};
  object-fit: cover;
  object-position: top;
  margin: 0;
  box-shadow: 0 12px 28px -20px rgb(0 0 0 / 60%);
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

export const DemoStokeMiniCardModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgb(2 8 23 / 0.82);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1em, 3vw, 2em);
  z-index: 999;
`;

export const DemoStokeMiniCardModal = styled.div`
  position: relative;
  width: min(720px, 95vw);
  max-height: 88vh;
  overflow: hidden;
  border-radius: ${THEME.radii.md};
  background:
    radial-gradient(140% 140% at 10% 0%, rgba(0, 215, 255, 0.16), rgba(2, 8, 23, 0)),
    linear-gradient(150deg, rgba(3, 7, 18, 0.95), rgba(2, 132, 199, 0.14));
  box-shadow: 0 18px 44px -26px rgb(0 0 0 / 80%), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(0, 215, 255, 0.2);
  color: #f8fafc; /* lock light text regardless of theme */
  padding: clamp(1.2em, 2.5vw, 1.85em);

  :root[data-theme='light'] & {
    background:
      radial-gradient(140% 140% at 10% 0%, rgba(0, 215, 255, 0.18), rgba(248, 250, 252, 0.02)),
      linear-gradient(150deg, rgba(8, 47, 73, 0.9), rgba(12, 74, 110, 0.75));
    color: ${THEME.colors.white};
    border: 1px solid rgba(8, 47, 73, 0.5);
    box-shadow: 0 18px 36px -24px rgb(15 23 42 / 45%);
  }
`;

export const DemoStokeMiniCardModalClose = styled.button`
  all: unset;
  position: absolute;
  top: 0.3em;
  right: 0.3em;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f8fafc; /* keep icon visible in light mode */
  background: rgba(0, 215, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: transform 0.2s ease, opacity 0.2s ease;

  svg {
    width: 1em;
    height: 1em;
    display: block;
    transform: translateX(-0.09em);
  }

  &:hover {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 3px;
  }
`;

export const DemoStokeMiniCardModalTitle = styled.h4`
  margin: 0 0 0.65em;
  font-size: clamp(1.25em, 2.3vw, 1.5em);
  color: #7dd3fc; /* lighter accent that stays visible on dark modal */
  letter-spacing: 0.01em;
`;

export const DemoStokeMiniCardModalCopy = styled.div`
  color: #f8fafc; /* force light text so it reads on dark modal */
  line-height: 1.7;
  font-size: 1em;
  max-height: calc(88vh - 4em);
  overflow-y: auto;
  padding-right: 0.4em;

  p {
    margin: 0 0 0.8em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: #f8fafc;
    font-weight: 600;
    text-decoration: underline;

    &:hover {
      color: ${THEME.colors.hotRed};
    }
  }
`;

export const DemoStokeWhyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: clamp(0.85em, 2vw, 1.45em);
  margin-top: 0.6em;
`;

export const DemoStokeWhyCard = styled.div`
  position: relative;
  padding: clamp(1em, 2.4vw, 1.4em);
  border-radius: ${THEME.radii.md};
  background: rgba(37, 99, 235, 0.08);
  box-shadow: 0 12px 28px -22px rgb(0 0 0 / 70%);
  color: ${THEME.colors.white};
  border: none;
  overflow: hidden;
`;

export const DemoStokeWhyBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.8em;
  height: 1.8em;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(15, 23, 42, 0.55);
  color: ${THEME.colors.white};
  font-weight: 700;
  font-size: 0.95em;
  letter-spacing: 0.01em;
  margin-bottom: 0.55em;
`;

export const DemoStokeWhyTitle = styled.h4`
  margin: 0 0 0.4em;
  color: ${THEME.colors.demostoke};
  font-size: clamp(1.05em, 2.2vw, 1.25em);
  letter-spacing: 0.01em;
`;

export const DemoStokeWhyCopy = styled.div`
  color: ${THEME.colors.white};
  line-height: 1.65;
  opacity: 0.96;

  p {
    margin: 0 0 0.7em;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: ${THEME.radii.md};
  border: 1px solid ${THEME.colors.grey};

  table {
    min-width: 600px; /* Adjust based on your content */
    border-collapse: collapse;
    width: 100%;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: left;
    white-space: nowrap;
  }
`;

export const DemoStokeTable = styled.table`
  width: 100%;
  padding: 0.8em 1.8em;
  font-size: 0.9em;
  font-weight: lighter;
`;

export const DemoStokeText = styled.div`
  width: 100%;
  background: transparent;
  padding: 0.8em 1.8em;
  font-size: 0.9em;
  font-weight: lighter;
  border: 1px solid ${THEME.colors.grey};
  border-radius: ${THEME.radii.md};
`;

// Tabs
export const TabWrapper = styled.div`
  /* reset */
  button,
  fieldset,
  input {
    all: unset;
  }

  .TabsRoot {
    display: flex;
    flex-direction: column;
  }

  .TabsList {
    flex-shrink: 0;
    display: flex;
    position: fixed;
    width: 100%;
    top: 5em;

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      top: 4.9em;
    }

    @media (max-width: ${THEME.breakpoints.phone}) {
      top: 8.48em;
    }
  }

  .TabsTrigger {
    font-family: inherit;
    padding: 0 20px;
    height: 45px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    user-select: none;
    background-color: #0c4a6e;
    color: #ffffff;
    cursor: pointer;
    display: block;

    div {
      line-height: 48px;
    }

    @media (max-width: ${THEME.breakpoints.phone}) {
      font-size: 1em;
    }
  }

  .TabsTrigger[data-state="active"] {
    background-color: #d3ff00;
    color: #020817;
  }

  .TabsContent {
    flex-grow: 1;
    outline: none;
  }
`;

export const Video = styled.video`
  width: 100%;
  height: auto;
  border-radius: ${THEME.radii.md};
  display: block;
`;

export const VideoFrame = styled.div`
  border: 1.5px solid ${THEME.colors.white};
  border-radius: ${THEME.radii.md};
  overflow: hidden;
`;

export const HotRedTitle = styled.h2`
  color: ${THEME.colors.hotRed};
`;

// Theme Switcher styled components
export const ThemeSwitcherWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.9em;
  transition: filter 0.3s;
  pointer-events: ${props => props.isMobileMenuShown ? 'none' : 'auto'};
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}

  @media (max-width: ${THEME.breakpoints.phone}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4em;
  }
`;

export const ThemeSwitcherTrigger = styled(Select.Trigger)`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-width: 0;
  padding: 0.25em 1em 0.22em;
  border-radius: ${THEME.radii.md};
  border: 1px solid ${THEME.colors.grey};
  color: ${THEME.colors.white};
  background-color: transparent;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-size: 1.6rem;
  line-height: 1;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;

  &:hover,
  &[data-state='open'] {
    border-color: ${THEME.colors.hotRed};
    color: ${THEME.colors.hotRed};
  }

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotRed};
    outline-offset: 2px;
  }
`;

export const ThemeSwitcherValue = styled(Select.Value)`
  flex: 0 1 auto;
  display: inline-flex;
  align-items: center;
  line-height: 1;
`;

export const ThemeSwitcherContent = styled(Select.Content)`
  overflow: hidden;
  background-color: ${THEME.colors.darkest};
  color: ${THEME.colors.white};
  border-radius: ${THEME.radii.md};
  border: 1px solid ${THEME.colors.grey};
  box-shadow: 0 18px 45px rgba(5, 5, 15, 0.35);
  z-index: 400;
`;

export const ThemeSwitcherViewport = styled(Select.Viewport)`
  padding: 0.25em 0;
`;

export const ThemeSwitcherItem = styled(Select.Item)`
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.45em 1.1em;
  font-size: 1em;
  cursor: pointer;
  user-select: none;
  color: ${THEME.colors.white};
  transition: background-color 0.2s ease, color 0.2s ease;

  &[data-highlighted] {
    outline: none;
    background-color: ${THEME.colors.hotRed};
    color: ${THEME.colors.contrast};
  }
`;

export const ThemeSwitcherIndicator = styled(Select.ItemIndicator)`
  margin-left: auto;
  display: inline-flex;
  color: inherit;
`;

export const HomeTabsBar = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    position: fixed;
    top: 4.9em;
    left: 0;
    right: 0;
    display: flex;
    gap: 0.6em;
    padding: 0.4em 1em 0.45em;
    z-index: 95;
    background: transparent;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 8.48em;
  }
`;

export const HomeTabButton = styled.button.attrs(({ $isActive }) => ({
  'data-active': $isActive ? 'true' : 'false',
}))`
  all: unset;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65em 1em;
  border-radius: ${THEME.radii.md};
  font-family: Roboto, sans-serif;
  font-size: 1.05em;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  background-color: ${props => props.$isActive ? THEME.colors.hotYellow : THEME.colors.darkGreen};
  color: ${props => props.$isActive ? '#020817' : '#fff'};
  box-shadow: ${props => props.$isActive ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.25)'};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.hotYellow};
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const sidebarTabButtonStyles = css`
  background-color: transparent;
  border: 1.5px solid ${THEME.colors.white};
  color: ${THEME.colors.white};
  box-shadow: none;
  transition: color 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;

  &[data-active='true'] {
    background-color: ${THEME.colors.hotYellow};
    border-color: ${THEME.colors.hotYellow};
    color: ${THEME.colors.contrast};
  }

  &:not([data-active='true']):hover {
    border-color: ${THEME.colors.hotRed};
    color: ${THEME.colors.white};
  }
`;

export const SectionTabButton = styled(HomeTabButton)`
  ${sidebarTabButtonStyles}
  font-size: 0.575em;
  padding: 0.3em 0.5em;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 1.6em;
  letter-spacing: 0.011em;
  line-height: 1.3;
  border-radius: ${THEME.radii.md};
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
  display: flex;
  width: 100%;
  max-width: 46em;
  margin: 0 auto;
  gap: 0.45em;
  padding: 0.4em;
  border-radius: ${THEME.radii.md};
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: rgba(var(--color-dark-rgb), 0.78);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  flex-wrap: nowrap;
  justify-content: space-between;
  overflow: hidden;
`;

export const SectionTabsMobileButton = styled(HomeTabButton)`
  ${sidebarTabButtonStyles}
  flex: 1 1 0;
  min-width: 0;
  font-size: 0.92em;
  padding: 0.6em 1.1em;
  white-space: normal;
  padding: 0.75em 0.55em;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.75em;
  }
`;

export const HomeTabsSpacer = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: block;
    height: 2.2em;
  }
`;

export const FloatingCloudsViewport = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  pointer-events: none;
  z-index: 0;
`;

const cloudDrift = keyframes`
  0% { transform: translateX(60vw); }
  100% { transform: translateX(-90vw); }
`;

const cloudDriftMobile = keyframes`
  0% { transform: translateX(60vw); }
  100% { transform: translateX(-140vw); }
`;

export const FloatingClouds = styled.div`
  position: absolute;
  top: clamp(2em, 9vw, 6.5em);
  left: 50%;
  width: clamp(12em, 45vw, 19em);
  transform: translateX(60vw);
  will-change: transform;
  pointer-events: none;
  z-index: 0;

  ${props => props.$isActive && css`
    animation: ${cloudDrift} 60s linear infinite;
  `}

  img {
    display: block;
    width: 100%;
    height: auto;
    box-shadow: none;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    top: clamp(4.5em, 13vw, 7em);
    width: clamp(12em, 55vw, 18em);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: clamp(5.2em, 16vw, 7.5em);
    width: clamp(12em, 70vw, 17em);
    ${props => props.$isActive && css`
      animation: ${cloudDriftMobile} 40s linear infinite;
    `}
  }
`;

export const DemoStokeTabsBar = styled.div`
  position: fixed;
  top: 5em;
  left: 0;
  right: 0;
  display: flex;
  gap: 0.6em;
  padding: 0.4em 1em 0.45em;
  z-index: 95;
  background: transparent;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    top: 4.9em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 8.48em;
  }
`;
export const IntroSection = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: clamp(2.6em, 6vw, 4.6em) clamp(1.6em, 5vw, 3.4em);
  max-width: 100em;
  margin: 0 auto;
  gap: clamp(2.5em, 6vw, 5.25em);
  overflow: hidden; /* Prevent parallax elements from creating horizontal scroll */
  min-height: clamp(64vh, 80vh, 88vh);

  .intro-text {
    flex: 1;
    max-width: 34em;
    text-align: left;
    will-change: transform; /* Optimize for transforms */
    transition: transform 0.1s ease-out; /* Smooth parallax movement */
    order: 2;
    align-self: stretch;
    padding-bottom: clamp(1.25em, 3.3vw, 3em);
    padding-top: clamp(0.1em, 1.5vw, 1.1em);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: clamp(0.7em, 2vw, 1.35em);

    h2 {
      color: ${THEME.colors.white};
      font-family: Roboto, sans-serif;
      font-size: clamp(3.4em, 6vw, 4.8em);
      font-weight: 600;
      margin: 0;
      line-height: 1.08;
      text-align: left;
    }

    p {
      color: ${THEME.colors.white};
      font-family: Roboto, sans-serif;
      font-size: 1.6em;
      line-height: 1.5;
      margin: 0 0 1em 0;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .hotword {
      color: ${THEME.colors.hotRed};
    }

    .intro-rotator-headline {
      border-top: 2px dotted ${THEME.colors.grey};
      padding-top: clamp(0.4em, 1.4vw, 0.7em);
      margin: clamp(0.1em, 0.6vw, 0.25em) 0 0;
      max-width: none;
      width: 100%;
      padding-left: 0;
      padding-right: 0;
      color: ${THEME.colors.white};
      gap: 0.3em;
      font-size: 2.8em;
    }

	    .case-studies-cta {
	      display: inline-flex;
	      align-items: center;
	      justify-content: center;
	      align-self: flex-start;
	      margin-top: clamp(0.7em, 1.6vw, 1em);
	      padding: 0.65em 1.2em;
	      border-radius: ${THEME.radii.md};
	      border: 2px solid ${THEME.colors.hotYellow};
	      background-color: ${THEME.colors.hotYellow};
	      color: ${THEME.colors.contrast};
	      font-family: Roboto, sans-serif;
	      font-size: 1.1em;
	      font-weight: 700;
	      letter-spacing: 0.02em;
	      cursor: pointer;
	      box-shadow: 0 10px 20px -8px rgb(0 0 0 / 55%);
	      transition: transform 0.2s, box-shadow 0.2s, background-color 0.2s, border-color 0.2s, color 0.2s;

	      &:hover {
	        background-color: ${THEME.colors.hotRed};
	        border-color: ${THEME.colors.hotRed};
	        color: #fff;
	        box-shadow: 0 12px 24px -10px rgb(0 0 0 / 60%);
	      }

      &:active {
        transform: translateY(1px);
      }

      &:focus-visible {
        outline: 2px solid ${THEME.colors.hotRed};
        outline-offset: 4px;
      }
    }
  }

  .intro-image {
    flex: 1;
    max-width: 38em;
    will-change: transform; /* Optimize for transforms */
    transition: transform 0.1s ease-out; /* Smooth parallax movement */
    position: relative;
    order: 1;
    align-self: flex-end;

    img {
      width: 100%;
      height: auto;
      border-radius: ${THEME.radii.md};
      display: block;
      filter: drop-shadow(0 30px 38px rgb(0 0 0 / 37.5%));
    }

    .neon-trail {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      mix-blend-mode: screen;
      opacity: 0.9; /* Keep visible so the streak can finish fading after hover ends */
      transition: opacity 0.2s ease-out;
      border-radius: ${THEME.radii.md};
    }
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 2.5em;
    padding: 2em 1.5em;
    min-height: auto;

    .intro-text {
      max-width: none;
      text-align: left;
      transform: none !important; /* Disable parallax on tablets and mobile */
      order: 2;
      padding-bottom: 0;
      padding-top: 0;
      gap: 0.8em;
      justify-content: flex-start;
      align-self: stretch;

      h2 {
        font-size: 3.1em;
        text-align: left;
      }

      p {
        font-size: 1.4em;
        text-align: left;
        margin: 0 0 1em 0;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .intro-rotator-headline {
        border-top: 2px dotted ${THEME.colors.grey};
        padding-top: 0.55em;
        margin-top: 0.25em;
        font-size: clamp(1.8rem, 4vw, 2.5rem);
      }
    }

    .intro-image {
      max-width: 34em;
      transform: none !important; /* Disable parallax on tablets and mobile */
      order: 1;
      align-self: center;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 1.5em 1em;
    gap: 2em;

    .intro-text {
      h2 {
        font-size: 2.6em;
      }

      p {
        font-size: 1.2em;
        margin: 0 0 1em 0;

        &:last-child {
          margin-bottom: 0;
        }
      }

      .intro-rotator-headline {
        font-size: clamp(1.6rem, 5vw, 2.2rem);
        padding-top: 0.5em;
        margin-top: 0.22em;
      }
    }
  }
`;

export const WorksParallaxStage = styled.section`
  position: relative;
  isolation: isolate;
  margin: clamp(1em, 2.8vw, 2em) 0 0;
  background: ${THEME.colors.dark};
`;

export const WorksRevealCurtain = styled.div`
  position: relative;
  z-index: 2;
  height: clamp(50vh, 58vw, 65vh);
  background: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
    height: 0;
  }
`;

export const WorksFixedIllustration = styled.div`
  position: sticky;
  top: 4.9em;
  height: 100vh;
  width: 100%;
  z-index: 1;
  pointer-events: auto;
  overflow: hidden;
  transform: translateZ(0);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.02);
    filter: saturate(1.05) contrast(1.03);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.35) 55%, rgba(0, 0, 0, 0.5) 100%);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    height: clamp(78vh, 120vw, 96vh);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 8.5em;
    height: auto;
    min-height: 72vh;
  }
`;

export const WorksSectionContent = styled.div`
  position: relative;
  z-index: 2;
  background: ${THEME.colors.dark};
  margin-top: -60vh;
  padding-top: clamp(2em, 5vw, 3.5em);

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    margin-top: -24vh;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    margin-top: -12vh;
  }
`;
