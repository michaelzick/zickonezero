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
    padding: 0 0.2rem;
    color: #fff;
    box-shadow: 0 10px 20px -8px rgb(0 0 0 / 53%);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    // Hide the full screen icon in Lightbox
    .fslightbox-toolbar-button:nth-child(1) {
      display: none;
    }
  }
`;

export const Nav = styled.div`
  width: 100%;
  padding: 1rem 3rem 1rem 2.5rem;
  display: flex;
  background: #fff;
  border-bottom: 1px solid #efefef;
  justify-content: space-between;

  a {
    line-height: 2.5rem;
    width: 5rem;
    &:not(:last-child):hover {
      border-bottom: 0.2rem solid #000;
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
  background-color: ${props => props.bgColor || '#0071E3'};
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
      border-radius: 5px;
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
  font-size: 1.9rem;
  margin: 0 0 0.5rem;
  width: 100%;
  text-align: left;
  font-family: system-ui;

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
  width: 30rem;

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    display: none;
  }
`;

export const LinkBoxMobile = styled.ul`
  list-style: none;
  position: absolute;
  top: 3.4rem;
  right: 1rem;
  padding: 1rem;
  background: #fff;
  z-index: 99;
  border-radius: 4px;
  box-shadow: 20px 0 80px 20px rgb(138 138 149 / 40%);

  li:not(:first-child) {
    margin-top: 1rem;
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
        border-radius: 5px;
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
  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 2rem;
    margin-top: 2rem;
  }
`;

export const SectionHeader = styled.h2`
  font-size: 32px;
  margin-bottom: 0;
`;

export const Footer = styled.div`
  text-align: left;
  padding: 2rem;
  width: 100%;
`;
