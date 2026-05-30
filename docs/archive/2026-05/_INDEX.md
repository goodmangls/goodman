# Archive Index — 2026-05

| Feature | Match Rate | Date | Status | Documents |
|---------|:----------:|------|--------|-----------|
| goodman-gls-prerender-debt | 0% | 2026-05-29 | failed-upstream-blocked | [plan](goodman-gls-prerender-debt/goodman-gls-prerender-debt.plan.md), [design](goodman-gls-prerender-debt/goodman-gls-prerender-debt.design.md), [analysis](goodman-gls-prerender-debt/goodman-gls-prerender-debt.analysis.md), [report](goodman-gls-prerender-debt/goodman-gls-prerender-debt.report.md) |
| goodman-gls-contact-hardening | 96% | 2026-05-29 | completed (PR #2 → main 7cac00f) | [plan](goodman-gls-contact-hardening/goodman-gls-contact-hardening.plan.md), [design](goodman-gls-contact-hardening/goodman-gls-contact-hardening.design.md), [analysis](goodman-gls-contact-hardening/goodman-gls-contact-hardening.analysis.md), [report](goodman-gls-contact-hardening/goodman-gls-contact-hardening.report.md) |
| goodman-gls-nav-i18n | 98% (own Design) | 2026-05-30 | ⚠️ superseded-partial (PR #5 closed, PR #4 `bdcb2f0` 머지 충돌) → nav-i18n-cleanup 분리 사이클 | [plan](goodman-gls-nav-i18n/goodman-gls-nav-i18n.plan.md), [design](goodman-gls-nav-i18n/goodman-gls-nav-i18n.design.md), [analysis](goodman-gls-nav-i18n/goodman-gls-nav-i18n.analysis.md), [report](goodman-gls-nav-i18n/goodman-gls-nav-i18n.report.md) |
| nav-i18n-cleanup | 97% | 2026-05-30 | completed (main 직접 push: 3a9dfef + 42fffca) | [plan](nav-i18n-cleanup/nav-i18n-cleanup.plan.md), [design](nav-i18n-cleanup/nav-i18n-cleanup.design.md), [analysis](nav-i18n-cleanup/nav-i18n-cleanup.analysis.md), [report](nav-i18n-cleanup/nav-i18n-cleanup.report.md) |
| sectional-aria-labelledby-rollout | 97% | 2026-05-30 | completed (main 직접 push: 242685b 단일 commit) | [plan](sectional-aria-labelledby-rollout/sectional-aria-labelledby-rollout.plan.md), [design](sectional-aria-labelledby-rollout/sectional-aria-labelledby-rollout.design.md), [analysis](sectional-aria-labelledby-rollout/sectional-aria-labelledby-rollout.analysis.md), [report](sectional-aria-labelledby-rollout/sectional-aria-labelledby-rollout.report.md) |

## Notes

### goodman-gls-prerender-debt
- **Outcome**: framework debt 확정 (application-level 해결 불가)
- **Root cause**: Next 16 + React 19 prerender pipeline 자체 버그 — custom `global-error.tsx` 무관, Next 내부 default 도 동일 오류
- **Evidence**: 6-row 매트릭스 (Next 16.2.4/16.2.6/16.3-canary × React 19.1/19.2 × Option A on/off) — analysis.md §3.1 참조
- **Partial finding**: Option A (lazy ThemeProvider) 는 React 19.1 환경 `/company`-class 페이지에 효과 — React 19.2 + 마스킹 유지 조합 별도 사이클 후보
- **Unblock trigger**: Next 16.3 stable 또는 React 19.3 출시 + `/_global-error` 통과 확인 시 본 Plan/Design 재활용해 Do 재시도

### goodman-gls-contact-hardening
- **Outcome**: success cycle — `/api/contact` Origin/Referer 화이트리스트 + IP sliding-window rate limit 도입
- **PR**: #2 squash merged → main `7cac00f` (10 files, +1647/-73)
- **검증**: lint 0 / tsc 0 / Vitest 17/17 / build 7 routes (4 static + 3 dynamic) all PASS
- **matchRate**: 96% (FR/알고리즘/테스트/응답/파일 모두 100% + 비코드 -4pp: manual curl skip −2 + production env 미등록 −2)
- **운영 후속 완료**: T1 — Vercel production env `ALLOWED_ORIGINS=https://goodman-gls-self.vercel.app` 등록 + redeploy + curl smoke 4/4 PASS (2026-05-30)
- **후속 사이클 후보 7건 (보고서 §8)**: T1 ✅ DONE / T2 preview curl 검증(P1) / T3 nav i18n ⚠️ partial (goodman-gls-nav-i18n + PR #4 충돌) / T4 ContactSection RHF(P2) / T5 logger sink(P2) / T6 Vercel KV distributed rate limit(P2) / T7 `/api/quote` 가드 재사용(P2)

### goodman-gls-nav-i18n
- **Outcome**: ⚠️ **superseded-partial** — Design 대비 코드 100% 구현했으나 동시 머지된 PR #4 (`bdcb2f0` "fix(i18n): 홈·네비게이션 한국어 전환 실제 적용") 가 11 컴포넌트로 광역 i18n 처리하면서 본 사이클 deliverable 일부 superseded
- **PR**: #5 **CLOSED** (사용자 결정 2026-05-30) — feature/nav-i18n 5 commits (6ff0c93 messages / 2d9e727 Navigation / 539bb92 ContactSection+DisplayLines / 6d91381 chore / 664f82c archive) merge 되지 않음
- **PR #4 가 cover 한 영역**: Navigation t() 와이어링 / 11 컴포넌트 home.* i18n / LocaleToggle EN/한국어 라벨
- **PR #5 의 고유 contribution (PR #4 미포함, mini-cycle 로 이관)**:
  1. ContactSection `<section aria-labelledby>` + h2 `id`
  2. DisplayLines `id?:string` prop 시그니처 확장
  3. `<nav aria-label="Primary">`
  4. nav stale 키 제거 (`home`/`networkSolutions`/`partnerHub`)
  5. contact 트리 정합화 (PR #4 의 기존 19키 stale 유지)
- **matchRate**: 98% (자체 Design 대비), 그러나 main 통합 측면 부분 superseded
- **분리 사이클**: `nav-i18n-cleanup` (다음 mini-cycle) — 위 5건만 깔끔하게 main 에서 처리 → ✅ 완료 (2026-05-30, matchRate 97%)
- **자산**: 본 사이클의 Plan/Design 은 i18n + semantic HTML 패턴 reference 로 재사용 가능 (직역 baseline + grep audit ROI + Open Q 4건 해결 패턴)

### sectional-aria-labelledby-rollout
- **Outcome**: success cycle — `nav-i18n-cleanup` 의 OOS-1 인 11 컴포넌트 region landmark 일괄 확산
- **Commit**: main 직접 push `242685b` (단일 commit, Q3 채택)
- **검증**: FR-1~FR-5 grep audit 12/12 PASS / lint 0 / tsc 0 / vitest 17/17 / build ✓ Compiled 11.6s
- **matchRate**: 97% (코드 100%, 비코드 -3pp: browser smoke + Lighthouse manual)
- **3 sub-pattern 적용**:
  · Pattern A (DisplayLines, 6): Hero / WhyGSSA / ServicesShowcase / Company / NetworkManifesto / Footer
  · Pattern B (직접 h2, 2): GSASection / PartnerHubSection
  · Pattern C (eyebrow only, 2): TrustBadges (`<div>`→`<section>`) / StatsSection
- **Heading ID Map**: 8 신규 `-heading` suffix + 5 기존 anchor id (services/company/network/partner-hub/contact) 보존, 충돌 0
- **Open Question 4건 self-resolve** (Q1 동적 t(), Q2 Footer aria-labelledby 적용, Q3 단일 commit, Q4 Hero h1 적용)
- **소요**: ~60m (Plan 추정 70m, 부모 패턴 100% 재사용)
- **Concurrent activity 4회 누적 케이스**: 사용자 content 확장 작업(services 4→6, Hero CTA, messages, /services /network page)과 같은 파일 다른 라인 — 충돌 0, fast-forward 공존
- **lessons**: 6건 (부모 패턴 재사용 / Open Q 0 가속 / 단일 commit 정당화 / content-a11y 격리도 / 메모리 정책 즉시 효과 / 사용자 작업이 다음 사이클 prioritization signal)
- **후속 사이클 후보**: pages-route-i18n(P1, 우선순위 ↑ 사용자 services 확장 시너지) / marketing-copy-ko-review(P2) / next-intl-native-migration(P2)

### nav-i18n-cleanup
- **Outcome**: success cycle — goodman-gls-nav-i18n superseded-partial 의 carry-forward 5건 완료
- **Commits**: main 직접 push `3a9dfef` (♿ a11y semantic landmark) + `42fffca` (🧹 i18n stale cleanup) — PR 없음
- **검증**: FR-1~FR-5 grep audit 7/7 / lint 0 / tsc 0 / vitest 17/17 / build ✓ Compiled 6.1s
- **matchRate**: 97% (코드 100%, 비코드 -3pp: browser smoke + Lighthouse manual)
- **반영 내용**:
  · DisplayLines `id?:string` prop 시그니처 확장 + JSDoc
  · Navigation `<nav aria-label="Primary">` (route landmark)
  · ContactSection `<section aria-labelledby="contact-heading">` + h2 `id="contact-heading"`
  · en.json nav 9→5키 정합화 + 최상위 contact stale 19 leaf 트리 제거
  · ko.json nav 9→5키 정합화 (최상위 contact 부재 확인)
- **소요**: ~50m (부모 cycle 패턴 100% 재사용 + Open Q 0)
- **동시 push 충돌**: PR #6 `9ee9d05` (한글 자간/행간) 동시 머지 → stash + rebase + pop 으로 무손실 처리
- **lessons**: 5건 (부모 패턴 재사용 / agent 우회 / 동시 충돌 패턴 재발 / soft-delete 회피 / Open Q 0 가속)
- **후속 사이클 후보**: sectional-aria-labelledby-rollout(P1) / pages-route-i18n(P1) / marketing-copy-ko-review(P2) / next-intl-native-migration(P2) — 부모 cycle 과 동일
