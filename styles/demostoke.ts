import styled from 'styled-components';

import {
  DemoStokeTldrImage
} from './index';
import { hudSubheading } from './hud';

export const DemoStokeWhatImage = styled(DemoStokeTldrImage)`
`;

export const DemoStokeGalleryBlock = styled.div`
  margin-top: clamp(1.4em, 3vw, 2.1em);
`;

export const DemoStokeSectionSubheading = styled.h3`
  ${hudSubheading}
  color: var(--color-orange);
`;
