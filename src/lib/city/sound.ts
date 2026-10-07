import type { Ambience } from './ambience';

/**
 * Opt-in ambient sound for the city. It is muted by default and the choice is
 * remembered, but audio only ever starts from a click, tap, or key press:
 * browsers block sound that starts on its own, and so should we.
 *
 * The state lives outside React, so the city keeps sounding while pages change
 * under the nav. The Web Audio graph (./ambience) loads the first time sound is
 * turned on, so it never weighs on the first page load.
 */

export const SOUND_STORAGE_KEY = 'zickonezero-sound';

export type SoundState = {
  /** False when the browser has no Web Audio; the toggle then hides. */
  supported: boolean;
  /** The visitor's choice. */
  enabled: boolean;
  /** True while the city is actually audible. */
  playing: boolean;
};

type AudioContextClass = typeof AudioContext;

// The static HTML shows the toggle; browsers without Web Audio drop it after
// hydration.
const SERVER_STATE: SoundState = { supported: true, enabled: false, playing: false };

// Activation-triggering events. A touch that turns into a scroll fires
// pointercancel instead of pointerup, so scrolling never starts audio.
const GESTURE_EVENTS = ['pointerup', 'keydown'] as const;

const listeners = new Set<() => void>();
let state: SoundState | null = null;
let context: AudioContext | null = null;
let ambience: Ambience | null = null;
let ambienceRequest: Promise<Ambience | null> | null = null;
let suspendTimer: ReturnType<typeof setTimeout> | undefined;
let armed = false;
// Another instrument (the Night Market's rack) has the floor; see holdAmbience.
let held = false;

const getAudioContextClass = (): AudioContextClass | undefined => (
  window.AudioContext ?? (window as Window & { webkitAudioContext?: AudioContextClass }).webkitAudioContext
);

const readStoredChoice = (): boolean => {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
};

const writeStoredChoice = (enabled: boolean) => {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Storage can be blocked (private mode); the choice still applies to this visit.
  }
};

const readState = (): SoundState => {
  if (!state) {
    const supported = Boolean(getAudioContextClass());
    state = { supported, enabled: supported && readStoredChoice(), playing: false };
  }
  return state;
};

const update = (changes: Partial<SoundState>) => {
  const current = readState();
  const next = { ...current, ...changes };
  if (next.enabled === current.enabled && next.playing === current.playing) {
    return;
  }
  state = next;
  listeners.forEach((listener) => listener());
};

const syncPlaying = () => {
  update({ playing: readState().enabled && !held && ambience !== null && context?.state === 'running' });
};

const clearSuspendTimer = () => {
  if (suspendTimer !== undefined) {
    clearTimeout(suspendTimer);
    suspendTimer = undefined;
  }
};

function handleGesture(event: Event) {
  if (event instanceof KeyboardEvent && event.key === 'Escape') {
    return;
  }
  // The toggle's own click decides for itself.
  if (event.target instanceof Element && event.target.closest('[data-sound-toggle]')) {
    return;
  }
  play();
}

/** Waits for the next gesture to start or resume the audio. */
function arm() {
  if (!armed) {
    armed = true;
    GESTURE_EVENTS.forEach((type) => document.addEventListener(type, handleGesture, true));
  }
}

function disarm() {
  if (armed) {
    armed = false;
    GESTURE_EVENTS.forEach((type) => document.removeEventListener(type, handleGesture, true));
  }
}

function handleStateChange() {
  if (context?.state === 'running') {
    disarm();
  } else if (readState().enabled && suspendTimer === undefined && !document.hidden && !held) {
    // Interrupted (a call, another app taking audio): resume on the next gesture.
    arm();
  }
  syncPlaying();
}

// A hidden tab goes quiet and lets the audio thread sleep.
function handleVisibilityChange() {
  if (!context || !ambience || !readState().enabled || held) {
    return;
  }

  if (document.hidden) {
    context.suspend().catch(() => undefined);
    return;
  }

  // Some browsers want a fresh gesture before resuming; stay ready for one.
  arm();
  context.resume().catch(() => undefined);
}

const getContext = (): AudioContext | null => {
  if (context) {
    return context;
  }

  const ContextClass = getAudioContextClass();
  if (!ContextClass) {
    return null;
  }

  try {
    context = new ContextClass({ latencyHint: 'playback' });
  } catch {
    return null;
  }

  context.addEventListener('statechange', handleStateChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return context;
};

const loadAmbience = (audio: AudioContext): Promise<Ambience | null> => {
  ambienceRequest ??= import('./ambience')
    .then(({ createAmbience }) => {
      ambience = createAmbience(audio);
      return ambience;
    })
    .catch(() => {
      // A failed chunk load (offline) can be retried by the next toggle.
      ambienceRequest = null;
      return null;
    });
  return ambienceRequest;
};

function play() {
  const audio = held ? null : getContext();
  if (!audio) {
    return;
  }

  clearSuspendTimer();
  if (audio.state === 'running') {
    disarm();
  } else {
    // Resume inside the gesture: browsers only let audio start from one.
    audio.resume().catch(() => undefined);
  }

  loadAmbience(audio).then((loaded) => {
    // The visitor may have muted again while the graph loaded.
    if (loaded && readState().enabled) {
      loaded.start();
    }
    syncPlaying();
  });
}

const mute = () => {
  disarm();
  clearSuspendTimer();
  const silentAfterMs = ambience?.stop() ?? 0;
  syncPlaying();

  if (context) {
    suspendTimer = setTimeout(() => {
      suspendTimer = undefined;
      context?.suspend().catch(() => undefined);
    }, silentAfterMs);
  }
};

export const getSoundState = (): SoundState => readState();

export const getServerSoundState = (): SoundState => SERVER_STATE;

export const subscribeToSound = (listener: () => void): (() => void) => {
  listeners.add(listener);

  // A remembered "on" waits for the visitor's first gesture.
  const current = readState();
  if (current.enabled && !current.playing) {
    arm();
  }

  return () => {
    listeners.delete(listener);
  };
};

/** Turns the city's sound on or off. Call it from a click or key press. */
export const setSoundEnabled = (enabled: boolean): void => {
  if (!readState().supported) {
    return;
  }

  writeStoredChoice(enabled);
  update({ enabled });

  if (enabled) {
    play();
  } else {
    mute();
  }
};

/**
 * Quiets the city while another instrument plays, such as the Night Market's
 * rack, without changing the visitor's stored choice. Gestures stop resuming
 * the ambience until releaseAmbience.
 */
export const holdAmbience = (): void => {
  if (held) {
    return;
  }

  held = true;
  if (readState().enabled) {
    mute();
  }
};

/** Lets the city sound again after holdAmbience, if the visitor has it on. */
export const releaseAmbience = (): void => {
  if (!held) {
    return;
  }

  held = false;
  if (readState().enabled) {
    // Resume now if the browser allows it, or on the next gesture.
    arm();
    play();
  }
};
