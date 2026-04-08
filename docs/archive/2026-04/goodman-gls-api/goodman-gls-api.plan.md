# Plan: goodman-gls-api

> Goodman GLS Rails 8 API 백엔드 — Next.js API Routes에서 마이그레이션

## 1. 배경 & 목적

### 현재 상태
- Next.js API Routes (`src/app/api/`)로 인증, 견적, 문의 처리
- Prisma + PostgreSQL (스키마 정의됨, 5 모델 + 4 enum)
- NextAuth.js (next-auth v5 beta) 기반 인증
- Resend 이메일 서비스

### 전환 이유
- smart-quote 프로젝트와 동일한 아키텍처 통일 (Rails API + React 프론트)
- API 로직과 프론트엔드 분리 → 독립 배포/스케일링
- Rails의 성숙한 ORM (ActiveRecord), 마이그레이션, 테스트 생태계 활용
- 향후 Shipment Tracking, Admin Portal 등 복잡한 비즈니스 로직에 적합

## 2. 마이그레이션 대상

### 2.1 데이터 모델 (Prisma → ActiveRecord)

| Prisma Model | Rails Model | 비고 |
|-------------|-------------|------|
| User | User | `has_secure_password`, role/status enum |
| Company | Company | `belongs_to :user` |
| QuoteRequest | QuoteRequest | guest 필드 포함 |
| Account | — | NextAuth 전용 → JWT로 대체 |
| Session | — | NextAuth 전용 → JWT로 대체 |
| VerificationToken | — | 이메일 인증 토큰 → Rails에서 자체 구현 |

### 2.2 API Endpoints (Next.js → Rails)

| 현재 (Next.js) | Rails | 설명 |
|---------------|-------|------|
| `api/auth/[...nextauth]` | `POST /api/v1/auth/login` | JWT 로그인 |
| `api/auth/register` | `POST /api/v1/auth/register` | 회원가입 |
| `api/auth/verify-email` | `POST /api/v1/auth/verify-email` | 이메일 인증 |
| `api/auth/forgot-password` | `POST /api/v1/auth/forgot-password` | 비밀번호 재설정 요청 |
| `api/auth/reset-password` | `POST /api/v1/auth/reset-password` | 비밀번호 재설정 |
| `api/contact` | `POST /api/v1/contact` | 문의 폼 (이메일 발송) |
| `api/quotes` | `CRUD /api/v1/quotes` | 견적 요청 |
| `api/quotes/public` | `POST /api/v1/quotes/public` | 게스트 견적 요청 |
| `api/quotes/[id]` | `GET/PATCH /api/v1/quotes/:id` | 견적 상세/수정 |

### 2.3 인증 방식 변경

| 항목 | Before (NextAuth) | After (Rails JWT) |
|------|------------------|-------------------|
| 인증 | NextAuth v5 (session 기반) | JWT (access + refresh token) |
| 토큰 저장 | cookie (httpOnly) | access: memory, refresh: localStorage |
| 세션 유지 | NextAuth session | 15분 access + 7일 refresh |
| 비밀번호 | bcryptjs | bcrypt (Ruby) |

## 3. Rails API 구조

```
goodman-gls-api/                    # 서브디렉토리 (smart-quote 패턴)
  app/
    models/
      user.rb                       # has_secure_password, role/status enum
      company.rb                    # belongs_to :user
      quote_request.rb              # guest 지원
      contact_message.rb            # 문의 기록
    controllers/
      application_controller.rb     # CORS, error handling
      api/v1/
        auth_controller.rb          # login, register, verify, forgot/reset password
        quotes_controller.rb        # CRUD + public guest endpoint
        contact_controller.rb       # 문의 폼 → 이메일 발송
        companies_controller.rb     # 회사 정보 CRUD
        users_controller.rb         # Admin: 사용자 관리
    controllers/concerns/
      jwt_authenticatable.rb        # JWT encode/decode (smart-quote 패턴 재사용)
    mailers/
      user_mailer.rb                # 이메일 인증, 비밀번호 재설정
      contact_mailer.rb             # 문의 알림
  config/
    initializers/cors.rb            # Rack::Cors
  db/
    migrate/                        # ActiveRecord 마이그레이션
    seeds.rb                        # Admin 유저 시드
```

## 4. 구현 순서

```
Phase 1: Rails API 프로젝트 생성 (1일)
├── rails new goodman-gls-api --api --database=postgresql
├── Gemfile 설정 (bcrypt, jwt, rack-cors, kaminari)
├── DB 마이그레이션 (Prisma 스키마 → ActiveRecord)
├── JWT 인증 concern (smart-quote에서 복사/수정)
└── CORS 설정

Phase 2: 인증 API (1일)
├── AuthController (login, register, refresh, verify-email)
├── UserMailer (인증 이메일, 비밀번호 재설정)
├── User 모델 (has_secure_password, validations)
└── RSpec 테스트

Phase 3: 비즈니스 API (1일)
├── QuotesController (CRUD + public guest endpoint)
├── ContactController (이메일 발송)
├── CompaniesController (회사 정보)
└── Admin: UsersController

Phase 4: 프론트엔드 전환 (1일)
├── NextAuth 제거 → JWT AuthContext (smart-quote 패턴)
├── API 클라이언트 수정 (VITE_API_URL → Rails)
├── Next.js API Routes 삭제
├── Prisma 제거
└── E2E 테스트

Phase 5: 배포 (0.5일)
├── Render.com 배포 (Docker, PostgreSQL)
├── render.yaml 작성
├── Vercel 환경변수 업데이트
└── 도메인 연결 확인
```

## 5. 기술 결정

| 결정 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Rails 8 API-only | smart-quote와 통일, 성숙한 생태계 |
| DB | PostgreSQL | 기존과 동일 |
| 인증 | JWT (bcrypt + jwt gem) | smart-quote 패턴 검증 완료 |
| 이메일 | Action Mailer + SendGrid | Resend보다 Rails 통합 우수 |
| 배포 | Render.com (Docker) | smart-quote와 동일 인프라 |
| Ruby 버전 | 3.4.5 | 로컬 설치 버전과 일치 |

## 6. 리스크

| 리스크 | 대응 |
|--------|------|
| NextAuth → JWT 전환 시 기존 세션 무효화 | 유지보수 기간 안내, 재로그인 유도 |
| Prisma 데이터 마이그레이션 | DB가 아직 초기 상태 → 새로 생성 |
| Render Free Tier 제한 | smart-quote-emax에서 학습한 교훈 적용 (유료 검토) |
| 이메일 서비스 변경 (Resend → SendGrid) | SendGrid 무료 100건/일 충분 |

## 7. 성공 기준

- [ ] Rails API에서 회원가입/로그인/이메일 인증 동작
- [ ] 견적 요청 CRUD (인증 + 게스트 모두)
- [ ] 문의 폼 이메일 발송
- [ ] 프론트엔드에서 Next.js API Routes 완전 제거
- [ ] Prisma 의존성 제거
- [ ] Render 배포 + Vercel 연동 정상

---

**작성일**: 2026-04-08
**예상 기간**: 4.5일
**참조**: smart-quote-emax/smart-quote-api (동일 패턴)
