import {
  between,
  birds,
  createFilter,
  createGain,
  createStreet,
  createTalker,
  crickets,
  gust,
  helicopter,
  horns,
  lateCar,
  siren,
  traffic,
  train,
  type StreetSound,
  type Talker,
} from './streetSounds';

/**
 * The city's soundscape, synthesized with Web Audio so nothing is downloaded.
 * Under everything runs a low murmur of vents and engines over a detuned
 * traffic drone. By day the street is busy: cars passing, the odd horn, and a
 * bird now and then. At night it thins to a couple of people talking down the
 * street, wind, crickets, and, far off, the occasional siren, helicopter, or
 * train.
 * Every one-off sound is distant and quiet (see ./streetSounds), and none of
 * them repeat on a fixed beat.
 *
 * ./sound loads this module the first time a visitor turns sound on. It only
 * needs a BaseAudioContext, so it can also be rendered offline.
 */

export type Ambience = {
  /** Fades the city in at the current time of day. Safe to call twice. */
  start: () => void;
  /** Fades the city out and returns the milliseconds until it is silent. */
  stop: () => number;
};

type TimeOfDay = 'night' | 'day';

type Levels = {
  murmur: number;
  traffic: number;
  crowd: number;
};

// The day street is busier; the night is quieter.
const LEVELS: Record<TimeOfDay, Levels> = {
  night: { murmur: 0.6, traffic: 0.16, crowd: 1.2 },
  day: { murmur: 1, traffic: 0.25, crowd: 0 },
};

// How many people are out talking. Only the night has voices; by day the
// traffic carries the street.
const TALKERS: Record<TimeOfDay, number> = { night: 2, day: 0 };

type Cue = {
  time: TimeOfDay;
  /** Seconds before it first plays once its time of day comes round. */
  first: readonly [number, number];
  /** Seconds of quiet between one play ending and the next starting. */
  gap: readonly [number, number];
  /** Solo sounds (the big, far-off ones) never overlap each other. */
  solo?: boolean;
  play: StreetSound;
};

const CUES: readonly Cue[] = [
  { time: 'day', first: [0.5, 3], gap: [1.5, 6], play: traffic },
  { time: 'day', first: [5, 12], gap: [10, 26], play: horns },
  { time: 'day', first: [3, 10], gap: [12, 32], play: birds },
  { time: 'night', first: [4, 12], gap: [14, 34], play: lateCar },
  { time: 'night', first: [3, 9], gap: [12, 32], play: gust },
  { time: 'night', first: [8, 20], gap: [20, 50], play: crickets },
  { time: 'night', first: [15, 40], gap: [60, 140], solo: true, play: siren },
  { time: 'night', first: [45, 90], gap: [90, 180], solo: true, play: helicopter },
  { time: 'night', first: [60, 120], gap: [70, 160], solo: true, play: train },
];

const MASTER_GAIN = 0.5;
const FADE_IN_SECONDS = 1.8;
const FADE_OUT_SECONDS = 0.6;
// Night/day audio crossfades settle in about two seconds.
const TIMELAPSE_TIME_CONSTANT = 0.6;

// The scheduler wakes every TICK_MS and books whatever starts within the next
// LOOKAHEAD_SECONDS on the audio clock, so timer jitter never shows.
const TICK_MS = 400;
const LOOKAHEAD_SECONDS = 1;
// A cue this far overdue was missed (muted, or a hidden tab), so it is redrawn
// instead of everything firing at once.
const STALE_SECONDS = 1.5;

const readTimeOfDay = (): TimeOfDay => (
  document.documentElement.getAttribute('data-theme') === 'light' ? 'day' : 'night'
);

/** A slow sine wobble added to an AudioParam. */
const createLfo = (ctx: BaseAudioContext, frequency: number, depth: number, target: AudioParam): OscillatorNode => {
  const oscillator = ctx.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(createGain(ctx, depth)).connect(target);
  return oscillator;
};

export const createAmbience = (ctx: BaseAudioContext): Ambience => {
  const master = createGain(ctx, 0);
  master.connect(ctx.destination);
  const street = createStreet(ctx, master);

  const sources: AudioScheduledSourceNode[] = [];

  // Murmur: vents and engines blurred into a low rumble.
  const murmurLevel = createGain(ctx, 0);
  const murmur = ctx.createBufferSource();
  murmur.buffer = street.noise;
  murmur.loop = true;
  murmur
    .connect(createFilter(ctx, 'highpass', 70))
    .connect(createFilter(ctx, 'lowpass', 800, 0.5))
    .connect(murmurLevel)
    .connect(master);
  sources.push(murmur);

  // Traffic drone: two detuned saws beating slowly under a breathing filter.
  const trafficLevel = createGain(ctx, 0);
  const droneFilter = createFilter(ctx, 'lowpass', 260);
  [55, 55.45].forEach((frequency) => {
    const drone = ctx.createOscillator();
    drone.type = 'sawtooth';
    drone.frequency.value = frequency;
    drone.connect(droneFilter);
    sources.push(drone);
  });
  droneFilter.connect(trafficLevel).connect(master);
  sources.push(createLfo(ctx, 0.05, 70, droneFilter.frequency));

  sources.forEach((source) => source.start());

  // Crowd: people talking down the street at night, heard mostly as echo.
  const crowdLevel = createGain(ctx, 0);
  const crowd = createFilter(ctx, 'highpass', 180);
  crowd.connect(createFilter(ctx, 'lowpass', 2400)).connect(crowdLevel);
  crowdLevel.connect(createGain(ctx, 0.5)).connect(master);
  crowdLevel.connect(createGain(ctx, 0.8)).connect(street.echo);
  const talkers: { talker: Talker; freeAt: number }[] = Array.from(
    { length: Math.max(TALKERS.night, TALKERS.day) },
    () => ({ talker: createTalker(ctx, crowd), freeAt: 0 }),
  );

  const due = CUES.map(() => -Infinity);
  let soloUntil = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const observer = typeof MutationObserver === 'undefined'
    ? null
    : new MutationObserver(() => applyLevels(false));
  let running = false;

  function applyLevels(immediate: boolean) {
    const levels = LEVELS[readTimeOfDay()];
    const now = ctx.currentTime;

    ([
      [murmurLevel.gain, levels.murmur],
      [trafficLevel.gain, levels.traffic],
      [crowdLevel.gain, levels.crowd],
    ] as const).forEach(([param, value]) => {
      param.cancelScheduledValues(now);
      if (immediate) {
        param.setValueAtTime(value, now);
      } else {
        param.setTargetAtTime(value, now, TIMELAPSE_TIME_CONSTANT);
      }
    });
  }

  function tick() {
    timer = setTimeout(tick, TICK_MS);
    // A suspended context would bunch everything up; wait for it instead.
    if (ctx.state !== 'running') {
      return;
    }

    const now = ctx.currentTime;
    const horizon = now + LOOKAHEAD_SECONDS;
    const time = readTimeOfDay();

    CUES.forEach((cue, index) => {
      // Off-hours cues keep redrawing, so they arrive staggered after a switch.
      if (cue.time !== time || due[index] < now - STALE_SECONDS) {
        due[index] = now + between(...cue.first);
        return;
      }
      if (due[index] > horizon) {
        return;
      }

      const when = Math.max(due[index], now);
      if (cue.solo && when < soloUntil) {
        due[index] = soloUntil + between(...cue.first);
        return;
      }

      const seconds = cue.play(street, when);
      if (cue.solo) {
        soloUntil = when + seconds;
      }
      due[index] = when + seconds + between(...cue.gap);
    });

    talkers.forEach((voice, index) => {
      if (index < TALKERS[time] && voice.freeAt < horizon) {
        const end = voice.talker.speak(Math.max(voice.freeAt, now + 0.05));
        voice.freeAt = end + between(0.4, 3);
      }
    });
  }

  const fadeMaster = (value: number, seconds: number) => {
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(value, now + seconds);
  };

  return {
    start: () => {
      if (running) {
        return;
      }
      running = true;
      applyLevels(true);
      fadeMaster(MASTER_GAIN, FADE_IN_SECONDS);
      observer?.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      tick();
    },
    stop: () => {
      if (running) {
        running = false;
        observer?.disconnect();
        clearTimeout(timer);
        timer = undefined;
        fadeMaster(0, FADE_OUT_SECONDS);
      }
      return (FADE_OUT_SECONDS + 0.1) * 1000;
    },
  };
};
