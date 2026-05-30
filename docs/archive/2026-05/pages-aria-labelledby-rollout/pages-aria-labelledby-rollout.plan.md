---
template: plan
version: 0.1
feature: pages-aria-labelledby-rollout
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
parent_pattern: sectional-aria-labelledby-rollout (home 11 sections)
---

# pages-aria-labelledby-rollout Planning Document

> **Summary**: 부모 cycle `sectional-aria-labelledby-rollout` 의 region landmark 패턴을 `/company`, `/services`, `/network` 3 라우트 페이지의 13 sections 로 확산. 사용자 commit `6fad87d` 가 i18n 완료한 직후 시점 — 본 사이클은 a11y 만 추가.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-30
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

부모 cycle `sectional-aria-labelledby-rollout` (matchRate 97%, 2026-05-30 archived) 에서 홈 11 컴포넌트에 적용한 region landmark 패턴을 `/company`, `/services`, `/network` 3 라우트 페이지 (총 13 source-code `<section>`) 으로 확산. 마케팅 사이트 전 페이지에서 일관된 a11y baseline 확립.

### 1.2 Background

- **2026-05-30 사용자 commit `6fad87d`** "🚚 content(GLS): GSSA 중심 → 종합물류업 전면 전환" 가 services 4→6 확장 + Hero CTA + messages 한/영 동기 + 서브페이지 i18n 적용
- 그 결과 services/network/company page 의 t() 호출 풍부 (14/17/20 매치) — 원래 카탈로그된 `pages-route-i18n` 사이클의 i18n 부분은 **OBE (overcome by events)** 처리
- 남은 페이지 부채는 **aria-labelledby 부재** (13 sections / 0 aria-labelledby) — 본 사이클 스코프
- 사이클명 정확화: `pages-route-i18n` → **`pages-aria-labelledby-rollout`** (사용자 결정 2026-05-30)
- 부모 cycle 의 3 sub-pattern (A: DisplayLines, B: 직접 h-tag, C: aria-label) 재사용

### 1.3 Related Documents

- 코드 (현 main HEAD `6fad87d`):
  - `src/app/company/page.tsx` (5 sections, 3 DisplayLines, 4 h-tag)
  - `src/app/services/page.tsx` (4 sections [그 중 1개는 services 6종 map loop], 2 DisplayLines, 2 h-tag)
  - `src/app/network/page.tsx` (4 sections, 2 DisplayLines, 3 h-tag)
- 부모 cycle: `docs/archive/2026-05/sectional-aria-labelledby-rollout/` (4 docs)
- 메모리: `feedback_concurrent_push_pattern_2026_05_30.md` (drift 점검 정책)

---

## 2. Scope

### 2.1 In Scope (13 source-code sections)

**company/page.tsx (5 sections)**
1. L21 `page-hero` (DisplayLines) → Pattern A `id="company-hero-heading"`
2. L40 CEO quote (inline h2 `display-lg`) → Pattern B `id="company-ceo-heading"`
3. L81 heritage (inline h2) → Pattern B `id="company-heritage-heading"`
4. L138 timeline lilac (DisplayLines) → Pattern A `id="company-timeline-heading"`
5. L187 values ink (inline h2) → Pattern B `id="company-values-heading"`

**services/page.tsx (4 source sections)**
1. L38 page-hero (inline h1) → Pattern B `id="services-hero-heading"`
2. L57 sticky quick nav (heading 없음 — 단순 anchor 링크) → Pattern C `aria-label={t('pages.services.quickNavLabel')}` (메시지 key 필요 시 추가)
3. L71 services.map (per service.id 반복, inline h2) → Pattern B `id="services-${service.id}-heading"` (동적 interpolation)
4. L139 obsidian section (DisplayLines) → Pattern A `id="services-cta-heading"`

**network/page.tsx (4 sections)**
1. L26 page-hero (DisplayLines) → Pattern A `id="network-hero-heading"`
2. L47 ECS partner networks (heading 컨테이너) → Pattern A 또는 B (Design 단계 확정)
3. L83 GSSA (inline h2) → Pattern B `id="network-gssa-heading"`
4. L128 ecosystem (inline h2) → Pattern B `id="network-ecosystem-heading"`

**FR-1** company/page.tsx 5 sections 적용
**FR-2** services/page.tsx 4 source sections 적용 (map 포함)
**FR-3** network/page.tsx 4 sections 적용
**FR-4** 기존 anchor id 보존 (예: services 의 `id={service.id}` 같은 라우팅 anchor)
**FR-5** grep audit 자동 검증

### 2.2 Out of Scope

- 홈 컴포넌트 (`src/components/`) — 부모 cycle 에서 이미 처리
- `pages-route-i18n` 의 i18n 부분 → 사용자 commit `6fad87d` 로 OBE
- 메시지 신규 키 추가 (Pattern C 의 sticky nav aria-label 용 1-2 key 만 가능, Design 단계 결정)
- TypeScript / lint / 테스트 변경 — attribute 추가만

### 2.3 Assumptions / Constraints

- main HEAD = `6fad87d` (사용자 content commit)
- DisplayLines `id?` prop 이미 활성 (조부모 cycle nav-i18n-cleanup 자산)
- 기존 anchor id (services 의 `service.id` 등) 보존
- vercel.json `|| true` 마스킹 유지
- 단일 commit 또는 3 logical commit (pages 별) — Design 단계 결정 (부모는 단일 commit 채택)

---

## 3. Functional Requirements

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-1 | company 5 sections 적용 | `grep -c 'aria-labelledby="company-' src/app/company/page.tsx` → 5 |
| FR-2 | services 4 source sections 적용 (map 포함) | services-hero/services-cta + services-${id} 동적 + sticky nav aria-label = source 4 |
| FR-3 | network 4 sections 적용 | `grep -c 'aria-labelledby="network-' src/app/network/page.tsx` → 4 |
| FR-4 | 기존 anchor id 보존 | services `id={service.id}` 패턴 유지 (회귀 0) |
| FR-5 | 자체 grep audit + lint 0 + tsc 0 + vitest 17/17 + build ✓ Compiled | 4 종 PASS |

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | 런타임 회귀 0 | vitest 17/17 PASS |
| NFR-2 | 빌드 회귀 0 | lint 0 / tsc 0 / build ✓ Compiled (prerender debt 마스킹 유지) |
| NFR-3 | a11y 향상 | pages 13 sections region landmark, Lighthouse 회귀 0 (사용자 manual) |
| NFR-4 | 파일 사이즈 | 페이지당 +5 ~ +12 LOC, 모두 < 800 제한 |
| NFR-5 | 일관성 | heading id 명명: `{page}-{section}-heading` (kebab, 부모와 충돌 회피) |

## 5. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | 부모 cycle 의 home heading id 와 pages heading id 충돌 (예: home `hero-heading` vs page `company-hero-heading`) | namespace prefix (`company-*`, `services-*`, `network-*`) 로 명시적 분리 — Design 단계 검증 |
| R-2 | services map loop 의 동적 id (`services-${service.id}-heading`) 가 runtime 에만 결정 — grep 정적 검증 한계 | grep 으로 interpolation 패턴 (`services-\${service\.id}-heading`) 검증 + DOM runtime smoke 사용자 manual |
| R-3 | network L47 (ECS networks) 의 정확한 heading element 식별 모호 | Design 단계에서 source 정밀 inspect + Pattern A/B 결정 |
| R-4 | services sticky quick nav (L57) 에 heading 없음 — aria-label 만 (Pattern C) — 메시지 신규 키 필요 가능성 | Plan §2.2 OOS 명시 — Pattern C 채택 시 메시지 1 key 추가 (`pages.services.quickNavLabel`) 또는 정적 영어 string fallback |
| R-5 | 사용자 services 페이지 작업이 진행 중이면 충돌 | 메모리 정책 적용 — Do 시작 + push 직전 `git fetch` 2회 점검 |
| R-6 | 부모 cycle 의 `services-showcase-heading` (홈) vs 본 사이클 `services-hero-heading` (페이지) 혼동 가능성 | Design §2 충돌 매트릭스 명시 |

## 6. Open Questions

> Design 단계 확정

- **Q1** services L57 sticky nav 의 `aria-label` 값: (a) i18n 동적 신규 키 `pages.services.quickNavLabel` (b) 정적 영어 `"Quick navigation"` — i18n 원칙 vs 메시지 1 key 추가 비용
- **Q2** network L47 ECS networks 의 heading: 정확한 element 식별 + Pattern A vs B
- **Q3** 커밋 구조: (a) 단일 commit (부모 패턴 재사용) (b) 3 logical commit (페이지별 분리) — revert 용이성 vs review 단순성
- **Q4** services map loop section 의 aria-labelledby 동적 id 패턴 검증 방법 — Playwright runtime check vs source 정적 grep + DOM manual

## 7. Estimate

- **Plan**: 본 문서 (0.4h, 완료)
- **Design**: Q1~Q4 확정 + 13 sections diff plan + grep audit 명세 (~0.3h)
- **Do**: 3 페이지 편집 (~0.3h, 페이지당 5~12 LOC, map 패턴 포함)
- **Check**: grep audit + 빌드 4종 (~0.2h)
- **Total**: **~1.2h (~70m)**

부모 cycle 패턴 재사용 + Open Q 사전 정리.

## 8. Success Criteria

- ✅ FR-1~FR-5 모두 grep audit 통과
- ✅ lint 0 / tsc 0 / vitest 17/17 / build ✓ Compiled
- ✅ 기존 anchor id (services `service.id` 등) 보존
- ✅ pages 13 sections region landmark — DevTools manual + Lighthouse score 회귀 0
- ✅ 부모 cycle (홈) heading id 와 충돌 0

---

## 9. Next Steps

1. `/pdca design pages-aria-labelledby-rollout` → Q1~Q4 확정 + 13 sections diff plan
2. `/pdca do pages-aria-labelledby-rollout` → 단일 또는 3 logical commit
3. Check (matchRate ≥95% 기대) → report → archive
