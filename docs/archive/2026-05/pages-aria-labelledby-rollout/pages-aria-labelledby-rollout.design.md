---
template: design
version: 0.1
feature: pages-aria-labelledby-rollout
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/01-plan/features/pages-aria-labelledby-rollout.plan.md
---

# pages-aria-labelledby-rollout Design Document

> **Summary**: Plan v0.1 의 FR 5건을 13 sections 에 청사진 매핑. Open Q 4건 모두 self-resolve. Pattern A (4) DisplayLines, B (7) 직접 h-tag (1개는 dynamic interpolation), C (2) aria-label. 신규 message key 1개만 추가 (network L47), 나머지는 기존 key 재사용.
>
> **Plan**: v0.1 (2026-05-30) — 5 FR / 6 Risk / 4 Open Q / ~70m 추정
> **Status**: Draft v0.1

---

## 1. Open Question Resolutions

| # | Question | Resolution | 근거 |
|---|----------|------------|------|
| **Q1** | services sticky nav `aria-label` 동적/정적 | **기존 key 재사용 `aria-label={t('pages.services.quickAccess')}`** | L57 eyebrow span 이 이미 `pages.services.quickAccess` 사용 — 신규 key 추가 없이 i18n 일관성 달성 |
| **Q2** | network L47 ECS networks heading element | **Pattern C 신규 key 1개 추가** `aria-label={t('pages.network.partnersLabel')}` | L47 source inspection 결과 section-level heading 부재 (cards grid 만). h3 는 per-card 라 section labelledby 부적합. C 채택 + 신규 key 비용 1개 (en + ko 2 entries) |
| **Q3** | 커밋 구조 단일 vs 3 logical | **단일 commit** | 부모 cycle `sectional-aria-labelledby-rollout` 패턴. 13 sections single category, revert+review 단순 |
| **Q4** | services map loop 동적 id 검증 방법 | **grep static interpolation 패턴 + DOM manual** | `grep -c 'id={\`services-\${service\.id}-heading\`}'` 매치 1 (source) + runtime 시 6 sections (services 6종). Playwright overkill |

**0 Open Q 잔존**. 신규 message key 1개 (`pages.network.partnersLabel`) — Design §2 명시.

---

## 2. Message Key Addition

### 2.1 en.json — 신규 1 key

```json
"pages": {
  "network": {
    ...
+   "partnersLabel": "Partner networks",
    ...
  }
}
```

### 2.2 ko.json — 신규 1 key

```json
"pages": {
  "network": {
    ...
+   "partnersLabel": "파트너 네트워크",
    ...
  }
}
```

> **Reuse 명시**: `pages.services.quickAccess` (services L57), 기타 모든 heading 은 기존 page-level i18n key 활용.

---

## 3. Heading ID & aria-label Map

| # | Page | Section | Line | Pattern | id / aria-label |
|---|------|---------|:---:|:---:|------|
| 1 | company | page-hero (DisplayLines) | L21 | A | `id="company-hero-heading"` |
| 2 | company | CEO quote (inline h2) | L40 | B | `id="company-ceo-heading"` |
| 3 | company | heritage (inline h2) | L81 | B | `id="company-heritage-heading"` |
| 4 | company | timeline (DisplayLines) | L138 | A | `id="company-timeline-heading"` |
| 5 | company | values ink (inline h2) | L187 | B | `id="company-values-heading"` |
| 6 | services | page-hero (inline h1) | L38 | B | `id="services-hero-heading"` |
| 7 | services | sticky quick nav | L57 | C | `aria-label={t('pages.services.quickAccess')}` (reuse) |
| 8 | services | services.map (per service.id) | L71 | B dynamic | `id={\`services-${service.id}-heading\`}` (runtime 6 sections) |
| 9 | services | obsidian CTA (DisplayLines) | L139 | A | `id="services-cta-heading"` |
| 10 | network | page-hero (DisplayLines) | L26 | A | `id="network-hero-heading"` |
| 11 | network | partner networks (cards grid) | L47 | C | `aria-label={t('pages.network.partnersLabel')}` (신규 key) |
| 12 | network | GSSA (inline h2) | L83 | B | `id="network-gssa-heading"` |
| 13 | network | ecosystem (inline h2) | L128 | B | `id="network-ecosystem-heading"` |

**Namespace 충돌 검증**:
- 부모 cycle (홈) ids: `hero-heading`, `why-heading`, `services-showcase-heading`, `company-heading`, `network-manifesto-heading`, `footer-heading`, `gsa-heading`, `partner-heading`, `contact-heading`
- 본 cycle (pages) ids: `company-*-heading`, `services-*-heading`, `network-*-heading`
- **공존 가능 라우트**: pages 라우트 (`/company`, `/services`, `/network`) 는 home (`/`) 와 다른 DOM tree → 동일 document 내 충돌 없음
- 예외: `company-heading` (홈) vs `company-hero-heading` (페이지) — 다른 id 라 충돌 0

**Distribution**:
- Pattern A (DisplayLines): 4 sections (1, 4, 9, 10)
- Pattern B (inline h-tag): 7 sections (2, 3, 5, 6, 8, 12, 13) — 그 중 8 은 dynamic interpolation
- Pattern C (aria-label): 2 sections (7, 11)

---

## 4. File Diff Plan

### 4.1 company/page.tsx (5 sections)

```diff
# L21 page-hero (Pattern A)
-      <section className="page-hero bg-canvas border-b border-hairline">
+      <section
+        aria-labelledby="company-hero-heading"
+        className="page-hero bg-canvas border-b border-hairline"
+      >
         ...
         <DisplayLines
+          id="company-hero-heading"
           ...
         />

# L40 CEO quote (Pattern B)
-      <section className="section-spacing bg-canvas">
+      <section
+        aria-labelledby="company-ceo-heading"
+        className="section-spacing bg-canvas"
+      >
         ...
-        <h2 className="display-lg text-ink mb-12 ...">&ldquo;{t('pages.company.ceoQuote')}&rdquo;</h2>
+        <h2 id="company-ceo-heading" className="display-lg text-ink mb-12 ...">&ldquo;{t('pages.company.ceoQuote')}&rdquo;</h2>

# L81, L138, L187 동일 패턴 (B, A, B)
```

LOC delta: +12 / -5

### 4.2 services/page.tsx (4 source sections)

```diff
# L38 page-hero (Pattern B, h1 inline)
-      <section className="page-hero">
+      <section
+        aria-labelledby="services-hero-heading"
+        className="page-hero"
+      >
         ...
-        <h1 className="display-xl text-ink mb-10 ...">
+        <h1 id="services-hero-heading" className="display-xl text-ink mb-10 ...">

# L57 sticky nav (Pattern C, reuse existing key)
-      <section className="py-6 bg-canvas border-b border-hairline sticky ...">
+      <section
+        aria-label={t('pages.services.quickAccess')}
+        className="py-6 bg-canvas border-b border-hairline sticky ..."
+      >

# L71 services.map (Pattern B dynamic)
-          <section key={service.id} id={service.id} className="container-wide scroll-mt-32">
+          <section
+            key={service.id}
+            id={service.id}
+            aria-labelledby={`services-${service.id}-heading`}
+            className="container-wide scroll-mt-32"
+          >
             ...
-                      <h2 className={`display-lg ${main} mb-8 leading-none tracking-tight`}>{service.tagline}</h2>
+                      <h2
+                        id={`services-${service.id}-heading`}
+                        className={`display-lg ${main} mb-8 leading-none tracking-tight`}
+                      >{service.tagline}</h2>

# L139 obsidian CTA (Pattern A)
-      <section className="section-surface-obsidian section-spacing overflow-hidden relative">
+      <section
+        aria-labelledby="services-cta-heading"
+        className="section-surface-obsidian section-spacing overflow-hidden relative"
+      >
         ...
         <DisplayLines
+          id="services-cta-heading"
           ...
         />
```

LOC delta: +13 / -4

> **Note**: services.map section 의 기존 `id={service.id}` 보존 (FR-4 anchor 라우팅 `href="#${id}"`). 새 attribute `aria-labelledby` 와 dynamic `id={...-heading}` 만 추가.

### 4.3 network/page.tsx (4 sections)

```diff
# L26 page-hero (Pattern A)
-      <section className="page-hero">
+      <section
+        aria-labelledby="network-hero-heading"
+        className="page-hero"
+      >
         ...
         <DisplayLines
+          id="network-hero-heading"
           ...

# L47 partner networks (Pattern C, 신규 key)
-      <section className="section-spacing bg-canvas">
+      <section
+        aria-label={t('pages.network.partnersLabel')}
+        className="section-spacing bg-canvas"
+      >
         {/* Network Cards 그대로 */}

# L83 GSSA (Pattern B)
-      <section className="section-spacing bg-canvas">
+      <section
+        aria-labelledby="network-gssa-heading"
+        className="section-spacing bg-canvas"
+      >
         ...
-        <h2 className="display-lg text-ink mb-10 leading-none">{t('pages.network.gssaTitle')}</h2>
+        <h2 id="network-gssa-heading" className="display-lg text-ink mb-10 leading-none">{t('pages.network.gssaTitle')}</h2>

# L128 ecosystem (Pattern B)
-      <section className="section-spacing bg-canvas">
+      <section
+        aria-labelledby="network-ecosystem-heading"
+        className="section-spacing bg-canvas"
+      >
         ...
-        <h2 className="display-lg text-ink mb-20 tracking-tighter">{t('pages.network.ecosystemTitle')}</h2>
+        <h2 id="network-ecosystem-heading" className="display-lg text-ink mb-20 tracking-tighter">{t('pages.network.ecosystemTitle')}</h2>
```

LOC delta: +10 / -4

### 4.4 messages/en.json + ko.json (신규 1 key each)

```diff
"pages": {
  "network": {
    ...
+   "partnersLabel": "Partner networks",  // en
+   "partnersLabel": "파트너 네트워크",     // ko
    ...
  }
}
```

LOC delta: +2 / -0 (en) + +2 / -0 (ko)

---

## 5. Implementation Order

| Step | Action | Files | Time |
|------|--------|-------|:----:|
| 5.1 | company/page.tsx 5 sections | company/page.tsx | 8m |
| 5.2 | services/page.tsx 4 source sections (map dynamic 포함) | services/page.tsx | 8m |
| 5.3 | network/page.tsx 4 sections + 신규 key 적용 위치 확인 | network/page.tsx | 6m |
| 5.4 | en.json + ko.json `pages.network.partnersLabel` 추가 | messages/*.json | 3m |
| 5.5 | grep audit + lint + tsc + vitest + build | — | 10m |

총 ~35m (Plan 70m 추정 -35m, Open Q 0 + 신규 key 최소화 효과)

### 5.1 Commit 구조 (Q3)

**단일 commit** — `♿ a11y(pages): /company /services /network 13 sections region landmark (Pattern A/B/C, 신규 key 1)`.

---

## 6. Test Plan

### 6.1 Static grep audit (자동)

```bash
# FR-1 company 5 sections
grep -c 'aria-labelledby="company-' src/app/company/page.tsx
# expected: 5
grep -cE 'id="company-(hero|ceo|heritage|timeline|values)-heading"' src/app/company/page.tsx
# expected: 5

# FR-2 services 4 source sections
grep -c 'aria-labelledby="services-hero-heading"' src/app/services/page.tsx        # 1
grep -c "aria-label={t('pages.services.quickAccess')}" src/app/services/page.tsx  # 1
grep -c 'aria-labelledby={`services-${service\.id}-heading`}' src/app/services/page.tsx  # 1
grep -c 'aria-labelledby="services-cta-heading"' src/app/services/page.tsx        # 1
# h2 dynamic id
grep -c 'id={`services-${service\.id}-heading`}' src/app/services/page.tsx        # 1

# FR-3 network 4 sections
grep -c 'aria-labelledby="network-' src/app/network/page.tsx
# expected: 3 (hero, gssa, ecosystem)
grep -c "aria-label={t('pages.network.partnersLabel')}" src/app/network/page.tsx
# expected: 1

# FR-4 기존 anchor id 보존
grep -c 'id={service\.id}' src/app/services/page.tsx
# expected: 1 (per-iteration runtime 6, source 1)

# 신규 message key
python3 -c "import json; en=json.load(open('messages/en.json')); ko=json.load(open('messages/ko.json')); \
  assert 'partnersLabel' in en['pages']['network']; \
  assert 'partnersLabel' in ko['pages']['network']; \
  print('partnersLabel:', en['pages']['network']['partnersLabel'], '/', ko['pages']['network']['partnersLabel'])"
```

### 6.2 Build Verification

```bash
npm run lint        # 0 errors
npx tsc --noEmit    # 0 errors
npm run test:run    # 17/17 PASS
npm run build       # ✓ Compiled (prerender debt 마스킹 유지)
```

### 6.3 Browser Manual (사용자, Lighthouse a11y)

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | `/company` DevTools Accessibility Landmarks | region 5 (page-hero/CEO/heritage/timeline/values) |
| 2 | `/services` DevTools Landmarks | region 9 (hero/quickNav/6 services map runtime/CTA) |
| 3 | `/network` DevTools Landmarks | region 4 (hero/partners/GSSA/ecosystem) |
| 4 | VoiceOver Rotor → "Regions" | 각 region distinctive name |
| 5 | Lighthouse a11y score (3 pages 각각) | 회귀 0 |

---

## 7. Risks (Plan §5 갱신)

| ID | Risk | Status |
|----|------|:------:|
| R-1 home heading id 와 pages 충돌 | namespace prefix (`{page}-*`) 명시적 분리, 라우트 별 DOM tree | ✅ Resolved |
| R-2 services map 동적 id grep 한계 | static interpolation 패턴 grep + runtime DOM manual | ✅ Resolved (§6.1, §6.3) |
| R-3 network L47 heading 모호 | §1 Q2 결과: Pattern C aria-label 신규 key | ✅ Resolved |
| R-4 services sticky nav 신규 key 비용 | §1 Q1 결과: 기존 key 재사용 (`pages.services.quickAccess`) → 신규 key 0 | ✅ Resolved |
| R-5 사용자 services 페이지 작업 충돌 | Do 시작 + push 직전 git fetch 점검 (메모리 정책) | ✅ Verified (사용자 6fad87d 안정화 후) |
| R-6 부모 cycle id 혼동 | §3 namespace 표로 명시 (`company-heading` 홈 vs `company-hero-heading` 페이지) | ✅ Resolved |

## 8. Success Criteria

- ✅ §6.1 grep audit 모든 케이스 expected
- ✅ §6.2 빌드 4종 통과
- ✅ §6.3 사용자 manual 검증 (Lighthouse 회귀 0)
- ✅ Plan §8 success criteria 5건 충족
- ✅ 부모 cycle 자산 (DisplayLines `id` prop) 활용, 본 사이클 신규 컴포넌트 0

---

## 9. Next Steps

1. `/pdca do pages-aria-labelledby-rollout` → §5 implementation order 5 step 실행 (~35m, 단일 commit)
2. Check (matchRate ≥95% 기대) → report → archive

---

## 10. Out of Scope Carry-Forward (Plan §2.2 그대로)

- `marketing-copy-ko-review` (P2) — 직역 baseline → 마케팅 톤
- `next-intl-native-migration` (P2) — `useTranslations` 훅 마이그레이션
