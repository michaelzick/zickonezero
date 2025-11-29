import styled from 'styled-components';
import { DemoStokeTldrTitle } from './index';
import { THEME } from './theme';

export const PageShell = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: clamp(1.6em, 4vw, 2.6em) clamp(1.2em, 3vw, 2.8em) clamp(2.4em, 5vw, 3.6em);
  color: ${THEME.colors.white};
  font-size: 25px;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 18px;
    padding: clamp(1em, 5vw, 1.4em);
  }
`;

export const PageInner = styled.div`
  max-width: 62em;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(1.4em, 3vw, 2em);
  text-align: left;
`;

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: clamp(1.2em, 3vw, 2.4em);
  align-items: center;
  padding: 0;
  border-radius: 0;
  border: none;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    grid-template-columns: 1fr;
  }
`;

export const HeroImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0 16px 16px 0;
  overflow: hidden;
  box-shadow: 0 18px 46px -28px rgb(0 0 0 / 80%);
  background: transparent;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  text-align: left;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2rem, 4.6vw, 3.1rem);
  letter-spacing: 0.01em;
  color: ${THEME.colors.hotRed};
  line-height: 1.1;
`;

export const Summary = styled.p`
  margin: 0;
  clamp(1em,1.35vw,1.05em);
  line-height: inherit;
  color: ${THEME.colors.white};
  opacity: 0.9;
`;

export const HeroLabel = styled.div`
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  font-size: 0.86em;
  color: ${THEME.colors.orange};
`;

export const RoleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.2em 0 0;
  display: grid;
  gap: 0.35em;

  li {
    display: inline-flex;
    align-items: flex-start;
    gap: 0.5em;
    line-height: 1.5;
    color: ${THEME.colors.white};

    &::before {
      content: '•';
      color: ${THEME.colors.white};
      font-size: 1.2em;
      line-height: 1;
      transform: translateY(-0.05em);
    }
  }
`;

export const LinkRow = styled.div`
  margin-top: 0.5em;

  a {
    color: ${THEME.colors.white};
    text-decoration: none;
    font-weight: 400;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    padding-bottom: 0.08em;
    border-bottom: 2px solid ${THEME.colors.white};
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.85);
      border-color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const SectionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(1.2em, 3vw, 1.9em);
  text-align: left;
`;

export const SectionTitle = styled(DemoStokeTldrTitle)`
  color: ${THEME.colors.white};
  margin-bottom: 0.35em;
`;
