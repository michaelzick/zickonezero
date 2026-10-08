import styled, { keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * The end of the homepage route (src/components/home/CityGapScene.tsx): open
 * air before the footer with one giant piece in the foreground, a street
 * hologram at night (StreetHologram) and a sightseeing airship by day
 * (Airship). Both are in the static HTML and the theme picks one, so the page
 * never flashes the wrong one.
 *
 * useScrollProgress writes --p (0 to 1) as the stretch scrolls into view, and
 * useSceneMotion writes data-scene-motion. Only transform and opacity animate,
 * on their own layers: the art itself is static, so its glow and gradients are
 * rasterized once. Reduced motion leaves --p unset, so the fallbacks below are
 * the still frame. Only @media and keyframes here; see styles/city.ts.
 */

const sway = keyframes`
  from { transform: rotate(-0.6deg); }
  to { transform: rotate(0.6deg); }
`;

// A soft band of light passes down through the projection.
const sweep = keyframes`
  from { transform: translate3d(0, -100%, 0); }
  to { transform: translate3d(0, 840%, 0); }
`;

// Hidden most of the loop; a slice of the face jumps sideways twice for about
// a fifth of a second. It never dims the figure.
const glitch = keyframes`
  0% { opacity: 0; transform: translate3d(0, 0, 0); }
  90% { opacity: 1; transform: translate3d(-3%, 0, 0); }
  91% { opacity: 1; transform: translate3d(2%, 0, 0); }
  92% { opacity: 0; transform: translate3d(0, 0, 0); }
`;

const breathe = keyframes`
  from { opacity: 0.75; }
  to { opacity: 1; }
`;

const bob = keyframes`
  from { transform: translate3d(0, -1.5%, 0) rotate(-0.5deg); }
  to { transform: translate3d(0, 1.5%, 0) rotate(0.5deg); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const ticker = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
`;

export const CityGapRoot = styled.div`
  --gap-h: max(28rem, 100vh);
  position: relative;
  height: var(--gap-h);
  overflow: hidden;
  pointer-events: none;

  .gap-day {
    display: none;
  }

  html[data-theme='light'] & .gap-night {
    display: none;
  }

  html[data-theme='light'] & .gap-day {
    display: block;
  }

  /* Ambient motion runs only while the stretch is on screen. */
  .holo-sway,
  .holo-glitch,
  .holo-sweep,
  .holo-beam,
  .holo-emitter,
  .ship-bob,
  .ship-ticker,
  .ship-prop i {
    animation-play-state: paused;
  }

  &[data-scene-motion='running'] .holo-sway,
  &[data-scene-motion='running'] .holo-glitch,
  &[data-scene-motion='running'] .holo-sweep,
  &[data-scene-motion='running'] .holo-beam,
  &[data-scene-motion='running'] .holo-emitter,
  &[data-scene-motion='running'] .ship-bob,
  &[data-scene-motion='running'] .ship-ticker,
  &[data-scene-motion='running'] .ship-prop i {
    animation-play-state: running;
  }

  &[data-scene-motion='still'] .holo-sway,
  &[data-scene-motion='still'] .holo-glitch,
  &[data-scene-motion='still'] .holo-sweep,
  &[data-scene-motion='still'] .holo-beam,
  &[data-scene-motion='still'] .holo-emitter,
  &[data-scene-motion='still'] .ship-bob,
  &[data-scene-motion='still'] .ship-ticker,
  &[data-scene-motion='still'] .ship-prop i {
    animation: none;
  }

  &[data-scene-motion='still'] .holo-sweep {
    display: none;
  }

  /* Night: the hologram stands on the street, a little left of center. */
  .holo {
    --holo-h: calc(var(--gap-h) * 0.9);
    --holo-w: calc(var(--holo-h) * 0.4667);
    position: absolute;
    bottom: 0;
    left: calc(42% - var(--holo-w) * 0.57);
    width: var(--holo-w);
    height: var(--holo-h);
    /* It materializes and rises into place as the stretch scrolls in. */
    opacity: calc(var(--p, 1) * 1.5 - 0.3);
    transform: translate3d(0, calc((1 - var(--p, 1)) * 6%), 0);
    will-change: transform, opacity;
  }

  .holo-sway {
    position: absolute;
    inset: 0;
    transform-origin: 57% 98%;
    animation: ${sway} 9s ease-in-out infinite alternate;
    will-change: transform;
  }

  .holo-art,
  .holo-glitch {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .holo-glitch {
    clip-path: inset(8.5% 0 86% 0);
    opacity: 0;
    animation: ${glitch} 9.4s steps(1, end) infinite;
    will-change: transform, opacity;
  }

  /* The sweep is clipped to the figure's box. */
  .holo-sweep-track {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .holo-sweep {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 11%;
    /* Centered on the figure and faded at its sides, so it reads as a scan. */
    background: radial-gradient(
      ellipse 34% 50% at 57% 50%,
      rgba(255, 210, 250, 0.18),
      rgba(160, 240, 255, 0.08) 55%,
      transparent
    );
    animation: ${sweep} 7s linear infinite;
    will-change: transform;
  }

  .holo-beam {
    position: absolute;
    left: 14%;
    right: 0;
    bottom: 0;
    height: 52%;
    background: linear-gradient(to top, rgba(79, 227, 255, 0.2), rgba(180, 108, 255, 0.05) 65%, transparent);
    clip-path: polygon(48% 100%, 66% 100%, 100% 0, 0 0);
    animation: ${breathe} 5s ease-in-out infinite alternate;
  }

  .holo-emitter {
    position: absolute;
    bottom: 0;
    left: 30%;
    width: 54%;
    height: 4%;
    border-radius: 50%;
    background: radial-gradient(
      ellipse at center,
      rgba(190, 252, 255, 0.8),
      rgba(47, 243, 255, 0.28) 45%,
      transparent 70%
    );
    animation: ${breathe} 5s ease-in-out -2.5s infinite alternate;
  }

  /* HUD copy in the projection, under the reaching hand and clear of the coat. */
  .holo-caption {
    position: absolute;
    top: 50.5%;
    right: 57%;
    margin: 0;
    padding-left: 10px;
    border-left: 2px solid #ff5fdc;
    color: #ffe0f8;
    font-family: ${THEME.fonts.mono};
    font-size: clamp(0.62rem, calc(var(--holo-h) * 0.0135), 0.85rem);
    letter-spacing: 0.22em;
    text-shadow: 0 0 10px rgba(255, 95, 220, 0.8);
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0.85;
  }

  .holo-kana {
    position: absolute;
    top: 13%;
    right: -26%;
    margin: 0;
    color: rgba(255, 120, 230, 0.78);
    font-size: calc(var(--holo-h) * 0.05);
    font-weight: 700;
    letter-spacing: 0.24em;
    text-shadow: 0 0 calc(14px * var(--neon-glow-strength, 1)) rgba(255, 43, 214, 0.7);
    writing-mode: vertical-rl;
  }

  /* Day: the airship glides in nose first as the stretch scrolls into view. */
  .ship {
    --ship-w: min(1100px, 80vw);
    position: absolute;
    top: 16%;
    left: 50%;
    width: var(--ship-w);
    height: calc(var(--ship-w) * 0.3167);
    /* From the right edge to just left of center; the still frame is centered. */
    transform: translate3d(calc(-50% + (0.8 - var(--p, 0.8)) * 30vw), 0, 0);
    will-change: transform;
  }

  .ship-bob {
    position: absolute;
    inset: 0;
    animation: ${bob} 7s ease-in-out infinite alternate;
    will-change: transform;
  }

  .ship-art {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    filter: drop-shadow(0 calc(var(--ship-w) * 0.02) calc(var(--ship-w) * 0.02) rgba(60, 40, 20, 0.18));
  }

  .ship-fin { fill: #1d5a63; stroke: #12393f; stroke-width: 2; }
  .ship-strut { fill: none; stroke: #4b5a61; stroke-width: 6; }
  .ship-pod { fill: #e9e0cf; stroke: #1d5a63; stroke-width: 3; }
  .ship-gondola { fill: #1d5a63; }
  .ship-window { fill: #a5dde2; stroke: #f3e2c0; stroke-width: 2; }
  .ship-ribs { fill: none; stroke: rgba(29, 90, 99, 0.14); stroke-width: 2; }
  .ship-cap { fill: #1d5a63; }
  .ship-stripe { fill: #c06a4c; }
  .ship-pinstripe { fill: #1d5a63; opacity: 0.8; }
  .ship-sheen { fill: none; stroke: rgba(255, 255, 255, 0.7); stroke-width: 10; stroke-linecap: round; }
  .ship-outline { fill: none; stroke: rgba(18, 57, 63, 0.35); stroke-width: 2; }
  .ship-stabilizer { fill: #c06a4c; stroke: #8e4631; stroke-width: 2; }
  .ship-emblem { fill: #c06a4c; stroke: #fffaf0; stroke-width: 4; }
  .ship-emblem-glyph { fill: #fffaf0; font-size: 50px; font-weight: 700; }
  .ship-screen-frame { fill: #0b1418; stroke: #1d5a63; stroke-width: 4; }
  .ship-light-red { fill: #ff4f45; }
  .ship-light-green { fill: #2fd27a; }

  /* The LED band, inset in the screen frame drawn at 330,100 500x80. */
  .ship-screen {
    position: absolute;
    top: 27.4%;
    left: 27.8%;
    width: 41%;
    height: 19%;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 3px;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(90deg, rgba(11, 20, 24, 0.55) 0 1px, transparent 1px 3px);
    }
  }

  .ship-ticker {
    display: flex;
    flex: none;
    width: max-content;
    color: #ffd36b;
    font-family: ${THEME.fonts.mono};
    font-size: calc(var(--ship-w) * 0.034);
    letter-spacing: 0.14em;
    text-shadow: 0 0 6px rgba(255, 176, 59, 0.8);
    text-transform: uppercase;
    white-space: pre;
    animation: ${ticker} 22s linear infinite;
    will-change: transform;

    .brand-one {
      color: #ff6ad5;
    }
  }

  /* Pusher propellers at the back of each pod, seen at a steep angle. */
  .ship-prop {
    position: absolute;
    top: 76%;
    left: 32.5%;
    width: calc(var(--ship-w) * 0.06);
    height: calc(var(--ship-w) * 0.06);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29, 90, 99, 0.3), rgba(29, 90, 99, 0.08) 62%, transparent 70%);
    transform: translate(-50%, -50%) scaleX(0.28);

    i {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: repeating-conic-gradient(rgba(20, 40, 44, 0.5) 0 14deg, transparent 14deg 120deg);
      animation: ${spin} 0.45s linear infinite;
      will-change: transform;
    }
  }

  .ship-prop-rear {
    top: 76.6%;
    left: 79.5%;
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .holo {
      --holo-h: calc(var(--gap-h) * 0.84);
      left: calc(50% - var(--holo-w) * 0.57);
    }

    .holo-caption {
      width: 10em;
      white-space: normal;
    }

    .holo-kana {
      right: -12%;
    }

    .ship {
      --ship-w: 92vw;
      top: 22%;
      transform: translate3d(calc(-50% + (0.85 - var(--p, 0.85)) * 28vw), 0, 0);
    }
  }
`;
