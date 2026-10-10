import { RefObject, useEffect } from 'react';

/**
 * Sets data-offscreen on a scene while it is more than a screen away from the
 * viewport, so its CSS can take heavy layers out of the page (display: none)
 * and free their GPU memory. WebKit keeps every tile of a 3D scene allocated
 * while it is in the page, even far out of view. The screen of margin brings
 * the scene back before it scrolls into view.
 */
const useReleaseOffscreen = (ref: RefObject<HTMLElement | null>): void => {
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      node.toggleAttribute('data-offscreen', !entry.isIntersecting);
    }, { rootMargin: '100% 0px' });
    observer.observe(node);

    return () => {
      observer.disconnect();
      node.removeAttribute('data-offscreen');
    };
  }, [ref]);
};

export default useReleaseOffscreen;
