import {
  DemoStokeScrollButton,
  GridCarouselControls,
  GridContainer
} from '../../styles';
import { Thumbnail } from '.';
import useHorizontalGallery from '../hooks/useHorizontalGallery';

import { WorksData, WorksDataType } from '../types';

type Props = WorksDataType & {
  onThumbClick: (index: number) => void;
  includeItem?: (item: WorksData) => boolean;
  disableThumbClick?: boolean;
  /** When set, the grid becomes a labelled horizontal carousel on phones. */
  carouselLabel?: string;
};

const GridContent = (props: Props) => {
  const { worksDataReversed, onThumbClick, includeItem, disableThumbClick, carouselLabel } = props;
  const handleThumbClick: (index: number) => void = disableThumbClick ? (() => undefined) : onThumbClick;
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery();
  const isCarousel = Boolean(carouselLabel);

  return (
    <GridContainer $carousel={isCarousel}>
      {isCarousel && (
        <GridCarouselControls role='group' aria-label={`${carouselLabel} navigation`}>
          <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(-1)} disabled={!canScrollLeft} aria-label='Scroll left'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
              <path d='m14 18-6-6 6-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </DemoStokeScrollButton>
          <DemoStokeScrollButton type='button' onClick={() => scrollGalleryBy(1)} disabled={!canScrollRight} aria-label='Scroll right'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
              <path d='m10 6 6 6-6 6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </DemoStokeScrollButton>
        </GridCarouselControls>
      )}
      <div
        className='grid'
        ref={isCarousel ? rowRef : undefined}
        role={isCarousel ? 'region' : undefined}
        aria-label={carouselLabel}
      >
        {worksDataReversed.map((item, index) => {
          if (includeItem && !includeItem(item)) {
            return null;
          }

          return (
            <Thumbnail
              key={item.group}
              index={index}
              onThumbClick={handleThumbClick}
              {...item}
            />
          );
        })}
      </div>
    </GridContainer>
  );
};

export default GridContent;
