import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { trackPageView } from '../lib/analytics';

// A new object per view, so a repeat visit to the same URL still counts.
type PageView = { url?: string };

const PageAnalytics = () => {
  const router = useRouter();
  const [view, setView] = useState<PageView>({});
  const trackedView = useRef<PageView | null>(null);

  useEffect(() => {
    const onRouteChange = (url: string) => setView({ url });

    router.events.on('routeChangeComplete', onRouteChange);
    return () => router.events.off('routeChangeComplete', onRouteChange);
  }, [router.events]);

  // next/head sets the new page's title in an effect, which React 19 may run
  // after routeChangeComplete and the next frame. Tracking from a render of
  // our own lets React run the page's effects first, so the view carries the
  // new title rather than the previous page's.
  useEffect(() => {
    // Strict Mode runs effects twice; count each view once.
    if (trackedView.current === view) return;
    trackedView.current = view;
    trackPageView(view.url);
  }, [view]);

  return null;
};

export default PageAnalytics;
