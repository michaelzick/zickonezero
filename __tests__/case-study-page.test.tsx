import fs from 'fs';
import path from 'path';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CaseStudyPage from '../src/components/caseStudy/CaseStudyPage';
import { type CaseStudyData } from '../src/components/caseStudy/types';
import { RACKLOOSE_CASE_STUDY } from '../src/components/rackloose/caseStudyData';
import { RIPTYDE_CASE_STUDY } from '../src/components/riptyde/caseStudyData';
import { renderWithProviders } from '../src/test/renderWithProviders';

const getTabLabels = (nav: HTMLElement) => Array.from(nav.querySelectorAll('button')).map((button) => button.textContent);

const STUDIES = [
  {
    study: RIPTYDE_CASE_STUDY,
    dataFile: 'src/components/riptyde/caseStudyData.tsx',
    heroLinks: ['App Store', 'Web App'],
    screensLink: 'riptyde.app',
    screensNav: ['Today', 'Score', 'Lineup', 'Cams', 'Profile', 'Web'],
  },
  {
    study: RACKLOOSE_CASE_STUDY,
    dataFile: 'src/components/rackloose/caseStudyData.tsx',
    heroLinks: ['Web App'],
    screensLink: 'www.rackloose.com',
    screensNav: ['Front', 'Patching', 'Instruments', 'Drums', 'Recording', 'Effects', 'Presets', 'Phone', 'Out There'],
  },
] as const;

const renderStudy = (study: CaseStudyData) => renderWithProviders(<CaseStudyPage study={study} />);

describe.each(STUDIES)('$study.name case study', ({ study, dataFile, heroLinks, screensLink, screensNav }) => {
  it('renders the UX Case Study tab with the shared section navigation', () => {
    renderStudy(study);

    const heroHeading = screen.getByRole('heading', { level: 1, name: `${study.name} UX Case Study` });
    expect(heroHeading.querySelector('br')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'UX Case Study' })).toHaveAttribute('aria-selected', 'true');
    expect(getTabLabels(screen.getByLabelText('Desktop page sections'))).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(getTabLabels(screen.getByLabelText('Mobile page sections'))).toEqual(['The What', 'The How', 'The Who', 'Methods']);
    expect(screen.getByRole('heading', { name: 'The What' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: `The How / ${study.how.heading}` })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Who / Audiences and Stakeholders' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Methods / The UX Process' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Outcome' })).toBeInTheDocument();
    expect(screen.getByLabelText(`${study.name} screenshot carousel`)).toBeInTheDocument();

    const intro = document.querySelector('[data-animate-id="section-intro"]') as HTMLElement;
    heroLinks.forEach((label, index) => {
      expect(within(intro).getByRole('link', { name: label })).toHaveAttribute('href', study.intro.links[index].href);
    });
  });

  // Each screenshot shows once on the UX Case Study tab, the hero included.
  it('never repeats an image on the UX Case Study tab', () => {
    renderStudy(study);

    const sources = Array.from(document.querySelectorAll('#case-study-content img'), (image) => image.getAttribute('src'));
    expect(sources.length).toBeGreaterThan(15);
    expect(new Set(sources).size).toBe(sources.length);
  });

  it('switches to the Product Screens tab with its own section navigation', async () => {
    const user = userEvent.setup();
    renderStudy(study);

    await user.click(screen.getByRole('tab', { name: 'Product Screens' }));

    expect(screen.getByRole('tab', { name: 'Product Screens' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: `${study.name} Product Screens` })).toBeInTheDocument();
    expect(getTabLabels(screen.getByLabelText('Desktop page sections'))).toEqual(screensNav);
    expect(getTabLabels(screen.getByLabelText('Mobile page sections'))).toEqual(screensNav);
    expect(screen.getByRole('link', { name: screensLink })).toHaveAttribute('href', study.screens.link.href);
    study.screens.blocks.forEach(({ title }) => {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    });

    // The screens tab adds shots the case study doesn't show.
    const caseStudySources = new Set(Array.from(document.querySelectorAll('#case-study-content img'), (image) => image.getAttribute('src')));
    const newShots = Array.from(document.querySelectorAll('#screens-content img'), (image) => image.getAttribute('src'))
      .filter((src) => !caseStudySources.has(src));
    expect(newShots.length).toBeGreaterThan(3);
  });

  it('keeps em dashes out of the copy', () => {
    expect(fs.readFileSync(path.join(process.cwd(), dataFile), 'utf8')).not.toContain('—');
  });
});

describe('Rackloose case study', () => {
  // Bar Four stays a secret: the case study hints at it without a link or its URL.
  it('hints at the hidden bar without pointing to it', () => {
    const { container } = renderStudy(RACKLOOSE_CASE_STUDY);

    expect(container.innerHTML).not.toMatch(/bar-four/i);
    expect(screen.getAllByText(/basement bar somewhere on this site/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Mike OS on michaelzick.com' })[0]).toHaveAttribute('href', 'https://www.michaelzick.com/');
  });
});
