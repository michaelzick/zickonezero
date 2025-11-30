import styled from 'styled-components';
import { DemoStokeTldrTitle, DemoStokeTldrImage } from './index';
import { THEME } from './theme';

export const PageShell = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: clamp(0.8em, 2.6vw, 1.4em) clamp(0.9em, 2.8vw, 2em) clamp(1.6em, 3.6vw, 2.8em);
  color: ${THEME.colors.white};
  font-size: 25px;

  @media (max-width: ${THEME.breakpoints.phone}) {
    font-size: 18px;
    padding: clamp(0.55em, 3.8vw, 0.9em);
    margin-top: 2em;
  }
`;

export const PageInner = styled.div`
  max-width: 62em;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(0em,6vw,4em);
  text-align: left;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    gap: clamp(0em, 6vw, 4em);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: clamp(2.3em, 6vw, 4em);
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
  border-radius: 0 16px 16px 0;
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
  color: ${THEME.colors.white};
  margin-bottom: 0.35em;
`;

export const ShowcaseImage = styled(DemoStokeTldrImage)`
  ${props => props.$position && `object-position: ${props.$position};`}
  cursor: pointer;
  border: 4px solid transparent;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: ${THEME.colors.hotRed};
  }
`;

export const SubNavBar = styled.div`
  position: sticky;
  top: 3.2em;
  z-index: 150;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75em;
  max-height: ${props => props.$isVisible ? '120px' : '0'};
  overflow: hidden;
  padding: ${props => props.$isVisible ? '0.55em 0.9em' : '0 0.9em'};
  margin-bottom: ${props => props.$isVisible ? '1em' : '0'};
  background: ${THEME.colors.dark};
  border: ${props => props.$isVisible ? '1px solid rgba(255, 255, 255, 0.18)' : '0 solid transparent'};
  border-radius: 12px;
  box-shadow: ${props => props.$isVisible ? '0 12px 28px -16px rgb(0 0 0 / 60%)' : 'none'};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-220%)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  transition: transform 0.32s ease, opacity 0.22s ease, max-height 0.32s ease, padding 0.32s ease, margin 0.32s ease;
  will-change: transform, opacity, max-height, padding, margin;

  @media (max-width: ${THEME.breakpoints.phone}) {
    top: 7.6em;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "thumb title"
      "thumb link";
    row-gap: 0.25em;
    padding: ${props => props.$isVisible ? '0.45em 0.9em' : '0 0.9em'};
  }
`;

export const SubNavThumb = styled.img`
  width: 2.6em;
  height: 2.6em;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 12px 28px -16px rgb(0 0 0 / 60%);
  border: 1px solid rgba(255, 255, 255, 0.24);

  @media (max-width: ${THEME.breakpoints.phone}) {
    width: 2.7em;
    height: 2.7em;
    grid-area: thumb;
    align-self: center;
  }
`;

export const SubNavTitle = styled.span`
  color: ${THEME.colors.white};
  font-weight: 700;
  font-size: 1em;
  line-height: 1.1;
  display: block;

  @media (max-width: ${THEME.breakpoints.phone}) {
    grid-area: title;
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    font-size: 0.8em;
  }
`;

export const SubNavLink = styled.a`
  color: ${THEME.colors.white};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  font-size: 0.95em;
  padding-bottom: 0.05em;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  justify-self: end;

  &:hover {
    color: ${THEME.colors.hotRed};
    border-color: ${THEME.colors.hotRed};
  }

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    font-size: 0.8em;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    justify-self: start;
    margin-top: 0.05em;
    grid-area: link;
  }
`;
