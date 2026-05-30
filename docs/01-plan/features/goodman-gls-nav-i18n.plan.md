---
template: plan
version: 0.1
feature: goodman-gls-nav-i18n
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
---

# goodman-gls-nav-i18n Planning Document

> **Summary**: Navigation + ContactSection 의 하드코딩된 영어 라벨을 `next-intl` 기반 i18n 으로 정리하고, `<section id="contact">` 에 `aria-labelledby` 를 추가해 semantic HTML 정책을 확립한다.
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Author**: jhlim725
> **Date**: 2026-05-30
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

다국어 인프라(`next-intl` + `LanguageContext.t()` + `messages/en.json` + `messages/ko.json` + 헤더 LocaleToggle)는 이미 와이어링되어 있으나, **마케팅 사이트의 1순위 인터페이스인 Navigation + ContactSection 가 i18n 인프라를 사용하지 않는다**.

- ko 로 전환해도 nav 라벨(`Company`, `Services`, `Network`, `Contact sales`, `Get started`) 과 ContactSection UI 텍스트(eyebrow, heading, 폼 라벨, 상태 메시지) 가 영어 그대로 노출 → 한국어 사용자 경험 단절
- `<section id="contact">` 가 heading 과 a11y 적으로 연결되어 있지 않음 (`aria-labelledby` 부재) → screen reader 가 anchor 점프 시 컨텍스트 미제공

본 사이클은 i18n 누락 → 사용 전환, Navigation·ContactSection 두 컴포넌트를 정책 baseline 으로 확립한다 (다른 섹션은 후속 사이클 후보).

### 1.2 Background

- bkit code-analyzer 후속 사이클 후보 T3 (P1, ~20min) — `docs/archive/2026-05/goodman-gls-contact-hardening/goodman-gls-contact-hardening.report.md` §8
- 본 plan 작성 중 발견: 보고서가 기술한 "ContactSection.tsx 의 'Contact Us' 버튼이 layout 전역 네비게이션과 중복" 은 현재 코드 기준 부정확. 실제 상태:
  - Navigation 에 `Contact sales` + `Get started` 2 CTA (모두 `href="#contact"`)
  - ContactSection 에는 'Contact Us' 버튼이 없으며, submit `Send message` 버튼만 존재
  - 진짜 부채는 i18n 미적용 + semantic HTML 누락
- `messages/en.json` `nav.{home, networkSolutions, services, partnerHub, company, contact}` 6 keys 존재하나 실 nav 항목(Company/Services/Network + Contact sales + Get started) 과 불일치 (stale)
- `messages/ko.json` 에 `nav.*` 오버라이드 없음 → `deepMerge` 결과 ko 도 영어 fallback
- next-intl 패키지는 설치만 되어 있고 본 컴포넌트는 미사용. Navigation.tsx 와 ContactSection.tsx 둘 다 `useLanguage()` 콘텍스트 미호출

### 1.3 Related Documents

- 코드:
  - `src/components/Navigation.tsx:1-177` — 하드코딩 라벨 + CTA
  - `src/components/ContactSection.tsx:1-158` — 하드코딩 폼/카피
  - `src/contexts/LanguageContext.tsx` — `t(key): string` 제공자 (이미 활성)
  - `src/lib/i18n-messages.ts` — deepMerge 로딩
- 메시지:
  - `messages/en.json` — 정합성 정리 대상 (nav stale keys 정정 + 신규 추가)
  - `messages/ko.json` — nav 전체 신규 추가 + contact.* 신규 추가
- 메모리:
  - `~/.claude/projects/-Users-jaehong/memory/project_goodman_gls_build_prerender_debt_candidate.md` (사이클 컨텍스트)
  - 본 plan 의 핵심 발견을 후속 메모리(`reference_goodman_gls_i18n_policy.md`) 로 자산화 가능

---

## 2. Scope

### 2.1 In Scope

- **FR-1** Navigation.tsx 데스크탑/모바일 nav 라벨(3) + CTA(2) → `useLanguage().t('nav.*')` 로 전환
- **FR-2** ContactSection.tsx UI 텍스트(eyebrow, 2-line heading, lead, 3 feature 라벨×2, 3 input 라벨+placeholder, 2 상태 메시지, submit 버튼 idle/sending) → `t('contact.*')` 로 전환
- **FR-3** `messages/en.json` `nav.*` 정합화: stale key 제거(`home`, `networkSolutions`, `partnerHub`), 누락 키 추가(`network`, `contactSales`, `getStarted`). `contact` 키는 의미 좁힘 (기존 단일 라벨 → 폼 카피 트리)
- **FR-4** `messages/ko.json` 에 `nav.*` 전 항목 + `contact.*` 전 항목 신규 추가 (디자인된 한국어 카피)
- **FR-5** `<section id="contact">` → `<section id="contact" aria-labelledby="contact-heading">`, 해당 h2 (DisplayLines) 에 `id="contact-heading"` 부여
- **FR-6** Navigation `<nav>` 에 `aria-label="Primary"` 추가 (route landmark 식별)

### 2.2 Out of Scope (후속 사이클 후보)

- 다른 섹션(Hero, Stats, WhyGSSA, GSA, ServicesShowcase, Network, PartnerHub, CompanySection, NetworkManifesto, Footer, TrustBadges) 의 i18n / aria-labelledby 적용 — 동일 패턴 적용 사이클 후보 (P1, sectional-i18n-rollout)
- `next-intl` 의 `useTranslations` 훅 마이그레이션 (현재 `LanguageContext.t()` 사용) — 별도 사이클 후보 (P2, next-intl-native-migration)
- pages 라우트(`/company`, `/services`, `/network`) i18n — 별도 사이클
- ContactSection RHF 마이그레이션 — T4 후속 사이클 후보 그대로 유지
- 한국어 카피의 마케팅 보이스 톤 검토 — 별도 마케팅 사이클 (본 사이클은 직역 baseline)

### 2.3 Assumptions / Constraints

- `LanguageContext.t(key)` 가 정상 동작 (이미 다른 곳에서 검증) — Plan 단계에서 추가 검증 불요
- ko.json 스키마는 deepMerge 기반이라 partial override 만 추가하면 충분
- 변경 대상 파일 라인: Navigation 177 + ContactSection 158 + en.json 486 + ko.json 87 → 전부 < 800 lines (split 불요)
- vercel.json `|| true` 마스킹 유지 (prerender-debt 별도, 본 사이클 무관)

---

## 3. Functional Requirements

| ID | Requirement | Acceptance |
|----|-------------|------------|
| FR-1 | Navigation 데스크탑 3-item + CTA 2개 + 모바일 메뉴 3-item + CTA 2개가 모두 `t('nav.*')` 호출 결과 렌더 | grep `>Company<\|>Services<\|>Network<\|>Contact sales<\|>Get started<` Navigation.tsx → 0 매치 |
| FR-2 | ContactSection 모든 표시 문자열이 `t('contact.*')` 호출 결과 (변수/placeholder 포함) | grep `Connect\|Let's talk\|24/7 support\|Office\|Email\|Hours\|Enter your\|Tell us\|Message sent\|Failed to send\|Send message\|Sending` ContactSection.tsx → 0 매치 |
| FR-3 | en.json `nav` 트리 = `{ company, services, network, contactSales, getStarted }` (5 keys, stale 3개 제거) | 정확히 5 키, 알파벳 외 추가 없음 |
| FR-4 | ko.json `nav.*` 5 키 + `contact.*` 트리 전체 추가 | ko 로드 시 deepMerge 후 `nav.company === '회사'` 등 한국어 |
| FR-5 | `<section id="contact" aria-labelledby="contact-heading">`, h2 에 `id="contact-heading"` | grep 매치 1+1 |
| FR-6 | Navigation `<nav aria-label="Primary">` 1회 추가 (모바일 메뉴는 별도 landmark 아님) | grep 매치 1 |

## 4. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | 번들 크기 영향 | 메시지 키 추가뿐, 신규 코드 < 100 LOC. `npm run build` 후 First Load JS 변화 ≤ +1KB |
| NFR-2 | 런타임 영향 | `t()` 호출은 in-memory tree lookup, 측정 가능 회귀 없음 |
| NFR-3 | a11y 준수 | axe / Lighthouse a11y score 회귀 0 (sample: 홈 1440) |
| NFR-4 | 빌드 안정성 | `npm run lint` 0 errors / `npx tsc --noEmit` 0 errors / `npm run test:run` 17/17 PASS 유지 |

## 5. Risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | en.json `nav` 의 stale key (`home`/`networkSolutions`/`partnerHub`) 가 다른 컴포넌트에서 참조될 수 있음 | Design 단계에서 `grep -r "nav.home\|nav.networkSolutions\|nav.partnerHub" src/` 사전 검증. 참조 시 그대로 두고 사용처에서만 신규 키로 교체 |
| R-2 | ko.json 카피가 어색해 마케팅 톤과 어긋남 | 본 사이클은 직역 baseline. 마케팅 카피 사이클은 별도 후속. plan 에 한국어 초안을 명시해 design 단계에서 사용자 검토 가능 |
| R-3 | `aria-labelledby` 적용 시 DisplayLines 컴포넌트가 id prop 미지원이면 추가 작업 발생 | Design 단계에서 `DisplayLines.tsx` 시그니처 확인. 미지원 시 외곽 wrapper id 사용으로 fallback |
| R-4 | t() lookup 키 누락(오타) 시 key 문자열이 그대로 렌더 (현 `getMessage` 폴백 동작) | 17 케이스 단위 테스트는 과한 비용 — Design 에서 정확한 key 목록 enumerate + grep 기반 자체 audit 으로 충분 |
| R-5 | locale=ko 첫 로드 시 SSR/CSR mismatch (LanguageProvider 가 localStorage 기반) | 본 사이클 무관 — 기존 hydration 동작 유지. 향후 SSR i18n 사이클에서 처리 |

## 6. Open Questions

> Design 단계에서 확정 필요

1. **(Q1) en.json `nav.contact` 처분**: 신규 트리는 `contactSales` + `getStarted` 두 CTA. 기존 단일 `nav.contact: "Contact"` 는 (a) 삭제, (b) 유지 (다른 곳 사용 가능성), (c) 의미 좁혀 `contact: "Contact"` → ContactSection 내부 키로 이관 — Design 에서 grep 결과로 결정
2. **(Q2) 한국어 CTA 카피 톤**: "Contact sales" → (a) "영업팀 문의" (b) "문의하기" (c) "상담 신청"; "Get started" → (a) "시작하기" (b) "지금 시작" (c) "도입 문의" — Design 에서 후보 제시 + 사용자 한 줄 결정
3. **(Q3) aria-labelledby 일관성**: ContactSection 만 적용 vs 다른 섹션도 한 번에 — out of scope 이지만 Design 에서 후속 사이클 spec 으로 간단 메모 추가
4. **(Q4) lang 속성**: `LanguageContext` 가 `document.documentElement.lang` 설정. `<html lang="en">` 초기값과 충돌 없는지 Design 에서 확인 — 본 사이클 변경 무관할 수 있음

## 7. Estimate

- **Plan**: 본 문서 (0.5h, 완료)
- **Design**: open question 4 확정 + 한국어 카피 초안 + key 목록 enumerate (~0.5h)
- **Do**: 5 파일 편집 (Navigation, ContactSection, en.json, ko.json, DisplayLines 검증) (~0.5h)
- **Check**: gap-detector + axe/Lighthouse sample (~0.25h)
- **Total**: ~1.75h (보고서 추정 20min 대비 +1h — i18n key 정합화 + 한국어 카피 작성 비용 반영)

## 8. Success Criteria

- ✅ ko 로케일 전환 시 Navigation + ContactSection 모든 표시 문자열이 한국어
- ✅ en 로케일에서도 동일하게 `t()` 경유 (하드코딩 0)
- ✅ DOM 에 `<section id="contact" aria-labelledby="contact-heading">` + `<h2 id="contact-heading">` 존재
- ✅ `<nav aria-label="Primary">` 존재
- ✅ lint 0 / tsc 0 / vitest 17/17 / build 7 routes PASS 유지
- ✅ Lighthouse a11y score 회귀 없음 (sample: 홈 1440 데스크탑)

---

## 9. Next Steps

1. `/pdca design goodman-gls-nav-i18n` → Open Question 4건 확정 + ko 카피 초안 + key map 작성
2. `bkit:design-validator` 90+ 통과 → Do 진입
3. Do 단계에서 commit 단위: nav + en.json (atomic) → contact + ko.json (atomic) → semantic html (atomic) — 3 logical commit / 단일 PR squash
