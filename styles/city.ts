import styled, { keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * The persistent city behind every page (src/components/city/).
 *
 * Only @media and keyframes here: jsdom's CSS parser drops a whole
 * styled-components sheet when it meets @supports, @container, @layer, or
 * @property. Registered properties live in globals.scss.
 *
 * Theme and accent selectors start with html (html[data-theme='light'] &),
 * never :root: styled-components 5 glues a selector that opens with a
 * pseudo-class onto the component's own class, so it never matches.
 *
 * Every layer is decorative, fixed, and pointer-transparent. Motion is limited
 * to transform and opacity so it stays on the compositor.
 */

const beamSweep = keyframes`
  from { transform: rotate(-24deg); }
  to { transform: rotate(18deg); }
`;

const fogDrift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
`;

const carCross = keyframes`
  0% { transform: translate3d(-10vw, 0, 0); }
  50% { transform: translate3d(48vw, -6px, 0); }
  100% { transform: translate3d(110vw, 3px, 0); }
`;

const fullViewport = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100lvh;
  pointer-events: none;
`;

export const CityBackdropRoot = styled.div`
  ${fullViewport}
  z-index: ${THEME.z.sky};
  overflow: hidden;
  contain: strict;
  background: linear-gradient(
    180deg,
    var(--sky-top) 0%,
    var(--sky-mid) 40%,
    var(--sky-low) 72%,
    var(--haze) 100%
  );
`;

const Layer = styled.div`
  position: absolute;
  inset: 0;
`;

export const SunGlow = styled(Layer)`
  opacity: var(--day-only, 0);
  transition: opacity 1.8s ease;
  background:
    radial-gradient(circle at 78% 14%, var(--sun) 0, rgba(255, 211, 107, 0.4) 7%, transparent 34%),
    radial-gradient(ellipse 90% 40% at 50% 100%, rgba(255, 236, 200, 0.55), transparent 70%);
`;

export const Searchlights = styled(Layer)`
  opacity: var(--night-only, 1);
  transition: opacity 1.6s ease;

  span {
    position: absolute;
    bottom: 22vh;
    left: 12%;
    width: max(16vw, 140px);
    height: 110vh;
    transform-origin: 50% 100%;
    background: linear-gradient(to top, rgba(170, 238, 255, 0.17), rgba(170, 238, 255, 0) 88%);
    clip-path: polygon(47% 100%, 53% 100%, 100% 0, 0 0);
    -webkit-mask-image: linear-gradient(to right, transparent, #000 38%, #000 62%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 38%, #000 62%, transparent);
    animation: ${beamSweep} 17s ${THEME.easing.inOut} infinite alternate;
    will-change: transform;
  }

  span:nth-child(2) {
    left: 58%;
    animation-duration: 23s;
    animation-delay: -9s;
  }

  span:nth-child(3) {
    left: 82%;
    animation-duration: 29s;
    animation-delay: -4s;
    animation-direction: alternate-reverse;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    span:nth-child(3) {
      display: none;
    }
  }
`;

/**
 * One skyline depth. The outer box pans with the route's camera (an eased
 * transition between pages); the inner .parallax box follows page scroll.
 * Keeping the two transforms on separate elements lets them animate
 * independently.
 */
export const SkylineDepth = styled.div`
  position: absolute;
  left: -14vw;
  right: -14vw;
  bottom: -9vh;
  height: 58vh;
  transform: translate3d(calc(var(--camera, 0) * -9vw), 0, 0);
  transition: transform 1.6s ${THEME.easing.inOut};

  &[data-depth='mid'] {
    left: -22vw;
    right: -22vw;
    bottom: -15vh;
    height: 74vh;
    transform: translate3d(calc(var(--camera, 0) * -18vw), 0, 0);
  }

  .parallax {
    position: absolute;
    inset: 0;
    transform: translate3d(0, calc(var(--page-progress, 0) * -5vh), 0);
    will-change: transform;
  }

  &[data-depth='mid'] .parallax {
    transform: translate3d(0, calc(var(--page-progress, 0) * -12vh), 0);
  }

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .silhouette {
    fill: var(--bldg-far);
  }

  &[data-depth='mid'] .silhouette {
    fill: var(--bldg-mid);
  }

  .windows {
    fill: none;
  }

  .windows-warm {
    stroke: var(--window-lit);
  }

  .windows-cool {
    stroke: var(--window-cool);
  }

  &[data-depth='far'] .windows {
    opacity: 0.5;
  }

  .beacon {
    fill: var(--neon-red);
  }

  .tone-magenta {
    fill: var(--neon-magenta);
    stroke: var(--neon-magenta);
  }

  .tone-cyan {
    fill: var(--neon-cyan);
    stroke: var(--neon-cyan);
  }

  .tone-violet {
    fill: var(--neon-violet);
    stroke: var(--neon-violet);
  }

  .tone-amber {
    fill: var(--neon-amber);
    stroke: var(--neon-amber);
  }

  .tone-red {
    fill: var(--neon-red);
    stroke: var(--neon-red);
  }

  .strip {
    stroke: none;
  }

  .strip-glow {
    stroke: none;
    opacity: calc(0.28 * var(--neon-glow-strength, 1));
  }

  .billboard {
    fill-opacity: 0.28;
    stroke-width: 1.4;
  }

  .billboard-glow {
    stroke: none;
    opacity: calc(0.16 * var(--neon-glow-strength, 1));
  }

  .billboard-copy {
    fill: none;
    stroke-width: 1.6;
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    .parallax,
    &[data-depth='mid'] .parallax {
      transform: none;
    }
  }
`;

export const FogBand = styled.div`
  position: absolute;
  left: 0;
  width: 200%;
  bottom: 12vh;
  height: 32vh;
  opacity: 0.42;
  background-image:
    radial-gradient(ellipse 20% 50% at 22% 55%, var(--haze), transparent 70%),
    radial-gradient(ellipse 26% 42% at 70% 45%, var(--haze), transparent 72%);
  background-size: 50% 100%;
  background-repeat: repeat-x;
  animation: ${fogDrift} 90s linear infinite;
  will-change: transform;
`;

export const TrafficLane = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 6px;

  .car {
    position: absolute;
    top: 0;
    left: 0;
    width: 22px;
    height: 5px;
    animation: ${carCross} 40s linear infinite;
    will-change: transform;
  }

  .car-body {
    position: absolute;
    inset: 0;
    border-radius: 2px 7px 3px 2px;
    background: var(--car-body);
    transform: scale(var(--car-scale, 1));
  }

  /* Headlight with a forward glow, tail light with a short light trail. */
  .car-body::before,
  .car-body::after {
    content: '';
    position: absolute;
    top: 1px;
    height: 2px;
    border-radius: 2px;
    opacity: calc(0.35 + 0.65 * var(--night-only, 1));
  }

  .car-body::before {
    right: -1px;
    width: 3px;
    background: #e9fbff;
    box-shadow: 0 0 6px 2px rgba(190, 245, 255, 0.75);
  }

  .car-body::after {
    right: 100%;
    width: 28px;
    background: linear-gradient(to left, rgba(255, 58, 92, 0.9), rgba(255, 58, 92, 0));
  }

  &[data-reverse='true'] .car {
    animation-direction: reverse;
  }

  &[data-reverse='true'] .car-body {
    transform: scale(calc(var(--car-scale, 1) * -1), var(--car-scale, 1));
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    &[data-wide-only='true'] {
      display: none;
    }
  }
`;

export const AccentGlow = styled(Layer)`
  opacity: 0;
  transition: opacity 1.4s ease;
  background: radial-gradient(ellipse 80% 48% at 50% 100%, var(--glow-color), transparent 72%);

  &[data-tone='magenta'] {
    --glow-color: var(--neon-magenta);
  }

  &[data-tone='cyan'] {
    --glow-color: var(--neon-cyan);
  }

  &[data-tone='amber'] {
    --glow-color: var(--neon-amber);
  }

  &[data-tone='violet'] {
    --glow-color: var(--neon-violet);
  }

  &[data-tone='red'] {
    --glow-color: var(--neon-red);
  }

  html[data-accent='magenta'] &[data-tone='magenta'],
  html[data-accent='cyan'] &[data-tone='cyan'],
  html[data-accent='amber'] &[data-tone='amber'],
  html[data-accent='violet'] &[data-tone='violet'],
  html[data-accent='red'] &[data-tone='red'],
  html:not([data-accent]) &[data-tone='cyan'] {
    opacity: var(--accent-glow, 0.4);
  }
`;

export const GroundHaze = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 44vh;
  opacity: 0.5;
  background: linear-gradient(to top, var(--haze), transparent);
`;

/** Quiets the city behind long-form pages. */
export const WorldDimmer = styled(Layer)`
  background: var(--color-dark);
  opacity: 0;
  transition: opacity 0.9s ease;

  &[data-dimmed='true'] {
    opacity: calc(var(--world-dim, 0.18) * 2.2);
  }
`;

export const WeatherCanvasElement = styled.canvas`
  ${fullViewport}
  z-index: ${THEME.z.weather};
  transition: opacity 0.9s ease;

  &[data-dimmed='true'] {
    opacity: 0.6;
  }
`;

/*
 * Fast travel: roll-up shutters drop over a client navigation and lift once
 * the new page is in. The timings drive the component's state machine.
 */
export const FAST_TRAVEL_COVER_MS = 300;
export const FAST_TRAVEL_REVEAL_MS = 540;
const SLAT_COVER_MS = 200;
const SLAT_REVEAL_MS = 400;
const SLAT_STAGGER_MS = 20;
const SLAT_REVEAL_STAGGER_MS = 28;

const slatDrop = keyframes`
  from { transform: translate3d(0, -100%, 0); }
  to { transform: translate3d(0, 0, 0); }
`;

const slatLift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -100%, 0); }
`;

const readoutIn = keyframes`
  from { opacity: 0; transform: translate3d(-50%, calc(-50% + 10px), 0); }
  to { opacity: 1; transform: translate3d(-50%, -50%, 0); }
`;

const readoutOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const routeLoad = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(0.72); }
`;

export const FastTravelOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${THEME.z.fastTravel};
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  overflow: hidden;
  pointer-events: none;

  .slat {
    position: relative;
    margin-right: -1px;
    background:
      repeating-linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.05) 0 1px,
        transparent 1px 7px,
        rgba(0, 0, 0, 0.28) 7px 8px
      ),
      linear-gradient(to bottom, var(--bldg-near), var(--color-darkest));
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.45);
    animation: ${slatDrop} ${SLAT_COVER_MS}ms ${THEME.easing.out} both;
    animation-delay: calc(var(--slat, 0) * ${SLAT_STAGGER_MS}ms);
    will-change: transform;
  }

  /* The leading edge: a neon strip in the destination's color. */
  .slat::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: var(--travel-accent, var(--city-accent));
    box-shadow: 0 0 calc(16px * var(--neon-glow-strength, 1)) 2px var(--travel-accent, var(--city-accent));
  }

  .readout {
    position: absolute;
    top: 50%;
    left: 50%;
    display: grid;
    gap: 0.55em;
    width: min(84vw, 26em);
    padding: 1.1em 1.3em 1.2em;
    border-left: 3px solid var(--travel-accent, var(--city-accent));
    background:
      linear-gradient(var(--scanline) 1px, transparent 1px) 0 0 / 100% 3px,
      rgba(3, 8, 16, 0.82);
    color: var(--hud-ink);
    font-family: ${THEME.fonts.mono};
    text-align: left;
    text-transform: uppercase;
    transform: translate3d(-50%, -50%, 0);
    animation: ${readoutIn} 0.22s ${THEME.easing.out} 0.08s both;
  }

  .readout-label {
    color: var(--travel-accent, var(--city-accent));
    font-size: 0.78rem;
    letter-spacing: 0.32em;
  }

  .readout-destination {
    overflow: hidden;
    font-family: ${THEME.fonts.display};
    font-size: clamp(1.35rem, 4.4vw, 2.3rem);
    font-weight: 800;
    letter-spacing: 0.06em;
    line-height: 1.15;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-shadow: 0 0 calc(18px * var(--neon-glow-strength, 1)) var(--travel-accent, var(--city-accent));
  }

  .readout-bar {
    height: 2px;
    background: var(--travel-accent, var(--city-accent));
    transform-origin: 0 50%;
    animation: ${routeLoad} ${FAST_TRAVEL_COVER_MS}ms ${THEME.easing.out} both;
  }

  &[data-phase='revealing'] .slat {
    animation: ${slatLift} ${SLAT_REVEAL_MS}ms ${THEME.easing.inOut} both;
    animation-delay: calc(var(--slat, 0) * ${SLAT_REVEAL_STAGGER_MS}ms);
  }

  &[data-phase='revealing'] .readout {
    animation: ${readoutOut} 0.14s ease both;
  }

  &[data-phase='revealing'] .readout-bar {
    transform: scaleX(1);
    animation: none;
  }
`;
