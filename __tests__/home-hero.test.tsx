import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MainContent from '../src/components/MainContent';
import worksData from '../src/data/worksData.json';
import { REDUCED_MOTION_QUERY, mockMatchMedia, restoreMatchMedia } from '../src/test/matchMedia';
import { renderWithProviders } from '../src/test/renderWithProviders';

type LightboxProps = { toggler: boolean; sources: string[]; slide: number };

const mockLightbox = jest.fn((props: LightboxProps) => {
  void props;
  return null;
});

jest.mock('fslightbox-react', () => function MockFsLightbox(props: LightboxProps) {
  return mockLightbox(props);
});

type TestWindow = Window & {
  amplitude?: {
    track?: jest.Mock;
  };
};

const HOME_PRELOADED_STATE = {
  data: {
    worksDataReversed: worksData,
  },
  isMobileMenuShown: {
    isMobileMenuShown: false,
  },
};

const CJK = /[぀-ヿ㐀-鿿]/;

const renderHome = () => renderWithProviders(<MainContent />, { preloadedState: HOME_PRELOADED_STATE });

describe('Homepage city', () => {
  let track: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    track = jest.fn();
    (window as TestWindow).amplitude = { track };
    Object.defineProperty(window, 'scrollY', { configurable: true, writable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 768 });
  });

  afterEach(() => {
    delete (window as TestWindow).amplitude;
    jest.restoreAllMocks();
    restoreMatchMedia();
  });

  it('makes Michael and the brand the single main heading in the introduction', () => {
    renderHome();

    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toHaveAccessibleName('Michael Zick is ZICKONEZERO Creative');
    expect(headline).toHaveAttribute('id', 'home-hero-title');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(headline.closest('section')).toHaveAttribute('aria-labelledby', 'home-hero-title');
    expect(headline.closest('.hero-panel')).not.toBeNull();
    expect(headline.querySelector('.brand-one')).toHaveTextContent('ONE');
    expect(screen.queryByText('I Dream')).not.toBeInTheDocument();
  });

  it('introduces Michael with the brand and two ways in', async () => {
    const user = userEvent.setup();
    renderHome();

    expect(screen.getByText(/Michael Zick is/)).toHaveTextContent(
      'Michael Zick is ZICKONEZERO Creative',
    );
    expect(screen.getByText('Turning ideas into shipped products.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'See Case Studies' }));

    expect(track).toHaveBeenCalledWith('cta_click', {
      location: 'home_intro',
      label: 'See Case Studies',
      section: 'case-studies',
      page_path: '/',
    });

    const hero = screen.getByRole('region', { name: 'Michael Zick is ZICKONEZERO Creative' });
    expect(within(hero).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByRole('link', { name: 'Jack In' })).not.toBeInTheDocument();
  });

  it('follows the next-destination objectives and returns to the hero under reduced motion', async () => {
    mockMatchMedia(REDUCED_MOTION_QUERY);
    const user = userEvent.setup();
    const scroll = jest.spyOn(window, 'scrollTo').mockImplementation((options: ScrollToOptions | number, y?: number) => {
      window.scrollY = typeof options === 'number' ? y ?? 0 : options.top ?? 0;
    });
    renderHome();

    // Give the real scroll spy and jumper distinct district positions.
    ['case-studies', 'ux-design', 'web-development'].forEach((id, index) => {
      const section = document.getElementById(id)!.closest('section')!;
      const top = (index + 1) * 1000;
      jest.spyOn(section, 'getBoundingClientRect').mockImplementation(() => ({
        x: 0, y: top - window.scrollY, top: top - window.scrollY,
        bottom: top + 500 - window.scrollY, left: 0, right: 1000, width: 1000, height: 500,
        toJSON: () => ({}),
      }));
    });

    const hud = screen.getByRole('navigation', { name: 'Homepage sections' });
    await user.click(within(hud).getByRole('button', { name: 'Head to Case Studies' }));
    await user.click(within(hud).getByRole('button', { name: 'Head to Product Engineering' }));
    await user.click(within(hud).getByRole('button', { name: 'Head to Web Development' }));
    expect(window.scrollY).toBeGreaterThan(2000);

    await user.click(within(hud).getByRole('button', { name: 'Return to surface' }));

    expect(scroll).toHaveBeenLastCalledWith({ top: 0, behavior: 'auto' });
    expect(window.scrollY).toBe(0);
    expect(track).toHaveBeenLastCalledWith('section_tab_click', expect.objectContaining({
      location: 'home_tabs', label: 'Return to surface', section: 'hero',
    }));
    expect(within(hud).getByRole('button', { name: 'Head to Case Studies' })).toBeInTheDocument();
  });

  it('makes the market sign a link to the Night Market and keeps street litter decorative', () => {
    const { container } = renderHome();
    const market = screen.getByRole('link', { name: 'Night Market' });
    expect(market).toHaveAttribute('href', '/night-market');
    // The link follows the introduction's CTAs in tab order.
    const hero = screen.getByRole('region', { name: 'Michael Zick is ZICKONEZERO Creative' });
    const contact = within(hero).getByRole('link', { name: 'Contact' });
    expect(contact.compareDocumentPosition(market) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const translation = within(market).getByText('НОЧНОЙ РЫНОК');
    expect(translation).toHaveAttribute('lang', 'ru');
    expect(translation.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(within(market).getByText('Open late').closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.queryByText('Sector 10')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Night Market/ })).not.toBeInTheDocument();
    const scraps = container.querySelectorAll('.paper-scrap');
    expect(scraps).toHaveLength(8);
    scraps.forEach((scrap) => expect(scrap.closest('[aria-hidden="true"]')).not.toBeNull());
  });

  it('keeps every Japanese sign decorative and marked as Japanese', () => {
    const { container } = renderHome();

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const japanese: Text[] = [];
    while (walker.nextNode()) {
      if (CJK.test(walker.currentNode.textContent ?? '')) {
        japanese.push(walker.currentNode as Text);
      }
    }

    // The alley's blade signs and the district signs.
    expect(japanese.length).toBeGreaterThanOrEqual(6);
    japanese.forEach((text) => {
      expect(text.parentElement?.closest('[lang="ja"]')).not.toBeNull();
      expect(text.parentElement?.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it('replaces the overhead marquee with decorative distant towers', () => {
    const { container } = renderHome();
    const hero = screen.getByRole('region', { name: 'Michael Zick is ZICKONEZERO Creative' });

    expect(hero.querySelector('.banner, .ticker-track')).toBeNull();
    const towers = container.querySelectorAll('.distant-tower');
    expect(towers).toHaveLength(5);
    towers.forEach((tower) => {
      expect(tower.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(tower.querySelector('a, button, [tabindex]')).toBeNull();
    });
  });

  it('opens a gallery card in the lightbox from its View gallery button', async () => {
    const user = userEvent.setup();
    renderHome();

    const galleryButtons = screen.getAllByRole('button', { name: /^View gallery for / });
    expect(galleryButtons.length).toBeGreaterThan(0);

    const button = galleryButtons[0];
    const project = button.textContent?.replace('View gallery for ', '') ?? '';
    const item = worksData.find(({ header }) => header === project);
    expect(item?.imgs?.length).toBeGreaterThan(0);

    const lastToggler = mockLightbox.mock.calls[mockLightbox.mock.calls.length - 1][0].toggler;
    await user.click(button);

    const props = mockLightbox.mock.calls[mockLightbox.mock.calls.length - 1][0];
    expect(props.toggler).toBe(!lastToggler);
    expect(props.sources).toEqual(item?.imgs);
    expect(track).toHaveBeenCalledWith('project_card_click', expect.objectContaining({
      location: 'project_grid',
      project_title: project,
    }));
  });

  it('ends the route in open city instead of a street scene', () => {
    const { container } = renderHome();

    expect(screen.queryByRole('region', { name: 'Now booking new gigs' })).not.toBeInTheDocument();
    expect(container.querySelector('.walker, .car')).toBeNull();
  });

  it('labels each district for the minimap and keeps its decorations out of the reading order', () => {
    const { container } = renderHome();

    const hud = screen.getByRole('navigation', { name: 'Homepage sections' });
    expect(within(within(hud).getByRole('list')).getAllByRole('button').map((pin) => pin.textContent))
      .toEqual(['Case Studies', 'Product Engineering', 'Web Dev']);

    ['case-studies', 'ux-design', 'web-development'].forEach((id) => {
      expect(container.querySelector(`#${id}`)).not.toBeNull();
    });

    // Gig tags and status chips repeat the cards, so they are hidden.
    container.querySelectorAll('.gig-tag, .gig-status').forEach((chip) => {
      expect(chip).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
