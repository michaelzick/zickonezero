import { useCallback, useEffect, useRef, useState } from 'react';

const useHorizontalGallery = (resetKey?: unknown) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    if (row.scrollLeft <= 1) {
      row.scrollLeft = 0;
    }

    const firstItem = row.firstElementChild as HTMLElement | null;
    const startThreshold = (firstItem?.offsetLeft ?? 0) + 1;
    const maxScroll = Math.max(row.scrollWidth - row.clientWidth, 0);
    const isAtStart = row.scrollLeft <= startThreshold;
    const isAtEnd = row.scrollLeft >= maxScroll - 1;

    setCanScrollLeft(!isAtStart);
    setCanScrollRight(!isAtEnd);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    row.scrollLeft = 0;
    updateScrollButtons();

    const handleScroll = () => updateScrollButtons();
    row.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      row.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [resetKey, updateScrollButtons]);

  const scrollGalleryBy = useCallback((direction: number) => {
    const row = rowRef.current;
    if (!row) return;

    const firstItem = row.firstElementChild as HTMLElement | null;
    const itemWidth = firstItem?.getBoundingClientRect().width ?? 240;
    row.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
  }, []);

  return { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy };
};

export default useHorizontalGallery;
