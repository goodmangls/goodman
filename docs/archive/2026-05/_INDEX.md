# Archive Index — 2026-05

| Feature | Match Rate | Date | Status | Documents |
|---------|:----------:|------|--------|-----------|
| goodman-gls-prerender-debt | 0% | 2026-05-29 | failed-upstream-blocked | [plan](goodman-gls-prerender-debt/goodman-gls-prerender-debt.plan.md), [design](goodman-gls-prerender-debt/goodman-gls-prerender-debt.design.md), [analysis](goodman-gls-prerender-debt/goodman-gls-prerender-debt.analysis.md), [report](goodman-gls-prerender-debt/goodman-gls-prerender-debt.report.md) |
| goodman-gls-contact-hardening | 96% | 2026-05-29 | completed (PR #2 → main 7cac00f) | [plan](goodman-gls-contact-hardening/goodman-gls-contact-hardening.plan.md), [design](goodman-gls-contact-hardening/goodman-gls-contact-hardening.design.md), [analysis](goodman-gls-contact-hardening/goodman-gls-contact-hardening.analysis.md), [report](goodman-gls-contact-hardening/goodman-gls-contact-hardening.report.md) |
| goodman-gls-nav-i18n | 98% | 2026-05-30 | completed (PR #5 open, feature/nav-i18n 4 commits) | [plan](goodman-gls-nav-i18n/goodman-gls-nav-i18n.plan.md), [design](goodman-gls-nav-i18n/goodman-gls-nav-i18n.design.md), [analysis](goodman-gls-nav-i18n/goodman-gls-nav-i18n.analysis.md), [report](goodman-gls-nav-i18n/goodman-gls-nav-i18n.report.md) |

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
- **운영 후속 완료**: T1 — Vercel production env `ALLOWED_ORIGINS=https://goodman-gls-self.vercel.app` 등록 + redeploy (`dpl_86SwC8YE`) + curl smoke 4/4 PASS (no-Origin 403, allowed Origin 400 Zod, bad Origin 403, rate limit 5/60s 429 + Retry-After). 2026-05-30 완료
- **후속 사이클 후보 7건 (보고서 §8)**: T1 production env ✅ DONE / T2 preview curl 검증(P1) / T3 nav i18n ✅ goodman-gls-nav-i18n / T4 ContactSection RHF(P2) / T5 logger sink(P2) / T6 Vercel KV distributed rate limit(P2) / T7 `/api/quote` 가드 재사용(P2)

### goodman-gls-nav-i18n
- **Outcome**: success cycle — Navigation + ContactSection i18n + semantic HTML (`<section aria-labelledby>` + `<nav aria-label>`)
- **PR**: #5 open (feature/nav-i18n 4 commits) — 6ff0c93 messages / 2d9e727 Navigation / 539bb92 ContactSection+DisplayLines / 6d91381 chore
- **검증**: FR-1~FR-6 grep audit 6/6 PASS / lint 0 / tsc 0 / Vitest 17/17 / build ✓ Compiled (prerender debt vercel.json `\|\| true` 마스킹 유지)
- **matchRate**: 98% (코드 레벨 100%, 비코드 -2pp: browser smoke + Lighthouse manual)
- **스코프 정정 발견**: contact-hardening 보고서 T3 의 "ContactSection 'Contact Us' 버튼 중복" 기술이 실제 코드와 불일치 → 실제 부채는 t() 미적용 + aria-labelledby 부재로 재정의
- **메시지 키 변동**: en.json nav 4 stale 제거(home/networkSolutions/partnerHub/contact, src 사용처 0) + 5 신규(company/services/network/contactSales/getStarted) / 신규 contact 트리 25 leaf / ko.json nav+contact 30 leaf 직역 baseline
- **Q2 사용자 결정**: Contact sales → 문의하기 / Get started → 시작하기 (건조한 B2B 톤)
- **후속 사이클 후보 4건 (report §10)**: sectional-i18n-rollout(P1, 11 컴포넌트) / next-intl-native-migration(P2) / marketing-copy-ko-review(P2) / pages-route-i18n(P1)
