import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NightMarketContent from '../src/components/nightmarket/NightMarketContent';
import RacklooseStall, { RACK_STORAGE_KEY } from '../src/components/nightmarket/RacklooseStall';
import { holdAmbience, releaseAmbience } from '../src/lib/city/sound';
import { renderWithProviders } from '../src/test/renderWithProviders';
import { THEME_STORAGE_KEY } from '../src/theme/themeConfig';

type RackProps = { storageKey?: string; keysEnabled?: boolean; linkBrand?: boolean };

// Rackloose is an ESM-only Web Audio instrument that Jest's CommonJS resolver
// cannot load, so it is mocked virtually; the stall only needs its contract.
const mockRack = jest.fn();

jest.mock('rackloose', () => ({
  RacklooseApp: (props: RackProps) => {
    mockRack(props);
    return (
      <div data-testid='rack' data-keys={String(props.keysEnabled)}>
        <button type='button'>Play all sequencers</button>
      </div>
    );
  },
  preset: (name: string) => ({ name, modules: [] }),
  serializePatch: (patch: unknown) => JSON.stringify(patch),
}), { virtual: true });

jest.mock('../src/lib/city/sound', () => ({
  ...jest.requireActual('../src/lib/city/sound'),
  holdAmbience: jest.fn(),
  releaseAmbience: jest.fn(),
}));

type TestWindow = Window & { amplitude?: { track: jest.Mock } };

const lastRackProps = (): RackProps => mockRack.mock.calls[mockRack.mock.calls.length - 1][0];

describe('Night Market', () => {
  let track: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    track = jest.fn();
    (window as TestWindow).amplitude = { track };
  });

  afterEach(() => {
    delete (window as TestWindow).amplitude;
  });

  describe('the lane', () => {
    it('names the market and the stall, and keeps the scenery decorative', async () => {
      renderWithProviders(<NightMarketContent />);

      expect(screen.getByRole('heading', { level: 1, name: 'Night Market' })).toBeInTheDocument();
      const stall = screen.getByRole('region', { name: 'Synth stall' });
      expect(within(stall).getByText('Try before you buy')).toBeInTheDocument();

      const studio = within(stall).getByRole('link', { name: 'Open the full studio' });
      expect(studio).toHaveAttribute('href', 'https://rackloose.michaelzick.com/');
      expect(studio).toHaveAttribute('target', '_blank');
      expect(studio).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByRole('link', { name: 'Back to the alley' })).toHaveAttribute('href', '/');

      const caption = screen.getByText('НОЧНОЙ РЫНОК');
      expect(caption).toHaveAttribute('lang', 'ru');
      expect(caption).toHaveAttribute('aria-hidden', 'true');

      // Let the night rack finish loading so nothing updates after the test.
      await screen.findByTestId('rack');
    });
  });

  describe('opening hours', () => {
    it('puts the rack on the counter at night', async () => {
      renderWithProviders(<NightMarketContent />);

      expect(await screen.findByTestId('rack')).toBeInTheDocument();
      expect(lastRackProps()).toMatchObject({ storageKey: RACK_STORAGE_KEY, linkBrand: false });
    });

    it('keeps the shutter down by day and opens when the visitor waits for dark', async () => {
      const user = userEvent.setup();
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light');
      renderWithProviders(<NightMarketContent />);

      const wait = screen.getByRole('button', { name: 'Wait for dark' });
      expect(screen.getByText('The market opens at dusk.', { exact: false })).toBeInTheDocument();
      expect(screen.queryByTestId('rack')).not.toBeInTheDocument();
      expect(mockRack).not.toHaveBeenCalled();

      await user.click(wait);

      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(track).toHaveBeenCalledWith('theme_toggle', {
        location: 'night_market',
        from: 'day',
        to: 'night',
        page_path: '/',
      });
      expect(await screen.findByTestId('rack')).toBeInTheDocument();
    });
  });

  describe('the rack', () => {
    it('opens a first visit on Neon Skyline', () => {
      render(<RacklooseStall />);

      expect(JSON.parse(window.localStorage.getItem(RACK_STORAGE_KEY) ?? '{}')).toEqual({
        name: 'Neon Skyline',
        modules: [],
      });
      expect(screen.getByTestId('rack')).toBeInTheDocument();
    });

    it("keeps a returning visitor's own patch", () => {
      window.localStorage.setItem(RACK_STORAGE_KEY, '{"name":"My jam"}');

      render(<RacklooseStall />);

      expect(window.localStorage.getItem(RACK_STORAGE_KEY)).toBe('{"name":"My jam"}');
    });

    it('still plays when storage is blocked', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      render(<RacklooseStall />);

      expect(screen.getByTestId('rack')).toBeInTheDocument();
      jest.restoreAllMocks();
    });

    it('takes the keyboard only while the visitor is in the rack, and quiets the city once', async () => {
      const user = userEvent.setup();
      const { unmount } = render(
        <>
          <button type='button'>Nav link</button>
          <RacklooseStall />
        </>,
      );
      const rack = screen.getByTestId('rack');

      expect(rack).toHaveAttribute('data-keys', 'false');
      expect(holdAmbience).not.toHaveBeenCalled();

      await user.click(within(rack).getByRole('button', { name: 'Play all sequencers' }));
      expect(rack).toHaveAttribute('data-keys', 'true');
      expect(holdAmbience).toHaveBeenCalledTimes(1);
      expect(track).toHaveBeenCalledWith('night_market_rack_engaged', { page_path: '/' });

      await user.click(screen.getByRole('button', { name: 'Nav link' }));
      expect(rack).toHaveAttribute('data-keys', 'false');

      await user.tab();
      expect(rack).toHaveAttribute('data-keys', 'true');
      expect(holdAmbience).toHaveBeenCalledTimes(1);

      act(() => screen.getByRole('button', { name: 'Nav link' }).focus());
      expect(rack).toHaveAttribute('data-keys', 'false');

      expect(releaseAmbience).not.toHaveBeenCalled();
      unmount();
      expect(releaseAmbience).toHaveBeenCalledTimes(1);
    });
  });
});
