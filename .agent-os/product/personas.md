# GOODMAN GLS - User Personas

> Last updated: April 2026

## Primary Personas

### Persona 1: Airline Cargo Manager (GSA/CSA Client — Core)

**Name**: Jennifer Kim
**Role**: Regional Cargo Sales Manager at Asian carrier
**Age**: 38
**Location**: Seoul, Korea

**Background**:
- Manages cargo sales for Korean market
- Looking for GSA partners for new routes
- Evaluates partner performance quarterly
- Network-focused professional

**Goals**:
- Increase cargo revenue on Korea routes
- Find reliable, dedicated GSA representation
- Develop new market segments
- Improve market share in Korea

**Pain Points**:
- Limited local market knowledge
- Need for dedicated sales resources
- Difficulty finding a GSSA where airline representation is the core business (not a side job)
- Competition from other carriers

**How GOODMAN GLS Helps**:
- GSSA is the core identity — not a side business
- Established airline cargo sales expertise
- Strong logistics partner network (MPL/EAN) to drive cargo volume
- Local market expertise and regulatory knowledge
- Professional, dedicated sales representation

**Key Features Needed**:
- Company information/credentials (Available)
- Contact for partnership discussions (Available)
- Case studies of GSA success (Planned)
- AIRLINE role portal access (Auth ready)
- Capacity/performance reporting (Planned)

---

### Persona 2: International Logistics Partner (via MPL/EAN)

**Name**: Thomas Weber
**Role**: Operations Manager at a German logistics company
**Age**: 42
**Location**: Frankfurt, Germany

**Background**:
- Works for a mid-sized logistics company (50 employees)
- Handles European exports to Asia
- Member of WCA network
- Looking for reliable Korean partner with airline connections

**Goals**:
- Find trustworthy Korean partner for cross-border shipments
- Access competitive rates through GSSA airline partnerships
- Get reliable capacity during peak seasons
- Have responsive communication (timezone aware)

**Pain Points**:
- Hard to verify new partners' reliability
- Language barriers with some Asian partners
- Inconsistent service quality
- Slow quote responses

**How GOODMAN GLS Helps**:
- MPL/EAN membership provides trust
- GSSA airline partnerships ensure capacity access
- Bilingual communication (English proficient)
- Quick quote turnaround
- Dedicated account management

**Key Features Needed**:
- Partner registration portal (Available)
- Rate sheet access (Planned - Phase 2)
- Quote request system (Available)
- Shipment tracking (Planned - Phase 3)

**Portal Journey**:
```
Register → Verify Email → Login → Dashboard → Request Quote → Track Shipments
```

---

### Persona 3: Korean Exporter (Direct Customer)

**Name**: Park Soo-young
**Role**: Logistics Manager at Korean electronics manufacturer
**Age**: 35
**Location**: Seoul, Korea

**Background**:
- Manages outbound logistics for consumer electronics
- Ships to US, Europe, Southeast Asia
- Handles both air and ocean freight
- Values speed and reliability

**Goals**:
- Ensure on-time delivery to overseas customers
- Optimize shipping costs
- Get reliable tracking information
- Handle occasional urgent shipments

**Pain Points**:
- Tight delivery schedules from customers
- Need for fast response on urgent shipments
- Managing multiple carriers is complex
- Price pressure from procurement

**How GOODMAN GLS Helps**:
- GSA/CSA relationships for priority capacity
- Time-critical shipment expertise
- Single point of contact for multiple routes
- Competitive rates through airline partnerships and network

**Key Features Needed**:
- Korean language interface (Available)
- Quick quote requests (Available)
- Shipment tracking (Planned)
- WhatsApp/KakaoTalk support (Available via FloatingConnect)

---

### Persona 4: Job Seeker

**Name**: Lee Jimin
**Role**: Logistics Coordinator (3 years experience)
**Age**: 28
**Location**: Incheon, Korea

**Background**:
- Currently at large Korean logistics company
- IATA certified
- Looking for career growth in GSA/CSA specialization
- Interested in international exposure

**Goals**:
- Find company with growth opportunities
- Work with international airlines and partners
- Develop GSA/CSA expertise
- Better work-life balance

**How GOODMAN GLS Helps**:
- Smaller company = more responsibility
- International airline and network exposure
- GSA/CSA specialized experience (rare expertise)
- Direct partner relationships

**Key Features Needed**:
- Company culture information (Available on Company page)
- Career opportunities section (Planned)
- Contact for applications (Available)

---

## Secondary Personas

### Persona 5: Project Cargo Customer

**Background**: Engineering company needing heavy-lift logistics
**Key Need**: Complex project cargo coordination
**Features**: Quote system, case studies, project management capabilities

### Persona 6: Trade Show Visitor

**Background**: Met at logistics trade show (WCA conference, etc.)
**Key Need**: Quick company overview and contact
**Features**: Mobile-friendly site, easy contact access (FloatingConnect)

---

## Feature Priority by Persona

| Feature | Airline | Logistics Partner | Shipper | Job Seeker | Status |
|---------|---------|-------------------|---------|------------|--------|
| Marketing Site | Required | Required | Required | Required | Done |
| Partner Portal Auth | Required | Required | Required | - | Done |
| Quote System | - | Critical | Critical | - | Done |
| Tracking | - | Critical | Critical | - | Phase 3 |
| Rate Calculator | - | High | Critical | - | Phase 2 |
| Contact Form | Critical | High | High | Critical | Done |
| Bilingual | High | Critical | Critical | Critical | Done |
| Floating Connect | Medium | High | High | Medium | Done |
| Case Studies | Critical | High | High | Medium | Phase 4 |
| Capacity Reports | Critical | High | - | - | Planned |
| Careers Page | - | - | - | Critical | Phase 4 |

## Portal Access by Role

| Feature | PARTNER | AIRLINE | ADMIN | SUPER_ADMIN |
|---------|---------|---------|-------|-------------|
| Dashboard | Yes | Yes | Yes | Yes |
| Quote Request | Yes | No | View All | View All |
| Quote Response | No | No | Yes | Yes |
| Rate Sheets | Yes | No | Manage | Manage |
| Tracking | Yes | No | View All | View All |
| User Management | No | No | Limited | Full |
| Analytics | No | No | Yes | Yes |
