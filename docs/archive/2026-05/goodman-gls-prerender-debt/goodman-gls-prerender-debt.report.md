---
template: report
version: 1.2
feature: goodman-gls-prerender-debt
date: 2026-05-29
author: jhlim725
project: goodman-gls
project_version: 0.1.0
status: failed-upstream-blocked
matchRate: 0
---

# goodman-gls-prerender-debt Completion Report

> **Feature**: goodman-gls-prerender-debt  
> **Project**: goodman-gls  
> **Date**: 2026-05-29  
> **Match Rate**: 0% (framework debt 확정)  
> **Status**: COMPLETED — Framework Debt Identified, External Patch Awaiting

---

## 1. Executive Summary

Next.js 16 + React 19 의 framework 차원 prerender 파이프라인 버그로 인한 `npm run build` 실패를 해소하기 위해 시작한 사이클. 6-row 결정적 테스트 매트릭스를 통해 application-level 해결 불가능을 확정했으며, Vercel auto-deploy 차단은 `vercel.json` 의 `|| true` 마스킹으로 임시 유지. 베이스라인 복원 + 분석 문서 작성으로 다음 시도자(자동/사람) 가 같은 진단을 반복하는 비용 차단.

---

## 2. PDCA Cycle Summary

| Phase | Document | Date | Status | 세부 결과 |
|-------|----------|------|--------|----------|
| **Plan** | `docs/01-plan/features/goodman-gls-prerender-debt.plan.md` | 2026-05-29 | ✅ | 5 옵션 enumerated, A→C→B→D 권장 순서 |
| **Design** | `docs/02-design/features/goodman-gls-prerender-debt.design.md` | 2026-05-29 | ✅ 90/100 | 옵션 A (Provider lazy + head script) 1차 path, vercel.json 마스킹 발견 |
| **Do** | (구현 산출물 0) | 2026-05-29 | ❌ failed-upstream-blocked | 6-row 매트릭스 실행 후 모든 조합 실패, 베이스라인 복원 |
| **Check** | `docs/03-analysis/goodman-gls-prerender-debt-gap.md` | 2026-05-29 | ✅ | matchRate 0%, root cause framework bug 확정 |
| **Act** | (iterate 생략) | 2026-05-29 | ⏭️ | application-level 해결 방법 없음 — pdca-iterator 위임 불가 |
| **Report** | 이 문서 | 2026-05-29 | ✅ | 6-row 매트릭스 + 권장사항 사용자 전달 |

---

## 3. Outcome by Dimension

### 3.1 Did We Solve the Problem?

**목표**: Vercel auto-deploy unblock → `npm run build` exit 0 통과  
**결과**: ❌ NO — framework 버그로 application-level fix 불가능

```
┌──────────────────────────────────────────────────────┐
│  Do Phase Results (6 builds, 3 Next × 2 React × 2)   │
├──────────────────────────────────────────────────────┤
│  ❌ Next 16.2.4 + React 19.2.3: /_global-error fail  │
│  ❌ Next 16.2.6 + React 19.2.3: /_global-error fail  │
│  ❌ Next 16.2.6 + React 19.1.0: /company fail        │
│  ❌ Next 16.2.6 + React 19.1 + Option A: /company OK │
│     BUT /_global-error still fail                    │
│  ❌ Next 16.2.6 + React 19.1 + Option A + no g-err:  │
│     /_global-error fail (Next internal default too)  │
│  ❌ Next 16.3-canary + React 19.1 + Option A:        │
│     /_global-error fail (upstream patch not arrived) │
└──────────────────────────────────────────────────────┘
```

### 3.2 What Was Confirmed

1. **Framework Bug Identified**: Next.js 16 + React 19 prerender 시 `/_global-error` route 에서 React dispatcher null → useContext null TypeError
2. **Verified Not User Code**: global-error.tsx 파일 삭제해도 동일 fail → Next 내부 default 도 영향
3. **All Versions Affected**: Stable 16.2.4, latest 16.2.6, canary 16.3.0 모두 동일 패턴
4. **Partial Finding**: Option A (lazy ThemeProvider) 는 `/company`-class pages 에 효과 있음 — 별도 사이클 가치

### 3.3 How We Maintained Stability

- ✅ `vercel.json` `|| true` **의도적으로 유지** — build 실패를 마스킹해 auto-deploy 차단 방지. 임시 솔루션, Next 16.3 stable 출시까지 필요.
- ✅ 베이스라인 코드 복원 — Providers.tsx, layout.tsx, 패키지 버전 원상태
- ✅ ESLint / TypeScript 회귀 0 — 기존 코드 품질 영향 없음

---

## 4. Key Deliverables

### 4.1 PDCA Documents (4 files)

| 문서 | 경로 | 목적 |
|------|------|------|
| Plan v0.1 | `docs/01-plan/features/goodman-gls-prerender-debt.plan.md` | 5 옵션 분석, 권장 순서 정리 |
| Design v0.2 | `docs/02-design/features/goodman-gls-prerender-debt.design.md` | Option A 구현 설계, design-validator 90/100 |
| Analysis v0.1 | `docs/03-analysis/goodman-gls-prerender-debt-gap.md` | 6-row 매트릭스, root cause 확정 |
| Report v1.0 | 이 문서 | 종료 보고 + 권장사항 |

### 4.2 Critical Discovery: 6-Row Test Matrix

| # | Next | React | Option A | first-fail page | digest | 결론 |
|---|---|---|---|---|---|---|
| 1 | 16.2.4 | 19.2.3 | × | `/_global-error` | 1759492429 | Stable baseline fail |
| 2 | 16.2.6 | 19.2.3 | × | `/_global-error` | 1036061798 | Patch 미해결 |
| 3 | 16.2.6 | 19.1.0 | × | `/company` | 2457026301 | React + Provider 영향 |
| 4 | 16.2.6 | 19.1.0 | ✓ | `/company` → **PASS** | 1036061798 | Option A 부분 효과 |
| 5 | 16.2.6 | 19.1.0 | ✓ | `/_global-error` | 1036061798 | custom g-err 비관련 |
| 6 | 16.3-canary | 19.1.0 | ✓ | `/_global-error` | 3524736071 | Canary 미해결 |

**자산 가치**: 다음 시도자(자동/사람)가 이미 실행된 6 조합을 재반복하는 비용 0. 매트릭스가 "framework debt 결정적" 의 표준 증거.

### 4.3 Partial Finding: Option A Preservation

**Discovery**: Option A (next/dynamic ssr:false 로 ThemeProvider lazy-load) 는 build green 을 달성하지 못했으나, `/company`-class pages 에서 useState/useContext null 을 해결:

- **Matrix Row 4**: Next 16.2.6 + React 19.1.0 + Option A 적용 시 `/company` 통과 확인
- **미시도 시나리오**: React 19.2.3 (현행) + Option A + `|| true` 마스킹 유지 → 빌드는 여전히 `/_global-error` 실패하지만 마스킹되고, 실제 prod deploy 상 `/company`-class 런타임 안정성 향상 가능
- **후속 사이클 후보**: "goodman-gls-prerender-async-runtime-stability" (30분 추정) — 부분 fix 가치 검증

---

## 5. Lessons Learned

### 5.1 Framework Debt 진단의 정확성

**발견**: Discriminator test (ThemeProvider 제거 시 실패 지점 이동) 의 첫 해석이 "단일 컴포넌트 문제" 로 추정되었으나, advisor 지적으로 정정됨.

**교훈**: systemic 버그 진단 시 **6-row 매트릭스** (dependency × version × feature toggle) 를 먼저 설계. 정량적 증거가 정성적 추정을 압도.

### 5.2 Build Masking 의 Debt 누적

**발견**: `vercel.json` 의 `|| true` 가 **빌드 실패를 silent pass** 시키고 있었음.

```json
// Before (현재)
{ "buildCommand": "next build || true" }  // 실패해도 deploy 진행

// After (개선, 나중에)
{ "buildCommand": "next build" }          // 실패 시 deploy 중단
```

**교훈**: 임시 마스킹은 편의상 도입되지만 다른 진짜 에러(TS 오류, 의존성 깨짐)도 같이 숨김. PR CI 에 `next build` 단독 검증 step 추가 권장 (마스킹 우회).

### 5.3 Option A 의 부분 가치 인식

**발견**: 6-row 매트릭스 Row 4 에서 Option A 가 본 사이클 목표(`/_global-error` 차단) 와 무관하게 `/company` 를 고침.

**교훈**: 사이클 실패 후에도 **side effect discovery** 를 기록. 분리 사이클로 이관하면 MDN 대비 낮은 투자로 stability 향상 가능.

### 5.4 Framework Debt 결정적 증거 표준화

**발현**: 이번 매트릭스가 "Next 16 + React 19 prerender bug" 의 재현 불가능한 표준 증명서.

**교훈**: 다음 유사 case 발생 시 (다른 라이브러리, 다른 환경) 같은 **6-element matrix** (major × minor × feature) 패턴 자동 적용 가능. 프레임워크 추적 가능성 향상.

---

## 6. Next Steps & Monitoring

### 6.1 Immediate (완료)

- ✅ 베이스라인 복원 (Providers.tsx, layout.tsx, vercel.json)
- ✅ Analysis 문서 작성 + 6-row 매트릭스 정식 기록
- ✅ ESLint / TypeScript 회귀 검증
- ✅ vercel.json `|| true` **의도적 유지** — 임시 debt 로 명시

### 6.2 Short-term (1~2주)

- [ ] **Release notes monitoring** — next@16, react@19 dist-tag watch (cron job 또는 GitHub Action)
- [ ] **Partial finding validation** — Option A + React 19.2.3 + 마스킹 유지 1 사이클 재검증 (30분)
- [ ] **CI gate 강화** — PR `next build` step 추가 (`|| true` 없이) → build 실패 시 PR block

### 6.3 Medium-term (Next 16.3 stable 출시 시점)

- [ ] 16.3 stable 즉시 본 매트릭스 **Row 6 자리** 재실행 (현행 canary 대체)
- [ ] `/_global-error` **통과 시** Plan/Design 재활용해 Do 재시도 (동일 Option A path, 이미 90/100 validator 통과)
- [ ] vercel.json `|| true` 제거를 **별도 사이클** 로 분리 진행 (side effect 최소화)

### 6.4 Long-term (대안 검토)

- [ ] Next 16.3 도 미해결 시: next-themes 의존 제거, `useTheme` 자체 구현 (30~60분)
- [ ] 또는 React 18 LTS 다운그레이드 (server components 호환성 재검증 필요)

---

## 7. Block Unblock Conditions

### 7.1 Framework Debt 해소 조건 (Control Out)

**Required**: Next.js 16.3 stable 또는 React 19.3 patch 출시 + `/_global-error` prerender 통과 확인

**When confirmed**:
1. 본 사이클의 Plan (v0.1) + Design (v0.2) 재활용
2. Do phase 재시도 → 예상 실패 → Check 일치율 ≥90% 목표
3. Vercel preview + production deploy unblock

### 7.2 내부 선택지 (Control In)

**Option 1** (현재): vercel.json `|| true` 유지 → prod deploy 진행, build 실패 silent pass  
**Option 2** (30분 추정): Option A + React 19.2.3 + 마스킹 유지 → 부분 runtime stability 검증

---

## 8. Risk Management if Not Resolved

| 영역 | 영향 | 완화책 |
|------|------|--------|
| **Vercel auto-deploy** | Build fail silent pass → 다른 진짜 에러(TS, deps) 도 숨겨짐 | PR CI 에 `next build` 단독 검증 step |
| **로컬 build** | `npm run build` 항상 fail → developer UX 저하 | `npm run build || true` 별칭 또는 Vitest gate 만 사용 |
| **`/company`-class runtime** | React 19.2 환경 ThemeProvider useContext null 가능성 | Row 4 부분 발견 검증 사이클 (30분) |

---

## 9. Quality Metrics

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Design Match Rate | 90%+ | 0% (framework 버그) | ❌ |
| Build Exit Code | 0 | fail (upstream) | ❌ |
| ESLint/TSC | 0 errors | 0 errors | ✅ |
| Vitest coverage | 17/17 | 17/17 (회귀 0) | ✅ |
| Test case execution | 12/12 | 1/12 (build 차단) | ⏭️ |

---

## 10. PDCA Metrics

| Metric | Value |
|--------|-------|
| Plan → Report 소요 시간 | 1 day (2026-05-29) |
| 설계 대비 구현 의도 | 100% (옵션 A 적용 시도) |
| Framework bug 확정 | 6-row 매트릭스 확률 0 fail |
| 추가 발견 | 1 (Option A 부분 효과 + vercel.json 마스킹) |
| 반복 개선 (iterate) | 0 (application-level 해결 불가 → skip 정당) |

---

## 11. Archive Preparation

본 사이클은 다음 참고자산을 문서화 완료:

1. **6-row test matrix** — 프레임워크 버그 재현 불가능 증거
2. **Option A 부분 발견** — `/company` runtime stability 개선 후보
3. **Monitoring routine** — Next/React release tracking 자동화
4. **Plan/Design 자산** — Next 16.3 stable 출시 시 재활용 가능

**Archive target**: `docs/archive/2026-05/goodman-gls-prerender-debt/`

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-29 | jhlim725 | Initial report — 6-row 매트릭스 + root cause framework bug 확정 + Option A 부분 발견 + 권장사항 |

---

*Report generated: 2026-05-29*  
*PDCA Cycle Status: Plan ✅ → Design ✅ → Do ❌ (upstream-blocked) → Check ✅ → Act ⏭️ (skip justified) → Report ✅*  
*Next: `/pdca archive goodman-gls-prerender-debt` → docs/archive/2026-05/ 이관*
