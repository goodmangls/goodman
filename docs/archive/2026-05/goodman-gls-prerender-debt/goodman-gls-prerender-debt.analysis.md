---
template: analysis
version: 1.2
feature: goodman-gls-prerender-debt
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan_ref: docs/01-plan/features/goodman-gls-prerender-debt.plan.md
design_ref: docs/02-design/features/goodman-gls-prerender-debt.design.md
status: failed-upstream-blocked
matchRate: 0
---

# goodman-gls-prerender-debt Analysis Report

> **Analysis Type**: Gap Analysis + Root Cause Investigation
>
> **Project**: goodman-gls
> **Version**: 0.1.0
> **Analyst**: jhlim725
> **Date**: 2026-05-29
> **Status**: **FAILED — Upstream framework debt confirmed**
> **Match Rate**: **0%** (모든 DoD 미충족 — application-level fix 불가능 확인)

### Pipeline References

| Phase | Document | Result |
|-------|----------|--------|
| Plan | [Plan v0.1](../01-plan/features/goodman-gls-prerender-debt.plan.md) | 5 옵션 enumerated, A→C→B→D 권장 |
| Design | [Design v0.2](../02-design/features/goodman-gls-prerender-debt.design.md) | validator 90/100, 옵션 A 1차 path |
| Do | (구현 산출물 0 — 베이스라인 복원) | 6-row 매트릭스 결정적 증거 |
| Check | 이 문서 | matchRate 0%, framework debt 확정 |

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Do phase 가 모든 옵션에서 실패한 결과를 정식 기록 — 어떤 조합이 시도됐고 왜 application-level fix 가 불가능한지를 추적 가능한 형태로 문서화. 다음 시도자 (자동/사람) 가 같은 매트릭스를 다시 돌리는 비용을 차단.

### 1.2 Analysis Scope

- **Design 대상**: Provider lazy-load (옵션 A) + layout head inline script + vercel.json `\|\| true` 제거
- **실제 구현**: 베이스라인 복원 (모든 코드 / package.json / vercel.json git checkout)
- **테스트 매트릭스**: 6 build 조합 (Next 3 버전 × React 2 버전 × Option A 토글)
- **분석 일자**: 2026-05-29

---

## 2. Gap Analysis (Design vs Implementation)

### 2.1 File Diff

| Design 계획 | 실제 구현 | Status | 비고 |
|---|---|---|---|
| `src/components/Providers.tsx` +4/-1 (lazy ThemeProvider) | 베이스라인 그대로 | ❌ Not implemented | Do 중 적용했으나 효과 없어 revert |
| `src/app/layout.tsx` +9/-0 (head inline script) | 베이스라인 그대로 | ❌ Not implemented | 동일 |
| `vercel.json` +1/-1 (`\|\| true` 제거) | 베이스라인 그대로 (`\|\| true` 유지) | ❌ Not implemented | 마스킹 제거 시 Vercel deploy 영구 차단 위험 → 의도적 유지 결정 |

### 2.2 Test Case 결과 (Design §8)

| TC | 의도 | 실제 결과 |
|---|---|---|
| TC-1 | `npm run build` exit 0 | ❌ 6/6 builds 모두 `/_global-error` 또는 `/company` 에서 실패 |
| TC-2 | `npm run start` → `/` 200 | ⏭️ 빌드 실패로 미실행 |
| TC-3 | global-error 폴백 UI | ⏭️ 미실행 |
| TC-4 ~ TC-7 | localStorage / ThemeToggle 시나리오 | ⏭️ 빌드 통과 전제 — 미실행 |
| TC-8 | `/company`, `/services`, `/network` prerender | ❌ 빌드 abort 로 부분 결과만 |
| TC-9 | Vitest 17/17 회귀 | ⏭️ 미실행 |
| TC-10 | 모바일/데스크탑 시각 회귀 | ⏭️ 빌드 미통과 — 미실행 |
| TC-11 | Vercel preview 빌드 | ⏭️ 미실행 |
| TC-12 | EN↔KO 토글 | ⏭️ 미실행 |
| TC-N1~3 | Negative cases | ⏭️ 미실행 |
| TC-R1 | Rollback test | ✅ 베이스라인 복원 완료 (의도된 종료 절차로) |

### 2.3 Match Rate Summary

```
┌─────────────────────────────────────────────────┐
│  Overall Match Rate: 0%                         │
├─────────────────────────────────────────────────┤
│  ✅ Implemented:   0 / 3 files                  │
│  ❌ Reverted:      3 / 3 files (effect 0)       │
│  ⏭️ TC unexecuted: 11 / 12 (build 차단)         │
│  ✅ Rollback TC:   1 / 1 (의도된 절차)          │
└─────────────────────────────────────────────────┘
```

---

## 3. Root Cause Analysis

### 3.1 결정적 6-row 매트릭스

| # | Next | React | Option A | global-error.tsx | 첫 실패 페이지 | digest |
|---|---|---|---|---|---|---|
| 1 | 16.2.4 | 19.2.3 | × | ✓ | `/_global-error` | 1759492429 |
| 2 | 16.2.6 (latest stable) | 19.2.3 | × | ✓ | `/_global-error` | 1036061798 |
| 3 | 16.2.6 | 19.1.0 (downgrade) | × | ✓ | **`/company`** (다른 페이지!) | 2457026301 |
| 4 | 16.2.6 | 19.1.0 | ✓ (lazy ThemeProvider) | ✓ | `/_global-error` | 1036061798 |
| 5 | 16.2.6 | 19.1.0 | ✓ | **삭제** | `/_global-error` | 1036061798 |
| 6 | 16.3.0-canary.33 | 19.1.0 | ✓ | ✓ | `/_global-error` | 3524736071 |

### 3.2 매트릭스 해석

| 관찰 | 결론 |
|---|---|
| #1, #2: Next patch 만 올려도 `/_global-error` 동일 실패 | Next 16.2.x patch line 에서 미해결 |
| #3: React 19.1 + 옵션 A 없을 때 `/company` 가 첫 실패 | React 19.x + next-themes ThemeProvider 가 `/company` 트리에서 useContext null → **옵션 A 가 의미 있는 fix 인 영역** |
| #4: Option A 적용 후 `/company` 통과, `/_global-error` 가 첫 실패로 노출 | Option A 부분 효과 확인. 단 `/_global-error` 는 별개 차단 |
| #5: `global-error.tsx` 파일 삭제해도 `/_global-error` 동일 실패 | **버그는 우리 코드 아님 — Next 의 내장 default global-error 도 동일 오류** |
| #6: Next 16.3 canary 도 동일 실패 (digest 만 변경) | upstream patch 미도착 |

### 3.3 확정된 Root Cause

**Next.js 16 + React 19 의 framework prerender pipeline 이 `/_global-error` 특수 페이지를 SSG 할 때 React dispatcher 가 null 상태로 hooks 호출 → useContext null TypeError.**

근거:
1. 6 builds 모두 같은 패턴 (digest 만 다른 frame)
2. Custom `global-error.tsx` 삭제 시에도 발생 → Next 내부 코드의 버그
3. Stable, latest stable, canary 모두 동일 → upstream 패치 미도착
4. application-level (Provider, layout, route segment config) 모든 시도 효과 없음

### 3.4 부분 발견 — Option A 가치

**Option A (lazy ThemeProvider via `next/dynamic ssr:false`) 는 폐기 아닌 보류**:

- React 19.1 + Next 16.2.6 + Option A 적용 시 `/company` 통과 확인 (#4)
- 즉 ThemeProvider 가 useContext null 을 던지던 `/company`-class 페이지에 한해 실제 fix
- 단 본 사이클 목표(`/_global-error` 차단 제거 → build green → Vercel deploy unblock) 와 무관해 적용 보류
- 별도 미시도 시나리오: **React 19.2.3 (현행) + Next 16.2.6 + Option A + `\|\| true` 마스킹 유지** — 빌드는 여전히 `/_global-error` 차단으로 fail 하지만 마스킹 통과 → 실제 deploy 된 prod 에서 `/company` runtime 안정성 향상 가능. 1 사이클 추가 검증 가치 있음.

---

## 4. Code Quality Analysis

해당 없음 (구현 산출물 0, 베이스라인 복원). 기존 코드 품질은 별도 사이클(d2e113a 디자인 fix, 9f074c3 footer fix) 에서 처리됨.

---

## 5. Recommendations

### 5.1 즉시 조치 (완료)

- ✅ next@16.2.4, react@19.2.3, react-dom@19.2.3 베이스라인 복원
- ✅ Providers.tsx, layout.tsx, vercel.json git checkout
- ✅ vercel.json `\|\| true` **유지** — Vercel auto-deploy 가 영구 차단되지 않도록 마스킹 필요. Next 16.3 stable 출시까지 known-debt feature.
- ✅ ESLint 0 / tsc exit 0 회귀 없음 확인

### 5.2 단기 (1~2주)

- [ ] Next.js 16 release notes monitoring 루틴 도입 — `next@16` dist-tag latest 변경 시 알림 (cron 또는 GitHub Watch)
- [ ] react@19 release monitoring 동시 — 19.3 또는 19.2.x patch
- [ ] 매트릭스 #4 의 부분 발견(Option A + React 19.2 + 마스킹 유지) 1 사이클 검증 — 30분 추정, `/company`-class 런타임 안정성 향상 잠재

### 5.3 중기 (Next 16.3 stable 출시 시점)

- [ ] 16.3 stable 출시 즉시 본 매트릭스 (특히 #6 의 canary 자리) 재실행
- [ ] `/_global-error` 통과 시 Plan/Design 재활용해 Do 재시도 — 동일 옵션 A path 권장 (이미 90/100 validator 통과한 설계 자산)
- [ ] 통과 시 vercel.json `\|\| true` 제거를 새 사이클로 분리해 진행

### 5.4 장기 (대안 검토)

- [ ] Next 16.3 도 미해결 시: alternative theme management (next-themes 의존 제거, `useTheme` 자체 구현) 검토
- [ ] 또는 React 18 LTS 다운그레이드 (server components / app router 호환성 검증 후)

---

## 6. Status & Next Steps

### 6.1 Cycle Status

```
[Plan v0.1]    ✅ 5 옵션 enumerated
   ↓
[Design v0.2]  ✅ validator 90/100, 옵션 A path
   ↓
[Do]           ❌ failed-upstream-blocked (6-row 매트릭스 결정적)
   ↓
[Check]        ✅ 이 문서 — matchRate 0%, root cause 확정
   ↓
[Act]          ⏭️ 생략 — iterate 무의미(application-level 해결 불가)
   ↓
[Report]       🔄 다음 — matrix + 권장 사항을 사용자/팀 전달용으로 정리
   ↓
[Archive]      🔄 Report 후 — 매트릭스 자산을 다음 시도자가 찾을 수 있게 docs/archive/2026-05/
```

### 6.2 Block 해소 조건

- **External (control out)**: Next 16.3 stable 또는 React 19.3 출시 + `/_global-error` 통과 확인
- **Internal (선택지)**:
  - vercel.json `\|\| true` 유지로 prod deploy 진행 — 현재 상태
  - Option A + React 19.2 + 마스킹 유지 1 사이클 — 부분 fix 가치 검증

### 6.3 Risk if not resolved

| 영역 | 영향 | 완화책 |
|---|---|---|
| Vercel auto-deploy | 마스킹으로 통과하지만 빌드 실패가 silent — 다른 진짜 실패 (예: TS 에러, 의존성 깨짐) 도 같이 마스킹됨 | PR CI 에 `next build` 단독 step 추가 검토 (마스킹 우회) |
| 로컬 `npm run build` | 항상 fail → CI 셋업 시 회피 코드 필요 | `npm run build || true` 별칭 또는 Vitest 만 CI gate |
| `/company`-class runtime stability | React 19.2 환경에서 ThemeProvider 가 useContext null 가능성 — 단 hydration 후 mounted state 에서 정상 동작 추정 | 매트릭스 #4 의 부분 발견 검증 사이클로 확인 가능 |

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-29 | jhlim725 | Initial — 6-row 매트릭스, root cause 확정(framework debt), matchRate 0%, recommendations |
