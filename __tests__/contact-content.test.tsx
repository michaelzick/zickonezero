import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactContent from '../src/components/ContactContent';
import FooterContent from '../src/components/FooterContent';
import LinkBoxContent from '../src/components/LinkBoxContent';
import LinkBoxMobileContent from '../src/components/LinkBoxMobileContent';
import { DEFAULT_CONTACT_ENDPOINT } from '../src/lib/contactForm';
import { renderWithProviders } from '../src/test/renderWithProviders';

type TestWindow = Window & { amplitude?: { track: jest.Mock } };

// jsdom has no global Response, so mimic the subset of the fetch Response
// contract that submitContactForm relies on.
const jsonResponse = (body: unknown, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });

const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Name'), 'Jane Doe');
  await user.type(screen.getByLabelText('Email'), 'jane@example.com');
  await user.type(screen.getByLabelText('Message'), 'Hello from the test suite.');
};

describe('ContactContent', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
    delete (window as TestWindow).amplitude;
  });

  it('shows a validation error without calling the endpoint', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactContent />);

    await user.click(screen.getByRole('button', { name: 'Send message' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Please enter your name.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the submission and shows the success state', async () => {
    const user = userEvent.setup();
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };
    fetchMock.mockImplementation(() => jsonResponse({ success: true }));

    renderWithProviders(<ContactContent />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Message sent'));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(DEFAULT_CONTACT_ENDPOINT);
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello from the test suite.',
      website: '',
    });
    expect(track).toHaveBeenCalledWith('contact_form_submit_started', expect.any(Object));
    expect(track).toHaveBeenCalledWith('contact_form_submit_succeeded', expect.any(Object));
    expect(screen.queryByRole('form', { name: 'Contact form' })).not.toBeInTheDocument();
  });

  it('surfaces server errors and keeps the form editable', async () => {
    const user = userEvent.setup();
    const track = jest.fn();
    (window as TestWindow).amplitude = { track };
    fetchMock.mockImplementation(() => jsonResponse({ success: false, error: 'Failed to send message. Please try again later.' }, 502));

    renderWithProviders(<ContactContent />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Failed to send message'));

    expect(screen.getByLabelText('Message')).toHaveValue('Hello from the test suite.');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeEnabled();
    expect(track).toHaveBeenCalledWith('contact_form_submit_failed', expect.objectContaining({
      failure_reason: 'email_delivery_failed',
    }));
  });

  it('shows a network error when the request cannot be made', async () => {
    const user = userEvent.setup();
    fetchMock.mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));

    renderWithProviders(<ContactContent />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('could not reach the server'));
  });
});

describe('Contact navigation links', () => {
  it('renders one internal Contact link in the desktop nav and one in the footer', () => {
    renderWithProviders(
      <>
        <LinkBoxContent />
        <FooterContent />
      </>
    );

    const contactLinks = screen.getAllByRole('link', { name: 'Contact' });
    expect(contactLinks).toHaveLength(2);
    contactLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/contact');
      expect(link).not.toHaveAttribute('target', '_blank');
    });

    const github = screen.getAllByRole('link', { name: /GitHub/ })[0];
    expect(github).toHaveAttribute('target', '_blank');
  });

  it('renders Contact only as a primary link in the mobile nav', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LinkBoxMobileContent isAnimating={false} />);

    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');

    await user.click(screen.getByRole('button', { name: 'Links' }));

    expect(screen.getAllByRole('link', { name: 'Contact' })).toHaveLength(1);
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank');
  });
});
