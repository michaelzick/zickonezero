import { act, render, screen, waitFor } from '@testing-library/react';
import { useCallback, useState } from 'react';

import SidebarSectionTabs, { SidebarSectionTabsMobile, type SidebarSectionConfig } from '../src/components/SidebarSectionTabs';

const SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'introduction', label: 'Intro' },
  { id: 'section-the-who', label: 'The Who' },
  { id: 'section-methodology', label: 'Methods' }
];

const MOBILE_SECTION_CONFIG: SidebarSectionConfig[] = [
  { id: 'story-introduction', label: 'Intro', hidden: true },
  { id: 'story-independent-surfboard-shaper-title', label: 'Independent Shaper' },
  { id: 'story-weekend-warrior', label: 'Weekend Warrior' }
];

const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

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

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: function getBoundingClientRect() {
      const top = Number(this.getAttribute('data-top') ?? 0);
      const height = Number(this.getAttribute('data-height') ?? 120);
      return createRect(top, height);
    },
  });
});

afterAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
    configurable: true,
    value: originalGetBoundingClientRect,
  });
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
  });

  it('keeps the mobile tabs path available with the new desktop refactor', () => {
    render(<MobileHarness />);

    expect(screen.getByLabelText('Mobile page sections')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Independent Shaper', hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Weekend Warrior', hidden: true })).toBeInTheDocument();
  });
});
