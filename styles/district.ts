import styled, { css, keyframes } from 'styled-components';

import { hudButton, notchPolygon, notchStrokes } from './hud';
import { THEME } from './theme';
import type { DistrictTone } from '../src/types';

/*
 * Homepage districts (src/components/home/District.tsx) and the gig cards in
 * them (src/components/GridContent.tsx and Thumbnail.tsx). A $tone of case,
 * product, or web picks the district's neon. Only @media and keyframes here;
 * see styles/city.ts.
 */

const TONES: Record<DistrictTone, { color: string; glow: string }> = {
  case: { color: 'var(--neon-magenta)', glow: 'rgba(255, 43, 214, 0.55)' },
  product: { color: 'var(--neon-cyan)', glow: 'rgba(47, 243, 255, 0.55)' },
  web: { color: 'var(--neon-amber)', glow: 'rgba(255, 176, 59, 0.55)' },
};

type ToneProps = { $tone?: DistrictTone };

const toneColor = ({ $tone }: ToneProps) => ($tone ? TONES[$tone].color : 'var(--city-accent)');
const toneGlow = ({ $tone }: ToneProps) => ($tone ? TONES[$tone].glow : 'rgba(47, 243, 255, 0.55)');

const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`;

/** A district: a glass city block tinted by its tone. */
export const DistrictSection = styled.section`
  --district: ${toneColor};
  position: relative;
  margin: 0 clamp(0.75em, 3vw, 2.5em) clamp(2.5em, 6vw, 4.5em);
  padding: 0 clamp(0.75em, 2.4vw, 2em) clamp(1em, 2.4vw, 2em);
  border: 1px solid ${({ $tone }: ToneProps) => `var(--home-section-${$tone}-border)`};
  background: ${({ $tone }: ToneProps) => `var(--home-section-${$tone}-bg)`};

  /* Corner brackets in the district's neon. */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    pointer-events: none;
  }

  &::before {
    top: -1px;
    left: -1px;
    border-top: 2px solid var(--district);
    border-left: 2px solid var(--district);
  }

  &::after {
    right: -1px;
    bottom: -1px;
    border-right: 2px solid var(--district);
    border-bottom: 2px solid var(--district);
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    margin-inline: 0.75em;
    padding-inline: 0;
  }
`;

/** The district's street sign: number, kicker, the h2, and a readout. */
export const DistrictSign = styled.header`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: end;
  gap: 0.2em clamp(0.75em, 2vw, 1.5em);
  margin-bottom: clamp(0.75em, 1.6vw, 1.25em);
  padding: clamp(1.4em, 3vw, 2.2em) 0 clamp(0.9em, 1.6vw, 1.2em);
  text-align: left;

  /* The neon rule under the sign. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--district), transparent 80%);
    box-shadow: 0 0 calc(12px * var(--neon-glow-strength, 1)) var(--district);
    opacity: 0.85;
  }

  .district-no {
    grid-row: 1 / span 2;
    align-self: center;
    margin: 0;
    color: transparent;
    font-family: ${THEME.fonts.display};
    font-size: clamp(2.6rem, 6vw, 4.4rem);
    font-weight: 900;
    line-height: 0.85;
    -webkit-text-stroke: 1.5px var(--district);
    filter: drop-shadow(0 0 calc(10px * var(--neon-glow-strength, 1)) var(--district));
  }

  .district-kicker {
    margin: 0;
    color: var(--district);
    font-family: ${THEME.fonts.mono};
    font-size: 0.78rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;

    span {
      margin-left: 0.9em;
      color: var(--color-grey);
      font-family: ${THEME.fonts.cjk};
      letter-spacing: 0.24em;
    }
  }

  h2 {
    grid-column: 2;
    margin: 0;
    color: var(--color-white);
    font-family: ${THEME.fonts.display};
    font-size: clamp(1.45rem, 4.2vw, 2.9rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-shadow:
      0 0 calc(0.12em * var(--neon-glow-strength, 1)) var(--district),
      0 0 calc(0.5em * var(--neon-glow-strength, 1)) var(--district);
    overflow-wrap: anywhere;
  }

  .district-readout {
    grid-column: 3;
    grid-row: 1 / span 2;
    align-self: end;
    margin: 0;
    color: var(--color-grey);
    font-family: ${THEME.fonts.mono};
    font-size: 0.74rem;
    letter-spacing: 0.24em;
    text-align: right;
    text-transform: uppercase;

    b {
      display: block;
      color: var(--district);
      font-family: ${THEME.fonts.display};
      font-size: 1.7rem;
      letter-spacing: 0.06em;
      line-height: 1.1;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    grid-template-columns: auto minmax(0, 1fr);
    padding-inline: 1em;

    .district-kicker {
      font-size: 0.68rem;
      letter-spacing: 0.24em;
    }

    .district-readout {
      display: none;
    }
  }
`;

const gigBoot = keyframes`
  0% { opacity: 0; clip-path: inset(0 0 100% 0); transform: translate3d(0, 16px, 0); }
  55% { opacity: 1; clip-path: inset(0 0 0 0); }
  100% { opacity: 1; clip-path: inset(0 0 0 0); transform: none; }
`;

const scanBar = keyframes`
  0% { top: 0; opacity: 1; }
  55% { top: 100%; opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const glitchSlices = keyframes`
  0% { opacity: 0.85; transform: translate3d(-6px, 0, 0); clip-path: inset(8% 0 64% 0); }
  20% { transform: translate3d(5px, 0, 0); clip-path: inset(46% 0 32% 0); }
  40% { transform: translate3d(-3px, 0, 0); clip-path: inset(72% 0 6% 0); }
  60% { transform: translate3d(4px, 0, 0); clip-path: inset(24% 0 54% 0); }
  80% { opacity: 0.5; transform: translate3d(-2px, 0, 0); clip-path: inset(0 0 86% 0); }
  100% { opacity: 0; transform: none; clip-path: inset(0); }
`;

/** The district's card grid; a labelled scroll-snap carousel on phones. */
export const GigGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.5em;

  .grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: clamp(1.25em, 2.6vw, 2.25em);
    width: 100%;
    max-width: 100em;
    padding: 0.75em 0 0.5em;
  }

  &[data-standby] .gig {
    opacity: 0;
  }

  &[data-booted] .gig {
    animation: ${gigBoot} 0.7s ${THEME.easing.out} backwards;
    animation-delay: calc(var(--gig-i, 0) * 70ms);
  }

  &[data-booted] .gig::after {
    animation: ${scanBar} 0.7s ${THEME.easing.out} backwards;
    animation-delay: calc(var(--gig-i, 0) * 70ms);
  }

  ${({ $carousel }: { $carousel?: boolean }) => $carousel && css`
    @media (max-width: ${THEME.breakpoints.phone}) {
      .grid {
        flex-wrap: nowrap;
        justify-content: flex-start;
        gap: 1em;
        overflow-x: auto;
        padding: 0.75em 1em 0.9em;
        scroll-padding-inline: 1em;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
          height: 4px;
        }

        &::-webkit-scrollbar-thumb {
          background: var(--district, var(--city-accent));
        }

        &::-webkit-scrollbar-track {
          background: transparent;
        }

        > * {
          flex: 0 0 auto;
          scroll-snap-align: start;
        }
      }
    }
  `}
`;

/** Previous and next buttons for the phone carousel. */
export const GigCarouselControls = styled.div`
  display: none;

  @media (max-width: ${THEME.breakpoints.phone}) {
    display: flex;
    justify-content: flex-end;
    gap: 0.5em;
    align-self: stretch;
    padding: 0 1em;

    button {
      all: unset;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: var(--district, var(--city-accent));
      cursor: pointer;

      &::before {
        content: '';
        position: absolute;
        inset: 6px;
        border: 1px solid currentColor;
        background: rgba(var(--color-dark-rgb), 0.6);
        clip-path: ${notchPolygon('7px')};
      }

      &:focus-visible {
        outline: 2px solid var(--focus-ring);
        outline-offset: -2px;
      }

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      svg {
        position: relative;
        width: 18px;
        height: 18px;
        margin: 0;
      }
    }
  }
`;

/** A gig: a notched glass card with a scanlined thumbnail. */
export const GigCard = styled.div`
  --gig-tone: ${toneColor};
  --gig-glow: ${toneGlow};
  --tx: 0;
  --ty: 0;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  width: 248px;
  padding: 10px 10px 16px;
  color: var(--color-white);
  text-align: left;
  /* The side under the pointer lifts toward it, so the card never slips out from under the pointer. */
  transform: perspective(900px) rotateX(calc(var(--ty) * 7deg)) rotateY(calc(var(--tx) * -9deg));
  transition: transform 0.5s ${THEME.easing.out}, filter 0.3s ease;

  /* The glass plate, with the tone along its left edge and notches. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border: 1px solid var(--glass-border);
    background:
      ${notchStrokes('14px', 'var(--gig-tone)')},
      linear-gradient(90deg, var(--gig-tone) 0 2px, transparent 2px),
      linear-gradient(165deg, var(--glass-highlight), transparent 45%),
      var(--glass-bg);
    clip-path: ${notchPolygon('14px')};
  }

  /* The scan bar that wipes down the card as it boots. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 2px;
    background: var(--gig-tone);
    box-shadow: 0 0 12px var(--gig-tone);
    opacity: 0;
    pointer-events: none;
  }

  &[data-gallery] {
    cursor: pointer;
  }

  .gig-media {
    position: relative;
    display: block;
    aspect-ratio: 1;
    overflow: hidden;
    background: #02050a;

    > a {
      display: block;
      height: 100%;

      &:focus-visible {
        outline: none;
      }

      /* Drawn over the scanlines, which would otherwise dim the ring. */
      &:focus-visible::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 4;
        outline: 2px solid var(--focus-ring);
        outline-offset: -2px;
        pointer-events: none;
      }
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Tinted copies of the thumbnail that split apart on hover. They take
       the image only on hover (below): a background image downloads even at
       opacity 0, which would load every card up front despite the lazy img. */
    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background-position: center;
      background-size: cover;
      background-blend-mode: multiply;
      mix-blend-mode: screen;
      opacity: 0;
      pointer-events: none;
    }

    &::before {
      background-color: #ff2bd6;
    }

    &::after {
      background-color: #2ff3ff;
    }
  }

  .gig-scan {
    position: absolute;
    inset: 0;
    z-index: 2;
    background:
      repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 0 1px, transparent 1px 3px),
      linear-gradient(to top, rgba(2, 5, 10, 0.55), transparent 32%);
    pointer-events: none;
  }

  .gig-tag,
  .gig-status {
    position: absolute;
    top: 8px;
    z-index: 3;
    padding: 2px 6px;
    background: rgba(2, 5, 10, 0.8);
    font-family: ${THEME.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.18em;
    line-height: 1.5;
    text-transform: uppercase;
    pointer-events: none;
  }

  .gig-tag {
    left: 8px;
    color: var(--gig-tone);
  }

  .gig-status {
    right: 8px;
    border: 1px solid var(--gig-tone);
    color: #dffbff;
  }

  /* By day the neons darken, so the chips turn light to keep them legible. */
  html[data-theme='light'] & .gig-tag,
  html[data-theme='light'] & .gig-status {
    background: rgba(250, 247, 240, 0.92);
  }

  html[data-theme='light'] & .gig-status {
    color: var(--color-white);
  }

  h3 {
    margin: 0.8em 0.15em 0.3em;
    font-family: ${THEME.fonts.hud};
    font-size: 1.14rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    line-height: 1.2;
    text-transform: uppercase;
  }

  p {
    margin: 0 0.2em;
    color: var(--color-grey);
    font-size: 0.93rem;
    line-height: 1.45;

    .external-link-icon {
      display: inline-flex;
      align-items: center;
      margin-left: 0.25em;
      vertical-align: middle;

      svg {
        width: 0.95em;
        height: 0.95em;
        margin: 0;
      }
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  h3 a:hover,
  p a:hover,
  h3 a:focus-visible,
  p a:focus-visible {
    color: var(--gig-tone);
  }

  a:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }

  .gig-gallery {
    ${hudButton}
    --hud-accent: var(--gig-tone);
    align-self: flex-start;
    min-height: 44px;
    margin: 0.9em 0.15em 0;
    padding: 0 1.1em;
    font-size: 0.85rem;
  }

  .vh {
    ${visuallyHidden}
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      filter: drop-shadow(0 0 calc(14px * var(--neon-glow-strength, 1)) var(--gig-glow));
    }

    &:hover .gig-media::before,
    &:hover .gig-media::after {
      background-image: var(--thumb);
    }

    &:hover .gig-media::before {
      animation: ${glitchSlices} 0.45s steps(5, end);
    }

    &:hover .gig-media::after {
      animation: ${glitchSlices} 0.45s steps(5, end) 0.06s reverse;
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    width: min(72vw, 264px);
  }
`;
