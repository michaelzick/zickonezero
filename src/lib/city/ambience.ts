/**
 * The city's soundscape, synthesized with Web Audio so nothing is downloaded:
 * a low murmur of voices and machines over a detuned traffic drone. It is a
 * steady bed with no sudden events (no horns, buzzes, or passing hiss), and
 * the night is dry, like the city drawn on screen.
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
};

// The day street is busier; the night is quieter.
const LEVELS: Record<TimeOfDay, Levels> = {
  night: { murmur: 0.7, traffic: 0.18 },
  day: { murmur: 1, traffic: 0.25 },
};

const MASTER_GAIN = 0.5;
const FADE_IN_SECONDS = 1.8;
const FADE_OUT_SECONDS = 0.6;
// Night/day audio crossfades settle in about two seconds.
const TIMELAPSE_TIME_CONSTANT = 0.6;

const NOISE_SECONDS = 4;
const LOOP_BLEND_SECONDS = 0.05;

const readTimeOfDay = (): TimeOfDay => (
  document.documentElement.getAttribute('data-theme') === 'light' ? 'day' : 'night'
);

/** Brown noise that loops without a click: the extra tail is crossfaded into the head. */
const createBrownNoise = (ctx: BaseAudioContext, channels: number): AudioBuffer => {
  const { sampleRate } = ctx;
  const length = Math.floor(sampleRate * NOISE_SECONDS);
  const blend = Math.floor(sampleRate * LOOP_BLEND_SECONDS);
  const buffer = ctx.createBuffer(channels, length, sampleRate);

  for (let channel = 0; channel < channels; channel += 1) {
    const raw = new Float32Array(length + blend);
    let brown = 0;

    for (let i = 0; i < raw.length; i += 1) {
      // Integrated white noise: a deep, soft rumble.
      const white = Math.random() * 2 - 1;
      brown = (brown + 0.02 * white) / 1.02;
      raw[i] = brown * 3.5;
    }

    const data = buffer.getChannelData(channel);
    data.set(raw.subarray(0, length));
    for (let i = 0; i < blend; i += 1) {
      const t = i / blend;
      data[i] = raw[i] * t + raw[length + i] * (1 - t);
    }
  }

  return buffer;
};

const createGain = (ctx: BaseAudioContext, value: number): GainNode => {
  const node = ctx.createGain();
  node.gain.value = value;
  return node;
};

const createFilter = (ctx: BaseAudioContext, type: BiquadFilterType, frequency: number, q = Math.SQRT1_2): BiquadFilterNode => {
  const node = ctx.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  return node;
};

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

  const sources: AudioScheduledSourceNode[] = [];

  // Murmur: voices, vents, and engines blurred into a low rumble.
  const murmurLevel = createGain(ctx, 0);
  const murmur = ctx.createBufferSource();
  murmur.buffer = createBrownNoise(ctx, 1);
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
    ] as const).forEach(([param, value]) => {
      param.cancelScheduledValues(now);
      if (immediate) {
        param.setValueAtTime(value, now);
      } else {
        param.setTargetAtTime(value, now, TIMELAPSE_TIME_CONSTANT);
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
    },
    stop: () => {
      if (running) {
        running = false;
        observer?.disconnect();
        fadeMaster(0, FADE_OUT_SECONDS);
      }
      return (FADE_OUT_SECONDS + 0.1) * 1000;
    },
  };
};
