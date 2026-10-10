import fs from 'fs';
import path from 'path';

import AboutContent from '../src/components/AboutContent';
import MainContent from '../src/components/MainContent';
import LinkBoxContent from '../src/components/LinkBoxContent';
import worksData from '../src/data/worksData.json';
import { renderWithProviders } from '../src/test/renderWithProviders';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getMatchingRuleValues } from '../src/test/tabTheme';

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

  it('renders the homepage shipped work scroller instead of the old Mt. Hood illustration', () => {
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    expect(screen.getByLabelText('Shipped work screenshot scroller')).toBeInTheDocument();
    expect(screen.getByAltText('DemoStoke hybrid catalog and map view')).toBeInTheDocument();
    expect(screen.getByAltText('Riptyde home screen with RAD-O-METER™ score and ten-day outlook')).toBeInTheDocument();
    expect(screen.getByAltText(/^Bars of Sand 3D terrain model/)).toBeInTheDocument();
    expect(screen.queryByAltText('DemoStoke events calendar')).not.toBeInTheDocument();
    expect(screen.queryByAltText('DemoStoke gear quiz flow')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Illustrated self-portrait near Mt. Hood')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Case Studies' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: 'Product Engineering' }).length).toBeGreaterThan(0);
    // The footer has its own "Product Engineering" column title.
    expect(within(screen.getByRole('main')).getByRole('heading', { level: 2, name: 'Product Engineering' })).toBeInTheDocument();
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

  it('keeps desktop navigation labels spaced, aligned, and on one line', () => {
    renderWithProviders(<LinkBoxContent />);

    const aboutLink = screen.getByRole('link', { name: 'About' });
    const linkRow = aboutLink.parentElement!;
    const projectMenu = screen.getByRole('button', { name: 'Product Engineering' });

    expect(getMatchingRuleValues(linkRow, 'gap').map(value => value.replace(/\s/g, '')))
      .toContain('clamp(1.5rem,2vw,2.5rem)');
    expect(getMatchingRuleValues(linkRow, 'align-items')).toContain('center');
    expect(getMatchingRuleValues(linkRow, 'white-space')).toContain('nowrap');
    expect(getMatchingRuleValues(linkRow, 'flex-shrink')).toContain('0');
    expect(getMatchingRuleValues(aboutLink, 'min-height')).toContain('44px');
    expect(getMatchingRuleValues(projectMenu, 'min-height')).toContain('44px');
  });

  it('offers the billboard slides at sizes for each screen', () => {
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const slides = Array.from(screen.getByLabelText('Shipped work screenshot scroller').querySelectorAll('img'));
    expect(slides.length).toBeGreaterThan(0);
    slides.forEach((slide) => {
      expect(fs.existsSync(path.join(process.cwd(), 'public', slide.getAttribute('src') ?? ''))).toBe(true);
      // Images narrower than 1920px (the Riptyde phone screenshot) have no copies.
      if (Number(slide.getAttribute('width')) < 1920) {
        expect(slide).not.toHaveAttribute('srcset');
        expect(slide).not.toHaveAttribute('sizes');
        return;
      }
      const candidates = (slide.getAttribute('srcset') ?? '').split(', ').map((candidate) => candidate.split(' '));
      expect(candidates.map(([, width]) => width)).toEqual(['960w', '1440w', '1920w']);
      expect(candidates[2][0]).toBe(slide.getAttribute('src'));
      candidates.forEach(([url]) => {
        expect(fs.existsSync(path.join(process.cwd(), 'public', url))).toBe(true);
      });
      expect(slide).toHaveAttribute('sizes');
    });
  });

  it('loads the closed menus\' logos lazily from small copies', () => {
    renderWithProviders(<LinkBoxContent />);

    const logos = Array.from(document.querySelectorAll<HTMLImageElement>('img.case-logo'));
    expect(logos.length).toBeGreaterThan(0);
    logos.forEach((logo) => {
      expect(logo).toHaveAttribute('loading', 'lazy');
      expect(logo.getAttribute('src')).toMatch(/^\/img\/nav\/.+\.webp$/);
    });
  });

  it('syncs the homepage carousel horizontally as vertical scroll progresses', async () => {
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const frame = screen.getByLabelText('Shipped work screenshot scroller');
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

  it('renders each homepage section as a tinted panel with a mobile project carousel', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const sections = [
      { name: 'Case Studies projects', tone: 'case', headingId: 'case-studies' },
      { name: 'Product Engineering projects', tone: 'product', headingId: 'ux-design' },
      { name: 'Web Development projects', tone: 'web', headingId: 'web-development' },
    ];

    for (const { name, tone, headingId } of sections) {
      const row = screen.getByRole('region', { name });
      const panel = row.closest('section')!;

      expect(panel.querySelector(`#${headingId}`)).not.toBeNull();
      expect(getMatchingRuleValues(panel, 'background')).toContain(`var(--home-section-${tone}-bg)`);
      expect(getMatchingRuleValues(panel, 'margin').map(value => value.replace(/\s/g, '')).join(' '))
        .toContain('clamp(2.5em,6vw,4.5em)');
      expect(within(row).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);

      const controls = screen.getByLabelText(`${name} navigation`);
      expect(within(controls).getByRole('button', { name: 'Scroll left', hidden: true })).toBeDisabled();
      expect(within(controls).getByRole('button', { name: 'Scroll right', hidden: true })).toBeInTheDocument();
    }
  });

  it('steps homepage carousels item by item without cancelling in-flight smooth scrolls', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const ITEM_PITCH = 256;
    const CLIENT_WIDTH = 364;
    const row = screen.getByRole('region', { name: 'Web Development projects' });
    const items = Array.from(row.children);
    const maxScroll = items.length * ITEM_PITCH + 16 - CLIENT_WIDTH;
    let scrollLeft = 0;
    const scrollLeftSetter = jest.fn((value: number) => {
      scrollLeft = value;
    });

    Object.defineProperty(row, 'scrollLeft', { configurable: true, get: () => scrollLeft, set: scrollLeftSetter });
    Object.defineProperty(row, 'scrollWidth', { configurable: true, value: maxScroll + CLIENT_WIDTH });
    Object.defineProperty(row, 'clientWidth', { configurable: true, value: CLIENT_WIDTH });
    items.forEach((item, index) => {
      jest.spyOn(item, 'getBoundingClientRect')
        .mockImplementation(() => ({ left: index * ITEM_PITCH - scrollLeft } as DOMRect));
    });

    const controls = screen.getByLabelText('Web Development projects navigation');
    const scrollLeftButton = within(controls).getByRole('button', { name: 'Scroll left', hidden: true });
    const scrollRightButton = within(controls).getByRole('button', { name: 'Scroll right', hidden: true });
    const scrollToSpy = jest.spyOn(row, 'scrollTo');
    const scrollRowTo = (position: number) => {
      scrollLeft = position;
      fireEvent.scroll(row);
    };

    // The first frame of a smooth scroll can move less than a pixel on 120Hz
    // screens; the scroll handler must not reset it and cancel the animation.
    scrollRowTo(0.5);
    expect(scrollLeftSetter).not.toHaveBeenCalled();

    scrollRowTo(0);
    await waitFor(() => expect(scrollRightButton).toBeEnabled());
    expect(scrollLeftButton).toBeDisabled();

    await user.click(scrollRightButton);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: ITEM_PITCH, behavior: 'smooth' });

    scrollRowTo(ITEM_PITCH * 2);
    await waitFor(() => expect(scrollLeftButton).toBeEnabled());
    await user.click(scrollLeftButton);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: ITEM_PITCH, behavior: 'smooth' });

    scrollRowTo(maxScroll - 100);
    await user.click(scrollRightButton);
    expect(scrollToSpy).toHaveBeenLastCalledWith({ left: maxScroll, behavior: 'smooth' });

    scrollRowTo(maxScroll);
    await waitFor(() => expect(scrollRightButton).toBeDisabled());
  });

  it('keeps the homepage tabs navigating to each section', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MainContent />, {
      preloadedState: HOME_PRELOADED_STATE,
    });

    const tabs = within(screen.getByLabelText('Homepage sections'));
    const webTab = tabs.getByRole('button', { name: 'Web Dev', hidden: true });

    (window.scrollTo as jest.Mock).mockClear();
    await user.click(webTab);

    expect(webTab).toHaveAttribute('aria-current', 'true');
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('renders the About page as a full-bleed hero with a container-anchored CTA and modal copy', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AboutContent />);

    const aboutHero = screen.getByLabelText('About page hero');
    const aboutCta = screen.getByRole('button', { name: 'About Michael' });

    expect(aboutHero).toBeInTheDocument();
    expect(aboutHero).toContainElement(aboutCta);
    const biography = screen.getByText(/Michael is a results-oriented Product Leader/i);
    expect(biography).toBeInTheDocument();
    expect(biography).not.toBeVisible();
    expect(aboutCta).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByAltText('Mt. Hood Selfie')).not.toBeInTheDocument();
    expect(getMatchingRuleValues(aboutCta, 'position')).toContain('absolute');
    expect(getMatchingRuleValues(aboutCta, 'right').some((value) => value.includes('clamp('))).toBe(true);
    expect(getMatchingRuleValues(aboutCta, 'bottom').some((value) => value.includes('clamp('))).toBe(true);

    await user.click(aboutCta);

    const aboutDialog = screen.getByRole('dialog', { name: 'About Michael' });
    expect(aboutDialog).toBeInTheDocument();
    expect(screen.getByText(/Michael is a results-oriented Product Leader/i)).toBeInTheDocument();
    expect(within(aboutDialog).getByRole('link', { name: 'main gallery' })).toBeInTheDocument();
    expect(within(aboutDialog).getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(within(aboutDialog).getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close dialog' }));

    expect(screen.queryByRole('dialog', { name: 'About Michael' })).not.toBeInTheDocument();
    expect(biography).toBeInTheDocument();
    expect(biography).not.toBeVisible();
  });

  it('scrolls the About bio inside its dialog while the page behind holds still', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AboutContent />);

    const aboutCta = screen.getByRole('button', { name: 'About Michael' });
    await user.click(aboutCta);

    const aboutDialog = screen.getByRole('dialog', { name: 'About Michael' });
    expect(within(aboutDialog).getByRole('heading', { level: 2, name: 'About Michael' })).toBeInTheDocument();
    expect(within(aboutDialog).getByRole('button', { name: 'Close dialog' })).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('hidden');

    // The plate is a flex column capped to the visible height, and the copy
    // takes what the header leaves, so it scrolls at any header height.
    expect(getMatchingRuleValues(aboutDialog, 'max-height')).toContain('88dvh');
    expect(getMatchingRuleValues(aboutDialog, 'flex-direction')).toContain('column');
    const copy = within(aboutDialog).getByText(/results-oriented Product Leader/).parentElement as HTMLElement;
    expect(getMatchingRuleValues(copy, 'overflow-y')).toContain('auto');
    expect(getMatchingRuleValues(copy, 'min-height')).toContain('0');
    expect(getMatchingRuleValues(copy, 'overscroll-behavior')).toContain('contain');
    expect(getMatchingRuleValues(copy, 'max-height').some((value) => value.includes('88vh'))).toBe(false);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'About Michael' })).not.toBeInTheDocument();
    expect(aboutCta).toHaveFocus();
    expect(document.documentElement.style.overflow).toBe('');
  });
});
