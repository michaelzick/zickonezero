import { createGlobalStyle } from 'styled-components';

import { displayFont, hudFont, monoFont } from './fonts';

/**
 * Exposes the self-hosted faces as custom properties on :root (not a wrapper
 * class) so portals such as the lightbox and the nav dropdowns inherit them.
 */
const FontVariables = createGlobalStyle`
  :root {
    --font-display: ${displayFont.style.fontFamily}, 'Arial Black', Impact, sans-serif;
    --font-hud: ${hudFont.style.fontFamily}, 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --font-mono: ${monoFont.style.fontFamily};
  }
`;

export default FontVariables;
