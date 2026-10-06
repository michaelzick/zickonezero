import styled, { keyframes } from 'styled-components';

import { facadePalette } from './facade';
import { RAIN_TILE, rainFall } from './home';
import { neonButton } from './hud';
import { THEME } from './theme';

/*
 * The homepage street level (src/components/home/StreetLevel.tsx), where the
 * route ends: a row of storefronts under a "Now booking new gigs" sign, then
 * a sidewalk and a wet road. By night, walkers under LED umbrellas pass and
 * dark cars sweep their headlights; by day, taxis cross coral crosswalk
 * stripes. The component sets data-standby until the street is about to
 * scroll into view (the sign then powers on) and data-live while it is on
 * screen (the traffic only moves then). Only @media and keyframes here; see
 * styles/city.ts.
 */

const walkEast = keyframes`
  from { transform: translate3d(-14vw, 0, 0); }
  to { transform: translate3d(114vw, 0, 0); }
`;

const walkWest = keyframes`
  from { transform: translate3d(114vw, 0, 0); }
  to { transform: translate3d(-14vw, 0, 0); }
`;

const driveEast = keyframes`
  from { transform: translate3d(-30vw, 0, 0); }
  to { transform: translate3d(120vw, 0, 0); }
`;

const driveWest = keyframes`
  from { transform: translate3d(120vw, 0, 0); }
  to { transform: translate3d(-30vw, 0, 0); }
`;

const stepBob = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(0, -2px, 0); }
`;

// Two shallow dips in a seven-second loop, like a tired LED driver.
const vacancyFlicker = keyframes`
  0%, 70%, 73%, 76%, 100% { opacity: 1; }
  71% { opacity: 0.55; }
  74% { opacity: 0.75; }
`;

const statusBlink = keyframes`
  0%, 60%, 100% { opacity: 1; }
  75% { opacity: 0.3; }
`;

/** A walker in a long coat, used as a mask so the theme can color it. */
const WALKER_SHAPE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 100'%3E%3Ccircle cx='20' cy='11' r='7.5'/%3E%3Cpath d='M12 22Q20 18 28 22L33 60H27L26 99H21L20 66L19 99H14L13 60H7Z'/%3E%3C/svg%3E\")";

/** LED dots for the vacancy sign's lettering. */
const LED_DOTS = 'radial-gradient(circle, #000 0 52%, transparent 58%) 0 0 / 3px 3px';

export const StreetRoot = styled.section`
  --st-ground: clamp(220px, 32vh, 340px);
  --st-sidewalk: 30%;
  --st-concrete: #0b131b;
  --st-curb: rgba(150, 210, 230, 0.22);
  --st-lane: rgba(220, 235, 240, 0.22);
  --st-stripe: rgba(200, 225, 235, 0.16);
  --walker-ink: #03070b;
  --car-paint: #0a121a;
  --car-glass: rgba(120, 200, 230, 0.2);
  --car-taxi: #0a121a;
  --car-van: #0d1620;
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-rows: minmax(0, 1fr) var(--st-ground);
  min-height: max(100vh, 720px);
  min-height: max(100svh, 720px);
  overflow: hidden;
  color: var(--color-white);
  ${facadePalette}

  html[data-theme='light'] & {
    --st-concrete: #b9b1a4;
    --st-curb: #e2dccf;
    --st-lane: rgba(255, 255, 255, 0.78);
    --st-stripe: #ff7b6b;
    --walker-ink: #1d2b31;
    --car-paint: #e7eaec;
    --car-glass: rgba(20, 52, 64, 0.72);
    --car-taxi: #f2c230;
    --car-van: #1f6f78;
  }

  /* The storefront row, with the sign and the panel hung over it. */
  .street-block {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: clamp(24px, 4vw, 72px);
    padding: clamp(72px, 12vh, 132px) clamp(16px, 4vw, 64px) clamp(120px, 17vh, 180px);
  }

  .st-row {
    position: absolute;
    inset: 0;
    z-index: -1;

    /* Fog where the last district gives way to the street. */
    &::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      z-index: 1;
      height: 30%;
      background: linear-gradient(to bottom, var(--sky-low), transparent);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  /* 空き枠有り ("openings available") in green LED dots, on a wall bracket. */
  .st-vacancy {
    position: absolute;
    top: clamp(28px, 7vh, 72px);
    left: clamp(16px, 4vw, 64px);
    padding: 0.32em 0.5em 0.36em;
    border: 2px solid #1d2a24;
    background: #040b07;
    font-family: ${THEME.fonts.cjk};
    font-size: clamp(18px, 2vw, 28px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.08em;
    filter:
      drop-shadow(0 0 calc(6px * var(--neon-glow-strength, 1)) rgba(77, 255, 136, 0.65))
      drop-shadow(0 0 calc(18px * var(--neon-glow-strength, 1)) rgba(77, 255, 136, 0.3));

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      right: 100%;
      width: clamp(10px, 4vw, 64px);
      height: 4px;
      background: #1d2a24;
    }

    span {
      display: block;
      color: #6dff9b;
      -webkit-mask: ${LED_DOTS};
      mask: ${LED_DOTS};
      animation: ${vacancyFlicker} 7s linear infinite;
    }
  }

  /* The real heading: a sign over the shops. */
  .street-sign {
    --sign-tone: var(--neon-amber);
    --sign-halo: rgba(255, 176, 59, 0.6);
    z-index: 2;
    flex: 0 1 auto;
    max-width: 100%;
    font-size: min(10vw, 13vh, 132px);
  }

  .street-sign .led-glow {
    filter:
      drop-shadow(0 0 0.015em rgba(255, 255, 255, 0.9))
      drop-shadow(0 0 calc(0.06em * var(--neon-glow-strength, 1)) rgba(47, 243, 255, 0.85))
      drop-shadow(0 0 calc(0.22em * var(--neon-glow-strength, 1)) rgba(43, 255, 154, 0.45));
  }

  .street-sign .sign-led .letter {
    background: linear-gradient(180deg, #ffffff 8%, #c8fff3 30%, #2ff3ff 58%, #22d08e 92%);
    -webkit-background-clip: text;
    background-clip: text;
  }

  /* Until the street is near, the sign holds still (and lit, without script). */
  &[data-standby] .street-sign .letter {
    animation: none;
  }

  .street-panel {
    --hud-accent: var(--neon-amber);
    z-index: 2;
    flex: 0 1 440px;
    max-width: 100%;
    padding: 22px 24px 24px;
  }

  .street-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 10px;
    color: #6dff9b;
    font-family: ${THEME.fonts.mono};
    font-size: 0.8rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 calc(8px * var(--neon-glow-strength, 1)) currentColor;
      animation: ${statusBlink} 2.4s ease-in-out infinite;
    }
  }

  html[data-theme='light'] & .street-status {
    color: #0b7a3e;
  }

  .street-copy {
    margin: 0 0 20px;
    font-family: ${THEME.fonts.hud};
    font-size: 1.3rem;
    font-weight: 600;
    line-height: 1.32;
  }

  .street-cta {
    ${neonButton}
  }

  /* The sidewalk and the road; a stacking context, so far walkers can sit behind near ones. */
  .street-ground {
    position: relative;
    z-index: 0;
    background:
      linear-gradient(var(--st-curb), var(--st-curb)) 0 var(--st-sidewalk) / 100% 3px no-repeat,
      linear-gradient(to bottom, var(--st-concrete) 0 var(--st-sidewalk), var(--street) var(--st-sidewalk));
  }

  /* The lane divider and the wet sheen of the asphalt. */
  .st-road {
    position: absolute;
    inset: var(--st-sidewalk) 0 0;
    background:
      repeating-linear-gradient(to right, var(--st-lane) 0 64px, transparent 64px 128px) 0 52% / 100% 3px no-repeat,
      linear-gradient(to bottom, rgba(150, 210, 230, 0.07), transparent 40%);
  }

  html[data-theme='light'] & .st-road {
    background:
      repeating-linear-gradient(to right, var(--st-lane) 0 64px, transparent 64px 128px) 0 52% / 100% 3px no-repeat,
      linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent 30%);
  }

  /* Sign light smeared across the wet street. */
  .st-reflections {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 3% 60% at 10% 0, rgba(77, 255, 136, 0.32), transparent),
      radial-gradient(ellipse 7% 80% at 34% 0, rgba(255, 176, 59, 0.3), transparent),
      radial-gradient(ellipse 6% 70% at 58% 0, rgba(47, 243, 255, 0.28), transparent),
      radial-gradient(ellipse 4% 70% at 84% 0, rgba(255, 43, 214, 0.28), transparent);
    filter: blur(6px);
    opacity: var(--night-only, 1);
  }

  html[data-theme='light'] & .st-reflections {
    display: none;
  }

  .st-crosswalk {
    position: absolute;
    top: calc(var(--st-sidewalk) + 3px);
    bottom: 0;
    left: 60%;
    width: clamp(120px, 16vw, 240px);
    background: repeating-linear-gradient(to bottom, var(--st-stripe) 0 12px, transparent 12px 26px);
    clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
  }

  .walker,
  .car {
    position: absolute;
    left: 0;
    transform: translate3d(var(--rest), 0, 0);
    animation-duration: var(--duration);
    animation-delay: var(--delay);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
  }

  .walker {
    bottom: calc(100% - var(--st-sidewalk) + 6px);
    width: 28px;
    height: 72px;
    margin-left: -14px;
    animation-name: ${walkEast};
  }

  .walker[data-heading='west'] {
    animation-name: ${walkWest};
  }

  /* Walkers near the shops are farther away. */
  .walker[data-depth='far'] {
    bottom: calc(100% - var(--st-sidewalk) * 0.42);
    z-index: -1;
    width: 23px;
    height: 60px;
    opacity: 0.85;
  }

  .walker-bob {
    position: absolute;
    inset: 0;
    animation: ${stepBob} 0.5s ease-in-out infinite alternate;
  }

  .walker-figure {
    position: absolute;
    inset: 0;
    background: var(--walker-ink);
    -webkit-mask: ${WALKER_SHAPE} center / contain no-repeat;
    mask: ${WALKER_SHAPE} center / contain no-repeat;
  }

  /* A clear umbrella with a lit rim and shaft. */
  .walker-umbrella {
    position: absolute;
    bottom: calc(100% - 4px);
    left: 50%;
    width: 220%;
    height: 30%;
    border-top: 2px solid var(--tone);
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background: radial-gradient(ellipse 60% 90% at 50% 100%, rgba(255, 255, 255, 0.1), transparent);
    box-shadow:
      0 -2px calc(14px * var(--neon-glow-strength, 1)) -2px var(--tone),
      inset 0 4px 10px -6px var(--tone);
    transform: translate3d(-50%, 0, 0);

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 2px;
      height: 150%;
      margin-left: -1px;
      background: var(--tone);
      box-shadow: 0 0 calc(6px * var(--neon-glow-strength, 1)) var(--tone);
    }
  }

  html[data-theme='light'] & .walker-umbrella {
    display: none;
  }

  .car {
    width: 150px;
    margin-left: -75px;
    animation-name: ${driveEast};
  }

  .car[data-heading='west'] {
    animation-name: ${driveWest};
  }

  .car[data-lane='far'] {
    bottom: 40%;
    z-index: 1;
  }

  .car[data-lane='near'] {
    bottom: 9%;
    z-index: 2;
  }

  .car-body {
    position: relative;
    display: block;
    height: 34px;
    border-radius: 10px 18px 6px 6px;
    background:
      linear-gradient(rgba(255, 255, 255, 0.08), transparent 40%),
      var(--car-paint);
    box-shadow: inset 0 1px 0 rgba(150, 210, 230, 0.22);

    /* The headlight beam, out front. */
    &::before {
      content: '';
      position: absolute;
      top: 4px;
      left: calc(100% - 4px);
      width: 190px;
      height: 30px;
      background: linear-gradient(to right, rgba(255, 246, 214, 0.42), transparent);
      clip-path: polygon(0 36%, 100% 0, 100% 100%, 0 64%);
      opacity: var(--night-only, 1);
    }

    /* The headlight. */
    &::after {
      content: '';
      position: absolute;
      top: 9px;
      right: -1px;
      width: 9px;
      height: 6px;
      border-radius: 2px;
      background: #fffbe6;
      box-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) 2px rgba(255, 240, 200, 0.8);
    }
  }

  html[data-theme='light'] & .car-body::before {
    display: none;
  }

  .car.is-taxi .car-body {
    --car-paint: var(--car-taxi);
  }

  .car.is-van .car-body {
    --car-paint: var(--car-van);
    height: 42px;
    border-radius: 8px 12px 6px 6px;
  }

  .car[data-lane='far'] .car-body {
    transform: scale(0.82);
  }

  .car[data-heading='west'] .car-body {
    transform: scaleX(-1);
  }

  .car[data-lane='far'][data-heading='west'] .car-body {
    transform: scale(-0.82, 0.82);
  }

  .car-cabin {
    position: absolute;
    bottom: 100%;
    left: 30px;
    width: 76px;
    height: 20px;
    border-radius: 6px 10px 0 0;
    background: var(--car-glass);
    clip-path: polygon(16% 0, 76% 0, 100% 100%, 0 100%);
  }

  .car.is-van .car-cabin {
    left: 12px;
    width: 108px;
    height: 16px;
    clip-path: polygon(0 0, 84% 0, 100% 100%, 0 100%);
  }

  /* The taxi's roof light. */
  .car.is-taxi .car-cabin::before {
    content: '';
    position: absolute;
    top: 0;
    left: 40%;
    width: 16px;
    height: 5px;
    background: #ffd21f;
    box-shadow: 0 0 calc(8px * var(--neon-glow-strength, 1)) rgba(255, 210, 31, 0.8);
  }

  .car.is-taxi .car-cabin {
    clip-path: none;
    background:
      linear-gradient(var(--car-glass), var(--car-glass)) 0 100% / 100% 70% no-repeat;
  }

  .car-wheels {
    position: absolute;
    right: 16px;
    bottom: -10px;
    left: 14px;
    height: 22px;
    background:
      radial-gradient(circle at 11px 50%, #3a4652 0 4px, #05070a 5px 10.5px, transparent 11px),
      radial-gradient(circle at calc(100% - 11px) 50%, #3a4652 0 4px, #05070a 5px 10.5px, transparent 11px);
  }

  .car-tail {
    position: absolute;
    top: 9px;
    left: -1px;
    width: 6px;
    height: 7px;
    border-radius: 2px;
    background: #ff3a5c;
    box-shadow: 0 0 calc(10px * var(--neon-glow-strength, 1)) 1px rgba(255, 58, 92, 0.75);
  }

  /* Foreground rain over the street, behind the sign and the panel. */
  .st-rain {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
    opacity: calc(0.45 * var(--night-only, 1));
    pointer-events: none;

    &::before {
      content: '';
      position: absolute;
      top: -420px;
      right: -10%;
      bottom: 0;
      left: -10%;
      background: ${RAIN_TILE} 0 0 / 420px 420px repeat;
      animation: ${rainFall} 0.7s linear infinite;
    }
  }

  html[data-theme='light'] & .st-rain {
    display: none;
  }

  /* Off screen, the street holds still. */
  &:not([data-live]) .walker,
  &:not([data-live]) .walker-bob,
  &:not([data-live]) .car,
  &:not([data-live]) .st-vacancy span,
  &:not([data-live]) .street-status::before,
  &:not([data-live]) .st-rain::before {
    animation-play-state: paused;
  }

  @media (max-width: ${THEME.breakpoints.smallTablet}) {
    .street-block {
      flex-direction: column;
      gap: 24px;
    }

    .street-panel {
      flex-basis: auto;
      width: min(440px, 100%);
    }
  }

  @media (max-width: ${THEME.breakpoints.phone}) {
    --st-ground: clamp(200px, 28vh, 260px);

    .street-block {
      padding: 84px 16px 112px;
    }

    .st-vacancy {
      top: 20px;
      right: 16px;
      left: auto;
      font-size: 16px;

      &::before {
        right: auto;
        left: 100%;
        width: 16px;
      }
    }

    .street-sign {
      font-size: min(11.4vw, 13vh);
    }

    .street-panel {
      padding: 16px 16px 18px;
    }

    .street-copy {
      margin-bottom: 14px;
      font-size: 1.12rem;
    }

    .street-cta {
      min-height: 44px;
      padding: 0 1.05em;
      font-size: 0.92rem;
    }

    .walker {
      width: 22px;
      height: 56px;
    }

    .walker[data-depth='far'] {
      width: 18px;
      height: 46px;
    }

    .car {
      width: 112px;
      margin-left: -56px;
    }

    .car-body {
      height: 26px;
    }

    .car-cabin {
      left: 22px;
      width: 58px;
      height: 15px;
    }

    .car.is-van .car-body {
      height: 32px;
    }

    .car.is-van .car-cabin {
      left: 9px;
      width: 80px;
      height: 12px;
    }

    .car-wheels {
      right: 12px;
      bottom: -8px;
      left: 10px;
      height: 17px;
      background:
        radial-gradient(circle at 8.5px 50%, #3a4652 0 3px, #05070a 4px 8px, transparent 8.5px),
        radial-gradient(circle at calc(100% - 8.5px) 50%, #3a4652 0 3px, #05070a 4px 8px, transparent 8.5px);
    }
  }

  /* Reduced motion: one still frame of the street. */
  @media (prefers-reduced-motion: reduce) {
    .walker,
    .walker-bob,
    .car {
      animation: none;
    }

    .st-rain {
      display: none;
    }
  }
`;
