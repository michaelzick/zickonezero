import { useEffect, useRef } from 'react';

import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { createWeatherEngine, WeatherMode } from '../../lib/city/weather';
import { WeatherCanvasElement } from '../../../styles/city';

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

const COMPACT_MAX_PARTICLES = 120;
const MAX_PARTICLES = 420;
const MIN_PARTICLES = 80;
/** Viewport area (CSS px²) per particle. */
const AREA_PER_PARTICLE = 3600;
const VELOCITY_SMOOTHING = 0.2;

type Props = {
  /** Thins the weather behind long-form pages. */
  dimmed?: boolean;
};

const readMode = (): WeatherMode => (
  document.documentElement.getAttribute('data-theme') === 'light' ? 'dust' : 'rain'
);

/**
 * Rain at night, sunlit dust by day, drawn on one fixed canvas between the
 * city and the page. Drops move with page scroll by depth and stretch into
 * streaks while scrolling. It pauses in hidden tabs, and draws a single still
 * frame under reduced motion or Save-Data.
 */
const WeatherCanvas = ({ dimmed = false }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return undefined;
    }

    const engine = createWeatherEngine(ctx);
    engine.setMode(readMode(), true);

    const saveData = Boolean((navigator as NavigatorWithConnection).connection?.saveData);
    const animate = !prefersReducedMotion && !saveData;

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) {
        return;
      }

      const compact = width < 600 || window.matchMedia('(pointer: coarse)').matches;
      const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2);
      const count = Math.round(Math.min(
        Math.max((width * height) / AREA_PER_PARTICLE, MIN_PARTICLES),
        compact ? COMPACT_MAX_PARTICLES : MAX_PARTICLES,
      ));

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      engine.resize(width, height, count);

      if (!animate) {
        engine.draw();
      }
    };

    let frame: number | null = null;
    let resizeFrame: number | null = null;
    let lastTime = 0;
    let lastScrollY = window.scrollY;
    let velocity = 0;

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);

      const seconds = lastTime === 0 ? 0 : (now - lastTime) / 1000;
      lastTime = now;

      // Read scroll here rather than in a listener so drops and page move in
      // the same frame. Jumps (navigation, anchors) are not motion.
      const scrollY = window.scrollY;
      const rawDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      const delta = Math.abs(rawDelta) > window.innerHeight ? 0 : rawDelta;
      velocity += (delta - velocity) * VELOCITY_SMOOTHING;

      engine.step(seconds, { delta, velocity });
      engine.draw();
    };

    const start = () => {
      if (animate && frame === null && !document.hidden) {
        lastTime = 0;
        lastScrollY = window.scrollY;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const handleResize = () => {
      if (resizeFrame === null) {
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = null;
          resize();
        });
      }
    };

    const handleVisibility = () => (document.hidden ? stop() : start());

    const themeObserver = new MutationObserver(() => {
      engine.setMode(readMode(), !animate);
      if (!animate) {
        engine.draw();
      }
    });

    resize();
    start();
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibility);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stop();
      if (resizeFrame !== null) {
        window.cancelAnimationFrame(resizeFrame);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      themeObserver.disconnect();
    };
  }, [prefersReducedMotion]);

  return <WeatherCanvasElement ref={canvasRef} aria-hidden='true' data-dimmed={dimmed} />;
};

export default WeatherCanvas;
