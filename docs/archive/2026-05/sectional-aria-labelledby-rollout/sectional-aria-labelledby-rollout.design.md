---
template: design
version: 0.1
feature: sectional-aria-labelledby-rollout
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/01-plan/features/sectional-aria-labelledby-rollout.plan.md
---

# sectional-aria-labelledby-rollout Design Document

> **Summary**: Plan v0.1 의 FR 5건을 11 컴포넌트에 3 sub-pattern 으로 청사진 매핑. Open Q 4건 모두 self-resolve. Pattern A (6) DisplayLines `id` prop, Pattern B (2) 직접 `<h2 id>`, Pattern C (2) `aria-label` 동적 t().
>
> **Plan**: v0.1 (2026-05-30) — 5 FR / 6 Risk / 4 Open Q / ~70m 추정
> **Status**: Draft v0.1

---

## 1. Open Question Resolutions

| # | Question | Resolution | 근거 |
|---|----------|------------|------|
| **Q1** | Pattern C `aria-label` 동적 vs 정적 | **동적 `t(...)`** | i18n 일관성. en `"Trusted memberships"`, ko `"신뢰의 멤버십"` 모두 region label 으로 적절. 정적 영어는 한국 사용자에게 영어 노출 — 본 프로젝트 i18n 정책 위배. `LanguageContext.t()` 가 string 반환 보장 (i18n-messages.ts:35) — runtime 안전 |
| **Q2** | Footer `<footer>` + `aria-labelledby` 중복? | **적용** | `<footer>` 는 contentinfo landmark, `aria-labelledby` 는 distinctive name 부여 — WAI-ARIA Authoring Practices 권장 패턴 (landmark name uniqueness 향상). 다중 footer 미래 가능성 고려 |
| **Q3** | 커밋 구조 | **단일 commit** | 11 컴포넌트 모두 single category (semantic landmark) — 패턴별 diff 가 동질. revert 시 전체 롤백 자연스러움. review 가 단일 패턴 detection 으로 단순 |
| **Q4** | HeroSection h1 적용 | **적용** | 일관성 원칙. `<h1>` 도 id 지원. page-level main heading 도 region landmark 의 name source 로 합당. `<section aria-labelledby="hero-heading">` |

추가 발견 (Design 단계 신규): **id 충돌 검증 패스**.
- 기존 anchor id 5개 (`services`/`company`/`network`/`partner-hub`/`contact`) 는 `<section id="...">` 에 부여
- 새 heading id 는 모두 `-heading` suffix → 동일 document 내 unique 보장
- 충돌 0 (e.g. `<section id="services">` + 내부 heading `id="why-heading"` 같이 다른 키 사용)

---

## 2. Heading ID Naming Convention

| Component | Sub-pattern | Section anchor id | Heading/aria id | aria-label (Pattern C only) |
|-----------|:--:|------|-------|---|
| HeroSection | A | — | `hero-heading` | — |
| TrustBadges | C | — | — | `{t('home.trust.eyebrow')}` |
| StatsSection | C | — | — | `{t('home.stats.eyebrow')}` |
| WhyGSSASection | A | `services` (보존) | `why-heading` | — |
| GSASection | B | `network` (보존) | `gsa-heading` | — |
| ServicesShowcase | A | — | `services-showcase-heading` | — |
| CompanySection | A | `company` (보존) | `company-heading` | — |
| NetworkManifesto | A | — | `network-manifesto-heading` | — |
| PartnerHubSection | B | `partner-hub` (보존) | `partner-heading` | — |
| Footer | A | — | `footer-heading` | — |

**Naming 원칙**: kebab-case + `-heading` suffix. anchor id 와 명시적 분리.

---

## 3. File Diff Plan

### 3.1 Pattern A — DisplayLines (6 files)

각 컴포넌트에 (1) `<section>` (또는 `<footer>`) 에 `aria-labelledby` 추가 + (2) DisplayLines 에 `id` prop 전달.

#### 3.1.1 HeroSection.tsx

```diff
-    <section className="relative hero-spacing overflow-hidden">
+    <section
+      aria-labelledby="hero-heading"
+      className="relative hero-spacing overflow-hidden"
+    >
       ...
       <DisplayLines
+        id="hero-heading"
         className="display-hero text-canvas-white mb-8"
         ... (기존 as / lines prop 유지)
       />
```

#### 3.1.2 WhyGSSASection.tsx
```diff
-    <section id="services" className="bg-canvas section-spacing">
+    <section
+      id="services"
+      aria-labelledby="why-heading"
+      className="bg-canvas section-spacing"
+    >
       ...
       <DisplayLines
+        id="why-heading"
         className="display-lg text-ink mb-8"
       />
```

#### 3.1.3 ServicesShowcase.tsx — 동일 패턴, `id="services-showcase-heading"`
#### 3.1.4 CompanySection.tsx — 동일 패턴, `id="company-heading"`, 기존 `id="company"` 보존
#### 3.1.5 NetworkManifesto.tsx — 동일 패턴, `id="network-manifesto-heading"`
#### 3.1.6 Footer.tsx — `<footer aria-labelledby="footer-heading">`, DisplayLines `id="footer-heading"`

**LOC delta per file**: +2 ~ +4 (attribute 추가, 들여쓰기 포함)

### 3.2 Pattern B — 직접 `<h2>` (2 files)

#### 3.2.1 GSASection.tsx
```diff
-    <section id="network" className="bg-canvas section-spacing">
+    <section
+      id="network"
+      aria-labelledby="gsa-heading"
+      className="bg-canvas section-spacing"
+    >
       ...
-          <h2 className="display-lg text-ink mb-6">{t('home.gsa.title')}</h2>
+          <h2 id="gsa-heading" className="display-lg text-ink mb-6">{t('home.gsa.title')}</h2>
```

#### 3.2.2 PartnerHubSection.tsx
```diff
-    <section id="partner-hub" className="bg-canvas section-spacing">
+    <section
+      id="partner-hub"
+      aria-labelledby="partner-heading"
+      className="bg-canvas section-spacing"
+    >
       ...
-            <h2 className="display-lg text-ink mb-8">{t('home.partnerHub.title')}</h2>
+            <h2 id="partner-heading" className="display-lg text-ink mb-8">{t('home.partnerHub.title')}</h2>
```

**LOC delta per file**: +2 (attribute) + 0 (h2 한 줄 inline 수정)

### 3.3 Pattern C — `aria-label` 동적 t() (2 files)

#### 3.3.1 TrustBadges.tsx
```diff
-    <div className="bg-canvas py-12 border-b border-hairline">
+    <section
+      aria-label={t('home.trust.eyebrow')}
+      className="bg-canvas py-12 border-b border-hairline"
+    >
       <div className="container-wide">
         ...
-    </div>
+    </section>
```

> **Note**: TrustBadges 의 outermost wrapper 가 `<div>` → `<section>` 으로 변경. R-2 (Plan §5) 명시 — `bg-canvas py-12 border-b border-hairline` 만 — 시각 영향 0.

#### 3.3.2 StatsSection.tsx
```diff
-    <section className="section-surface-obsidian section-spacing">
+    <section
+      aria-label={t('home.stats.eyebrow')}
+      className="section-surface-obsidian section-spacing"
+    >
```

> **Note**: StatsSection 은 이미 `<section>` — `aria-label` attribute 만 추가.

**LOC delta per file**: TrustBadges +2/-1 (div→section), StatsSection +1

### 3.4 DisplayLines.tsx — 변경 없음

이미 `nav-i18n-cleanup` Commit C 에서 `id?: string` prop 추가됨. 본 사이클은 prop 활용만 — 추가 변경 0.

---

## 4. Implementation Order

| Step | Action | Files | Time |
|------|--------|-------|:----:|
| 4.1 | Pattern A 6 컴포넌트 — `<section aria-labelledby>` + DisplayLines `id` prop | Hero/WhyGSSA/Services/Company/NetworkManifesto/Footer (6) | 12m |
| 4.2 | Pattern B 2 컴포넌트 — `<section aria-labelledby>` + `<h2 id>` | GSASection/PartnerHubSection (2) | 4m |
| 4.3 | Pattern C 2 컴포넌트 — `aria-label` + (TrustBadges 만) `<div>` → `<section>` | TrustBadges/StatsSection (2) | 4m |
| 4.4 | grep audit + lint + tsc + vitest + build | — | 10m |

총 ~30m (Plan 70m 추정 대비 -40m, 부모 패턴 재사용 + Open Q 0 잔존)

### 4.1 Commit 구조 (Q3)

**단일 commit** — `♿ a11y(sections): 11 컴포넌트 region landmark 일괄 적용 (Pattern A/B/C)`.

---

## 5. Test Plan

### 5.1 Static grep audit (자동)

```bash
# FR-1: Pattern A — 6 컴포넌트 aria-labelledby + DisplayLines id
grep -lE 'aria-labelledby=\"(hero|why|services-showcase|company|network-manifesto|footer)-heading\"' src/components/
# expected: 6 files

# FR-2: Pattern B — 2 컴포넌트 aria-labelledby + <h2 id>
grep -c 'aria-labelledby=\"gsa-heading\"' src/components/GSASection.tsx
grep -c 'id=\"gsa-heading\"' src/components/GSASection.tsx
grep -c 'aria-labelledby=\"partner-heading\"' src/components/PartnerHubSection.tsx
grep -c 'id=\"partner-heading\"' src/components/PartnerHubSection.tsx
# expected: 각 1 (총 4)

# FR-3: Pattern C — 2 컴포넌트 aria-label 동적
grep -c 'aria-label={t(' src/components/TrustBadges.tsx
grep -c 'aria-label={t(' src/components/StatsSection.tsx
# expected: 각 1
# 추가: TrustBadges 가 <section> 으로 변경
grep -c '<section' src/components/TrustBadges.tsx
# expected: 1 (이전 0)

# FR-4: 기존 anchor id 보존 (5 컴포넌트)
grep -c 'id="services"' src/components/WhyGSSASection.tsx
grep -c 'id="company"' src/components/CompanySection.tsx
grep -c 'id="network"' src/components/GSASection.tsx
grep -c 'id="partner-hub"' src/components/PartnerHubSection.tsx
grep -c 'id="contact"' src/components/ContactSection.tsx  # 이전 cycle 자산
# expected: 각 1 (총 5)
```

### 5.2 Build Verification

```bash
npm run lint        # 0 errors
npx tsc --noEmit    # 0 errors
npm run test:run    # 17/17 PASS (회귀 0)
npm run build       # ✓ Compiled (prerender debt 마스킹 유지)
```

### 5.3 Browser Manual (사용자, Lighthouse a11y)

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | DevTools → Accessibility → Landmarks tab | region 11+ (Hero/TrustBadges/Stats/WhyGSSA/GSA/Services/Company/NetworkManifesto/PartnerHub/Contact + footer) |
| 2 | VoiceOver Rotor → "Regions" | 각 region 가 distinctive name 으로 표시 |
| 3 | Lighthouse a11y score | 회귀 0, 가급적 landmark count 향상 |

---

## 6. Risks (Plan §5 갱신)

| ID | Risk | Status |
|----|------|:------:|
| R-1 id 충돌 | `-heading` suffix 명시적 분리, §2 표 검증 | ✅ Resolved |
| R-2 TrustBadges `<div>` → `<section>` | `bg-canvas py-12 border-b border-hairline` 만, 시각 영향 0 | ✅ Verified |
| R-3 Pattern C aria-label runtime t() | `t()` 가 string 반환 보장 (i18n-messages.ts) | ✅ Verified |
| R-4 Footer `<footer>` 중복 landmark | WAI-ARIA Authoring Practices 권장 (distinctive name) | ✅ Resolved (Q2) |
| R-5 DisplayLines instance 중복 | Footer 의 DisplayLines 1개 (header section only) — 확인됨 | ✅ Verified |
| R-6 Hero h1 분류 | `as="h1"` + id 지원 — 정상 패턴 적용 | ✅ Resolved (Q4) |

## 7. Success Criteria

- ✅ §5.1 grep audit 모든 케이스 expected
- ✅ §5.2 빌드 4종 전부 통과
- ✅ §5.3 사용자 manual 검증 (Lighthouse 회귀 0, landmark count ≥ 11)
- ✅ Plan §8 success criteria 5건 충족

---

## 8. Next Steps

1. (선택) `bkit:design-validator` 호출 — 부모 패턴 (`nav-i18n-cleanup` 94/100) 재사용으로 빠른 통과 기대
2. `/pdca do sectional-aria-labelledby-rollout` → §4 implementation order 4 step 실행 (~30m, 단일 commit)
3. Check (matchRate ≥95% 기대) → report → archive

---

## 9. Out of Scope Carry-Forward (Plan §2.2 그대로)

- `pages-route-i18n` (P1) — `/company`, `/services`, `/network` 라우트 페이지 적용
- `next-intl-native-migration` (P2)
- `marketing-copy-ko-review` (P2)
