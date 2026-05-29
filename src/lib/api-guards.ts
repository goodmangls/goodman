export type OriginGuardResult =
  | { ok: true }
  | { ok: false; reason: string };

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSec: number };

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitBucket>();

function safeUrlOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function resolveAllowlist(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const env = process.env.VERCEL_ENV;
  const url = process.env.VERCEL_URL;

  const dynamic: string[] = [];
  if (env === 'preview' && url) {
    dynamic.push(`https://${url}`);
  }
  if (env === 'development' || !env) {
    dynamic.push('http://localhost:3000');
  }

  return [...fromEnv, ...dynamic];
}

function logRejection(kind: 'origin' | 'rate', detail: string): void {
  console.warn(`[api-guards] reject ${kind}: ${detail}`);
}

export function assertAllowedOrigin(request: Request): OriginGuardResult {
  const allowlist = resolveAllowlist();
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  if (origin) {
    if (allowlist.includes(origin)) return { ok: true };
    const reason = `origin=${origin}`;
    logRejection('origin', reason);
    return { ok: false, reason };
  }

  if (referer) {
    const refOrigin = safeUrlOrigin(referer);
    if (refOrigin && allowlist.includes(refOrigin)) return { ok: true };
    const reason = `referer=${referer}`;
    logRejection('origin', reason);
    return { ok: false, reason };
  }

  const reason = 'no-origin-no-referer';
  logRejection('origin', reason);
  return { ok: false, reason };
}

export function enforceRateLimit(
  ip: string,
  now: number = Date.now(),
): RateLimitResult {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const max = Number(process.env.RATE_LIMIT_MAX ?? 5);

  const bucket = buckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (bucket.count >= max) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    logRejection('rate', `ip=${ip} retry=${retryAfterSec}s`);
    return { ok: false, retryAfterSec };
  }

  bucket.count += 1;
  return { ok: true };
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return 'unknown';
}

export function __resetRateLimitForTests(): void {
  buckets.clear();
}
