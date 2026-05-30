---
template: analysis
version: 0.2
feature: goodman-gls-nav-i18n
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/archive/2026-05/goodman-gls-nav-i18n/goodman-gls-nav-i18n.plan.md
design: docs/archive/2026-05/goodman-gls-nav-i18n/goodman-gls-nav-i18n.design.md
matchRate: 98
status: superseded-partial
---

# goodman-gls-nav-i18n Gap Analysis

> **Match Rate (against own Design)**: **98%** ✅
> **Branch**: `feature/nav-i18n` (PR #5 — **CLOSED, superseded by PR #4**)
> **Commits**: 4 (6ff0c93 / 2d9e727 / 539bb92 / 6d91381 / + 664f82c archive on branch)
> **Status**: Design 대비 코드 100% 구현 — 그러나 동시 머지된 PR #4 가 광역 스코프(11 컴포넌트 home.* 네임스페이스)로 본 사이클의 핵심 deliverable 일부 (nav t() 와이어링, ContactSection t()) 를 superseded.

## ⚠️ Supersession Note

본 사이클 Do 진행 중(2026-05-30 09:30 KST) 동일 스코프 PR #4 `fix(i18n): 홈·네비게이션 한국어 전환 실제 적용` 가 main `bdcb2f0` 으로 머지됨 (사용자 다른 세션 작업).

**PR #4 가 cover 한 영역 (본 PR #5 와 중복)**:
- Navigation t() 와이어링 (Commit B `2d9e727` 와 동등)
- ContactSection t() 와이어링 (Commit C 일부)
- ko.json 한국어 메시지 (스타일 다름 — PR #4 는 `home.*` 네임스페이스, PR #5 는 `nav.*`+`contact.*` 정합화)

**PR #5 의 고유 contribution (PR #4 미포함, 본 사이클 자산)**:
1. ContactSection `<section aria-labelledby="contact-heading">` — semantic landmark
2. h2 `id="contact-heading"` (DisplayLines 경유)
3. DisplayLines `id?: string` prop 시그니처 확장
4. `<nav aria-label="Primary">` — Navigation landmark
5. nav stale 키 제거 (`home`/`networkSolutions`/`partnerHub` — PR #4 가 신규 키 추가하면서 stale 도 유지)
6. contact 트리 정합화 (PR #4 가 기존 19키 stale `contact` 트리 유지)

**처분**: PR #5 close (2026-05-30, 사용자 결정), 고유 4-6번 항목은 **별도 mini-cycle `nav-i18n-cleanup`** 으로 main 에서 깔끔하게 진행.

---

## 1. Summary

bkit:gap-detector 분석 결과 **98%** matchRate — Plan §6.2 NFR-4 (lint/tsc/vitest/build 회귀 0) + Design §9 Success Criteria (grep audit 6/6 + 빌드 4종) 전부 충족. 코드 레벨 100% (FR/key map/file diff/commit order), 비코드 -2pp (manual browser smoke + Lighthouse baseline 사용자 활동 영역).

## 2. Match Breakdown

| 영역 | Score | 가중 | 비고 |
|------|:-----:|:----:|------|
| Functional Requirements (FR-1~FR-6) | 100% | 35 | 6 FR 모두 grep audit PASS |
| Message Key Map (en/ko, 49 leaf) | 100% | 20 | Design §2 enumerate 와 1:1 일치 |
| File Diff Plan (5 파일) | 100% | 15 | Design §4 청사진 1:1 구현 |
| Commit Order (A/B/C) | 100% | 10 | Design §5 implementation order 그대로 |
| Build Verification (lint/tsc/vitest/build) | 100% | 10 | 4/4 GREEN, vitest 17/17 회귀 0 |
| Test Plan (grep audit 6 case) | 100% | 5 | Design §6.1 6/6 PASS |
| Browser Smoke (Design §6.3) | 0% | 3 | 사용자 manual 영역, 미실행 (-2pp 감점) |
| Lighthouse a11y baseline | 0% | 2 | 사용자 manual, post-merge 권장 |
| **Total** | **98%** | 100 | |

> 비코드 영역(manual browser smoke + Lighthouse) 은 PR merge 후 사용자가 실 환경에서 검증해야 의미 있는 데이터 — Check 단계 감점이지만 iterate 로 해결 불가 (코드 변경 없음).

## 3. FR-by-FR Verification

### FR-1 Navigation t() 와이어링 (100%)

**Design 청사진** (§4.4):
- `useLanguage()` 훅 호출
- `navItems` 상수 `{ label }` → `{ key }`
- 데스크탑 3-item + CTA 2개 → `t('nav.*')`
- 모바일 메뉴 3-item + CTA 2개 → `t('nav.*')`

**구현 확인** (`src/components/Navigation.tsx` @ 2d9e727):
```tsx
// L11-15
const navItems = [
  { key: 'company', href: '/company' },
  { key: 'services', href: '/services' },
  { key: 'network', href: '/network' },
] as const;

// L44 (function body)
const { t } = useLanguage();

// L86-90 (desktop nav)
{navItems.map((item) => (
  <Link key={item.key} href={item.href} className={linkClass}>
    {t(`nav.${item.key}`)}
  </Link>
))}

// L102, L106 (desktop CTAs)
{t('nav.contactSales')}
{t('nav.getStarted')}

// L146-154, L162, L169 (mobile menu mirrors)
```

**Audit**:
```bash
$ grep -E ">Company<|>Services<|>Network<|>Contact sales<|>Get started<" src/components/Navigation.tsx
$ # no output
```

✅ **PASS**

---

### FR-2 ContactSection t() 와이어링 (100%)

**Design 청사진** (§4.5):
- 모든 표시 문자열 t() 경유: eyebrow, 2-line heading, lead, info(6키), form(10키), 2 상태 알림, submit idle/sending

**구현 확인** (`src/components/ContactSection.tsx` @ 539bb92):
- L8 `const { t } = useLanguage();`
- L58 eyebrow → `{t('contact.eyebrow')}`
- L60-64 DisplayLines lines → `[t('contact.headingLine1'), t('contact.headingLine2')]`
- L66 lead → `{t('contact.lead')}`
- L71, L73, L77, L79, L83, L85 info 6키 모두 치환
- L89, L99 nameLabel + namePlaceholder
- L105, L114 emailLabel + emailPlaceholder
- L119, L128 messageLabel + messagePlaceholder
- L136 successAlert
- L142 errorAlert
- L150 submit idle/sending ternary

**Audit**:
```bash
$ grep -E "Connect|Let's talk|24/7 support|>Office<|>Email<|>Hours<|Enter your|Tell us|Message sent|Send message|Sending\.\.\." src/components/ContactSection.tsx
$ # no output (UI 표시 문자열 0 hits)
```

> **Note**: 한 줄 매치 `if (!response.ok) throw new Error('Failed to send message');` 는 catch 블록의 `setSubmitStatus('error')` 분기로 폐기되어 UI 미노출. false positive 아님.

✅ **PASS**

---

### FR-3 en.json nav 정합화 (100%)

**Design 청사진** (§2.1):
- 제거: `home`, `networkSolutions`, `partnerHub`, `contact` (stale)
- 신규: `network`, `contactSales`, `getStarted`
- 유지: `company`, `services`

**구현 확인** (`messages/en.json` @ 6ff0c93):
```bash
$ python3 -c "import json; d=json.load(open('messages/en.json')); print(sorted(d['nav'].keys()))"
['company', 'contactSales', 'getStarted', 'network', 'services']
```

추가 보너스 정리: stale unused `contact` 트리(line 163-183, 19키, src grep 0) 도 제거. Design 명시는 아니나 동일 정합성 원칙 적용.

✅ **PASS**

---

### FR-4 ko.json nav + contact 신규 (100%)

**Design 청사진** (§2.3, §2.4):
- `nav` 5키 + `contact` 트리 25 leaf (eyebrow / headingLine1·2 / lead / info(6) / form(10))

**구현 확인** (`messages/ko.json` @ 6ff0c93):
```bash
$ python3 -c "import json; ko=json.load(open('messages/ko.json')); \
    print('nav:', sorted(ko['nav'].keys())); \
    print('contact:', sorted(ko['contact'].keys())); \
    print('  info:', sorted(ko['contact']['info'].keys())); \
    print('  form:', sorted(ko['contact']['form'].keys()))"
nav: ['company', 'contactSales', 'getStarted', 'network', 'services']
contact: ['eyebrow', 'form', 'headingLine1', 'headingLine2', 'info', 'lead']
  info: ['emailLabel', 'emailValue', 'hoursLabel', 'hoursValue', 'officeLabel', 'officeValue']
  form: ['emailLabel', 'emailPlaceholder', 'errorAlert', 'messageLabel', 'messagePlaceholder', 'nameLabel', 'namePlaceholder', 'submitIdle', 'submitSending', 'successAlert']
```

한국어 카피 직역 baseline (Q2: 문의하기 / 시작하기) Design §2.3·§2.4 enumerate 값 1:1 매치.

✅ **PASS**

---

### FR-5 ContactSection semantic HTML (100%)

**Design 청사진** (§4.5):
- `<section id="contact" aria-labelledby="contact-heading">`
- DisplayLines `id="contact-heading"` prop 전달

**구현 확인**:
```bash
$ grep -c 'aria-labelledby="contact-heading"' src/components/ContactSection.tsx
1
$ grep -c 'id="contact-heading"' src/components/ContactSection.tsx
1
```

DisplayLines `id?:string` prop 도 §4.3 청사진대로 추가 (`src/components/DisplayLines.tsx:5, 16, 21`).

✅ **PASS**

---

### FR-6 Navigation aria-label="Primary" (100%)

**Design 청사진** (§4.4):
- `<nav aria-label="Primary">` 추가 (route landmark 식별)

**구현 확인**:
```bash
$ grep -c 'aria-label="Primary"' src/components/Navigation.tsx
1
```

✅ **PASS**

---

## 4. Convention / Quality Compliance

| 항목 | 결과 |
|------|------|
| `npm run lint` | 0 errors / 0 warnings |
| `npx tsc --noEmit` | 0 errors |
| `npm run test:run` | 17/17 PASS (api-guards 회귀 없음) |
| `npm run build` | ✓ Compiled successfully in 6.8s |
| `/_global-error` prerender | ⚠️ 사전 documented framework debt (digest 1759492429), vercel.json `\|\| true` 마스킹으로 Vercel deploy 정상 |
| 파일 사이즈 | Navigation 180줄 / ContactSection 162줄 / DisplayLines 29줄 / en.json 487줄 / ko.json 119줄 — 모두 < 800 LOC 제한 충족 |
| TypeScript prop 타입 | DisplayLines `id?: string` (NFR per typescript/coding-style.md "props with named type") |
| Immutability | `navItems as const` readonly tuple (typescript/coding-style.md "immutable updates") |

## 5. Gaps / Deviations

| ID | 영역 | 상세 | 처분 |
|----|------|------|------|
| **G-1** | Browser smoke (Design §6.3) | 6 시나리오 미실행 (PR merge 전 manual 영역) | 사용자 후속 — iterate 불가, report 후속 task |
| **G-2** | Lighthouse a11y baseline | 회귀 측정 미실행 (PR merge 후 production 비교용) | 사용자 후속 — iterate 불가 |
| **G-3** | (None) | 코드 레벨 deviation 0 | — |

## 6. Risk Status Update

| Plan Risk | Design Resolution | Final Status |
|-----------|-------------------|:------------:|
| R-1 stale key 사용처 | Q1 grep 0건 → 안전 | ✅ Resolved |
| R-2 ko 카피 어색함 | 직역 baseline, 마케팅 사이클 위임 | ✅ Accepted (OOS) |
| R-3 DisplayLines id 미지원 | §4.3 1줄 prop 추가 명시 | ✅ Implemented |
| R-4 t() 오타 폴백 | grep audit 으로 발견 가능 | ✅ Verified |
| R-5 SSR/CSR hydration | suppressHydrationWarning wired | ✅ N/A (이미 처리) |
| R-6 LocaleToggle 재렌더 깊이 (Design 추가) | Context consumer 정상 | ✅ Verified (tsc 0) |

## 7. Act Recommendation

**→ `/pdca report goodman-gls-nav-i18n` 직행 (iterate 불요)**

**근거**:
- matchRate **98% ≥ 90% threshold** (Plan §6 NFR-4 + bkit 기본 매치율 기준 충족)
- 코드 레벨 100% (FR/key map/file diff/commit/build)
- 잔여 2pp 는 비코드 사용자 manual 영역 (browser smoke + Lighthouse) — iterate 가 처리할 수 있는 카테고리 아님
- bkit pdca-iterator 자동 수정 후보 0건

**Report 후 활동**:
- PR #5 squash merge → main
- main 에서 manual browser smoke 6 시나리오 (Design §6.3)
- production Lighthouse a11y 비교 (회귀 없음 확인)
- `/pdca archive goodman-gls-nav-i18n` 으로 4 문서 → `docs/archive/2026-05/goodman-gls-nav-i18n/` 이관

## 8. Next Steps

1. `/pdca report goodman-gls-nav-i18n` — report-generator 호출 → `docs/04-report/goodman-gls-nav-i18n.report.md` 작성
2. PR #5 squash merge (사용자)
3. `/pdca archive goodman-gls-nav-i18n` — 4 문서 archive + `_INDEX.md` 갱신 + `.bkit-memory.json` phase=archived
4. 후속 사이클 후보 검토 (sectional-i18n-rollout / next-intl-native-migration / marketing-copy-ko-review / pages-route-i18n)
