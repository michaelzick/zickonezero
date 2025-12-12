import { useCallback, useEffect, useRef, useState } from 'react';

type AnimatedSectionsState = Record<string, boolean>;

const useAnimatedSections = (resetKey?: unknown) => {
  const [visibleSections, setVisibleSections] = useState<AnimatedSectionsState>({});
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
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView) {
          setVisibleSections((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
        }
      });
    };

    animatedSectionRefs.current.forEach((node) => node && observer.observe(node));

    // Ensure above-the-fold sections fade in on initial load without requiring a scroll.
    requestAnimationFrame(revealSectionsInView);

    return () => observer.disconnect();
  }, [resetKey]);

  return { visibleSections, setAnimatedSectionRef };
};

export default useAnimatedSections;
