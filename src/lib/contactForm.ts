// Client-side contact form helpers. Server-side validation lives in the
// Cloudflare Worker under workers/contact; this only gives fast feedback.

export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '/api/contact';

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export const EMPTY_CONTACT_FORM: ContactFormValues = {
  name: '',
  email: '',
  message: '',
  website: '',
};

export type ContactSubmitResult =
  | { ok: true }
  | { ok: false; reason: ContactFailureReason; message: string };

export type ContactFailureReason =
  | 'validation_failed'
  | 'service_unavailable'
  | 'email_delivery_failed'
  | 'network_error'
  | 'unknown';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getContactValidationError(values: ContactFormValues): string | null {
  if (!values.name.trim()) return 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) return 'Please enter a valid email address.';
  if (!values.message.trim()) return 'Please enter a message.';
  return null;
}

const reasonForStatus = (status: number): ContactFailureReason => {
  if (status === 400 || status === 413) return 'validation_failed';
  if (status === 500 || status === 503) return 'service_unavailable';
  if (status === 502) return 'email_delivery_failed';
  return 'unknown';
};

const GENERIC_FAILURE = 'Something went wrong sending your message. Please try again in a moment.';

export async function submitContactForm(
  values: ContactFormValues,
  signal?: AbortSignal,
): Promise<ContactSubmitResult> {
  let response: Response;

  try {
    response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        website: values.website,
      }),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    return { ok: false, reason: 'network_error', message: 'We could not reach the server. Check your connection and try again.' };
  }

  const data = await response.json().catch(() => null) as { success?: boolean; error?: string } | null;

  if (response.ok && data?.success) {
    return { ok: true };
  }

  return {
    ok: false,
    reason: reasonForStatus(response.status),
    message: typeof data?.error === 'string' && data.error ? data.error : GENERIC_FAILURE,
  };
}
