# Design: goodman-gls-api

> Rails 8 API-only 백엔드 상세 설계 — Plan 기반

---

## 1. Database Schema (ActiveRecord Migrations)

### 1.1 users

```ruby
create_table :users do |t|
  t.string  :email,           null: false
  t.string  :password_digest, null: false
  t.string  :name
  t.string  :role,            null: false, default: 'partner'  # partner | airline | admin | super_admin
  t.string  :status,          null: false, default: 'pending'  # pending | active | suspended | inactive
  t.string  :email_verification_token
  t.datetime :email_verified_at
  t.string  :password_reset_token
  t.datetime :password_reset_sent_at
  t.string  :refresh_token_jti
  t.timestamps
end
add_index :users, 'LOWER(email)', unique: true, name: 'index_users_on_lower_email'
```

### 1.2 companies

```ruby
create_table :companies do |t|
  t.references :user, null: false, foreign_key: true, index: { unique: true }
  t.string  :name,         null: false
  t.string  :country,      null: false
  t.string  :city
  t.string  :address
  t.string  :phone
  t.string  :website
  t.string  :company_type, null: false  # freight_forwarder | shipper | airline | nvocc | customs_broker | other
  t.string  :iata_code
  t.boolean :wca_member,   default: false
  t.boolean :mpl_member,   default: false
  t.boolean :ean_member,   default: false
  t.timestamps
end
```

### 1.3 quote_requests

```ruby
create_table :quote_requests do |t|
  t.references :user, foreign_key: true
  t.references :company, foreign_key: true
  t.string  :reference_no                          # GQ-YYYY-NNNN (auto-generated)
  # Guest fields
  t.boolean :is_guest,      default: false
  t.string  :guest_name
  t.string  :guest_email
  t.string  :guest_company
  t.string  :guest_phone
  # Shipment details
  t.string  :service_type,  null: false             # air_freight | ocean_fcl | ocean_lcl | project_cargo
  t.string  :shipment_type, null: false             # import | export | cross_trade
  t.string  :origin,        null: false
  t.string  :destination,   null: false
  t.text    :cargo_details, null: false
  t.decimal :weight,        precision: 10, scale: 2
  t.string  :dimensions
  t.string  :commodity
  # Status & response
  t.string  :status,        null: false, default: 'pending'  # pending | quoted | accepted | expired | cancelled
  t.decimal :quoted_rate,   precision: 12, scale: 2
  t.string  :currency,      default: 'USD'
  t.datetime :valid_until
  t.text    :notes
  t.datetime :responded_at
  t.string  :responded_by
  t.timestamps
end
add_index :quote_requests, :reference_no, unique: true
add_index :quote_requests, :status
add_index :quote_requests, [:user_id, :created_at]
```

### 1.4 contact_messages

```ruby
create_table :contact_messages do |t|
  t.string :name,    null: false
  t.string :email,   null: false
  t.string :company
  t.string :phone
  t.string :subject
  t.text   :message, null: false
  t.string :status,  default: 'new'   # new | read | replied
  t.timestamps
end
```

---

## 2. Models

### User

```ruby
class User < ApplicationRecord
  has_secure_password
  has_one  :company, dependent: :destroy
  has_many :quote_requests, dependent: :nullify

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, inclusion: { in: %w[partner airline admin super_admin] }
  validates :status, inclusion: { in: %w[pending active suspended inactive] }
  validates :password, length: { minimum: 8 }, if: :password_required?

  before_save :downcase_email

  scope :active, -> { where(status: 'active') }
  scope :admins, -> { where(role: %w[admin super_admin]) }
end
```

### QuoteRequest

```ruby
class QuoteRequest < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :company, optional: true

  validates :service_type, inclusion: { in: %w[air_freight ocean_fcl ocean_lcl project_cargo] }
  validates :shipment_type, inclusion: { in: %w[import export cross_trade] }
  validates :origin, :destination, :cargo_details, presence: true

  # Guest validation
  validates :guest_name, :guest_email, presence: true, if: :is_guest?

  before_create :generate_reference_no

  scope :by_status, ->(s) { where(status: s) if s.present? }

  private

  def generate_reference_no
    year = Date.current.year
    last = QuoteRequest.where('reference_no LIKE ?', "GQ-#{year}-%").maximum(:reference_no)
    seq = last ? last.split('-').last.to_i + 1 : 1
    self.reference_no = format("GQ-%d-%04d", year, seq)
  end
end
```

---

## 3. Controllers & API Endpoints

### 3.1 Routes

```ruby
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Auth (public)
      post "auth/login",           to: "auth#login"
      post "auth/register",        to: "auth#register"
      post "auth/refresh",         to: "auth#refresh"
      post "auth/verify-email",    to: "auth#verify_email"
      post "auth/forgot-password", to: "auth#forgot_password"
      post "auth/reset-password",  to: "auth#reset_password"
      get  "auth/me",              to: "auth#me"

      # Quotes (authenticated + guest)
      resources :quotes, only: [:index, :show, :create, :update, :destroy]
      post "quotes/public", to: "quotes#create_public"   # Guest (no auth)

      # Contact (public)
      post "contact", to: "contact#create"

      # Companies (authenticated)
      resource :company, only: [:show, :create, :update]  # singular — user's own company

      # Admin
      resources :users, only: [:index, :update, :destroy]
    end
  end

  match '*path', to: 'application#set_cors_headers', via: :options
end
```

### 3.2 AuthController

```
POST /api/v1/auth/register
  Body: { email, password, password_confirmation, name }
  Response: { token, refresh_token, user }
  → 이메일 인증 메일 발송 (UserMailer.verification)
  → status: 'pending'

POST /api/v1/auth/login
  Body: { email, password }
  Response: { token, refresh_token, user }
  → status가 'pending'이면 로그인 거부 + 재발송 안내
  → status가 'suspended'/'inactive'이면 거부

POST /api/v1/auth/verify-email
  Body: { token }
  → email_verification_token 매칭 → status: 'active', email_verified_at 설정

POST /api/v1/auth/forgot-password
  Body: { email }
  → password_reset_token 생성, password_reset_sent_at 설정
  → UserMailer.password_reset 발송

POST /api/v1/auth/reset-password
  Body: { token, password, password_confirmation }
  → 토큰 매칭 + 2시간 이내 확인 → 비밀번호 변경

POST /api/v1/auth/refresh
  Body: { refresh_token }
  → Refresh token rotation (smart-quote 패턴)
```

### 3.3 QuotesController

```
GET    /api/v1/quotes          # 내 견적 목록 (admin: 전체)
POST   /api/v1/quotes          # 새 견적 요청 (인증 필수)
POST   /api/v1/quotes/public   # 게스트 견적 요청 (인증 불필요)
GET    /api/v1/quotes/:id      # 견적 상세
PATCH  /api/v1/quotes/:id      # 견적 수정 (status, notes, quoted_rate)
DELETE /api/v1/quotes/:id      # 견적 삭제 (admin only)
```

### 3.4 ContactController

```
POST /api/v1/contact
  Body: { name, email, company, phone, subject, message }
  → ContactMessage 저장 + ContactMailer 발송
  → Response: { success: true }
```

---

## 4. JWT Authentication (Concern)

smart-quote-emax에서 검증된 패턴 그대로 사용:

```ruby
module JwtAuthenticatable
  # Access token: 15분 만료
  # Refresh token: 7일 만료, jti rotation
  # Secret: ENV["SECRET_KEY_BASE"] 우선 (Render 안정성)

  def jwt_secret
    ENV["SECRET_KEY_BASE"] || Rails.application.credentials.secret_key_base || Rails.application.secret_key_base
  end
end
```

---

## 5. Mailers

### UserMailer

```ruby
class UserMailer < ApplicationMailer
  def verification(user)
    @user = user
    @verify_url = "#{ENV['FRONTEND_URL']}/auth/verify?token=#{user.email_verification_token}"
    mail(to: user.email, subject: 'Verify your email — GOODMAN GLS')
  end

  def password_reset(user)
    @user = user
    @reset_url = "#{ENV['FRONTEND_URL']}/auth/reset-password?token=#{user.password_reset_token}"
    mail(to: user.email, subject: 'Reset your password — GOODMAN GLS')
  end
end
```

### ContactMailer

```ruby
class ContactMailer < ApplicationMailer
  def notification(contact_message)
    @msg = contact_message
    mail(
      to: ENV.fetch('CONTACT_EMAIL_TO', 'info@goodmangls.com'),
      subject: "[GOODMAN GLS] New Contact: #{@msg.subject}"
    )
  end
end
```

---

## 6. Frontend Changes (Next.js)

### 6.1 제거 대상

| 파일/패키지 | 이유 |
|------------|------|
| `src/app/api/auth/` (전체) | Rails AuthController로 대체 |
| `src/app/api/contact/route.ts` | Rails ContactController로 대체 |
| `src/app/api/quotes/` (전체) | Rails QuotesController로 대체 |
| `prisma/` (전체) | ActiveRecord로 대체 |
| `@prisma/client`, `@auth/prisma-adapter` | 불필요 |
| `next-auth` | JWT AuthContext로 대체 |
| `bcryptjs` | Rails bcrypt 사용 |
| `resend` | Rails Action Mailer 사용 |

### 6.2 추가/수정 대상

| 파일 | 내용 |
|------|------|
| `src/lib/authStorage.ts` | 신규 — access token (memory) + refresh token (localStorage) |
| `src/contexts/AuthContext.tsx` | 수정 — NextAuth → JWT fetch 기반 (smart-quote 패턴) |
| `src/lib/apiClient.ts` | 신규 — 중앙 API 클라이언트 (401 자동 refresh) |
| `src/lib/quoteApi.ts` | 신규 — 견적 API 클라이언트 |
| `.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:3000` 추가 |

### 6.3 AuthContext 변경

```
Before: useSession() from next-auth/react
After:  useAuth() custom context (login, signup, logout, user)
        - 마운트 시 refresh token으로 세션 복원
        - 14분 간격 자동 갱신
        - 401 이벤트 수신 → 강제 로그아웃
```

---

## 7. Deployment

### render.yaml

```yaml
databases:
  - name: goodman-gls-db
    databaseName: goodman_gls_api
    user: goodman_gls
    plan: starter   # 유료 ($7/mo) — Free Tier 90일 만료 교훈
    region: oregon

services:
  - type: web
    name: goodman-gls-api
    runtime: ruby
    rootDir: goodman-gls-api
    buildCommand: "bundle install && bundle exec rails db:prepare"
    startCommand: "bundle exec puma -C config/puma.rb"
    plan: starter
    region: oregon
    envVars:
      - key: RAILS_MASTER_KEY
        sync: false
      - key: DATABASE_URL
        fromDatabase:
          name: goodman-gls-db
          property: connectionString
      - key: SECRET_KEY_BASE
        generateValue: true
      - key: CORS_ORIGINS
        value: 'https://goodman-gls.vercel.app'
      - key: FRONTEND_URL
        value: 'https://goodman-gls.vercel.app'
      - key: SENDGRID_API_KEY
        sync: false
    healthCheckPath: /up
```

### Vercel 환경변수

```
NEXT_PUBLIC_API_URL=https://goodman-gls-api.onrender.com
```

---

## 8. Gemfile

```ruby
source "https://rubygems.org"

gem "rails", "~> 8.0.4"
gem "pg", "~> 1.1"
gem "puma", ">= 5.0"
gem "bcrypt", "~> 3.1.7"
gem "jwt"
gem "rack-cors"
gem "kaminari"              # pagination
gem "bootsnap", require: false

group :development, :test do
  gem "debug", platforms: %i[mri windows], require: "debug/prelude"
  gem "brakeman", require: false
  gem "rubocop-rails-omakase", require: false
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "shoulda-matchers"
  gem "faker"
end
```

**Note**: `thruster` gem 제외 (CORS 헤더 드랍 이슈 — smart-quote에서 학습)

---

## 9. CORS Configuration

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*ENV.fetch("CORS_ORIGINS", "*").split(","))
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ["Authorization"],
      credentials: false,
      max_age: 600
  end
end
```

---

## 10. 구현 순서 (Implementation Checklist)

```
Phase 1: 프로젝트 초기화
□ rails new goodman-gls-api --api --database=postgresql --skip-thruster
□ Gemfile 설정 (bcrypt, jwt, rack-cors, kaminari, rspec)
□ DB 마이그레이션 4개 (users, companies, quote_requests, contact_messages)
□ JwtAuthenticatable concern (smart-quote에서 복사)
□ ApplicationController (CORS + error handling)
□ cors.rb 설정
□ render.yaml 작성
□ Dockerfile + docker-entrypoint

Phase 2: 인증
□ User 모델 (validations, callbacks)
□ AuthController 6 actions
□ UserMailer (verification, password_reset)
□ RSpec: auth 엔드포인트 테스트

Phase 3: 비즈니스 로직
□ Company 모델 + CompaniesController
□ QuoteRequest 모델 + QuotesController (CRUD + public)
□ ContactMessage 모델 + ContactController
□ ContactMailer
□ seeds.rb (Admin user)
□ RSpec: quotes, contact 테스트

Phase 4: 프론트엔드 전환
□ authStorage.ts 생성
□ apiClient.ts 생성 (401 refresh 로직)
□ AuthContext.tsx JWT 전환
□ quoteApi.ts → Rails 연결
□ contact form → Rails 연결
□ NextAuth, Prisma, Resend 제거
□ package.json 정리

Phase 5: 배포
□ Render 서비스 생성 + DB 연결
□ Vercel NEXT_PUBLIC_API_URL 설정
□ 전체 flow 테스트 (가입→인증→로그인→견적→문의)
□ CLAUDE.md 업데이트
```

---

**작성일**: 2026-04-08
**Plan 참조**: `docs/01-plan/features/goodman-gls-api.plan.md`
**패턴 참조**: `smart-quote-emax/smart-quote-api/` (검증 완료)
