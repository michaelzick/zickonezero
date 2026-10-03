import { useCallback, useEffect, useRef, useState } from 'react';

const EDGE_TOLERANCE_PX = 1;

const getMaxScroll = (row: HTMLElement) => Math.max(row.scrollWidth - row.clientWidth, 0);

// Scroll offsets that bring each item to the row's snap start, accounting for
// the row's padding, border, and scroll-padding. Measured from layout rather
// than `offsetLeft`, which is relative to the nearest positioned ancestor.
const getItemScrollPositions = (row: HTMLElement, items: Element[]) => {
  const rowStart = row.getBoundingClientRect().left + row.clientLeft;
  const scrollPadding = parseFloat(window.getComputedStyle(row).scrollPaddingLeft) || 0;
  const maxScroll = getMaxScroll(row);

  return items.map((item) => {
    const position = item.getBoundingClientRect().left - rowStart + row.scrollLeft - scrollPadding;
    return Math.min(Math.max(position, 0), maxScroll);
  });
};

const useHorizontalGallery = (resetKey?: unknown) => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Read-only on purpose: writing scrollLeft here would cancel an in-flight
  // smooth scroll, whose first frame can move less than a pixel on 120Hz screens.
  const updateScrollButtons = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;

    const firstItem = row.firstElementChild;
    const [startPosition = 0] = firstItem ? getItemScrollPositions(row, [firstItem]) : [];

    setCanScrollLeft(row.scrollLeft > startPosition + EDGE_TOLERANCE_PX);
    setCanScrollRight(row.scrollLeft < getMaxScroll(row) - EDGE_TOLERANCE_PX);
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

  // Scroll to the next or previous item's snap position rather than by a fixed
  // width, so items of different widths and scroll snapping always agree.
  const scrollGalleryBy = useCallback((direction: number) => {
    const row = rowRef.current;
    if (!row) return;

    const positions = getItemScrollPositions(row, Array.from(row.children));
    const current = row.scrollLeft;
    const target = direction > 0
      ? positions.find((position) => position > current + EDGE_TOLERANCE_PX) ?? getMaxScroll(row)
      : [...positions].reverse().find((position) => position < current - EDGE_TOLERANCE_PX) ?? 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    row.scrollTo({ left: target, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, []);

  return { rowRef, canScrollLeft, canScrollRight, scrollGalleryBy };
};

export default useHorizontalGallery;
