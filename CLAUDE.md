# CLAUDE.md - GOODMAN GLS

## Project Overview

**GOODMAN GLS** - B2B logistics company website for a Korean freight forwarding company specializing in:
- Freight Forwarding Services (Air, Ocean, Project Cargo)
- GSA/CSA (General Sales Agency / Cargo Sales Agency) for airlines
- Global network partnerships (MPL, EAN)

**Tagline**: "Small Giant. Big Impact." - Your Strategic Partner in Korea & Beyond

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.1 | App Router framework |
| React | 19.2.3 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | v4 | Styling |
| next-intl | ^4.6.1 | i18n (EN/KO) |
| react-hook-form + zod | latest | Form validation |
| Resend | ^6.6.0 | Email service |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/contact/        # Contact form API endpoint
│   ├── company/            # About page
│   ├── network-solutions/  # Network & GSA page
│   ├── partner-hub/        # Partner resources page
│   ├── services/           # Services page
│   └── page.tsx            # Homepage
├── components/             # React components
├── contexts/               # React contexts (Language)
├── content/                # Content data
└── lib/                    # Utilities and validations
```

## Agent OS Documentation

Detailed product documentation is available in `.agent-os/product/`:

- **overview.md** - Product vision, target users, business model
- **roadmap.md** - Development phases and feature prioritization
- **tech-stack.md** - Complete technology documentation
- **decisions.md** - Architecture and product decision records
- **personas.md** - User personas and journey mapping

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Use `'use client'` directive for client components
- Keep server components where possible for performance

### Styling
- Use Tailwind CSS classes
- Dark sections use `bg-[#070612]` background
- Orange accent color: `#FF6B35`
- Use `glass-panel` class for frosted glass effects

### Internationalization
- Translation files in `/messages/en.json` and `/messages/ko.json`
- Use `useTranslations` hook from LanguageContext
- Keep both language files in sync

### Forms
- Use Zod schemas in `/lib/validations/`
- Combine with react-hook-form for validation
- Reuse schemas in both client and API routes

## Environment Variables

```env
RESEND_API_KEY=           # Resend email service API key
CONTACT_EMAIL_FROM=       # Sender email address
CONTACT_EMAIL_TO=         # Recipient email address
```

## Current Status

### Completed
- Marketing website with all pages
- Contact form with email integration
- Bilingual support (EN/KO)
- Responsive design
- Vercel deployment

### In Progress / Planned
- Partner login portal
- Rate calculator / Quote system
- Shipment tracking
- Admin portal

## Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with fonts and metadata |
| `src/components/ClientLayout.tsx` | Client-side layout wrapper |
| `src/contexts/LanguageContext.tsx` | i18n context provider |
| `src/lib/validations/contact.ts` | Contact form Zod schema |
| `src/app/api/contact/route.ts` | Contact form API endpoint |
