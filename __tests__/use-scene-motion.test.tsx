import { act, render } from '@testing-library/react';
import { useRef } from 'react';

import useSceneMotion from '../src/hooks/useSceneMotion';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

const Scene = () => {
  const ref = useRef<HTMLElement>(null);
  useSceneMotion(ref);
  return <section ref={ref} data-testid='scene' />;
};

const originalObserver = window.IntersectionObserver;
const originalHidden = Object.getOwnPropertyDescriptor(document, 'hidden');
let intersect: IntersectionObserverCallback;
const disconnect = jest.fn();
const observe = jest.fn();

class ManualObserver {
  constructor(callback: IntersectionObserverCallback) { intersect = callback; }
  observe = observe;
  disconnect = disconnect;
}

const setVisible = (visible: boolean) => act(() => {
  intersect([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver);
});

const setHidden = (hidden: boolean) => act(() => {
  Object.defineProperty(document, 'hidden', { configurable: true, value: hidden });
  document.dispatchEvent(new Event('visibilitychange'));
});

describe('scene ambient motion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver = ManualObserver as unknown as typeof IntersectionObserver;
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  });

  afterEach(() => {
    window.IntersectionObserver = originalObserver;
    if (originalHidden) {
      Object.defineProperty(document, 'hidden', originalHidden);
    } else {
      Reflect.deleteProperty(document, 'hidden');
    }
    Reflect.deleteProperty(navigator, 'connection');
    restoreMatchMedia();
    jest.restoreAllMocks();
  });

  it('runs only when both the hero and the document are visible', () => {
    const { getByTestId } = render(<Scene />);
    const scene = getByTestId('scene');
    expect(scene).toHaveAttribute('data-scene-motion', 'paused');
    setVisible(true);
    expect(scene).toHaveAttribute('data-scene-motion', 'running');
    setHidden(true);
    expect(scene).toHaveAttribute('data-scene-motion', 'paused');
    setVisible(false);
    setHidden(false);
    expect(scene).toHaveAttribute('data-scene-motion', 'paused');
    setVisible(true);
    expect(scene).toHaveAttribute('data-scene-motion', 'running');
    setVisible(false);
    expect(scene).toHaveAttribute('data-scene-motion', 'paused');
  });

  it('keeps a still frame under reduced motion', () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const { getByTestId } = render(<Scene />);
    setVisible(true);
    expect(getByTestId('scene')).toHaveAttribute('data-scene-motion', 'still');
  });

  it('responds to Save-Data changes and releases the connection listener', () => {
    const connection = Object.assign(new EventTarget(), { saveData: true });
    Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
    const removeConnection = jest.spyOn(connection, 'removeEventListener');
    const { getByTestId, unmount } = render(<Scene />);
    const scene = getByTestId('scene');
    setVisible(true);
    expect(scene).toHaveAttribute('data-scene-motion', 'still');
    act(() => {
      connection.saveData = false;
      connection.dispatchEvent(new Event('change'));
    });
    expect(scene).toHaveAttribute('data-scene-motion', 'running');
    unmount();
    expect(removeConnection).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('disconnects the observer and document listener on unmount', () => {
    const removeDocument = jest.spyOn(document, 'removeEventListener');
    const { getByTestId, unmount } = render(<Scene />);
    const scene = getByTestId('scene');
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(removeDocument).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
    expect(scene).not.toHaveAttribute('data-scene-motion');
    setHidden(true);
    expect(scene).not.toHaveAttribute('data-scene-motion');
  });

  it('still runs in visible browsers without IntersectionObserver', () => {
    Object.defineProperty(window, 'IntersectionObserver', { value: undefined });
    const { getByTestId } = render(<Scene />);
    expect(getByTestId('scene')).toHaveAttribute('data-scene-motion', 'running');
    setHidden(true);
    expect(getByTestId('scene')).toHaveAttribute('data-scene-motion', 'paused');
  });
});
