import styled from 'styled-components';

import { THEME } from './theme';

export const Container = styled.div`
  background-size: cover;
  color: #272727;
  background-color: #fff;
  text-align: center;
  font-family: Roboto, sans-serif;
  height: 100%;
  position: relative;

  .underline {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

  .command-line {
    font-family: monospace;
    background: #2e2e2e;
    padding: 0.2rem .3rem .3rem;
    color: #fff;
    border-radius: 3px;
    box-shadow: 0 10px 20px -8px rgb(0 0 0 / 53%);
  }

  .new-tab-svg {
    width: 1rem;
    height: 1rem;
    margin-top: 0.75rem;
    margin-left: 0.2rem;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    // Hide the full screen icon in Lightbox
    .fslightbox-toolbar-button:nth-child(1) {
      display: none;
    }
  }
`;

export const Wrapper = styled.div`
  ${props => props.isHomePage && 'padding-top: 1.7rem;'}
  min-height: 84%;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}
`;

export const Nav = styled.div`
  width: 100%;
  padding: 1rem 3rem 1rem 2.5rem;
  display: flex;
  background: #fff;
  border-bottom: 1px solid ${THEME.colors.grey};
  justify-content: space-between;

  a {
    line-height: 2.5rem;
    width: 5rem;
    display: flex;

    &:hover {
      color: ${THEME.colors.blue};
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
    background-color: #333;
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
  background-color: ${props => props.bgColor || THEME.colors.blue};
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

  .grid>div {
    margin: 3rem 3rem 1.5rem;
    img {
      border-radius: 4px;
      cursor: pointer;
      -webkit-filter: grayscale(100%);
      filter: grayscale(100%);

      &:hover {
        -webkit-filter: none;
        filter: none;
      }
    }
    h3 {
      margin: 0;
    }
    p {
      width: 240px;
      text-align: center;
      margin: 0 auto;
    }

    @media (max-width: ${THEME.breakpoints.phone}) {
      margin: 2rem 0 1rem;
    }
  }
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0 0 0.5rem;
  width: 100%;
  text-align: left;
  font-family: system-ui;
  ${props => props.isMobileMenuShown && 'filter: blur(2px);'}

  span {
    padding: 0.5rem;
    cursor: pointer;

    @media (max-width: ${THEME.breakpoints.phone}) {
      display: block;
      width: 11rem;
      padding: 0;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 1.5rem;
  }
`;

export const LinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 25rem;

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
  padding: 1rem;
  background: rgba(255,255,255,0.9);
  z-index: 99;
  border-radius: 4px;
  box-shadow: 20px 0 80px 20px rgb(138 138 149 / 40%);

  li {
    &:not(:first-child) {
      margin-top: 1rem;
    }

    a {
      border-bottom: 0.2rem solid #000;
      justify-content: center;
    }
  }
`;

export const BioBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
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

    .headshot {
      img {
        border-radius: 4px;
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);

        &:hover {
          -webkit-filter: none;
          filter: none;
        }
      }
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      flex-direction: column;
    }
  }

  .text-wrapper {
    max-width: 43rem;

    @media (max-width: 1137px) {
      max-width: 35rem;
    }

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      max-width: none;
      margin-bottom: 2.5rem;
    }
  }

  h2 {
    margin: 0;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    height: auto;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    padding: 2rem;
  }
`;

export const SectionHeader = styled.h2`
  font-size: 2rem;
  margin: 0;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 2rem;
  width: 100%;
  border-top: 1px solid ${THEME.colors.grey};

  .footer-links {
    display: flex;
    justify-content: space-between;
    width: 18rem;

    a {
      display: flex;

      &:hover {
        color: ${THEME.colors.blue};
      }

      svg {
        margin-top: 0.1rem;
      }
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      margin-top: 1rem;
    }

    @media (max-width: ${THEME.breakpoints.smallPhone}) {
      width: 100%;
      flex-direction: column;

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
