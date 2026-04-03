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

const getTabLabels = (nav: HTMLElement) => Array.from(nav.querySelectorAll('button')).map((button) => button.textContent);

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

    const heroHeading = screen.getByRole('heading', { name: 'Antisyphon UX Case Study' });
    const methodsHeading = screen.getByRole('heading', { name: 'Methods / The UX Process' });
    const outcomeHeading = screen.getByRole('heading', { name: 'The Outcome' });
    const linksHeading = screen.getByRole('heading', { name: 'Links', level: 2 });
    const desktopTabs = screen.getByLabelText('Desktop page sections');
    const mobileTabs = screen.getByLabelText('Mobile page sections');

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'UX Case Study' }));
    expect(screen.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    expect(desktopTabs).toBeInTheDocument();
    expect(mobileTabs).toBeInTheDocument();
    expect(getTabLabels(desktopTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(getTabLabels(mobileTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(screen.queryByRole('button', { name: 'Outcome' })).not.toBeInTheDocument();
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading.querySelector('br')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open image: Antisyphon Training homepage with course cards' })).toBeInTheDocument();
    expect(outcomeHeading).toBeInTheDocument();
    expect(methodsHeading.compareDocumentPosition(outcomeHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(outcomeHeading.compareDocumentPosition(linksHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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
