import styled from 'styled-components';

import {
  DemoStokeMethodCard,
  DemoStokeMethodList,
  DemoStokeTldrCopy,
  DemoStokeTldrImage,
} from './index';
import { THEME } from './theme';

export const FlowMethodList = styled(DemoStokeMethodList)`
  gap: 2.5em;
`;

export const FlowSection = styled(DemoStokeMethodCard)`
  display: flex;
  flex-direction: column;
  gap: clamp(0.85em, 2vw, 1.3em);
`;

export const FlowText = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.35em;
`;

export const FlowImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: ${THEME.radii.md};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 4px;
  }
`;

export const FlowImage = styled(DemoStokeTldrImage)`
  width: 100%;
  height: auto;
  aspect-ratio: 656 / 365;
  object-fit: cover;
  max-width: 100%;
  border-radius: ${THEME.radii.md};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  ${FlowImageButton}:hover &,
  ${FlowImageButton}:focus-visible & {
    border-color: ${THEME.colors.orange};
    box-shadow: 0 24px 48px -32px rgb(0 0 0 / 70%), 0 0 0 1px ${THEME.colors.orange};
  }
`;

export const FlowImagesRow = styled.div<{ $topOffset?: boolean; }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(0.75em, 1.8vw, 1.2em);
  margin-top: ${({ $topOffset }: { $topOffset?: boolean; }) => ($topOffset ? '0.75em' : '0')};
`;

export const FlowStorySection = styled.section`
  width: 100%;
`;

export const OutcomeCopy = styled(DemoStokeTldrCopy)`
  font-size: clamp(1.1em, 2vw, 1.35em);
  line-height: 1.85;
  font-weight: 500;
  letter-spacing: 0.01em;
  width: 100%;
  color: ${THEME.colors.demostoke};

  .plain-lines li,
  .plain-lines li::marker {
    color: ${THEME.colors.demostoke};
  }
`;

export const MethodImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8em;
`;

export const MethodImageButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  border-radius: ${THEME.radii.md};

  &:focus-visible {
    outline: 2px solid ${THEME.colors.demostoke};
    outline-offset: 4px;
  }
`;

export const MethodImageFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: ${THEME.radii.md};
  border: 1px solid rgba(199, 197, 197, 0.25);
  overflow: hidden;
  box-shadow: 0 24px 38px -30px rgb(0 0 0 / 55%);
  background: ${THEME.colors.darkest};
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  ${MethodImageButton}:hover &,
  ${MethodImageButton}:focus-visible & {
    border-color: ${THEME.colors.orange};
    box-shadow: 0 24px 48px -32px rgb(0 0 0 / 70%), 0 0 0 1px ${THEME.colors.orange};
  }
`;

export const AntisyphonHeroImageWrap = styled.div`
  margin-top: clamp(1.2em, 3vw, 1.75em);
`;

export const AntisyphonGalleryBlock = styled.div`
  margin-top: clamp(1.35em, 3vw, 2em);
`;

export const AntisyphonSectionSubheading = styled.h3`
  margin: 0;
`;
