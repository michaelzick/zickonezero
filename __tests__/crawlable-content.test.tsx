import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server.node';
import { Provider } from 'react-redux';

import AboutContent from '../src/components/AboutContent';
import DemoStokeContent from '../src/components/DemoStokeContent';
import AntisyphonContent from '../src/components/AntisyphonContent';
import NiceGuyUniversityContent from '../src/components/NiceGuyUniversityContent';
import ProjectShowcase from '../src/components/ProjectShowcase';
import { createTestStore, renderWithProviders } from '../src/test/renderWithProviders';
import { AppThemeProvider } from '../src/theme/ThemeContext';

// The static HTML, parsed, as a crawler or the first paint sees it.
const renderStaticHtml = (ui: ReactElement) => {
  const host = document.createElement('div');
  host.innerHTML = renderToString(
    <Provider store={createTestStore()}>
      <AppThemeProvider>{ui}</AppThemeProvider>
    </Provider>,
  );
  return host;
};

describe('Crawlable case-study panels', () => {
  it.each([
    ['DemoStoke', DemoStokeContent, 'User Stories', 'The Independent Surfboard Shaper'],
    ['Antisyphon', AntisyphonContent, 'Product Screens', 'Antisyphon Product Screens'],
    ['Nice Guy University', NiceGuyUniversityContent, 'Product Screens', 'Support Ecosystem'],
  ] as const)('includes %s secondary content before interaction and keeps tab visibility exclusive', async (_name, Content, tabName, text) => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<Content />);
    const initialTab = screen.getByRole('tab', { name: 'UX Case Study' });
    const secondaryTab = screen.getByRole('tab', { name: tabName });
    const initialPanel = document.getElementById(initialTab.getAttribute('aria-controls') ?? '');
    const secondaryPanel = document.getElementById(secondaryTab.getAttribute('aria-controls') ?? '');

    expect(initialPanel).not.toHaveAttribute('hidden');
    expect(secondaryPanel).toHaveAttribute('hidden');
    expect(secondaryPanel).toHaveTextContent(text);
    expect(secondaryPanel).toHaveAttribute('aria-labelledby', secondaryTab.id);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    const ids = Array.from(container.querySelectorAll('[id]'), (node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);

    await user.click(secondaryTab);
    expect(secondaryPanel).not.toHaveAttribute('hidden');
    expect(initialPanel).toHaveAttribute('hidden');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);

    await user.click(initialTab);
    expect(initialPanel).not.toHaveAttribute('hidden');
    expect(secondaryPanel).toHaveAttribute('hidden');
    expect(secondaryPanel).toHaveTextContent(text);
  });
});

describe('Opening heroes in the static HTML', () => {
  // The hero is the largest paint, so it can't wait for scripts to reveal it.
  it('renders the showcase hero already visible', () => {
    const html = renderStaticHtml(
      <ProjectShowcase
        title='Static showcase'
        heroImage={{ src: '/hero.webp', alt: 'Static hero' }}
        roleBullets={['product engineering']}
        projectLink={{ href: 'https://example.com' }}
        sections={[{ title: 'Later section', body: <>Body</>, image: { src: '/one.webp', alt: 'One' } }]}
      />,
    );

    const hero = html.querySelector('[data-section-index="-1"]');
    expect(hero).toHaveClass('visible');
    expect(hero).toHaveAttribute('data-reveal', 'load');
    // Sections further down still boot up as they scroll in.
    expect(html.querySelector('[data-section-index="0"]')).not.toHaveClass('visible');
  });

  it('renders the About hero already visible', () => {
    const html = renderStaticHtml(<AboutContent />);

    expect(html.querySelector('[data-animate-id="about-hero"]')).toHaveClass('visible');
  });

  it.each([
    ['DemoStoke', DemoStokeContent],
    ['Antisyphon', AntisyphonContent],
    ['Nice Guy University', NiceGuyUniversityContent],
  ] as const)('renders the %s introduction already visible', (_name, Content) => {
    const html = renderStaticHtml(<Content />);

    const intro = html.querySelector('[data-animate-id="section-intro"]');
    expect(intro).toHaveClass('visible');
    expect(intro).toHaveAttribute('data-reveal', 'load');
  });
});
