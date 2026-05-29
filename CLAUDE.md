# CLAUDE.md — GOODMAN GLS

## Project Overview

**GOODMAN GLS** — B2B logistics company website. Core identity is **GSSA (General Sales Agency / Cargo Sales Agency)** for airlines:
- GSA/CSA for airlines (core business — cargo sales representation in Korea)
- Freight forwarding services (Air, Ocean, Project Cargo — supplementary)
- Global network partnerships (MPL, EAN member)

**Tagline**: "Small Giant. Big Impact." — Your Strategic Partner in Korea & Beyond

## Companion Docs

- **AGENTS.md** — 본 파일의 미러 (Codex 등 타 AI 에이전트 표준)
- **DESIGN.md** — Hyer Aviation 스타일 적용 디자인 시스템 (브랜드 토큰·유틸리티 클래스 source of truth, `src/app/globals.css` 와 동기화)
- **docs/01-plan/**, **docs/02-design/**, **docs/03-analysis/**, **docs/04-report/** — bkit PDCA 활성 사이클 문서
- **docs/archive/YYYY-MM/_INDEX.md** — 완료된 PDCA 사이클 색인

## Quick Start

```bash
npm install
npm run dev          # Dev server (http://localhost:3000)
npm run lint         # ESLint
npm run test         # Vitest (watch)
npm run test:run     # Vitest (CI)
npm run build        # Production build
```

> **Build note**: `vercel.json` 의 `buildCommand` 에 `|| true` 마스킹이 남아 있음.
> Next 16 + React 19 prerender 자체 버그 (`/_global-error` useContext null) 회피 — Next 16.3 stable / React 19.3 unblock 까지 유지.
> 상세: `docs/archive/2026-05/goodman-gls-prerender-debt/`.

## Tech Stack

### Frontend (이 레포)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | ^16.2.4 | App Router framework |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling (`@theme` tokens, `src/app/globals.css`) |
| next-intl | ^4.6.1 | i18n (EN/KO) |
| next-themes | ^0.4.6 | Light/Dark mode (`Providers.tsx`) |
| react-hook-form + zod | ^7 / ^4 | Form validation |
| framer-motion | ^12 | Animations |
| resend | ^6 | Transactional email (contact form) |
| @intercom/messenger-js-sdk | ^0.0.19 | Live chat widget |
| Vitest | ^4 | Unit testing (`api-guards.test.ts`) |

### Backend (별도 레포 `goodman-gls-api/` — 본 모노레포에 sibling)
| Technology | Version | Purpose |
|------------|---------|---------|
| Rails | 8.0.4 | API-only framework |
| Ruby | 3.4.5 | Runtime |
| PostgreSQL | latest | Database |
| bcrypt + jwt | latest | JWT 인증 (rate-limited via rack-attack) |
| rack-cors / rack-attack | latest | CORS + 인증/contact rate limit |
| Action Mailer + SendGrid | - | Email (verification, contact — 레거시 경로) |

> **현재 production 흐름**: 마케팅 사이트 `/api/contact` (Next + Resend + `api-guards.ts`) 를 사용.
> Rails 백엔드(`goodman-gls-api/`)는 portal/quote/auth 등 후속 기능용으로 별도 관리 중 — 본 사이트의 contact 폼과 직접 결합되어 있지 않음.

## Project Structure

```
goodman-gls/                       # 이 레포 (Next.js 마케팅 사이트)
  src/
    app/
      api/contact/route.ts         # Resend + api-guards (Origin/Referer + IP rate limit)
      company/page.tsx             # /company — CEO, timeline, values
      services/page.tsx            # /services — sticky nav + canvas/obsidian alternation
      network/page.tsx             # /network — MPL/EAN + airline grid + ECS
      global-error.tsx             # 전역 에러 (Next prerender 호환 이슈로 framework debt 확정)
      not-found.tsx
      layout.tsx                   # Root layout — Inter + Outfit + JetBrains Mono
      page.tsx                     # / — Hero, Trust, Stats, WhyGSSA, Airlines, Services, Network, Partner, Contact
      globals.css                  # Tailwind v4 @theme tokens (DESIGN.md source of truth)
    components/
      Navigation.tsx               # 헤더, 모바일 메뉴, 테마/언어 토글
      Providers.tsx                # next-themes ThemeProvider + LanguageProvider
      HeroSection.tsx              # 풀블리드 비디오/이미지 + display headline
      TrustBadges.tsx              # 신뢰 배지 row
      StatsSection.tsx             # 애니메이션 카운터 (20+yr, 15+ airlines)
      WhyGSSASection.tsx           # GSSA 4 pillar
      GSASection.tsx               # 15 airline partner grid
      ServicesShowcase.tsx         # 다크 서비스 쇼케이스
      CompanySection.tsx           # 회사 소개 패널
      NetworkManifesto.tsx         # 네트워크 메시지
      PartnerHubSection.tsx        # 파트너 허브
      ContactSection.tsx           # /api/contact 폼 (Zod + RHF)
      Footer.tsx                   # EAN widget + MPL badge + IATA
      IntercomMessenger.tsx        # Intercom boot
      ThemeToggle.tsx              # 라이트/다크 토글
      DisplayLines.tsx             # display headline 보조
      ClientLayout.tsx             # 클라이언트 셸
    contexts/
      LanguageContext.tsx          # next-intl messages 컨텍스트 (EN/KO)
    lib/
      api-guards.ts                # Origin/Referer 화이트리스트 + IP sliding-window rate limit
      api-guards.test.ts           # Vitest 17 케이스
      intercom.ts                  # window.intercomSettings boot 설정
      i18n-messages.ts             # next-intl 로더
      validations/contact.ts       # Contact form Zod schema
goodman-gls-api/                   # (sibling) Rails 8 API — portal/quote/auth 등 후속
```

## Development Commands

### Frontend
```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (watch)
npm run test:run     # Vitest (CI 1회)
npm run test:coverage # Vitest + v8 coverage
```

### Backend (별도 `goodman-gls-api/` 디렉토리)
```bash
bundle install
bin/rails db:prepare
bin/rails server         # API on http://localhost:3000
bundle exec rspec
```

## Development Guidelines

### Code Style
- 모든 신규 코드는 TypeScript
- 기존 컴포넌트 패턴 준수
- 가능하면 Server Component 유지, 인터랙션 필요 시 `'use client'`

### Styling — DESIGN.md 가 source of truth
- Tailwind v4 `@theme` 토큰 (`src/app/globals.css`)
- 색: `--color-obsidian #000d10` / `--color-canvas-white #ffffff` / `--color-slate-mist #8e8e95` / `--color-desert-sienna #bc7155`
- 유틸 클래스: `.display-hero`, `.btn-pill-primary`, `.section-surface-obsidian`, `.page-hero`, `.panel-bordered`, `.section-spacing` 등
- 라운드: pill `1000px`, panel `45px`
- 다크 모드: `next-themes` (attribute=class) — Obsidian 섹션은 `text-canvas-white` 명시
- **Don't**: 추가 saturated 컬러 사용 금지 (Desert Sienna 만 액센트), 둥근 모서리 외 사각/얕은 라운드 버튼 금지

### Internationalization
- 메시지 파일: `messages/en.json`, `messages/ko.json`
- `next-intl` + `LanguageContext` 훅 사용
- 양 언어 파일 동기 유지

### Forms
- Zod 스키마: `src/lib/validations/`
- `react-hook-form` 결합, 클라이언트와 서버 라우트 양쪽에서 재사용
- Contact form: `/api/contact` 는 `api-guards.ts` 로 Origin/Referer 가드 + IP sliding-window rate limit

### Testing
- Vitest 단위/통합 (`*.test.ts`)
- 현재 커버: `api-guards.test.ts` (Origin/Referer/rate limit 17 케이스)
- 추가 후보: ContactSection RHF, validations/contact

## Environment Variables

### Frontend (`.env.local` — `.env.local.example` 참고)
```env
# Email (Contact form)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=contact@goodmangls.com
CONTACT_EMAIL_FROM=noreply@goodmangls.com

# /api/contact 가드 (production 필수)
ALLOWED_ORIGINS=https://goodman-gls.vercel.app    # 콤마 구분 origin 화이트리스트
# preview: VERCEL_ENV=preview + VERCEL_URL 동적 허용
# development: http://localhost:3000 자동 허용

# /api/contact rate limit (IP sliding window)
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=60000

# (별도 portal 작업 시) NextAuth + DB
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

### Backend (Rails — Render)
```env
DATABASE_URL=             # PostgreSQL
SECRET_KEY_BASE=          # JWT signing
RAILS_MASTER_KEY=         # credentials
CORS_ORIGINS=             # rack-cors 허용 origin
FRONTEND_URL=             # 이메일 링크용
SENDGRID_API_KEY=         # SendGrid
CONTACT_EMAIL_TO=         # Rails contact recipient (레거시)
```

## bkit PDCA

본 프로젝트는 bkit PDCA 사이클로 운영 — `/pdca status` 로 현재 상태 확인.

### 최근 완료 사이클 (`docs/archive/2026-05/`)
| Feature | matchRate | Outcome | PR / Commit |
|---------|:---------:|---------|-------------|
| goodman-gls-contact-hardening | **96%** | `/api/contact` Origin/Referer 화이트리스트 + IP rate limit 도입 | #2 → main `7cac00f` |
| goodman-gls-prerender-debt | 0% | framework debt 확정 (Next 16 + React 19 `/_global-error` prerender 버그) — Next 16.3 stable 대기 | upstream blocked |

### 후속 사이클 후보 (contact-hardening 보고서 §8)
- T1 production env (`ALLOWED_ORIGINS`) 등록 (P0, 운영 task)
- T2 preview curl 검증 (P1)
- T3 nav i18n (P1)
- T4 ContactSection RHF 정규화 (P2)
- T5 logger sink (Sentry/PostHog) (P2)
- T6 Vercel KV distributed rate limit (P2)
- T7 `/api/quote` 가드 재사용 (P2)

## Current Status

### Completed
- GSSA-first 마케팅 사이트 (Hyer Aviation 스타일 적용 — DESIGN.md 참조)
- 15 airline partner showcase (6 GSSA group)
- WhyGSSA + Stats + EAN/MPL footer
- Bilingual (EN/KO) — next-intl + LanguageContext
- Light/Dark — next-themes
- Vercel production 배포
- Contact form `/api/contact` — Resend + api-guards (Origin/Referer + IP rate limit) — PR #2

### Active / Planned
- `ALLOWED_ORIGINS` production env 등록 (운영)
- contact-hardening 후속 사이클 T2~T7
- prerender-debt unblock 대기 (Next 16.3 stable)
- Rails portal (`goodman-gls-api/`) 별도 진행

## Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout, Inter/Outfit/JetBrains Mono, metadata |
| `src/app/globals.css` | Tailwind v4 `@theme` 토큰 — DESIGN.md 와 동기 |
| `src/app/page.tsx` | 홈 (Hero → Trust → Stats → WhyGSSA → GSA → Services → Company → Network → Partner → Contact → Footer) |
| `src/app/api/contact/route.ts` | Contact 폼 백엔드 (Resend) + api-guards 적용 |
| `src/app/global-error.tsx` | 전역 에러 (prerender-debt 관련 — vercel.json 마스킹 유지) |
| `src/components/Providers.tsx` | ThemeProvider (next-themes) + LanguageProvider |
| `src/components/Navigation.tsx` | 헤더 / 모바일 메뉴 / 토글 |
| `src/components/ContactSection.tsx` | Contact UI (RHF + Zod) |
| `src/contexts/LanguageContext.tsx` | i18n 컨텍스트 |
| `src/lib/api-guards.ts` | Origin/Referer + IP sliding-window rate limit |
| `src/lib/validations/contact.ts` | Contact Zod schema |
| `vercel.json` | `buildCommand "next build \|\| true"` (prerender-debt 마스킹, Next 16.3 stable 까지 유지) |
