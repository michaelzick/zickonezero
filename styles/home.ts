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

const paperGust = keyframes`
  0%, 12% { transform: translate3d(0, 0, 0) rotate(-12deg); }
  36% { transform: translate3d(calc(var(--scrap-drift) * 0.35), var(--scrap-lift), 0) rotate(calc(var(--scrap-turn) * 0.4)); }
  65% { transform: translate3d(var(--scrap-drift), -6px, 0) rotate(var(--scrap-turn)); }
  82%, 100% { transform: translate3d(0, 0, 0) rotate(-12deg); }
`;

// Brief, shallow faults every few seconds, confined to two letters. There is
// at least a second of steady light between dips, even on the shorter loop.
const marketTubeFault = keyframes`
  0%, 18%, 21%, 53%, 56%, 86%, 89%, 100% { opacity: 1; }
  19%, 20% { opacity: 0.62; }
  54%, 55% { opacity: 0.75; }
  87%, 88% { opacity: 0.68; }
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

/** Panel and cue offsets, lifted clear of a phone's browser toolbar. */
const toolbarSafe = (offset: string) => `calc(${offset} + 100vh - 100svh)`;

export const HeroRoot = styled.section`
  --p: 0;
  --px: 0;
  --py: 0;
  --alley-persp: 1000px;
  --alley-eye: 56%;
  --alley-half: 30vw;
  --alley-near: 400px;
  --alley-depth: 3200px;
  --alley-walk: 560px;
  --alley-street: 86%;
  --alley-top: -70%;
  --alley-fog: rgba(25, 65, 70, 0.92);
  --alley-fog-mid: rgba(18, 46, 51, 0.45);
  --alley-ground: #090d10;
  --alley-cable: #02050a;
  --alley-metal: #1f3036;
  --alley-metal-edge: #465458;
  --alley-paper: #938e7b;
  --alley-grime: rgba(2, 8, 12, 0.45);
  --alley-crack: rgba(120, 141, 142, 0.24);
  --tower-face: #173039;
  --tower-side: #0a1b24;
  --tower-rim: #49717a;
  --tower-unlit: #203e46;
  --tower-warm: #c5af87;
  --tower-cool: #78bdc5;
  position: relative;
  height: 220vh;
  color: var(--color-white);
  ${facadePalette}
  --facade-wall-a: #121c24;
  --facade-wall-b: #172325;
  --facade-shutter: #202a2e;

  html[data-theme='light'] & {
    --alley-fog: rgba(246, 230, 204, 0.94);
    --alley-fog-mid: rgba(246, 230, 204, 0.45);
    --alley-ground: #7d746b;
    --alley-cable: #1d2427;
    --alley-metal: #5d6865;
    --alley-metal-edge: #9a9e8e;
    --alley-paper: #d2c7a9;
    --alley-grime: rgba(43, 33, 24, 0.25);
    --alley-crack: rgba(30, 37, 34, 0.45);
    --facade-wall-a: #7c7166;
    --facade-wall-b: #586b69;
    --facade-shutter: #666d68;
    --tower-face: #667c79;
    --tower-side: #435d5e;
    --tower-rim: #8ca19a;
    --tower-unlit: #425b5b;
    --tower-warm: #d4c6a3;
    --tower-cool: #adc8c4;
  }

  .hero-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  .hero-sky,
  .hero-scene,
  .hero-haze {
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

  /* display: contents keeps the towers as flat leaves of the existing 3D
     world. A wrapper with opacity would flatten and break wall occlusion. */
  .distant-towers { display: contents; }

  .distant-tower {
    --tower-clarity: clamp(0, (var(--p) - var(--tower-reveal)) * var(--tower-gain), 1);
    bottom: calc(100% - var(--alley-street));
    left: calc(50% + var(--tower-x) - var(--tower-width) * 0.5);
    width: var(--tower-width);
    height: var(--tower-height);
    transform: translateZ(var(--tower-depth));
    opacity: calc(0.035 + var(--tower-clarity) * 0.965);
    /* The bases dissolve into ground fog without an animated blur layer. */
    -webkit-mask-image: linear-gradient(to bottom, #000 0% 64%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0% 64%, transparent 100%);

    svg { display: block; width: 100%; height: 100%; overflow: visible; }
  }

  .tower-body { fill: var(--tower-face); stroke: var(--tower-rim); stroke-width: 1.5; }
  .tower-side { fill: var(--tower-side); }
  .tower-ribs, .tower-crown { fill: none; stroke: var(--tower-rim); stroke-width: 2; }
  .tower-windows { fill: none; stroke-width: 4; stroke-dasharray: 8 14; }
  .tower-unlit { stroke: var(--tower-unlit); }
  .tower-warm { stroke: var(--tower-warm); opacity: calc(0.15 + var(--tower-clarity) * 0.55); }
  .tower-cool { stroke: var(--tower-cool); opacity: calc(0.15 + var(--tower-clarity) * 0.65); }
  .tower-light { fill: none; stroke: var(--tower-cool); stroke-width: 2; opacity: calc(0.12 + var(--tower-clarity) * 0.5); }

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

  /* Reflections and paving share the street leaf, so none of it z-fights. */
  .street {
    left: calc(50% - var(--alley-half));
    top: calc(var(--alley-street) - var(--alley-depth));
    width: calc(var(--alley-half) * 2);
    height: var(--alley-depth);
    transform-origin: 50% 100%;
    transform: translateZ(var(--alley-near)) rotateX(90deg);
    background:
      linear-gradient(to bottom, var(--alley-fog) 0%, var(--alley-fog-mid) 22%, transparent 55%),
      var(--alley-ground);
  }

  .street-glow {
    position: absolute;
    inset: 0;
    opacity: var(--night-only, 1);
    background:
      radial-gradient(ellipse 22% 6% at 24% 92%, rgba(255, 43, 214, 0.22), transparent 70%),
      radial-gradient(ellipse 16% 8% at 72% 78%, rgba(47, 243, 255, 0.18), transparent 70%),
      radial-gradient(ellipse 12% 4% at 80% 94%, rgba(255, 176, 59, 0.18), transparent 70%);
  }

  .street-surface,
  .wall .wall-wear {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .paving-patches { fill: var(--alley-metal); opacity: 0.3; }
  .paving-cracks, .gutter { fill: none; stroke: var(--alley-crack); stroke-width: 3; }
  .gutter { stroke-width: 12; }
  .drain { fill: #070c0e; stroke: var(--alley-metal-edge); stroke-width: 3; }
  .drain-slats { fill: none; stroke: var(--alley-metal-edge); stroke-width: 7; }
  .puddle { fill: var(--alley-metal-edge); opacity: 0.12; }
  .wall-stains { fill: var(--alley-grime); }
  .utility-pipes { fill: none; stroke: var(--alley-metal-edge); stroke-width: 9; opacity: 0.65; }
  .pipe-clamps { fill: none; stroke: var(--alley-metal); stroke-width: 7; }
  .service-door { fill: var(--alley-metal); stroke: #0b1216; stroke-width: 8; }
  .door-inset { fill: none; stroke: var(--alley-metal-edge); stroke-width: 2; }
  .door-handle { fill: none; stroke: var(--alley-paper); stroke-width: 4; }
  .shutter-patches { fill: var(--alley-metal-edge); opacity: 0.45; }
  .wall-posters { fill: var(--alley-paper); opacity: 0.65; }
  .poster-ink { fill: none; stroke: var(--alley-metal); stroke-width: 3; }
  .service-light { fill: none; stroke: var(--neon-amber); stroke-width: 4; }

  .refuse {
    top: calc(var(--alley-street) - 120px);
    width: 180px;
    height: 130px;
    svg { width: 100%; height: 100%; }
  }

  .refuse-left {
    left: calc(50% - var(--alley-half) + 8px);
    transform: translateZ(-260px);
  }

  .refuse-right {
    left: calc(50% + var(--alley-half) - 190px);
    transform: translateZ(-880px) scaleX(-1);
  }

  .bin-body { fill: var(--alley-metal); stroke: var(--alley-metal-edge); stroke-width: 2; }
  .bin-trim, .bag-fold { fill: none; stroke: var(--alley-metal-edge); stroke-width: 2; }
  .trash-bag { fill: #11191b; stroke: var(--alley-metal); stroke-width: 2; }
  .loose-cardboard { fill: var(--alley-paper); }

  .service-crates {
    top: calc(var(--alley-street) - 94px);
    left: calc(50% + var(--alley-half) - 130px);
    width: 100px;
    height: 100px;
    transform: translateZ(-100px);

    i {
      position: absolute;
      bottom: 0;
      width: 60px;
      height: 45px;
      border: 4px solid var(--alley-metal-edge);
      background: repeating-linear-gradient(90deg, var(--alley-metal) 0 8px, #0f191c 8px 12px);
    }
    i:nth-child(2) { bottom: 43px; left: 4px; transform: rotate(-4deg); }
    i:nth-child(3) { left: 56px; width: 46px; height: 35px; }
  }

  .scrap-position {
    top: calc(var(--alley-street) - 16px);
    left: calc(50% + var(--scrap-x));
    width: var(--scrap-width);
    height: 12px;
    transform: translateZ(var(--z));
  }

  .paper-scrap {
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--alley-paper) 48%, var(--alley-metal-edge) 50%, var(--alley-paper) 62%);
    clip-path: polygon(0 16%, 82% 0, 100% 28%, 87% 100%, 8% 76%);
    transform: rotate(-12deg);
    animation: ${paperGust} var(--scrap-duration) ease-in-out var(--scrap-delay) infinite;
    animation-play-state: paused;
  }

  &[data-scene-motion='running'] .paper-scrap {
    animation-play-state: running;
  }

  &[data-scene-motion='still'] .paper-scrap {
    animation: none;
  }

  &:not([data-scene-motion='running']) .drone,
  &:not([data-scene-motion='running']) .drone-cone,
  &:not([data-scene-motion='running']) .scroll-cue i {
    animation-play-state: paused;
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

  .hero-haze {
    background: linear-gradient(to bottom, transparent 78%, rgba(var(--color-dark-rgb), 0.85) 100%);
  }

  html[data-theme='light'] & .hero-haze {
    background: linear-gradient(to bottom, transparent 84%, rgba(var(--color-dark-rgb), 0.6) 100%);
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

  /* A wall-mounted plate passes overhead as the visitor walks into the alley. */
  .market-sign {
    position: absolute;
    top: clamp(112px, 17vh, 170px);
    right: clamp(24px, 5vw, 80px);
    z-index: 2;
    width: clamp(190px, 19vw, 280px);
    padding: 22px 20px 14px;
    border: 5px solid var(--alley-metal-edge);
    background: radial-gradient(ellipse at 20% 0, #1e2729, #0b1316 75%);
    box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 2px #080d10;
    color: #f4d4a1;
    pointer-events: none;
    transform:
      translate3d(calc(var(--px) * -18px), calc(var(--p) * -64vh + var(--py) * -8px), 0)
      rotate(3deg) scale(calc(1 + var(--p) * 0.3));
    transform-origin: 100% 0;

    &::before {
      content: '';
      position: absolute;
      top: 18px;
      left: 100%;
      width: clamp(28px, 5vw, 80px);
      height: 54px;
      border-top: 7px solid var(--alley-metal-edge);
      border-bottom: 7px solid var(--alley-metal-edge);
    }

    &::after {
      content: '';
      position: absolute;
      inset: 5px;
      border: 1px solid rgba(47, 243, 255, 0.35);
      box-shadow: inset 0 0 calc(8px * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.15);
      background:
        radial-gradient(circle at 3px 3px, #89908b 0 2px, transparent 3px),
        radial-gradient(circle at calc(100% - 3px) calc(100% - 3px), #89908b 0 2px, transparent 3px);
    }
  }

  .market-name {
    display: block;
    margin: 0 0 16px;
    font-family: ${THEME.fonts.display};
    font-size: clamp(1.5rem, 2.6vw, 2.4rem);
    font-weight: 900;
    line-height: 1.15;
    text-transform: uppercase;
    color: #21180f;
    -webkit-text-stroke: 1.2px #ffe6b2;
    text-shadow:
      0 0 3px #ffd28a,
      0 0 calc(10px * var(--neon-glow-strength, 1)) #ffb03b,
      0 0 calc(24px * var(--neon-glow-strength, 1)) rgba(255, 144, 36, 0.8);
  }

  .market-word { display: block; }

  .market-flicker {
    display: inline-block;
    animation: ${marketTubeFault} 4.8s linear -1.7s infinite;
    animation-play-state: paused;
  }

  .market-flicker-late { animation-duration: 6.3s; animation-delay: -0.4s; }

  &[data-scene-motion='running'] .market-flicker { animation-play-state: running; }
  &[data-scene-motion='still'] .market-flicker { animation: none; }

  .market-translation {
    display: block;
    margin: 0 0 12px;
    color: #b8b3a4;
    font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    line-height: 1.4;
    text-shadow: none;
  }

  .market-direction {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #a9e8e1;
    font-family: ${THEME.fonts.mono};
    font-size: 1.8rem;
    span { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; }
  }

  .hero-panel {
    position: absolute;
    bottom: clamp(24px, 7vh, 72px);
    bottom: ${toolbarSafe('clamp(24px, 7vh, 72px)')};
    left: clamp(16px, 4vw, 64px);
    z-index: 3;
    width: min(640px, calc(100% - 2 * clamp(16px, 4vw, 64px)));
    padding: 30px 32px 32px;
    --hud-frame-bg: var(--panel-bg);
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

  .hero-title {
    margin: 0 0 16px;
    font-family: ${THEME.fonts.display};
    font-size: clamp(1.7rem, 3.2vw, 3rem);
    font-weight: 900;
    letter-spacing: -0.035em;
    line-height: 1.2;

    .brand-name {
      display: block;
      margin-top: 4px;
      font-size: 1.15em;
      letter-spacing: -0.025em;
    }

    /* Keep ONE inline so the accessible brand name remains one word in jsdom. */
    .brand-one { display: inline; }
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

  @media (max-width: ${THEME.breakpoints.phone}) {
    --alley-half: 38vw;
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

    .market-sign {
      top: 158px;
      right: 24px;
      width: 150px;
      padding: 10px 12px 8px;
      border-width: 3px;
    }

    .market-name { font-size: 1.2rem; margin: 4px 0 10px; -webkit-text-stroke-width: 0.8px; }
    .market-translation { font-size: 0.55rem; margin-bottom: 6px; }
    .market-direction { font-size: 1.3rem; gap: 6px; span { font-size: 0.5rem; } }
    .scrap-desktop { display: none; .paper-scrap { animation: none; } }
    .refuse { width: 130px; height: 94px; top: calc(var(--alley-street) - 86px); }
    .refuse-right { left: calc(50% + var(--alley-half) - 140px); }

    .hero-panel {
      bottom: 56px;
      bottom: ${toolbarSafe('56px')};
      left: 16px;
      width: calc(100% - 32px);
      padding: 20px 20px 22px;
    }

    .hero-eyebrow {
      font-size: 0.72rem;
      letter-spacing: 0.12em;
    }

    .hero-pitch {
      margin-bottom: 14px;
      font-size: 1.12rem;
    }

    .hero-title {
      margin-bottom: 12px;
      font-size: clamp(1.25rem, 5.8vw, 2rem);
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

  /* Short landscape screens keep the two corner elements clear of the nav. */
  @media (max-height: 520px) and (min-aspect-ratio: 4/3) {
    .distant-tower { height: calc(var(--tower-height) * 0.7); }

    .blade-dream {
      display: none;
    }

    .market-sign { top: 94px; width: 160px; padding: 10px 12px; }
    .market-name { font-size: 1.25rem; margin: 4px 0 10px; -webkit-text-stroke-width: 0.8px; }
    .market-translation { font-size: 0.6rem; margin-bottom: 6px; }
    .market-direction { font-size: 1.1rem; span { font-size: 0.5rem; } }

    .hero-panel {
      bottom: 16px;
      width: min(440px, 48vw);
      padding: 14px 16px 16px;
    }

    .hero-eyebrow {
      margin-bottom: 6px;
    }

    .hero-pitch {
      margin-bottom: 12px;
      font-size: 1.05rem;
    }

    .hero-title { font-size: clamp(1.15rem, 2.7vw, 1.65rem); margin-bottom: 8px; }

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

    .drone,
    .cursor-glow,
    .scroll-cue {
      display: none;
    }

    .paper-scrap, .market-flicker { animation: none; }
    .distant-tower { --tower-clarity: 0.65; }
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
