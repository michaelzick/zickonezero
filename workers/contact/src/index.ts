import { WorkerMailer } from 'worker-mailer';

import {
  buildContactEmail,
  consumeRateLimit,
  resolveAllowedOrigin,
  validateContactSubmission,
  type RateLimitEntry,
} from './contact';

export type Env = {
  BREVO_USER: string;
  BREVO_SMTP_PASSWORD: string;
  BREVO_FROM: string;
  BREVO_TO: string;
  ALLOWED_ORIGINS?: string;
};

const BREVO_SMTP_HOST = 'smtp-relay.brevo.com';
const BREVO_SMTP_PORT = 587;
const SMTP_TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 16_384;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

// Per-isolate, best-effort; see consumeRateLimit for the caveats.
const rateLimitStore = new Map<string, RateLimitEntry>();

const corsHeaders = (origin: string | null): HeadersInit => ({
  ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
});

const json = (body: Record<string, unknown>, status: number, origin: string | null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin),
    },
  });

const getMissingEnv = (env: Env) =>
  (['BREVO_USER', 'BREVO_SMTP_PASSWORD', 'BREVO_FROM', 'BREVO_TO'] as const).filter((key) => !env[key]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestOrigin = request.headers.get('Origin');
    const origin = resolveAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS ?? '');
    const requestId = crypto.randomUUID();

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed.' }, 405, origin);
    }

    // Browsers always send Origin on cross-site and same-origin POSTs with
    // fetch; reject anything that is not on the allowlist.
    if (!origin) {
      return json({ success: false, error: 'Origin not allowed.' }, 403, origin);
    }

    const clientIp = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const rateLimit = consumeRateLimit(rateLimitStore, clientIp, {
      windowMs: RATE_LIMIT_WINDOW_MS,
      maxRequests: RATE_LIMIT_MAX_REQUESTS,
    });
    if (!rateLimit.allowed) {
      const response = json({ success: false, error: 'Too many messages. Please try again in an hour.', requestId }, 429, origin);
      response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
      return response;
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return json({ success: false, error: 'Request body too large.' }, 413, origin);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return json({ success: false, error: 'Request body must be valid JSON.' }, 400, origin);
    }

    const validation = validateContactSubmission(body);
    if (!validation.ok) {
      if (validation.code === 'honeypot') {
        // Pretend success so bots do not learn which field tripped them.
        return json({ success: true, requestId }, 200, origin);
      }
      return json({ success: false, error: validation.error, requestId }, 400, origin);
    }

    const missing = getMissingEnv(env);
    if (missing.length) {
      console.error('Contact worker misconfigured', { requestId, missing });
      return json({ success: false, error: 'Email service not configured.', requestId }, 500, origin);
    }

    const { submission } = validation;
    const email = buildContactEmail(submission);

    let mailer: WorkerMailer | null = null;
    try {
      mailer = await WorkerMailer.connect({
        host: BREVO_SMTP_HOST,
        port: BREVO_SMTP_PORT,
        secure: false,
        startTls: true,
        authType: 'login',
        credentials: {
          username: env.BREVO_USER,
          password: env.BREVO_SMTP_PASSWORD,
        },
        socketTimeoutMs: SMTP_TIMEOUT_MS,
        responseTimeoutMs: SMTP_TIMEOUT_MS,
      });

      await mailer.send({
        from: { name: 'ZICKONEZERO Contact Form', email: env.BREVO_FROM },
        to: env.BREVO_TO,
        reply: { name: submission.name, email: submission.email },
        subject: email.subject,
        text: email.text,
      });

      console.log('Contact email sent', { requestId, messageLength: submission.message.length });
      return json({ success: true, requestId }, 200, origin);
    } catch (error) {
      console.error('Contact email failed', { requestId, error: error instanceof Error ? error.message : String(error) });
      return json({ success: false, error: 'Failed to send message. Please try again later.', requestId }, 502, origin);
    } finally {
      // Send QUIT so Brevo does not hold the connection open until it times out.
      await mailer?.close().catch(() => undefined);
    }
  },
} satisfies ExportedHandler<Env>;
