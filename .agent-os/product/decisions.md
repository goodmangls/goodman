# GOODMAN GLS - Technical & Product Decisions

> Last updated: February 2026

## Architecture Decisions

### ADR-001: Next.js App Router

**Status**: Accepted
**Date**: December 2024

**Context**: Need a modern React framework for a B2B logistics website with SSR/SSG capabilities.

**Decision**: Use Next.js 16 with App Router.

**Rationale**:
- Server Components for better performance
- Built-in API routes for contact form and auth
- Static generation for marketing pages
- Easy Vercel deployment
- React 19 support

**Consequences**:
- Need to understand Client/Server component boundaries
- Some libraries need 'use client' wrapper
- Middleware used for route protection

---

### ADR-002: Tailwind CSS v4

**Status**: Accepted
**Date**: December 2024

**Context**: Need a styling solution for rapid UI development.

**Decision**: Use Tailwind CSS v4 with PostCSS and oklch color space.

**Rationale**:
- Utility-first approach speeds development
- v4 offers improved performance and oklch color support
- Good dark mode support
- Easy responsive design

**Consequences**:
- CSS variables in globals.css using oklch format
- Custom utility classes (glass-panel, hover-lift, etc.)
- Component-level styling in className
- 730 lines of custom CSS with animations

---

### ADR-003: Custom i18n Context over next-intl

**Status**: Accepted
**Date**: December 2024

**Context**: Site needs to support English and Korean languages. next-intl was installed but custom implementation chosen.

**Decision**: Use custom React Context (LanguageContext) for i18n instead of next-intl's built-in routing.

**Rationale**:
- Simpler client-side language switching without URL-based routing
- localStorage persistence for user preference
- Browser language auto-detection
- No URL prefix needed (/en/, /ko/)
- Avoids hydration issues with SSR-safe fallback

**Consequences**:
- Translation files in `/messages/` as nested JSON
- Dot-notation key access: `t('nav.home')`
- Both language files must stay in sync manually
- SSR always renders 'en' first, client-side corrects

---

### ADR-004: Resend for Email

**Status**: Accepted
**Date**: January 2025

**Context**: Contact form and auth flows need email notifications.

**Decision**: Use Resend as email service provider.

**Rationale**:
- Simple API integration
- Good deliverability
- React email templates support
- Generous free tier for starting

**Consequences**:
- Need to verify sending domain
- API key in environment variables
- HTML email templates inline in auth/email.ts and contact/route.ts

---

### ADR-005: Zod + React Hook Form for Validation

**Status**: Accepted
**Date**: December 2024

**Context**: Need form validation for contact and auth forms.

**Decision**: Combine Zod schemas with React Hook Form.

**Rationale**:
- Schema-based validation is reusable on client and server
- Client and server validation with same schema
- Good TypeScript inference
- Lightweight and performant

**Consequences**:
- Validation schemas in `/lib/validations/`
- Shared between client components and API routes

---

### ADR-006: NextAuth 5 with Credentials Provider

**Status**: Accepted
**Date**: January 2025

**Context**: Partner portal needs authentication with role-based access.

**Decision**: Use NextAuth v5 (beta) with Credentials provider and JWT sessions.

**Rationale**:
- B2B partners need email/password (no social login needed)
- JWT strategy avoids extra DB queries per request
- Role and status stored in JWT token
- Prisma adapter for account linking
- Middleware integration for route protection

**Consequences**:
- Beta version (v5.0.0-beta.30) - may need updates
- Custom email verification flow (not NextAuth's built-in)
- Token management in separate `tokens.ts` module
- Type augmentation needed for custom User fields

---

### ADR-007: Prisma + PostgreSQL (Neon)

**Status**: Accepted
**Date**: January 2025

**Context**: Need relational database for users, companies, and quotes.

**Decision**: Use Prisma ORM with PostgreSQL hosted on Neon.

**Rationale**:
- Strong relational model for business entities
- Type-safe database queries
- Migration system for schema evolution
- Neon offers serverless PostgreSQL (good for Vercel)
- Prisma client singleton pattern for connection pooling

**Consequences**:
- `prisma generate` in postinstall script
- Mock client fallback when DATABASE_URL missing (for builds)
- Schema in `prisma/schema.prisma` (11 models)
- Transactions used for multi-model operations (register flow)

---

## Product Decisions

### PD-001: Bilingual Only (EN/KO)

**Status**: Accepted
**Date**: December 2024

**Context**: Decide which languages to support initially.

**Decision**: Support English and Korean only.

**Rationale**:
- Primary markets are Korea and English-speaking partners
- Limited resources for translation maintenance
- Can expand later (Chinese, Japanese)

**Consequences**:
- Two translation files to maintain (~250 keys each)
- Language toggle in navigation

---

### PD-002: Dark Theme for Hero Sections

**Status**: Accepted
**Date**: December 2024

**Context**: Visual design direction for the website.

**Decision**: Use dark gradient backgrounds (#070612) for key sections.

**Rationale**:
- Premium, professional appearance
- Differentiates from typical logistics websites
- Good contrast for CTAs (orange accent)

**Consequences**:
- Consistent dark palette across hero sections
- Orange (#FF6B35) as primary accent
- Glass-morphism effects for cards
- White/light text on dark backgrounds

---

### PD-003: Floating Connect Widget

**Status**: Accepted
**Date**: December 2024

**Context**: Need easy access to contact options for international visitors.

**Decision**: Implement floating button with multiple messaging options.

**Rationale**:
- Different regions prefer different messaging apps
- WhatsApp for international, KakaoTalk for Korea, WeChat for China
- Lower friction than email form

**Consequences**:
- FloatingConnect component always visible
- Multiple messaging platform links
- Business hours display (Mon-Fri 9:00-18:00 KST)

---

### PD-004: Role-Based Partner Types

**Status**: Accepted
**Date**: January 2025

**Context**: Different user types need different portal access levels.

**Decision**: Implement 4 user roles and 6 company types.

**Rationale**:
- Partners (freight forwarders) need quote access
- Airlines need GSA-specific features
- Admin needs management capabilities
- Company type determines available services

**Consequences**:
- UserRole enum: PARTNER, AIRLINE, ADMIN, SUPER_ADMIN
- CompanyType enum: FREIGHT_FORWARDER, SHIPPER, AIRLINE, NVOCC, CUSTOMS_BROKER, OTHER
- Registration captures company type and network memberships
- Future features gated by role

---

## Future Decision Areas

### FD-001: Quote System Architecture

**Status**: Pending (Next Priority)

**Options to evaluate**:
- Simple form submission → Admin email notification → Manual response
- Structured quote workflow with status tracking in DB
- Automated rate lookup with manual approval

**Considerations**:
- QuoteRequest model already exists in Prisma schema
- Translation keys for `rateInquiryModal.*` are defined
- Need admin interface for quote responses
- Email notifications for status changes

---

### FD-002: Tracking API Integration

**Status**: Pending

**Options to evaluate**:
- Direct carrier APIs (Korean Air, Asiana, etc.)
- Aggregator services (17Track, AfterShip)
- Hybrid approach

**Considerations**:
- Korean airline API availability
- Real-time update frequency
- Cost per tracking query

---

### FD-003: Admin Portal Framework

**Status**: Pending

**Options to evaluate**:
- Custom admin pages within Next.js app
- React Admin integration
- Separate admin application

**Considerations**:
- User management (approve/suspend partners)
- Quote management dashboard
- Content management needs
