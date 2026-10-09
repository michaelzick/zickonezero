import { useCallback, useEffect, useRef, useState } from 'react';

type AnimatedSectionsState = Record<string, boolean>;

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
        if (entry.isIntersecting && sectionId) {
          setVisibleSections((prev) => (prev[sectionId] ? prev : { ...prev, [sectionId]: true }));
        }
      });
    }, { threshold: 0.22 });

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
