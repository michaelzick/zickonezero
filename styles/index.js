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

export const PitchDeckLink = styled(WhiteTransitionAnchor)`
  display: inline-flex;
  align-items: center;
  gap: 0.35em;
  margin-top: 0.4em;
  font-size: 0.95em;
  padding: 0.25em 0;

  &.pitch-link-mobile {
    display: none;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
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

export const CommandLine = styled.span`
  font-family: monospace;
  color: ${THEME.colors.white};
  border-radius: 3px;
  max-width: 49em;
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
  flex-wrap: wrap;
  gap: 0.35em;
  max-width: 100em;
  width: 100%;
  margin: 0 auto clamp(0.82em, 2.25vw, 1.7em);
  padding: 0 0.5em;
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  font-size: clamp(2.4rem, 5.8vw, 4.4rem);
  font-weight: 500;
  line-height: 1.1;
  text-align: left;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    font-size: clamp(2.6rem, 6.2vw, 3.8rem);
    margin: 0 auto clamp(0.68em, 3.4vw, 1.43em);
    padding: 0 0.5em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: clamp(2.1rem, 7vw, 3.1rem);
    gap: 0.25em;
    margin: 0 auto 0.9em;
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
  animation: ${phraseCycle} 16s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
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
  ${props => props.isHomePage ? 'padding-top: 7.7em;' : 'padding-top: 5em;'}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px); z-index: 300;'}
  background-color: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    ${props => props.isHomePage ? 'padding-top: 6.9em;' : 'padding-top: 5.2em;'}
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    ${props => props.isHomePage ? 'padding-top: 9.6em;' : 'padding-top: 9.2em;'}
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
  z-index: 100;
  background-color: ${THEME.colors.dark};
  transition: filter 0.3s;

  a {
    transition: all 0.3s;
    font-family: Roboto, sans-serif;
    color: ${THEME.colors.white};
    display: flex;
    text-decoration: none;

    &:hover {
      color: ${THEME.colors.hotRed};
    }
  }

  svg {
    fill: ${THEME.colors.white};
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
  border-radius: 4px;
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
  border-radius: 20px;
  border: 1px solid ${THEME.colors.white};
`;

export const Thumb = styled.div`
  text-align: center;
  font-family: Roboto, sans-serif;
  margin: 3em 2em 1.5em;
  color: ${THEME.colors.white};

  img {
    transition: all 0.3s;
    border-radius: 4px;
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
      margin-right: 0.35em;
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
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  display: inline-flex;
  width: 0.55em;
  height: 0.55em;
  align-items: center;
  justify-content: center;
  padding: 0.18em;
  box-sizing: border-box;
  transform: ${props => props.$isOpen ? 'rotate(-135deg)' : 'rotate(45deg)'};
  transition: transform 0.2s ease;
  vertical-align: middle;
  margin-bottom: ${props => props.$isOpen ? '0' : '0.4em'};
`;

export const CaseStudiesDesktopWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-top: 0.8em;
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  cursor: pointer;

  &:hover,
  &:focus-within {
    color: ${THEME.colors.hotRed};
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const CaseStudiesTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;

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
  padding: 1em 1.75em;
  background: ${THEME.colors.darkest};
  border-radius: 4px;
  border: 2px solid ${THEME.colors.white};
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  min-width: 180px;
  gap: 1.2em;
  align-items: center;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  z-index: 500;

  li {
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  a {
    color: ${THEME.colors.white};
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35em;
    text-align: center;
    width: auto;
    align-self: center;
    padding-bottom: 0;
    text-decoration: none;
    font-size: 1.1em;
    margin: 0;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 0.18em;
      background: ${THEME.colors.white};
      border-radius: 999px;
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const LinkBoxMobile = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  position: absolute;
  top: 3.4em;
  right: 1em;
  padding: 1.5em 2em;
  min-width: 180px;
  background: ${THEME.colors.darkest};
  z-index: 400;
  border-radius: 4px;
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

  svg {
    fill: ${THEME.colors.white};
  }

  li {
    &:not(:first-child) {
      margin-top: 1.5em;
    }

    a {
      border-bottom: 0.2em solid ${THEME.colors.white};
      justify-content: center;
      color: ${THEME.colors.white};
    }
  }

  .case-studies-accordion {
    width: 100%;
  }
`;

export const CaseStudiesAccordionButton = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 0.2em solid ${THEME.colors.white};
  color: ${THEME.colors.white};
  font-family: Roboto, sans-serif;
  font-size: 1em;
  padding: 0 0 0.2em;
  cursor: pointer;

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
    border-bottom: 0.2em solid ${THEME.colors.white};
    color: ${THEME.colors.white};
    display: inline-flex;
    align-items: center;
    width: auto;
    align-self: flex-start;
    padding-bottom: 0.1em;
    justify-content: flex-start;
    margin: 0;
  }
`;

export const BioBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 4em;
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
      max-width: 58em;

      .ds-logo {
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
          color: ${THEME.colors.hotRed};
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
        border-radius: 4px;
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
        border-radius: 4px;

        &.antisyphon-image {
          cursor: pointer;
          border: 4px solid transparent;
          transition: border 0.3s ease;

          &:hover {
            border-color: ${THEME.colors.hotRed};
          }
        }
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      ${props => !props.isAboutPage && 'flex-direction: column;'}
      ${props => props.top && 'padding-top: 3em;'}
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
  border-radius: 18px;
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

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 2em;
  width: 100%;
  border-top: 1px solid ${THEME.colors.grey};
  font-family: Roboto, sans-serif;

  .footer-links {
    display: flex;
    justify-content: space-between;
    max-width: 34em;
    width: 100%;
    margin-left: 1em;

    a {
      transition: all 0.3s;
      display: flex;
      text-decoration: none;
      color: ${THEME.colors.white};

      &:hover {
        color: ${THEME.colors.hotRed};
      }
    }

    svg {
      fill: ${THEME.colors.white};
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      margin-top: 1em;
      flex-direction: column;
      margin-left: 0;

      a:not(:first-child) {
        margin-top: 1em;
      }
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    width: 100%;
    flex-direction: column;
    padding: 1em 2em 2.1em 2em;
  }
`;

export const DemoStokeTitle = styled.h2`
  color: ${THEME.colors.demostoke};
`;

export const DemoStokeList = styled.ul`
  /* background: ${THEME.colors.darkest}; */
  padding: 0.8em 1.8em;
  font-size: 0.9em;
  font-weight: lighter;
  list-style: none;
  border: 1px solid ${THEME.colors.grey};
  border-radius: 20px;
  margin-bottom: 0;

  li {
    ${props => props.spaced && 'padding: 0.7em 0;'}

    p {
      margin-bottom: 0;
    }
  }

  li::before {
    content: '⚡️';
    display: inline-block;
    width: 1em; /* Space between symbol and text */
    margin-right: 0.5em;
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
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 20px;
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
  background: ${THEME.colors.darkest};
  padding: 0.8em 1.8em;
  font-size: 0.9em;
  font-weight: lighter;
  border: 1px solid ${THEME.colors.grey};
  border-radius: 20px;
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
  border-radius: 20px;
  border: 1px solid ${THEME.colors.white};
  display: block;
`;

export const HotRedTitle = styled.h2`
  color: ${THEME.colors.hotRed};
`;

// Theme Switcher styled components
export const ThemeSwitcherWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75em;
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
  border-radius: 6px;
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
  border-radius: 10px;
  border: 1px solid ${THEME.colors.grey};
  box-shadow: 0 18px 45px rgba(5, 5, 15, 0.35);
  z-index: 200;
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
  padding: 0.75em 1em 0.65em;
  border-radius: 10px;
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
`;

export const SectionTabButton = styled(HomeTabButton)`
  ${sidebarTabButtonStyles}
  font-size: 0.575em;
  padding: 0.45em 0.5em 0.3em;
  justify-content: center;
  text-align: center;
  width: 100%;
  min-height: 1.6em;
  letter-spacing: 0.011em;
  line-height: 1.3;
  border-radius: 6px;
`;

export const SectionTabsMobileWrapper = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    display: flex;
    position: sticky;
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
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: rgba(var(--color-dark-rgb), 0.78);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
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

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 0.8em;
    padding: 0.55em 0.95em;
  }
`;

export const HomeTabsSpacer = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: block;
    height: 4.2em;
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
  align-items: center;
  justify-content: center;
  padding: 3em 2em;
  max-width: 100em;
  margin: 0 auto;
  gap: 4em;
  overflow: hidden; /* Prevent parallax elements from creating horizontal scroll */

  .intro-text {
    flex: 1;
    max-width: 35em;
    text-align: left;
    will-change: transform; /* Optimize for transforms */
    transition: transform 0.1s ease-out; /* Smooth parallax movement */

    h2 {
      color: ${THEME.colors.white};
      font-family: Roboto, sans-serif;
      font-size: 3.2em;
      font-weight: 600;
      margin: 0 0 1em 0;
      line-height: 1.2;
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
  }

  .intro-image {
    flex: 1;
    max-width: 35em;
    will-change: transform; /* Optimize for transforms */
    transition: transform 0.1s ease-out; /* Smooth parallax movement */

    img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    flex-direction: column;
    gap: 2.5em;
    padding: 2em 1.5em;

    .intro-text {
      max-width: none;
      text-align: left;
      transform: none !important; /* Disable parallax on tablets and mobile */

      h2 {
        font-size: 2.8em;
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
    }

    .intro-image {
      max-width: 30em;
      transform: none !important; /* Disable parallax on tablets and mobile */
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 1.5em 1em;
    gap: 2em;

    .intro-text {
      h2 {
        font-size: 2.2em;
      }

      p {
        font-size: 1.2em;
        margin: 0 0 1em 0;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
`;
