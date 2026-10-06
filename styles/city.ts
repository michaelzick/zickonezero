import styled, { keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * The persistent city behind every page (src/components/city/).
 *
 * Only @media and keyframes here: jsdom's CSS parser drops a whole
 * styled-components sheet when it meets @supports, @container, @layer, or
 * @property. Registered properties live in globals.scss.
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

// Rests lit, so reduced motion (one 1ms iteration) leaves beacons on.
const beaconBlink = keyframes`
  0%, 20% { opacity: 1; }
  22%, 86% { opacity: 0.18; }
  88%, 100% { opacity: 1; }
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

  .flicker-window {
    fill: var(--bldg-mid);
    opacity: 0;
  }

  .flicker-window.is-dim {
    opacity: calc(0.65 * var(--night-only, 1));
  }

  .beacon {
    fill: var(--neon-red);
    animation: ${beaconBlink} 2.8s steps(1, end) infinite;
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

  :root[data-accent='magenta'] &[data-tone='magenta'],
  :root[data-accent='cyan'] &[data-tone='cyan'],
  :root[data-accent='amber'] &[data-tone='amber'],
  :root[data-accent='violet'] &[data-tone='violet'],
  :root[data-accent='red'] &[data-tone='red'],
  :root:not([data-accent]) &[data-tone='cyan'] {
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
