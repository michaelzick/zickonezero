import { useEffect, useRef, useState } from 'react';
import { RacklooseApp, preset, serializePatch } from 'rackloose';
import 'rackloose/style.css';

import { trackEvent } from '../../lib/analytics';

/** Origin-local namespace for the booth's autosave and My Presets. */
export const RACK_STORAGE_KEY = 'zickonezero.rackloose.patch.v1';

/**
 * A first visit opens on Neon Skyline, the synthwave preset that sounds like
 * the city. The autosave is a plain serialized patch, so writing one before
 * the rack mounts is the same as having played it before. Returning visitors
 * keep their own patch.
 */
const seedStarterPatch = () => {
  try {
    if (window.localStorage.getItem(RACK_STORAGE_KEY) === null) {
      window.localStorage.setItem(RACK_STORAGE_KEY, serializePatch(preset('Neon Skyline')));
    }
  } catch {
    // Without storage the rack opens on its own default patch and still plays.
  }
};

/**
 * The Rackloose instrument in Bar Four's booth. Loaded only in the browser
 * (see RackBooth), so the synth never weighs on other pages or the static
 * HTML.
 *
 * Rackloose listens for note keys and Space on the whole window, so the
 * computer keyboard belongs to the rack only while focus, or the last press,
 * is inside it; the nav, toggles, and footer keep their keys. The first time
 * the visitor reaches for the rack is tracked, and `data-rackloose` keeps
 * patch and preset names out of session replays (see src/lib/analytics.ts).
 * The city's ambient sound is already quiet in here (see BarFourContent).
 */
const RacklooseBooth = () => {
  const rackRef = useRef<HTMLDivElement>(null);
  const [seeded, setSeeded] = useState(false);
  const [active, setActive] = useState(false);
  const engaged = useRef(false);

  useEffect(() => {
    seedStarterPatch();
    setSeeded(true);
  }, []);

  useEffect(() => {
    const follow = (event: Event) => {
      setActive(event.target instanceof Node && Boolean(rackRef.current?.contains(event.target)));
    };

    document.addEventListener('pointerdown', follow, true);
    document.addEventListener('focusin', follow);
    return () => {
      document.removeEventListener('pointerdown', follow, true);
      document.removeEventListener('focusin', follow);
    };
  }, []);

  useEffect(() => {
    if (!active || engaged.current) {
      return;
    }

    engaged.current = true;
    trackEvent('bar_four_rack_engaged', { page_path: window.location.pathname });
  }, [active]);

  return (
    <div ref={rackRef} className='booth-rack' data-keys={active ? 'rack' : 'page'} data-rackloose=''>
      {seeded && <RacklooseApp storageKey={RACK_STORAGE_KEY} keysEnabled={active} linkBrand={false} />}
    </div>
  );
};

export default RacklooseBooth;
