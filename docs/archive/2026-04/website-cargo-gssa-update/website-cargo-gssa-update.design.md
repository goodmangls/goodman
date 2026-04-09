# Website Cargo GSSA Update Design Document

> **Summary**: 화물 전문 GSSA 정체성에 맞는 웹사이트 콘텐츠 업데이트 상세 설계
>
> **Project**: goodman-gls
> **Author**: Jaehong
> **Date**: 2026-04-09
> **Status**: Draft
> **Plan Reference**: `docs/01-plan/features/website-cargo-gssa-update.plan.md`

---

## 1. Implementation Overview

콘텐츠 업데이트 작업으로, 코드 구조 변경 없이 **데이터/텍스트 수정**만 수행한다.
수정 대상은 크게 3가지: (1) 컴포넌트 내 하드코딩 값, (2) i18n 번역 파일, (3) SEO 메타데이터.

---

## 2. Change Specification

### 2.1 StatsSection.tsx — 카운터 값 수정

**File**: `src/components/StatsSection.tsx:42-45`

```diff
- { value: 20, suffix: '+', label: t('years'), key: 'years' }
- { value: 15, suffix: '+', label: t('airlines'), key: 'airlines' }
- { value: 50, suffix: '+', label: t('countries'), key: 'countries' }
- { value: 24, suffix: 'hr', label: t('response'), key: 'response' }
+ { value: 10, suffix: '+', label: t('years'), key: 'years' }
+ { value: 5, suffix: '', label: t('airlines'), key: 'airlines' }
+ { value: 59, suffix: '', label: t('countries'), key: 'countries' }
+ { value: 3, suffix: '', label: t('offices'), key: 'offices' }
```

**Rationale**: 
- 10+ years (설립 2014), 5 airlines (3 GSA + 2 CSA), 59 countries (ECS Group), 3 offices (Seoul/Incheon/Busan)
- "24hr response" → "3 offices"로 변경 — 더 구체적이고 검증 가능한 수치

### 2.2 Footer.tsx — 설립연도 수정

**File**: `src/components/Footer.tsx`

```diff
# Line 52 (template string)
- "since 2004"
+ "since 2014"

# Line 163 (JSX)
- "Member since 2004"
+ "Member since 2014"
```

### 2.3 GSASection.tsx — 항공사 포트폴리오 축소

**File**: `src/components/GSASection.tsx:10`

```diff
- const partnerKeys = ['ws', 'o3', 'bx', 'mo', 'yp', '2c', 'am', 'de', 'tw', 'we', 'jx', 'ke', 'ua', '5y', 'm7'];
+ const partnerKeys = ['ws', 'o3', 'bx', 'mo', 'su'];
```

**Note**: 5개 항공사만 유지 — WestJet(ws), ShunFeng(o3), Air Busan(bx), Aero Mongolia(mo), Aeroflot(su)

### 2.4 layout.tsx — SEO 메타데이터 수정

**File**: `src/app/layout.tsx:19-21`

```diff
- "GOODMAN GLS - Your Strategic Partner in Korea & Beyond"
+ "GOODMAN GLS - Korea's Cargo GSSA | Airline Cargo Sales Agent"

- "As members of MPL and EAN networks, GOODMAN GLS delivers time-critical logistics solutions..."
+ "Founded in 2014, Goodman GLS is a leading cargo GSSA in Korea. Strategic partner of ECS Group — the world's largest GSSA network spanning 59 countries."

- "GSSA, GSA, CSA, airline cargo sales agent, Korea logistics, air freight, ocean freight, MPL, EAN, cargo"
+ "cargo GSSA, GSA, CSA, airline cargo sales agent, Korea GSSA, air cargo, ECS Group, MPL, EAN, WestJet Cargo, ShunFeng Airlines, Air Busan"
```

---

## 3. i18n Translation Updates

### 3.1 messages/en.json — 주요 변경

| Key Path | Current | New |
|----------|---------|-----|
| `hero.badge` (line 12) | "Korea's GSSA Specialist Since 2004" | "Korea's Cargo GSSA Specialist Since 2014" |
| `hero.subtitle` (line 14) | "Est. 2004 GSSA Specialist \| MPL & EAN Member..." | "Est. 2014 Cargo GSSA \| ECS Group Partner \| MPL & EAN Member" |
| `hero.cta.badge` (line 34) | "GSSA Specialist Since 2004" | "Cargo GSSA Since 2014" |
| `hero.cta.subtitle` (line 38) | "15+ airlines. 50+ countries..." | "5 airlines. 59 countries via ECS Group. One dedicated cargo team in Korea." |
| `whyGssa.description` (line 72) | "20+ years of track record..." | "10+ years of track record in Korea, with leadership bringing 38+ years of airline cargo experience." |
| `footer.tagline` (line 171) | "...since 2004." | "...since 2014." |
| `stats.airlines` | (label for airlines) | Update label if needed: "Airlines (3 GSA + 2 CSA)" or keep "Airlines" |
| `stats.countries` | (label for countries) | Update label: "Countries (via ECS Group)" or keep "Countries" |
| `stats.response` → `stats.offices` | "Response Time" | "Offices" |

### 3.2 messages/ko.json — 병렬 변경

en.json과 동일한 키에 대해 한국어 번역 적용:

| Key | New (KO) |
|-----|----------|
| `hero.badge` | "2014년 설립 한국 화물 전문 GSSA" |
| `hero.subtitle` | "2014년 설립 화물 GSSA \| ECS Group 파트너 \| MPL & EAN 회원" |
| `hero.cta.subtitle` | "5개 항공사. ECS Group 59개국 네트워크. 한국 전담 화물 팀." |
| `whyGssa.description` | "한국에서 10년 이상의 실적, 리더십은 38년 이상의 항공화물 경력 보유." |
| `footer.tagline` | "...2014년부터." |
| `stats.offices` | "오피스" |

### 3.3 src/content/en.json & kr.json — Stats 데이터

```diff
# en.json stats
- "20+"  → "10+"
- "50+"  → "59"
- labels update if applicable

# kr.json parallel changes
```

### 3.4 Airline Partner i18n Keys — 축소

**제거할 키** (en.json/ko.json): `partners.yp`, `partners.2c`, `partners.am`, `partners.de`, `partners.tw`, `partners.we`, `partners.jx`, `partners.ke`, `partners.ua`, `partners.5y`, `partners.m7`

**추가할 키**: `partners.su` (Aeroflot — 현재 없으면 추가)

**유지할 키**: `partners.ws`, `partners.o3`, `partners.bx`, `partners.mo`

---

## 4. Passenger GSSA 표현 삭제 검증

grep으로 다음 패턴을 검색하여 0건 확인:
```bash
grep -rni "passenger.*gssa\|pax.*gssa\|여객.*gssa" src/ messages/
```

현재 코드에서 여객 GSSA 직접 표현은 없으나, 여객 항공사(Air Premia, T'way 등) 파트너 데이터가 있으면 제거한다.

---

## 5. Implementation Order

```
Step 1: StatsSection.tsx 카운터 값 수정 (10+, 5, 59, 3)
Step 2: Footer.tsx 설립연도 2004 → 2014
Step 3: GSASection.tsx 항공사 포트폴리오 5개로 축소
Step 4: messages/en.json 번역 키 업데이트
Step 5: messages/ko.json 번역 키 동기화
Step 6: src/content/en.json & kr.json stats 데이터 수정
Step 7: layout.tsx SEO 메타데이터 수정
Step 8: 불필요한 항공사 i18n 키 정리
Step 9: npm run build 검증
Step 10: npm run lint 검증
```

---

## 6. Verification Checklist

### 6.1 Data Consistency Check

```bash
# 2004 잔존 확인 (0건이어야 함)
grep -rn "2004" src/ messages/ --include="*.tsx" --include="*.json"

# 15+ airlines 잔존 확인 (0건이어야 함)
grep -rn "15+" src/ messages/ --include="*.tsx" --include="*.json"

# 20+ years 잔존 확인 (0건이어야 함)
grep -rn "20+" src/ messages/ --include="*.tsx" --include="*.json"

# 여객 GSSA 표현 확인 (0건이어야 함)
grep -rni "passenger.*gssa\|pax.*gssa" src/ messages/
```

### 6.2 Build & Lint

```bash
cd /Users/jaehong/Developer/Projects/goodman-gls
npm run build   # 빌드 성공
npm run lint    # 린트 통과
```

### 6.3 Visual Check (수동)

- [ ] 랜딩페이지 Stats 섹션 카운터 (10+, 5, 59, 3)
- [ ] Footer "since 2014"
- [ ] GSA 섹션 항공사 5개만 표시
- [ ] 모바일 반응형 확인

---

## 7. Files Summary

| # | File | Change Type | Description |
|---|------|-------------|-------------|
| 1 | `src/components/StatsSection.tsx` | Edit | 카운터 값 4개 수정 |
| 2 | `src/components/Footer.tsx` | Edit | "2004" → "2014" (2곳) |
| 3 | `src/components/GSASection.tsx` | Edit | partnerKeys 15개 → 5개 |
| 4 | `src/app/layout.tsx` | Edit | SEO 메타데이터 3줄 수정 |
| 5 | `messages/en.json` | Edit | 번역 키 ~15개 수정 + 10개 삭제 |
| 6 | `messages/ko.json` | Edit | 병렬 번역 키 수정 |
| 7 | `src/content/en.json` | Edit | stats 데이터 수정 |
| 8 | `src/content/kr.json` | Edit | stats 데이터 수정 |

**총 8개 파일**, 코드 구조 변경 없음.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-04-09 | Initial design | Jaehong |
