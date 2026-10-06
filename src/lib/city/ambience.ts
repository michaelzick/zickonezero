/**
 * The city's soundscape, synthesized with Web Audio so nothing is downloaded:
 * rain hiss at night, a low murmur of voices and machines, a detuned traffic
 * drone, the odd buzzing neon tube, and cars passing in the distance.
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
  rain: number;
  murmur: number;
  traffic: number;
  /** Peak gain of a neon-buzz swell. */
  buzz: number;
  /** Peak gain of a passing car. */
  cars: number;
};

// Rain only falls at night; the day street is busier.
const LEVELS: Record<TimeOfDay, Levels> = {
  night: { rain: 0.32, murmur: 0.55, traffic: 0.18, buzz: 0.4, cars: 1.4 },
  day: { rain: 0, murmur: 1, traffic: 0.25, buzz: 0.25, cars: 1.8 },
};

const MASTER_GAIN = 0.5;
const FADE_IN_SECONDS = 1.8;
const FADE_OUT_SECONDS = 0.6;
// Night/day crossfades settle in about two seconds, with the visual time-lapse.
const TIMELAPSE_TIME_CONSTANT = 0.6;

const NOISE_SECONDS = 4;
const LOOP_BLEND_SECONDS = 0.05;

const between = (min: number, max: number) => min + Math.random() * (max - min);

const readTimeOfDay = (): TimeOfDay => (
  document.documentElement.getAttribute('data-theme') === 'light' ? 'day' : 'night'
);

/** Noise that loops without a click: the extra tail is crossfaded into the head. */
const createNoiseBuffer = (ctx: BaseAudioContext, channels: number, color: 'white' | 'brown'): AudioBuffer => {
  const { sampleRate } = ctx;
  const length = Math.floor(sampleRate * NOISE_SECONDS);
  const blend = Math.floor(sampleRate * LOOP_BLEND_SECONDS);
  const buffer = ctx.createBuffer(channels, length, sampleRate);

  for (let channel = 0; channel < channels; channel += 1) {
    const raw = new Float32Array(length + blend);
    let brown = 0;

    for (let i = 0; i < raw.length; i += 1) {
      const white = Math.random() * 2 - 1;
      if (color === 'white') {
        raw[i] = white;
      } else {
        // Integrated white noise: a deep, soft rumble.
        brown = (brown + 0.02 * white) / 1.02;
        raw[i] = brown * 3.5;
      }
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

/** Pans a node when the browser supports it; otherwise passes it through. */
const pan = (ctx: BaseAudioContext, input: AudioNode, from: number, to?: number, duration = 0): AudioNode => {
  if (typeof ctx.createStereoPanner !== 'function') {
    return input;
  }

  const panner = ctx.createStereoPanner();
  panner.pan.setValueAtTime(from, ctx.currentTime);
  if (to !== undefined) {
    panner.pan.linearRampToValueAtTime(to, ctx.currentTime + duration);
  }
  input.connect(panner);
  return panner;
};

export const createAmbience = (ctx: BaseAudioContext): Ambience => {
  const master = createGain(ctx, 0);
  master.connect(ctx.destination);

  const rainNoise = createNoiseBuffer(ctx, 2, 'white');
  const sources: AudioScheduledSourceNode[] = [];

  // Rain: a bright stereo hiss that gusts on two slow, unrelated cycles.
  const rainLevel = createGain(ctx, 0);
  const gust = createGain(ctx, 0.7);
  const rain = ctx.createBufferSource();
  rain.buffer = rainNoise;
  rain.loop = true;
  rain
    .connect(createFilter(ctx, 'highpass', 900))
    .connect(createFilter(ctx, 'lowpass', 6500))
    .connect(gust)
    .connect(rainLevel)
    .connect(master);
  sources.push(rain, createLfo(ctx, 0.13, 0.18, gust.gain), createLfo(ctx, 0.047, 0.12, gust.gain));

  // Murmur: voices, vents, and engines blurred into a low rumble.
  const murmurLevel = createGain(ctx, 0);
  const murmur = ctx.createBufferSource();
  murmur.buffer = createNoiseBuffer(ctx, 1, 'brown');
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

  // Neon buzz: a 120Hz tube hum, silent until it swells.
  const buzzLevel = createGain(ctx, 0);
  const buzz = ctx.createOscillator();
  buzz.type = 'sawtooth';
  buzz.frequency.value = 120;
  buzz.connect(createFilter(ctx, 'bandpass', 1200, 1.2)).connect(buzzLevel);
  pan(ctx, buzzLevel, 0.35).connect(master);
  sources.push(buzz);

  sources.forEach((source) => source.start());

  const observer = typeof MutationObserver === 'undefined'
    ? null
    : new MutationObserver(() => applyLevels(false));
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let running = false;

  function applyLevels(immediate: boolean) {
    const levels = LEVELS[readTimeOfDay()];
    const now = ctx.currentTime;

    ([
      [rainLevel.gain, levels.rain],
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

  // A tube swells in, stutters once like it won't settle, then fades.
  const swellBuzz = () => {
    const peak = LEVELS[readTimeOfDay()].buzz;
    const param = buzzLevel.gain;
    const start = ctx.currentTime;
    const lit = start + 0.35;
    const hold = between(1.2, 3.2);
    const stutter = lit + between(0.2, hold - 0.4);

    param.cancelScheduledValues(start);
    param.setValueAtTime(0, start);
    param.linearRampToValueAtTime(peak, lit);
    param.setValueAtTime(peak, stutter);
    param.linearRampToValueAtTime(peak * 0.15, stutter + 0.04);
    param.linearRampToValueAtTime(peak, stutter + 0.12);
    param.setValueAtTime(peak, lit + hold);
    param.linearRampToValueAtTime(0, lit + hold + 0.9);
  };

  // Tyre hiss rising and falling in pitch as a car passes, panned across.
  const passCar = () => {
    const peak = LEVELS[readTimeOfDay()].cars;
    const start = ctx.currentTime;
    const duration = between(2.6, 4.2);
    const fromLeft = Math.random() < 0.5;

    const source = ctx.createBufferSource();
    source.buffer = rainNoise;
    source.loop = true;

    const band = createFilter(ctx, 'bandpass', 380, 1.6);
    band.frequency.setValueAtTime(380, start);
    band.frequency.linearRampToValueAtTime(820, start + duration * 0.5);
    band.frequency.linearRampToValueAtTime(300, start + duration);

    const envelope = createGain(ctx, 0);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(peak, start + duration * 0.5);
    envelope.gain.linearRampToValueAtTime(0, start + duration);

    source.connect(band).connect(envelope);
    const output = pan(ctx, envelope, fromLeft ? -0.85 : 0.85, fromLeft ? 0.85 : -0.85, duration);
    output.connect(master);
    source.addEventListener('ended', () => output.disconnect());
    source.start(start, between(0, NOISE_SECONDS));
    source.stop(start + duration + 0.05);
  };

  /** Repeats an event at random intervals while the city is audible. */
  const every = (minSeconds: number, maxSeconds: number, event: () => void) => {
    const queue = () => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (!running) {
          return;
        }
        // A suspended context would bunch scheduled events up; skip instead.
        if (ctx.state === 'running') {
          event();
        }
        queue();
      }, between(minSeconds, maxSeconds) * 1000);
      timers.add(timer);
    };
    queue();
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
      every(7, 16, swellBuzz);
      every(5, 13, passCar);
    },
    stop: () => {
      if (running) {
        running = false;
        observer?.disconnect();
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
        fadeMaster(0, FADE_OUT_SECONDS);
      }
      return (FADE_OUT_SECONDS + 0.1) * 1000;
    },
  };
};
