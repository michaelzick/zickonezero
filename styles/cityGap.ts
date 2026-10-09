import styled, { keyframes } from 'styled-components';

import { LANTERN_CORDS, cordDepth } from '../src/lib/city/koi';
import { THEME } from './theme';

/*
 * The end of the homepage route (src/components/home/CityGapScene.tsx): open
 * air before the footer with one giant piece in the foreground. At night a
 * carp streamer flies from the top of a mast over a string of paper lanterns,
 * between rooftops, while police drones patrol behind it (KoiStreamer,
 * NightRooftops, PoliceDrones). By day a sightseeing airship (Airship) drifts
 * among clouds and delivery drones, over rooftops where a window washer works
 * (DayClouds, DayDrones, DayRooftops). Both are in the static HTML and the
 * theme picks one, so the page never flashes the wrong one.
 *
 * useSceneMotion writes data-scene-motion. Only transform animates, on its own
 * layers, and the art inside them is static, so it is rasterized once; the
 * police lights are the one exception, small glows whose opacity alone
 * animates. The carp waves as a chain of links: each rotates about its front
 * joint, on the centerline, and nested links add up toward the tail. A link's
 * static bend is the rotate property and its swing is transform, so the still
 * frame keeps the fabric's droop. Only @media and keyframes here; see
 * styles/city.ts.
 */

// Each link swings this many degrees either way of its bend.
const swing = (degrees: number) => keyframes`
  from { transform: rotate(${-degrees}deg); }
  to { transform: rotate(${degrees}deg); }
`;

const swing2 = swing(2);
const swing3 = swing(3);
const swing4 = swing(4);
const swing5 = swing(5);
const swing7 = swing(7);

// The airship crosses the whole sky, then comes round again off screen.
const drift = keyframes`
  from { transform: translate3d(100vw, 0, 0); }
  to { transform: translate3d(-100%, 0, 0); }
`;

const DRIFT_SECONDS = 64;

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

// Clouds drift with the wind, left to right, behind the airship.
const cloudDrift = keyframes`
  from { transform: translate3d(-40vw, 0, 0); }
  to { transform: translate3d(110vw, 0, 0); }
`;

// Delivery drones cross left to right at an even speed, climbing a little
// on the way, then wait off screen for their next run.
const deliver = keyframes`
  0% { transform: translate3d(-12vw, 0, 0); }
  35% { transform: translate3d(48vw, -1.5vh, 0); }
  68%, 100% { transform: translate3d(112vw, -0.5vh, 0); }
`;

// Each drone hovers up and down a little, and its parcel sways on its tether.
const hover = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -7%, 0); }
`;

const sway = keyframes`
  from { transform: rotate(-4deg); }
  to { transform: rotate(4deg); }
`;

// Police drones cross at a steady speed, one each way, then wait off screen
// while the other takes its turn: they share one loop, half a loop apart.
const PATROL_SECONDS = 30;

const patrolEast = keyframes`
  0% { transform: translate3d(calc(-100% - 2vw), 0, 0); }
  30%, 100% { transform: translate3d(102vw, 0, 0); }
`;

const patrolWest = keyframes`
  0% { transform: translate3d(102vw, 0, 0); }
  30%, 100% { transform: translate3d(calc(-100% - 2vw), 0, 0); }
`;

// Each light on the bar flashes once a cycle, the blue half a cycle after the
// red: under two flashes a second in all, and never fully dark.
const FLASH_SECONDS = 1.2;

const flash = keyframes`
  0%, 18% { opacity: 1; }
  30%, 100% { opacity: 0.08; }
`;

// The window washer's gondola works down the building and back, its cables
// paying out with it: a cable is scaled to the gondola's drop plus the
// height of its stirrups (14 of the rig's 256 units).
const GONDOLA_SECONDS = 36;

const gondolaRide = keyframes`
  from { transform: translate3d(0, 6%, 0); }
  to { transform: translate3d(0, 62%, 0); }
`;

const cableRide = keyframes`
  from { transform: scaleY(0.115); }
  to { transform: scaleY(0.675); }
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

  /*
   * Night: the carp flies to the right of a mast on a rooftop. Lengths are in
   * units of the carp's 1000-unit drawing (--ku), so the rig scales as one.
   * --rig-top is the ball atop the mast, clear of the fixed nav, and --koi-y
   * the carp's mouth, 200 units below it, so its hoop hangs just under the
   * arrow wheel. The lantern cord is tied to the mast --cord-drop units below
   * the mouth and runs --cord-w across to the tower, ending --cord-fall units
   * lower (LANTERN_CORDS in src/lib/city/koi.ts). On wide screens it spans
   * the carp's own units, so the tail clears it the same at every width, and
   * ends on a bracket on the tower's face; the tower rises --tower-rise units
   * above it. The mid-rise is laid out in the same units, and its roof stands
   * at --mid-roof down the scene but never closer than --mid-below units
   * under the cord, so the lanterns always clear its gear.
   */
  .koi {
    --koi-len: min(max(540px, 58vw), 1120px, 110vh);
    --ku: calc(var(--koi-len) / 1000);
    --mast-x: 16%;
    --rig-top: max(calc(45% - 315 * var(--ku)), 92px);
    --koi-y: calc(var(--rig-top) + 200 * var(--ku));
    --droop: 5deg;
    --sag: 1deg;
    --roof-w: 40%;
    --cord-drop: 220;
    --cord-fall: ${LANTERN_CORDS.wide.fall};
    --cord-depth: ${cordDepth(LANTERN_CORDS.wide)};
    --cord-y: calc(var(--koi-y) + var(--cord-drop) * var(--ku));
    --cord-w: min(calc(1120 * var(--ku)), 65%);
    --lantern-h: calc(64 * var(--ku));
    --tie-w: calc(24 * var(--ku));
    --mid-at: 360;
    --mid-span: 535;
    --mid-roof: 82%;
    --mid-below: 305;
    --tower-x: calc(var(--mast-x) + var(--cord-w) + var(--tie-w));
    --tower-w: calc(360 * var(--ku));
    --tower-rise: 150;
    position: absolute;
    inset: 0;
  }

  .koi-mast {
    position: absolute;
    top: calc(var(--rig-top) + 15 * var(--ku));
    bottom: 0;
    left: calc(var(--mast-x) - 3.5 * var(--ku));
    width: calc(7 * var(--ku));
    min-width: 3px;
    background: linear-gradient(90deg, #03070c, #16232f 40%, #5ff4ff 58%, #0c1822 76%, #03070c);

    /* A steady red light under the carp. */
    &::after {
      content: '';
      position: absolute;
      top: calc(303 * var(--ku));
      left: 50%;
      width: max(5px, calc(12 * var(--ku)));
      height: max(5px, calc(12 * var(--ku)));
      border-radius: 50%;
      background: #ff4f45;
      box-shadow: 0 0 calc(14 * var(--ku)) 2px rgba(255, 79, 69, 0.6);
      transform: translate(-50%, -50%);
    }
  }

  .koi-ball {
    position: absolute;
    top: var(--rig-top);
    left: calc(var(--mast-x) - 9 * var(--ku));
    width: calc(18 * var(--ku));
    height: calc(18 * var(--ku));
    border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #fff3c4, #ffcf6a 42%, #a26a14);
  }

  /* The rooftop the mast stands on; its footing is 40% of the way across. */
  .koi-roof {
    position: absolute;
    bottom: 0;
    left: calc(var(--mast-x) - var(--roof-w) * 0.4);
    width: var(--roof-w);

    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .koi-roof-art { fill: var(--bldg-near); }
  .koi-roof-rim { fill: none; stroke: rgba(47, 243, 255, 0.45); stroke-width: 1.5; }
  .koi-roof-window { fill: #0c1824; }
  .koi-roof-window.is-lit { fill: var(--window-lit); opacity: 0.85; }

  /*
   * A mid-rise beside the carp's rooftop, behind it, under the lanterns. Its
   * gear stands 56/500 of its width above the roof, and its drawing runs on
   * below the bottom of the scene.
   */
  .koi-midrise {
    --mid-w: calc(var(--mid-span) * var(--ku));
    position: absolute;
    top: max(var(--mid-roof), calc(var(--cord-y) + var(--mid-below) * var(--ku)));
    bottom: 0;
    left: calc(var(--mast-x) + var(--mid-at) * var(--ku));
    width: var(--mid-w);
    margin-top: calc(var(--mid-w) * -0.112);
    overflow: hidden;

    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .koi-midrise-art { fill: #08111b; }

  /*
   * The tower across the street, its roof under the lanterns' post. Its gear
   * stands a fifth of its width above the roof (margins are a share of the
   * width), and its drawing runs on below the bottom of the scene.
   */
  .koi-tower {
    position: absolute;
    top: calc(var(--cord-y) + (var(--cord-fall) - var(--tower-rise)) * var(--ku));
    bottom: 0;
    left: var(--tower-x);
    width: var(--tower-w);
    margin-top: calc(var(--tower-w) * -0.2);
    overflow: hidden;

    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .koi-tower-art { fill: var(--bldg-near); }
  .koi-tower-ledge { fill: #0c1622; }
  .koi-tower-rim { fill: none; stroke: rgba(255, 43, 214, 0.4); stroke-width: 1.5; }
  .koi-tower-sign { fill: #0d0716; stroke: rgba(255, 43, 214, 0.45); stroke-width: 2.5; }

  /*
   * The lantern string. Its box runs from the mast to the post, as deep as
   * the cord hangs; the cord in this screen's shape fills it, and each
   * lantern hangs from the cord by its hook (--lx across, and --ly-wide or
   * --ly-tall carp units down) and sways from there.
   */
  .koi-lanterns {
    position: absolute;
    top: var(--cord-y);
    left: var(--mast-x);
    width: var(--cord-w);
    height: calc(var(--cord-depth) * var(--ku));
  }

  .koi-cord {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;

    &[data-shape='tall'] {
      display: none;
    }

    path {
      fill: none;
      stroke: rgba(159, 179, 196, 0.75);
      stroke-width: 1.5;
    }
  }

  /* Where the cord is tied: a bracket out of the tower's face. */
  .koi-lantern-tie {
    position: absolute;
    top: calc(var(--cord-fall) * var(--ku));
    left: 100%;
    width: var(--tie-w);
    height: max(2px, calc(5 * var(--ku)));
    border-radius: 2px 0 0 2px;
    background: linear-gradient(#2a3a48, #03070c);
    transform: translateY(-50%);
  }

  .koi-lantern {
    --ly: var(--ly-wide);
    position: absolute;
    top: calc(var(--ly) * var(--ku));
    left: var(--lx);
    width: calc(var(--lantern-h) * 0.625);
    height: var(--lantern-h);
    margin-left: calc(var(--lantern-h) * -0.3125);
    color: #ec4a2c;
    transform-origin: 50% 0;
    animation: ${swing3} 3.4s ease-in-out calc(var(--li) * -0.55s) infinite alternate;
    will-change: transform;

    svg {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .koi-lantern[data-tone='amber'] { color: #f59a2a; }

  /* A soft, steady glow around the paper. */
  .koi-lantern-glow {
    position: absolute;
    top: 46%;
    left: 50%;
    width: 260%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 138, 64, 0.34), rgba(255, 120, 50, 0.1) 55%, transparent);
    transform: translate(-50%, -50%);
  }

  .koi-defs {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  /* Each chain hangs from its mouth hoop at the mast. */
  .koi-chain {
    position: absolute;
    left: var(--mast-x);
    width: 0;
  }

  .koi-fish {
    --u: var(--ku);
    --beat: 1.9s;
    --lag: -0.26s;
    top: calc(var(--koi-y) - 150 * var(--u));
    height: calc(300 * var(--u));
  }

  /*
   * A link, in drawing units: --x is how far its joint is from the last one,
   * and --w is its window, which ends in a notch just past the next joint
   * (--notch across). Each starts a beat later than the last, so the wave
   * runs from the mouth to the tail.
   */
  .koi-link {
    position: absolute;
    top: 0;
    left: calc(var(--x) * var(--u));
    width: calc(var(--w) * var(--u));
    height: 100%;
    transform-origin: 0 50%;
    rotate: var(--sag);
    animation: ${swing3} var(--beat) ease-in-out calc(var(--i) * var(--lag)) infinite alternate;
    will-change: transform;

    /*
     * The notch. Its left side runs outside the box: a clipped edge across the
     * fabric lets the colors under each fill show through as a hairline.
     */
    > svg {
      display: block;
      width: 100%;
      height: 100%;
      clip-path: polygon(-4px 0, 100% 0, var(--notch) 50%, 100% 100%, -4px 100%);
    }
  }

  /* The head carries the chain's droop and rides the slow gusts. */
  .koi-link[data-swing='gust'] {
    rotate: var(--droop);
    animation: ${swing2} 4.6s ease-in-out infinite alternate;
  }

  .koi-link[data-swing='2'] { animation-name: ${swing2}; }
  .koi-link[data-swing='4'] { animation-name: ${swing4}; }
  .koi-link[data-swing='5'] { animation-name: ${swing5}; }
  .koi-link[data-swing='7'] { animation-name: ${swing7}; }

  /* The arrow wheel at the top, foreshortened, spinning in the wind. */
  .koi-wheel {
    position: absolute;
    top: calc(var(--rig-top) + 19 * var(--ku));
    left: calc(var(--mast-x) - 38 * var(--ku));
    width: calc(76 * var(--ku));
    height: calc(76 * var(--ku));
    transform: scaleX(0.5);
  }

  .koi-wheel-spin {
    position: absolute;
    inset: 0;
    animation: ${spin} 2.4s linear infinite;
    will-change: transform;

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  /*
   * Night: police drones behind the carp, the far one high and westbound,
   * the near one low and eastbound; --patrol-size is their width at 1440px
   * wide. The still frame parks both in open sky with their lights steady.
   */
  .patrols {
    --patrol-high: max(12%, 96px);
    --patrol-low: 66%;
    --patrol-still-high: 64vw;
    --patrol-still-low: 30vw;
    position: absolute;
    inset: 0;
  }

  .police-drone {
    position: absolute;
    top: var(--patrol-low);
    left: 0;
    width: calc(var(--patrol-size) * (0.45px + 0.0382vw));
    transform: translate3d(var(--patrol-still-low), 0, 0);
    animation: ${patrolEast} ${PATROL_SECONDS}s linear var(--patrol-delay) infinite;
    will-change: transform;
  }

  .police-drone[data-heading='west'] {
    top: var(--patrol-high);
    transform: translate3d(var(--patrol-still-high), 0, 0);
    animation-name: ${patrolWest};
  }

  .police-hover {
    display: block;
    position: relative;
    animation: ${hover} var(--patrol-bob) ease-in-out infinite alternate;
  }

  /* The westbound drone faces its way, light bar and all. */
  .police-drone[data-heading='west'] .police-hover {
    scale: -1 1;
  }

  /* Pitched forward into its flight. */
  .police-body {
    display: block;
    position: relative;
    rotate: 5deg;
  }

  .police-frame {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
  }

  .police-beam {
    position: absolute;
    top: 62%;
    left: 5%;
    width: 90%;
    height: 240%;
    background: linear-gradient(rgba(214, 236, 255, 0.2), rgba(214, 236, 255, 0));
    clip-path: polygon(44% 0, 56% 0, 100% 100%, 0 100%);
  }

  /* The flashing lights over the bar's two lenses, drawn at 53.5 and 66.5 of 120 across, 12.5 of 48 down. */
  .police-siren {
    position: absolute;
    top: 26%;
    left: 44.6%;
    width: 46%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 236, 236, 0.95), rgba(255, 46, 64, 0.85) 22%, rgba(255, 46, 64, 0.25) 52%, transparent);
    opacity: 0.5;
    transform: translate(-50%, -50%);
    animation: ${flash} ${FLASH_SECONDS}s linear infinite;
    will-change: opacity;
  }

  .police-siren.is-blue {
    left: 55.4%;
    background: radial-gradient(closest-side, rgba(236, 244, 255, 0.95), rgba(52, 110, 255, 0.85) 22%, rgba(52, 110, 255, 0.25) 52%, transparent);
    animation-delay: ${-FLASH_SECONDS / 2}s;
  }

  /* Day: the airship drifts across the sky on its own, then comes round again. */
  .ship {
    --ship-w: min(1100px, 80vw);
    position: absolute;
    left: 0;
    width: var(--ship-w);
    height: calc(var(--ship-w) * 0.3167);
    top: max(16%, 92px);
    /* The still frame is centered; the first moving one is a little right of center. */
    transform: translate3d(calc(50vw - 50%), 0, 0);
    animation: ${drift} ${DRIFT_SECONDS}s linear ${-DRIFT_SECONDS * 0.45}s infinite;
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

  /* Flat clouds behind the airship, each at its own height and speed. */
  .clouds,
  .drones {
    position: absolute;
    inset: 0;
  }

  .cloud {
    position: absolute;
    top: var(--cloud-top);
    left: 0;
    width: var(--cloud-w);
    min-width: 140px;
    transform: translate3d(var(--cloud-still), 0, 0);
    animation: ${cloudDrift} var(--cloud-duration) linear var(--cloud-delay) infinite;
    will-change: transform;

    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  /*
   * Delivery drones between the airship and the roofs; --drone-size is their
   * width at 1440px wide. The frame pitches forward into its flight, and the
   * parcel hangs straight below it from the body's center.
   */
  .drone {
    position: absolute;
    top: var(--drone-top);
    left: 0;
    width: calc(var(--drone-size) * (0.45px + 0.0382vw));
    transform: translate3d(var(--drone-still), 0, 0);
    animation: ${deliver} var(--drone-duration) linear var(--drone-delay) infinite;
  }

  .drone-hover {
    display: block;
    position: relative;
    animation: ${hover} var(--drone-bob) ease-in-out infinite alternate;
  }

  .drone-frame {
    display: block;
    width: 100%;
    height: auto;
    rotate: 5deg;
  }

  .drone-parcel {
    position: absolute;
    top: 64%;
    left: 37%;
    width: 26%;
    transform-origin: 50% 0;
    animation: ${sway} calc(var(--drone-bob) * 1.3) ease-in-out infinite alternate;

    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  /*
   * The roofs: one drawing at a fixed aspect ratio, at least the viewport
   * wide, along the bottom. The gondola is placed in the same box, so it
   * stays on its building at every size.
   */
  .roofs {
    --roofs-w: 100vw;
    position: absolute;
    bottom: 0;
    left: 50%;
    width: var(--roofs-w);
    margin-left: calc(var(--roofs-w) / -2);

    > svg {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .gondola-rig {
    position: absolute;
  }

  .gondola-cable {
    position: absolute;
    top: 0;
    width: max(1px, 1.6%);
    height: 100%;
    margin-left: max(-0.5px, -0.8%);
    background: #4b5a61;
    transform: scaleY(0.395);
    transform-origin: 50% 0;
    animation: ${cableRide} ${GONDOLA_SECONDS}s ease-in-out ${-GONDOLA_SECONDS / 4}s infinite alternate;
  }

  .gondola {
    position: absolute;
    inset: 0;
    transform: translate3d(0, 34%, 0);
    animation: ${gondolaRide} ${GONDOLA_SECONDS}s ease-in-out ${-GONDOLA_SECONDS / 4}s infinite alternate;
    will-change: transform;

    svg {
      display: block;
      width: 100%;
      height: 100%;
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

  /*
   * Phones and portrait tablets: the carp hangs lower, so it stays giant in a
   * tall frame, and its tail stays above the HUD in the corner.
   */
  @media (orientation: portrait) {
    .roofs {
      --roofs-w: 200vw;
    }

    .koi {
      --koi-len: min(100vw, 62vh);
      --mast-x: 8%;
      --rig-top: max(calc(34% - 315 * var(--ku)), 150px);
      --droop: 26deg;
      --sag: 2deg;
      --roof-w: 64%;
      --cord-drop: 740;
      --cord-fall: ${LANTERN_CORDS.tall.fall};
      --cord-depth: ${cordDepth(LANTERN_CORDS.tall)};
      --lantern-h: calc(86 * var(--ku));
      --mid-at: 420;
      --mid-span: 420;
      --mid-roof: 92%;
      --mid-below: 280;
      /* The tower fills the right edge; the cord ends on a post a tenth of the way across its roof. */
      --tower-w: 28%;
      --cord-w: calc(100% - var(--mast-x) - var(--tower-w) * 0.9);
      --tower-x: calc(var(--mast-x) + var(--cord-w) - var(--tower-w) * 0.1);
      --tower-rise: -30;
    }

    .koi-lantern-tie {
      width: max(2px, calc(5 * var(--ku)));
      height: calc(30 * var(--ku));
      border-radius: 0;
      background: linear-gradient(90deg, #03070c, #2a3a48 50%, #03070c);
      transform: translateX(-50%);
    }

    .koi-lantern {
      --ly: var(--ly-tall);
    }

    .koi-cord[data-shape='wide'] {
      display: none;
    }

    .koi-cord[data-shape='tall'] {
      display: block;
    }

    .patrols {
      --patrol-high: max(19%, 160px);
      --patrol-low: 78%;
      --patrol-still-high: 58vw;
      --patrol-still-low: 22vw;
    }
  }

  /*
   * Short landscape screens, such as phones on their side: the rig shrinks
   * to fit between the fixed nav and the HUD's bottom bar. It stands 700
   * units tall, from the ball atop the mast to the lowest lantern.
   */
  @media (orientation: landscape) and (max-height: 560px) {
    .koi {
      --koi-len: min(max(540px, 58vw), calc((100vh - 158px) * 1000 / 700));
      --rig-top: 86px;
    }

    .patrols {
      --patrol-high: 92px;
    }

    /* The roofs sink a quarter of their height, below the airship. */
    .roofs {
      transform: translate3d(0, 25%, 0);
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    .ship {
      --ship-w: 92vw;
      top: max(22%, 150px);
    }
  }

  /* Ambient motion runs only while the stretch is on screen. */
  &:not([data-scene-motion='running']) .koi-link,
  &:not([data-scene-motion='running']) .koi-wheel-spin,
  &:not([data-scene-motion='running']) .koi-lantern,
  &:not([data-scene-motion='running']) .police-drone,
  &:not([data-scene-motion='running']) .police-hover,
  &:not([data-scene-motion='running']) .police-siren,
  &:not([data-scene-motion='running']) .ship,
  &:not([data-scene-motion='running']) .ship-bob,
  &:not([data-scene-motion='running']) .ship-ticker,
  &:not([data-scene-motion='running']) .ship-prop i,
  &:not([data-scene-motion='running']) .cloud,
  &:not([data-scene-motion='running']) .drone,
  &:not([data-scene-motion='running']) .drone-hover,
  &:not([data-scene-motion='running']) .drone-parcel,
  &:not([data-scene-motion='running']) .gondola,
  &:not([data-scene-motion='running']) .gondola-cable {
    animation-play-state: paused;
  }

  &[data-scene-motion='still'] .koi-link,
  &[data-scene-motion='still'] .koi-wheel-spin,
  &[data-scene-motion='still'] .koi-lantern,
  &[data-scene-motion='still'] .police-drone,
  &[data-scene-motion='still'] .police-hover,
  &[data-scene-motion='still'] .police-siren,
  &[data-scene-motion='still'] .ship,
  &[data-scene-motion='still'] .ship-bob,
  &[data-scene-motion='still'] .ship-ticker,
  &[data-scene-motion='still'] .ship-prop i,
  &[data-scene-motion='still'] .cloud,
  &[data-scene-motion='still'] .drone,
  &[data-scene-motion='still'] .drone-hover,
  &[data-scene-motion='still'] .drone-parcel,
  &[data-scene-motion='still'] .gondola,
  &[data-scene-motion='still'] .gondola-cable {
    animation: none;
  }
`;
