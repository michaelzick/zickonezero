/**
 * The city's passing sounds, synthesized with Web Audio: traffic, horns, and
 * birds by day; sirens, a helicopter, wind, crickets, and a train at night;
 * and the voices that blur into the crowd. ./ambience decides when each plays.
 *
 * Every sound is placed somewhere down the street: the farther away, the
 * quieter and duller it is, and the more of it arrives as echo off the
 * buildings. That distance is what keeps them subtle. Each sound unplugs
 * itself once it ends.
 */

export type Street = {
  ctx: BaseAudioContext;
  /** Looping brown noise for tyres, wind, rotors, and rails. */
  noise: AudioBuffer;
  /** Straight to the listener. */
  out: AudioNode;
  /** The echo off the buildings. */
  echo: AudioNode;
};

/** Plays a sound from `when` (audio time) and returns how many seconds it lasts. */
export type StreetSound = (street: Street, when: number) => number;

// Levels, metered (K-weighted, momentary) against the beds in ./ambience: each
// sound peaks about 7 to 14 LU under them, so it reads as a detail of the
// street, not an alert.
const LEVELS = {
  car: 1.35,
  horn: 0.27,
  bird: 0.17,
  siren: 0.15,
  helicopter: 3.6,
  gust: 1.4,
  cricket: 0.11,
  train: 0.63,
} as const;

const NOISE_SECONDS = 8;
const LOOP_BLEND_SECONDS = 0.05;
const ECHO_SECONDS = 2.4;
const ECHO_PREDELAY_SECONDS = 0.015;
const CURVE_POINTS = 96;
const SPEED_OF_SOUND = 343;

export const between = (min: number, max: number): number => min + Math.random() * (max - min);

const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const chance = (probability: number): boolean => Math.random() < probability;

const side = (): 1 | -1 => (chance(0.5) ? 1 : -1);

export const createGain = (ctx: BaseAudioContext, value: number): GainNode => {
  const node = ctx.createGain();
  node.gain.value = value;
  return node;
};

export const createFilter = (ctx: BaseAudioContext, type: BiquadFilterType, frequency: number, q = Math.SQRT1_2): BiquadFilterNode => {
  const node = ctx.createBiquadFilter();
  node.type = type;
  node.frequency.value = frequency;
  node.Q.value = q;
  return node;
};

/** Brown noise that loops without a click: the extra tail is crossfaded into the head. */
const createBrownNoise = (ctx: BaseAudioContext): AudioBuffer => {
  const { sampleRate } = ctx;
  const length = Math.floor(sampleRate * NOISE_SECONDS);
  const blend = Math.floor(sampleRate * LOOP_BLEND_SECONDS);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const raw = new Float32Array(length + blend);
  let brown = 0;

  for (let i = 0; i < raw.length; i += 1) {
    // Integrated white noise: a deep, soft rumble.
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.02 * white) / 1.02;
    raw[i] = brown * 3.5;
  }

  const data = buffer.getChannelData(0);
  data.set(raw.subarray(0, length));
  for (let i = 0; i < blend; i += 1) {
    const t = i / blend;
    data[i] = raw[i] * t + raw[length + i] * (1 - t);
  }

  return buffer;
};

/** A street's worth of echo: decaying noise that darkens as it fades. */
const createEchoImpulse = (ctx: BaseAudioContext): AudioBuffer => {
  const { sampleRate } = ctx;
  const length = Math.floor(sampleRate * ECHO_SECONDS);
  const predelay = Math.floor(sampleRate * ECHO_PREDELAY_SECONDS);
  const buffer = ctx.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    let smoothed = 0;
    for (let i = predelay; i < length; i += 1) {
      const t = (i - predelay) / (length - predelay);
      // Brick and glass soak up the highs first.
      smoothed += ((Math.random() * 2 - 1) - smoothed) * (0.85 - 0.8 * t);
      data[i] = smoothed * (1 - t) ** 3;
    }
  }

  return buffer;
};

/** The shared pieces every street sound plays through. */
export const createStreet = (ctx: BaseAudioContext, out: AudioNode): Street => {
  const echo = ctx.createConvolver();
  echo.buffer = createEchoImpulse(ctx);
  echo.connect(out);
  return { ctx, noise: createBrownNoise(ctx), out, echo };
};

const createNoise = (street: Street): AudioBufferSourceNode => {
  const source = street.ctx.createBufferSource();
  source.buffer = street.noise;
  source.loop = true;
  return source;
};

/** Starts a noise source somewhere random in the loop, so no two sound alike. */
const startNoise = (source: AudioBufferSourceNode, when: number, end: number) => {
  source.start(when, between(0, NOISE_SECONDS));
  source.stop(end);
};

/** Samples `shape` across 0..1 into an automation curve. */
const curve = (shape: (t: number) => number): Float32Array => {
  const values = new Float32Array(CURVE_POINTS);
  for (let i = 0; i < CURVE_POINTS; i += 1) {
    values[i] = shape(i / (CURVE_POINTS - 1));
  }
  return values;
};

/** Eases in over the first `edge` of a sound and out over the last, so nothing clicks. */
const fade = (t: number, edge = 0.18): number => {
  const ramp = Math.max(0, Math.min(1, t / edge, (1 - t) / edge));
  return ramp * ramp * (3 - 2 * ramp);
};

type Pass = {
  /** Loudness from 0 to 1, peaking as the source is nearest. */
  gain: Float32Array;
  /** Stereo position as it crosses from one side to the other. */
  pan: Float32Array;
  /** The Doppler pitch ratio: above 1 coming, below 1 going. */
  pitch: Float32Array;
};

/** Something passing the listener at `closest` metres while moving at `speed` m/s. */
const pass = (closest: number, speed: number, seconds: number, direction: 1 | -1): Pass => {
  const gain = new Float32Array(CURVE_POINTS);
  const pan = new Float32Array(CURVE_POINTS);
  const pitch = new Float32Array(CURVE_POINTS);

  for (let i = 0; i < CURVE_POINTS; i += 1) {
    const t = i / (CURVE_POINTS - 1);
    const along = speed * seconds * (t - 0.5);
    const range = Math.hypot(closest, along);
    // Negative while approaching, positive while leaving.
    const heading = along / range;
    gain[i] = (closest / range) * fade(t);
    pan[i] = direction * 0.85 * heading;
    pitch[i] = SPEED_OF_SOUND / (SPEED_OF_SOUND + speed * heading);
  }

  return { gain, pan, pitch };
};

type Placement = {
  /** -1 (left) to 1 (right), or a curve to sweep across the sound's length. */
  pan: number | Float32Array;
  /** 0 is the corner, 1 is blocks away. */
  distance: number;
};

/**
 * Returns the input of a path to the listener from somewhere on the street,
 * which unplugs itself once `last`, the sound's longest-running source, ends.
 */
const place = (
  street: Street,
  { pan, distance }: Placement,
  when: number,
  seconds: number,
  last: AudioScheduledSourceNode,
): AudioNode => {
  const { ctx } = street;
  const input = createFilter(ctx, 'lowpass', 9000 - 7000 * distance ** 1.5);
  const dry = createGain(ctx, 1 - 0.7 * distance);
  const echo = createGain(ctx, 0.15 + 0.55 * distance);
  let output: AudioNode = input;

  if (typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    if (typeof pan === 'number') {
      panner.pan.value = pan;
    } else {
      panner.pan.setValueCurveAtTime(pan, when, seconds);
    }
    output = input.connect(panner);
  }

  output.connect(dry).connect(street.out);
  output.connect(echo).connect(street.echo);
  last.addEventListener('ended', () => {
    dry.disconnect();
    echo.disconnect();
  });
  return input;
};

type Vehicle = {
  /** Engine firing rate, in Hz. */
  engine: readonly [number, number];
  /** How much engine there is against the tyre roar. */
  growl: number;
  /** Where the tyre roar centres, in Hz. */
  roar: number;
  /** Metres per second. */
  speed: readonly [number, number];
  seconds: readonly [number, number];
};

const CAR: Vehicle = { engine: [42, 62], growl: 0.06, roar: 700, speed: [10, 15], seconds: [4.5, 7] };
const TRUCK: Vehicle = { engine: [27, 34], growl: 0.14, roar: 450, speed: [7, 10], seconds: [7, 10] };
const SCOOTER: Vehicle = { engine: [85, 120], growl: 0.1, roar: 1000, speed: [9, 13], seconds: [4, 6] };

/** A vehicle driving past: tyre roar over the engine, louder and brighter as it nears. */
const driveBy = (street: Street, when: number, vehicle: Vehicle, distance: number, level: number): number => {
  const { ctx } = street;
  const seconds = between(...vehicle.seconds);
  const { gain, pan, pitch } = pass(4 + 40 * distance ** 2, between(...vehicle.speed), seconds, side());
  const end = when + seconds;
  const rpm = between(...vehicle.engine);

  const tyres = createNoise(street);
  tyres.playbackRate.setValueCurveAtTime(pitch, when, seconds);
  const engine = ctx.createOscillator();
  engine.type = 'sawtooth';
  engine.frequency.setValueCurveAtTime(pitch.map((ratio) => ratio * rpm), when, seconds);

  const body = createGain(ctx, 0);
  body.gain.setValueCurveAtTime(gain.map((value) => value * level), when, seconds);
  const brightness = createFilter(ctx, 'lowpass', 400);
  brightness.frequency.setValueCurveAtTime(gain.map((value) => 350 + 2400 * value), when, seconds);

  tyres
    .connect(createFilter(ctx, 'bandpass', vehicle.roar, 0.6))
    // Brown noise is mostly rumble; tyres hiss higher up.
    .connect(createFilter(ctx, 'highpass', 180))
    .connect(body);
  engine.connect(createFilter(ctx, 'lowpass', 300)).connect(createGain(ctx, vehicle.growl)).connect(body);
  body.connect(brightness).connect(place(street, { pan, distance }, when, seconds, engine));

  startNoise(tyres, when, end);
  engine.start(when);
  engine.stop(end);
  return seconds;
};

/** Daytime traffic: mostly cars, now and then a truck or a scooter. */
export const traffic: StreetSound = (street, when) => {
  const roll = Math.random();
  const vehicle = roll < 0.15 ? TRUCK : roll < 0.27 ? SCOOTER : CAR;
  return driveBy(street, when, vehicle, between(0.25, 0.65), LEVELS.car);
};

/** A late car a few blocks over. */
export const lateCar: StreetSound = (street, when) => (
  driveBy(street, when, CAR, between(0.7, 0.95), LEVELS.car * 0.6)
);

// Taps as [start, length] in seconds.
const HORN_PATTERNS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [[0, 0.16]],
  [[0, 0.11], [0.2, 0.13]],
  [[0, 0.5]],
  [[0, 0.09], [0.17, 0.09], [0.34, 0.3]],
];

/** A car horn down the block: a pair of buzzy tones, tapped or leaned on. */
const honk = (street: Street, when: number, distance: number): number => {
  const { ctx } = street;
  const pitch = between(360, 470);
  const tempo = between(0.85, 1.25);
  const taps = pick(HORN_PATTERNS);
  const [lastStart, lastLength] = taps[taps.length - 1];
  const seconds = (lastStart + lastLength) * tempo + 0.3;
  const end = when + seconds;
  // Most cars pair two horns a third apart; small ones have a single, higher horn.
  const tones = chance(0.75) ? [pitch, pitch * 1.26] : [pitch * 1.15];
  const press = createGain(ctx, 0);

  const horns = tones.map((frequency) => {
    const horn = ctx.createOscillator();
    horn.type = 'square';
    taps.forEach(([start]) => {
      // The diaphragm sags flat for a moment before it sings.
      horn.frequency.setValueAtTime(frequency * 0.96, when + start * tempo);
      horn.frequency.setTargetAtTime(frequency, when + start * tempo, 0.02);
    });
    horn.connect(press);
    horn.start(when);
    horn.stop(end);
    return horn;
  });

  taps.forEach(([start, length]) => {
    press.gain.setTargetAtTime(LEVELS.horn / tones.length, when + start * tempo, 0.006);
    press.gain.setTargetAtTime(0, when + (start + length) * tempo, 0.02);
  });

  press
    .connect(createFilter(ctx, 'lowpass', 2000))
    .connect(place(street, { pan: between(-0.8, 0.8), distance }, when, seconds, horns[0]));
  return seconds;
};

/** A horn, and sometimes another driver answering it. */
export const horns: StreetSound = (street, when) => {
  const seconds = honk(street, when, between(0.45, 0.85));
  if (!chance(0.3)) {
    return seconds;
  }
  const reply = between(0.6, 1.8);
  return Math.max(seconds, reply + honk(street, when + reply, between(0.5, 0.9)));
};

// Notes as [start, length, from Hz, to Hz].
type Note = readonly [number, number, number, number];

/** Sparrow-like chirps, each a quick sweep. */
const chirps = (): Note[] => {
  const pitch = between(3200, 4600);
  const falling = chance(0.7);
  const notes: Note[] = [];
  let t = 0;
  for (let count = Math.round(between(3, 7)); count > 0; count -= 1) {
    const length = between(0.05, 0.09);
    const high = pitch * between(1.15, 1.35);
    const low = pitch * between(0.75, 0.9);
    notes.push(falling ? [t, length, high, low] : [t, length, low, high]);
    t += length + between(0.06, 0.16);
  }
  return notes;
};

/** A fast, slightly falling trill. */
const trill = (): Note[] => {
  let pitch = between(3800, 5200);
  const notes: Note[] = [];
  let t = 0;
  for (let count = Math.round(between(8, 16)); count > 0; count -= 1) {
    const length = between(0.022, 0.03);
    notes.push([t, length, pitch * 1.08, pitch * 0.92]);
    t += length + 0.03;
    pitch *= 0.985;
  }
  return notes;
};

/** A few slow whistled notes that glide. */
const whistle = (): Note[] => {
  const notes: Note[] = [];
  let t = 0;
  for (let count = Math.round(between(2, 4)); count > 0; count -= 1) {
    const length = between(0.14, 0.3);
    const pitch = between(2000, 3200);
    notes.push([t, length, pitch, pitch * between(0.8, 1.25)]);
    t += length + between(0.08, 0.2);
  }
  return notes;
};

const SONGS = [chirps, chirps, trill, whistle] as const;

/** A small bird on a ledge or a wire. */
const sing = (street: Street, when: number, pan: number): number => {
  const { ctx } = street;
  const notes = pick(SONGS)();
  const [lastStart, lastLength] = notes[notes.length - 1];
  const seconds = lastStart + lastLength + 0.05;
  // Nearly a pure tone, with a trace of the octave.
  const bird = ctx.createOscillator();
  bird.setPeriodicWave(ctx.createPeriodicWave(new Float32Array([0, 0, 0]), new Float32Array([0, 1, 0.08])));
  const voice = createGain(ctx, 0);

  notes.forEach(([start, length, from, to]) => {
    const t = when + start;
    bird.frequency.setValueAtTime(from, t);
    bird.frequency.exponentialRampToValueAtTime(to, t + length);
    voice.gain.setValueAtTime(0, t);
    voice.gain.linearRampToValueAtTime(LEVELS.bird, t + Math.min(0.012, length / 3));
    voice.gain.linearRampToValueAtTime(0, t + length);
  });

  bird.connect(voice).connect(place(street, { pan, distance: between(0.3, 0.6) }, when, seconds, bird));
  bird.start(when);
  bird.stop(when + seconds);
  return seconds;
};

/** A bird, and sometimes another answering from across the street. */
export const birds: StreetSound = (street, when) => {
  const pan = between(0.3, 0.8) * side();
  const seconds = sing(street, when, pan);
  if (!chance(0.35)) {
    return seconds;
  }
  const reply = seconds + between(0.3, 1.2);
  return reply + sing(street, when + reply, -pan * between(0.5, 1));
};

/** An emergency siren across town, wailing (and sometimes yelping) as it passes. */
export const siren: StreetSound = (street, when) => {
  const { ctx } = street;
  const seconds = between(15, 22);
  const { gain, pan, pitch } = pass(between(150, 300), between(14, 22), seconds, side());
  const end = when + seconds;
  const low = between(640, 720);
  const high = low * between(1.85, 2.05);
  const yelpFrom = chance(0.4) ? when + seconds * between(0.35, 0.5) : Infinity;
  const yelpUntil = yelpFrom + between(3, 5);

  const wail = ctx.createOscillator();
  wail.type = 'triangle';
  wail.frequency.setValueAtTime(low, when);
  for (let t = when; t < end;) {
    const yelping = t >= yelpFrom && t < yelpUntil;
    const rise = yelping ? 0.16 : between(1.6, 2.1);
    const fall = yelping ? 0.16 : between(2.2, 2.8);
    wail.frequency.linearRampToValueAtTime(high, t + rise);
    wail.frequency.linearRampToValueAtTime(low, t + rise + fall);
    t += rise + fall;
  }
  wail.detune.setValueCurveAtTime(pitch.map((ratio) => 1200 * Math.log2(ratio)), when, seconds);

  const level = createGain(ctx, 0);
  level.gain.setValueCurveAtTime(gain.map((value) => value * LEVELS.siren), when, seconds);
  wail
    .connect(createFilter(ctx, 'lowpass', 1600))
    .connect(level)
    .connect(place(street, { pan, distance: 0.9 }, when, seconds, wail));

  wail.start(when);
  wail.stop(end);
  return seconds;
};

/** Turns a rising sawtooth into a sharp beat that dies away: each blade's slap. */
const createBladeShaper = (ctx: BaseAudioContext): WaveShaperNode => {
  const shaper = ctx.createWaveShaper();
  const values = new Float32Array(256);
  for (let i = 0; i < values.length; i += 1) {
    values[i] = (1 - i / (values.length - 1)) ** 4;
  }
  shaper.curve = values;
  return shaper;
};

/** A helicopter crossing the sky a few blocks away. */
export const helicopter: StreetSound = (street, when) => {
  const { ctx } = street;
  const seconds = between(22, 32);
  const { gain, pan, pitch } = pass(between(120, 220), between(30, 45), seconds, side());
  const end = when + seconds;
  const bladeRate = between(9, 12);

  const rotor = ctx.createOscillator();
  rotor.type = 'sawtooth';
  rotor.frequency.setValueCurveAtTime(pitch.map((ratio) => ratio * bladeRate), when, seconds);
  // Air, chopped by the blades.
  const blades = createGain(ctx, 0);
  rotor.connect(createBladeShaper(ctx)).connect(blades.gain);
  const air = createNoise(street);
  air.playbackRate.setValueCurveAtTime(pitch, when, seconds);
  air.connect(createFilter(ctx, 'bandpass', 200, 0.8)).connect(blades);

  const level = createGain(ctx, 0);
  level.gain.setValueCurveAtTime(gain.map((value) => value * LEVELS.helicopter), when, seconds);
  blades.connect(level).connect(place(street, { pan, distance: 0.85 }, when, seconds, air));

  rotor.start(when);
  rotor.stop(end);
  startNoise(air, when, end);
  return seconds;
};

/** A gust funnelling down the street, with a faint whistle round a corner. */
export const gust: StreetSound = (street, when) => {
  const { ctx } = street;
  const seconds = between(7, 12);
  const end = when + seconds;
  const flutter = Math.random() * Math.PI * 2;
  const strength = curve((t) => Math.sin(Math.PI * t) ** 1.6 * (1 + 0.3 * Math.sin(4.4 * Math.PI * t + flutter)) / 1.3);
  const corner = between(650, 1000);
  const drift = between(0.2, 0.6) * side();

  const air = createNoise(street);
  const rush = createFilter(ctx, 'bandpass', 300, 0.9);
  rush.frequency.setValueCurveAtTime(strength.map((value) => 220 + 520 * value), when, seconds);
  const whistling = createFilter(ctx, 'bandpass', corner, 12);
  whistling.frequency.setValueCurveAtTime(strength.map((value) => corner * (0.85 + 0.3 * value)), when, seconds);

  const level = createGain(ctx, 0);
  level.gain.setValueCurveAtTime(strength.map((value) => value * LEVELS.gust), when, seconds);
  air.connect(rush).connect(level);
  air.connect(whistling).connect(createGain(ctx, 0.5)).connect(level);
  level.connect(place(street, { pan: curve((t) => drift * (2 * t - 1)), distance: 0.45 }, when, seconds, air));

  startNoise(air, when, end);
  return seconds;
};

/** A cricket or two in a planter, chirping for a while and then stopping. */
export const crickets: StreetSound = (street, when) => {
  const { ctx } = street;
  const seconds = between(8, 14);
  const end = when + seconds;

  for (let count = chance(0.4) ? 2 : 1; count > 0; count -= 1) {
    const cricket = ctx.createOscillator();
    cricket.frequency.value = between(4300, 4900);
    const chirp = createGain(ctx, 0);
    const period = between(0.42, 0.7);
    const pulses = pick([2, 3, 3, 4]);

    for (let t = when + between(0, period); t < end - period; t += period * between(0.95, 1.05)) {
      const swell = LEVELS.cricket * fade((t - when) / seconds, 0.15);
      for (let pulse = 0; pulse < pulses; pulse += 1) {
        const start = t + pulse * 0.028;
        chirp.gain.setTargetAtTime(swell, start, 0.002);
        chirp.gain.setTargetAtTime(0, start + 0.014, 0.003);
      }
    }

    cricket
      .connect(chirp)
      .connect(place(street, { pan: between(-0.7, 0.7), distance: between(0.4, 0.65) }, when, seconds, cricket));
    cricket.start(when);
    cricket.stop(end);
  }

  return seconds;
};

/** An elevated train crossing town: a low rumble and the da-dum of rail joints. */
export const train: StreetSound = (street, when) => {
  const { ctx } = street;
  const seconds = between(14, 20);
  const speed = between(12, 18);
  const { gain, pan } = pass(between(160, 260), speed, seconds, side());
  const end = when + seconds;

  const level = createGain(ctx, 0);
  level.gain.setValueCurveAtTime(gain.map((value) => value * LEVELS.train), when, seconds);
  const rumble = createNoise(street);
  rumble.connect(createFilter(ctx, 'lowpass', 160)).connect(level);

  const rails = createNoise(street);
  const joints = createGain(ctx, 0);
  rails.connect(createFilter(ctx, 'bandpass', 300, 1.1)).connect(joints).connect(createGain(ctx, 3)).connect(level);
  // Each bogie's two axles cross a joint in turn, once per car.
  const axles = 2.6 / speed;
  const car = 18 / speed;
  for (let t = when + 0.3; t < end - 0.5; t += car) {
    [t, t + axles].forEach((hit) => {
      joints.gain.setTargetAtTime(1, hit, 0.003);
      joints.gain.setTargetAtTime(0, hit + 0.025, 0.035);
    });
  }

  level.connect(place(street, { pan, distance: 0.85 }, when, seconds, rumble));
  startNoise(rumble, when, end);
  startNoise(rails, when, end);
  return seconds;
};

// The first two formants of a handful of vowels, in Hz.
const VOWELS: ReadonlyArray<readonly [number, number]> = [
  [730, 1090],
  [530, 1840],
  [300, 2250],
  [570, 840],
  [320, 920],
  [500, 1500],
  [660, 1720],
];

export type Talker = {
  /** Says a phrase from `when` and returns the time it ends. */
  speak: (when: number) => number;
};

/**
 * Someone out on the street: a voice through two moving resonances, talking
 * in phrases. Too far off to make out, a few of them make a crowd.
 */
export const createTalker = (ctx: BaseAudioContext, out: AudioNode): Talker => {
  const higher = chance(0.5);
  const pitch = higher ? between(175, 235) : between(95, 135);
  // A shorter vocal tract raises the formants.
  const size = higher ? 1.15 : 1;
  const loudness = between(0.35, 1);

  const voice = ctx.createOscillator();
  voice.type = 'sawtooth';
  voice.frequency.value = pitch;
  const first = createFilter(ctx, 'bandpass', 500, 6);
  const second = createFilter(ctx, 'bandpass', 1500, 9);
  const mouth = createGain(ctx, 0);
  voice.connect(first).connect(mouth);
  voice.connect(second).connect(createGain(ctx, 0.6)).connect(mouth);

  let output: AudioNode = mouth;
  if (typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    panner.pan.value = between(-0.8, 0.8);
    output = mouth.connect(panner);
  }
  output.connect(out);
  voice.start();

  return {
    speak: (when) => {
      const syllables = Math.round(between(2, 11));
      const asking = chance(0.2);
      let t = when;

      for (let i = 0; i < syllables; i += 1) {
        const progress = i / syllables;
        const final = i === syllables - 1;
        const length = between(0.09, 0.22) * (final ? 1.5 : 1);
        // Statements drift down; questions lift at the end.
        const contour = asking && progress > 0.7 ? 1 + progress - 0.7 : 1.1 - 0.2 * progress;
        const [f1, f2] = pick(VOWELS);

        voice.frequency.setTargetAtTime(pitch * contour * between(0.95, 1.05), t, 0.03);
        first.frequency.setTargetAtTime(f1 * size, t, 0.02);
        second.frequency.setTargetAtTime(f2 * size, t, 0.025);
        mouth.gain.setTargetAtTime(loudness * between(0.55, 1), t, 0.015);
        mouth.gain.setTargetAtTime(0, t + length * 0.8, 0.02);
        t += length + between(0.015, 0.06);
      }

      return t;
    },
  };
};
