# Goodman GLS Global Logistics Platform

![Goodman GLS Banner](/public/images/logo/logo-white.svg)

> **Better Future with Goodman GLS: Your Trusted Global Logistics Platform**
> _27 Years of Air Cargo Expertise Meets AI Technology._

## 📌 Introduction

**GOODMAN GLS** is a specialized GSSA (General Sales & Service Agent) and logistics platform founded in 2014. We connect the world in real-time through our strategic partnership with **ECS Group** and our membership in **MPL** and **EAN** networks.

This repository contains the source code for the official Goodman GLS website, rebuilt with **Next.js 16** to reflect our **2026 Strategy**.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Localization**: [next-intl](https://next-intl-docs.vercel.app/) (English & Korean)
- **Icons**: [FontAwesome 6](https://fontawesome.com/) & Local SVG Assets
- **Database**: PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Auth**: [NextAuth.js v5](https://authjs.dev/)

---

## 🌟 Key Features

### 1. 2026 Strategy Content

- **Hero Section**: "Eye of the Storm" concept with full-screen video background.
- **Company Identity**: Highlighting our role as an **ECS Group Strategic Partner**.
- **Services**:
  - **GSA/CSA**: Airline partnerships with **WestJet, Royal Brunei, Air Busan, Aero Mongolia, Aeroflot**.
  - **MRO**: Newly added **Goodman Aero Solutions**.
  - **Logistics**: Air, Ocean, Project Cargo.

### 2. Modern UI/UX

- **Dark Theme**: Premium "Space/Midnight" aesthetic (`bg-[#070612]`).
- **Glassmorphism**: Translucent cards and navigation with backdrop blur.
- **One-Page Navigation**: Smooth scrolling to `#network`, `#services`, `#partner-hub` etc.
- **SVG Logos**: Crisp, scalable vector assets for all devices.

### 3. Partner Portal (Beta)

- Dedicated zone for partners to check rates and track shipments.
- Authentication via NextAuth.
- Protected routes under `/portal`.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jlinsights/goodman.git

# Install dependencies
npm install

# Setup Environment Variables
cp .env.local.example .env.local
# Update .env.local with your credentials (DATABASE_URL, AUTH_SECRET, etc.)

# Run Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 📦 Project Structure

```
├── messages/            # Localization files (en.json, ko.json)
├── public/
│   ├── images/          # Static assets (logos, icons)
│   └── videos/          # Hero background videos
├── src/
│   ├── app/             # App Router pages and API routes
│   ├── components/      # React components (Hero, Footer, Navigation, etc.)
│   ├── lib/             # Utility functions and Prisma client
│   └── styles/          # Global styles (globals.css)
└── next.config.ts       # Next.js configuration
```

---

## 🚢 Deployment

The project is deployed on **Vercel**.

```bash
# Production Build
npm run build

# Deploy via Vercel CLI
vercel deploy --prod
```

> **Note**: For Vercel deployment, ensure `eslint.config.mjs` allows build by ignoring lint errors if necessary, as distinct environment checks may apply.

---

## 📝 License

© 2026 **Goodman Global Logistics Service**. All Rights Reserved.
