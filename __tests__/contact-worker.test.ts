import {
  CONTACT_LIMITS,
  buildContactEmail,
  consumeRateLimit,
  resolveAllowedOrigin,
  validateContactSubmission,
  type RateLimitEntry,
} from '../workers/contact/src/contact';

const VALID_BODY = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello there',
  website: '',
};

describe('contact worker validation', () => {
  it('accepts a well-formed submission and trims whitespace', () => {
    const result = validateContactSubmission({ ...VALID_BODY, name: '  Jane Doe  ' });
    expect(result).toEqual({ ok: true, submission: { ...VALID_BODY } });
  });

  it.each([
    [null],
    ['string'],
    [[]],
  ])('rejects non-object bodies (%p)', (body) => {
    expect(validateContactSubmission(body)).toMatchObject({ ok: false, code: 'invalid_body' });
  });

  it('flags honeypot submissions', () => {
    expect(validateContactSubmission({ ...VALID_BODY, website: 'http://spam.example' }))
      .toMatchObject({ ok: false, code: 'honeypot' });
  });

  it.each([
    ['missing name', { name: '' }, 'name'],
    ['missing email', { email: '' }, 'email'],
    ['malformed email', { email: 'not-an-email' }, 'email'],
    ['missing message', { message: '   ' }, 'message'],
    ['oversized name', { name: 'a'.repeat(CONTACT_LIMITS.name + 1) }, 'Name must be'],
    ['oversized message', { message: 'a'.repeat(CONTACT_LIMITS.message + 1) }, 'Message must be'],
  ])('rejects %s', (_label, overrides, expectedFragment) => {
    const result = validateContactSubmission({ ...VALID_BODY, ...overrides });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe('validation_failed');
    expect(result.error.toLowerCase()).toContain(expectedFragment.toLowerCase());
  });
});

describe('buildContactEmail', () => {
  it('builds a subject and body and strips header line breaks from the name', () => {
    const email = buildContactEmail(
      { ...VALID_BODY, name: 'Jane\r\nBcc: evil@example.com', message: 'Line one\nLine two' },
      new Date('2026-09-03T12:00:00.000Z'),
    );

    expect(email.subject).toBe('ZICKONEZERO contact: Jane Bcc: evil@example.com');
    expect(email.subject).not.toMatch(/[\r\n]/);
    expect(email.text).toContain('Email: jane@example.com');
    expect(email.text).toContain('Sent: 2026-09-03T12:00:00.000Z');
    expect(email.text).toContain('Line one\nLine two');
  });
});

describe('resolveAllowedOrigin', () => {
  const allowed = 'https://www.zickonezero.com, https://zickonezero.com';

  it('returns the origin when it is on the allowlist', () => {
    expect(resolveAllowedOrigin('https://www.zickonezero.com', allowed)).toBe('https://www.zickonezero.com');
  });

  it('returns null for missing or unknown origins', () => {
    expect(resolveAllowedOrigin(null, allowed)).toBeNull();
    expect(resolveAllowedOrigin('https://evil.example', allowed)).toBeNull();
  });
});

describe('consumeRateLimit', () => {
  const options = { windowMs: 60_000, maxRequests: 2 };

  it('allows requests up to the limit inside a window and then rejects with a retry hint', () => {
    const store = new Map<string, RateLimitEntry>();

    expect(consumeRateLimit(store, 'ip', { ...options, now: 0 })).toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
    expect(consumeRateLimit(store, 'ip', { ...options, now: 1_000 })).toEqual({ allowed: true, remaining: 0, retryAfterSeconds: 0 });
    expect(consumeRateLimit(store, 'ip', { ...options, now: 30_000 })).toEqual({ allowed: false, remaining: 0, retryAfterSeconds: 30 });
  });

  it('resets once the window has elapsed and keeps keys independent', () => {
    const store = new Map<string, RateLimitEntry>();

    consumeRateLimit(store, 'a', { ...options, now: 0 });
    consumeRateLimit(store, 'a', { ...options, now: 0 });
    expect(consumeRateLimit(store, 'b', { ...options, now: 0 }).allowed).toBe(true);
    expect(consumeRateLimit(store, 'a', { ...options, now: 59_999 }).allowed).toBe(false);
    expect(consumeRateLimit(store, 'a', { ...options, now: 60_000 })).toEqual({ allowed: true, remaining: 1, retryAfterSeconds: 0 });
  });
});
