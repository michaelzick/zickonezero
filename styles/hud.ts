import styled, { css, keyframes } from 'styled-components';

import { THEME } from './theme';

/*
 * HUD primitives shared by the navigation, the homepage HUD, and the inner
 * pages. Jest's CSS parser drops a whole stylesheet when it meets @supports,
 * @container, @layer, or @property, so these styles use only @media and
 * keyframes (see styles/globals.scss for the registered properties).
 */

/** Clip-path for the notched HUD corner (top right and bottom left). */
export const hudNotch = (size = '10px') => css`
  clip-path: polygon(
    0 0,
    calc(100% - ${size}) 0,
    100% ${size},
    100% 100%,
    ${size} 100%,
    0 calc(100% - ${size})
  );
`;

export const scanSweep = keyframes`
  0% { transform: translateX(-120%) skewX(-18deg); }
  100% { transform: translateX(220%) skewX(-18deg); }
`;

/** Square, icon-only HUD control with a 44px touch target. */
export const HudIconButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: var(--hud-ink);
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
`;

type TimeToggleProps = { $isNight: boolean };

export const TimeToggleButton = styled(HudIconButton)`
  .track {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    width: 60px;
    height: 28px;
    padding: 0 7px;
    border: 1px solid var(--glass-border);
    background: rgba(var(--color-dark-rgb), 0.55);
    ${hudNotch('7px')}
    transition: border-color 0.3s ease, background-color 0.3s ease;
  }

  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 26px;
    height: 20px;
    background: ${(props: TimeToggleProps) => (props.$isNight ? THEME.neon.cyan : THEME.neon.yellow)};
    ${hudNotch('5px')}
    transform: translateX(${(props: TimeToggleProps) => (props.$isNight ? '0' : '28px')});
    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.55);
    transition: transform 0.5s ${THEME.easing.out}, background-color 0.5s ease;
  }

  svg {
    position: relative;
    z-index: 1;
    width: 14px;
    height: 14px;
    transition: color 0.4s ease, opacity 0.4s ease;
  }

  .icon-night {
    color: ${(props: TimeToggleProps) => (props.$isNight ? THEME.colors.contrast : 'var(--hud-ink-dim)')};
  }

  .icon-day {
    color: ${(props: TimeToggleProps) => (props.$isNight ? 'var(--hud-ink-dim)' : '#182329')};
  }

  &:hover .track {
    border-color: ${THEME.neon.cyan};
  }
`;
