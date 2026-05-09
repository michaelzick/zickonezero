import { trackEvent, trackLinkClick, trackPageView } from '../src/lib/analytics';

type TestWindow = Window & {
  amplitude?: {
    track?: jest.Mock;
    logEvent?: jest.Mock;
  };
};

describe('analytics helpers', () => {
  beforeEach(() => {
    delete (window as TestWindow).amplitude;
    document.title = 'Test page';
  });

  it('tracks custom events with Amplitude track', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackEvent('cta_click', { label: 'Start' });

    expect(track).toHaveBeenCalledWith('cta_click', { label: 'Start' });
  });

  it('falls back to Amplitude logEvent when track is unavailable', () => {
    const logEvent = jest.fn();
    (window as TestWindow).amplitude = { logEvent };

    trackEvent('cta_click', { label: 'Start' });

    expect(logEvent).toHaveBeenCalledWith('cta_click', { label: 'Start' });
  });

  it('tracks normalized link click payloads', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackLinkClick({
      location: 'footer',
      label: 'GitHub',
      href: 'https://github.com/michaelzick',
      section: 'links',
      variant: 'desktop',
    });

    expect(track).toHaveBeenCalledWith('link_click', {
      link_location: 'footer',
      link_text: 'GitHub',
      link_url: 'https://github.com/michaelzick',
      link_external: true,
      link_section: 'links',
      link_variant: 'desktop',
      page_path: '/',
    });
  });

  it('tracks page views with URL metadata', () => {
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    trackPageView('/about?source=test', 'About');

    expect(track).toHaveBeenCalledWith('page_view', {
      page_path: '/about',
      page_url: 'http://localhost/about?source=test',
      page_title: 'About',
      page_referrer: undefined,
    });
  });
});
