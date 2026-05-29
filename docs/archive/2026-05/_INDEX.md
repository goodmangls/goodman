# Archive Index — 2026-05

| Feature | Match Rate | Date | Status | Documents |
|---------|:----------:|------|--------|-----------|
| goodman-gls-prerender-debt | 0% | 2026-05-29 | failed-upstream-blocked | [plan](goodman-gls-prerender-debt/goodman-gls-prerender-debt.plan.md), [design](goodman-gls-prerender-debt/goodman-gls-prerender-debt.design.md), [analysis](goodman-gls-prerender-debt/goodman-gls-prerender-debt.analysis.md), [report](goodman-gls-prerender-debt/goodman-gls-prerender-debt.report.md) |
| goodman-gls-contact-hardening | 96% | 2026-05-29 | completed (PR #2 → main 7cac00f) | [plan](goodman-gls-contact-hardening/goodman-gls-contact-hardening.plan.md), [design](goodman-gls-contact-hardening/goodman-gls-contact-hardening.design.md), [analysis](goodman-gls-contact-hardening/goodman-gls-contact-hardening.analysis.md), [report](goodman-gls-contact-hardening/goodman-gls-contact-hardening.report.md) |

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
- **잔여 운영 task**: Vercel production env에 `ALLOWED_ORIGINS=https://goodman-gls.vercel.app` 등록 (~5min)
- **후속 사이클 후보 7건**: T1 production env(P0) / T2 preview curl 검증(P1) / T3 nav i18n(P1) / T4 ContactSection RHF(P2) / T5 logger sink(P2) / T6 Vercel KV distributed rate limit(P2) / T7 `/api/quote` 가드 재사용(P2)
