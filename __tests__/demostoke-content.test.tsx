import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DemoStokeContent from '../src/components/DemoStokeContent';
import { renderWithProviders } from '../src/test/renderWithProviders';

describe('DemoStokeContent', () => {
  it('renders the refactored case-study view and removes the old why section', () => {
    renderWithProviders(<DemoStokeContent />);

    expect(screen.getByLabelText('DemoStoke hero video')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Who / User Personas' })).toBeInTheDocument();
    expect(screen.getByLabelText('DemoStoke screenshot carousel')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Methods / The UX Process' })).toBeInTheDocument();
    expect(screen.queryByText(/The Why \/ How It Started/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'The Why' })).not.toBeInTheDocument();
    expect(document.getElementById('section-the-why')).not.toBeInTheDocument();
  });

  it('keeps user persona accordions interactive', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DemoStokeContent />);

    const accordionButton = screen.getByRole('button', { name: 'Weekend Warrior' });
    expect(accordionButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(accordionButton);

    expect(accordionButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Rachel \(34, San Diego\)/i)).toBeInTheDocument();
  });

  it('switches to the user stories tab and preserves story content', async () => {
    const user = userEvent.setup();
    renderWithProviders(<DemoStokeContent />);

    await user.click(screen.getByRole('tab', { name: 'User Stories' }));

    expect(screen.getByRole('heading', { name: 'The Independent Surfboard Shaper' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Weekend Warrior' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Small Ski & Bike Shop' })).toBeInTheDocument();
    expect(screen.getAllByText('How DemoStoke Helps').length).toBeGreaterThan(0);
  });
});
