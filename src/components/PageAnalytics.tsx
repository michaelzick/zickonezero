import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { trackPageView } from '../lib/analytics';

const PageAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    let rafId: number | undefined;

    const trackCurrentPage = (url?: string) => {
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(() => {
        rafId = undefined;
        trackPageView(url);
      });
    };

    trackCurrentPage();
    router.events.on('routeChangeComplete', trackCurrentPage);

    return () => {
      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
      router.events.off('routeChangeComplete', trackCurrentPage);
    };
  }, [router.events]);

  return null;
};

export default PageAnalytics;
