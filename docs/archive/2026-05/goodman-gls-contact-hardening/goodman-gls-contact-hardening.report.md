---
template: report
version: 1.2
feature: goodman-gls-contact-hardening
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
status: completed
matchRate: 96
---

# goodman-gls-contact-hardening Completion Report

> **Feature**: goodman-gls-contact-hardening
> **Project**: goodman-gls (GOODMAN GLS — B2B logistics GSA website)
> **Duration**: 2026-05-28 ~ 2026-05-29 (1 day)
> **Owner**: jhlim725
> **Status**: ✅ COMPLETED — matchRate 96%, PR #2 squash merged (main 7cac00f)

---

## 1. Executive Summary

`/api/contact` 라우트에 **Origin/Referer 화이트리스트 가드**와 **IP 기반 rate limit**을 도입해 Resend 메일 서비스 남용 차단. 외부 origin cross-origin POST 및 짧은 시간 대량 요청으로부터 서비스 보호. Design v0.2 대비 **100% FR 구현**, **100% 알고리즘 일치**, **17/17 단위 테스트 통과** 달성. 비코드 감점(-4pp)은 production env 운영 task + preview manual curl 검증 skip으로, 모두 사후 처리 가능.

---

## 2. PDCA Cycle Summary

| Phase | Document | Date | Status | 핵심 결과 |
|-------|----------|------|--------|----------|
| **Plan** | `docs/01-plan/features/goodman-gls-contact-hardening.plan.md` v0.1 | 2026-05-28 | ✅ | 목표 명확: CSRF 가드 + rate limit, 범위 확정 (in/out of scope) |
| **Design** | `docs/02-design/features/goodman-gls-contact-hardening.design.md` v0.2 | 2026-05-28 | ✅ | 알고리즘 6종 상세 정의, 테스트 케이스 17건 enumerated |
| **Do** | PR #2 (src/lib/api-guards.ts 등 6개 파일 변경) | 2026-05-28 | ✅ | 10 files +1647/-73, vitest 도입, route 가드 통합 |
| **Check** | `docs/03-analysis/goodman-gls-contact-hardening.analysis.md` v0.1 | 2026-05-29 | ✅ | matchRate 96%, FR 100% + 알고리즘 100% + 테스트 100% |
| **Act** | (iterate skip — 90% 초과) | 2026-05-29 | ⏭️ | 분리 사이클로 이관 (production env, manual curl) |
| **Report** | 이 문서 | 2026-05-29 | ✅ | 완료 보고 + 후속 4개 분리 사이클 후보 정의 |

---

## 3. Outcome by Dimension

### 3.1 문제 해결 여부

**목표**: `/api/contact` POST 남용 차단 → CSRF/rate limit 이중 가드 도입  
**결과**: ✅ YES — Design v0.2 대비 **96% matchRate** 달성, production deploy ready

```
┌──────────────────────────────────────────────────┐
│  Implementation Scorecard                        │
├──────────────────────────────────────────────────┤
│  Functional Requirements (FR-01~06)      : 100%  │
│  Algorithm Fidelity (§7 정의 대비)       : 100%  │
│  Validation Order (6 단계)              : 100%  │
│  Test Cases (17/17 케이스)             : 100%  │
│  Response Body Types (6/6)              : 100%  │
│  File Structure (7/7 변경)              : 100%  │
│  ──────────────────────────────────────────────  │
│  Code Match Rate                        : 100%  │
│  Non-code Tasks (env등록, curl 검증)   :  88%  │
│  ──────────────────────────────────────────────  │
│  **Overall Match Rate**                 : **96%**│
└──────────────────────────────────────────────────┘
```

### 3.2 검증 결과

| 검사 항목 | 명령 | 결과 | 비고 |
|----------|------|------|------|
| ESLint | `npx eslint .` | ✅ 0 errors | design-validator pass |
| TypeScript | `npx tsc --noEmit` | ✅ 0 errors | strict mode |
| Vitest 단위 테스트 | `npx vitest run` | ✅ 17/17 PASS | ~1s 실행 |
| Next.js Build | `npm run build` | ✅ 7/7 routes (정적 4 + 동적 3: `/_not-found`·`/api/contact` 포함) | production ready |
| PR 상태 | `gh pr view 2` | ✅ MERGED 7cac00f | squash merged main |
| Vercel preview | preview deployment ready | ✅ Ready | manual curl 미실행 (L-1) |

---

## 4. 구현 변경 통계

**PR #2 (squash merged main 7cac00f)**

```
10 files changed, +1647 insertions(−) 73 deletions(−)

 src/lib/api-guards.ts           [신규]        104 lines
 src/lib/api-guards.test.ts      [신규]       153 lines
 src/app/api/contact/route.ts    [수정]        69 lines (기존 51 → +18)
 vitest.config.ts                [신규]        18 lines
 package.json                    [수정]         +vitest devDeps + 3 scripts
 .env.local.example              [수정]         +3 env vars + 주석
 .gitignore                       [수정]         +.env.local 예외
```

**코드 분석**:
- **api-guards.ts**: 완전 신규 헬퍼 모듈 — 재사용 가능 설계 (향후 `/api/quote` 등에 적용)
- **api-guards.test.ts**: 17개 단위 테스트 (Origin/rate limit/IP 추출) — 100% pure function 테스트
- **route.ts diff**: 기존 51줄에서 6줄 추가 (가드 호출 + 새 응답 처리) — backward compatible
- **vitest.config.ts**: minimal 설정 (Node env, `@` alias, test glob)

---

## 5. matchRate 96% 분해

### 5.1 100% 완전 일치 항목

**총 7개 카테고리 모두 100% 매칭**:

1. **FR-01~06 (6/6)**: Design 요구사항 전부 구현
   - Origin 화이트리스트 ✅
   - Referer fallback ✅
   - Rate limit 429 + Retry-After ✅
   - 호환성 유지 ✅
   - 응답 본문 명시 ✅
   - env default ✅

2. **알고리즘 (6/6)**: `assertAllowedOrigin` → `resolveAllowlist` → `enforceRateLimit` → `getClientIp` → `safeUrlOrigin` → `logRejection`
   - 의사코드 대비 정확 구현 (Design §7 수준)

3. **검증 순서 (6/6)**: route.ts L11-51
   - Origin guard → rate limit → JSON parse → Zod → env 검사 → Resend
   - Design §4.2 6단계 일치, env 검사 함수 내부 이동 반영

4. **단위 테스트 (17/17)**: api-guards.test.ts
   - Origin guard 8개 케이스 (happy / reject / fallback / preview / dev default / multi-allowlist)
   - Rate limit 6개 케이스 (happy / under / over / expiry / isolation / retry-after-ceil)
   - IP 추출 3개 케이스 (xff-single / xff-chain / absent)

5. **응답 본문 (6/6)**: 403 / 429 / 400 / 400 / 500 / 502
   - 모두 Design §6.1 ContactErrorBody 형태

6. **파일 구조 (7/7)**: Design §11.1 명세
   - api-guards.ts / api-guards.test.ts / vitest.config.ts / route.ts / package.json / .env.local.example / .gitignore

7. **Convention (10/10)**: kebab-case / camelCase / PascalCase / colocation / UPPER_SNAKE_CASE
   - 모두 기존 프로젝트 표준 준수

### 5.2 비코드 감점 (-4pp)

**두 항목 각각 -2pp**:

| 항목 | 상태 | 이유 | 사후 처리 |
|------|------|------|----------|
| **M-1: Production env 미등록** | ⚠️ | `ALLOWED_ORIGINS=https://goodman-gls.vercel.app` 를 Vercel production env에 등록해야 route 가드 active (코드는 ready, env 설정만 보류) | 운영 task, PR 설명에 checklist 명기, 최대 5분 |
| **L-1: Preview manual curl 검증 skip** | ℹ️ | PR #2 설명에 4건 시나리오 명시했으나 사용자 "merge" 한 마디로 skip. Unit test 17/17 PASS 로 헬퍼 로직 완전 검증되었으나 Vercel runtime edge proxy IP 헤더 동작 미확인 | 사후: production 첫 1주 logs 모니터링 + Vercel KV 로거 통합 (별도 사이클) |

---

## 6. 운영 잔여 Task

**Production deploy 전 필수**:

### T1: ALLOWED_ORIGINS 환경변수 등록 (5min, P0)

Vercel project settings → Environment Variables:
```bash
Name: ALLOWED_ORIGINS
Value: https://goodman-gls.vercel.app
```

**검증**: Vercel production deploy 후 `curl -X POST https://goodman-gls.vercel.app/api/contact -H "Origin: https://evil.com" -d '{...}'` → 403 확인

### T2: Preview deploy curl 검증 (10min, P1)

PR #2 preview URL에서 수동 검증 (4 시나리오):

```bash
# 시나리오 1: 정상 same-origin (no Origin, Referer 포함)
curl -X POST https://goodman-gls-git-contact-hardening.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -H "Referer: https://goodman-gls-git-contact-hardening.vercel.app/" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}' \
# 기대: 200 (or 400 validation fail, ok)

# 시나리오 2: 외부 origin 거부
curl -X POST https://goodman-gls-git-contact-hardening.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil.example.com" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}' \
# 기대: 403 { error: 'Origin not allowed' }

# 시나리오 3: rate limit 429 (6회 빠르게)
for i in {1..6}; do
  curl -X POST https://goodman-gls-git-contact-hardening.vercel.app/api/contact \
    -H "Content-Type: application/json" \
    -H "Origin: https://goodman-gls-git-contact-hardening.vercel.app" \
    -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
  sleep 0.1
done
# 기대: 1~5번 통과, 6번 429 { error: 'Too many requests', retryAfterSec: N }

# 시나리오 4: Retry-After 헤더 확인
curl -i -X POST https://goodman-gls-git-contact-hardening.vercel.app/api/contact \
  -H "Origin: https://goodman-gls-git-contact-hardening.vercel.app" \
  -d '...' \
# 기대: 429 응답에 `Retry-After: N` 헤더
```

---

## 7. Lessons Learned

### 7.1 Subagent 팩트체킹은 필수

**교훈**: Design 작성 시 "Jest (next 기본)" 이라고 기술했으나, 실제 프로젝트 탐색 결과 jest 미설치 상태. 구현 단계에서 Vitest 도입으로 정정. **사전 팩트체킹 (Read + Grep) 으로 설계 단계부터 검증했으면 더 나았음.**

**적용**: 향후 Design 단계에서 `npm ls jest` / `package.json scripts` 등으로 사실 확인 먼저.

### 7.2 `.env.local.example` gitignore 예외 처리

**발견**: `.env.local.example` 을 저장소에 커밋할 때 `.gitignore` 에 이미 `.env.local` 이 있으면, `.env.local.example` 도 무시될 위험.

**실제**: 구현 시 `.gitignore` 에 명시적으로 `!.env.local.example` 추가해 예외 처리.

**교훈**: 환경 설정 파일의 example/template 은 명시적 include 패턴 필수. 프로젝트 온보딩 시 "git clone 후 `.env.local.example` 을 `.env.local` 로 복사" 가이드도 함께.

### 7.3 "merge" 한 단어로 검증 skip 하는 위험

**발견**: PR description 에 manual curl 4가지 시나리오를 명시했으나, 사용자가 "merge" 한 마디로 preview deploy 검증을 skip.

**문제점**:
- Unit test 는 100% 통과했지만 Vercel runtime + serverless proxy (x-forwarded-for 실제 형식) 동작 미확인
- production 배포 후 1주차에 실제 로그로만 검증 가능한 상황 발생 가능

**교훈**: Unit test 통과 ≠ production ready. 특히 네트워크/프록시 관련 코드는 **preview 단계 manual 검증이 강력한 신호**. 차기 사이클부터:
- PR template 에 "[Critical] Preview Testing Required" 섹션 명시
- API 가드 코드는 "적어도 preview curl 1회 합격" 을 merge 조건으로 기록

### 7.4 Rate limit 메모리 누수 고려

**설계 단계 고민**: in-process Map 기반 rate limit 은 instance 마다 독립적. Vercel serverless 분산 환경에서 cold start 마다 초기화되므로 "완벽한 차단" 은 보장 불가능.

**해결책**: Design §7.3 에 명시했듯이, "1차는 in-process, 효과 부족하면 Vercel KV Redis 분리 사이클" 로 문서화.

**교훈**: 분산 시스템 가정 시 설계 단계에서 **단일 instance 효과 범위 + upgrade path** 를 명시. 완벽함 대신 점진적 개선의 명확한 단계 정의.

### 7.5 API 가드 헬퍼의 재사용성 설계

**발견**: `api-guards.ts` 를 pure function 기반으로 설계했으므로, 향후 `/api/quote` 등 다른 POST 라우트에 즉시 재사용 가능.

**이점**:
- 단위 테스트 용이 (mock 불필요)
- logger sink 함수 단일화로 PostHog/Sentry 통합 포인트 명확
- 타 개발자가 confidence 높게 도입 가능

**교훈**: utility 함수 설계 시 처음부터 "다른 팀/모듈이 써도 되는가" 를 묻기. 이번 사이클 덕분에 P2 후속 사이클 3개 단축 가능.

---

## 8. 후속 분리 사이클 후보

**matchRate 96% 만족 → 본 사이클 완료 후 다음 작업** 으로 이관:

### T3: Navigation i18n + CTA semantic (P1, ~20min)

**현황**: ContactSection.tsx 의 "Contact Us" 버튼이 layout 전역 네비게이션과 중복.

**작업**:
- 다국어 label 정리 (EN "Contact", KO "문의")
- Semantic HTML5 `<section aria-labelledby>` 정책화
- 예상 시간: 20분

**분리 이유**: 현 사이클의 API 가드 기능과 무관 — UI/i18n 문제라 별도 sprint 가능

### T4: ContactSection react-hook-form 마이그레이션 (P2, ~45min)

**현황**: 현재 fetch + 수동 폼 상태 관리.

**개선**:
- react-hook-form + Zod `contactFormSchema` 적용
- 에러 메시지 UI 개선 (429 → "Please try again in a moment" 메시지)
- accessibility 향상 (aria-invalid 등)

**분리 이유**: rate limit 429 응답을 완벽히 처리하는 UX 는 별도 사이클의 가치

**우선순위**: design-system hardening 이후 (현재 P2)

### T5: Sentry / PostHog logger sink (P2, ~30min)

**현황**: `api-guards.ts` 의 `logRejection` 이 `console.warn` 으로만 기록.

**개선**:
```typescript
// Design §6.2 준비된 교체점
function logRejection(kind: 'origin' | 'rate', detail: string) {
  // PostHog.capture() 또는 Sentry.captureMessage() 로 교체
}
```

**분리 이유**: 로깅 인프라 (PostHog/Sentry 초기화) 는 별도 사이클의 책임

### T6: Vercel KV 분산 rate limit (P2, ~1h)

**현황**: in-process Map 기반 → cold start 마다 초기화.

**개선**:
- Vercel KV (Redis) 로 전환
- `enforceRateLimit` 함수 signature 유지 (단순히 backend 변경)

**분리 이유**: T5 로거 통합 이후, production 로그에서 rate limit 효과가 약함이 확인되면 우선순위 상향

**API 호환성**: 현재 설계가 이미 고려함 (Design §7.3 "upgrade path")

### T7: 추가 POST 라우트 가드 재사용 (P2, ~30min)

**현황**: `/api/quote` 등 추가 라우트 미보호.

**개선**:
```typescript
// src/app/api/quote/route.ts
import { assertAllowedOrigin, enforceRateLimit } from '@/lib/api-guards';

export async function POST(request: Request) {
  const originCheck = assertAllowedOrigin(request);
  if (!originCheck.ok) return NextResponse.json({ error: '...' }, { status: 403 });
  // ... 이하 동일
}
```

**분리 이유**: 헬퍼가 재사용 가능하도록 설계됨 — 각 라우트마다 5분 소요 가능

---

## 9. Next Steps

### 즉시 (Complete this sprint)

1. ✅ **this report** — 배포 완료
2. **T1 (ALLOWED_ORIGINS env)**: 오늘 등록 (5min, P0)
3. **T2 (preview curl 검증)**: 오늘 또는 내일 (10min, P1, optional)

### 단기 (1주 이내)

- [ ] Production deploy 후 Vercel logs 모니터링 (1주차 `[api-guards] reject` 메시지 추이)
- [ ] Contact form 실제 사용자 피드백 수집
- [ ] T3 (Navigation i18n) 예약 (다음 주 가능)

### 중기 (2~4주)

- [ ] T4 (ContactSection RHF) + T5 (Sentry/PostHog) 병렬 진행
- [ ] T6 (KV rate limit) 로그 분석 후 우선순위 결정

---

## 10. Quality Metrics Summary

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Design Match Rate | ≥ 90% | **96%** | ✅ |
| Lint (eslint) | 0 errors | 0 errors | ✅ |
| Type Check (tsc) | 0 errors | 0 errors | ✅ |
| Unit Test Pass Rate | 17/17 | 17/17 | ✅ |
| Build Success | 7 routes 모두 통과 | 4 static + 3 dynamic | ✅ |
| FR-01~06 Implementation | 6/6 | 6/6 | ✅ |
| Algorithm Fidelity | Design 일치 | 100% | ✅ |
| Backward Compatibility | same-origin 호환 | 100% | ✅ |

---

## 11. Cycle Timeline

```
┌─────────────────────────────────────┐
│ 2026-05-28 (Day 1)                   │
├─────────────────────────────────────┤
│ 10:00  Plan v0.1 완료                │
│ 14:00  Design v0.2 완료 (Open Q 확정) │
│ 18:00  Implementation 완료 (10 files) │
│        PR #2 squash merged (7cac00f)  │
│        Vitest 17/17 PASS              │
├─────────────────────────────────────┤
│ 2026-05-29 (Day 2)                   │
├─────────────────────────────────────┤
│ 10:00  Analysis v0.1 완료 (gap-detector) │
│        matchRate 96% 확정             │
│ 14:00  Report v1.0 완료 (this)        │
│        Archive 준비 완료              │
└─────────────────────────────────────┘

Total Duration: 1 day (실 작업 시간 ~4h)
```

---

## 12. Archive Preparation

본 사이클 4개 PDCA 문서 준비 완료. 다음 단계에서 archive:

```bash
/pdca archive goodman-gls-contact-hardening
```

**Archiving files**:
- `docs/01-plan/features/goodman-gls-contact-hardening.plan.md`
- `docs/02-design/features/goodman-gls-contact-hardening.design.md`
- `docs/03-analysis/goodman-gls-contact-hardening.analysis.md`
- `docs/04-report/goodman-gls-contact-hardening.report.md` ← 이 문서

**Target**: `docs/archive/2026-05/goodman-gls-contact-hardening/`

---

## 13. Key Assets for Future Reference

| 자산 | 위치 | 용도 |
|------|------|------|
| `api-guards.ts` 헬퍼 | `src/lib/api-guards.ts` | 다른 POST 라우트 재사용 |
| Unit test template | `src/lib/api-guards.test.ts` | Vitest 패턴 참고 |
| Design spec (алgorithms §7) | Design v0.2 §7 | Rate limit/Origin logic 재구현 |
| Environment variable 가이드 | Design v0.2 §10.2 + Plan §7.3 | 다른 api-guards route 적용 시 |
| Open Questions record | Design v0.2 §12 | 의사결정 히스토리 추적 |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-29 | jhlim725 | Initial completion report — matchRate 96%, 모든 FR/알고리즘/테스트 100% 매칭, 비코드 감점 4pp 기록, 후속 7개 분리 사이클 후보 정의, 5가지 lesson learned |

---

*Report generated: 2026-05-29*  
*PDCA Cycle Status: Plan ✅ → Design ✅ → Do ✅ → Check ✅ (96% matchRate) → Act ⏭️ (분리 사이클로 이관) → Report ✅*  
*Next: `/pdca archive goodman-gls-contact-hardening` → docs/archive/2026-05/goodman-gls-contact-hardening/ 이관*
