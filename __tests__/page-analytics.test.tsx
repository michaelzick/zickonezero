import { act, render } from '@testing-library/react';
import { StrictMode, useEffect, useLayoutEffect } from 'react';

import PageAnalytics from '../src/components/PageAnalytics';
import { trackPageView } from '../src/lib/analytics';

type Handler = (...args: unknown[]) => void;

const mockHandlers = new Map<string, Set<Handler>>();

const mockRouter = {
  events: {
    on: (type: string, handler: Handler) => {
      if (!mockHandlers.has(type)) {
        mockHandlers.set(type, new Set());
      }
      mockHandlers.get(type)?.add(handler);
    },
    off: (type: string, handler: Handler) => {
      mockHandlers.get(type)?.delete(handler);
    },
  },
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('../src/lib/analytics', () => ({
  trackPageView: jest.fn(),
}));

const mockTrackPageView = trackPageView as jest.MockedFunction<typeof trackPageView>;

const emit = (type: string, ...args: unknown[]) => {
  act(() => {
    mockHandlers.get(type)?.forEach((handler) => handler(...args));
  });
};

describe('PageAnalytics', () => {
  beforeEach(() => {
    mockHandlers.clear();
    mockTrackPageView.mockReset();
    document.title = 'Home';
  });

  it('tracks the landing page once, even under Strict Mode', () => {
    render(
      <StrictMode>
        <PageAnalytics />
      </StrictMode>,
    );

    expect(mockTrackPageView).toHaveBeenCalledTimes(1);
    expect(mockTrackPageView).toHaveBeenCalledWith(undefined);
  });

  it('tracks every completed route change, repeat visits included', () => {
    render(<PageAnalytics />);
    mockTrackPageView.mockClear();

    emit('routeChangeComplete', '/about/');
    emit('routeChangeComplete', '/about/');

    expect(mockTrackPageView.mock.calls).toEqual([['/about/'], ['/about/']]);
  });

  it("reads the new page's title, set in the new page's own effect", () => {
    const titles: string[] = [];
    mockTrackPageView.mockImplementation(() => {
      titles.push(document.title);
    });

    // Stands in for the router and next/head: the route change completes as
    // the new page commits, before its passive effects set document.title.
    const Page = ({ title, url }: { title: string; url?: string }) => {
      useLayoutEffect(() => {
        if (url) mockHandlers.get('routeChangeComplete')?.forEach((handler) => handler(url));
      }, [url]);
      useEffect(() => {
        document.title = title;
      }, [title]);
      return null;
    };

    const { rerender } = render(
      <>
        <PageAnalytics />
        <Page title='Home' />
      </>,
    );

    rerender(
      <>
        <PageAnalytics />
        <Page title='About' url='/about/' />
      </>,
    );

    expect(titles).toEqual(['Home', 'About']);
  });

  it('stops listening on unmount', () => {
    const { unmount } = render(<PageAnalytics />);
    unmount();

    expect(mockHandlers.get('routeChangeComplete')?.size).toBe(0);
  });
});
