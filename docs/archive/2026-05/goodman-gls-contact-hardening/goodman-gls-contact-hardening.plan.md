---
template: plan
version: 1.2
feature: goodman-gls-contact-hardening
date: 2026-05-28
author: jhlim725
project: goodman-gls
project_version: 0.1.0
---

# goodman-gls-contact-hardening Planning Document

> **Summary**: `/api/contact` (Resend 메일 전송) 라우트에 CSRF Origin/Referer 가드와 IP-based rate limit을 추가해 외부 사이트 abuse·spam을 차단한다.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-28
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

`/api/contact` 가 현재 same-origin POST 가정만으로 동작해 다음 위험에 노출되어 있다:
- 외부 사이트에서 cross-origin POST → 무인증 메일 전송 → Resend 쿼터 소진 + CONTACT_EMAIL_TO 스팸
- 동일 IP가 짧은 시간 다량 요청 → 메일 폭주 / Resend rate limit 도달 → 정상 사용자 차단

이를 차단하기 위해 (1) Origin/Referer 화이트리스트 가드와 (2) IP-based sliding-window rate limit 두 layer를 도입한다.

### 1.2 Background

- bkit:code-analyzer 분석(2026-05-28)에서 P1~P2 분리 사이클 후보로 식별
- `src/app/api/contact/route.ts:1-51` 은 Resend 연동 + Zod safeParse 까지는 완료
- 현재 코드는 CSRF 토큰도, rate limit도 없음 — 동일 origin SPA만 안전하게 사용 가능
- Vercel 서버리스 인스턴스 분산 환경 고려 필요 (in-process Map은 instance별 카운트라 효과 약화)
- 인증 없는 marketing site 특성상 토큰 기반 CSRF는 과잉 — Origin/Referer 가드가 적정 수준

### 1.3 Related Documents

- 코드: `src/app/api/contact/route.ts:1-51`
- 호출처: `src/components/ContactSection.tsx`
- Zod schema: `src/lib/validations/contact.ts`
- 메모리: `~/.claude/projects/-Users-jaehong/memory/project_goodman_gls_build_prerender_debt_candidate.md` (잔여 후보 목록)

---

## 2. Scope

### 2.1 In Scope

- [ ] `/api/contact` POST 핸들러에 Origin/Referer 가드 추가 (ALLOWED_ORIGINS 환경변수)
- [ ] IP-based sliding-window rate limit (default: 5 req / 60s / IP)
- [ ] `x-forwarded-for` 헤더에서 IP 추출 (Vercel proxy 기준)
- [ ] 거부 응답 표준화: 403 (CSRF), 429 (rate limit) + `Retry-After`
- [ ] route.ts 단위 테스트 (Resend mock + Origin/Referer/rate-limit reject 케이스)
- [ ] `.env.local.example` 에 새 변수 추가 (`ALLOWED_ORIGINS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`)

### 2.2 Out of Scope

- 인증/세션 기반 CSRF 토큰 (현재 인증 없음, 별도 사이클)
- CAPTCHA / honeypot 봇 차단 (이번 hardening 이후 효과 측정 후 결정)
- Upstash Redis / Vercel KV 분산 rate limit (1차는 in-process Map, 효과 부족하면 별도 사이클)
- Rails `goodman-gls-api/` 백엔드 측 처리 (현재 호출 안 함)
- Intercom / Resend 외부 webhook 보안 (해당 없음)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | POST 요청의 Origin 헤더가 ALLOWED_ORIGINS 화이트리스트에 없으면 403 반환 | High | Pending |
| FR-02 | Origin 부재 시 Referer host를 화이트리스트 대조, 둘 다 부재 또는 불일치면 403 | High | Pending |
| FR-03 | 동일 IP의 요청이 window(60s) 안에 max(5) 초과 시 429 + `Retry-After` 헤더 반환 | High | Pending |
| FR-04 | 정상 same-origin POST(Origin 일치 + rate 미초과)는 기존 흐름(Resend send)대로 통과 | High | Pending |
| FR-05 | 거부 응답 본문은 `{ error: 'Origin not allowed' \| 'Too many requests' }` 형태로 명시적 | Medium | Pending |
| FR-06 | 환경변수 미설정 시(local dev) ALLOWED_ORIGINS 기본값 `http://localhost:3000` 적용 | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 가드 처리로 인한 응답시간 증가 < 10ms (p95) | route 핸들러 `console.time` 측정 또는 unit test 타이머 |
| Security | OWASP A05 (Security Misconfiguration), A04 (Insecure Design) 완화 | code review + 의도적 cross-origin 테스트 |
| Reliability | rate limit 메모리 사용 < 1MB / instance (Map 자동 expire) | sliding-window cleanup 로직 |
| Observability | 거부 케이스는 `console.warn` 로 기록 (production logger 미도입 상태) | 로그 grep |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-01 ~ FR-06 모두 구현 + 단위 테스트 통과
- [ ] `npm run lint` / `tsc --noEmit` / `next build` 모두 통과
- [ ] route.ts 변경분에 단위 테스트 추가 (정상 / Origin reject / Referer fallback / rate limit 429)
- [ ] `.env.local.example` 갱신 + Vercel production env 변수 등록 가이드 commit message에 명기
- [ ] PR 본문에 manual cross-origin curl 테스트 결과 포함

### 4.2 Quality Criteria

- [ ] route.ts 단위 테스트 커버리지 추가분 80% 이상
- [ ] Zero lint errors
- [ ] Build 통과 (8/8 static pages 유지)
- [ ] 기존 ContactSection.tsx 호출 호환성 유지 (브레이킹 변경 없음)

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Vercel 서버리스 instance 분산 → in-process Map 효과 약화 | Medium | High | 1차는 in-process로 시작 + 효과 부족 시 Upstash Redis 분리 사이클 fallback. 단일 인스턴스에서도 burst spam은 차단 가능. |
| Origin header 부재인 정당 클라이언트(curl, server-to-server) 차단 | Medium | Low | Origin 없으면 Referer로 fallback. 둘 다 없으면 reject(이 라우트는 브라우저 form 전용이므로 의도된 동작). |
| `x-forwarded-for` 스푸핑 → rate limit 우회 | Low | Medium | Vercel proxy 외 환경에서는 `request.ip` 우선, 스푸핑은 Vercel edge 단에서 1차 차단됨. 완전 차단은 out of scope. |
| 환경변수 누락으로 production 전체 차단 | High | Low | 명시적 default(`http://localhost:3000`) + Vercel env 등록 체크리스트를 PR description에 명기 |
| Resend 응답 지연 시 rate limit 카운트 부정확 | Low | Low | 카운트는 요청 진입 시점 기준, 응답 결과 무관하게 +1 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure (`components/`, `lib/`, `types/`) | Static sites, portfolios, landing pages | ☐ |
| **Dynamic** | Feature-based modules, services layer | Web apps with backend, SaaS MVPs | ☑ |
| **Enterprise** | Strict layer separation, DI, microservices | High-traffic systems, complex architectures | ☐ |

이미 Dynamic 레벨로 운영 중인 프로젝트. 이번 사이클은 기존 구조를 유지하며 lib/ 에 가드 헬퍼만 추가.

### 6.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| CSRF 방식 | Token / Origin-Referer / SameSite-only | Origin-Referer 가드 | 인증 없는 marketing form에 토큰은 과잉. SameSite는 브라우저 기본값 의존이라 추가 layer 필요 |
| Rate limit store | in-process Map / Redis / Vercel KV | in-process Map (1차) | 외부 의존 없이 즉시 도입 가능. 효과 부족 시 분리 사이클로 Redis 전환 |
| 가드 위치 | middleware.ts / route 내부 | route 내부 | 단일 라우트 한정, middleware는 next-intl 등과 결합 시 복잡도 증가 |
| 헬퍼 모듈 | route 안 인라인 / lib 분리 | `src/lib/api-guards.ts` 신규 | 재사용 가능성(향후 다른 POST 라우트), 테스트 용이 |
| 테스트 프레임워크 | Jest / Vitest / Playwright | Jest (next 기본) | 프로젝트 표준 follow |

### 6.3 Clean Architecture Approach

```
Dynamic Level — 변경 최소화:

src/
├── app/api/contact/route.ts        ← 가드 호출 추가
├── lib/
│   ├── api-guards.ts               ← 신규: isAllowedOrigin, rateLimit
│   └── validations/contact.ts      ← 변경 없음
└── tests/
    └── api/contact/route.test.ts   ← 신규: 가드 케이스
```

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` 에 코딩 컨벤션 섹션 존재
- [ ] `docs/01-plan/conventions.md` 없음 (Phase 2 미도입)
- [ ] `CONVENTIONS.md` 없음
- [x] ESLint 설정 (`eslint.config.mjs`)
- [ ] Prettier 설정 없음 (eslint-config-next 내장 포맷 의존)
- [x] TypeScript 설정 (`tsconfig.json`, strict: true)

### 7.2 Conventions to Define/Verify

| Category | Current State | To Define | Priority |
|----------|---------------|-----------|:--------:|
| **Naming** | PascalCase 컴포넌트 / kebab-case 파일 일관 | `api-guards.ts` 표준 따름 | Low |
| **Folder structure** | App Router + lib/ + components/ | 변경 없음 | - |
| **Import order** | next/external/@/* 순 | follow | Low |
| **Environment variables** | `.env` 분산, example 부재 | `.env.local.example` 갱신 필수 | High |
| **Error handling** | route는 `NextResponse.json({error})` 패턴 | follow | - |

### 7.3 Environment Variables Needed

| Variable | Purpose | Scope | To Be Created |
|----------|---------|-------|:-------------:|
| `ALLOWED_ORIGINS` | 콤마구분 화이트리스트 (e.g., `https://goodman-gls.vercel.app,https://goodman.kr`) | Server | ☑ |
| `RATE_LIMIT_MAX` | window당 최대 요청 수 (default 5) | Server | ☑ (선택) |
| `RATE_LIMIT_WINDOW_MS` | window 길이 ms (default 60000) | Server | ☑ (선택) |
| `RESEND_API_KEY` | 기존 변수, 그대로 유지 | Server | - |
| `CONTACT_EMAIL_TO` | 기존 변수, 그대로 유지 | Server | - |
| `CONTACT_EMAIL_FROM` | 기존 변수, 그대로 유지 | Server | - |

### 7.4 Pipeline Integration

이 사이클은 9-phase Development Pipeline의 Phase 4(API) 부분 hardening에 해당하며, 별도 Phase 진입 없이 단일 PDCA로 처리.

---

## 8. Next Steps

1. [ ] Design 문서 작성 (`/pdca design goodman-gls-contact-hardening`) — 헬퍼 시그니처, 알고리즘 상세, 테스트 케이스 enumerate
2. [ ] 사용자 리뷰 + 화이트리스트 도메인 확정 (vercel 도메인 + custom domain)
3. [ ] Implementation (`/pdca do …`)
4. [ ] Gap analysis (`/pdca analyze …`) → matchRate 90%+ 도달까지 iterate

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-28 | Initial draft — Origin/Referer 가드 + IP rate limit 도입 | jhlim725 |
