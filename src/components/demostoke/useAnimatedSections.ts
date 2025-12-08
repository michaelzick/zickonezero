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

    animatedSectionRefs.current.forEach((node) => node && observer.observe(node));

    return () => observer.disconnect();
  }, [resetKey]);

  return { visibleSections, setAnimatedSectionRef };
};

export default useAnimatedSections;
