/**
 * Rain (night) and sunlit dust (day) for the WeatherCanvas.
 *
 * Particles live in typed arrays, and each depth bucket draws as one batched
 * path, so a frame costs at most six draw calls whatever the particle count.
 * The engine only draws; the component owns the canvas, timing, and events.
 */

export type WeatherMode = 'rain' | 'dust';

export type WeatherScroll = {
  /** Pixels scrolled since the previous frame. */
  delta: number;
  /** Smoothed pixels per frame. */
  velocity: number;
};

export type WeatherEngine = {
  /** Sets the drawing size in CSS pixels and the particle budget. */
  resize: (width: number, height: number, count: number) => void;
  /** Crossfades to a mode, or switches at once when immediate. */
  setMode: (mode: WeatherMode, immediate?: boolean) => void;
  step: (seconds: number, scroll: WeatherScroll) => void;
  draw: () => void;
};

type Bucket = {
  /** Share of the particle budget. */
  share: number;
  /** How far particles move with the page when it scrolls (1 = with the content). */
  parallax: number;
  rain: { minSpeed: number; maxSpeed: number; minLength: number; maxLength: number; width: number; alpha: number };
  dust: { minSize: number; maxSize: number; drift: number; alpha: number };
};

// Far, mid, and near: nearer drops are faster, longer, brighter, and move
// more with the page.
const BUCKETS: readonly Bucket[] = [
  {
    share: 0.45,
    parallax: 0.12,
    rain: { minSpeed: 520, maxSpeed: 680, minLength: 8, maxLength: 13, width: 1, alpha: 0.2 },
    dust: { minSize: 0.8, maxSize: 1.4, drift: 6, alpha: 0.32 },
  },
  {
    share: 0.35,
    parallax: 0.3,
    rain: { minSpeed: 820, maxSpeed: 1040, minLength: 14, maxLength: 20, width: 1.25, alpha: 0.28 },
    dust: { minSize: 1.2, maxSize: 2, drift: 10, alpha: 0.42 },
  },
  {
    share: 0.2,
    parallax: 0.65,
    rain: { minSpeed: 1250, maxSpeed: 1600, minLength: 24, maxLength: 34, width: 1.6, alpha: 0.36 },
    dust: { minSize: 1.8, maxSize: 2.8, drift: 16, alpha: 0.5 },
  },
];

/** Horizontal drift per pixel of fall. */
const WIND = 0.16;
const RAIN_COLOR = 'rgb(176, 232, 255)';
const DUST_COLOR = 'rgb(255, 246, 222)';
const DUST_SHARE = 0.4;
const FADE_SECONDS = 1.6;
const MAX_STEP_SECONDS = 0.05;

type Particles = {
  count: number;
  x: Float32Array;
  y: Float32Array;
  /** Fall speed (rain) or unused (dust). */
  speed: Float32Array;
  /** Streak length (rain) or speck size (dust). */
  size: Float32Array;
  /** Wobble phase for dust. */
  phase: Float32Array;
};

const createParticles = (count: number): Particles => ({
  count,
  x: new Float32Array(count),
  y: new Float32Array(count),
  speed: new Float32Array(count),
  size: new Float32Array(count),
  phase: new Float32Array(count),
});

const between = (random: () => number, min: number, max: number) => min + (max - min) * random();

export const createWeatherEngine = (
  ctx: CanvasRenderingContext2D,
  random: () => number = Math.random,
): WeatherEngine => {
  let width = 0;
  let height = 0;
  let budget = 0;
  let rain: Particles[] = [];
  let dust: Particles[] = [];
  let mode: WeatherMode = 'rain';
  /** 0 shows only rain, 1 only dust. */
  let mix = 0;
  let time = 0;
  let stretch = 1;

  const seed = () => {
    rain = BUCKETS.map((bucket) => {
      const particles = createParticles(Math.round(budget * bucket.share));
      for (let i = 0; i < particles.count; i += 1) {
        particles.x[i] = between(random, -40, width);
        particles.y[i] = between(random, -height * 0.2, height);
        particles.speed[i] = between(random, bucket.rain.minSpeed, bucket.rain.maxSpeed);
        particles.size[i] = between(random, bucket.rain.minLength, bucket.rain.maxLength);
      }
      return particles;
    });

    dust = BUCKETS.map((bucket) => {
      const particles = createParticles(Math.round(budget * bucket.share * DUST_SHARE));
      for (let i = 0; i < particles.count; i += 1) {
        particles.x[i] = between(random, 0, width);
        particles.y[i] = between(random, 0, height);
        particles.size[i] = between(random, bucket.dust.minSize, bucket.dust.maxSize);
        particles.phase[i] = between(random, 0, Math.PI * 2);
      }
      return particles;
    });
  };

  const stepRain = (seconds: number, scrollDelta: number) => {
    BUCKETS.forEach((bucket, index) => {
      const particles = rain[index];
      const shift = scrollDelta * bucket.parallax;

      for (let i = 0; i < particles.count; i += 1) {
        const fall = particles.speed[i] * seconds;
        const length = particles.size[i] * stretch;
        particles.y[i] += fall - shift;
        particles.x[i] += fall * WIND;

        if (particles.y[i] - length > height) {
          particles.y[i] -= height + length * 2;
          particles.x[i] = between(random, -40, width);
        } else if (particles.y[i] < -length * 2) {
          particles.y[i] += height + length * 2;
        }

        if (particles.x[i] > width + 20) {
          particles.x[i] -= width + 60;
        }
      }
    });
  };

  const stepDust = (seconds: number, scrollDelta: number) => {
    BUCKETS.forEach((bucket, index) => {
      const particles = dust[index];
      const shift = scrollDelta * bucket.parallax;

      for (let i = 0; i < particles.count; i += 1) {
        const phase = particles.phase[i];
        particles.x[i] += bucket.dust.drift * (1 + 0.4 * Math.sin(time * 0.7 + phase)) * seconds;
        particles.y[i] += 8 * Math.sin(time * 0.5 + phase * 1.3) * seconds - shift;

        if (particles.x[i] > width + 4) {
          particles.x[i] -= width + 8;
        }

        if (particles.y[i] > height + 4) {
          particles.y[i] -= height + 8;
        } else if (particles.y[i] < -4) {
          particles.y[i] += height + 8;
        }
      }
    });
  };

  const drawRain = (strength: number) => {
    ctx.strokeStyle = RAIN_COLOR;
    ctx.lineCap = 'round';

    BUCKETS.forEach((bucket, index) => {
      const particles = rain[index];
      ctx.beginPath();
      for (let i = 0; i < particles.count; i += 1) {
        const length = particles.size[i] * stretch;
        ctx.moveTo(particles.x[i], particles.y[i]);
        ctx.lineTo(particles.x[i] - length * WIND, particles.y[i] - length);
      }
      ctx.globalAlpha = bucket.rain.alpha * strength;
      ctx.lineWidth = bucket.rain.width;
      ctx.stroke();
    });
  };

  const drawDust = (strength: number) => {
    ctx.fillStyle = DUST_COLOR;

    BUCKETS.forEach((bucket, index) => {
      const particles = dust[index];
      ctx.beginPath();
      for (let i = 0; i < particles.count; i += 1) {
        ctx.rect(particles.x[i], particles.y[i], particles.size[i], particles.size[i]);
      }
      ctx.globalAlpha = bucket.dust.alpha * strength;
      ctx.fill();
    });
  };

  return {
    resize: (nextWidth, nextHeight, count) => {
      const reseed = count !== budget || nextWidth !== width || Math.abs(nextHeight - height) > height * 0.25;
      width = nextWidth;
      height = nextHeight;
      budget = count;
      if (reseed) {
        seed();
      }
    },

    setMode: (nextMode, immediate = false) => {
      mode = nextMode;
      if (immediate) {
        mix = nextMode === 'dust' ? 1 : 0;
      }
    },

    step: (seconds, scroll) => {
      const dt = Math.min(Math.max(seconds, 0), MAX_STEP_SECONDS);
      const target = mode === 'dust' ? 1 : 0;
      const fade = dt / FADE_SECONDS;
      mix = target > mix ? Math.min(target, mix + fade) : Math.max(target, mix - fade);
      time += dt;
      // Streaks lengthen into motion blur while the page scrolls.
      stretch = 1 + Math.min(Math.abs(scroll.velocity) / 16, 2.2);

      if (mix < 1) {
        stepRain(dt, scroll.delta);
      }

      if (mix > 0) {
        stepDust(dt, scroll.delta);
      }
    },

    draw: () => {
      ctx.clearRect(0, 0, width, height);

      if (mix < 1) {
        drawRain(1 - mix);
      }

      if (mix > 0) {
        drawDust(mix);
      }

      ctx.globalAlpha = 1;
    },
  };
};
