import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DemoStokeContent from '../src/components/DemoStokeContent';
import AntisyphonContent from '../src/components/AntisyphonContent';
import NiceGuyUniversityContent from '../src/components/NiceGuyUniversityContent';
import { renderWithProviders } from '../src/test/renderWithProviders';

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
