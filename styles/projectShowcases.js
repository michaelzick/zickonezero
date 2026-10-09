import styled, { keyframes } from 'styled-components';
import { DemoStokeMethodCard, DemoStokeTldrTitle, DemoStokeTldrImage } from './index';
import {
  hudButton,
  hudFrame,
  hudSlashes,
  notchPolygon,
  notchStrokes,
  scanlines,
  screenOverlay,
  storyPanel
} from './hud';
import { THEME } from './theme';

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
  gap: clamp(4em, 8vw, 7em);
  text-align: left;

  @media (max-width: ${THEME.breakpoints.largeTablet}) {
    gap: clamp(4em, 8vw, 7em);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    gap: clamp(4em, 8vw, 7em);
  }
`;

export const CaseStudyPageInner = styled(PageInner)`
  .ds-logo,
  .at-logo,
  .ngu-logo {
    width: 6em;
    height: auto;
    filter: drop-shadow(0 0 calc(16px * var(--neon-glow-strength, 1)) var(--city-glow));
  }

  section {
    scroll-margin-top: 10em;

    @media (max-width: ${THEME.breakpoints.largeTablet}) {
      scroll-margin-top: 7.2em;
    }

    @media (max-width: ${THEME.breakpoints.smallTablet}) {
      scroll-margin-top: 6.2em;
    }
  }

  section.story-section {
    margin-top: 2.5em;
  }

  /* Long-form sections sit on glass so body copy reads over the city. */
  section.story-section:not(#introduction) {
    ${storyPanel}
  }

  section#introduction.story-section,
  section#story-independent-surfboard-shaper-title.story-section,
  section#story-weekend-warrior.story-section,
  section#story-small-ski-shop.story-section {
    margin-top: 0;
  }
`;

export const CompactCaseStudyPageInner = styled(CaseStudyPageInner)`
  gap: clamp(1.75em, 3.5vw, 3em);
`;

export const CaseStudyIntroOffset = styled.div`
  width: 100%;
  margin-top: clamp(1.75em, 3.5vw, 3em);
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

/*
 * Hero media as a holo-billboard: a notched screen with accent strokes on
 * the notches, faint scanlines, a sheen, and a rim light in the route's
 * accent. Hover and focus styles brighten it through --frame-edge and
 * --frame-glow, which the overlay reads.
 */
export const HeroImageFrame = styled.div`
  --frame-notch: 18px;
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  clip-path: ${notchPolygon('var(--frame-notch)')};
  background: ${THEME.colors.darkest};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--frame-edge, var(--glass-border));
    background:
      ${notchStrokes('var(--frame-notch)', 'var(--city-accent)')},
      ${scanlines},
      linear-gradient(115deg, transparent 36%, rgba(255, 255, 255, 0.07) 46%, transparent 56%);
    background-origin: border-box;
    background-repeat: no-repeat;
    box-shadow: inset 0 0 2.6em -0.9em var(--frame-glow, var(--city-glow));
    pointer-events: none;
    transition: border-color 0.25s ease, box-shadow 0.3s ease;
  }
`;

export const HeroMediaFrame = styled(HeroImageFrame)`
  background: ${THEME.colors.darkest};

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const CaseStudyHeroMediaFrame = styled(HeroMediaFrame)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${THEME.colors.darkest};

  img,
  video {
    object-fit: contain;
    object-position: center;
  }
`;

export const HeroContent = styled.div`
  ${hudFrame({ blur: false })}
  --hud-frame-bg: var(--panel-bg);
  display: flex;
  flex-direction: column;
  gap: 0.9em;
  padding: clamp(1em, 2.2vw, 1.5em);
  text-align: left;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: 1.7;
`;

/* Neon heading: light ink with a glow in the route's accent. */
const neonHeading = `
  font-family: ${THEME.fonts.display};
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  text-shadow:
    0 0 0.04em var(--city-glow),
    0 0 calc(0.4em * var(--neon-glow-strength, 1)) var(--city-glow);
`;

export const IntroHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;
  margin-top: clamp(0.75em, 2vw, 1.2em);
  margin-bottom: clamp(0.8em, 2vw, 1.35em);

  .page-header {
    ${neonHeading}
    margin: 0;
    font-size: clamp(1.15em, 2.4vw, 1.5em);
    line-height: 1.15;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75em;

    .tab-header {
      font-size: 1.05em;
      text-align: left;
      margin: 0;
    }
  }
`;

export const CompactIntroHeaderRow = styled(IntroHeaderRow)`
  margin-top: clamp(1.75em, 3.5vw, 3em);
  margin-bottom: clamp(0.4em, 1vw, 0.675em);
`;

export const Title = styled.h1`
  ${neonHeading}
  margin: 0;
  font-size: clamp(1.6rem, 2.9vw, 2.35rem);
  line-height: 1.12;
`;

export const Summary = styled.p`
  margin: 0;
  font-size: clamp(1em, 1.35vw, 1.05em);
  line-height: inherit;
  opacity: 0.9;
`;

/* A mono "// DESCRIPTION" readout. */
export const HeroLabel = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  margin-bottom: 0.3em;
  font-family: ${THEME.fonts.mono};
  font-size: 0.68em;
  font-weight: 400;
  letter-spacing: 0.2em;
  line-height: 1.4;
  text-transform: uppercase;
  color: ${THEME.colors.mutedLabel};

  &::before {
    ${hudSlashes}
  }
`;

export const CaseStudyHeroLabel = styled(HeroLabel)`
  color: ${THEME.colors.mutedLabel};
`;

/* Roles as notched HUD chips. */
export const RoleList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.35em 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;

  li {
    --chip-notch: 7px;
    display: inline-flex;
    align-items: center;
    min-height: 1.9em;
    padding: 0.2em 0.8em;
    border: 1px solid var(--glass-border);
    background-color: rgba(var(--color-dark-rgb), 0.5);
    background-image: ${notchStrokes('var(--chip-notch)', 'var(--city-accent)')};
    background-origin: border-box;
    background-repeat: no-repeat;
    clip-path: ${notchPolygon('var(--chip-notch)')};
    color: ${THEME.colors.white};
    font-family: ${THEME.fonts.hud};
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.1em;
    line-height: 1.2;
    text-transform: uppercase;
  }
`;

export const LinkRow = styled.div`
  margin-top: 0.5em;

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6em 0.8em;
    margin-top: 0.4em;
  }

  a {
    ${hudButton}
    min-height: 44px;
    padding: 0 1.2em;
  }
`;

export const SectionsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(3.2em, 8vw, 5.2em);
  text-align: left;

  > *:first-child > section.story-section,
  > section.story-section:first-child {
    margin-top: 0;
  }
`;

export const SectionNavRevealAnchor = styled.div`
  width: 100%;
  height: 1px;
  margin-top: clamp(0.9em, 2vw, 1.4em);
`;

export const CompactSectionNavRevealAnchor = styled(SectionNavRevealAnchor)`
  margin-top: clamp(0.45em, 1vw, 0.7em);
`;

export const HiddenSectionAnchor = styled.div`
  width: 100%;
  height: 0;
  margin: 0;
  padding: 0;
`;

/* Section headings: amber HUD headings with a small accent "//" prefix. */
export const SectionTitle = styled(DemoStokeTldrTitle)`
  color: ${THEME.colors.orange};
  margin-bottom: 0.35em;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-shadow: 0 0 calc(0.45em * var(--neon-glow-strength, 1)) rgba(255, 176, 59, 0.35);

  &::before {
    ${hudSlashes}
    display: inline-block;
    margin-right: 0.4em;
    font-size: 0.55em;
    vertical-align: 0.3em;
    text-shadow: none;
  }
`;

export const CaseStudySectionTitle = styled(SectionTitle)`
  color: ${THEME.colors.orange};
`;

/* The glass panel behind each ProjectShowcase section. */
export const ShowcaseSectionCard = styled(DemoStokeMethodCard)`
  ${storyPanel}
`;

export const ShowcaseImageButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;

  ${(props) => props.$portrait && `
    display: flex;
    justify-content: center;
  `}

  /* Landscape screenshots fill the button, so it can frame them as HUD
     screens; portrait ones sit in a phone bezel instead. */
  ${(props) => !props.$portrait && screenOverlay}

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 4px;
  }
`;

export const ShowcaseImage = styled(DemoStokeTldrImage)`
  ${(props) => props.$position && `object-position: ${props.$position};`}
  width: 100%;
  max-width: 100%;
  margin: 0;
  transition: border-color 0.2s ease, box-shadow 0.25s ease;

  /* Phone screenshots (≈9:19.5) sit in a phone bezel, keep their aspect
     ratio, and are capped by height so a single section never dwarfs its
     copy. The bezel is a content-box border, so the caps include it. */
  ${(props) => props.$portrait && `
    box-sizing: content-box;
    width: auto;
    max-width: calc(min(100%, 22rem) - 0.9em);
    max-height: calc(min(80vh, 44rem) - 0.9em);
    aspect-ratio: 1284 / 2778;
    object-fit: contain;
    border: 0.45em solid #06090f;
    border-radius: 2.1em;
    background: #06090f;
    box-shadow: 0 0 0 1px var(--glass-border), 0 30px 48px -30px var(--shadow-deep);
  `}

  ${ShowcaseImageButton}:hover &,
  ${ShowcaseImageButton}:focus-visible & {
    border-color: var(--city-accent);
    box-shadow:
      0 24px 48px -32px var(--shadow-deep),
      0 0 0 1px var(--city-accent),
      0 0 28px -6px var(--city-glow);
  }

  ${(props) => props.$portrait && `
    ${ShowcaseImageButton}:hover &,
    ${ShowcaseImageButton}:focus-visible & {
      border-color: #06090f;
    }
  `}
`;

export const ShowcaseMediaButton = styled.button`
  all: unset;
  display: block;
  width: 100%;
  cursor: pointer;

  &:hover ${HeroMediaFrame},
  &:hover ${CaseStudyHeroMediaFrame},
  &:focus-visible ${HeroMediaFrame},
  &:focus-visible ${CaseStudyHeroMediaFrame} {
    --frame-edge: var(--city-accent);
    --frame-glow: var(--city-accent);
  }

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 4px;
  }
`;

/*
 * Sections "boot up" as they enter view: a scan line wipes them in from the
 * top, then a short horizontal jitter settles. The clip reaches 1em past
 * each edge so shadows survive the wipe, and the scan line rides the clip
 * edge. Both end on none, so a revealed section creates no containing block
 * or stacking context for the fixed overlays inside it.
 */
const bootUp = keyframes`
  0% {
    opacity: 0;
    clip-path: inset(-1em -1em 100% -1em);
    transform: translate3d(0, 14px, 0);
  }

  10% {
    opacity: 1;
  }

  58% {
    clip-path: inset(-1em -1em -1em -1em);
    transform: translate3d(0, 0, 0);
  }

  66% {
    transform: translate3d(-3px, 0, 0);
  }

  74% {
    transform: translate3d(2px, 0, 0);
  }

  82%,
  99% {
    opacity: 1;
    clip-path: inset(-1em -1em -1em -1em);
    transform: translate3d(0, 0, 0);
  }

  100% {
    opacity: 1;
    clip-path: none;
    transform: none;
  }
`;

const scanLine = keyframes`
  0% {
    top: -2px;
    opacity: 1;
  }

  58% {
    top: calc(100% + 1em - 2px);
    opacity: 1;
  }

  72%,
  100% {
    top: calc(100% + 1em - 2px);
    opacity: 0;
  }
`;

/* A page's opening hero boots up with the same settle and scan line, but
   no wipe and no fade: Chrome never credits Largest Contentful Paint to
   content first painted clipped or transparent, and credits a rising image
   only once it lands, which held these pages' LCP back by seconds. */
const bootUpOpening = keyframes`
  0% {
    transform: translate3d(0, 14px, 0);
  }

  58% {
    transform: translate3d(0, 0, 0);
  }

  66% {
    transform: translate3d(-3px, 0, 0);
  }

  74% {
    transform: translate3d(2px, 0, 0);
  }

  82%,
  100% {
    transform: none;
  }
`;

const REVEAL_EASING = 'cubic-bezier(0.2, 0.7, 0.2, 1)';

export const AnimatedSection = styled.div`
  position: relative;
  opacity: 0;
  transform: translate3d(0, 14px, 0);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--city-accent) 18%, #fff 50%, var(--city-accent) 82%, transparent);
    box-shadow: 0 0 12px 2px var(--city-glow);
    opacity: 0;
    pointer-events: none;
  }

  &.visible {
    animation: ${bootUp} 0.95s ${REVEAL_EASING} forwards;
  }

  &.visible::after {
    animation: ${scanLine} 0.95s ${REVEAL_EASING} forwards;
  }

  .image-animate,
  .text-animate {
    opacity: 0;
    transform: translate3d(0, 12px, 0);
  }

  .image-animate {
    transition: opacity 0.6s ease 0.25s, transform 0.6s ${THEME.easing.out} 0.25s,
      border-color 0.3s ease, box-shadow 0.3s ease;
  }

  .text-animate {
    transition: opacity 0.6s ease 0.38s, transform 0.6s ${THEME.easing.out} 0.38s;
  }

  &.visible .image-animate,
  &.visible .text-animate {
    opacity: 1;
    transform: none;
  }

  /* A page's opening hero (data-reveal='load') is rendered visible, so it
     boots up from the first paint instead of waiting for scripts. Its content
     is in place from that first frame while the panel settles and the scan
     line sweeps over it (see bootUpOpening). */
  &[data-reveal='load'] {
    opacity: 1;
  }

  &[data-reveal='load'].visible {
    animation-name: ${bootUpOpening};
  }

  &[data-reveal='load'] .image-animate,
  &[data-reveal='load'] .text-animate {
    opacity: 1;
    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;

    &.visible {
      animation: none;
    }

    &::after,
    &.visible::after {
      display: none;
      animation: none;
    }

    .image-animate,
    .text-animate {
      opacity: 1;
      transform: none;
      transition: none;
    }

    &[data-reveal='load'].visible {
      animation: none;
    }
  }
`;
