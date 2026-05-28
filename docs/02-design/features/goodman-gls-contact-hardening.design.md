---
template: design
version: 1.2
feature: goodman-gls-contact-hardening
date: 2026-05-28
author: jhlim725
project: goodman-gls
project_version: 0.1.0
---

# goodman-gls-contact-hardening Design Document

> **Summary**: `/api/contact` 핸들러 앞단에 (1) Origin/Referer 화이트리스트 가드와 (2) 메모리 기반 sliding-window IP rate limit을 적용한다. 헬퍼는 `src/lib/api-guards.ts` 로 분리해 재사용·테스트 가능하게 한다.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-28
> **Status**: Draft
> **Planning Doc**: [goodman-gls-contact-hardening.plan.md](../../01-plan/features/goodman-gls-contact-hardening.plan.md)

### Pipeline References

| Phase | Document | Status |
|-------|----------|--------|
| Phase 1 (Schema) | — | N/A (스키마 변경 없음) |
| Phase 2 (Convention) | — | N/A (별도 conventions.md 없음, CLAUDE.md 의존) |
| Phase 3 (Mockup) | — | N/A (UI 변경 없음) |
| Phase 4 (API Spec) | 본 문서 §4 | ✅ |

---

## 1. Overview

### 1.1 Design Goals

1. 외부 origin POST 차단 → Resend 쿼터·메일 abuse 방지
2. 동일 IP 단기 폭주 차단 → 사용자 체감 응답 안정
3. 비파괴: 기존 same-origin form submit 흐름 100% 호환
4. 외부 의존 0 (Vercel 단일 인스턴스 효과만이라도 즉시 확보, Redis는 후속 사이클)
5. 헬퍼 분리로 향후 POST 라우트(`/api/quote` 등)에서 재사용

### 1.2 Design Principles

- **Fail-safe default**: `ALLOWED_ORIGINS` 미설정 시 모든 cross-origin 거부 (preview 환경만 자동 허용)
- **Pure helper**: `Date.now()` 외 부수효과 없음 — 단위 테스트 용이
- **Backward compatible**: route 시그니처·정상 응답 본문 유지, 추가는 거부 케이스(403, 429)만
- **Observable**: 거부는 `console.warn` 로그 (Vercel runtime logs 검색 가능)
- **Convention-aligned**: NextResponse.json 패턴 + Zod schema 흐름 유지

---

## 2. Architecture

### 2.1 Component Diagram

```
 ┌──────────────────┐   POST /api/contact   ┌──────────────────────────────┐
 │ ContactSection   │ ─────────────────────▶│ route.ts (POST handler)      │
 │ (browser, RHF)   │   Origin / Referer    │                              │
 └──────────────────┘                       │  ┌────────────────────────┐  │
                                            │  │ assertAllowedOrigin()  │  │   403
                                            │  └────────────────────────┘  │ ────▶ client
                                            │             │ pass            │
                                            │             ▼                 │
                                            │  ┌────────────────────────┐  │
                                            │  │ enforceRateLimit(ip)   │  │   429 + Retry-After
                                            │  └────────────────────────┘  │ ────▶ client
                                            │             │ pass            │
                                            │             ▼                 │
                                            │  ┌────────────────────────┐  │
                                            │  │ Zod safeParse → Resend │  │   200 / 400 / 502
                                            │  └────────────────────────┘  │
                                            └──────────────────────────────┘
```

### 2.2 Data Flow

```
Browser POST
  → assertAllowedOrigin(req)           ← Origin || Referer host vs allowlist
  → enforceRateLimit(ip)               ← in-process Map (sliding window)
  → contactFormSchema.safeParse(body)  ← 기존
  → resend.emails.send(...)            ← 기존
  → 200 { ok: true }                   ← 기존
```

### 2.3 Dependencies

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| `route.ts` | `lib/api-guards.ts`, `lib/validations/contact.ts`, `resend` | POST 처리 |
| `lib/api-guards.ts` | none (Web `Request`, `Date.now()`만) | 가드 헬퍼 |
| 테스트 | `vitest` (신규 도입) | 단위 검증 |

---

## 3. Data Model

본 사이클은 영속 데이터 모델을 추가하지 않는다. 메모리 카운터만 정의:

```typescript
type RateLimitBucket = {
  count: number;
  resetAt: number; // epoch ms — window 종료 시점
};

// 모듈 내부 전역 (instance scope)
const buckets = new Map<string, RateLimitBucket>();
```

| 필드 | 타입 | 의미 |
|------|------|------|
| `count` | `number` | 현재 window 내 누적 요청 수 |
| `resetAt` | `number` | window 만료 epoch ms — 이 시각 이후 첫 요청에서 bucket 리셋 |

수명: instance scope. cold start마다 초기화 (Vercel serverless 특성). 분산 정합성은 out of scope.

---

## 4. API Specification

### 4.1 Endpoint List

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/contact | Contact form 메일 전송 | None (Origin/Referer 가드 + rate limit) |

### 4.2 Detailed Specification

#### `POST /api/contact`

**기존 동작 (변경 없음)**
- Request body: `{ name, email, message }` (Zod 검증)
- Success: `200 { ok: true }`
- Validation error: `400 { error: 'Validation failed', issues }`
- Resend error: `502 { error: 'Failed to send email' }`
- 환경변수 미설정: `500 { error: 'Email service not configured' }`

**신규 추가 응답**

| Status | Body | Headers | 조건 |
|--------|------|---------|------|
| `403` | `{ error: 'Origin not allowed' }` | — | Origin/Referer 헤더가 ALLOWED_ORIGINS 외 또는 둘 다 부재 |
| `429` | `{ error: 'Too many requests', retryAfterSec: number }` | `Retry-After: <sec>` | 동일 IP rate limit 초과 |

**검증 순서 (위에서 아래로, 첫 실패에서 즉시 응답)**

1. `assertAllowedOrigin(request)` → 실패 시 403
2. `enforceRateLimit(ip)` → 실패 시 429
3. JSON parse → 실패 시 400
4. `contactFormSchema.safeParse` → 실패 시 400
5. 환경변수 검사 → 실패 시 500
6. Resend send → 실패 시 502
7. 성공 → 200

> **주의**: 환경변수 검사가 (3)~(5)에 있던 기존 코드보다 뒤로 밀린 이유는 spam abuse가 환경변수 누락 메시지로부터 구성 정보를 얻지 못하게 하기 위함. 가드 통과 + body validation 통과 시점에 한해 환경변수 메시지 노출.

---

## 5. UI/UX Design

UI 변경 없음. `ContactSection.tsx` 는 기존 fetch 호출 그대로 유지. 다만 후속 task로 다음 사용자 메시지 패턴은 권장 (이번 사이클 out of scope, mention만):

- `429` 응답 시 "Please try again in a moment."
- `403` 응답은 정상 사용자 경로에서는 발생하지 않으므로 generic error UI 재사용

---

## 6. Error Handling

### 6.1 Error Response Format

```typescript
type ContactErrorBody =
  | { error: 'Origin not allowed' }
  | { error: 'Too many requests'; retryAfterSec: number }
  | { error: 'Invalid JSON' }
  | { error: 'Validation failed'; issues: ZodIssue[] }
  | { error: 'Email service not configured' }
  | { error: 'Failed to send email' };
```

### 6.2 Observability

거부 시 `console.warn` 한 줄 로그 (production logger 미도입 상태). 향후 PostHog/Sentry 도입 시 sink 교체 지점은 `lib/api-guards.ts` 내부 단일 함수:

```typescript
function logRejection(kind: 'origin' | 'rate', detail: string) {
  // eslint-disable-next-line no-console
  console.warn(`[api-guards] reject ${kind}: ${detail}`);
}
```

---

## 7. Security Considerations

### 7.1 Origin/Referer 가드 알고리즘

```typescript
// 의사코드
function assertAllowedOrigin(req: Request): { ok: true } | { ok: false; reason: string } {
  const allowlist = resolveAllowlist();  // env + vercel preview 동적 추가
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // 1. Origin 우선
  if (origin) {
    return allowlist.includes(origin)
      ? { ok: true }
      : { ok: false, reason: `origin=${origin}` };
  }

  // 2. Referer fallback (origin 부재인 일부 브라우저 navigation)
  if (referer) {
    const refOrigin = safeUrlOrigin(referer);
    if (refOrigin && allowlist.includes(refOrigin)) return { ok: true };
    return { ok: false, reason: `referer=${referer}` };
  }

  // 3. 둘 다 부재 — 브라우저 form post가 아닌 server-to-server 호출 → reject
  return { ok: false, reason: 'no-origin-no-referer' };
}
```

### 7.2 Allowlist 해석

```typescript
function resolveAllowlist(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const env = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development' | undefined
  const url = process.env.VERCEL_URL; // e.g., 'goodman-gls-abc123.vercel.app' (no scheme)

  const dynamic: string[] = [];
  if (env === 'preview' && url) dynamic.push(`https://${url}`);
  if (env === 'development' || !env) dynamic.push('http://localhost:3000');

  return [...fromEnv, ...dynamic];
}
```

**확정값 (2026-05-28 사용자 확정)**:
| 환경 | 값 |
|------|---|
| production `ALLOWED_ORIGINS` | `https://goodman-gls.vercel.app` (Vercel 기본 도메인만, custom domain 도입 시 추가 사이클) |
| preview | 동적: `https://${VERCEL_URL}` |
| development | `http://localhost:3000` (default) |

### 7.3 Rate limit 알고리즘 (Sliding-window — fixed window 변형)

```typescript
// 의사코드
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const MAX = Number(process.env.RATE_LIMIT_MAX ?? 5);

function enforceRateLimit(ip: string, now = Date.now()):
  { ok: true } | { ok: false; retryAfterSec: number } {
  const bucket = buckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (bucket.count >= MAX) {
    const retryAfterSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    return { ok: false, retryAfterSec };
  }

  bucket.count += 1;
  return { ok: true };
}
```

> 정확히는 "fixed window"이나 cleanup 비용이 적고 burst 차단 효과는 동일. cleanup은 lazy(요청 시 만료 확인) 만으로 충분.

### 7.4 IP 추출

```typescript
function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  // Vercel runtime은 req.ip 미제공 (Node runtime). edge runtime 사용 시에만 가능 — 본 라우트는 Node.
  return 'unknown';
}
```

스푸핑 위험: `x-forwarded-for` 헤더는 클라이언트가 임의 설정 가능. Vercel proxy를 통과한 요청은 Vercel이 첫 항목을 신뢰 가능한 값으로 채우지만, raw request에서는 보장 불가. 완전 차단은 out of scope. mitigation은 PR description에 명기.

### 7.5 OWASP 매핑

- A04 (Insecure Design): 가드 layer 도입으로 완화
- A05 (Security Misconfiguration): env 명시적 fail-safe로 완화
- A07 (Identification and Authentication Failures): 본 라우트는 비로그인 form, 해당 없음
- A09 (Security Logging Failures): `console.warn` 1차, production logger sink 도입은 별도 사이클

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | 설명 |
|------|--------|------|------|
| Unit | `lib/api-guards.ts` 헬퍼 | Vitest (신규 도입) | pure 함수, 외부 의존 없음 |
| Manual (PR) | `POST /api/contact` cross-origin curl | curl | preview deploy에서 검증 |
| Manual (PR) | rate limit 429 | curl loop | preview에서 6회 빠르게 |

> **Plan 정정**: Plan 6.2에 "Jest (next 기본)" 적었으나 실제 프로젝트에 jest 미설치. 가벼운 Vitest 도입으로 정정한다. Vitest는 zero-config + Node 환경만 사용해 jsdom 없이 동작 가능.

### 8.2 Test Cases

#### `assertAllowedOrigin`

- [ ] [happy] `ALLOWED_ORIGINS='https://goodman-gls.vercel.app'` + `Origin: https://goodman-gls.vercel.app` → ok
- [ ] [reject-origin] 위 설정 + `Origin: https://evil.example.com` → reject, reason 포함
- [ ] [fallback-referer] Origin 부재 + `Referer: https://goodman-gls.vercel.app/contact` → ok
- [ ] [reject-referer] Origin 부재 + `Referer: https://evil.example.com/...` → reject
- [ ] [no-headers] Origin / Referer 둘 다 부재 → reject (`reason: 'no-origin-no-referer'`)
- [ ] [vercel-preview] `VERCEL_ENV=preview`, `VERCEL_URL=goodman-gls-abc.vercel.app`, `Origin: https://goodman-gls-abc.vercel.app` → ok
- [ ] [dev-default] `VERCEL_ENV=development`, `Origin: http://localhost:3000` → ok (env 미설정 default)
- [ ] [multi-allowlist] `ALLOWED_ORIGINS='https://a.com,https://b.com'` + `Origin: https://b.com` → ok

#### `enforceRateLimit`

- [ ] [happy] 신규 IP 1회 → ok, bucket 생성
- [ ] [under-limit] 동일 IP 5회 (MAX=5) → 모두 ok
- [ ] [over-limit] 6번째 호출 → reject, retryAfterSec > 0
- [ ] [window-expiry] now를 resetAt 이후로 진행 → 다시 ok, bucket 리셋
- [ ] [ip-isolation] IP A 5회 후 IP B 1회 → IP B 통과
- [ ] [retry-after-ceil] resetAt - now = 5.4s → retryAfterSec = 6 (ceil)

#### `getClientIp`

- [ ] [xff-single] `x-forwarded-for: 1.2.3.4` → `1.2.3.4`
- [ ] [xff-chain] `x-forwarded-for: 1.2.3.4, 10.0.0.1` → `1.2.3.4`
- [ ] [xff-absent] 헤더 부재 → `'unknown'`

### 8.3 Vitest 도입 범위

- devDeps 추가: `vitest`, `@vitest/coverage-v8`
- `package.json` scripts: `"test": "vitest"`, `"test:run": "vitest run"`, `"test:coverage": "vitest run --coverage"`
- `vitest.config.ts` minimal (Node env, `src/lib/**/*.test.ts` glob)
- CI 추가는 별도 사이클 (이번엔 로컬 + PR 수동)

---

## 9. Clean Architecture

이번 사이클은 Dynamic 레벨의 `src/lib/` (Infrastructure) 에 헬퍼 모듈을 추가하고, `src/app/api/contact/route.ts` (Presentation/API edge) 에서 호출하는 가벼운 변경. Domain entity나 Application service 추가는 없음.

| Layer | 변경 | 위치 |
|-------|------|------|
| Presentation (API route) | route.ts 가드 호출 라인 추가 | `src/app/api/contact/route.ts` |
| Infrastructure | `api-guards.ts` 헬퍼 신규 | `src/lib/api-guards.ts` |
| Domain | — | — |
| Application | — | — |

---

## 10. Coding Convention Reference

### 10.1 This Feature's Conventions

| Item | Convention Applied |
|------|-------------------|
| File naming | `api-guards.ts` (kebab-case utility) |
| Function naming | camelCase (`assertAllowedOrigin`, `enforceRateLimit`) |
| Type naming | PascalCase (`RateLimitBucket`) |
| Error response | `NextResponse.json({ error }, { status })` 기존 패턴 follow |
| Logging | `console.warn` (production logger 미도입, eslint-disable-next-line 1줄) |
| Test file | `src/lib/api-guards.test.ts` 동일 폴더 콜로케이션 |
| Env access | `process.env.X ?? default` 패턴, 모듈 top-level 캐싱 금지 (vitest mock 용이) |

### 10.2 Env vars

| Variable | Purpose | Scope | Required |
|----------|---------|-------|:--------:|
| `ALLOWED_ORIGINS` | comma-separated origin allowlist | Server | ☑ production |
| `RATE_LIMIT_MAX` | window당 최대 요청 수 | Server | ☐ (default 5) |
| `RATE_LIMIT_WINDOW_MS` | window 길이 ms | Server | ☐ (default 60000) |
| `VERCEL_ENV` | Vercel 자동 주입 | Server | auto |
| `VERCEL_URL` | Vercel 자동 주입 | Server | auto |

---

## 11. Implementation Guide

### 11.1 File Structure (변경분)

```
goodman-gls/
├── .env.local.example         ← + ALLOWED_ORIGINS 등 3개
├── package.json               ← + vitest devDeps + scripts 3개
├── vitest.config.ts           ← 신규
└── src/
    ├── app/api/contact/
    │   └── route.ts           ← 가드 호출 + 신규 응답 코드
    └── lib/
        ├── api-guards.ts      ← 신규 (헬퍼)
        └── api-guards.test.ts ← 신규 (단위 테스트)
```

### 11.2 Implementation Order

1. [ ] `src/lib/api-guards.ts` 작성 (헬퍼 + 타입)
2. [ ] vitest devDeps 설치 + `vitest.config.ts` + `package.json` scripts
3. [ ] `src/lib/api-guards.test.ts` 작성 (§8.2 케이스 17건)
4. [ ] `npx vitest run` 통과 확인
5. [ ] `src/app/api/contact/route.ts` 에 가드 호출 라인 삽입 (검증 순서 §4.2 따름)
6. [ ] `.env.local.example` 갱신
7. [ ] `npm run lint` / `npx tsc --noEmit` / `npm run build` 모두 통과
8. [ ] Manual curl 검증 시나리오 PR description에 적시 (cross-origin reject + rate limit 429)
9. [ ] PR 생성 + 사용자 리뷰

### 11.3 route.ts diff plan

기존 51줄에서 다음 패치:

```typescript
// import 추가
import { assertAllowedOrigin, enforceRateLimit, getClientIp } from '@/lib/api-guards';

export async function POST(request: Request) {
  // ─── 신규: Origin/Referer 가드 ──────────────────────
  const originCheck = assertAllowedOrigin(request);
  if (!originCheck.ok) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 });
  }

  // ─── 신규: rate limit ───────────────────────────────
  const ip = getClientIp(request);
  const rate = enforceRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    );
  }

  // ─── 기존 흐름 유지 ─────────────────────────────────
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const result = contactFormSchema.safeParse(payload);
  if (!result.success) { ... }

  // 환경변수 검사를 가드 통과 후로 이동
  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.CONTACT_EMAIL_TO;
  const emailFrom = process.env.CONTACT_EMAIL_FROM;
  if (!apiKey || !emailTo || !emailFrom) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  // ... Resend 호출 기존 동일
}
```

> **변경 포인트**: 기존 module-top-level의 `apiKey`/`emailTo`/`emailFrom` 캐시는 함수 내부로 이동 (vitest mock 시 env 주입 용이).

---

## 12. Open Questions

| # | 항목 | 결정 | 상태 |
|---|------|------|------|
| 1 | production `ALLOWED_ORIGINS` 값 | `https://goodman-gls.vercel.app` only (custom domain 도입 시 추가 사이클) | ✅ 확정 (2026-05-28) |
| 2 | rate limit MAX/WINDOW default | 5 req / 60s | ✅ 확정 (Design v0.1 default) |
| 3 | 테스트 도구 도입 (Vitest) 이 사이클 포함 여부 | 포함 (헬퍼 pure, runner CI 통합은 별도 사이클) | ✅ 확정 (Design v0.1) |
| 4 | vercel.json `buildCommand: "next build \|\| true"` 정정 | 별도 사이클 (이번 hardening 범위 외) | ✅ 확정 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-28 | Initial draft — api-guards.ts 헬퍼 + Vitest 도입 + route.ts diff plan + 17 단위 테스트 케이스 | jhlim725 |
| 0.2 | 2026-05-28 | Open Questions 4건 확정 — ALLOWED_ORIGINS=`https://goodman-gls.vercel.app` only, MAX 5/60s, Vitest 포함, vercel.json 정정은 별도 사이클 | jhlim725 |
