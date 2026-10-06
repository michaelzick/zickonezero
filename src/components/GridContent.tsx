import { useEffect, useRef } from 'react';

import { GigCarouselControls, GigGrid } from '../../styles/district';
import { Thumbnail } from '.';
import useHorizontalGallery from '../hooks/useHorizontalGallery';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

import { DistrictTone, WorksData, WorksDataType } from '../types';

type Props = WorksDataType & {
  onThumbClick: (index: number) => void;
  includeItem?: (item: WorksData) => boolean;
  disableThumbClick?: boolean;
  /** When set, the grid becomes a labelled horizontal carousel on phones. */
  carouselLabel?: string;
  /** The district's neon for every card. */
  tone?: DistrictTone;
  /** The status chip on every card, such as "Live". */
  status?: string;
};

// Boot the cards once the grid's top is this far into the viewport.
const BOOT_ROOT_MARGIN = '0px 0px -12% 0px';

const GridContent = (props: Props) => {
  const { worksDataReversed, onThumbClick, includeItem, disableThumbClick, carouselLabel, tone, status } = props;
  const handleThumbClick: (index: number) => void = disableThumbClick ? (() => undefined) : onThumbClick;
  const { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy } = useHorizontalGallery();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isCarousel = Boolean(carouselLabel);

  // Keep the cards dark until the grid scrolls into view, then boot them in
  // one after another.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    grid.setAttribute('data-standby', '');
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      grid.removeAttribute('data-standby');
      grid.setAttribute('data-booted', '');
      observer.disconnect();
    }, { rootMargin: BOOT_ROOT_MARGIN });
    observer.observe(grid);

    return () => {
      observer.disconnect();
      grid.removeAttribute('data-standby');
    };
  }, [prefersReducedMotion]);

  // Keep each card's index into the full list, which the lightbox reads.
  const items = worksDataReversed
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !includeItem || includeItem(item));

  return (
    <GigGrid ref={gridRef} $carousel={isCarousel}>
      {isCarousel && (
        <GigCarouselControls role='group' aria-label={`${carouselLabel} navigation`}>
          <button type='button' onClick={() => scrollGalleryBy(-1)} disabled={!canScrollLeft} aria-label='Scroll left'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
              <path d='m14 18-6-6 6-6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
          <button type='button' onClick={() => scrollGalleryBy(1)} disabled={!canScrollRight} aria-label='Scroll right'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true' focusable='false'>
              <path d='m10 6 6 6-6 6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </button>
        </GigCarouselControls>
      )}
      <div
        className='grid'
        ref={isCarousel ? rowRef : undefined}
        role={isCarousel ? 'region' : undefined}
        aria-label={carouselLabel}
      >
        {items.map(({ item, index }, position) => (
          <Thumbnail
            key={item.group}
            index={index}
            onThumbClick={handleThumbClick}
            tone={tone}
            status={status}
            gigNumber={position + 1}
            order={position}
            opensGallery={!disableThumbClick && !item.link && item.imgs.length > 0}
            {...item}
          />
        ))}
      </div>
    </GigGrid>
  );
};

export default GridContent;
