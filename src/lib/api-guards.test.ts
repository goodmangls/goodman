import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetRateLimitForTests,
  assertAllowedOrigin,
  enforceRateLimit,
  getClientIp,
} from './api-guards';

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('https://example.test/api/contact', {
    method: 'POST',
    headers,
  });
}

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
  // 테스트 격리를 위해 가드와 무관한 env 만 제거
  delete process.env.ALLOWED_ORIGINS;
  delete process.env.VERCEL_ENV;
  delete process.env.VERCEL_URL;
  delete process.env.RATE_LIMIT_MAX;
  delete process.env.RATE_LIMIT_WINDOW_MS;
  __resetRateLimitForTests();
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

describe('assertAllowedOrigin', () => {
  it('[happy] allows Origin in ALLOWED_ORIGINS', () => {
    process.env.ALLOWED_ORIGINS = 'https://goodman-gls.vercel.app';
    const req = makeRequest({ origin: 'https://goodman-gls.vercel.app' });
    expect(assertAllowedOrigin(req)).toEqual({ ok: true });
  });

  it('[reject-origin] rejects unknown Origin', () => {
    process.env.ALLOWED_ORIGINS = 'https://goodman-gls.vercel.app';
    const req = makeRequest({ origin: 'https://evil.example.com' });
    const result = assertAllowedOrigin(req);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('origin=https://evil.example.com');
  });

  it('[fallback-referer] falls back to Referer host when Origin missing', () => {
    process.env.ALLOWED_ORIGINS = 'https://goodman-gls.vercel.app';
    const req = makeRequest({
      referer: 'https://goodman-gls.vercel.app/contact',
    });
    expect(assertAllowedOrigin(req)).toEqual({ ok: true });
  });

  it('[reject-referer] rejects Referer from unknown host', () => {
    process.env.ALLOWED_ORIGINS = 'https://goodman-gls.vercel.app';
    const req = makeRequest({ referer: 'https://evil.example.com/page' });
    const result = assertAllowedOrigin(req);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain('referer=');
  });

  it('[no-headers] rejects when both Origin and Referer are absent', () => {
    process.env.ALLOWED_ORIGINS = 'https://goodman-gls.vercel.app';
    const req = makeRequest({});
    const result = assertAllowedOrigin(req);
    expect(result).toEqual({ ok: false, reason: 'no-origin-no-referer' });
  });

  it('[vercel-preview] allows dynamic VERCEL_URL on preview', () => {
    process.env.VERCEL_ENV = 'preview';
    process.env.VERCEL_URL = 'goodman-gls-abc.vercel.app';
    const req = makeRequest({ origin: 'https://goodman-gls-abc.vercel.app' });
    expect(assertAllowedOrigin(req)).toEqual({ ok: true });
  });

  it('[dev-default] allows http://localhost:3000 on development', () => {
    process.env.VERCEL_ENV = 'development';
    const req = makeRequest({ origin: 'http://localhost:3000' });
    expect(assertAllowedOrigin(req)).toEqual({ ok: true });
  });

  it('[multi-allowlist] accepts any origin in comma-separated list', () => {
    process.env.ALLOWED_ORIGINS = 'https://a.com,https://b.com';
    const req = makeRequest({ origin: 'https://b.com' });
    expect(assertAllowedOrigin(req)).toEqual({ ok: true });
  });
});

describe('enforceRateLimit', () => {
  it('[happy] allows first request for new IP', () => {
    expect(enforceRateLimit('1.2.3.4', 1000)).toEqual({ ok: true });
  });

  it('[under-limit] allows up to MAX requests within window', () => {
    process.env.RATE_LIMIT_MAX = '5';
    for (let i = 0; i < 5; i++) {
      expect(enforceRateLimit('1.2.3.4', 1000 + i)).toEqual({ ok: true });
    }
  });

  it('[over-limit] rejects 6th request with positive retryAfterSec', () => {
    process.env.RATE_LIMIT_MAX = '5';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    for (let i = 0; i < 5; i++) enforceRateLimit('1.2.3.4', 1000 + i);
    const result = enforceRateLimit('1.2.3.4', 1010);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it('[window-expiry] resets bucket after resetAt', () => {
    process.env.RATE_LIMIT_MAX = '5';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    for (let i = 0; i < 5; i++) enforceRateLimit('1.2.3.4', 1000 + i);
    expect(enforceRateLimit('1.2.3.4', 1010)).toMatchObject({ ok: false });
    // window 만료 후 다시 ok
    expect(enforceRateLimit('1.2.3.4', 1_000 + 60_000 + 1)).toEqual({ ok: true });
  });

  it('[ip-isolation] does not affect a different IP', () => {
    process.env.RATE_LIMIT_MAX = '5';
    for (let i = 0; i < 5; i++) enforceRateLimit('1.1.1.1', 1000 + i);
    expect(enforceRateLimit('2.2.2.2', 1010)).toEqual({ ok: true });
  });

  it('[retry-after-ceil] ceils retryAfterSec from ms remainder', () => {
    process.env.RATE_LIMIT_MAX = '1';
    process.env.RATE_LIMIT_WINDOW_MS = '60000';
    enforceRateLimit('1.2.3.4', 1000); // resetAt = 61000
    // now = 55_600 → resetAt - now = 5400ms → ceil(5.4) = 6
    const result = enforceRateLimit('1.2.3.4', 55_600);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.retryAfterSec).toBe(6);
  });
});

describe('getClientIp', () => {
  it('[xff-single] returns single x-forwarded-for value', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4' });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('[xff-chain] returns first ip from comma chain', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' });
    expect(getClientIp(req)).toBe('1.2.3.4');
  });

  it('[xff-absent] returns "unknown" when header missing', () => {
    const req = makeRequest({});
    expect(getClientIp(req)).toBe('unknown');
  });
});
