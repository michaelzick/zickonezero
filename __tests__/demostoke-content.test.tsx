import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DemoStokeContent from '../src/components/DemoStokeContent';
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

const INTRO_ROW_TOP_MARGIN_DECLARATION = 'clamp(1.75em, 3.5vw, 3em)';
const normalizeDeclaration = (value: string) => value.replace(/\s+/g, '');

const getTabLabels = (nav: HTMLElement) => Array.from(nav.querySelectorAll('button')).map((button) => button.textContent);

describe('DemoStokeContent', () => {
  beforeEach(() => {
    applyTabThemeVariables();
  });

  afterEach(() => {
    clearTabThemeVariables();
  });

  it('renders the refactored case-study view and removes the old why section', () => {
    renderWithProviders(<DemoStokeContent />);

    const heroHeading = screen.getByRole('heading', { name: 'DemoStoke UX Case Study' });
    const whatHeading = screen.getByRole('heading', { name: 'The What' });
    const methodsHeading = screen.getByRole('heading', { name: 'Methods / The UX Process' });
    const whoHeading = screen.getByRole('heading', { name: 'The Who / User Personas' });
    const theWhatImage = screen.getByAltText('DemoStoke global gear discovery collage');
    const whatSection = document.getElementById('section-the-what');

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'UX Case Study' }));
    expect(screen.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile page sections')).toBeInTheDocument();
    expect(heroHeading).toBeInTheDocument();
    expect(whatHeading).toBeInTheDocument();
    expect(heroHeading.querySelector('br')).toBeInTheDocument();
    expect(screen.getByAltText('DemoStoke homepage hero showing a surfer riding through the wave')).toBeInTheDocument();
    expect(screen.queryByLabelText('DemoStoke hero video')).not.toBeInTheDocument();
    expect(whoHeading).toBeInTheDocument();
    expect(screen.getByLabelText('DemoStoke screenshot carousel')).toBeInTheDocument();
    expect(methodsHeading).toBeInTheDocument();
    expect(whatSection).not.toBeNull();
    expect(whatSection).toContainElement(whatHeading);
    expect(whoHeading.compareDocumentPosition(methodsHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(getTabLabels(screen.getByLabelText('Desktop page sections'))).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(getTabLabels(screen.getByLabelText('Mobile page sections'))).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(theWhatImage).not.toHaveAttribute('role', 'button');
    expect(theWhatImage).not.toHaveAttribute('tabindex');
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

    const introHeading = screen.getByRole('heading', { name: 'DemoStoke User Stories' });
    const introRow = introHeading.closest('div')?.parentElement as HTMLElement | null;

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'User Stories' }));
    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(introHeading).toBeInTheDocument();
    expect(introRow).not.toBeNull();
    expect(getMatchingRuleValues(introRow as HTMLElement, 'margin-top').map(normalizeDeclaration)).toContain(
      normalizeDeclaration(INTRO_ROW_TOP_MARGIN_DECLARATION)
    );
    expect(screen.getByRole('link', { name: 'DemoStoke.com' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Independent Surfboard Shaper' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Weekend Warrior' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Small Ski & Bike Shop' })).toBeInTheDocument();
    expect(screen.getByAltText('Independent surfboard shaper with demo boards')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Open image: Independent surfboard shaper with demo boards' })).not.toBeInTheDocument();
    expect(screen.getAllByText('How DemoStoke Helps').length).toBeGreaterThan(0);
  });
});
