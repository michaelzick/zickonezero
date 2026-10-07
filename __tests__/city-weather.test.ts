import { mulberry32 } from '../src/lib/city/prng';
import { createWeatherEngine } from '../src/lib/city/weather';

type Call = [string, ...number[]];

/** A 2D context that records the drawing calls the engine makes. */
const createRecordingContext = () => {
  const calls: Call[] = [];
  const record = (name: string) => (...args: number[]) => {
    calls.push([name, ...args]);
  };
  const ctx = {
    globalAlpha: 1,
    lineWidth: 1,
    lineCap: 'butt',
    strokeStyle: '',
    fillStyle: '',
    clearRect: record('clearRect'),
    beginPath: record('beginPath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    stroke: record('stroke'),
    rect: record('rect'),
    arc: record('arc'),
    fill: record('fill'),
  };

  return {
    ctx,
    calls,
    count: (name: string) => calls.filter(([callName]) => callName === name).length,
    /** Drop heads (rain) or speck corners (dust), in draw order. */
    points: (name: 'moveTo' | 'rect') => calls
      .filter(([callName]) => callName === name)
      .map(([, x, y]) => ({ x, y })),
    reset: () => {
      calls.length = 0;
    },
  };
};

const WIDTH = 1280;
const HEIGHT = 720;
const BUDGET = 420;
const STILL = { delta: 0, velocity: 0 };

const createEngine = (seed = 7) => {
  const recorder = createRecordingContext();
  const engine = createWeatherEngine(recorder.ctx as unknown as CanvasRenderingContext2D, mulberry32(seed));
  engine.resize(WIDTH, HEIGHT, BUDGET);
  return { engine, ...recorder };
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

describe('weather engine', () => {
  it('draws night rain as three batched strokes, one per depth', () => {
    const { engine, ctx, count } = createEngine();

    engine.draw();

    expect(count('clearRect')).toBe(1);
    expect(count('stroke')).toBe(3);
    expect(count('fill')).toBe(0);
    // Far, mid, and near buckets share the whole budget.
    expect(count('moveTo')).toBe(BUDGET);
    expect(ctx.globalAlpha).toBe(1);
  });

  it('draws day dust as three batched fills from a smaller budget', () => {
    const { engine, count } = createEngine();

    engine.setMode('dust', true);
    engine.draw();

    expect(count('fill')).toBe(3);
    expect(count('stroke')).toBe(0);
    expect(count('rect')).toBeGreaterThan(0);
    expect(count('rect')).toBeLessThan(BUDGET / 2);
  });

  it('crossfades from rain to dust over a moment', () => {
    const { engine, count, reset } = createEngine();

    engine.setMode('dust');
    engine.step(0.05, STILL);
    reset();
    engine.draw();
    expect(count('stroke')).toBe(3);
    expect(count('fill')).toBe(3);

    for (let frame = 0; frame < 40; frame += 1) {
      engine.step(0.05, STILL);
    }
    reset();
    engine.draw();
    expect(count('stroke')).toBe(0);
    expect(count('fill')).toBe(3);
  });

  it('draws snow as three batched fills of round flakes', () => {
    const { engine, count } = createEngine();

    engine.setMode('snow', true);
    engine.draw();

    expect(count('fill')).toBe(3);
    expect(count('stroke')).toBe(0);
    expect(count('arc')).toBe(Math.round(BUDGET * 0.45 * 0.6) + Math.round(BUDGET * 0.35 * 0.6) + Math.round(BUDGET * 0.2 * 0.6));
  });

  it('crossfades from rain to snow and keeps flakes in view', () => {
    const { engine, count, calls, reset } = createEngine();

    engine.setMode('snow');
    engine.step(0.05, STILL);
    reset();
    engine.draw();
    expect(count('stroke')).toBe(3);
    expect(count('arc')).toBeGreaterThan(0);

    for (let frame = 0; frame < 400; frame += 1) {
      engine.step(1 / 60, STILL);
    }
    reset();
    engine.draw();
    expect(count('stroke')).toBe(0);
    expect(count('fill')).toBe(3);
    calls.filter(([name]) => name === 'arc').forEach(([, x, y]) => {
      expect(x).toBeGreaterThanOrEqual(-4);
      expect(x).toBeLessThanOrEqual(WIDTH + 4);
      expect(y).toBeGreaterThanOrEqual(-4);
      expect(y).toBeLessThanOrEqual(HEIGHT + 4);
    });
  });

  it('caps a long frame so a slow tab never teleports the rain', () => {
    const slow = createEngine();
    const smooth = createEngine();

    slow.engine.step(10, STILL);
    smooth.engine.step(0.05, STILL);
    slow.engine.draw();
    smooth.engine.draw();

    expect(slow.calls).toEqual(smooth.calls);
  });

  it('keeps every drop falling through the view', () => {
    const { engine, points, reset } = createEngine();

    for (let frame = 0; frame < 300; frame += 1) {
      engine.step(1 / 60, STILL);
    }
    reset();
    engine.draw();

    points('moveTo').forEach(({ x, y }) => {
      expect(x).toBeGreaterThanOrEqual(-40);
      expect(x).toBeLessThanOrEqual(WIDTH + 20);
      expect(y).toBeGreaterThanOrEqual(-HEIGHT * 0.2 - 1);
      expect(y).toBeLessThanOrEqual(HEIGHT + 34);
    });
  });

  it('moves nearer drops further with the page', () => {
    const { engine, points, reset } = createEngine();
    engine.draw();
    const before = points('moveTo');

    reset();
    engine.step(0, { delta: 100, velocity: 0 });
    engine.draw();
    const after = points('moveTo');

    const shift = (from: number, to: number) => -median(
      after.slice(from, to).map(({ y }, index) => y - before[from + index].y),
    );
    // Draw order is far (45% of the budget), mid (35%), then near (20%).
    const far = shift(0, 189);
    const mid = shift(189, 336);
    const near = shift(336, BUDGET);

    expect(far).toBeCloseTo(12, 3);
    expect(mid).toBeCloseTo(30, 3);
    expect(near).toBeCloseTo(65, 3);
  });

  it('stretches streaks into motion blur while the page scrolls', () => {
    const { engine, calls, reset } = createEngine();
    const streak = () => {
      const head = calls.find(([name]) => name === 'moveTo') as Call;
      const tail = calls.find(([name]) => name === 'lineTo') as Call;
      return head[2] - tail[2];
    };

    engine.draw();
    const resting = streak();

    reset();
    engine.step(0, { delta: 0, velocity: 32 });
    engine.draw();

    expect(streak()).toBeCloseTo(resting * 3, 3);
  });

  it('keeps the rain when a phone toolbar nudges the height', () => {
    let draws = 0;
    const random = mulberry32(3);
    const counted = () => {
      draws += 1;
      return random();
    };
    const engine = createWeatherEngine(createRecordingContext().ctx as unknown as CanvasRenderingContext2D, counted);

    engine.resize(WIDTH, HEIGHT, BUDGET);
    expect(draws).toBeGreaterThan(0);

    draws = 0;
    engine.resize(WIDTH, HEIGHT, BUDGET);
    engine.resize(WIDTH, HEIGHT + 60, BUDGET);
    expect(draws).toBe(0);

    engine.resize(WIDTH, HEIGHT * 1.5, BUDGET);
    expect(draws).toBeGreaterThan(0);

    draws = 0;
    engine.resize(WIDTH - 100, HEIGHT * 1.5, BUDGET);
    expect(draws).toBeGreaterThan(0);
  });
});
