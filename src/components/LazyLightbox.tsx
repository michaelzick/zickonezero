import dynamic from 'next/dynamic';
import { useState } from 'react';

type LazyLightboxProps = {
  /** Flip it to open the lightbox, as with fslightbox's own toggler. */
  toggler: boolean;
  sources: string[];
  slide?: number;
};

// fslightbox is ~43 KB of script and measures the page as it mounts, so it
// loads the first time a gallery opens instead of with every page.
const FsLightbox = dynamic<LazyLightboxProps & { openOnMount?: boolean }>(
  () => import('fslightbox-react'),
  { ssr: false },
);

/**
 * fslightbox, mounted on the first open. Until the toggler first flips there
 * is nothing to show; then the lightbox mounts already open (openOnMount),
 * and later flips reach it as usual.
 */
const LazyLightbox = ({ toggler, sources, slide }: LazyLightboxProps) => {
  const [initialToggler] = useState(toggler);
  const [hasOpened, setHasOpened] = useState(false);
  const isOpening = toggler !== initialToggler;

  // Latch the first open, so flipping back to the initial value still reaches the lightbox.
  if (isOpening && !hasOpened) {
    setHasOpened(true);
  }

  if (!hasOpened && !isOpening) return null;

  return <FsLightbox toggler={toggler} sources={sources} slide={slide} openOnMount />;
};

export default LazyLightbox;
