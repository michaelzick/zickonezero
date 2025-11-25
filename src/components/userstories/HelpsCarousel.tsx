import { useCallback, useEffect, useRef, useState, type ReactNode, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from 'react';
import {
  DemoStokeScrollHeader,
  DemoStokeScrollControls,
  DemoStokeScrollButton,
  DemoStokeMiniCardRow,
  DemoStokeMiniCard,
  DemoStokeMiniCardTitle,
  DemoStokeMiniCardPreview,
  DemoStokeMiniCardHint,
  DemoStokeMiniCardModalOverlay,
  DemoStokeMiniCardModal,
  DemoStokeMiniCardModalTitle,
  DemoStokeMiniCardModalCopy,
  DemoStokeMiniCardModalClose,
} from '../../../styles';

type HelpsItem = {
  title: string;
  description: ReactNode;
};

type HelpsCarouselProps = {
  items: HelpsItem[];
  title?: string;
};

const HelpsCarousel = ({ items, title = 'How DemoStoke Helps' }: HelpsCarouselProps) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const updateScrollButtons = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      updateScrollButtons();
    });
  }, [items.length, updateScrollButtons]);

  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateScrollButtons]);

  const scrollByCards = (direction: number) => {
    const el = rowRef.current;
    if (!el) return;

    const scrollAmount = Math.max(el.clientWidth * 0.8, 220) * direction;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const openModal = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, closeModal]);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <div>
      <DemoStokeScrollHeader>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <DemoStokeScrollControls aria-label={`Scroll ${title} cards`}>
          <DemoStokeScrollButton
            type='button'
            onClick={() => scrollByCards(-1)}
            disabled={!canScrollLeft}
            aria-label='Scroll left'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m14 18-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DemoStokeScrollButton>
          <DemoStokeScrollButton
            type='button'
            onClick={() => scrollByCards(1)}
            disabled={!canScrollRight}
            aria-label='Scroll right'
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DemoStokeScrollButton>
        </DemoStokeScrollControls>
      </DemoStokeScrollHeader>

      <DemoStokeMiniCardRow
        ref={rowRef}
        onScroll={updateScrollButtons}
        role='list'
        aria-label='How DemoStoke Helps options'
      >
        {items.map(({ title, description }, index) => (
          <DemoStokeMiniCard
            key={title}
            type='button'
            onClick={() => openModal(index)}
            onKeyDown={(event: ReactKeyboardEvent<HTMLButtonElement>) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openModal(index);
              }
            }}
            role='listitem'
            aria-label={`Open details for ${title}`}
          >
            <DemoStokeMiniCardTitle>{title}</DemoStokeMiniCardTitle>
            <DemoStokeMiniCardPreview>{description}</DemoStokeMiniCardPreview>
            <DemoStokeMiniCardHint>Open</DemoStokeMiniCardHint>
          </DemoStokeMiniCard>
        ))}
      </DemoStokeMiniCardRow>

      {activeItem && (
        <DemoStokeMiniCardModalOverlay onClick={closeModal} role='presentation'>
          <DemoStokeMiniCardModal
            role='dialog'
            aria-modal='true'
            aria-label={`How DemoStoke Helps: ${activeItem.title}`}
            onClick={(event: ReactMouseEvent<HTMLDivElement>) => {
              event.stopPropagation();
            }}
          >
            <DemoStokeMiniCardModalClose type='button' onClick={closeModal} aria-label='Close dialog'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="m6 6 12 12M6 18 18 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </DemoStokeMiniCardModalClose>
            <DemoStokeMiniCardModalTitle>{activeItem.title}</DemoStokeMiniCardModalTitle>
            <DemoStokeMiniCardModalCopy>{activeItem.description}</DemoStokeMiniCardModalCopy>
          </DemoStokeMiniCardModal>
        </DemoStokeMiniCardModalOverlay>
      )}
    </div>
  );
};

export default HelpsCarousel;
