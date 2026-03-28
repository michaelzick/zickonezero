import AboutContent from '../src/components/AboutContent';
import MainContent from '../src/components/MainContent';
import worksData from '../pages/api/worksData.json';
import { renderWithProviders } from '../src/test/renderWithProviders';
import { screen } from '@testing-library/react';

describe('Home and About visuals', () => {
  it('renders the homepage Demostoke scroller instead of the old Mt. Hood illustration', () => {
    renderWithProviders(<MainContent />, {
      preloadedState: {
        data: {
          worksDataReversed: worksData,
        },
        isMobileMenuShown: {
          isMobileMenuShown: false,
        },
      },
    });

    expect(screen.getByLabelText('Demostoke screenshot scroller')).toBeInTheDocument();
    expect(screen.getByAltText('DemoStoke hybrid catalog and map view')).toBeInTheDocument();
    expect(screen.queryByAltText('Illustrated self-portrait near Mt. Hood')).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Case Studies' }).length).toBeGreaterThan(0);
  });

  it('renders the About page as a full-bleed hero without the old inline photo', () => {
    renderWithProviders(<AboutContent />);

    expect(screen.getByLabelText('About page hero')).toBeInTheDocument();
    expect(screen.getByText(/Michael is a results-oriented Product Leader/i)).toBeInTheDocument();
    expect(screen.queryByAltText('Mt. Hood Selfie')).not.toBeInTheDocument();
  });
});
