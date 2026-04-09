# Simplify to Marketing Site — Planning Document

> **Summary**: 인증/포털/한국어를 제거하고 영어 단일 마케팅 사이트로 단순화 (경쟁사 벤치마킹)
>
> **Project**: goodman-gls
> **Author**: Jaehong
> **Date**: 2026-04-09
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

경쟁사(ECS Group, Kales, PAA Group, Daejoo Air)와 동일하게 로그인 없는 영어 단일 마케팅 사이트로 단순화. 항공사 고객 영입이 메인 목적이므로 불필요한 인증/포털 복잡성을 제거한다.

### 1.2 Background

- 경쟁사 GSSA 웹사이트: 로그인 없음, 영어 단일, 견적 요청은 공개 폼
- 현재 goodman-gls: JWT 인증, 파트너 포털, EN/KO 이중 언어 → 과도한 복잡성
- 핵심 목적: 항공사에게 "우리를 GSSA로 선택하세요"를 전달하는 마케팅

---

## 2. Scope

### 2.1 DELETE — 완전 제거

**Auth 시스템 (13 files):**
- `src/app/auth/` — 5 pages (login, register, verify, forgot-password, reset-password)
- `src/app/portal/` — 8 files (dashboard, quotes CRUD, admin quotes, layout, shell)
- `src/contexts/AuthContext.tsx` — JWT 인증 컨텍스트
- `src/lib/authStorage.ts` — 토큰 저장
- `src/components/portal/` — PortalHeader.tsx, PortalSidebar.tsx
- `src/components/quotes/` — QuoteForm.tsx, AdminQuoteResponse.tsx, QuoteCard.tsx, QuoteTimeline.tsx, QuoteFilters.tsx, QuoteStatusBadge.tsx (6 files)

**i18n 시스템:**
- `src/contexts/LanguageContext.tsx` — 언어 컨텍스트
- `src/components/LanguageToggle.tsx` — 언어 전환 버튼
- `messages/ko.json` — 한국어 번역 파일
- `src/content/kr.json` — 한국어 콘텐츠

**기타:**
- `src/middleware.ts` — 빈 미들웨어 (pass-through)
- `src/app/partner-hub/` — 파트너 허브 페이지 (인증 연계)

### 2.2 MODIFY — 리팩터링

**Providers.tsx**: AuthProvider, LanguageProvider 제거 → 불필요해지면 파일 자체 제거 가능

**ClientLayout.tsx**: auth/portal 라우트 분기 로직 제거 → 항상 Navigation + Footer 표시

**Navigation.tsx**: LanguageToggle, Login 링크 제거

**모든 마케팅 컴포넌트 (8 files)**: `useTranslations()` → 직접 영어 텍스트
- HeroSection.tsx
- StatsSection.tsx
- GSASection.tsx
- WhyGSSASection.tsx
- ServicesShowcase.tsx
- CompanySection.tsx
- ContactSection.tsx
- TrustBadges.tsx
- PartnerHubSection.tsx

**Footer.tsx**: 이미 하드코딩 영어 (수정 최소)

**apiClient.ts**: JWT 로직 제거 → 단순 fetch 클라이언트 (Contact 폼용)

### 2.3 KEEP — 유지

- 랜딩페이지 (`src/app/page.tsx`)
- Company 페이지 (`src/app/company/`)
- Services 페이지 (`src/app/services/`)
- Network Solutions 페이지 (`src/app/network-solutions/`)
- Contact 폼 (인증 없이 공개)
- 다크 프리미엄 테마
- ToastContext (알림용)
- `messages/en.json` → 영어 텍스트 소스로 활용 후 인라인 전환 시 삭제 검토

---

## 3. Implementation Strategy

**접근 방식**: 마케팅 컴포넌트에서 `useTranslations()` 호출을 `messages/en.json`의 영어 텍스트로 직접 교체한 후, i18n 시스템 전체를 제거.

### Step 1: Auth 시스템 제거
- `src/app/auth/` 디렉토리 삭제
- `src/app/portal/` 디렉토리 삭제
- `src/components/portal/` 디렉토리 삭제
- `src/components/quotes/` 디렉토리 삭제
- `src/contexts/AuthContext.tsx` 삭제
- `src/lib/authStorage.ts` 삭제
- `src/middleware.ts` 삭제

### Step 2: i18n 제거
- 각 컴포넌트에서 `useTranslations()` → 영어 텍스트 직접 사용
- `src/contexts/LanguageContext.tsx` 삭제
- `src/components/LanguageToggle.tsx` 삭제
- `messages/ko.json` 삭제
- `src/content/kr.json` 삭제

### Step 3: Provider/Layout 단순화
- `Providers.tsx` → ToastProvider만 유지 (또는 제거)
- `ClientLayout.tsx` → auth/portal 분기 제거
- `Navigation.tsx` → Login/LanguageToggle 제거

### Step 4: apiClient.ts 단순화
- JWT 로직 제거
- Contact 폼 전송만 유지

### Step 5: 검증
- `npm run build` 성공
- `npm run lint` 통과
- 라우트 확인: /, /company, /services, /network-solutions만 존재

---

## 4. Affected Files Summary

| Action | Count | Files |
|--------|-------|-------|
| DELETE | ~30 | auth/, portal/, quotes/, AuthContext, LanguageContext, LanguageToggle, authStorage, middleware, ko.json, kr.json |
| MODIFY | ~12 | 8 marketing components + Providers, ClientLayout, Navigation, apiClient |
| KEEP | ~8 | page.tsx, company/, services/, network-solutions/, Footer, FloatingConnect, ToastContext, globals.css |

---

## 5. Success Criteria

- [ ] `/auth/*` 라우트 0개
- [ ] `/portal/*` 라우트 0개
- [ ] `useTranslations` import 0건
- [ ] `useAuth` import 0건
- [ ] `LanguageProvider` import 0건
- [ ] `AuthProvider` import 0건
- [ ] `ko.json`, `kr.json` 파일 없음
- [ ] `npm run build` 성공
- [ ] 남은 라우트: `/`, `/company`, `/services`, `/network-solutions`
- [ ] Contact 폼 작동 (인증 없이)
