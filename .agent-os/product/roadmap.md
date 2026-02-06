# GOODMAN GLS - Product Roadmap

> Last updated: January 2025

## Phase 0: Already Completed

### Marketing Website
- [x] **Homepage** - Hero section, trust badges, company intro, services showcase, GSA section, partner hub preview, contact section
- [x] **Services Page** - Detailed Air Freight, Ocean Freight, Project Cargo with case studies
- [x] **Network & Solutions Page** - WCA/MPL/EAN memberships, GSA/CSA airline partnerships, global coverage
- [x] **Partner Hub Page** - Agent zone, market insights, partnership benefits
- [x] **Company/About Page** - CEO message, company timeline, team, values

### Core Functionality
- [x] **Contact Form** - React Hook Form + Zod validation, Resend email integration
- [x] **Bilingual Support** - English/Korean with LanguageContext, language toggle, localStorage persistence
- [x] **Responsive Design** - Mobile-first, dark theme sections, glassmorphism effects
- [x] **Floating Connect Widget** - WhatsApp, WeChat, Telegram, KakaoTalk, Email quick links
- [x] **SEO Optimization** - Metadata, structured content

### Technical Foundation
- [x] Next.js 16 App Router setup with React 19
- [x] TypeScript strict mode configuration
- [x] Tailwind CSS v4 styling system (oklch color space)
- [x] Vercel deployment pipeline
- [x] Environment configuration (.env.local)
- [x] Path aliases (`@/*` → `./src/*`)

---

## Phase 1: Partner Portal Foundation (Mostly Complete)

### Authentication & User Management
- [x] Partner registration flow (email, password, company info)
- [x] Email verification with token system (24h expiry)
- [x] Login/logout with NextAuth 5 (Credentials provider, JWT strategy)
- [x] Password reset flow (forgot + reset with 1h token)
- [x] Role-based access (PARTNER, AIRLINE, ADMIN, SUPER_ADMIN)
- [x] User status management (PENDING, ACTIVE, SUSPENDED, INACTIVE)
- [x] Middleware route protection for `/portal` routes
- [x] Auth redirect logic (login → portal, portal → login)

### Database
- [x] Prisma ORM with PostgreSQL (Neon)
- [x] User, Account, Session, VerificationToken models
- [x] Company model (type, country, network memberships)
- [x] QuoteRequest model (service type, shipment details, status)

### Email System
- [x] Verification email (HTML template, branded)
- [x] Password reset email
- [x] Welcome email (post-verification)
- [x] Contact form email notifications

### Partner Dashboard (Scaffolded)
- [x] Portal layout wrapper
- [x] Basic dashboard page (session-aware)
- [ ] Dashboard overview with key metrics
- [ ] Quick quote request widget
- [ ] Account/profile management page
- [ ] Company profile editing

---

## Phase 2: Rate Calculator & Quote System (Next Priority)

### Rate Inquiry System
- [ ] Multi-service quote form (Air/Ocean/Project)
- [ ] Origin/Destination input with port/airport lookup
- [ ] Cargo details (weight, dimensions, commodity)
- [ ] Quote request submission (saves to QuoteRequest model)
- [ ] Quote status tracking for partners
- [ ] Admin quote management dashboard
- [ ] Quote response email notifications
- [ ] Rate inquiry modal (translation keys exist in `rateInquiryModal.*`)

### Rate Calculator (Basic)
- [ ] Estimated rate lookup for common routes
- [ ] Fuel surcharge calculator
- [ ] Volume/weight comparison
- [ ] Rate validity display

---

## Phase 3: Shipment Tracking

### Tracking System
- [ ] Shipment tracking by tracking number
- [ ] Multi-carrier tracking integration
- [ ] Real-time status updates
- [ ] Email/SMS notifications for status changes
- [ ] Tracking history timeline
- [ ] Document access (AWB, BL, invoices)

### Partner Shipment Management
- [ ] Active shipments list
- [ ] Filter and search capabilities
- [ ] Shipment detail view
- [ ] Export shipment data

---

## Phase 4: Advanced Features

### Admin Portal
- [ ] User management (approve/suspend partners)
- [ ] Quote management and approval workflow
- [ ] Rate sheet management
- [ ] Analytics dashboard
- [ ] Content management for market insights

### Enhanced Partner Features
- [ ] Tariff sheet downloads
- [ ] Booking requests
- [ ] Invoice management
- [ ] Performance reports
- [ ] API access for integration

### Content & Marketing
- [ ] Blog/News section
- [ ] Market insights subscription
- [ ] Case study management
- [ ] Resource downloads

---

## Phase 5: Integration & Scale

### Third-Party Integrations
- [ ] Carrier tracking API integrations (Korean Air, Asiana, etc.)
- [ ] Ocean tracking APIs (container lines)
- [ ] Payment gateway (if needed)
- [ ] CRM integration

### Mobile & Performance
- [ ] PWA support
- [ ] Push notifications
- [ ] Performance optimization
- [ ] CDN implementation

---

## Priority Matrix

| Feature | Impact | Effort | Priority | Status |
|---------|--------|--------|----------|--------|
| Marketing Site | High | Medium | P0 | Done |
| Partner Auth | High | Medium | P1 | Done |
| Portal Dashboard | High | Low | P1 | In Progress |
| Quote System | High | Medium | P1 | Next |
| Shipment Tracking | High | High | P2 | Planned |
| Rate Calculator | Medium | Medium | P2 | Planned |
| Admin Portal | Medium | High | P3 | Planned |
| Blog/News | Low | Low | P4 | Planned |
