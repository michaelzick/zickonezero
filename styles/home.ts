import styled, { keyframes } from 'styled-components';

import { facadePalette } from './facade';
import { hudButton, neonButton } from './hud';
import { THEME } from './theme';

/*
 * Homepage scenes (src/components/home/). Only @media and keyframes here; see
 * styles/city.ts.
 *
 * The hero is a sticky 3D alley. .alley is the only preserve-3d box: every
 * .plane inside it is a flat leaf (walls, street, cables, signs) placed with
 * translateZ and a quarter turn, so the browser does the perspective.
 * Scrolling writes --p (0 to 1) on the hero, which walks the camera into the
 * alley; a mouse writes --px and --py (-1 to 1) on the stage for a little
 * head-tracking. Custom properties here are prefixed --alley- because the
 * city's color tokens are registered as <color> in globals.scss, and reusing
 * one of those names for a length would invalidate it.
 */

const arrowsMarch = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -160px, 0); }
`;

const rainFall = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-58px, 420px, 0); }
`;

const steamRise = keyframes`
  0% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.6); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate3d(-30px, -260px, 0) scale(2.2); }
`;

// Crosses in the first quarter of the loop, then waits off-screen.
const dronePatrol = keyframes`
  0% { transform: translate3d(-20vw, 0, 0); }
  26%, 100% { transform: translate3d(120vw, -5vh, 0); }
`;

const coneSweep = keyframes`
  from { transform: rotate(-14deg); }
  to { transform: rotate(14deg); }
`;

const cueBob = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0) rotate(45deg); }
  50% { transform: translate3d(0, 4px, 0) rotate(45deg); }
`;

/** Foreground rain streaks, tiled and animated with rainFall. */
const RAIN_TILE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='420'%3E%3Cg stroke='%23cfefff' stroke-width='1.4' stroke-linecap='round' opacity='.75'%3E%3Cpath d='M30 10l-8 60M140 120l-10 74M260 40l-7 52M370 200l-9 66M80 260l-8 58M210 300l-10 70M330 350l-6 44M400 60l-8 54'/%3E%3C/g%3E%3C/svg%3E\")";

const ARROW_TILE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'%3E%3Cpath d='M14 118 60 62l46 56' fill='none' stroke='%232ff3ff' stroke-width='14' stroke-linejoin='miter'/%3E%3C/svg%3E\")";

/** Panel and cue offsets, lifted clear of a phone's browser toolbar. */
const toolbarSafe = (offset: string) => `calc(${offset} + 100vh - 100svh)`;

export const HeroRoot = styled.section`
  --p: 0;
  --px: 0;
  --py: 0;
  --alley-persp: 1000px;
  --alley-eye: 56%;
  --alley-half: 36vw;
  --alley-near: 300px;
  --alley-depth: 3200px;
  --alley-walk: 560px;
  --alley-street: 86%;
  --alley-top: -70%;
  --alley-fog: rgba(28, 111, 120, 0.92);
  --alley-fog-mid: rgba(18, 70, 84, 0.5);
  --alley-ground: #03070c;
  --alley-cable: #02050a;
  position: relative;
  height: 220vh;
  color: var(--color-white);
  ${facadePalette}

  html[data-theme='light'] & {
    --alley-fog: rgba(246, 230, 204, 0.94);
    --alley-fog-mid: rgba(246, 230, 204, 0.45);
    --alley-ground: #7d746b;
    --alley-cable: #1d2427;
  }

  .hero-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  .hero-sky,
  .hero-scene,
  .hero-haze,
  .sign-spill,
  .near-rain {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hero-sky {
    background: radial-gradient(ellipse 30% 26% at 50% var(--alley-eye), rgba(47, 243, 255, 0.28), transparent 70%);
  }

  html[data-theme='light'] & .hero-sky {
    background: radial-gradient(ellipse 30% 26% at 50% var(--alley-eye), rgba(255, 238, 200, 0.6), transparent 70%);
  }

  .hero-scene {
    perspective: var(--alley-persp);
    perspective-origin: 50% var(--alley-eye);
  }

  .alley {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: translate3d(calc(var(--px) * -24px), calc(var(--py) * -14px), calc(var(--p) * var(--alley-walk)));
    will-change: transform;
  }

  .plane {
    position: absolute;
    backface-visibility: hidden;
  }

  /* Walls: face-on strips turned a quarter so they recede down the alley. */
  .wall {
    top: var(--alley-top);
    width: var(--alley-depth);
    height: calc(var(--alley-street) - var(--alley-top));

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to right, transparent 0%, var(--alley-fog-mid) 30%, var(--alley-fog) 72%);
    }
  }

  .wall-left {
    left: calc(50% - var(--alley-half));
    transform-origin: 0 50%;
    transform: translateZ(var(--alley-near)) rotateY(90deg);
  }

  .wall-right {
    left: calc(50% + var(--alley-half) - var(--alley-depth));
    transform-origin: 100% 50%;
    transform: translateZ(var(--alley-near)) rotateY(-90deg);

    svg {
      transform: scaleX(-1);
    }

    &::after {
      background: linear-gradient(to left, transparent 0%, var(--alley-fog-mid) 30%, var(--alley-fog) 72%);
    }
  }

  /* The street, its wet glow, and the holo arrows painted on it. */
  .street {
    left: calc(50% - var(--alley-half));
    top: calc(var(--alley-street) - var(--alley-depth));
    width: calc(var(--alley-half) * 2);
    height: var(--alley-depth);
    transform-origin: 50% 100%;
    transform: translateZ(var(--alley-near)) rotateX(90deg);
    background:
      linear-gradient(to bottom, var(--alley-fog) 0%, var(--alley-fog-mid) 22%, transparent 55%),
      repeating-linear-gradient(90deg, transparent 0 46px, rgba(150, 210, 230, 0.05) 46px 48px),
      var(--alley-ground);
  }

  .street-glow {
    position: absolute;
    inset: 0;
    opacity: var(--night-only, 1);
    background:
      radial-gradient(ellipse 18% 9% at 50% 88%, rgba(255, 43, 214, 0.45), transparent 70%),
      radial-gradient(ellipse 12% 22% at 50% 70%, rgba(47, 243, 255, 0.28), transparent 70%),
      radial-gradient(ellipse 8% 4% at 30% 93%, rgba(255, 176, 59, 0.3), transparent 70%),
      radial-gradient(ellipse 10% 5% at 72% 80%, rgba(163, 91, 255, 0.3), transparent 70%),
      linear-gradient(90deg, rgba(255, 43, 214, 0.22) 0 4%, transparent 9% 91%, rgba(47, 243, 255, 0.22) 96% 100%);
  }

  .arrows {
    left: calc(50% - 60px);
    top: calc(var(--alley-street) - var(--alley-depth) * 0.6);
    width: 120px;
    height: calc(var(--alley-depth) * 0.6);
    overflow: hidden;
    transform-origin: 50% 100%;
    transform: translateZ(calc(var(--alley-near) - var(--alley-depth) * 0.06)) rotateX(90deg) translateZ(2px);
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 85%, transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 30%, #000 85%, transparent);
  }

  .arrows-track {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: calc(100% + 160px);
    background: ${ARROW_TILE} center top / 120px 160px repeat-y;
    filter: drop-shadow(0 0 8px rgba(47, 243, 255, 0.9));
    opacity: calc(0.5 + 0.35 * var(--night-only, 1));
    animation: ${arrowsMarch} 1.6s linear infinite;
  }

  /* Cables sag across the alley at --z. */
  .cable {
    top: 0;
    left: calc(50% - var(--alley-half));
    width: calc(var(--alley-half) * 2);
    height: 60%;
    transform: translateZ(var(--z));

    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    path {
      fill: none;
      stroke: var(--alley-cable);
      stroke-width: 3px;
      vector-effect: non-scaling-stroke;
    }

    .cable-thin {
      stroke-width: 2px;
    }
  }

  /* Blade signs jut from the walls, facing the street. */
  .blade {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid var(--tone);
    background: rgba(4, 6, 12, 0.88);
    color: var(--tone);
    font-family: ${THEME.fonts.cjk};
    font-weight: 900;
    line-height: 1;
    box-shadow: 0 0 calc(22px * var(--neon-glow-strength, 1)) var(--tone), inset 0 0 18px rgba(0, 0, 0, 0.6);
    text-shadow: 0 0 calc(6px * var(--neon-glow-strength, 1)) var(--tone), 0 0 calc(18px * var(--neon-glow-strength, 1)) var(--tone);
  }

  .blade-name {
    --tone: var(--neon-magenta);
    top: 6%;
    left: calc(50% - var(--alley-half));
    width: 96px;
    height: 520px;
    font-size: 58px;
    letter-spacing: 0.04em;
    writing-mode: vertical-rl;
    transform: translateZ(-380px);
  }

  .blade-dream {
    --tone: var(--neon-cyan);
    top: 18%;
    left: calc(50% + var(--alley-half) - 160px);
    width: 160px;
    height: 160px;
    font-size: 112px;
    transform: translateZ(-760px);
  }

  .blade-open {
    --tone: var(--neon-amber);
    top: 48%;
    left: calc(50% - var(--alley-half));
    width: 70px;
    height: 200px;
    font-size: 46px;
    writing-mode: vertical-rl;
    transform: translateZ(-1500px);
  }

  /* The LED ticker spans the alley far ahead; it shows once the sign lifts. */
  .banner {
    top: 2%;
    left: calc(50% - var(--alley-half));
    width: calc(var(--alley-half) * 2);
    height: 160px;
    font-size: 92px;
    transform: translateZ(-2200px);
    opacity: clamp(0, (var(--p) - 0.06) * 6, 1);
  }

  /* Flat layers in front of the alley. */
  .sign-spill {
    background:
      radial-gradient(ellipse 46% 30% at 50% 30%, rgba(255, 43, 214, 0.2), transparent 72%),
      radial-gradient(ellipse 30% 14% at 50% 20%, rgba(47, 243, 255, 0.1), transparent 72%);
    opacity: calc(var(--night-only, 1) * (1 - var(--p)));
    transform: translate3d(0, calc(var(--p) * -50vh), 0);
  }

  .hero-haze {
    background: linear-gradient(to bottom, transparent 78%, rgba(var(--color-dark-rgb), 0.85) 100%);
  }

  html[data-theme='light'] & .hero-haze {
    background: linear-gradient(to bottom, transparent 84%, rgba(var(--color-dark-rgb), 0.6) 100%);
  }

  .near-rain {
    overflow: hidden;
    opacity: calc(0.55 * var(--night-only, 1));

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -420px;
      right: -10%;
      bottom: 0;
      left: -10%;
      background: ${RAIN_TILE} 0 0 / 420px 420px repeat;
      animation: ${rainFall} 0.7s linear infinite;
    }

    &::after {
      background-size: 640px 640px;
      opacity: 0.6;
      filter: blur(1px);
      animation-duration: 0.45s;
    }
  }

  .steam {
    position: absolute;
    right: 14%;
    bottom: 4%;
    width: 220px;
    height: 340px;
    opacity: var(--night-only, 1);
    pointer-events: none;

    i {
      position: absolute;
      bottom: 0;
      left: 30%;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(200, 235, 255, 0.12), transparent 70%);
      filter: blur(10px);
      opacity: 0;
      animation: ${steamRise} 7s ease-out infinite;
    }

    i:nth-child(2) {
      left: 10%;
      animation-delay: -2.4s;
    }

    i:nth-child(3) {
      left: 45%;
      animation-delay: -4.8s;
    }
  }

  /* A patrol drone crosses every 38 seconds, sweeping a light cone. */
  .drone {
    position: absolute;
    top: 24%;
    left: 0;
    width: 120px;
    height: 260px;
    pointer-events: none;
    transform: translate3d(-30vw, 0, 0);
    animation: ${dronePatrol} 38s linear 6s infinite;
  }

  .drone-body {
    position: absolute;
    top: 0;
    left: 30px;
    width: 60px;
    height: 14px;
    border-radius: 7px;
    background: #0b1018;
    box-shadow: 0 0 0 1px rgba(150, 210, 230, 0.2);

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -5px;
      width: 26px;
      height: 3px;
      background: #1a2633;
    }

    &::before {
      left: -18px;
    }

    &::after {
      right: -18px;
    }
  }

  .drone-cone {
    position: absolute;
    top: 12px;
    left: 0;
    width: 120px;
    height: 240px;
    background: linear-gradient(to bottom, rgba(255, 79, 69, 0.35), transparent 80%);
    clip-path: polygon(46% 0, 54% 0, 100% 100%, 0 100%);
    filter: blur(2px);
    opacity: calc(0.35 + 0.65 * var(--night-only, 1));
    transform-origin: 50% 0;
    animation: ${coneSweep} 2.6s ${THEME.easing.inOut} infinite alternate;
  }

  /* A soft neon glow that follows a mouse across the wet street. */
  .cursor-glow {
    position: absolute;
    top: -260px;
    left: -260px;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(47, 243, 255, 0.14), rgba(255, 43, 214, 0.07) 42%, transparent 70%);
    opacity: 0;
    pointer-events: none;
    transform: translate3d(var(--mx, 50vw), var(--my, 50vh), 0);
    transition: opacity 0.6s ease;
  }

  .hero-stage[data-pointer] .cursor-glow {
    opacity: var(--night-only, 1);
  }

  /* The sign hangs from the cables and rises out of view as the camera walks in. */
  .hero-sign {
    position: absolute;
    top: clamp(96px, 15vh, 160px);
    left: 50%;
    z-index: 2;
    width: max-content;
    max-width: calc(100vw - 32px);
    font-size: min(12.6vw, 16vh);
    transform:
      translate3d(calc(-50% + var(--px) * -18px), calc(var(--p) * -64vh + var(--py) * -8px), 0)
      scale(calc(1 + var(--p) * 0.3));
    transform-origin: 50% 0;
    will-change: transform;

    &::after {
      content: '';
      position: absolute;
      right: 12%;
      bottom: 100%;
      left: 12%;
      height: 100vh;
      border-right: 2px solid rgba(150, 210, 230, 0.22);
      border-left: 2px solid rgba(150, 210, 230, 0.22);
      pointer-events: none;
    }
  }

  .hero-panel {
    position: absolute;
    bottom: clamp(24px, 7vh, 72px);
    bottom: ${toolbarSafe('clamp(24px, 7vh, 72px)')};
    left: clamp(16px, 4vw, 64px);
    z-index: 3;
    width: min(460px, calc(100vw - 32px));
    padding: 22px 24px 24px;
    text-align: left;
    opacity: calc(1 - var(--p) * 3);
    transform: translate3d(0, calc(var(--p) * 60px), 0);

    /* The scene behind is always moving; skip the costly glass blur. */
    &::before {
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }

    &:focus-within {
      opacity: 1;
    }
  }

  &[data-scrolled-past] .hero-panel:not(:focus-within) {
    pointer-events: none;
  }

  .hero-eyebrow {
    margin: 0 0 10px;
    color: var(--neon-cyan);
    font-family: ${THEME.fonts.mono};
    font-size: 0.82rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .hero-pitch {
    margin: 0 0 20px;
    font-family: ${THEME.fonts.hud};
    font-size: 1.35rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .hero-ctas {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .hero-cta {
    ${neonButton}
  }

  .hero-contact {
    ${hudButton}
  }

  .scroll-cue {
    position: absolute;
    bottom: 22px;
    bottom: ${toolbarSafe('22px')};
    left: 50%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    color: var(--hud-ink-dim);
    font-family: ${THEME.fonts.mono};
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: calc(1 - var(--p) * 6);
    transform: translateX(-50%);
    pointer-events: none;

    i {
      width: 14px;
      height: 14px;
      border-right: 2px solid var(--neon-cyan);
      border-bottom: 2px solid var(--neon-cyan);
      transform: rotate(45deg);
      animation: ${cueBob} 1.8s ease-in-out infinite;
    }
  }

  html[data-theme='light'] & .scroll-cue {
    color: var(--color-grey);
  }

  /* No rain or steam by day; skip their animations entirely. */
  html[data-theme='light'] & .near-rain,
  html[data-theme='light'] & .steam {
    display: none;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    --alley-half: 44vw;
    --alley-persp: 760px;
    --alley-near: 220px;
    --alley-walk: 420px;
    --alley-eye: 50%;
    height: 160vh;

    .blade-name {
      top: 10%;
      width: 64px;
      height: 360px;
      font-size: 40px;
    }

    .blade-dream {
      left: calc(50% + var(--alley-half) - 110px);
      width: 110px;
      height: 110px;
      font-size: 76px;
    }

    .blade-open {
      width: 54px;
      height: 150px;
      font-size: 34px;
    }

    .hero-sign {
      top: clamp(150px, 21vh, 190px);
    }

    .hero-panel {
      bottom: 56px;
      bottom: ${toolbarSafe('56px')};
      padding: 16px 16px 18px;
    }

    .hero-eyebrow {
      font-size: 0.72rem;
      letter-spacing: 0.12em;
    }

    .hero-pitch {
      margin-bottom: 14px;
      font-size: 1.12rem;
    }

    .hero-ctas {
      gap: 10px;
    }

    .hero-cta,
    .hero-contact {
      min-height: 44px;
      padding: 0 1.05em;
      font-size: 0.92rem;
      letter-spacing: 0.1em;
    }

    .scroll-cue {
      bottom: 10px;
      bottom: ${toolbarSafe('10px')};
    }
  }

  /* Short landscape screens: the sign moves right of the panel, where the
     夢 blade sign would show through it. */
  @media (max-height: 520px) and (min-aspect-ratio: 4/3) {
    .blade-dream {
      display: none;
    }

    .hero-sign {
      top: 80px;
      right: clamp(16px, 4vw, 64px);
      left: auto;
      font-size: min(7vw, 15vh);
      transform:
        translate3d(calc(var(--px) * -18px), calc(var(--p) * -64vh + var(--py) * -8px), 0)
        scale(calc(1 + var(--p) * 0.3));
      transform-origin: 100% 0;
    }

    .hero-panel {
      bottom: 16px;
      width: min(360px, 44vw);
      padding: 14px 16px 16px;
    }

    .hero-eyebrow {
      margin-bottom: 6px;
    }

    .hero-pitch {
      margin-bottom: 12px;
      font-size: 1.05rem;
    }

    .hero-cta,
    .hero-contact {
      min-height: 44px;
      padding: 0 1em;
      font-size: 0.9rem;
    }

    .scroll-cue {
      display: none;
    }
  }

  /* Reduced motion: one still frame of the alley in normal flow. */
  @media (prefers-reduced-motion: reduce) {
    height: auto;

    .hero-stage {
      position: relative;
    }

    .near-rain,
    .steam,
    .drone,
    .cursor-glow,
    .scroll-cue {
      display: none;
    }
  }
`;

/**
 * The end of the homepage route (src/components/MainContent.tsx): an empty
 * stretch with nothing over it, so the persistent city shows through clearly
 * before the footer. The skyline sits in the bottom half of the viewport, so
 * the stretch is most of a screen tall: the whole skyline is clear before the
 * footer scrolls up over it.
 */
export const CityGap = styled.div`
  height: max(18rem, 80vh);
`;
