import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: center;

  a {
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

export const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
`;

export const SubTitle = styled.h2`
  margin: 0 0 1.5rem 0;
  line-height: 1.15;
  font-size: 3rem;
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
  background: rgba(40, 138, 138, 0.3);
  width: 100%;
  font-size: 25px;
  margin-top: 2rem;
  text-align: left;

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
    max-width: 42rem;

    @media (max-width: 1090px) {
      max-width: 35rem;
    }
    @media (max-width: 996px) {
      max-width: none;
      margin-bottom: 3rem;
    }
  }

  h2 {
    margin: 0;
  }
`;
