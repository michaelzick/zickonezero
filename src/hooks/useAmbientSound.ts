import { useSyncExternalStore } from 'react';

import {
  getServerSoundState,
  getSoundState,
  setSoundEnabled,
  subscribeToSound,
  type SoundState,
} from '../lib/city/sound';

type AmbientSound = SoundState & {
  /** Call from a click or key press: browsers only start audio from one. */
  setEnabled: (enabled: boolean) => void;
};

/** The city's opt-in ambient sound, shared by every toggle on the page. */
const useAmbientSound = (): AmbientSound => {
  const state = useSyncExternalStore(subscribeToSound, getSoundState, getServerSoundState);
  return { ...state, setEnabled: setSoundEnabled };
};

export default useAmbientSound;
