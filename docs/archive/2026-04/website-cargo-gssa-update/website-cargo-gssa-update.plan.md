# Website Cargo GSSA Update Planning Document

> **Summary**: EgyptAir GSSA Proposal 기반 웹사이트 전체 콘텐츠를 화물 전문 GSSA 정체성에 맞게 업데이트
>
> **Project**: goodman-gls
> **Author**: Jaehong
> **Date**: 2026-04-09
> **Status**: Draft

---

## 1. Overview

### 1.1 Purpose

EgyptAir Cargo GSSA Proposal (v6, 2026-03-26)에서 확인된 최신 회사 정보를 웹사이트에 반영하고, "화물 전문 GSSA" 정체성을 모든 페이지에 일관되게 적용한다.

### 1.2 Background

- copy.md에 EgyptAir Proposal 데이터를 정리 완료 (2026-04-09)
- 현재 웹사이트에 부정확한 데이터 존재 (설립연도, 항공사 수, 여객 GSSA 표현 등)
- 화물(Cargo) 전문 GSSA임에도 여객 관련 표현이 일부 남아있음

### 1.3 Related Documents

- Source: `copy.md` (EgyptAir Proposal 기반 업데이트 완료)
- Source PDF: EgyptAir Cargo GSSA Proposal v6 (2026-03-26)
- Memory: `project_goodman_gls_identity.md` — 화물 전문 GSSA 정체성

---

## 2. Scope

### 2.1 In Scope

- [ ] 설립연도 2004 → **2014** 전체 수정
- [ ] 항공사 수 "15+" → **"5 (3 GSA + 2 CSA)"** 수정
- [ ] "20+ years" → **"10+ years"** 수정
- [ ] ECS Group 파트너십 정보 추가 (59개국, 181사무소, 1,794명, EUR 1.2B)
- [ ] 리더십 팀 섹션 추가/업데이트 (CEO 38+ yr, COO, Director)
- [ ] 항공사 포트폴리오 업데이트 (5개 항공사 + 노선 상세)
- [ ] 한국 항공화물 시장 데이터 반영 (ICN 2.95M tons, +9.9%)
- [ ] 한국 수출 산업 섹션 추가 (반도체, 자동차, K-Beauty)
- [ ] 여객 GSSA 관련 표현 전부 삭제
- [ ] i18n 번역 파일 동기화 (en.json, ko.json)
- [ ] 3개 사업체 정보 추가 (GGL, Globe Air Cargo Korea, Goodman Aer Solutions)
- [ ] GSSA 서비스 범위 명확화 (Sales Representation + Operational Support)

### 2.2 Out of Scope

- 새로운 페이지 추가 (기존 페이지 내 콘텐츠 수정만)
- 백엔드 API 변경
- 디자인 시스템/테마 변경
- 파트너 포털 기능 변경

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | HeroSection: 설립연도 2014, 항공사 5개로 수정 | High | Pending |
| FR-02 | StatsSection: 카운터 값 업데이트 (10+ yr, 5 airlines, 59 countries, 3 offices) | High | Pending |
| FR-03 | GSASection: 항공사 포트폴리오 5개로 업데이트 + 노선 상세 | High | Pending |
| FR-04 | WhyGSSASection: 서비스 필러 업데이트 + ECS Group 정보 | High | Pending |
| FR-05 | CompanySection: 설립 2014, ECS 파트너십, 리더십 팀 | Medium | Pending |
| FR-06 | Footer: "Since 2014" 수정 | Medium | Pending |
| FR-07 | i18n: en.json, ko.json 번역 키 동기화 | High | Pending |
| FR-08 | 여객 GSSA 표현 전체 삭제 | High | Pending |
| FR-09 | GSSA 서비스 범위 (Sales + Operations) 반영 | Medium | Pending |
| FR-10 | Korean market data 섹션 (StatsSection 또는 별도) | Low | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Consistency | 모든 페이지에서 동일한 수치 사용 | grep 검색 |
| i18n | EN/KO 번역 키 100% 동기화 | 빌드 시 검증 |
| Build | npm run build 성공 | CI |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 모든 FR 항목 구현 완료
- [ ] "2004" 문자열 프로젝트 내 0건
- [ ] "15+ airlines" 또는 "15개 항공사" 문자열 0건
- [ ] "20+ years" 또는 "20년" 문자열 0건
- [ ] 여객 GSSA 관련 표현 0건
- [ ] en.json / ko.json 번역 키 동기화 100%
- [ ] npm run build 성공
- [ ] npm run lint 통과

### 4.2 Quality Criteria

- [ ] 빌드 성공
- [ ] Lint 오류 0건
- [ ] 모바일/데스크탑 반응형 확인

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 번역 키 누락 | Medium | Medium | en.json/ko.json diff 비교 |
| SEO 메타데이터 미반영 | Low | Low | layout.tsx, page.tsx 메타 확인 |
| 캐시된 구 데이터 표시 | Low | Low | Vercel 재배포 후 캐시 퍼지 |

---

## 6. Architecture Considerations

### 6.1 Project Level Selection

| Level | Characteristics | Recommended For | Selected |
|-------|-----------------|-----------------|:--------:|
| **Starter** | Simple structure | Static sites | ☒ |
| **Dynamic** | Feature-based modules | Web apps with backend | ☐ |
| **Enterprise** | Strict layer separation | High-traffic systems | ☐ |

> 콘텐츠 업데이트 작업이므로 Starter 수준 — 컴포넌트 내 텍스트/데이터 수정 위주

### 6.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js 16 (App Router) | 기존 스택 유지 |
| i18n | next-intl (messages/en.json, ko.json) | 기존 방식 유지 |
| Styling | Tailwind CSS v4 | 기존 스택 유지 |

---

## 7. Convention Prerequisites

### 7.1 Existing Project Conventions

- [x] `CLAUDE.md` has coding conventions section
- [x] ESLint configuration (`eslint.config.mjs`)
- [x] TypeScript configuration (`tsconfig.json`)
- [x] i18n files (`messages/en.json`, `messages/ko.json`)

---

## 8. Affected Files (Estimated)

| File | Change Type | Description |
|------|-------------|-------------|
| `src/components/HeroSection.tsx` | Edit | 설립연도, 항공사 수, 서브헤드라인 |
| `src/components/StatsSection.tsx` | Edit | 카운터 값 (10+, 5, 59, 3) |
| `src/components/GSASection.tsx` | Edit | 항공사 포트폴리오 데이터 |
| `src/components/WhyGSSASection.tsx` | Edit | 서비스 필러 + ECS Group |
| `src/components/CompanySection.tsx` | Edit | 설립연도, ECS 파트너십, 리더십 |
| `src/components/Footer.tsx` | Edit | "Since 2014" |
| `src/components/ServicesShowcase.tsx` | Edit | GSSA 서비스 범위 |
| `messages/en.json` | Edit | 번역 키 업데이트 |
| `messages/ko.json` | Edit | 번역 키 업데이트 |
| `src/content/en.json` | Edit | 콘텐츠 데이터 (있는 경우) |
| `src/content/kr.json` | Edit | 콘텐츠 데이터 (있는 경우) |
| `src/app/layout.tsx` | Edit | SEO 메타데이터 |

---

## 9. Next Steps

1. [ ] Write design document (`website-cargo-gssa-update.design.md`)
2. [ ] Review and approval
3. [ ] Start implementation

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-09 | Initial draft | Jaehong |
