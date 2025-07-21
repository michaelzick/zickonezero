import styled from 'styled-components';
import { THEME } from './theme';

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

  @media (max-width: ${THEME.breakpoints.phone}) {
    .tab-header {
      font-size: 1em;
      text-align: right
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

export const CommandLine = styled.span`
  font-family: monospace;
  color: ${THEME.colors.white};
  border-radius: 3px;
  max-width: 49em;
`;

export const WorkSectionHeader = styled.span`
  font-family: monospace;
  font-size: 1.4em;
`;

export const Wrapper = styled.div`
  ${props => props.isHomePage ? 'padding-top: 7.7em;' : 'padding-top: 5em;'}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}
  background-color: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    ${props => props.isHomePage ? 'padding-top: 12em;' : 'padding-top: 9em;'}
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 1em 3em 1em 2.5em;
  display: flex;
  border-bottom: 2px dotted ${THEME.colors.grey};
  justify-content: space-between;
  position: fixed;
  z-index: 90;
  background-color: ${THEME.colors.dark};

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

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    padding: 1em 1em;
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
    max-width: 85em;

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
  margin: 3em 3em 1.5em;
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
  font-size: 1.8em;
  margin: 0;
  width: 100%;
  text-align: left;
  font-family: system-ui;
  line-height: 1.5em;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}

  a {
    margin-top: 0;
    transition: all 0.3s;
    cursor: pointer;
    display: inline-block;

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      display: block;
      width: 7em;
      padding: 0;
      font-size: 0.8em;
      line-height: 1.2em;
    }
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

export const LinkBoxMobile = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  position: absolute;
  top: 3.4em;
  right: 1em;
  padding: 1em;
  background: rgba(255,255,255,0.9);
  z-index: 99;
  border-radius: 4px;
  box-shadow: 20px 0 80px 20px rgb(138 138 149 / 40%);

  svg {
    fill: ${THEME.colors.dark};
  }

  li {
    &:not(:first-child) {
      margin-top: 1em;
    }

    a {
      border-bottom: 0.2em solid #000;
      justify-content: center;
      color: ${THEME.colors.dark};
    }
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
      max-width: 45em;

      .ds-logo {
        width: 6em;
      }

      section {
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

  h2 {
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

export const SectionHeader = styled.h2`
  font-size: 2em;
  margin: 0;
  text-align: center;
  font-family: Roboto, sans-serif;
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

  li {
    ${props => props.spaced && 'padding: 0.7em 0;'}
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
    top: 4.8em;

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      top: 8.8em;
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
    background-color: ${THEME.colors.darkGreen};
    cursor: pointer;
    display: block;

    div {
      line-height: 48px;
    }
  }

  .TabsTrigger[data-state="active"] {
    background-color: ${THEME.colors.hotYellow};
    color: ${THEME.colors.dark};
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
