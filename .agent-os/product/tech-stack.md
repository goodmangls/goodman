# GOODMAN GLS - Technology Stack

> Last updated: February 2026

## Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | Full-stack React framework with App Router |
| **React** | 19.2.3 | UI component library |
| **TypeScript** | ^5 | Type-safe JavaScript |
| **Node.js** | >=20.0.0 | Runtime requirement |

## Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | v4 | Utility-first CSS framework (oklch color space) |
| **@tailwindcss/postcss** | ^4 | PostCSS integration |
| **Framer Motion** | ^12.26.2 | Animation library |
| **Lucide React** | ^0.562.0 | Icon library |
| **React Icons** | ^5.5.0 | Additional icons |
| **clsx** | ^2.1.1 | Conditional classnames |
| **tailwind-merge** | ^3.4.0 | Tailwind class merging |

**Design System:**
- Dark background: `oklch(0.12 0.04 275)` (~#070612)
- Orange accent: `oklch(0.7 0.2 35)` (~#FF6B35)
- Fonts: Inter (sans), Outfit (headings) via next/font
- Glassmorphism effects with `glass-panel` utility class
- Custom animations: fadeInUp, pulse-slow, shimmer, slideRight

## Authentication

| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | ^5.0.0-beta.30 | Authentication framework (v5 beta) |
| **@auth/prisma-adapter** | ^2.11.1 | Prisma adapter for NextAuth |
| **bcryptjs** | ^3.0.3 | Password hashing |

**Auth Configuration:**
- Provider: Credentials (email + password)
- Session strategy: JWT (30-day maxAge)
- Token types: Email verification (24h), Password reset (1h)
- Roles: PARTNER, AIRLINE, ADMIN, SUPER_ADMIN
- Status: PENDING, ACTIVE, SUSPENDED, INACTIVE
- Protected routes: `/portal/*` (middleware)

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma** | ^5.22.0 | Database ORM |
| **@prisma/client** | ^5.22.0 | Prisma client |
| **PostgreSQL** | - | Primary database (hosted on Neon) |

**Models (11 total):**
- User, Account, Session, VerificationToken (auth)
- Company (partner business info, network memberships)
- QuoteRequest (service type, cargo details, status tracking)

**Enums:**
- UserRole, UserStatus, CompanyType, ServiceType, ShipmentType, QuoteStatus

## Internationalization

| Technology | Version | Purpose |
|------------|---------|---------|
| **next-intl** | ^4.6.1 | i18n for Next.js (installed but using custom context) |

**Implementation:** Custom React Context (`LanguageContext.tsx`)
- Locale detection: localStorage > browser language > fallback to 'en'
- Nested key support: `t('nav.home')` for deep JSON access
- Hydration-safe: SSR renders 'en', client-side detects actual locale
- ~250 translation keys across EN/KO

**Translation Files:**
- `messages/en.json` - English
- `messages/ko.json` - Korean

## Forms & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **react-hook-form** | ^7.69.0 | Form state management |
| **@hookform/resolvers** | ^5.2.2 | Validation resolvers |
| **zod** | ^4.3.3 | Schema validation |

**Schemas:**
- `src/lib/validations/contact.ts` - Contact form (name, email, message)
- `src/lib/validations/auth.ts` - Login, register, forgot/reset password

## Email

| Technology | Version | Purpose |
|------------|---------|---------|
| **Resend** | ^6.6.0 | Transactional email service |

**Email Types:**
- Contact form notifications
- Email verification (branded HTML)
- Password reset (branded HTML)
- Welcome email (post-verification)

## Video

| Technology | Version | Purpose |
|------------|---------|---------|
| **hls.js** | ^1.6.15 | HLS video streaming |

## Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | ^9 | Code linting |
| **eslint-config-next** | 16.1.1 | Next.js ESLint rules |

## Deployment & Infrastructure

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting, deployment, serverless functions |
| **Neon** | Managed PostgreSQL database |
| **Resend** | Email delivery service |

## Environment Variables

```
# Database
DATABASE_URL=           # PostgreSQL connection string (Neon)

# Authentication
NEXTAUTH_SECRET=        # JWT signing secret
NEXTAUTH_URL=           # App URL (http://localhost:3000)

# Email
RESEND_API_KEY=         # Resend API key
CONTACT_EMAIL_TO=       # Recipient for contact form
CONTACT_EMAIL_FROM=     # Sender address
```

## Project Structure

```
goodman-gls/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/               # Auth endpoints (register, verify, reset, nextauth)
│   │   │   └── contact/            # Contact form API
│   │   ├── auth/                   # Auth pages (login, register, forgot-password, etc.)
│   │   ├── portal/                 # Protected partner portal
│   │   ├── company/                # Company/About page
│   │   ├── network-solutions/      # Network & GSA page
│   │   ├── partner-hub/            # Partner resources page
│   │   ├── services/               # Services overview page
│   │   ├── globals.css             # Global styles (730 lines)
│   │   ├── layout.tsx              # Root layout
│   │   └── page.tsx                # Homepage
│   ├── components/                 # 13 React components
│   │   ├── ClientLayout.tsx        # Route-aware layout wrapper
│   │   ├── Providers.tsx           # SessionProvider + LanguageProvider
│   │   ├── Navigation.tsx          # Header/navbar
│   │   ├── HeroSection.tsx         # Homepage hero
│   │   ├── ContactSection.tsx      # Contact form
│   │   ├── FloatingConnect.tsx     # Floating contact widget
│   │   └── ...                     # Other section components
│   ├── contexts/
│   │   └── LanguageContext.tsx      # i18n context provider
│   ├── lib/
│   │   ├── auth/                   # NextAuth config, email, tokens
│   │   ├── validations/            # Zod schemas (auth, contact)
│   │   ├── db.ts                   # Prisma client singleton
│   │   └── utils.ts                # cn() helper
│   ├── types/
│   │   └── next-auth.d.ts          # NextAuth type augmentation
│   └── middleware.ts               # Route protection
├── messages/                       # i18n translation files (en, ko)
├── prisma/
│   └── schema.prisma               # Database schema (11 models)
├── public/                         # Static assets
├── .agent-os/                      # Agent OS documentation
└── package.json                    # Dependencies
```
