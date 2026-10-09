import { useEffect } from 'react';

/**
 * Holds the page still while a dialog is open, so a drag that starts on the
 * dialog's header or backdrop (or runs past the end of its copy) doesn't
 * scroll the page behind it. It locks the root element, which iOS Safari 16+
 * honors, and pads it by the scrollbar's width so classic scrollbars don't
 * shift the layout. Cleanup restores the root's own inline values, so the
 * stylesheet's overflow-x: clip comes back.
 */
const useBodyScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return undefined;

    const { style } = document.documentElement;
    const overflow = style.getPropertyValue('overflow');
    const paddingRight = style.getPropertyValue('padding-right');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    style.setProperty('overflow', 'hidden');
    if (scrollbarWidth > 0) {
      style.setProperty('padding-right', `${scrollbarWidth}px`);
    }

    // setProperty with an empty value removes the declaration.
    return () => {
      style.setProperty('overflow', overflow);
      style.setProperty('padding-right', paddingRight);
    };
  }, [active]);
};

export default useBodyScrollLock;
