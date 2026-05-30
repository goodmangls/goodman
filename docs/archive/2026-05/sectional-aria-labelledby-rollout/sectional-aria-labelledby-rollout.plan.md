---
template: plan
version: 0.1
feature: sectional-aria-labelledby-rollout
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
parent_pattern: nav-i18n-cleanup (semantic landmark baseline)
---

# sectional-aria-labelledby-rollout Planning Document

> **Summary**: `nav-i18n-cleanup` 사이클에서 ContactSection 한 곳에 확립한 `<section aria-labelledby>` + heading `id` 패턴을 홈의 나머지 11 컴포넌트 (page sections + Footer) 전반으로 확산. 3 sub-pattern (A: DisplayLines, B: 직접 h2, C: eyebrow only) 별 적용 청사진 제시.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-30
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

`nav-i18n-cleanup` (matchRate 97%, 2026-05-30 archived) 사이클의 Carry-Forward / OOS-1 인 sectional rollout 실행. 마케팅 홈의 모든 page section 이 screen reader 의 region landmark 로 식별되도록 일관된 a11y 정책 baseline 을 확장한다.

### 1.2 Background

- `nav-i18n-cleanup` 으로 확립된 패턴 (ContactSection + DisplayLines `id` prop)
- 모든 사용자 화면 (홈) 11 컴포넌트 중 ContactSection 만 `aria-labelledby` 적용 → 일관성 부재
- 부모 cycle 의 Plan/Design 청사진은 단일 section 적용용. 본 cycle 은 11 section 일괄 적용을 위해 3 sub-pattern 으로 분류.
- Open PR #3 (ECC bundle bot, 본 사이클과 스코프 무관) 외 drift 없음 (`git fetch` 사전 점검 — memory `feedback_concurrent_push_pattern_2026_05_30` 정책 적용)

### 1.3 Related Documents

- 코드 (현 main HEAD `6528757`): `src/components/{Hero,TrustBadges,Stats,WhyGSSA,GSA,ServicesShowcase,Company,NetworkManifesto,PartnerHub,Footer}*.tsx`
- 참조 코드: `src/components/ContactSection.tsx` (베이스라인 패턴), `src/components/DisplayLines.tsx` (id prop 시그니처)
- 부모 cycle: `docs/archive/2026-05/nav-i18n-cleanup/` (전체 4 문서)
- 메모리: `feedback_concurrent_push_pattern_2026_05_30.md` (사이클 시작 정책)

---

## 2. Scope

### 2.1 In Scope (11 컴포넌트)

3 sub-pattern 으로 분류해 일괄 적용:

**Pattern A — DisplayLines heading (6)**
- HeroSection (h1 / display-hero)
- WhyGSSASection (DisplayLines h2)
- ServicesShowcase (DisplayLines h2)
- CompanySection (DisplayLines h2)
- NetworkManifesto (DisplayLines h2)
- Footer (`<footer>` + DisplayLines h2 → landmark + labelledby)

각각: `<section aria-labelledby="{key}-heading">` (또는 `<footer aria-labelledby>`) + DisplayLines `id="{key}-heading"` prop 전달.

**Pattern B — 직접 `<h2>` heading (2)**
- GSASection (h2 직접)
- PartnerHubSection (h2 직접)

각각: `<section aria-labelledby="{key}-heading">` + `<h2 id="{key}-heading">`.

**Pattern C — heading 텍스트 없는 eyebrow only (2)**
- TrustBadges (memberships row, no heading)
- StatsSection (eyebrow + numeric counters, no heading text)

각각: `<section aria-label="..."{i18n key}>` — heading 텍스트 부재로 `aria-labelledby` 부적합. `aria-label` 은 정적 i18n 문자열 (예: TrustBadges → t('home.trust.eyebrow') 값, StatsSection → t('home.stats.eyebrow') 값). **단, aria-label 은 t() 호출 결과 가변 → runtime 동작 확인 필요**.

**FR-1** Pattern A 6 컴포넌트 적용
**FR-2** Pattern B 2 컴포넌트 적용
**FR-3** Pattern C 2 컴포넌트 적용 (TrustBadges 는 `<div>` → `<section>` 변경 포함)
**FR-4** 기존 anchor id (`id="services"/"company"/"network"/"partner-hub"/"contact"`) 보존 — heading id 는 `-heading` suffix 로 별도 부여 (id 충돌 회피)
**FR-5** grep audit 자동 검증 (11 section + 8-9 heading id)

### 2.2 Out of Scope

- `/company`, `/services`, `/network` 라우트 페이지 내부 section 적용 → 별도 사이클 `pages-route-i18n` 또는 `pages-aria-rollout`
- Navigation `aria-label="Primary"` (이미 `nav-i18n-cleanup` 에 적용됨)
- mobile menu (`<motion.div>` overlay) — dialog-style, 별도 landmark 아님
- `aria-describedby` / focus management — 본 사이클은 landmark 만

### 2.3 Assumptions / Constraints

- main HEAD = `6528757`
- DisplayLines `id?` prop 이미 지원 (`nav-i18n-cleanup` Commit C)
- 기존 anchor id (5개) 보존 — 라우팅 `href="#contact"` 등 영향 없음
- vercel.json `|| true` 마스킹 유지 (prerender-debt 별도)
- 단일 commit 또는 3 logical commit (Pattern A/B/C) — Design 단계 결정

---

## 3. Functional Requirements

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-1 | Pattern A 6 컴포넌트 (Hero/WhyGSSA/ServicesShowcase/Company/NetworkManifesto/Footer) 에 `aria-labelledby` + DisplayLines `id` 적용 | `grep -c 'aria-labelledby="hero-heading\|why-heading\|services-heading\|company-heading\|network-heading\|footer-heading"' src/components/` → 6 |
| FR-2 | Pattern B 2 컴포넌트 (GSA/PartnerHub) 에 `aria-labelledby` + `<h2 id>` 적용 | grep `gsa-heading`/`partner-heading` 각 2회 (section + h2) |
| FR-3 | Pattern C 2 컴포넌트 (TrustBadges/Stats) 에 `aria-label` 적용 + TrustBadges 는 `<section>` 으로 wrap | grep `<section aria-label=` 매치 2 |
| FR-4 | 기존 anchor id 5개 (`services`/`company`/`network`/`partner-hub`/`contact`) 보존 | grep `id="services"` 등 매치 5 (변경 0) |
| FR-5 | 자체 grep audit + tsc 0 + lint 0 + vitest 17/17 + build ✓ Compiled | 4 종 PASS |

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | 런타임 회귀 0 | vitest 17/17 PASS |
| NFR-2 | 빌드 회귀 0 | lint 0 / tsc 0 / build ✓ Compiled |
| NFR-3 | a11y 향상 | landmark count 11 → 향상 (Lighthouse manual) |
| NFR-4 | 파일 사이즈 | 컴포넌트당 +2 ~ +3 LOC, 모두 < 800 제한 |
| NFR-5 | 일관성 | heading id 명명 규칙: `{section-key}-heading` (kebab) |

## 5. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | id 충돌 — 기존 anchor id (`id="services"` 등) 와 새 heading id (`services-heading`) 가 같은 section 안 공존 | `-heading` suffix 로 명시적 분리. Design 단계에서 `grep -c 'id="services"\|id="services-heading"' src/` 사전 검증 |
| R-2 | TrustBadges 가 `<div>` → `<section>` 변경 시 부모 레이아웃 영향 | TrustBadges 는 `bg-canvas py-12 border-b border-hairline` 만 — 의미만 변경 (`<section>` vs `<div>`), 시각적 영향 0 |
| R-3 | Pattern C 의 `aria-label` 값이 runtime t() 호출 결과 | t() 가 string 반환 보장 (i18n-messages.ts:35 `return typeof value === 'string' ? value : key`) — 항상 string. tsc 통과 |
| R-4 | Footer 의 `<footer>` 가 이미 landmark — `aria-labelledby` 추가 시 중복? | `<footer>` 는 contentinfo landmark, `aria-labelledby` 는 distinctive name 부여 (a11y 표준 호환) |
| R-5 | DisplayLines `id` prop 누락 케이스 (예: Footer 의 DisplayLines 가 multiple instances?) | grep 사전 검증. Footer 내 DisplayLines instance 가 여러 개면 헤더 부분 식별 |
| R-6 | Sub-pattern 분류 오류 — HeroSection 의 DisplayLines 가 사실 h1 (page-level) 인데 본 cycle 이 h2 처럼 처리 | HeroSection 은 `as="h1"` 명시 — id 부여는 동일 패턴 적용 가능 (h1 도 id 지원) |

## 6. Open Questions

> Design 단계 확정 필요

- **Q1** Pattern C 의 `aria-label` 값: (a) `t('home.trust.eyebrow')` 동적 vs (b) `aria-label="Trust"` / `aria-label="Stats"` 정적 영어. 동적은 i18n 일관성, 정적은 SSR 안전 — Design 단계에서 결정
- **Q2** Footer 의 landmark 처리: 이미 `<footer>` landmark — `aria-labelledby` 추가 vs 그대로 둠. WCAG / aria-practices 권장 사항 확인
- **Q3** 커밋 구조: (a) 단일 commit (11 컴포넌트 일괄) vs (b) 3 logical commit (Pattern A/B/C 분리) — revert 용이성 vs review 단순성 trade-off
- **Q4** HeroSection 의 hero-heading id: Hero 가 page-level 이므로 (a) skip vs (b) 일관성 위해 적용 — `nav-i18n-cleanup` 의 일관성 원칙 적용 시 (b)

## 7. Estimate

- **Plan**: 본 문서 (0.4h, 완료)
- **Design**: Q1~Q4 확정 + 11 컴포넌트 diff plan + grep audit 명세 (~0.3h)
- **Do**: 11 파일 편집 + DisplayLines instance 확인 (~0.3h)
- **Check**: grep audit + 빌드 4종 (~0.2h)
- **Total**: **~1.2h (~70m)**

부모 사이클 패턴 재사용으로 단일 적용 시간 단축 — 11 컴포넌트 × ~2-3min 평균.

## 8. Success Criteria

- ✅ FR-1~FR-5 모두 grep audit 통과
- ✅ lint 0 / tsc 0 / vitest 17/17 / build ✓ Compiled
- ✅ 기존 anchor id 5개 보존 (회귀 0)
- ✅ 11 section + Footer 모두 region landmark 로 식별 (DevTools manual 검증)
- ✅ Lighthouse a11y score 회귀 없음, 가급적 향상 (landmark count ↑)

---

## 9. Next Steps

1. `/pdca design sectional-aria-labelledby-rollout` → Q1~Q4 확정 + 11 컴포넌트 file diff plan
2. `/pdca do sectional-aria-labelledby-rollout` → 단일 또는 3 logical commit (Q3 결정)
3. Check (matchRate ≥95% 기대 — 부모 패턴 재사용) → report → archive
