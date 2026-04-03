import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useCallback, useState } from 'react';

import SidebarSectionTabs, { SidebarSectionTabsMobile, type SidebarSectionConfig } from '../src/components/SidebarSectionTabs';
import {
  ACTIVE_TAB_DECLARATION,
  ACTIVE_TAB_TEXT_DECLARATION,
  DEMOSTOKE_TAB_DECLARATION,
  applyTabThemeVariables,
  clearTabThemeVariables,
  getMatchingRuleValues,
} from '../src/test/tabTheme';

const SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'introduction', label: 'Intro' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-methodology', label: 'Methods' }
];

const DEMOSTOKE_SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'hero-spacer', label: 'Intro Spacer', hidden: true },
  { id: 'section-the-what', label: 'The What' },
  { id: 'section-the-how', label: 'The How' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-methodology', label: 'Methods' }
];

const MOBILE_SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-surfboard-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' }
];

const MOBILE_VISIBLE_SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'mobile-introduction', label: 'Intro' },
  { id: 'mobile-methods', label: 'Methods' }
];

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;
const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

const createRect = (top: number, height: number) => ({
  x: 0,
  y: top,
  top,
  left: 0,
  width: 1000,
  height,
  right: 1000,
  bottom: top + height,
  toJSON: () => ({})
});

const expectDarkGreenActiveTab = (button: HTMLElement) => {
  const backgroundRules = getMatchingRuleValues(button, 'background-color');
  const borderRules = getMatchingRuleValues(button, 'border-color');
  const colorRules = getMatchingRuleValues(button, 'color');

  expect(backgroundRules).toContain(ACTIVE_TAB_DECLARATION);
  expect(borderRules).toContain(ACTIVE_TAB_DECLARATION);
  expect(colorRules).toContain(ACTIVE_TAB_TEXT_DECLARATION);
  expect(backgroundRules).not.toContain(DEMOSTOKE_TAB_DECLARATION);
  expect(borderRules).not.toContain(DEMOSTOKE_TAB_DECLARATION);
};

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      if (this.getAttribute('data-section-tabs-variant')) {
        return 44;
      }

      return Number(this.getAttribute('data-height') ?? 0);
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: function getBoundingClientRect() {
      const top = Number(this.getAttribute('data-top') ?? 0);
      const height = Number(this.getAttribute('data-height') ?? 120);
      return createRect(top, height);
    },
  });
});

beforeEach(() => {
  applyTabThemeVariables();
});

afterAll(() => {
  if (originalOffsetHeight) {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
  } else {
    delete (HTMLElement.prototype as { offsetHeight?: unknown }).offsetHeight;
  }

  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: originalGetBoundingClientRect,
  });
});

afterEach(() => {
  clearTabThemeVariables();
});

const TopTabsAnchor = ({ onReady }: { onReady: (node: HTMLDivElement | null) => void; }) => {
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      Object.defineProperty(node, 'offsetHeight', {
        configurable: true,
        value: 48,
      });
    }

    onReady(node);
  }, [onReady]);

  return <div ref={handleRef} data-testid='top-tabs-anchor' style={{ position: 'fixed', top: '80px' }} />;
};

const DesktopHarness = ({
  revealTop,
  introTop,
  whoTop,
  methodsTop,
}: {
  revealTop: number;
  introTop: number;
  whoTop: number;
  methodsTop: number;
}) => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <div id='desktop-reveal-anchor' data-top={revealTop} data-height='1' />
      <section id='introduction' data-top={introTop} />
      <section id='section-the-who' data-top={whoTop} />
      <section id='section-methodology' data-top={methodsTop} />
      <SidebarSectionTabs
        sections={SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
        desktopRevealAnchorId='desktop-reveal-anchor'
      />
    </div>
  );
};

const MobileHarness = () => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <section id='story-introduction' data-top='0' />
      <section id='story-independent-surfboard-shaper-title' data-top='180' />
      <section id='story-weekend-warrior' data-top='480' />
      <SidebarSectionTabsMobile
        sections={MOBILE_SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
      />
    </div>
  );
};

const MobileVisibleHarness = () => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <section id='mobile-introduction' data-top='-220' />
      <section id='mobile-methods' data-top='240' />
      <SidebarSectionTabsMobile
        sections={MOBILE_VISIBLE_SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
      />
    </div>
  );
};

const DesktopDemoStokeClickHarness = () => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <div id='hero-spacer' data-top='0' data-height='1' />
      <section id='section-the-what' data-top='120' />
      <section id='section-the-how' data-top='340' />
      <section id='section-the-who' data-top='560' />
      <section id='section-methodology' data-top='820' />
      <SidebarSectionTabs
        sections={DEMOSTOKE_SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
        scrollOffsetAdjustment={8}
      />
    </div>
  );
};

const DesktopHiddenIntroVisibilityHarness = ({
  revealTop,
  firstVisibleTop,
  secondVisibleTop,
}: {
  revealTop: number;
  firstVisibleTop: number;
  secondVisibleTop: number;
}) => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <div id='hidden-intro-reveal-anchor' data-top={revealTop} data-height='1' />
      <div id='hero-spacer' data-top='0' data-height='1' />
      <section id='section-the-what' data-top={firstVisibleTop} />
      <section id='section-the-how' data-top={secondVisibleTop} />
      <section id='section-the-who' data-top='740' />
      <section id='section-methodology' data-top='980' />
      <SidebarSectionTabs
        sections={DEMOSTOKE_SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
        scrollOffsetAdjustment={8}
        desktopRevealAnchorId='hidden-intro-reveal-anchor'
      />
    </div>
  );
};

const MobileDemoStokeClickHarness = () => {
  const [topTabsEl, setTopTabsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div>
      <TopTabsAnchor onReady={setTopTabsEl} />
      <div id='hero-spacer' data-top='0' data-height='1' />
      <section id='section-the-what' data-top='120' />
      <section id='section-the-how' data-top='340' />
      <section id='section-the-who' data-top='560' />
      <section id='section-methodology' data-top='820' />
      <SidebarSectionTabsMobile
        sections={DEMOSTOKE_SECTION_CONFIG}
        topTabsEl={topTabsEl}
        isActive
        scrollOffsetAdjustment={8}
      />
    </div>
  );
};

describe('SidebarSectionTabs', () => {
  it('renders a horizontal desktop bar that fades in after the reveal anchor is crossed', async () => {
    const { rerender } = render(
      <DesktopHarness
        revealTop={260}
        introTop={60}
        whoTop={520}
        methodsTop={940}
      />
    );

    const desktopNav = screen.getByLabelText('Desktop page sections');
    expect(window.getComputedStyle(desktopNav).opacity).toBe('0');
    expect(screen.queryByLabelText('Page sections')).not.toBeInTheDocument();

    rerender(
      <DesktopHarness
        revealTop={80}
        introTop={-120}
        whoTop={140}
        methodsTop={560}
      />
    );

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(window.getComputedStyle(desktopNav).opacity).toBe('1');
    });
  });

  it('keeps the desktop bar visible once the first visible section is within the detection buffer on hidden-intro pages', async () => {
    render(
      <DesktopHiddenIntroVisibilityHarness
        revealTop={170}
        firstVisibleTop={205}
        secondVisibleTop={520}
      />
    );

    const desktopNav = screen.getByLabelText('Desktop page sections');

    await waitFor(() => {
      expect(window.getComputedStyle(desktopNav).opacity).toBe('1');
    });
  });

  it('keeps the active desktop tab in sync with scroll position', async () => {
    const { rerender } = render(
      <DesktopHarness
        revealTop={80}
        introTop={70}
        whoTop={460}
        methodsTop={920}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Intro' })).toHaveAttribute('aria-current', 'true');
    });

    expectDarkGreenActiveTab(screen.getByRole('button', { name: 'Intro' }));

    rerender(
      <DesktopHarness
        revealTop={80}
        introTop={-320}
        whoTop={110}
        methodsTop={640}
      />
    );

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'The Who' })).toHaveAttribute('aria-current', 'true');
    });

    expectDarkGreenActiveTab(screen.getByRole('button', { name: 'The Who' }));
  });

  it('keeps the mobile tabs path available with the new desktop refactor', () => {
    render(<MobileHarness />);

    expect(screen.getByLabelText('Mobile page sections')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Independent Shaper', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Weekend Warrior', hidden: true })).toBeInTheDocument();
  });

  it('styles the active mobile section tab with darkGreen instead of the Demostoke color', async () => {
    render(<MobileVisibleHarness />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Intro', hidden: true })).toHaveAttribute('aria-current', 'true');
    });

    expectDarkGreenActiveTab(screen.getByRole('button', { name: 'Intro', hidden: true }));
  });

  it('scrolls the desktop DemoStoke tabs to the matching section anchors', async () => {
    render(<DesktopDemoStokeClickHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'The Who', hidden: true }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 370, behavior: 'smooth' });

    (window.scrollTo as jest.Mock).mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Methods', hidden: true }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 630, behavior: 'smooth' });
  });

  it('scrolls the mobile DemoStoke tabs to the matching section anchors', async () => {
    render(<MobileDemoStokeClickHarness />);

    fireEvent.click(screen.getByRole('button', { name: 'The Who', hidden: true }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 370, behavior: 'smooth' });

    (window.scrollTo as jest.Mock).mockClear();

    fireEvent.click(screen.getByRole('button', { name: 'Methods', hidden: true }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 630, behavior: 'smooth' });
  });
});
