import { act, render } from '@testing-library/react';

import WeatherCanvas from '../src/components/city/WeatherCanvas';
import { createWeatherEngine, type WeatherEngine } from '../src/lib/city/weather';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';

jest.mock('../src/lib/city/weather', () => ({
  createWeatherEngine: jest.fn(),
}));

const mockedCreateWeatherEngine = createWeatherEngine as jest.MockedFunction<typeof createWeatherEngine>;

type MockEngine = { [Key in keyof WeatherEngine]: jest.Mock };

const createMockEngine = (): MockEngine => ({
  resize: jest.fn(),
  setMode: jest.fn(),
  step: jest.fn(),
  draw: jest.fn(),
});

const setCanvasSize = (width: number, height: number) => {
  jest.spyOn(HTMLCanvasElement.prototype, 'clientWidth', 'get').mockReturnValue(width);
  jest.spyOn(HTMLCanvasElement.prototype, 'clientHeight', 'get').mockReturnValue(height);
};

const setHidden = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
};

const advanceFrames = (count: number) => {
  act(() => {
    jest.advanceTimersByTime(count * 16);
  });
};

describe('WeatherCanvas', () => {
  let engine: MockEngine;
  let context: { setTransform: jest.Mock };

  beforeEach(() => {
    jest.useFakeTimers();
    engine = createMockEngine();
    mockedCreateWeatherEngine.mockReturnValue(engine);
    context = { setTransform: jest.fn() };
    setCanvasSize(1280, 720);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 1 });
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    restoreMatchMedia();
    mockedCreateWeatherEngine.mockReset();
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    delete (navigator as Navigator & { connection?: unknown }).connection;
  });

  const useContext = () => {
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
  };

  it('stays inert where the browser has no 2D canvas', () => {
    const requestFrame = jest.spyOn(window, 'requestAnimationFrame');

    const { container } = render(<WeatherCanvas />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas).toHaveAttribute('data-dimmed', 'false');
    expect(mockedCreateWeatherEngine).not.toHaveBeenCalled();
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it('rains at night, sized to the viewport, frame after frame', () => {
    useContext();
    const { container } = render(<WeatherCanvas dimmed />);

    expect(container.querySelector('canvas')).toHaveAttribute('data-dimmed', 'true');
    expect(engine.setMode).toHaveBeenCalledWith('rain', true);
    // 1280 x 720 at one particle per 3,600 px².
    expect(engine.resize).toHaveBeenCalledWith(1280, 720, 256);
    expect(context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0);

    advanceFrames(4);

    expect(engine.step.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(engine.step).toHaveBeenCalledWith(0, { delta: 0, velocity: 0 });
    expect(engine.draw.mock.calls.length).toBe(engine.step.mock.calls.length);
  });

  it('caps the particle budget and pixel density on phones', () => {
    useContext();
    setCanvasSize(390, 844);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 });

    const { container } = render(<WeatherCanvas />);

    expect(engine.resize).toHaveBeenCalledWith(390, 844, 91);
    expect(container.querySelector('canvas')?.width).toBe(585);
    expect(context.setTransform).toHaveBeenCalledWith(1.5, 0, 0, 1.5, 0, 0);
  });

  it('keeps big screens within the particle budget', () => {
    useContext();
    setCanvasSize(3840, 2160);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 });

    const { container } = render(<WeatherCanvas />);

    expect(engine.resize).toHaveBeenCalledWith(3840, 2160, 420);
    expect(container.querySelector('canvas')?.width).toBe(7680);
  });

  it('draws one still frame and no loop under reduced motion', () => {
    useContext();
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const requestFrame = jest.spyOn(window, 'requestAnimationFrame');

    render(<WeatherCanvas />);
    advanceFrames(4);

    expect(engine.draw).toHaveBeenCalledTimes(1);
    expect(engine.step).not.toHaveBeenCalled();
    expect(requestFrame).not.toHaveBeenCalled();
  });

  it('draws one still frame with Save-Data on', () => {
    useContext();
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });

    render(<WeatherCanvas />);
    advanceFrames(4);

    expect(engine.draw).toHaveBeenCalledTimes(1);
    expect(engine.step).not.toHaveBeenCalled();
  });

  it('turns rain to dust when day breaks', async () => {
    useContext();
    render(<WeatherCanvas />);

    await act(async () => {
      document.documentElement.setAttribute('data-theme', 'light');
      await Promise.resolve();
    });

    expect(engine.setMode).toHaveBeenLastCalledWith('dust', false);
  });

  it('pauses while the tab is hidden', () => {
    useContext();
    render(<WeatherCanvas />);
    advanceFrames(4);

    setHidden(true);
    const stepsWhileHidden = engine.step.mock.calls.length;
    advanceFrames(10);
    expect(engine.step).toHaveBeenCalledTimes(stepsWhileHidden);

    setHidden(false);
    advanceFrames(4);
    expect(engine.step.mock.calls.length).toBeGreaterThan(stepsWhileHidden);
  });

  it('stops drawing once it unmounts', () => {
    useContext();
    const { unmount } = render(<WeatherCanvas />);
    advanceFrames(2);

    unmount();
    const steps = engine.step.mock.calls.length;
    advanceFrames(10);

    expect(engine.step).toHaveBeenCalledTimes(steps);
  });
});
