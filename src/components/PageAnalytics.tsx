import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { trackPageView } from '../lib/analytics';

const PageAnalytics = () => {
  const router = useRouter();

  useEffect(() => {
    const trackCurrentPage = (url?: string) => {
      window.requestAnimationFrame(() => {
        trackPageView(url);
      });
    };

    trackCurrentPage();
    router.events.on('routeChangeComplete', trackCurrentPage);

    return () => {
      router.events.off('routeChangeComplete', trackCurrentPage);
    };
  }, [router.events]);

  return null;
};

export default PageAnalytics;
