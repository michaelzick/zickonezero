import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TrackedLink from '../src/components/TrackedLink';

type TestWindow = Window & {
  amplitude?: {
    track?: jest.Mock;
  };
};

describe('TrackedLink', () => {
  beforeEach(() => {
    delete (window as TestWindow).amplitude;
  });

  it('renders internal links with Next link semantics', () => {
    render(
      <TrackedLink href='/about' label='About' location='test'>
        About
      </TrackedLink>
    );

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });

  it('preserves external target and rel while tracking clicks', async () => {
    const user = userEvent.setup();
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };

    render(
      <TrackedLink
        href='https://github.com/michaelzick'
        label='GitHub'
        location='test'
        target='_blank'
      >
        GitHub
      </TrackedLink>
    );

    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    await user.click(link);

    expect(track).toHaveBeenCalledWith('link_click', expect.objectContaining({
      link_location: 'test',
      link_text: 'GitHub',
      link_url: 'https://github.com/michaelzick',
      link_external: true,
    }));
  });
});
