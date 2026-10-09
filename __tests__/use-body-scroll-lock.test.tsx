import { renderHook } from '@testing-library/react';

import useBodyScrollLock from '../src/hooks/useBodyScrollLock';

describe('useBodyScrollLock', () => {
  const root = document.documentElement;

  const setViewport = (innerWidth: number, clientWidth: number) => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: innerWidth });
    Object.defineProperty(root, 'clientWidth', { configurable: true, value: clientWidth });
  };

  afterEach(() => {
    root.removeAttribute('style');
    delete (root as { clientWidth?: number }).clientWidth;
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1024 });
  });

  it('leaves the page alone while inactive', () => {
    setViewport(1024, 1009);
    renderHook(() => useBodyScrollLock(false));

    expect(root.style.overflow).toBe('');
    expect(root.style.paddingRight).toBe('');
  });

  it('locks page scroll and makes room for the scrollbar it hides', () => {
    setViewport(1024, 1009);
    const { rerender } = renderHook(({ active }) => useBodyScrollLock(active), { initialProps: { active: true } });

    expect(root.style.overflow).toBe('hidden');
    expect(root.style.paddingRight).toBe('15px');

    rerender({ active: false });

    expect(root.style.overflow).toBe('');
    expect(root.style.paddingRight).toBe('');
  });

  it('adds no padding where scrollbars take no space, as on phones', () => {
    setViewport(390, 390);
    renderHook(() => useBodyScrollLock(true));

    expect(root.style.overflow).toBe('hidden');
    expect(root.style.paddingRight).toBe('');
  });

  it('restores the inline styles the root had before', () => {
    setViewport(1024, 1009);
    root.style.overflow = 'auto';
    root.style.paddingRight = '4px';
    const { unmount } = renderHook(() => useBodyScrollLock(true));

    expect(root.style.overflow).toBe('hidden');

    unmount();

    expect(root.style.overflow).toBe('auto');
    expect(root.style.paddingRight).toBe('4px');
  });
});
