// Pure contact-form domain logic shared by the Worker handler and the Jest
// suite in the site repo. Keep this file free of Workers-only imports.

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  message: 4000,
} as const;

export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  // Honeypot: real users never fill this hidden field.
  website: string;
};

export type ContactValidation =
  | { ok: true; submission: ContactSubmission }
  | { ok: false; error: string; code: 'invalid_body' | 'validation_failed' | 'honeypot' };

// Intentionally simple: reject obviously malformed addresses without trying
// to fully implement RFC 5322.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readString = (value: unknown, max: number): string => {
  if (typeof value !== 'string') return '';
  return value.replace(/\r\n?/g, '\n').trim().slice(0, max + 1);
};

export function normalizeContactSubmission(body: unknown): ContactSubmission | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const record = body as Record<string, unknown>;

  return {
    name: readString(record.name, CONTACT_LIMITS.name),
    email: readString(record.email, CONTACT_LIMITS.email),
    message: readString(record.message, CONTACT_LIMITS.message),
    website: readString(record.website, 200),
  };
}

export function validateContactSubmission(body: unknown): ContactValidation {
  const submission = normalizeContactSubmission(body);
  if (!submission) {
    return { ok: false, code: 'invalid_body', error: 'Request body must be a JSON object.' };
  }

  if (submission.website) {
    return { ok: false, code: 'honeypot', error: 'Submission rejected.' };
  }

  if (!submission.name) {
    return { ok: false, code: 'validation_failed', error: 'Please enter your name.' };
  }
  if (submission.name.length > CONTACT_LIMITS.name) {
    return { ok: false, code: 'validation_failed', error: `Name must be ${CONTACT_LIMITS.name} characters or fewer.` };
  }

  if (!submission.email || submission.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(submission.email)) {
    return { ok: false, code: 'validation_failed', error: 'Please enter a valid email address.' };
  }

  if (!submission.message) {
    return { ok: false, code: 'validation_failed', error: 'Please enter a message.' };
  }
  if (submission.message.length > CONTACT_LIMITS.message) {
    return { ok: false, code: 'validation_failed', error: `Message must be ${CONTACT_LIMITS.message} characters or fewer.` };
  }

  return { ok: true, submission };
}

export type ContactEmail = {
  subject: string;
  text: string;
};

// Strip line breaks from anything that lands in a header so a submitter cannot
// inject extra headers through the subject line.
const singleLine = (value: string) => value.replace(/[\r\n]+/g, ' ').trim();

export function buildContactEmail(submission: ContactSubmission, submittedAt: Date = new Date()): ContactEmail {
  const subject = `ZICKONEZERO contact: ${singleLine(submission.name)}`;
  const text = [
    'New message from the zickonezero.com contact form.',
    '',
    `Name: ${singleLine(submission.name)}`,
    `Email: ${singleLine(submission.email)}`,
    `Sent: ${submittedAt.toISOString()}`,
    '',
    'Message:',
    submission.message,
    '',
  ].join('\n');

  return { subject, text };
}

export function resolveAllowedOrigin(requestOrigin: string | null, allowedOrigins: string): string | null {
  if (!requestOrigin) return null;
  const allowed = allowedOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return allowed.includes(requestOrigin) ? requestOrigin : null;
}

export type RateLimitEntry = { count: number; windowStart: number };

export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };

// Fixed-window counter kept in isolate memory. It is best-effort (each isolate
// has its own map and it resets on eviction), which is enough to blunt a
// runaway client without adding a KV dependency.
const RATE_LIMIT_PRUNE_THRESHOLD = 1000;

export function consumeRateLimit(
  store: Map<string, RateLimitEntry>,
  key: string,
  { windowMs, maxRequests, now = Date.now() }: { windowMs: number; maxRequests: number; now?: number },
): RateLimitResult {
  // Keep the map bounded: drop every expired window once it grows large.
  if (store.size >= RATE_LIMIT_PRUNE_THRESHOLD) {
    for (const [storedKey, entry] of store) {
      if (now - entry.windowStart >= windowMs) store.delete(storedKey);
    }
  }

  const existing = store.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= maxRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.windowStart + windowMs - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return { allowed: true, remaining: maxRequests - existing.count, retryAfterSeconds: 0 };
}
