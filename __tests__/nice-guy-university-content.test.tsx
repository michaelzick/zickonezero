import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NiceGuyUniversityContent from '../src/components/NiceGuyUniversityContent';
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

describe('NiceGuyUniversityContent', () => {
  beforeEach(() => {
    applyTabThemeVariables();
  });

  afterEach(() => {
    clearTabThemeVariables();
  });

  it('renders the Nice Guy University case-study tab with section navigation', () => {
    renderWithProviders(<NiceGuyUniversityContent />);

    const heroHeading = screen.getByRole('heading', { name: 'Nice Guy University UX Case Study' });
    const desktopTabs = screen.getByLabelText('Desktop page sections');
    const mobileTabs = screen.getByLabelText('Mobile page sections');

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'UX Case Study' }));
    expect(screen.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    expect(getTabLabels(desktopTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(getTabLabels(mobileTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading.querySelector('br')).toBeInTheDocument();
    expect(screen.getAllByText(/turns the Nice Guy recovery coaching I do one-on-one into self-paced courses/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'NiceGuyUniversity.com' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open image: Nice Guy University homepage with hero and calls to action' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The What' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The How / Course Platform Experience' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Who / Audiences and Stakeholders' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Methods / The UX Process' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Outcome' })).toBeInTheDocument();
    expect(screen.getByLabelText('Nice Guy University screenshot carousel')).toBeInTheDocument();
    expect(screen.getByAltText('Nice Guy University course catalog with search and filters')).toBeInTheDocument();
  });

  it('switches to the product screens tab with the public screenshot set', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NiceGuyUniversityContent />);

    await user.click(screen.getByRole('tab', { name: 'Product Screens' }));

    const desktopTabs = screen.getByLabelText('Desktop page sections');
    const mobileTabs = screen.getByLabelText('Mobile page sections');

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'Product Screens' }));
    expect(screen.getByRole('heading', { name: 'Nice Guy University Product Screens' })).toBeInTheDocument();
    expect(getTabLabels(desktopTabs)).toEqual(['Overview', 'Course Discovery', 'Course Details', 'Support', 'Admin']);
    expect(getTabLabels(mobileTabs)).toEqual(['Overview', 'Course Discovery', 'Course Details', 'Support', 'Admin']);
    expect(screen.getByRole('link', { name: 'NiceGuyUniversity.com' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Open image: Nice Guy University homepage overview' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Platform Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Course Discovery' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Course Details' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Support Ecosystem' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Admin and Analytics' })).toBeInTheDocument();
    expect(screen.getByAltText('Nice Guy University Michael Zick coach profile screen')).toBeInTheDocument();
  });
});
