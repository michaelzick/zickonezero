import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SoundToggle from '../src/components/hud/SoundToggle';

type SoundModule = typeof import('../src/lib/city/sound');

const mockAmbience = {
  start: jest.fn(),
  // The fade-out takes 600ms.
  stop: jest.fn(() => 600),
};
const mockCreateAmbience = jest.fn((context: unknown) => (context ? mockAmbience : null));

jest.mock('../src/lib/city/ambience', () => ({
  createAmbience: (context: unknown) => mockCreateAmbience(context),
}));

const contexts: MockAudioContext[] = [];

class MockAudioContext extends EventTarget {
  state: 'suspended' | 'running' | 'closed' = 'suspended';

  readonly options: unknown;

  constructor(options?: unknown) {
    super();
    this.options = options;
    contexts.push(this);
  }

  private setState(state: 'suspended' | 'running') {
    this.state = state;
    this.dispatchEvent(new Event('statechange'));
  }

  resume = jest.fn(() => {
    this.setState('running');
    return Promise.resolve();
  });

  suspend = jest.fn(() => {
    this.setState('suspended');
    return Promise.resolve();
  });
}

type AudioWindow = Window & { AudioContext?: unknown; webkitAudioContext?: unknown };

const audioWindow = window as AudioWindow;

/** A fresh copy of the store, as on a new page load. */
const loadSound = (): SoundModule => {
  let sound: SoundModule | undefined;
  jest.isolateModules(() => {
    sound = require('../src/lib/city/sound');
  });
  return sound as SoundModule;
};

// Lets the lazily imported ambience load and start.
const flushPromises = async () => {
  for (let i = 0; i < 5; i += 1) {
    await Promise.resolve();
  }
};

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event('visibilitychange'));
};

describe('city sound store', () => {
  let sound: SoundModule | undefined;

  beforeEach(() => {
    window.localStorage.clear();
    contexts.length = 0;
    jest.clearAllMocks();
    audioWindow.AudioContext = MockAudioContext;
  });

  afterEach(() => {
    // Mute, so a store left waiting for a gesture stops listening for one.
    sound?.setSoundEnabled(false);
    sound = undefined;
    jest.useRealTimers();
    jest.restoreAllMocks();
    delete audioWindow.AudioContext;
    delete audioWindow.webkitAudioContext;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  });

  it('reports no support and ignores toggles without Web Audio', () => {
    delete audioWindow.AudioContext;
    sound = loadSound();

    expect(sound.getSoundState()).toEqual({ supported: false, enabled: false, playing: false });

    sound.setSoundEnabled(true);

    expect(sound.getSoundState().enabled).toBe(false);
    expect(window.localStorage.getItem(sound.SOUND_STORAGE_KEY)).toBeNull();
  });

  it('finds the prefixed Safari constructor', () => {
    delete audioWindow.AudioContext;
    audioWindow.webkitAudioContext = MockAudioContext;
    sound = loadSound();

    expect(sound.getSoundState().supported).toBe(true);
  });

  it('starts muted and renders muted on the server', () => {
    sound = loadSound();

    expect(sound.getSoundState()).toEqual({ supported: true, enabled: false, playing: false });
    expect(sound.getServerSoundState()).toEqual({ supported: true, enabled: false, playing: false });
    expect(contexts).toHaveLength(0);
  });

  it('plays from a toggle, loads the ambience once, and remembers the choice', async () => {
    sound = loadSound();
    const listener = jest.fn();
    sound.subscribeToSound(listener);

    sound.setSoundEnabled(true);

    expect(window.localStorage.getItem(sound.SOUND_STORAGE_KEY)).toBe('on');
    expect(contexts).toHaveLength(1);
    expect(contexts[0].options).toEqual({ latencyHint: 'playback' });
    expect(contexts[0].resume).toHaveBeenCalled();
    expect(sound.getSoundState()).toEqual({ supported: true, enabled: true, playing: false });

    await flushPromises();

    expect(mockCreateAmbience).toHaveBeenCalledWith(contexts[0]);
    expect(mockAmbience.start).toHaveBeenCalledTimes(1);
    expect(sound.getSoundState().playing).toBe(true);
    expect(listener).toHaveBeenCalled();

    sound.setSoundEnabled(false);
    sound.setSoundEnabled(true);
    await flushPromises();

    expect(contexts).toHaveLength(1);
    expect(mockCreateAmbience).toHaveBeenCalledTimes(1);
    expect(mockAmbience.start).toHaveBeenCalledTimes(2);
  });

  it('fades out on mute and suspends once the fade ends', async () => {
    sound = loadSound();
    sound.setSoundEnabled(true);
    await flushPromises();

    jest.useFakeTimers();
    sound.setSoundEnabled(false);

    expect(window.localStorage.getItem(sound.SOUND_STORAGE_KEY)).toBe('off');
    expect(mockAmbience.stop).toHaveBeenCalledTimes(1);
    expect(sound.getSoundState()).toEqual({ supported: true, enabled: false, playing: false });
    expect(contexts[0].suspend).not.toHaveBeenCalled();

    jest.advanceTimersByTime(600);

    expect(contexts[0].suspend).toHaveBeenCalledTimes(1);
  });

  it('waits for a gesture before playing a remembered choice', async () => {
    window.localStorage.setItem('zickonezero-sound', 'on');
    sound = loadSound();
    const unsubscribe = sound.subscribeToSound(jest.fn());

    expect(sound.getSoundState()).toEqual({ supported: true, enabled: true, playing: false });
    expect(contexts).toHaveLength(0);

    // Escape and the toggle's own click do not count.
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const toggle = document.createElement('button');
    toggle.setAttribute('data-sound-toggle', '');
    document.body.appendChild(toggle);
    toggle.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(contexts).toHaveLength(0);

    document.body.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(contexts).toHaveLength(1);
    expect(contexts[0].resume).toHaveBeenCalled();

    await flushPromises();
    expect(sound.getSoundState().playing).toBe(true);

    // Playing disarms the gesture listener.
    document.body.dispatchEvent(new Event('pointerup', { bubbles: true }));
    expect(contexts[0].resume).toHaveBeenCalledTimes(1);

    toggle.remove();
    unsubscribe();
  });

  it('goes quiet in a hidden tab and resumes when it returns', async () => {
    sound = loadSound();
    sound.setSoundEnabled(true);
    await flushPromises();

    setHidden(true);
    expect(contexts[0].suspend).toHaveBeenCalledTimes(1);
    expect(sound.getSoundState().playing).toBe(false);

    setHidden(false);
    expect(contexts[0].resume).toHaveBeenCalledTimes(2);
    expect(sound.getSoundState().playing).toBe(true);
  });

  it('holds the city quiet for another instrument without changing the choice', async () => {
    sound = loadSound();
    sound.setSoundEnabled(true);
    await flushPromises();

    jest.useFakeTimers();
    sound.holdAmbience();

    expect(mockAmbience.stop).toHaveBeenCalledTimes(1);
    expect(sound.getSoundState()).toEqual({ supported: true, enabled: true, playing: false });
    expect(window.localStorage.getItem(sound.SOUND_STORAGE_KEY)).toBe('on');
    jest.advanceTimersByTime(600);
    expect(contexts[0].suspend).toHaveBeenCalledTimes(1);

    // Neither a gesture, a returning tab, nor the toggle wakes it while held.
    document.body.dispatchEvent(new Event('pointerup', { bubbles: true }));
    setHidden(false);
    sound.setSoundEnabled(true);
    await flushPromises();
    expect(contexts[0].resume).toHaveBeenCalledTimes(1);
    expect(mockAmbience.start).toHaveBeenCalledTimes(1);

    sound.releaseAmbience();
    await flushPromises();

    expect(contexts[0].resume).toHaveBeenCalledTimes(2);
    expect(mockAmbience.start).toHaveBeenCalledTimes(2);
    expect(sound.getSoundState().playing).toBe(true);
  });

  it('leaves a muted city alone when held and released', () => {
    sound = loadSound();

    sound.holdAmbience();
    sound.releaseAmbience();

    expect(contexts).toHaveLength(0);
    expect(sound.getSoundState()).toEqual({ supported: true, enabled: false, playing: false });
  });

  it('keeps the choice for the visit when storage is blocked', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    sound = loadSound();

    sound.setSoundEnabled(true);

    expect(sound.getSoundState().enabled).toBe(true);
  });
});

describe('SoundToggle with the sound store', () => {
  beforeAll(() => {
    window.localStorage.clear();
    audioWindow.AudioContext = MockAudioContext;
  });

  afterAll(() => {
    delete audioWindow.AudioContext;
  });

  it('turns the city on and off from the button', async () => {
    const user = userEvent.setup();
    render(<SoundToggle />);

    const toggle = screen.getByRole('button', { name: 'Ambient sound' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-playing', 'false');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(toggle).toHaveAttribute('data-playing', 'true'));
    expect(window.localStorage.getItem('zickonezero-sound')).toBe('on');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-playing', 'false');
    expect(window.localStorage.getItem('zickonezero-sound')).toBe('off');
  });
});
