import { createAmbience } from '../src/lib/city/ambience';
import * as streetSounds from '../src/lib/city/streetSounds';
import { FakeAudioContext } from '../src/test/fakeAudioContext';

jest.mock('../src/lib/city/streetSounds', () => {
  const actual = jest.requireActual('../src/lib/city/streetSounds');
  // Each sound reports a fixed length, so the schedule can be checked.
  const sound = (seconds: number) => jest.fn(() => seconds);
  return {
    ...actual,
    createTalker: jest.fn(() => ({ speak: jest.fn((when: number) => when + 2) })),
    traffic: sound(5),
    horns: sound(1),
    birds: sound(1),
    lateCar: sound(5),
    gust: sound(8),
    crickets: sound(10),
    siren: sound(18),
    helicopter: sound(25),
    train: sound(16),
  };
});

const DAY_SOUNDS = [streetSounds.traffic, streetSounds.horns, streetSounds.birds].map((sound) => jest.mocked(sound));
const NIGHT_SOUNDS = [
  streetSounds.lateCar,
  streetSounds.gust,
  streetSounds.crickets,
  streetSounds.siren,
  streetSounds.helicopter,
  streetSounds.train,
].map((sound) => jest.mocked(sound));
const SOLO_SOUNDS = [streetSounds.siren, streetSounds.helicopter, streetSounds.train].map((sound) => jest.mocked(sound));

const TICK_SECONDS = 0.4;

const setTimeOfDay = (time: 'day' | 'night') => {
  document.documentElement.setAttribute('data-theme', time === 'day' ? 'light' : 'dark');
};

/** Lets audio time and the scheduler's timer run together. */
const run = (ctx: FakeAudioContext, seconds: number) => {
  for (let elapsed = 0; elapsed < seconds; elapsed += TICK_SECONDS) {
    ctx.currentTime += TICK_SECONDS;
    jest.advanceTimersByTime(TICK_SECONDS * 1000);
  }
};

const playCount = () => [...DAY_SOUNDS, ...NIGHT_SOUNDS].reduce((count, sound) => count + sound.mock.calls.length, 0);

const speakers = () => jest.mocked(streetSounds.createTalker).mock.results
  .map((result) => jest.mocked((result.value as streetSounds.Talker).speak));

const start = () => {
  const ctx = new FakeAudioContext();
  const ambience = createAmbience(ctx.asContext());
  ambience.start();
  return { ctx, ambience };
};

describe('city ambience', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    document.documentElement.removeAttribute('data-theme');
  });

  it('fills the day with traffic, horns, and birds, and nothing from the night', () => {
    setTimeOfDay('day');
    const { ctx } = start();

    run(ctx, 60);

    DAY_SOUNDS.forEach((sound) => expect(sound).toHaveBeenCalled());
    NIGHT_SOUNDS.forEach((sound) => expect(sound).not.toHaveBeenCalled());
  });

  it('thins the night to wind, crickets, a late car, and far-off sirens, a helicopter, and a train', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    setTimeOfDay('night');
    const { ctx } = start();

    run(ctx, 300);

    NIGHT_SOUNDS.forEach((sound) => expect(sound).toHaveBeenCalled());
    DAY_SOUNDS.forEach((sound) => expect(sound).not.toHaveBeenCalled());
  });

  it('never lets the siren, helicopter, and train overlap', () => {
    setTimeOfDay('night');
    const { ctx } = start();

    run(ctx, 1800);

    const plays = SOLO_SOUNDS.flatMap((sound) => sound.mock.calls.map(([, when], index) => [
      when,
      when + (sound.mock.results[index].value as number),
    ]))
      .sort(([a], [b]) => a - b);

    expect(plays.length).toBeGreaterThan(3);
    plays.slice(1).forEach(([startsAt], index) => {
      expect(startsAt).toBeGreaterThanOrEqual(plays[index][1]);
    });
  });

  it('switches to the new time of day after a short pause instead of all at once', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    setTimeOfDay('night');
    const { ctx } = start();
    run(ctx, 120);
    const nightPlays = NIGHT_SOUNDS.map((sound) => sound.mock.calls.length);
    const switchedAt = ctx.currentTime;

    setTimeOfDay('day');
    run(ctx, 120);

    expect(NIGHT_SOUNDS.map((sound) => sound.mock.calls.length)).toEqual(nightPlays);
    const [, firstCar] = jest.mocked(streetSounds.traffic).mock.calls[0];
    expect(firstCar).toBeGreaterThan(switchedAt + 0.5);
  });

  it('has nobody talking by day and two people at night', () => {
    setTimeOfDay('day');
    const day = start();
    run(day.ctx, 60);

    expect(speakers().filter((speak) => speak.mock.calls.length > 0)).toHaveLength(0);

    day.ambience.stop();
    jest.clearAllMocks();
    setTimeOfDay('night');
    const night = start();
    run(night.ctx, 30);

    expect(speakers().filter((speak) => speak.mock.calls.length > 0)).toHaveLength(2);
  });

  it('lets the night voices go quiet when the day comes', () => {
    setTimeOfDay('night');
    const { ctx } = start();
    run(ctx, 30);
    const phrases = () => speakers().reduce((count, speak) => count + speak.mock.calls.length, 0);
    const before = phrases();

    setTimeOfDay('day');
    run(ctx, 60);

    expect(phrases()).toBe(before);
  });

  it('stops booking sounds once muted and reports when it falls silent', () => {
    setTimeOfDay('night');
    const { ctx, ambience } = start();
    run(ctx, 30);

    expect(ambience.stop()).toBe(700);
    const plays = playCount();
    const phrases = speakers().reduce((count, speak) => count + speak.mock.calls.length, 0);
    run(ctx, 60);

    expect(playCount()).toBe(plays);
    expect(speakers().reduce((count, speak) => count + speak.mock.calls.length, 0)).toBe(phrases);
  });

  it('waits out a suspended context instead of bunching sounds up', () => {
    setTimeOfDay('day');
    const ctx = new FakeAudioContext();
    ctx.state = 'suspended';
    createAmbience(ctx.asContext()).start();

    // A suspended context's clock stands still.
    jest.advanceTimersByTime(30_000);

    expect(playCount()).toBe(0);
    expect(speakers().every((speak) => speak.mock.calls.length === 0)).toBe(true);

    ctx.state = 'running';
    run(ctx, 10);

    expect(streetSounds.traffic).toHaveBeenCalled();
  });
});
