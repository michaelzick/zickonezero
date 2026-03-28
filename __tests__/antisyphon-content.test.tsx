import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AntisyphonContent from '../src/components/AntisyphonContent';
import { renderWithProviders } from '../src/test/renderWithProviders';

describe('AntisyphonContent', () => {
  it('renders the showcase-style case study shell with desktop and mobile section navs', () => {
    renderWithProviders(<AntisyphonContent />);

    expect(screen.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile page sections')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Antisyphon UX Case Study' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open image: Antisyphon Training homepage with course cards' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Outcome' })).toBeInTheDocument();
  });

  it('switches to product screens and preserves the new desktop section bar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AntisyphonContent />);

    await user.click(screen.getByRole('tab', { name: 'Product Screens' }));

    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Antisyphon Product Screens' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Open image: Full course catalog with category filters and badges' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Course Catalog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cart & Checkout' })).toBeInTheDocument();
  });
});
