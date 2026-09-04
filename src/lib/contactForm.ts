// Client-side contact form helpers. Server-side validation lives in the
// Cloudflare Worker under workers/contact; this only gives fast feedback.

// The zickonezero.com zone lives outside the Cloudflare account that hosts the
// Worker, so production calls the workers.dev hostname cross-origin (the Worker
// allowlists the site origins). Override with NEXT_PUBLIC_CONTACT_ENDPOINT, e.g.
// http://localhost:8787/api/contact when running `wrangler dev` locally.
export const DEFAULT_CONTACT_ENDPOINT = 'https://zickonezero-contact.zickonezero.workers.dev/api/contact';
export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || DEFAULT_CONTACT_ENDPOINT;

// Mirrors CONTACT_LIMITS in workers/contact/src/contact.ts so the browser stops
// input at the same point the Worker would reject it.
export const CONTACT_FIELD_LIMITS = {
  name: 120,
  email: 254,
  message: 4000,
} as const;

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
  | 'rate_limited'
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
  if (status === 429) return 'rate_limited';
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
