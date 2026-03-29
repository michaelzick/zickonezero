import AboutContent from '../src/components/AboutContent';
import MainContent from '../src/components/MainContent';
import worksData from '../pages/api/worksData.json';
import { renderWithProviders } from '../src/test/renderWithProviders';
import { screen, waitFor } from '@testing-library/react';

const HOME_PRELOADED_STATE = {
  data: {
    worksDataReversed: worksData,
  },
  isMobileMenuShown: {
    isMobileMenuShown: false,
  },
};

describe('Home and About visuals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 768,
    });
  });

  it('renders the homepage Demostoke scroller instead of the old Mt. Hood illustration', () => {
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    expect(screen.getByLabelText('Demostoke screenshot scroller')).toBeInTheDocument();
    expect(screen.getByAltText('DemoStoke hybrid catalog and map view')).toBeInTheDocument();
    expect(screen.queryByAltText('Illustrated self-portrait near Mt. Hood')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Case Studies' }).length).toBeGreaterThan(0);
  });

  it('resets the homepage scroll position on mount', () => {
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      writable: true,
      value: 420,
    });

    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
  });

  it('syncs the homepage carousel horizontally as vertical scroll progresses', async () => {
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const frame = screen.getByLabelText('Demostoke screenshot scroller');
    const viewport = frame.firstElementChild as HTMLDivElement | null;
    const track = viewport?.firstElementChild as HTMLDivElement | null;
    const stage = frame.parentElement as HTMLElement | null;

    expect(stage).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(track).not.toBeNull();

    if (!stage || !viewport || !track) {
      throw new Error('Homepage carousel DOM structure is not available for testing.');
    }

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      writable: true,
      value: 1000,
    });
    Object.defineProperty(stage, 'offsetHeight', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(viewport, 'clientWidth', {
      configurable: true,
      value: 600,
    });
    Object.defineProperty(track, 'scrollWidth', {
      configurable: true,
      value: 1200,
    });

    jest.spyOn(stage, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: -700,
      top: -700,
      left: 0,
      width: 1000,
      height: 1200,
      right: 1000,
      bottom: 500,
      toJSON: () => ({}),
    });

    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(track.style.transform).toBe('translate3d(-420px, 0, 0)');
    });
  });

  it('renders the About page as a full-bleed hero without the old inline photo', () => {
    renderWithProviders(<AboutContent />);

    expect(screen.getByLabelText('About page hero')).toBeInTheDocument();
    expect(screen.getByText(/Michael is a results-oriented Product Leader/i)).toBeInTheDocument();
    expect(screen.queryByAltText('Mt. Hood Selfie')).not.toBeInTheDocument();
  });
});
