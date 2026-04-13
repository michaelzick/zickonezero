import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ProjectShowcase from '../src/components/ProjectShowcase';
import { renderWithProviders } from '../src/test/renderWithProviders';

jest.mock('fslightbox-react', () => function MockFsLightbox(props: {
  toggler: boolean;
  slide: number;
  sources: string[];
}) {
  return (
    <div
      data-testid='project-showcase-lightbox'
      data-slide={String(props.slide)}
      data-source-count={String(props.sources.length)}
      data-toggler={String(props.toggler)}
    />
  );
});

describe('ProjectShowcase', () => {
  it('renders section screenshots as real lightbox buttons', () => {
    renderWithProviders(
      <ProjectShowcase
        title='Test Showcase'
        summary='A focused test fixture.'
        heroImage={{ src: '/img/projects/fyfs/fyfs-wave.webp', alt: 'Hero image' }}
        roleBullets={['UX design']}
        projectLink={{ href: 'https://example.com', label: 'example.com' }}
        sections={[
          {
            title: 'First section',
            body: <>First section body</>,
            image: { src: '/img/projects/fyfs/fyfs-home.webp', alt: 'First mock screenshot' }
          },
          {
            title: 'Second section',
            body: <>Second section body</>,
            image: { src: '/img/projects/fyfs/fyfs-results.webp', alt: 'Second mock screenshot' }
          }
        ]}
      />
    );

    const firstButton = screen.getByRole('button', { name: 'Open image: First mock screenshot' });
    const secondButton = screen.getByRole('button', { name: 'Open image: Second mock screenshot' });
    const firstImage = screen.getByAltText('First mock screenshot');
    const secondImage = screen.getByAltText('Second mock screenshot');

    expect(firstButton).toBeInTheDocument();
    expect(secondButton).toBeInTheDocument();
    expect(firstImage.closest('button')).toBe(firstButton);
    expect(secondImage.closest('button')).toBe(secondButton);
    expect(firstImage).not.toHaveAttribute('role');
    expect(firstImage).not.toHaveAttribute('tabindex');
    expect(secondImage).not.toHaveAttribute('role');
    expect(secondImage).not.toHaveAttribute('tabindex');
  });

  it('opens the lightbox on the matching slide when a screenshot is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ProjectShowcase
        title='Test Showcase'
        summary='A focused test fixture.'
        heroImage={{ src: '/img/projects/fyfs/fyfs-wave.webp', alt: 'Hero image' }}
        roleBullets={['UX design']}
        projectLink={{ href: 'https://example.com', label: 'example.com' }}
        sections={[
          {
            title: 'First section',
            body: <>First section body</>,
            image: { src: '/img/projects/fyfs/fyfs-home.webp', alt: 'First mock screenshot' }
          },
          {
            title: 'Second section',
            body: <>Second section body</>,
            image: { src: '/img/projects/fyfs/fyfs-results.webp', alt: 'Second mock screenshot' }
          }
        ]}
      />
    );

    const lightbox = screen.getByTestId('project-showcase-lightbox');

    expect(lightbox).toHaveAttribute('data-slide', '1');
    expect(lightbox).toHaveAttribute('data-source-count', '2');
    expect(lightbox).toHaveAttribute('data-toggler', 'false');

    await user.click(screen.getByRole('button', { name: 'Open image: Second mock screenshot' }));

    expect(lightbox).toHaveAttribute('data-slide', '2');
    expect(lightbox).toHaveAttribute('data-toggler', 'true');
  });
});
