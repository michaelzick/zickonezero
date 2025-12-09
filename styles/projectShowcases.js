import styled from 'styled-components';
import { DemoStokeTldrTitle, DemoStokeTldrImage } from './index';
import { THEME } from './theme';
import { keyframes, css } from 'styled-components';

export const PageShell = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: clamp(0.8em, 2.6vw, 1.4em) clamp(0.9em, 2.8vw, 2em)
    clamp(3.5em, 7vw, 6em);
  color: ${THEME.colors.white};
  font-size: 25px;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 18px;
    padding: clamp(0.55em, 3.8vw, 0.9em) clamp(0.55em, 3.8vw, 0.9em)
      clamp(3.5em, 7vw, 6em);
    margin-top: 2em;
  }
`;

export const PageInner = styled.div`
  max-width: 62em;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(3.5em, 7vw, 6em);
  text-align: left;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    gap: clamp(3.5em, 7vw, 6em);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: clamp(3.5em, 7vw, 6em);
  }
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
    gap: clamp(2em, 4vw, 3em);
  }
`;

export const HeroImageFrame = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0 ${THEME.radii.md} ${THEME.radii.md} 0;
  overflow: hidden;
  box-shadow: 0 30px 38px -30px rgb(0 0 0 / 70%);
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
  line-height: 1.1;
`;

export const Summary = styled.p`
  margin: 0;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: inherit;
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
    gap: 0.2em;
    padding-bottom: 0.08em;
    border-bottom: 2px solid ${THEME.colors.white};
    transition: color 0.2s ease, border-color 0.2s ease;

    &:hover {
      color: ${THEME.colors.hotRed};
      border-color: ${THEME.colors.hotRed};
    }
  }
`;

export const SectionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(2.4em, 6vw, 3.8em);
  text-align: left;
`;

export const SectionTitle = styled(DemoStokeTldrTitle)`
  color: ${THEME.colors.orange};
  margin-bottom: 0.35em;
`;

export const ShowcaseImage = styled(DemoStokeTldrImage)`
  ${(props) => props.$position && `object-position: ${props.$position};`}
  cursor: pointer;
  border: 1.5px solid ${THEME.colors.white};
  box-shadow: 0 18px 38px -30px rgb(0 0 0 / 70%);
  width: calc(100% + 1.5em);
  max-width: none;
  margin: -0.75em;

  &:hover {
    border-color: ${THEME.colors.hotRed};
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    width: 100%;
    margin: 0;
  }
`;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimatedSection = styled.div`
  opacity: 0;
  transform: translateY(18px);

  &.visible {
    animation: ${fadeUp} 0.7s ease forwards;
  }

  .image-animate {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease 0.18s, transform 0.6s ease 0.18s,
      border 0.3s ease;
  }

  .text-animate {
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease 0.32s, transform 0.6s ease 0.32s;
  }

  &.visible .image-animate {
    opacity: 1;
    transform: translateY(0);
  }

  &.visible .text-animate {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;

    &.visible {
      animation: none;
    }

    .image-animate,
    .text-animate {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;
