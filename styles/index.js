import styled from 'styled-components';

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
    max-width: 68rem;

    @media (max-width: 996px) {
      flex-direction: column;
    }
  }

  .text-wrapper {
    max-width: 43rem;

    @media (max-width: 1137px) {
      max-width: 35rem;
    }
    @media (max-width: 996px) {
      max-width: none;
      margin-bottom: 2.5rem;
    }
  }

  h2 {
    margin: 0;
  }

  @media (max-width: 500px) {
    padding: 2rem;
  }
`;
