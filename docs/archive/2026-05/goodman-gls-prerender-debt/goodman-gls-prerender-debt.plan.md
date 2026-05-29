---
template: plan
version: 1.2
feature: goodman-gls-prerender-debt
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
---

# goodman-gls-prerender-debt Planning Document

> **Summary**: Next 16.2.4 + React 19.2.3 prerender pipeline 이 `/_global-error` (그리고 잠재적으로 다른 페이지)에서 framework hooks-dispatcher null 오류로 실패해 `npm run build` 가 깨지고 Vercel auto-deploy 가 차단되어 있다. 이 부채를 분리 사이클로 해소해 prod 배포를 unblock 한다.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-29
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

현재 `npm run build` 가 다음 지점에서 실패한다:

```
Generating static pages using 7 workers (0/7) ...
Error occurred prerendering page "/_global-error".
TypeError: Cannot read properties of null (reading 'useContext')
   at ignore-listed frames
   digest: '1759492429'
Export encountered an error on /_global-error/page: /_global-error
Next.js build worker exited with code: 1
```

영향:
- **Vercel production deploy 차단** — 같은 코드 베이스가 origin/main 에 push 돼 있어 Vercel 빌드도 깨질 확률 매우 높음
- 로컬·CI 의 `npm run build` 모두 실패 — 다른 부채(예: contact-hardening 의 build 검증) 에도 지장
- 진단·디버깅 비용 누적: 이전 `/check` 세션에서 2회, /design-polish 세션에서 1회 같은 지점에서 막힘

### 1.2 Background

이전 세션(2026-05-28~29) 진단 누적:

1. **첫 시도 (e02a060)**: `app/global-error.tsx` 추가 (force-dynamic + 자체 html/body) — `/_global-error` 통과 보고됐으나 실제로는 build 8/7 fail 상태 (메모리 오기록).
2. **두 번째 (`/check`, 2026-05-29)**:
   - `app/not-found.tsx` 추가 (force-dynamic + self-contained) → `/_not-found` 통과 ✓ (커밋 `d2e113a` 에 포함)
   - `/_global-error` 에 force-dynamic 추가 시도 → 동작 안 함 (boundary 는 route segment config 무시)
   - **Discriminator 실험**: `Providers.tsx` 에서 ThemeProvider 제거하니 실패 지점만 `/_global-error` → `/company` (useState null) 로 이동 → **단일 컴포넌트 문제 아닌 systemic**
3. **세 번째 (Footer fix, 2026-05-29)**: build 미실행. `/_global-error` 실패 그대로.

핵심 fact:
- Stack: `next 16.2.4`, `react 19.2.3`, `react-dom 19.2.3`, `next-themes 0.4.6`, `next-intl 4.6.1`
- 오류 위치: framework `ignore-listed frames` (사용자 코드 아님)
- 증상: `useContext null` (`/_global-error`) → ThemeProvider 제거 시 `useState null` (`/company`)
- React dispatcher 가 prerender phase 에서 set up 안 된 상태로 hooks 호출됨

### 1.3 Related Documents

- 빌드 실패 로그: 이번 세션 Bash 출력 + 이전 `/check` 세션
- 이전 시도 코드: `src/app/global-error.tsx` (현행), `src/app/not-found.tsx` (커밋 d2e113a)
- 시도 대상: `src/components/Providers.tsx`, `src/contexts/LanguageContext.tsx`
- 메모리: `~/.claude/projects/-Users-jaehong/memory/project_goodman_gls_build_prerender_debt_candidate.md` (정정 필요 — "build 8/8 PASS" 는 실제 검증되지 않음)

---

## 2. Scope

### 2.1 In Scope

- [ ] `npm run build` 가 로컬·Vercel 양쪽에서 exit 0 으로 통과
- [ ] `/_global-error` prerender 통과 (또는 명시적 SSR-only 전환)
- [ ] 모든 user-facing 페이지 (`/`, `/company`, `/services`, `/network`, `/auth/*`, `/portal/*`) prerender 통과
- [ ] next-themes / next-intl 의 SSR 호환 동작 검증
- [ ] 회귀 방지: ThemeProvider/LanguageProvider 기능(테마 토글, 로케일 전환) 유지
- [ ] 변경 사항 문서화 (`AGENTS.md` 또는 `CLAUDE.md` 의 "Tech Stack" 섹션 업데이트)

### 2.2 Out of Scope

- 디자인 시스템 추가 변경 (이전 사이클 d2e113a 로 마감)
- Footer overflow 추가 변경 (이전 사이클 9f074c3 로 마감)
- contact-hardening 작업 (별도 활성 사이클)
- 새 페이지 추가 / 라우팅 구조 변경
- Tailwind / CSS 토큰 추가 손질

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-1 | `npm run build` 이 exit 0 으로 통과 (모든 page prerender 성공) | P0 |
| FR-2 | Vercel preview·production deploy 성공 | P0 |
| FR-3 | 다크/라이트 테마 토글이 기존처럼 동작 | P1 |
| FR-4 | 언어 전환(EN↔KO) 이 기존처럼 동작 (`LanguageContext`) | P1 |
| FR-5 | `global-error.tsx` 폴백 UI 가 런타임 에러 시 정상 표시 | P2 |

### 3.2 Non-Functional Requirements

| ID | 요구사항 | 측정 기준 |
|----|----------|-----------|
| NFR-1 | 빌드 시간 회귀 ≤ 10% (현 baseline 측정 필요) | `npm run build` wall-clock |
| NFR-2 | First Load JS 회귀 ≤ 5KB (gzipped) | Next build output 비교 |
| NFR-3 | LCP / CLS 회귀 없음 | Lighthouse 또는 PageSpeed |
| NFR-4 | 변경 범위 최소화 — provider 구조 surgical fix 우선 | diff 라인 수 < 50 권장 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] `npm run build` 가 로컬에서 exit 0 으로 통과
- [ ] origin/main push 후 Vercel 빌드 성공 (preview URL 200 응답)
- [ ] Hero/Stats/WhyGSSA/Services/Company/Network/Contact/Footer 모두 시각 회귀 없음 (`/browse` 기준)
- [ ] 다크/라이트 토글 토글 동작 검증 (manual)
- [ ] EN↔KO 토글 동작 검증 (manual)
- [ ] Plan/Design/Analysis 문서 모두 작성됨
- [ ] Gap analysis matchRate ≥ 90%

### 4.2 Quality Criteria

- ESLint 0 errors
- `tsc --noEmit` exit 0
- 변경 파일 수 ≤ 5 (provider/layout/config 만)
- `.commit_message.txt` 갱신
- Vitest 17/17 PASS (contact-hardening 회귀 없음)

---

## 5. Risks and Mitigation

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| **R-1**: next-themes 0.4.6 의 React 19 호환 버전이 아직 없음 | Mid | High | next-dynamic ssr:false 로 ThemeProvider 격리; 또는 `useTheme` 자체 구현으로 대체 |
| **R-2**: Next 16.2.x patch 가 framework 버그 해결 못 함 | Mid | High | 16.2.x → 16.3-rc 또는 16.1 downgrade 검토 |
| **R-3**: 변경이 다른 페이지 SSR/SSG 동작에 회귀 | Mid | Mid | `/browse` 로 모든 페이지 시각 회귀 검증 |
| **R-4**: ThemeProvider 제거하면 FOUC(Flash Of Unstyled Content) 재발 | Low | Mid | next-themes 의 cookie-based SSR 전략 또는 inline script 폴백 |
| **R-5**: 빌드는 통과해도 런타임에 새 에러 발생 | Low | High | dev 서버 + production-mode local serve 양쪽 검증 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

**Level**: Dynamic (Static Marketing Site with auth-gated portal)
**근거**: prerender 전반 (마케팅 페이지) + dynamic 구간 (auth/portal) 공존. 빌드 시 SSG 의존도 높음 → prerender 통과 필수.

### 6.2 Key Architectural Decisions

Design phase 에서 다음 중 선택 (옵션은 advisor/codex 자문 후 결정):

| 옵션 | 변경 범위 | 위험 | 효과 |
|------|-----------|------|------|
| **A. Provider lazy-load (ssr:false)** | `Providers.tsx` 1줄 → `next/dynamic(ThemeProvider, {ssr:false})` | Low | FOUC 가능, 빌드 통과 가능성 높음 |
| **B. next-themes 업그레이드/교체** | package.json + Providers.tsx | Mid | 0.4.6 → latest, React 19 공식 지원 확인 |
| **C. Next 16 패치 업그레이드** | package.json | Mid | 16.2.4 → 16.2.x 또는 16.3 RC, 회귀 가능 |
| **D. Provider 를 layout sub-route 로 이동** | `app/layout.tsx` + route group `(themed)/layout.tsx` | High | `/_global-error` 가 provider 상속 안 함 |
| **E. global-error 자체 격리** | global-error 가 layout 우회하므로 이미 격리됨 — 핵심 원인 외부 | n/a | 효과 없음 (이전 시도 실패) |

권장: **A → C → B → D** 순서로 시도 (변경 최소 → 점진 확장).

### 6.3 Clean Architecture Approach

이 사이클은 인프라 차원 부채 해소 — Domain layer 영향 없음. Provider/Layout/Dependency 만 손댐.

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- React 19 RC 사용 (`react: 19.2.3`)
- Next 16 App Router + Turbopack (`next: ^16.2.4`)
- Tailwind v4 (`@tailwindcss/postcss: ^4`)
- 모든 client provider 는 `src/components/Providers.tsx` 단일 진입

### 7.2 Conventions to Define/Verify

- [ ] `global-error.tsx` 의 'use client' 유지 여부 (Next 공식 권장)
- [ ] FOUC 회피 전략 (next-themes 의 `disableTransitionOnChange` 등)
- [ ] SSR-disabled Provider 의 fallback 처리

### 7.3 Environment Variables Needed

없음 (provider/dependency 만 변경)

### 7.4 Pipeline Integration

- 기존 단계: dev/build/lint
- 추가 검증: `npx next build && npx next start` 으로 prod 모드 local serve 후 `/browse` 시각 회귀

---

## 8. Next Steps

1. **Design** (`/pdca design goodman-gls-prerender-debt`):
   - 옵션 A 부터 실증: `Providers.tsx` 에 `next/dynamic` 적용 + 로컬 build 검증
   - 실패 시 옵션 C (Next patch upgrade) 시도
   - 양쪽 다 실패 시 옵션 D (route group sub-layout) 설계
   - 최종 선택 옵션의 diff plan 과 test plan 정리
2. **Do**: Design 의 surgical diff 적용 + `npm run build` 검증
3. **Check**: 시각 회귀 (`/browse`) + Lighthouse + Vitest 17/17 회귀 확인
4. **Report**: matchRate 산출 후 archive

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-29 | jhlim725 | Initial draft — 이전 3 세션 진단 통합, 5 옵션 enumerated, A→C→B→D 권장 순서 |
