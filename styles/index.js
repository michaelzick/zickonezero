import styled from 'styled-components';

import { THEME } from './theme';

export const Container = styled.div`
  background-size: cover;
  text-align: center;
  font-family: Roboto, sans-serif;
  height: 100%;
  position: relative;

  .underline {
    text-decoration: underline;
  }

  a {
  transition: all 0.3s;
  color: ${THEME.colors.white};

  &:hover {
    color: ${THEME.colors.grey};
  }
}

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    // Hide the full screen icon in Lightbox
    .fslightbox-toolbar-button:nth-child(1) {
      display: none;
    }
  }
`;

export const CommandLine = styled.span`
  font-family: monospace;
  color: #fff;
  border-radius: 3px;
  max-width: 49em;
`;

export const WorkSectionHeader = styled.span`
  font-family: monospace;
`;

export const Wrapper = styled.div`
  ${props => props.isHomePage ? 'padding-top: 7.7rem;' : 'padding-top: 5rem;'}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}
  background-color: ${THEME.colors.dark};

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    ${props => props.isHomePage ? 'padding-top: 12rem;' : 'padding-top: 10rem;'}
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 1rem 3rem 1rem 2.5rem;
  display: flex;
  border-bottom: 2px dotted ${THEME.colors.grey};
  justify-content: space-between;
  position: fixed;
  z-index: 90;
  background-color: ${THEME.colors.darkest};

  svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.2rem;
    flex-shrink: 0;
    fill: ${THEME.colors.white};
  }

  a {
    font-family: Roboto, sans-serif;
    color: ${THEME.colors.white};
    display: flex;
    text-decoration: none;
    margin-top: 0.8rem;

    &:hover {
      color: ${THEME.colors.grey};
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    padding: 1rem 1rem;
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
  padding: 0 3rem;
  justify-content: center;
  align-items: center;
  grid-auto-columns: 1fr;
  grid-template-columns: auto;
  grid-template-rows: auto;
  border-radius: 4px;
  background-color: ${props => props.bgColor || THEME.colors.grey};
  /* box-shadow: 0 10px 20px -8px rgb(0 0 0 / 38%); */
  transition: transform 150ms,box-shadow 150ms,-webkit-transform 150ms;
  color: #fff;
  font-size: 16px;
  line-height: 1.4rem;
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
  padding-bottom: 1rem;
  background-color: ${THEME.colors.dark};

  .grid {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 85rem;

    @media (max-width: ${THEME.breakpoints.phone}) {
      width: 100%;
      flex-direction: column;
    }
  }
`;

export const Thumb = styled.div`
  text-align: center;
  font-family: Roboto, sans-serif;
  margin: 3rem 3rem 1.5rem;

  img {
    transition: all 0.3s;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      -webkit-filter: grayscale();
      filter: grayscale();
    }
  }

  h3 {
    margin: 0.6em 0 0;
  }

  p {
    width: 240px;
    text-align: center;
    margin: 0 auto;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    margin: 2rem 0 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  width: 100%;
  text-align: left;
  font-family: system-ui;
  line-height: 2.5rem;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}

  span {
    transition: all 0.3s;
    padding: 0.5rem;
    cursor: pointer;

    &:hover {
      color: ${THEME.colors.grey};
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      display: block;
      width: 11rem;
      padding: 0;
      font-size: 1.5rem;
      line-height: 1.7rem;
    }
  }

`;

export const LinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 29em;

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
  top: 3.4rem;
  right: 1rem;
  padding: 0 1rem 1rem;
  background: rgba(255,255,255,0.9);
  z-index: 99;
  border-radius: 4px;
  box-shadow: 20px 0 80px 20px rgb(138 138 149 / 40%);

  svg {
    fill: ${THEME.colors.dark};
  }

  li {
    &:not(:first-child) {
      margin-top: 1rem;
    }

    a {
      border-bottom: 0.2rem solid #000;
      justify-content: center;
      color: ${THEME.colors.dark};
    }
  }
`;

export const BioBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  ${props => props.noBottomPadding && 'padding-bottom: 0;'}
  width: 100%;
  font-size: 25px;
  text-align: left;
  min-height: 84%;
  height: auto;

  .biobox-inner {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 78rem;

    span {
      a {
        text-decoration: none;
      }
    }

    .headshot {
      img {
        border-radius: 4px;
      }
    }

    .product-screenshot {
      max-width: 27em;

      & > span {
        /* box-shadow: 4px 5px 13px 2px rgb(42 40 40 / 64%); */
        border-radius: 4px;
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      ${props => !props.about && 'flex-direction: column;'}
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      flex-direction: column;
    }
  }

  .text-wrapper {
    ${props => props.about ? 'max-width: 43rem;' : 'max-width: 33rem;'}
    ${props => props.direction && `margin-${props.direction}: 2em;`}

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      max-width: 35rem;
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 2.5rem;

      &.bottom {
        margin-bottom: 0;
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
    padding: 2rem;
    ${props => props.noBottomPadding && 'padding-bottom: 0;'}
  }
`;

export const SectionHeader = styled.h2`
  font-size: 2rem;
  margin: 0;
  text-align: center;
  font-family: Roboto, sans-serif;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 2rem;
  width: 100%;
  border-top: 1px solid ${THEME.colors.grey};
  font-family: Roboto, sans-serif;

  .footer-links {
    display: flex;
    justify-content: space-between;
    max-width: 34rem;
    width: 100%;
    margin-left: 1em;

    a {
      display: flex;
      text-decoration: none;
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      margin-top: 1rem;
      flex-direction: column;
      margin-left: 0;

      a:not(:first-child) {
        margin-top: 1rem;
      }
    }
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    width: 100%;
    flex-direction: column;
    padding: 1rem 2rem 2.1rem 2rem;
  }
`;
