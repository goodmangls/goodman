---
template: design
version: 0.1
feature: goodman-gls-nav-i18n
date: 2026-05-30
author: jhlim725
project: goodman-gls
project_version: 0.1.0
plan: docs/01-plan/features/goodman-gls-nav-i18n.plan.md
---

# goodman-gls-nav-i18n Design Document

> **Summary**: Plan v0.1 의 FR 6건을 Navigation/ContactSection/messages 4개 파일에 청사진으로 매핑. Open Question 4건 전부 확정. ko 한국어 카피 baseline + 전체 key map enumerate.
>
> **Plan**: v0.1 (2026-05-30)
> **Status**: Draft v0.1

---

## 1. Open Question Resolutions

| # | Question | Resolution | Method |
|---|----------|------------|--------|
| **Q1** | en.json `nav.contact` stale 처분 | **삭제** + 신규 5키로 전면 교체 | `grep -rEn "nav\.(contact\|home\|networkSolutions\|partnerHub)" src/` → 0 매치. 어디서도 `t('nav.*')` 호출 없음 (전부 신규 도입) |
| **Q2** | 한국어 CTA 톤 | **`Contact sales` → `문의하기`** / **`Get started` → `시작하기`** | 사용자 결정 (2026-05-30) — 건조한 B2B 톤, 명료감 우선. "영업팀 문의/지금 시작" 은 공격적, "상담 신청/도입 문의" 는 무거움. |
| **Q3** | aria-labelledby 다른 섹션 동시 적용 | **본 사이클 OOS 유지** | 후속 사이클 후보 `sectional-i18n-rollout` 에서 패턴 spec 으로 일괄 적용. ContactSection 한 곳에서 정책 baseline 만 확립 |
| **Q4** | `<html lang>` 동기화 | **추가 작업 불요** | `src/app/layout.tsx:37` 이미 `<html lang="en" suppressHydrationWarning>` → LanguageContext 의 `document.documentElement.lang` 동적 변경과 충돌 0 |

추가 발견 (Plan R-3 확인):
- **DisplayLines 컴포넌트 `id` prop 미지원** (`src/components/DisplayLines.tsx:1-22`). FR-5 적용 위해 `id?: string` prop 추가 1줄 변경 필요 — Do §5.1 에 명시.

---

## 2. Message Key Map

### 2.1 en.json — `nav` 트리 전면 교체

```diff
 {
   "nav": {
-    "home": "Home",
-    "networkSolutions": "Network & Solutions",
+    "company": "Company",
     "services": "Services",
-    "partnerHub": "Partner Hub",
-    "company": "Company",
-    "contact": "Contact"
+    "network": "Network",
+    "contactSales": "Contact sales",
+    "getStarted": "Get started"
   },
   ...
 }
```

> **Note**: `company` 키 위치만 이동 (값 동일). 의미상 nav 의 1번째라 첫 자리로.

### 2.2 en.json — `contact` 트리 신규

```json
"contact": {
  "eyebrow": "Connect",
  "headingLine1": "Let's talk about",
  "headingLine2": "your cargo.",
  "lead": "24/7 support for your logistics needs. We represent your brand in Korea with technical precision.",
  "info": {
    "officeLabel": "Office",
    "officeValue": "Gangseo IT Valley, Seoul, South Korea",
    "emailLabel": "Email",
    "emailValue": "contact@goodmangls.com",
    "hoursLabel": "Hours",
    "hoursValue": "Mon–Fri 9:00–18:00 KST"
  },
  "form": {
    "nameLabel": "Name",
    "namePlaceholder": "Enter your name",
    "emailLabel": "Email",
    "emailPlaceholder": "Enter your email",
    "messageLabel": "Message",
    "messagePlaceholder": "Tell us about your requirements",
    "submitIdle": "Send message",
    "submitSending": "Sending...",
    "successAlert": "Message sent successfully.",
    "errorAlert": "Failed to send message. Please try again."
  }
}
```

> **Caveat**: `headingLine1/2` 는 DisplayLines `lines` prop 구조 (`string[]`) 와 매핑 — `[t('contact.headingLine1'), t('contact.headingLine2')]` 형태.

### 2.3 ko.json — `nav` 트리 신규

```json
"nav": {
  "company": "회사",
  "services": "서비스",
  "network": "네트워크",
  "contactSales": "문의하기",
  "getStarted": "시작하기"
}
```

### 2.4 ko.json — `contact` 트리 신규 (직역 baseline, 마케팅 톤 검토는 별도 사이클)

```json
"contact": {
  "eyebrow": "연결",
  "headingLine1": "고객님의 화물에",
  "headingLine2": "대해 이야기합시다.",
  "lead": "물류 운영을 위한 24시간 지원. 기술적 정밀성으로 한국에서 고객님의 브랜드를 대변합니다.",
  "info": {
    "officeLabel": "사무실",
    "officeValue": "강서 IT 밸리, 서울",
    "emailLabel": "이메일",
    "emailValue": "contact@goodmangls.com",
    "hoursLabel": "업무 시간",
    "hoursValue": "월–금 9:00–18:00 KST"
  },
  "form": {
    "nameLabel": "이름",
    "namePlaceholder": "이름을 입력하세요",
    "emailLabel": "이메일",
    "emailPlaceholder": "이메일을 입력하세요",
    "messageLabel": "메시지",
    "messagePlaceholder": "필요한 사항을 알려주세요",
    "submitIdle": "메시지 보내기",
    "submitSending": "전송 중...",
    "successAlert": "메시지가 성공적으로 전송되었습니다.",
    "errorAlert": "메시지 전송에 실패했습니다. 다시 시도해 주세요."
  }
}
```

> **Note**: `officeValue` / `emailValue` / `hoursValue` 는 i18n key 로 분리해도 값 자체는 거의 동일하나 (이메일·KST 는 universal), 정책 일관성 — "표시되는 모든 문자열은 t() 경유" — 을 위해 키화. 후속 마케팅 사이클에서 카피 다듬을 때 단일 진입점 확보.

> **Baseline 기대치**: 위 ko 카피는 직역 baseline 으로, **정확성 우선 / 유려함 차순**. 어순·연결어 자연스러움·B2B 카피 톤(예: "고객님" vs "귀사", "이야기합시다" vs "상의해 보세요") 은 후속 `marketing-copy-ko-review` 사이클에서 다듬는다. 본 사이클은 "한국어 사용자에게 영어가 노출되지 않는" 최소 baseline 을 달성하는 게 목표.

---

## 3. Algorithm / Flow

### 3.1 t() Lookup 동작 (확인용, 변경 없음)

`src/lib/i18n-messages.ts`:
- `getMessage(tree, key)`: dot-separated path 를 reduce 로 순회 → string 발견 시 반환, 아니면 key 자체 반환 (폴백)
- `messages.ko = deepMerge(en, koOverrides)` — ko 에 키 없으면 en fallback
- `LanguageContext.t(key)` → `getMessage(messages[locale], key)`

### 3.2 변경 후 렌더 흐름

```
locale=en:
  t('nav.company')          → "Company"
  t('contact.form.submitIdle') → "Send message"

locale=ko:
  t('nav.company')          → "회사"  (ko override)
  t('contact.form.submitIdle') → "메시지 보내기"  (ko override)
  t('nonexistent.key')      → "nonexistent.key"  (폴백 → 시각적으로 즉시 발견)
```

---

## 4. File Diff Plan

### 4.1 `messages/en.json` (atomic edit)

- `nav` 객체 전면 교체 (6키 → 5키, 의미 정정)
- `contact` 객체 신규 (eyebrow / headingLine1·2 / lead / info.{6키} / form.{10키}, 총 19키)
- LOC delta: +30 / -6

### 4.2 `messages/ko.json` (atomic edit)

- 최상위에 `nav` 신규 객체
- 최상위에 `contact` 신규 객체
- LOC delta: +30 / -0

### 4.3 `src/components/DisplayLines.tsx` (1-line edit)

```diff
 type DisplayLinesProps = {
   lines: string[];
   as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
   className?: string;
+  id?: string;
 };

 export default function DisplayLines({
   lines,
   as: Tag = 'h1',
   className,
+  id,
 }: DisplayLinesProps) {
   return (
-    <Tag className={className}>
+    <Tag className={className} id={id}>
       {lines.map((line, index) => (
         <span key={index} className="block">
           {line}
         </span>
       ))}
     </Tag>
   );
 }
```

LOC delta: +3 / -1

> **Why `id` prop**: ContactSection 이 `<section aria-labelledby="contact-heading">` 를 적용하려면 동일 `id` 가 실제 heading 엘리먼트(h2) 에 있어야 함. DisplayLines 가 h2 를 렌더하므로 `id` 를 prop 으로 받아 그대로 Tag 에 전달. wrapper div 에 id 부여는 a11y 시맨틱이 약함 (heading 자체가 식별되어야 screen reader 의 region 점프가 올바르게 동작).

### 4.4 `src/components/Navigation.tsx`

청사진:
- `import { useLanguage } from '@/contexts/LanguageContext';` 추가 (이미 `type Locale` import 만 → 함수 추가)
- 최상위 `Navigation()` 안에 `const { t } = useLanguage();`
- `navItems` 상수 → `useMemo` 또는 함수 안 inline 으로 t() 호출 (locale 변경 시 재렌더 보장)
- 데스크탑 CTA `Contact sales` → `{t('nav.contactSales')}`
- 데스크탑 CTA `Get started` → `{t('nav.getStarted')}`
- 모바일 CTA 2개 동일 교체
- `<nav>` 에 `aria-label="Primary"` 추가
- `aria-label` 의 menu open/close 텍스트는 일단 영어 유지 (스크린 리더 전용, 후속 사이클에서 일괄)

```diff
 export default function Navigation() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const pathname = usePathname();
+  const { t } = useLanguage();
   const isHome = pathname === '/';
   ...

-  const navItems = [
-    { label: 'Company', href: '/company' },
-    { label: 'Services', href: '/services' },
-    { label: 'Network', href: '/network' },
-  ];
+  const navItems = [
+    { key: 'company', href: '/company' },
+    { key: 'services', href: '/services' },
+    { key: 'network', href: '/network' },
+  ] as const;

   return (
     <>
       <nav
+        aria-label="Primary"
         className={`fixed top-0 left-0 right-0 z-50 ...`}
       >
         ...
         {navItems.map((item) => (
-          <Link key={item.label} href={item.href} className={linkClass}>
-            {item.label}
+          <Link key={item.key} href={item.href} className={linkClass}>
+            {t(`nav.${item.key}`)}
           </Link>
         ))}
         ...
-        <Link href="#contact" ...>Contact sales</Link>
-        <Link href="#contact" className="btn-pill-primary">Get started</Link>
+        <Link href="#contact" ...>{t('nav.contactSales')}</Link>
+        <Link href="#contact" className="btn-pill-primary">{t('nav.getStarted')}</Link>
         ...
```

LOC delta: +6 / -6 (대부분 동등 치환)

> **Note**: `navItems` 가 컴포넌트 외부 모듈 상수였던 게 `useLanguage()` 의존성 때문에 함수 내부로 이동. 재렌더 비용 미미 (3 entries).

### 4.5 `src/components/ContactSection.tsx`

청사진:
- `import { useLanguage } from '@/contexts/LanguageContext';` 추가
- `const { t } = useLanguage();`
- `<section id="contact" aria-labelledby="contact-heading">` (FR-5)
- DisplayLines 에 `id="contact-heading"` prop 전달 (FR-5)
- 모든 표시 문자열 t() 경유 — eyebrow / lines / lead / 3 info 라벨+값 / 3 form 라벨+placeholder / 2 상태 알림 / submit 버튼 idle·sending

```diff
 export default function ContactSection() {
+  const { t } = useLanguage();
   const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
   ...

   return (
-    <section id="contact" className="bg-canvas section-spacing">
+    <section
+      id="contact"
+      aria-labelledby="contact-heading"
+      className="bg-canvas section-spacing"
+    >
       <div className="container-wide">
         <div className="grid ...">
           <div>
-            <p className="eyebrow mb-6">Connect</p>
+            <p className="eyebrow mb-6">{t('contact.eyebrow')}</p>
             <DisplayLines
               as="h2"
-              lines={["Let's talk about", 'your cargo.']}
+              id="contact-heading"
+              lines={[t('contact.headingLine1'), t('contact.headingLine2')]}
               className="display-lg text-ink mb-8"
             />
-            <p className="body-lg text-muted mb-12 max-w-xl">
-              24/7 support for your logistics needs. ...
-            </p>
+            <p className="body-lg text-muted mb-12 max-w-xl">{t('contact.lead')}</p>

             <div className="feature-stack max-w-md">
               <div className="feature-stack-item">
-                <h4 className="headline text-ink mb-1">Office</h4>
-                <p className="body-default text-muted">Gangseo IT Valley, Seoul, South Korea</p>
+                <h4 className="headline text-ink mb-1">{t('contact.info.officeLabel')}</h4>
+                <p className="body-default text-muted">{t('contact.info.officeValue')}</p>
               </div>
               ... (email, hours 동일 패턴)
             </div>
           </div>

           <div className="panel-bordered p-8 md:p-10 bg-surface-soft">
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label htmlFor="contact-name" className="body-sm font-bold mb-2 block text-ink">
-                  Name
+                  {t('contact.form.nameLabel')}
                 </label>
                 <input
                   ...
-                  placeholder="Enter your name"
+                  placeholder={t('contact.form.namePlaceholder')}
                 />
                 ...
               </div>
               ... (email, message 동일 패턴)

               <div className="pt-2">
                 {submitStatus === 'success' && (
                   <div className="...">
-                    Message sent successfully.
+                    {t('contact.form.successAlert')}
                   </div>
                 )}
                 {submitStatus === 'error' && (
                   <div className="...">
-                    Failed to send message. Please try again.
+                    {t('contact.form.errorAlert')}
                   </div>
                 )}
                 <button type="submit" disabled={isSubmitting} className="btn-pill-primary w-full justify-center">
-                  {isSubmitting ? 'Sending...' : 'Send message'}
+                  {isSubmitting ? t('contact.form.submitSending') : t('contact.form.submitIdle')}
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     </section>
   );
 }
```

LOC delta: +20 / -16 (placeholder/label/alert/button 문자열 치환)

---

## 5. Implementation Order

| Step | Action | Files | Time | Logical Commit |
|------|--------|-------|:----:|----------------|
| 5.1 | DisplayLines `id?` prop 추가 | DisplayLines.tsx | 2m | (Navigation 커밋에 합류) |
| 5.2 | en.json `nav` 정정 + `contact` 신규 | en.json | 5m | commit A |
| 5.3 | ko.json `nav` + `contact` 신규 | ko.json | 5m | commit A (atomic with 5.2) |
| 5.4 | Navigation.tsx t() 와이어링 + aria-label="Primary" | Navigation.tsx | 8m | commit B |
| 5.5 | ContactSection.tsx t() 와이어링 + aria-labelledby + DisplayLines id | ContactSection.tsx, DisplayLines.tsx | 12m | commit C |
| 5.6 | grep audit (FR-1·FR-2 검증) + lint + tsc + vitest + build | — | 8m | (검증) |

총 ~40m

---

## 6. Test Plan

### 6.1 Static Audit (자동, grep 기반 — 17 케이스 단위테스트 대신 채택)

> Plan §R-4 의 결정: i18n 누락은 17 테스트 비용 ROI 가 낮음. grep 자체 audit + build 로 충분.

```bash
# FR-1: Navigation 하드코딩 0
grep -E ">Company<|>Services<|>Network<|>Contact sales<|>Get started<" src/components/Navigation.tsx
# expected: no output (exit 1)

# FR-2: ContactSection 하드코딩 0
grep -E "Connect|Let's talk|24/7 support|Office|Email|Hours|Enter your|Tell us|Message sent|Failed to send|Send message|Sending" src/components/ContactSection.tsx
# expected: no output

# FR-3: en.json nav stale 0
grep -E '"home"|"networkSolutions"|"partnerHub"' messages/en.json
# expected: no output

# FR-4: ko.json nav/contact 존재
grep -c '"nav":\|"contact":' messages/ko.json
# expected: 2 (정확히 두 트리)

# FR-5: aria-labelledby + id
grep -c 'aria-labelledby="contact-heading"' src/components/ContactSection.tsx
grep -c 'id="contact-heading"' src/components/ContactSection.tsx
# expected: 각 1

# FR-6: nav aria-label
grep -c 'aria-label="Primary"' src/components/Navigation.tsx
# expected: 1
```

### 6.2 Build Verification

```bash
npm run lint        # 0 errors
npx tsc --noEmit    # 0 errors (DisplayLines prop 변경에 영향 없는지 확인)
npm run test:run    # 17/17 PASS (기존 api-guards 회귀 없음)
npm run build       # 7 routes (4 static + 3 dynamic), || true 마스킹 그대로
```

### 6.3 Browser Smoke (gstack /browse 또는 사용자 manual)

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | 홈 1440 viewport, locale=en | nav `Company/Services/Network/Contact sales/Get started` 영어 표시 |
| 2 | 헤더 LocaleToggle `ko` 클릭 | nav `회사/서비스/네트워크/문의하기/시작하기` 즉시 갱신 |
| 3 | 홈 anchor `#contact` 클릭 → ContactSection | ko: `연결` eyebrow + `고객님의 화물에 대해...` + 폼 라벨/플레이스홀더 한국어 |
| 4 | DevTools Elements → ContactSection | `<section id="contact" aria-labelledby="contact-heading">` + `<h2 id="contact-heading">` 존재 |
| 5 | DevTools → Navigation | `<nav aria-label="Primary">` 존재 |
| 6 | Lighthouse a11y (홈 1440 데스크탑) | 회귀 없음 (이전 점수 기준선 캡처 후 비교) |

---

## 7. Risks (Plan §5 갱신)

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | en.json `nav` stale 키 사용처 | **RESOLVED** (Q1 grep 0건) |
| R-2 | ko 카피 어색함 | direct translation baseline, 후속 마케팅 사이클로 위임 — 본 사이클 OOS |
| R-3 | DisplayLines id prop 미지원 | **RESOLVED** (§4.3 1줄 prop 추가 명시) |
| R-4 | t() 오타 폴백 | §6.1 grep audit 으로 발견 가능 — key 가 그대로 렌더되면 시각적으로 즉시 노출 |
| R-5 | SSR/CSR hydration mismatch | **RESOLVED** (Q4 — `suppressHydrationWarning` 이미 설정) |
| R-6 (신규) | LocaleToggle 클릭 시 t() 호출 재렌더 깊이 | Navigation·ContactSection 가 함수 컴포넌트 + context consumer — Context 값 변경 시 정상 재렌더. 측정 회귀 없음 (deepMerge 결과는 메모이즈 안 됨 but 트리 작아서 영향 미미) |

---

## 8. Out of Scope Carry-Forward (후속 사이클 후보)

| ID | Candidate Cycle | Scope |
|----|-----------------|-------|
| OOS-1 | `sectional-i18n-rollout` (P1) | 본 사이클 패턴을 Hero/Stats/WhyGSSA/GSA/ServicesShowcase/Network/PartnerHub/Company/NetworkManifesto/Footer/TrustBadges 11 컴포넌트에 동일 적용 + 각 섹션 `<section aria-labelledby>` |
| OOS-2 | `next-intl-native-migration` (P2) | `LanguageContext.t()` → `useTranslations` (next-intl 패키지 정식 훅) 마이그레이션 — 메시지 트리 구조 호환 |
| OOS-3 | `marketing-copy-ko-review` (P2) | ko 카피 직역 baseline 의 마케팅 톤 검토·다듬기 (사내 / 외부 카피라이터) |
| OOS-4 | `pages-route-i18n` (P1) | `/company`, `/services`, `/network` 라우트 내부 콘텐츠 i18n |

---

## 9. Success Criteria (Plan §8 그대로 + Design audit 추가)

- ✅ §6.1 grep audit 6 케이스 전부 expected (자동 검증)
- ✅ §6.2 lint/tsc/vitest/build 전부 통과
- ✅ §6.3 browser smoke 6 시나리오 manual 또는 /browse PASS
- ✅ Lighthouse a11y score 회귀 0
- ✅ Plan §8 6 항목 충족

---

## 10. Next Steps

1. `bkit:design-validator` 호출 → 90+ 기대 (Open Q 0 잔존, key map enumerate 완료, file diff plan 구체)
2. `/pdca do goodman-gls-nav-i18n` → §5 implementation order 실행
3. Do 단계 commit 구조: A (messages atomic) → B (Navigation) → C (ContactSection + DisplayLines) → 단일 PR squash
