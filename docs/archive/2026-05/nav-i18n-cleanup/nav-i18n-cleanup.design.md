---
template: design
version: 0.1
feature: nav-i18n-cleanup
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/01-plan/features/nav-i18n-cleanup.plan.md
---

# nav-i18n-cleanup Design Document

> **Summary**: Plan v0.1 의 FR 5건을 5 파일에 청사진으로 매핑. Open Q 0 → 즉시 Do 진입. 부모 사이클 `goodman-gls-nav-i18n` 의 §4 file diff 패턴 재사용 (PR #4 가 cover 한 부분은 제외).
>
> **Plan**: v0.1 (2026-05-30) — 5 FR / 4 Risk (1 사전 Resolved) / 0 Open Q / ~50m 추정
> **Status**: Draft v0.1

---

## 1. Open Question Resolution

(Plan §6 그대로) **0 Open Q** — 모두 plan 단계에서 mechanical 변경으로 사전 해결.

추가 발견 (Design 단계 신규): **없음**. main HEAD `5e4e4b2` verify 완료.

---

## 2. Message Key Map (after cleanup)

### 2.1 en.json `nav` 트리 정합화 diff

```diff
 {
   "nav": {
-    "home": "Home",
-    "networkSolutions": "Network & Solutions",
+    "company": "Company",
     "services": "Services",
-    "partnerHub": "Partner Hub",
-    "company": "Company",
     "network": "Network",
-    "contact": "Contact",
     "contactSales": "Contact sales",
     "getStarted": "Get started"
   },
   ...
 }
```

> **결과**: 9키 → **5키** (`company / services / network / contactSales / getStarted`)

### 2.2 ko.json `nav` 트리 정합화 diff

```diff
 {
   "nav": {
-    "home": "홈",
-    "networkSolutions": "네트워크 & 솔루션",
+    "company": "회사소개",
     "services": "서비스",
-    "partnerHub": "파트너 허브",
-    "company": "회사소개",
     "network": "네트워크",
-    "contact": "문의",
     "contactSales": "영업 문의",
     "getStarted": "시작하기"
   },
   ...
 }
```

> **결과**: 9키 → **5키** (값은 PR #4 의 한국어 baseline 유지)

### 2.3 en.json + ko.json 최상위 `contact` 트리 제거

src/ 사용처 0 검증 완료 (Plan §1.3, R-1 Resolved). 19 leaf (`title/subtitle/getInTouch/office/officeAddress/operationHubs/email/emailAddress/officeHours/hours/emergency/quickInquiry/namePlaceholder/emailPlaceholder/messagePlaceholder/sendMessage/sending/successMessage/errorMessage`) 전부 삭제.

> ContactSection 은 `home.contact.*` 사용 → 영향 없음 (PR #4 정착).

---

## 3. File Diff Plan

### 3.1 `src/components/DisplayLines.tsx` (1 prop 추가)

```diff
 type DisplayLinesProps = {
   lines: string[];
   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
   className?: string;
+  id?: string;
 };

 /**
  * Multi-line display headings without <br /> — each line is a block span
  * so screen readers get proper word boundaries and visual breaks stay intact.
+ * Optional `id` enables parent sections to set `aria-labelledby` for landmark semantics.
  */
 export default function DisplayLines({
   lines,
   as: Tag = 'h1',
   className,
+  id,
 }: DisplayLinesProps) {
   return (
-    <Tag className={className}>
+    <Tag className={className} id={id}>
       {lines.map((line, index) => (
         <span key={index} className="block">
           {line}
         </span>
       ))}
     </Tag>
   );
 }
```

LOC delta: +3 / -1 / +1 JSDoc

> **Why prop, not wrapper div**: heading 자체가 `aria-labelledby` 대상이라야 screen reader region 점프가 정확함 — wrapper div id 부여는 semantic 약함.

### 3.2 `src/components/Navigation.tsx` (1 line 추가)

```diff
       <nav
+        aria-label="Primary"
         className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-500 ${navSurface}`}
       >
```

LOC delta: +1 / -0

> Mobile menu 의 `<motion.div>` 은 dialog-style overlay → 별도 landmark 아님 (현재 상태 유지).

### 3.3 `src/components/ContactSection.tsx` (2 attribute 추가)

```diff
     <section
       id="contact"
+      aria-labelledby="contact-heading"
       className="bg-canvas section-spacing"
     >
       ...
         <DisplayLines
           as="h2"
+          id="contact-heading"
           lines={[t('home.contact.titleLine1'), t('home.contact.titleLine2')]}
           className="display-lg text-ink mb-8"
         />
```

LOC delta: +2 / -0

> `t('home.contact.titleLine1/2')` 는 PR #4 결정 그대로 — 변경하지 않음.

### 3.4 `messages/en.json` (nav 4키 + 최상위 contact 19키 제거)

LOC delta: -25 (대략, JSON 들여쓰기 포함)

### 3.5 `messages/ko.json` (nav 4키 + 최상위 contact 19키 제거)

LOC delta: -25

---

## 4. Implementation Order

| Step | Action | Files | Time | Logical Commit |
|------|--------|-------|:----:|----------------|
| 4.1 | DisplayLines `id?` prop + JSDoc | DisplayLines.tsx | 2m | A (semantic) |
| 4.2 | Navigation `aria-label="Primary"` | Navigation.tsx | 1m | A (semantic) |
| 4.3 | ContactSection `aria-labelledby` + DisplayLines `id` prop 전달 | ContactSection.tsx | 2m | A (semantic) |
| 4.4 | en.json nav 4키 + 최상위 contact 트리 제거 | en.json | 3m | B (i18n cleanup) |
| 4.5 | ko.json nav 4키 + 최상위 contact 트리 제거 | ko.json | 3m | B (i18n cleanup atomic with 4.4) |
| 4.6 | grep audit + lint + tsc + vitest + build | — | 8m | (검증) |

총 ~20m (Plan 50m 추정 대비 30m 여유 — Open Q 0 + main HEAD verify 완료로 단축)

### 4.1 Commit 구조 옵션

**Option 1 (Recommended): 2 logical commit**
- A: semantic HTML (DisplayLines + Navigation + ContactSection)
- B: i18n cleanup (en.json + ko.json)

**Option 2: 단일 commit**
- 작은 변화 (~10 lines code + ~50 lines JSON) → 통합도 합리적

→ Design 권장: Option 1 (semantic 변경과 메시지 cleanup 분리, revert 용이)

---

## 5. Test Plan

### 5.1 Static grep audit (자동)

```bash
# FR-1: nav aria-label
grep -c 'aria-label="Primary"' src/components/Navigation.tsx
# expected: 1

# FR-2: section aria-labelledby
grep -c 'aria-labelledby="contact-heading"' src/components/ContactSection.tsx
# expected: 1

# FR-3: DisplayLines id prop
grep -c 'id?: string' src/components/DisplayLines.tsx
# expected: 1
grep -c 'id={id}' src/components/DisplayLines.tsx
# expected: 1

# FR-4: ContactSection DisplayLines id prop 전달
grep -c 'id="contact-heading"' src/components/ContactSection.tsx
# expected: 1

# FR-5: nav 트리 5키 정확
python3 -c "import json; d=json.load(open('messages/en.json')); assert sorted(d['nav'].keys()) == sorted(['company','services','network','contactSales','getStarted']); assert 'contact' not in d, 'top-level contact 트리 잔존'"
python3 -c "import json; d=json.load(open('messages/ko.json')); assert sorted(d['nav'].keys()) == sorted(['company','services','network','contactSales','getStarted']); assert 'contact' not in d, 'top-level contact 트리 잔존'"
```

### 5.2 Build Verification

```bash
npm run lint        # 0 errors
npx tsc --noEmit    # 0 errors (DisplayLines prop 변경 영향 없음 확인)
npm run test:run    # 17/17 PASS (api-guards 회귀 없음)
npm run build       # ✓ Compiled (prerender debt 마스킹 유지)
```

### 5.3 Browser Smoke (사용자 manual — Lighthouse a11y baseline)

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | DevTools → Elements → `<nav>` | `aria-label="Primary"` 속성 존재 |
| 2 | DevTools → Elements → `<section id="contact">` | `aria-labelledby="contact-heading"` 존재 |
| 3 | DevTools → Elements → ContactSection 내부 h2 | `id="contact-heading"` 존재 |
| 4 | VoiceOver/Rotor → "Landmarks" | "Primary navigation" + "Contact heading" 식별 |
| 5 | Lighthouse a11y score (홈 1440 데스크탑) | 회귀 없음, 가급적 향상 (landmark count ↑) |

---

## 6. Risks (Plan §5 갱신)

| ID | Risk | Status |
|----|------|:------:|
| R-1 stale 사용처 | sample grep 0건 (Plan §1.3) | ✅ Resolved |
| R-2 DisplayLines prop 회귀 | optional 안전, tsc strict | ✅ Verified (Design §3.1) |
| R-3 home.contact.* 재구조화 유혹 | 명시적 OOS (§2.3, §3.3) | ✅ Accepted |
| R-4 spans heading reading order | h2 outer Tag, spans block → 합쳐 읽힘 | ✅ N/A (정상 동작) |
| R-5 (신규) | 단일 PR vs 직접 main push | Design §7 결정 |

## 7. Branching / Merge Strategy

**Option A: 단일 PR** — feature/nav-i18n-cleanup 브랜치 + PR + squash merge
- 장점: review + CI gate
- 단점: 작은 변경에 overhead

**Option B: main 직접 push (single commit)** — 변경 작음 + risk Resolved
- 장점: 빠름, archive 도 함께 가능
- 단점: review gate 없음

**Recommended: Option B** (변경 작음 + R-1~R-4 Resolved + 단일 사이클 추적 가능 + parent supersession 사례 고려해 빠른 main 정리). 사용자 명시 시 Option A 도 가능.

---

## 8. Success Criteria

- ✅ §5.1 grep audit 7 케이스 전부 expected
- ✅ §5.2 lint/tsc/vitest/build 전부 통과
- ✅ §5.3 manual landmark 검증 사용자
- ✅ Plan §8 success criteria 5건 충족

---

## 9. Next Steps

1. (선택) `bkit:design-validator` 호출 — 부모 사이클 패턴 재사용이라 빠른 통과 기대
2. `/pdca do nav-i18n-cleanup` → §4 implementation order 6 step 실행
3. Check (matchRate ≥95% 기대) → report → archive

---

## 10. Out of Scope Carry-Forward

(Plan §2.2 그대로, 변경 없음)
- `sectional-aria-labelledby-rollout` (P1) — 다른 섹션 동일 패턴
- `next-intl-native-migration` (P2)
- `pages-route-i18n` (P1)
- `marketing-copy-ko-review` (P2)
