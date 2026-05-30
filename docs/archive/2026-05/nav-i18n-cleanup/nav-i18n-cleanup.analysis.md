---
template: analysis
version: 0.1
feature: nav-i18n-cleanup
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/01-plan/features/nav-i18n-cleanup.plan.md
design: docs/02-design/features/nav-i18n-cleanup.design.md
matchRate: 97
---

# nav-i18n-cleanup Gap Analysis

> **Match Rate**: **97%** ✅ (Plan §8 success criteria + Design §5 grep audit 7/7 모두 충족)
>
> **Branch**: main (직접 push, 2 commits)
> **Commits**: `3a9dfef` (semantic) / `42fffca` (i18n cleanup)
> **Rebase event**: PR #6 `9ee9d05` (한글 자간/행간) 동시 push 충돌 → 자동 rebase 무손실 처리
> **Status**: Check 완료 → `/pdca report` 직행 (iterate 불요)

---

## 1. Summary

부모 사이클 `goodman-gls-nav-i18n` 의 carry-forward 5건을 main 에 직접 적용. Design §3 file diff 청사진 1:1 구현, §5.1 grep audit 7 케이스 + §5.2 빌드 검증 4종 모두 PASS. 비코드 -3pp (Lighthouse a11y baseline + landmark manual 검증은 사용자 영역).

## 2. Match Breakdown

| 영역 | Score | 가중 | 비고 |
|------|:-----:|:----:|------|
| Functional Requirements (FR-1~FR-5) | 100% | 35 | 5/5 grep audit PASS |
| File Diff Plan (Design §3) | 100% | 20 | 5 파일 변경량 청사진과 정확히 일치 (DisplayLines +3/-1+JSDoc, Navigation +1, ContactSection +5/-1, en.json -25, ko.json -5) |
| Commit Order (Design §4) | 100% | 15 | A semantic / B i18n cleanup 2 logical commits 그대로 |
| Build Verification (lint/tsc/vitest/build) | 100% | 15 | 4/4 GREEN, vitest 17/17 회귀 0 |
| Grep Audit (Design §5.1) | 100% | 10 | 7/7 케이스 expected (FR-1~FR-5) |
| Browser Smoke (Design §5.3) | 0% | 3 | 사용자 manual (-3pp 감점) |
| Lighthouse a11y baseline | 0% | 2 | 사용자 manual post-merge (-2pp 감점) |
| **Total** | **97%** | 100 | |

> 비코드 -3pp 는 코드 변경 0 — iterate 카테고리 아님. report 직행.

## 3. FR-by-FR Verification

### FR-1 Navigation `aria-label="Primary"` (100%)

**Design 청사진** (§3.2): `<nav aria-label="Primary">` 추가 (1 line)

**구현** (`src/components/Navigation.tsx:75-77` @ 3a9dfef):
```tsx
<nav
  aria-label="Primary"
  className={`fixed top-0 ...`}
>
```

**Audit**: `grep -c 'aria-label="Primary"' src/components/Navigation.tsx` → **1** ✅

---

### FR-2 ContactSection `<section aria-labelledby>` (100%)

**Design 청사진** (§3.3): `<section id="contact" aria-labelledby="contact-heading">`

**구현** (`src/components/ContactSection.tsx:55-59` @ 3a9dfef):
```tsx
<section
  id="contact"
  aria-labelledby="contact-heading"
  className="bg-canvas section-spacing"
>
```

**Audit**: `grep -c 'aria-labelledby="contact-heading"' src/components/ContactSection.tsx` → **1** ✅

---

### FR-3 DisplayLines `id?: string` prop (100%)

**Design 청사진** (§3.1): `id?: string` prop + `<Tag id={id}>` + JSDoc

**구현** (`src/components/DisplayLines.tsx` @ 3a9dfef):
```tsx
type DisplayLinesProps = {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
  id?: string;          // 신규
};

/**
 * ...
 * Optional `id` enables parent sections to set `aria-labelledby` for landmark semantics.
 */
export default function DisplayLines({
  lines,
  as: Tag = 'h1',
  className,
  id,                   // 신규
}: DisplayLinesProps) {
  return (
    <Tag className={className} id={id}>   // 신규
      ...
```

**Audit**:
- `grep -c 'id?: string' src/components/DisplayLines.tsx` → **1** ✅
- `grep -c 'id={id}' src/components/DisplayLines.tsx` → **1** ✅
- JSDoc 한 줄 추가 (§3.1 명세)

---

### FR-4 ContactSection 의 DisplayLines `id="contact-heading"` 전달 (100%)

**Design 청사진** (§3.3): DisplayLines 에 `id="contact-heading"` prop 전달

**구현** (`src/components/ContactSection.tsx:61-65` @ 3a9dfef):
```tsx
<DisplayLines
  as="h2"
  id="contact-heading"   // 신규
  lines={[t('home.contact.titleLine1'), t('home.contact.titleLine2')]}
  className="display-lg text-ink mb-8"
/>
```

**Audit**: `grep -c 'id="contact-heading"' src/components/ContactSection.tsx` → **1** ✅

`home.contact.*` 키 구조는 PR #4 결정 그대로 유지 (Design §3.3 명시).

---

### FR-5 메시지 stale 키 정리 (100%)

**Design 청사진** (§2.1~§2.3): nav 9→5키, en.json 최상위 contact 19 leaf 트리 제거

**구현** (`messages/en.json` + `messages/ko.json` @ 42fffca):
```python
# en.json
nav: ['company', 'services', 'network', 'contactSales', 'getStarted']  # 정확히 5키 ✅
top-level contact: 없음 ✅ (19 leaf 트리 전부 제거)

# ko.json
nav: ['company', 'services', 'network', 'contactSales', 'getStarted']  # 정확히 5키 ✅
top-level contact: 부재 확인 (애초에 ko 에는 없었음, 변경 없음)
```

**Audit**: Python JSON schema 검증 PASS (en + ko)
- en.json: 27 라인 삭제 (nav 4 stale + top-level contact 19 leaf + 들여쓰기)
- ko.json: 5 라인 삭제 (nav 4 stale)

---

## 4. Convention / Quality Compliance

| 항목 | 결과 |
|------|------|
| `npm run lint` | 0 errors / 0 warnings |
| `npx tsc --noEmit` | 0 errors |
| `npm run test:run` | 17/17 PASS (api-guards 회귀 없음) |
| `npm run build` | ✓ Compiled successfully in 6.1s |
| `/_global-error` prerender | ⚠️ 사전 documented framework debt (digest 1759492429), vercel.json `\|\| true` 마스킹 |
| 파일 사이즈 | 모두 < 800 LOC 제한 충족 |
| TypeScript prop 타입 | DisplayLines `id?: string` (typescript/coding-style.md 준수) |

## 5. Gaps / Deviations

| ID | 영역 | 상세 | 처분 |
|----|------|------|------|
| **G-1** | Browser landmark 검증 (Design §5.3) | DevTools/VoiceOver manual 5 시나리오 미실행 | 사용자 후속 — iterate 불가 |
| **G-2** | Lighthouse a11y baseline | post-merge 비교 미실행 | 사용자 후속 — iterate 불가 |
| **G-3** | (None) | 코드 deviation 0 | — |

## 6. Risk Status Update

| Plan Risk | 처분 | Final |
|-----------|------|:------:|
| R-1 stale 사용처 | Plan §1.3 grep 0건 | ✅ Resolved |
| R-2 DisplayLines prop 회귀 | optional prop, tsc PASS | ✅ Verified |
| R-3 home.contact.* 재구조화 유혹 | 명시적 OOS, 변경 없음 | ✅ Accepted |
| R-4 spans heading reading order | h2 outer Tag, span block | ✅ N/A |
| R-5 (Design 신규) branch strategy | Option B (main 직접) 채택 | ✅ Resolved |
| R-6 (실행 중 발생) | PR #6 동시 push 충돌 → 자동 rebase | ✅ Handled (자산: rebase-first push 정책) |

## 7. Concurrent Push Handling (운영 인사이트)

작업 중 origin/main 에 PR #6 `9ee9d05` 머지 발견 → push 거부됨.

처리: `git stash push -u` (untracked + tracked) → `git pull --rebase` → `git stash pop` → `git push`.

결과: 2 commits 충돌 없이 reapply (`a98050b → 3a9dfef`, `c7c2034 → 42fffca`). 파일 겹침 0 (PR #6 styling, 본 사이클 semantic+i18n).

**메모리 자산화 후보**: "main 직접 push 사이클 시 rebase-first 정책 + untracked stash 포함" — 부모 사이클의 PR #4/#5 충돌과 PR #6/본 사이클 충돌 2회 사례 결합.

## 8. Act Recommendation

**→ `/pdca report nav-i18n-cleanup` 직행 (iterate 불요)**

**근거**:
- matchRate **97% ≥ 90% threshold** 
- 코드 레벨 100% (FR/file diff/commit/build)
- 잔여 3pp 비코드 (browser smoke + Lighthouse) — iterate 처리 카테고리 아님
- bkit pdca-iterator 자동 수정 후보 0건

**Report 후 활동**:
- main 에서 manual landmark 검증 (사용자, ~5min)
- `/pdca archive nav-i18n-cleanup` 으로 4 문서 → `docs/archive/2026-05/` 이관

## 9. Next Steps

1. `/pdca report nav-i18n-cleanup` — completion report 작성
2. (사용자) DevTools/Lighthouse manual 검증 5 시나리오
3. `/pdca archive nav-i18n-cleanup` — archive + _INDEX 갱신 (부모 cycle 옆 보관)
4. 후속 사이클 후보 (Plan §2.2): `sectional-aria-labelledby-rollout` / `pages-route-i18n` / `marketing-copy-ko-review` / `next-intl-native-migration`
