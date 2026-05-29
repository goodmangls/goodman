---
template: design
version: 1.2
feature: goodman-gls-prerender-debt
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan_ref: docs/01-plan/features/goodman-gls-prerender-debt.plan.md
---

# goodman-gls-prerender-debt Design Document

> **Summary**: Plan 의 옵션 A (`next/dynamic(ssr:false)` 로 ThemeProvider lazy-load) 를 1차 surgical fix 로 적용. 동시에 FOUC 회피를 위해 layout `<head>` 에 사전-class 주입 inline script 를 추가. 실패 시 fallback 은 옵션 C (Next 16.2.x patch upgrade).
>
> **Plan**: `docs/01-plan/features/goodman-gls-prerender-debt.plan.md`
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-29
> **Status**: Draft

---

## Pipeline References

| Phase | Status |
|-------|--------|
| Plan | ✅ v0.1 (2026-05-29) |
| Design | 🔄 v0.1 (이 문서) |
| Do | ⏳ pending |
| Check | ⏳ pending |

---

## 1. Overview

### 1.1 Design Goals

| ID | Goal | Measure |
|----|------|---------|
| G-1 | `npm run build` exit 0 | local `npm run build` 결과 |
| G-2 | `/_global-error` 포함 모든 page prerender 통과 | Next 빌드 로그 7/7 PASS |
| G-3 | Theme toggle (light↔dark) 동작 유지 | `/browse` 클릭 + `<html class>` 토글 확인 |
| G-4 | FOUC ≤ 1 frame | dev/prod 모드 양쪽 시각 확인 |
| G-5 | 변경 라인 ≤ 50 | `git diff --stat` |
| G-6 | Vitest 17/17 + ESLint 0 + tsc exit 0 회귀 없음 | CI 동급 로컬 검사 |

### 1.2 Design Principles

1. **Surgical 우선**: Provider 1 줄 + script 5 줄. 변경 최소.
2. **Hydration mismatch 방지**: SSR/CSR 트리는 동일, theme class 만 head script 가 사전 주입.
3. **Fallback ready**: A 실패 시 즉시 옵션 C 로 전환 가능하도록 변경 격리 (Providers.tsx + layout.tsx 만 손댐).
4. **Rollback safety**: 변경 두 곳 모두 단일 commit 으로 revert 가능.

---

## 2. Architecture

### 2.1 Component Diagram

**Before (현재):**
```
RootLayout (server)
  └── ClientLayout 'use client'
        └── Providers 'use client'
              └── ThemeProvider (next-themes, useContext)  ← 모든 page prerender 시 평가
                    └── LanguageProvider (useContext)
                          └── children
```
→ `/_global-error` prerender 시 ThemeProvider 의 useContext null. (ThemeProvider 제거 시 `/company` 가 useState null 로 떨어짐 — React 19 + Next 16.2.4 dispatcher 차원 systemic.)

**After (옵션 A):**
```
RootLayout (server)
  ├── <head>: inline <script> → localStorage 읽고 html.classList 사전 주입
  └── ClientLayout 'use client'
        └── Providers 'use client'
              ├── DynamicThemeProvider = next/dynamic(ThemeProvider, {ssr:false})
              │     ↳ SSR/SSG: placeholder (children pass-through)
              │     ↳ Client mount: 실제 ThemeProvider 로 hydrate
              └── LanguageProvider (useContext) — SSR/CSR 동일 유지
                    └── children
```

### 2.2 Data Flow

```
[Build time / SSR]
  Server renders HTML with NO theme class on <html>
  ↓
[HTML delivered]
  Browser parses <head>; inline script reads localStorage.getItem('theme')
  → html.classList.add('dark') if needed
  ↓ (사용자 시각: 정확한 테마로 표시 — FOUC 없음)
[React hydration]
  ClientLayout mounts, Providers mounts
  DynamicThemeProvider lazy-loads (next/dynamic) — placeholder children pass-through
  ↓
[Client mount complete]
  Real ThemeProvider takes over; useTheme/setTheme 활성
  setTheme(...) → html.classList 토글 + localStorage 동기화
```

### 2.3 Dependencies

| 라이브러리 | 현행 | 변경 | 비고 |
|---|---|---|---|
| `next` | ^16.2.4 | 유지 | 옵션 C 로 fallback 시 패치 검토 |
| `next-themes` | ^0.4.6 | 유지 | lazy import 만 |
| `react` / `react-dom` | 19.2.3 | 유지 | RC 상태 — Next 패치 시 영향 |
| `framer-motion` | ^12.26.2 | 유지 | ThemeToggle 의존성 |

신규 의존성: **없음** (next/dynamic 은 Next core).

---

## 3. Data Model

해당 없음 (UI 인프라 변경).

---

## 4. API Specification

해당 없음.

---

## 5. UI/UX Design

### 5.1 시각 영향 범위

`dark:` 사용처는 단 1곳: `src/components/Navigation.tsx:65` (로고 invert).

```tsx
const logoClass = isHeroNav
  ? 'object-contain object-left brightness-0 invert'
  : 'object-contain object-left dark:invert';
```

FOUC 시나리오:
- `dark` 사용자: localStorage 에 `theme=dark` 저장 → inline script 가 html.dark 사전 주입 → 로고 invert 즉시 적용. **FOUC 없음**.
- `light` 사용자 (기본): script 가 아무것도 안 함 → 기본 light 로 렌더. **FOUC 없음**.
- 첫 방문 사용자 (localStorage 비어 있음): defaultTheme="light" 적용. **FOUC 없음**.

### 5.2 ThemeToggle 동작

기존 `mounted` 가드 패턴(현재 코드 그대로) 이 SSR 시 빈 div 반환 → client mount 후 토글 표시. `next/dynamic(ssr:false)` 와 자연스럽게 호환.

---

## 6. Error Handling

### 6.1 Inline script 실패 시

```js
try {
  const t = localStorage.getItem('theme');
  if (t === 'dark') document.documentElement.classList.add('dark');
} catch (e) { /* localStorage 비활성 환경 — light 로 진행 */ }
```

- localStorage 차단(시크릿 모드, ITP 등) → catch → 기본 light fallback
- 스크립트 자체가 발사되지 않을 가능성은 없음 (Next 의 `<head>` 위치)

### 6.2 Dynamic import 실패

`next/dynamic` 의 ssr:false 는 module 가져오기 실패 시 placeholder 유지. ThemeProvider 가 영영 mount 안 되어도 page 는 작동 (테마 토글만 비활성). 콘솔에 error 표시 → Sentry 등 차후 결정.

---

## 7. Implementation Diff Plan

### 7.1 `src/components/Providers.tsx`

**Before:**
```tsx
'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
```

**After:**
```tsx
'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

// SSR/SSG 단계에서 next-themes 가 useContext null 을 던지는 framework 버그 회피.
// Inline script (layout.tsx) 가 hydration 전 html.dark 사전 주입 → FOUC 없음.
const ThemeProvider = dynamic(
  () => import('next-themes').then((m) => m.ThemeProvider),
  { ssr: false },
);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
```

Diff: +4 / -1 (총 5줄)

### 7.2 `src/app/layout.tsx` (head inline script 추가)

**Before:**
```tsx
return (
  <html lang="en" className={`${inter.variable} ${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
    <body suppressHydrationWarning>
      <Suspense>
        <ClientLayout>{children}</ClientLayout>
      </Suspense>
    </body>
  </html>
);
```

**After:**
```tsx
return (
  <html lang="en" className={`${inter.variable} ${outfit.variable} ${mono.variable}`} suppressHydrationWarning>
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}`,
        }}
      />
    </head>
    <body suppressHydrationWarning>
      <Suspense>
        <ClientLayout>{children}</ClientLayout>
      </Suspense>
    </body>
  </html>
);
```

Diff: +9 / -0

**총 변경**: 2 파일, +13 / -1 (≤ 50 라인 목표 충족 ✓)

### 7.3 변경 안 하는 것

- `src/app/global-error.tsx` — 그대로. Boundary 격리는 이미 e02a060 에서 시도됐고 framework 버그는 이 폴백 아닌 prerender pipeline 자체에서 발생
- `src/app/not-found.tsx` — 그대로 (d2e113a 에 force-dynamic 적용 완료)
- `src/contexts/LanguageContext.tsx` — 그대로. SSR-guarded 패턴(`typeof window`) 이미 적용 → 옵션 A 적용 후에도 SSR 통과 가능성 높음
- `package.json` — 의존성 변경 없음

### 7.5 `vercel.json` 추가 변경 (중대 발견)

**현재 상태:**
```json
{ "framework": "nextjs", "buildCommand": "next build || true" }
```

`|| true` 가 **빌드 실패를 무시하고 deploy 를 진행** 시킴 → 이번 사이클의 success criterion "Vercel build 통과" 가 실질 의미를 가지려면 이걸 제거해야 함. 또한 이 마스킹이 prerender debt 가 prod 까지 흘러간 핵심 원인 중 하나로 식별됨.

**변경:**
```json
{ "framework": "nextjs", "buildCommand": "next build" }
```

Diff: +1 / -1

**Risk**: 옵션 A 적용 후 Vercel 빌드가 실제로 실패하면 production deploy 가 멈춤. 이는 의도된 효과 (silent prod 부채 차단). 안전망: 변경을 옵션 A 와 같은 commit 에 묶고, Vercel preview 가 green 인 것을 확인한 뒤에만 main merge.

**총 변경 갱신**: 3 파일, +14 / -2

### 7.4 Fallback (옵션 A 실패 시)

만약 build 가 `/_global-error` 가 아닌 다른 page (예: `/company`, `/services`) 에서 useState null 로 떨어지면, framework 자체 이슈 → 즉시 옵션 C (Next 패치 업그레이드) 로 전환:

1. `npm install next@16.2.5` (또는 latest 16.2.x patch)
2. `node_modules/.cache` 삭제
3. `npm run build` 재시도
4. 회귀 시 옵션 B (next-themes 업그레이드) → 옵션 D (route group sub-layout)

---

## 8. Test Plan

### 8.1 Test Scope

| 영역 | 방법 | 통과 기준 |
|---|---|---|
| Build | `npm run build` | exit 0, 7/7 page prerender PASS |
| Lint | `npm run lint` (eslint) | 0 errors |
| Type | `npx tsc --noEmit` | exit 0 |
| Unit | `npm test` (Vitest 17/17 — contact-hardening) | 17/17 PASS, 회귀 없음 |
| Visual | `/browse` viewport 375/768/1280/1920 + `/`, `/company`, `/services`, `/network` | 시각 회귀 없음 (이전 commit d2e113a, 9f074c3 기준) |
| Theme | manual: localStorage 'dark' set, page reload | 첫 paint 부터 dark 적용 (FOUC 없음) |
| Theme toggle | manual: `/browse click <toggle>` → snapshot diff | `<html class="...dark">` 클래스 토글 확인 |
| Prod local | `npm run build && npm run start` | 200 응답, console error 0 |

### 8.2 Test Cases

| TC | 시나리오 | 기대 결과 |
|---|---|---|
| TC-1 | `npm run build` (clean .next) | "✓ Compiled successfully" + page generation 7/7 + exit 0 |
| TC-2 | 빌드 후 `npm run start` → `/` GET | 200, HTML 응답에 `<html lang="en">` + inline script 존재 |
| TC-3 | 빌드 후 `/_global-error` 라우트 직접 접근 (없는 path → 404 → global-error 활성) | 폴백 UI 정상 |
| TC-4 | localStorage 빈 상태 → `/` 로드 | html.dark 없음, light 테마 |
| TC-5 | localStorage `theme=dark` → `/` 로드 | inline script 동기 실행 → 첫 paint 부터 html.dark |
| TC-6 | ThemeToggle 클릭 (light→dark) | html.dark 추가 + localStorage 동기화 + Navigation 로고 invert 적용 |
| TC-7 | ThemeToggle 클릭 (dark→light) | html.dark 제거 + localStorage 동기화 |
| TC-8 | `/company`, `/services`, `/network` 각각 prerender | 7/7 build success 일부로 통과 |
| TC-9 | Vitest 17/17 회귀 | contact-hardening 테스트 PASS, 추가 fail 없음 |
| TC-10 | 모바일 375 + 데스크탑 1920 시각 회귀 | 이전 디자인 사이클 결과와 동일 |
| TC-11 | `vercel.json` 의 `\|\| true` 제거 후 Vercel preview 빌드 | exit 0 + deployment URL 200 응답 (옵션 A 효과 가시화) |
| TC-12 | EN↔KO 토글 (Navigation 우측 language switch) 클릭 | LanguageContext `setLocale` 정상 호출, `<html lang>` 갱신 |

### 8.3 Negative cases

| TC | 시나리오 | 기대 결과 |
|---|---|---|
| TC-N1 | localStorage 차단 (private mode) | catch 발사, light fallback, console silent |
| TC-N2 | next-themes dynamic import 실패 (mock) | placeholder 유지, page 작동, 토글만 비활성 |
| TC-N3 | suppressHydrationWarning 가 제거된 상태로 빌드 | hydration warning 가능 (현재 코드 그대로 두므로 N/A — 회귀 확인용) |

### 8.4 Rollback test

| TC | 시나리오 | 기대 결과 |
|---|---|---|
| TC-R1 | `git revert <commit>` 후 `npm run build` | 이전 상태(`/_global-error` 실패)로 복귀, 다른 페이지 영향 없음 |

---

## 9. Clean Architecture

이 사이클은 인프라 차원 — Domain/Application/Infrastructure layer 영향 없음.

- **Domain**: 변경 없음
- **Application**: 변경 없음
- **Infrastructure**: Provider lazy-loading (옵션 A) + layout head script — Presentation/Composition layer 내부

---

## 10. Coding Convention Reference

### 10.1 This Feature's Conventions

| 항목 | 규약 |
|---|---|
| Dynamic import | `next/dynamic` (Next 권장) + `ssr: false` 명시 |
| Inline script | `dangerouslySetInnerHTML` 사용 시 try/catch 로 fail-safe |
| FOUC 방지 | `<head>` 안 sync `<script>` (no `defer`, no `async`) |
| Theme storage key | `theme` (next-themes 기본값, 변경 안 함) |
| Provider 단일 진입 | `src/components/Providers.tsx` 유지 |

### 10.2 환경 변수

추가 없음.

### 10.3 외부 자료

- Next.js docs: [Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- next-themes README: [SSR / Avoiding FOUC](https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch)
- 관련 issue 검색 키워드: "Next 16 React 19 useContext null prerender", "next-themes React 19"

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-29 | jhlim725 | Initial design — 옵션 A 1차 surgical fix(Provider lazy + head script), test plan 10+3+1 TC, fallback path 옵션 C |
| 0.2 | 2026-05-29 | jhlim725 | design-validator 90/100 PASS 보강 — vercel.json `\|\| true` 빌드 실패 마스킹 제거 추가(§7.5), TC-11/TC-12 (Vercel preview + EN↔KO) 추가, 4 사전 확인 (dark:/CSP/ThemeToggle/LanguageContext) 모두 통과 |
