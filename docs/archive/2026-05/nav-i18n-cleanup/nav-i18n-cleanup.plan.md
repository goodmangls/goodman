---
template: plan
version: 0.1
feature: nav-i18n-cleanup
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
parent: goodman-gls-nav-i18n (superseded-partial)
---

# nav-i18n-cleanup Planning Document

> **Summary**: 종료된 사이클 `goodman-gls-nav-i18n` 의 carry-forward 5건만 깔끔하게 main 에 적용. PR #4 (`bdcb2f0`) 가 cover 한 광역 i18n 위에 semantic HTML landmark + stale 메시지 키 제거를 얹는다.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-30
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

종료된 `goodman-gls-nav-i18n` 사이클 (matchRate 98% 자체 Design 대비, 그러나 PR #4 광역 머지로 superseded-partial archive) 의 **고유 5건** 만 분리 mini-cycle 로 처리. 본 사이클은 PR #4 의 main 위에 **추가만 함** — 충돌 없음, 회귀 없음 목표.

### 1.2 Background

- **2026-05-30** `goodman-gls-nav-i18n` PR #5 작업 중 동시 머지된 PR #4 (`bdcb2f0` "fix(i18n): 홈·네비게이션 한국어 전환 실제 적용") 가 11 컴포넌트 광역 i18n 적용
- PR #4 가 cover: Navigation t() 와이어링 / ContactSection t() (단 `home.contact.*` 네임스페이스 사용) / LocaleToggle EN/한국어 / 11 컴포넌트 home.* 트리
- PR #4 가 **미포함**: semantic HTML landmark (`aria-labelledby`/`aria-label`) / DisplayLines `id?` prop / nav 트리 stale 키 정리
- 사용자 결정 (2026-05-30): PR #5 close + 위 5건만 깔끔하게 mini-cycle 로 분리
- PR #4 가 ContactSection 에 `home.contact.*` 키를 정착시킴 → 본 사이클은 이 결정 존중, 키 재구조화 금지 (스코프 외)

### 1.3 Related Documents

- 코드 (현 main HEAD `5e4e4b2`):
  - `src/components/Navigation.tsx:75-77` — `<nav>` 에 aria-label 없음
  - `src/components/ContactSection.tsx:56` — `<section id="contact">` 에 aria-labelledby 없음
  - `src/components/DisplayLines.tsx` — `id?` prop 미지원, `<Tag className={className}>` 로 렌더
- 메시지 (현 main HEAD):
  - `messages/en.json` `nav.{home, networkSolutions, services, partnerHub, company, network, contact, contactSales, getStarted}` 9키 (PR #4 가 신규 추가하면서 stale 도 유지)
  - `messages/en.json` 최상위 `contact` 19키 stale 트리 (`title/subtitle/getInTouch/office/officeAddress/operationHubs/email/emailAddress/officeHours/hours/emergency/quickInquiry/...`) — src grep 사용처 0
  - `messages/ko.json` 동등 구조 (PR #4 가 동기 작업)
- 부모 사이클 자산: `docs/archive/2026-05/goodman-gls-nav-i18n/` (Plan/Design 패턴 재사용)
- 메모리:
  - `feedback_subagent_file_write_lie.md` (서브에이전트 파일 검증 규칙)
  - 본 사이클 lessons: "동시 작업 충돌 패턴" 자산화 후보

---

## 2. Scope

### 2.1 In Scope (5 carry-forward items)

- **FR-1** `<nav aria-label="Primary">` 추가 (Navigation route landmark 식별)
- **FR-2** ContactSection `<section id="contact" aria-labelledby="contact-heading">` 추가
- **FR-3** DisplayLines `id?: string` prop 추가 → `<Tag id={id} className={className}>` 렌더
- **FR-4** ContactSection 의 DisplayLines (h2) 에 `id="contact-heading"` prop 전달
- **FR-5** 메시지 정합화:
  - `messages/en.json` + `messages/ko.json` `nav.*` 에서 stale 키 4개 (`home`, `networkSolutions`, `partnerHub`, `contact`) 제거
  - `messages/en.json` + `messages/ko.json` 최상위 stale `contact` 트리 (19 leaf) 제거

### 2.2 Out of Scope

- PR #4 가 정착시킨 `home.contact.*` / `home.hero.*` 등 네임스페이스 **재구조화 금지** (PR #4 결정 존중)
- 다른 섹션 (Hero/Stats/WhyGSSA/GSA/Footer/...) 에 `aria-labelledby` 적용 → 후속 사이클 `sectional-aria-labelledby-rollout` 후보
- `next-intl` 네이티브 `useTranslations` 마이그레이션 → 별도 사이클
- `/company`, `/services`, `/network` 페이지 라우트 i18n → 별도 사이클 (`pages-route-i18n`)
- 마케팅 카피 톤 검토 → 별도 사이클 (`marketing-copy-ko-review`)

### 2.3 Assumptions / Constraints

- main HEAD = `5e4e4b2` (archive commit) — PR #4 머지된 상태
- ContactSection 은 `home.contact.*` 키 사용 중 → 본 사이클 변경 없음
- DisplayLines `id?` prop 추가는 1줄 변경 + 기존 사용처 회귀 없음 (`id` 안 넘기면 undefined → 무영향)
- vercel.json `|| true` 마스킹 유지 (prerender-debt 별도)
- 본 사이클은 단일 commit / 단일 PR 로 충분 (작은 스코프)

---

## 3. Functional Requirements

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-1 | `<nav>` 에 `aria-label="Primary"` 추가 | `grep -c 'aria-label="Primary"' src/components/Navigation.tsx` → 1 |
| FR-2 | `<section id="contact" aria-labelledby="contact-heading">` | `grep -c 'aria-labelledby="contact-heading"' src/components/ContactSection.tsx` → 1 |
| FR-3 | DisplayLines `id?: string` prop + `<Tag id={id}>` | TypeScript 컴파일 통과 + grep `id\?:` `DisplayLines.tsx` → 1 |
| FR-4 | ContactSection 이 DisplayLines 에 `id="contact-heading"` prop 전달 | `grep -c 'id="contact-heading"' src/components/ContactSection.tsx` → 1 |
| FR-5 | en/ko json 의 nav stale 4키 + top-level contact 트리 제거 | `python3` JSON parse 로 정확히 검증: nav 5키 (`company/services/network/contactSales/getStarted`) + top-level `contact` 키 부재 |

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | 런타임 회귀 0 | `npm run test:run` 17/17 PASS (api-guards) |
| NFR-2 | 빌드 회귀 0 | `npm run lint` 0 / `npx tsc --noEmit` 0 / `npm run build` ✓ Compiled |
| NFR-3 | a11y 회귀 0 | DOM에 새 landmark 출현 (회귀 없음 확인 — Lighthouse는 사용자 manual) |
| NFR-4 | 파일 사이즈 | DisplayLines +3/-1, Navigation +1/-0, ContactSection +1/-0 props, en.json -25 lines, ko.json -25 lines |

## 5. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | stale 키 제거가 다른 컴포넌트에 영향 | **Resolved** — grep src/ 사용처 0 검증 완료 (본 plan 작성 중) |
| R-2 | DisplayLines `id` prop 추가가 기존 사용처에 영향 | optional prop 이므로 기존 호출 무영향. tsc strict 검증 |
| R-3 | ContactSection 의 `home.contact.*` 키 구조 변경 유혹 | 명시적 OOS — PR #4 결정 존중. 본 사이클은 semantic HTML 만 |
| R-4 | aria-labelledby 적용 시 DisplayLines spans 가 heading 안에 있어 reading order 영향 | `<h2>` 가 outer Tag, 내부 `<span>` 만 line break → heading 텍스트 합쳐서 읽힘 (정상 동작) |

## 6. Open Questions

> Design 단계에서 확정. 본 사이클은 **0 Open Q** 목표 — 모두 plan 단계에서 결정.

- (없음) — 5건 모두 mechanical, 사용자 결정 불요.

## 7. Estimate

- **Plan**: 본 문서 (0.3h, 완료)
- **Design**: 짧은 diff plan + grep audit 명세 (~0.2h)
- **Do**: 5 파일 편집 (Navigation +1 line / ContactSection +2 / DisplayLines +3 / en.json -25 / ko.json -25) (~0.2h)
- **Check**: grep audit + lint/tsc/vitest/build (~0.1h)
- **Total**: **~0.8h (~50m)**

## 8. Success Criteria

- ✅ FR-1~FR-5 모두 grep audit 통과
- ✅ lint 0 / tsc 0 / vitest 17/17 / build ✓ Compiled
- ✅ ContactSection 의 `<section>` 이 `<h2>` 와 a11y 연결 (DevTools 확인)
- ✅ Navigation `<nav>` 가 named landmark ("Primary")
- ✅ en.json + ko.json `nav` 트리 정확히 5키 + 최상위 `contact` 트리 부재

---

## 9. Next Steps

1. `/pdca design nav-i18n-cleanup` → 5건 diff plan + grep audit 명세 (validator 95+ 기대 — 부모 사이클 패턴 재사용)
2. `/pdca do nav-i18n-cleanup` → 단일 commit (atomic), PR 또는 main 직접 push (사용자 결정)
3. Check 후 ≥95% 예상 → report → archive
