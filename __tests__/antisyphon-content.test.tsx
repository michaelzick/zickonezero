import { screen, within } from '@testing-library/react';
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

const INTRO_ROW_TOP_MARGIN_DECLARATION = 'clamp(1.75em, 3.5vw, 3em)';
const HERO_IMAGE_WRAP_TOP_MARGIN_DECLARATION = 'clamp(1.2em, 3vw, 1.75em)';
const normalizeDeclaration = (value: string) => value.replace(/\s+/g, '');

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
    const whatHeading = screen.getByRole('heading', { name: 'The What' });
    const methodsHeading = screen.getByRole('heading', { name: 'Methods / The UX Process' });
    const outcomeHeading = screen.getByRole('heading', { name: 'The Outcome' });
    const desktopTabs = screen.getByLabelText('Desktop page sections');
    const mobileTabs = screen.getByLabelText('Mobile page sections');
    const whatSection = document.getElementById('section-the-what');
    const methodsSection = document.getElementById('section-methodology');
    const outcomeSection = document.getElementById('section-outcome');
    const whatSectionEl = whatSection as HTMLElement;
    const methodsSectionEl = methodsSection as HTMLElement;
    const outcomeSectionEl = outcomeSection as HTMLElement;

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'UX Case Study' }));
    expect(screen.getByRole('tablist', { name: 'Page sections' })).toBeInTheDocument();
    expect(desktopTabs).toBeInTheDocument();
    expect(mobileTabs).toBeInTheDocument();
    expect(getTabLabels(desktopTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(getTabLabels(mobileTabs)).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(screen.queryByRole('button', { name: 'Outcome' })).not.toBeInTheDocument();
    expect(document.getElementById('section-links')).toBeNull();
    expect(heroHeading).toBeInTheDocument();
    expect(whatHeading).toBeInTheDocument();
    expect(heroHeading.querySelector('br')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open image: Antisyphon Training homepage with course cards' })).toBeInTheDocument();
    expect(whatSection).not.toBeNull();
    expect(whatSectionEl).toContainElement(whatHeading);
    expect(outcomeHeading).toBeInTheDocument();
    expect(outcomeSection).not.toBeNull();
    expect(methodsSection).not.toBeNull();
    expect(outcomeSectionEl).toHaveClass('story-section');
    expect(window.getComputedStyle(outcomeSectionEl).marginTop).toBe(window.getComputedStyle(methodsSectionEl).marginTop);
    expect(window.getComputedStyle(outcomeSectionEl).marginBottom).toBe(window.getComputedStyle(methodsSectionEl).marginBottom);
    expect(methodsHeading.compareDocumentPosition(outcomeHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('switches to product screens and preserves the new desktop section bar', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AntisyphonContent />);

    await user.click(screen.getByRole('tab', { name: 'Product Screens' }));

    const introHeading = screen.getByRole('heading', { name: 'Antisyphon Product Screens' });
    const introRow = introHeading.closest('div')?.parentElement as HTMLElement | null;
    const introSection = document.getElementById('screens-introduction');
    const introImageWrap = within(introSection as HTMLElement).getByRole('button', {
      name: 'Open image: Full course catalog with category filters and badges'
    }).parentElement as HTMLElement | null;

    expectDarkGreenActiveTab(screen.getByRole('tab', { name: 'Product Screens' }));
    expect(screen.getByLabelText('Desktop page sections')).toBeInTheDocument();
    expect(introHeading).toBeInTheDocument();
    expect(introRow).not.toBeNull();
    expect(introSection).not.toBeNull();
    expect(introImageWrap).not.toBeNull();
    expect(getMatchingRuleValues(introRow as HTMLElement, 'margin-top').map(normalizeDeclaration)).toContain(
      normalizeDeclaration(INTRO_ROW_TOP_MARGIN_DECLARATION)
    );
    expect(getMatchingRuleValues(introImageWrap as HTMLElement, 'margin-top').map(normalizeDeclaration)).toContain(
      normalizeDeclaration(HERO_IMAGE_WRAP_TOP_MARGIN_DECLARATION)
    );
    expect(screen.getByRole('link', { name: 'AntisyphonTraining.com' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Context', level: 2 })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Open image: Full course catalog with category filters and badges' }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Course Catalog' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cart & Checkout' })).toBeInTheDocument();
  });
});
