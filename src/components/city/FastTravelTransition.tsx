import { useRouter } from 'next/router';
import { CSSProperties, useEffect, useState } from 'react';

import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { getRouteMeta, normalizeRoutePath, type CityAccent } from '../../lib/city/routes';
import {
  FAST_TRAVEL_COVER_MS,
  FAST_TRAVEL_REVEAL_MS,
  FastTravelOverlay,
} from '../../../styles/city';

type Destination = {
  label: string;
  accent: CityAccent;
};

type TravelState =
  | { phase: 'idle' }
  | { phase: 'covering'; destination: Destination }
  | { phase: 'revealing'; destination: Destination };

const IDLE: TravelState = { phase: 'idle' };

/** Lifts the shutters even if a navigation never reports back. */
const SAFETY_MS = 4000;

const SLATS = [0, 1, 2, 3, 4, 5];

type RouteChangeOptions = { shallow?: boolean };
type RouteChangeError = { cancelled?: boolean } | null | undefined;

/**
 * Shutters drop over a client navigation ("Fast travel ▸ DemoStoke") and roll
 * up once the new page is in. It only animates over the navigation and never
 * holds it back. Shallow routes, hash links, and same-page query changes stay
 * still, and so does everything under reduced motion. Mounted once in
 * pages/_app.tsx.
 */
const FastTravelTransition = () => {
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [travel, setTravel] = useState<TravelState>(IDLE);

  useEffect(() => {
    if (prefersReducedMotion) {
      setTravel(IDLE);
      return undefined;
    }

    // Tracked here rather than read from the URL: on back and forward the
    // browser has already changed the URL when routeChangeStart fires.
    let currentPath = normalizeRoutePath(window.location.pathname);
    let pendingPath: string | null = null;
    let coveredAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;

    const clearTimers = () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
      timer = undefined;
      safetyTimer = undefined;
    };

    const reveal = () => {
      pendingPath = null;
      clearTimers();

      // Let the shutters finish closing before they lift.
      const closingFor = Math.max(0, FAST_TRAVEL_COVER_MS - (performance.now() - coveredAt));
      timer = setTimeout(() => {
        setTravel((current) => (
          current.phase === 'covering' ? { phase: 'revealing', destination: current.destination } : current
        ));
        timer = setTimeout(() => {
          timer = undefined;
          setTravel(IDLE);
        }, FAST_TRAVEL_REVEAL_MS);
      }, closingFor);
    };

    const handleStart = (url: string, options?: RouteChangeOptions) => {
      const path = normalizeRoutePath(url);
      if (options?.shallow || path === currentPath) {
        return;
      }

      clearTimers();
      pendingPath = path;
      coveredAt = performance.now();
      const { label, accent } = getRouteMeta(path);
      setTravel({ phase: 'covering', destination: { label, accent } });
      safetyTimer = setTimeout(reveal, SAFETY_MS);
    };

    const handleComplete = (url: string) => {
      const path = normalizeRoutePath(url);
      currentPath = path;
      if (path === pendingPath) {
        reveal();
      }
    };

    const handleError = (error: RouteChangeError, url: string) => {
      // A newer navigation cancelled this one and has already taken over.
      if (!error?.cancelled && normalizeRoutePath(url) === pendingPath) {
        reveal();
      }
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleError);
      clearTimers();
      setTravel(IDLE);
    };
  }, [prefersReducedMotion, router.events]);

  if (travel.phase === 'idle') {
    return null;
  }

  const { label, accent } = travel.destination;

  return (
    <FastTravelOverlay
      aria-hidden='true'
      data-phase={travel.phase}
      style={{ '--travel-accent': `var(--neon-${accent})` } as CSSProperties}
    >
      {SLATS.map((slat) => (
        <span key={slat} className='slat' style={{ '--slat': slat } as CSSProperties} />
      ))}
      <div className='readout'>
        <span className='readout-label'>Fast travel ▸</span>
        <span className='readout-destination'>{label}</span>
        <span className='readout-bar' />
      </div>
    </FastTravelOverlay>
  );
};

export default FastTravelTransition;
