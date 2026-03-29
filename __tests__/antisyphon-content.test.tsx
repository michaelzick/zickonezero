import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AntisyphonContent from '../src/components/AntisyphonContent';
import { renderWithProviders } from '../src/test/renderWithProviders';
import {
  ACTIVE_TAB_DECLARATION,
  ACTIVE_TAB_TEXT_DECLARATION,
  DEMOSTOKE_TAB_DECLARATION,
  applyTabThemeVariables,
  clearTabThemeVariables,
  getMatchingRuleValues,
} from '../src/test/tabTheme';

const expectDarkGreenActiveTab = (tab: HTMLElement) => {
  const backgroundRules = getMatchingRuleValues(tab, 'background-color');
  const borderRules = getMatchingRuleValues(tab, 'border-color');
  const colorRules = getMatchingRuleValues(tab, 'color');

  expect(backgroundRules).toContain(ACTIVE_TAB_DECLARATION);
  expect(borderRules).toContain(ACTIVE_TAB_DECLARATION);
  expect(colorRules).toContain(ACTIVE_TAB_TEXT_DECLARATION);
  expect(backgroundRules).not.toContain(DEMOSTOKE_TAB_DECLARATION);
  expect(borderRules).not.toContain(DEMOSTOKE_TAB_DECLARATION);
};

describe('AntisyphonContent', () => {
  beforeEach(() => {
    applyTabThemeVariables();
  });

  afterEach(() => {
    clearTabThemeVariables();
  });

  it('renders the showcase-style case study shell with desktop and mobile section navs', () => {
    renderWithProviders(<AntisyphonContent />);

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'UX Case Study' }));
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

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'Product Screens' }));
    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Antisyphon Product Screens' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Context', level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Open image: Full course catalog with category filters and badges' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Course Catalog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cart & Checkout' })).toBeInTheDocument();
  });
});
