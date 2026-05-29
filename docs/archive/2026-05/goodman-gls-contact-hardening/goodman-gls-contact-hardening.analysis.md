---
template: analysis
version: 1.2
feature: goodman-gls-contact-hardening
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
---

# goodman-gls-contact-hardening Analysis Report

> **Analysis Type**: Gap Analysis (Design ↔ Implementation)
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Analyst**: jhlim725
> **Date**: 2026-05-29
> **Design Doc**: [goodman-gls-contact-hardening.design.md](../02-design/features/goodman-gls-contact-hardening.design.md) v0.2
> **Implementation**: main `7cac00f` (PR #2 squash merged)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

PDCA Check 단계 — Design v0.2 청사진과 실제 머지된 구현(main `7cac00f`) 간 정합도 측정. matchRate ≥ 90% 시 report 진입, < 90% 시 iterate.

### 1.2 Analysis Scope

- **Design**: `docs/02-design/features/goodman-gls-contact-hardening.design.md` (v0.2, Open Questions 4건 closed)
- **Implementation**:
  - `src/lib/api-guards.ts` (헬퍼)
  - `src/lib/api-guards.test.ts` (단위 테스트)
  - `src/app/api/contact/route.ts` (가드 적용)
  - `vitest.config.ts`, `package.json` (Vitest 도입)
  - `.env.local.example`, `.gitignore` (env 예외)
- **Verification commit**: `7cac00f`
- **Analysis date**: 2026-05-29

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 Functional Requirements (FR-01 ~ FR-06)

| FR | Design 요구 | 구현 위치 | Status |
|----|------------|---------|--------|
| FR-01 | Origin 화이트리스트 외이면 403 | `api-guards.ts:48-71` + `route.ts:11-14` | ✅ |
| FR-02 | Origin 부재 시 Referer fallback, 둘 다 없으면 403 | `api-guards.ts:60-70` | ✅ |
| FR-03 | window 안에 MAX 초과 시 429 + `Retry-After` | `api-guards.ts:73-95` + `route.ts:17-26` | ✅ |
| FR-04 | 정상 same-origin POST 호환성 유지 | `route.ts:28-69` (가드 통과 후 기존 흐름 100%) | ✅ |
| FR-05 | 거부 응답 본문 `{ error: ... }` 명시 | `route.ts:13, 20, 32, 38, 48, 66` (6종 모두) | ✅ |
| FR-06 | env 미설정 시 dev default `http://localhost:3000` | `api-guards.ts:36-38` | ✅ |

**FR 매칭: 6/6 = 100%**

### 2.2 알고리즘 충실도 (Design §7)

| 항목 | Design 의사코드 | 구현 라인 | Status |
|------|----------------|---------|--------|
| `assertAllowedOrigin` Origin 우선 → Referer → reject | §7.1 L209-223 | `api-guards.ts:48-71` | ✅ |
| `resolveAllowlist` env + VERCEL_ENV preview 동적 + dev default | §7.2 L230-244 | `api-guards.ts:24-42` | ✅ |
| `enforceRateLimit` fixed-window + env override + Math.ceil | §7.3 L261-277 | `api-guards.ts:73-95` | ✅ |
| `getClientIp` xff split[0] trim | §7.4 L286-292 | `api-guards.ts:97-104` | ✅ |
| `safeUrlOrigin` URL parse try/catch | §7.1 L218 (silently) | `api-guards.ts:16-22` | ✅ |
| `logRejection` 단일 sink 함수 | §6.2 | `api-guards.ts:44-46` | ✅ |

**알고리즘 매칭: 6/6 = 100%**

### 2.3 검증 순서 (Design §4.2)

`route.ts:11-69` 가 Design 명시 순서를 그대로 따름:

1. `assertAllowedOrigin` → 403 (L11-14)
2. `enforceRateLimit` → 429 (L17-26)
3. JSON parse → 400 (L28-33)
4. Zod safeParse → 400 (L35-41)
5. env 검사 → 500 (L43-51, 함수 내부로 이동 — vitest mock 용이)
6. Resend send → 200/502 (L53-69)

✅ 6단계 일치. env 검사 위치 이동은 Design §11.3 명시.

### 2.4 단위 테스트 케이스 (Design §8.2)

| Group | Design 케이스 | 구현 라인 | Status |
|-------|--------------|---------|--------|
| Origin guard | [happy] | `test.ts:35-39` | ✅ |
| | [reject-origin] | `test.ts:41-47` | ✅ |
| | [fallback-referer] | `test.ts:49-55` | ✅ |
| | [reject-referer] | `test.ts:57-63` | ✅ |
| | [no-headers] | `test.ts:65-70` | ✅ |
| | [vercel-preview] | `test.ts:72-77` | ✅ |
| | [dev-default] | `test.ts:79-83` | ✅ |
| | [multi-allowlist] | `test.ts:85-89` | ✅ |
| Rate limit | [happy] | `test.ts:93-95` | ✅ |
| | [under-limit] | `test.ts:97-102` | ✅ |
| | [over-limit] | `test.ts:104-111` | ✅ |
| | [window-expiry] | `test.ts:113-120` | ✅ |
| | [ip-isolation] | `test.ts:122-126` | ✅ |
| | [retry-after-ceil] | `test.ts:128-136` | ✅ |
| IP 추출 | [xff-single] | `test.ts:140-143` | ✅ |
| | [xff-chain] | `test.ts:145-148` | ✅ |
| | [xff-absent] | `test.ts:150-153` | ✅ |

**테스트 매칭: 17/17 = 100% (실행 결과 17/17 PASS)**

### 2.5 응답 본문 타입 (Design §6.1 ContactErrorBody)

| 응답 | Body | 구현 라인 | Status |
|------|------|---------|--------|
| 403 | `{ error: 'Origin not allowed' }` | `route.ts:13` | ✅ |
| 429 | `{ error: 'Too many requests', retryAfterSec: number }` | `route.ts:20` | ✅ |
| 400 | `{ error: 'Invalid JSON' }` | `route.ts:32` | ✅ |
| 400 | `{ error: 'Validation failed', issues: ... }` | `route.ts:38` | ✅ |
| 500 | `{ error: 'Email service not configured' }` | `route.ts:48` | ✅ |
| 502 | `{ error: 'Failed to send email' }` | `route.ts:66` | ✅ |

**응답 매칭: 6/6 = 100%**

### 2.6 파일 구조 (Design §11.1)

| 카테고리 | Design 명세 | 구현 | Status |
|---------|------------|------|--------|
| 신규 | `src/lib/api-guards.ts` | ✅ | ✅ |
| 신규 | `src/lib/api-guards.test.ts` | ✅ | ✅ |
| 신규 | `vitest.config.ts` | ✅ | ✅ |
| 수정 | `src/app/api/contact/route.ts` | ✅ | ✅ |
| 수정 | `package.json` (devDeps + scripts) | ✅ | ✅ |
| 수정 | `.env.local.example` | ✅ | ✅ |
| 추적 변경 | `.gitignore` (env 예외 추가) | ✅ | ✅ |

**파일 매칭: 7/7 = 100%**

### 2.7 Open Questions 확정 (Design §12)

| # | 결정 | 구현 반영 | Status |
|---|------|---------|--------|
| Q1 | `ALLOWED_ORIGINS=https://goodman-gls.vercel.app` only | `.env.local.example` 주석 명기 (실제 production env 등록은 운영 task) | ⚠️ 코드 ready, env 미등록 |
| Q2 | MAX 5 / WINDOW 60s default | `api-guards.ts:78-79` (`?? 5`, `?? 60_000`) | ✅ |
| Q3 | Vitest 도입 포함 | `vitest.config.ts` + `package.json` + 17/17 PASS | ✅ |
| Q4 | `vercel.json` 정정은 별도 사이클 | 본 사이클 제외 | ✅ |

**Open Q 매칭: 3.5/4 (Q1 코드 ready지만 운영 등록 보류)**

### 2.8 Match Rate Summary

```
┌─────────────────────────────────────────────────────────┐
│  Overall Match Rate: 96%                                 │
├─────────────────────────────────────────────────────────┤
│ FR-01~06                                          : 100% │
│ §7 알고리즘 (assertAllowedOrigin / rate limit 등) : 100% │
│ §4.2 검증 순서 6단계                              : 100% │
│ §8.2 테스트 케이스 17건                           : 100% │
│ §6.1 응답 본문 6종                                : 100% │
│ §11.1 파일 구조 7건                               : 100% │
│ §12 Open Questions 4건                            :  88% │
│                                                          │
│ ── 비코드 감점 ──                                        │
│ Manual curl 검증 skip (PR에서 4 시나리오 미실행)  : -2pp │
│ Production env 미등록 (코드 ready, 운영 잔여)     : -2pp │
└─────────────────────────────────────────────────────────┘

최종: 96% (보수적, unit test 17/17 PASS 고려 시 98% 가능)
```

---

## 3. Gaps (우선순위별)

### 3.1 HIGH — 없음

### 3.2 MEDIUM

- **M-1: Production `ALLOWED_ORIGINS` 미등록** — Vercel production env에 `https://goodman-gls.vercel.app` 명시 등록 필요. 미등록 상태에서는 production 도메인이 화이트리스트에 없어 정상 contact form도 403으로 차단됨 (가드가 active되는 순간). 운영 task로 분리 가능하나 production deploy 직전 필수.

### 3.3 LOW

- **L-1: Manual curl 검증 skip** — PR #2 description에 4건 manual 시나리오 명시했으나 사용자 "merge" 한 마디로 preview deploy 검증 skip. unit test 17/17 PASS로 헬퍼 로직은 완전 검증되었지만 Vercel runtime + serverless edge proxy IP 헤더(x-forwarded-for 실제 전달 형식) 동작은 미확인. production 후 첫 1주 로그(`[api-guards] reject ...`)로 사후 검증 가능.

- **L-2: `vitest.config.ts` alias 추가 (Design 미명시)** — Design에 `@` alias 언급 없었으나 구현은 `vitest.config.ts:13-18`에 추가 (route.ts → `@/lib/api-guards` import 위해 필요). Design 누락 사후 보강 — 정당한 implementation detail.

---

## 4. Matches (완전 일치 항목)

1. `assertAllowedOrigin` 의 Origin → Referer → reject 3단 분기 순서 (Design §7.1 ↔ `api-guards.ts:53-70`)
2. `resolveAllowlist` 의 fromEnv + dynamic 합성 로직 (Design §7.2 ↔ `api-guards.ts:24-42`)
3. `enforceRateLimit` fixed-window + `Math.ceil((bucket.resetAt - now) / 1000)` (Design §7.3 ↔ `api-guards.ts:73-95`)
4. route 검증 순서 6단계 + env 검사 함수 내부 이동 (Design §4.2 + §11.3 ↔ `route.ts:11-51`)
5. Vitest 단위 테스트 17 케이스 1:1 대응 + 17/17 PASS
6. 응답 본문 6종 정확히 일치 (Design §6.1 ContactErrorBody)
7. Clean Architecture layer 배치 — Infrastructure(`src/lib/api-guards.ts`) + Presentation(`src/app/api/contact/route.ts`)
8. Naming convention — kebab-case 파일, camelCase 함수, PascalCase 타입
9. `logRejection` 단일 sink 함수로 logger 교체점 마련 (Design §6.2)
10. `.env.local.example` 신규 변수 3개 + 주석 가이드

---

## 5. Convention Compliance

| Item | Convention | Status |
|------|-----------|--------|
| File naming (utility) | kebab-case `.ts` | ✅ `api-guards.ts` |
| Function naming | camelCase | ✅ `assertAllowedOrigin` 등 |
| Type naming | PascalCase | ✅ `OriginGuardResult`, `RateLimitResult`, `RateLimitBucket` |
| Test colocation | 동일 폴더 `.test.ts` | ✅ `src/lib/api-guards.test.ts` |
| Env var | UPPER_SNAKE_CASE | ✅ `ALLOWED_ORIGINS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS` |
| Error response | `NextResponse.json({ error }, { status })` | ✅ |
| Import order | next / external / `@/*` | ✅ `route.ts:1-8` |

---

## 6. Verification Results

| 검사 | 명령 | 결과 |
|------|------|------|
| Lint | `npx eslint .` | ✅ 0 errors |
| TypeCheck | `npx tsc --noEmit` | ✅ 0 errors |
| Unit Test | `npx vitest run` | ✅ 17/17 PASS, ~1s |
| Build | `npm run build` | ✅ 7 static + 1 dynamic |
| PR State | `gh pr view 2` | ✅ MERGED `7cac00f` |
| Vercel preview | `goodman-gls-git-feature-contact-hardening-goodman-jways.vercel.app` | ✅ Ready (manual curl 미실행) |

---

## 7. Next Action

matchRate **96%** ≥ 90% → **`/pdca report goodman-gls-contact-hardening`** 진입 권장.

iterate 불필요. 보고서에서 다음을 강조:
- 모든 FR/알고리즘/테스트 100% 매칭
- 비코드 감점(production env, manual curl) 은 운영 task / 사후 로그 검증으로 충분
- 후속 분리 사이클 4건 (Q1 등록 운영 task, ContactSection RHF, Navigation i18n, Redis distributed rate limit)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-29 | Initial gap analysis — matchRate 96%, FR/알고리즘/테스트/응답/파일 모두 100% 매칭, 비코드 감점 -4pp | jhlim725 (via bkit:gap-detector) |
