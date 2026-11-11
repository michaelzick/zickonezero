import { useCallback, useEffect, useRef, useState } from 'react';

type AnimatedSectionsState = Record<string, boolean>;

const REVEAL_SHARE = 0.22;
const REVEAL_VIEWPORT_SHARE = 0.25;
// Fire often enough below REVEAL_SHARE that wide or very tall sections still get a callback.
const THRESHOLDS = Array.from({ length: 23 }, (_, step) => step / 100);

/**
 * A section reveals once 22% of its height is on screen, or once it fills a
 * quarter of the viewport. Height, not area: a sideways-scrolling gallery hides
 * most of its area, and a section taller than four screens never shows 22% of
 * itself at once, yet both are plainly in view.
 */
export const isRevealable = (visibleHeight: number, sectionHeight: number, viewportHeight: number) =>
  visibleHeight > 0 && (
    visibleHeight >= sectionHeight * REVEAL_SHARE ||
    visibleHeight >= viewportHeight * REVEAL_VIEWPORT_SHARE
  );

/**
 * Reveals each animated section the first time it scrolls into view. Ids in
 * initiallyVisible (a page's opening hero) render visible from the start, so
 * they boot up from the first paint instead of waiting for scripts.
 */
const useAnimatedSections = (resetKey?: unknown, initiallyVisible: readonly string[] = []) => {
  const [visibleSections, setVisibleSections] = useState<AnimatedSectionsState>(
    () => Object.fromEntries(initiallyVisible.map((id) => [id, true])),
  );
  const animatedSectionRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const setAnimatedSectionRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    animatedSectionRefs.current.set(id, el);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const sectionId = entry.target.getAttribute('data-animate-id');
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        if (
          entry.isIntersecting &&
          sectionId &&
          isRevealable(entry.intersectionRect.height, entry.boundingClientRect.height, viewportHeight)
        ) {
          setVisibleSections((prev) => (prev[sectionId] ? prev : { ...prev, [sectionId]: true }));
        }
      });
    }, { threshold: THRESHOLDS });

    const revealSectionsInView = () => {
      animatedSectionRefs.current.forEach((node, id) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setVisibleSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
        }
      });
    };

    animatedSectionRefs.current.forEach((node) => node && observer.observe(node));
    const rafId = requestAnimationFrame(revealSectionsInView);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [resetKey]);

  return { visibleSections, setAnimatedSectionRef };
};

export default useAnimatedSections;
