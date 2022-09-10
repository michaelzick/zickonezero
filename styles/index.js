import styled from 'styled-components';

import { THEME } from './theme';

export const Container = styled.div`
  background-size: cover;
  color: #272727;
  background-color: #efefef;
`;

export const Main = styled.main`
  min-height: 100vh;
  padding: 3rem 0 0;
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
    img {
      margin: 3rem;
      width: 240px;
      height: 240px;
      border-radius: 3px;
      box-shadow: 3px 8px 12px #5c5c5c;
      cursor: pointer;

      @media (max-width: ${THEME.breakpoints.phone}) {
        margin: 2rem;
      }
    }
  }
`;

export const Wrapper = styled.div`
  text-align: center;
  font-family: Roboto, sans-serif;

  .titles {
    width: 100%;
    text-align: left;
    padding-left: 3rem;
    font-family: system-ui;
  }

  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const Title = styled.h1`
  font-size: 2.3rem;
  margin: 0 0 0.5rem;
`;

export const SubTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  line-height: 1.15;
  font-size: 1.4rem;

  @media (max-width: ${THEME.breakpoints.phone}) {
    max-width: 250px;
  }
`;

export const LinkBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin-bottom: 1rem;
`;

export const BioBox = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
  width: 100%;
  font-size: 25px;
  margin-top: 2rem;
  text-align: left;
  border-top: 1px solid #fff;

  .biobox-inner {
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 78rem;

    .headshot {
      img {
        height: 392px;
        width: 350px;
        border-radius: 3px;
      }
    }

    @media (max-width: ${THEME.breakpoints.tablet}) {
      flex-direction: column;
    }
  }

  .text-wrapper {
    max-width: 43rem;

    @media (max-width: 1137px) {
      max-width: 35rem;
    }
    @media (max-width: ${THEME.breakpoints.tablet}) {
      max-width: none;
      margin-bottom: 2.5rem;
    }
  }

  h2 {
    margin: 0;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    padding: 2rem;
  }
`;
