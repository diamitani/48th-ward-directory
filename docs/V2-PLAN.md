# Your48 V2.0 — Architecture Diagram

**Civic Intelligence Platform for Chicago's 48th Ward**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER INTERFACE                                    │
│  React + Vite + TypeScript  |  Tailwind CSS  |  Mapbox GL                   │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐      ┌────────▼───────┐
            │  Static Pages  │      │  Data Views    │
            │  (V1.0)        │      │  (V2.0)        │
            │  • Home        │      │  • Precincts   │
            │  • Directory   │      │  • Businesses  │
            │  • Services    │      │  • Dashboard   │
            │  • Community   │      │  • Forms       │
            │  • Dates       │      │                │
            └────────────────┘      └────────────────┘
                                             │
┌────────────────────────────────────────────┴────────────────────────────────┐
│                         DATA LAYER (Client-Side)                             │
│  JSON Files  |  Fuse.js Search  |  Mapbox GeoJSON                           │
└──────────────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐      ┌────────▼───────┐
            │  Static Data   │      │  Airtable API  │
            │  • Precincts   │      │  • Intake Forms│
            │  • Ward Office │      │  • Dashboard   │
            │  • Elected Ofc │      │  • Metrics     │
            │  • Community   │      │                │
            └────────────────┘      └────────────────┘
                                             │
┌────────────────────────────────────────────┴────────────────────────────────┐
│                      DATA SYNC PIPELINE (ROSTR Framework)                    │
│  PAL Compiler  →  Task Router  →  Data Ingestion  →  JSON Generation        │
└──────────────────────────────────────────────────────────────────────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
    ┌───────▼──────┐   ┌───────▼───────┐   ┌───────▼──────┐
    │ Chicago Data │   │ Board of      │   │ Ward Office  │
    │ Portal API   │   │ Elections     │   │ CSV/Excel    │
    │ • Businesses │   │ • Precincts   │   │ • Captains   │
    │ • Permits    │   │ • Boundaries  │   │ • Metrics    │
    │ • 311        │   │ • Polling     │   │ • Events     │
    └──────────────┘   └───────────────┘   └──────────────┘
```

---

## Component Breakdown

### Frontend Stack
| Technology | Purpose | Why |
|-----------|---------|-----|
| React 18 | UI framework | Matches V1.0, component-based |
| Vite | Build tool | Fast dev server, optimized production builds |
| TypeScript | Type safety | Catches errors at compile time |
| Tailwind CSS | Styling | Utility-first, matches V1.0 design system |
| Mapbox GL JS | Interactive maps | Ward boundary overlay, precinct polygons |
| Fuse.js | Client-side search | Fast fuzzy search, no backend needed |

### Data Architecture
| Data Type | Storage | Update Frequency |
|-----------|---------|------------------|
| Precinct boundaries | Static GeoJSON | Per election cycle (2030) |
| Precinct captains | Static JSON | Manual (staff updates) |
| Business licenses | Static JSON | Daily sync from Chicago Data Portal |
| Service requests | Airtable | Real-time (form submissions) |
| Ward metrics | Airtable | Weekly (staff updates) |

### Data Sources
| Source | API Endpoint | Data |
|--------|-------------|------|
| Chicago Data Portal | `data.cityofchicago.org` | Business licenses, permits, 311 |
| Board of Elections | `chicagoelections.gov` | Precinct maps, polling places |
| Ward Office | CSV/Excel upload | Captain contacts, initiatives |

---

## Build Process: ROSTR Framework

### Phase 1: Research & Design (Weeks 1-2)
```
Input: Project Brief + PRD
Output: Architecture Diagram + Component Specs

Steps:
1. PAL Compiler parses requirements → task inventory
2. Task Router assigns priority scores (effort × impact)
3. Component Designer generates wireframes
4. Data Architect maps schema + sync pipeline
```

### Phase 2: Data Pipeline (Weeks 3-4)
```
Input: Chicago Data Portal API + Ward Office CSVs
Output: Static JSON files for client-side use

Steps:
1. API Wrapper authenticates with Chicago Data Portal
2. Data Ingestion fetches business licenses (filtered by ward 48)
3. Data Cleaner normalizes fields (address, category, status)
4. Precinct Mapper tags each business with precinct number
5. JSON Generator outputs static files to `data/` directory
6. Mapbox Prep converts precinct boundaries to GeoJSON
```

### Phase 3: Frontend Features (Weeks 5-6)
```
Input: Component Specs + Static JSON
Output: React components for precincts, businesses, dashboard

Steps:
1. Component Generator creates React + TypeScript + Tailwind
2. Map Integration wires Mapbox GL with GeoJSON overlay
3. Search Integration adds Fuse.js to precinct/business views
4. Forms Builder creates intake forms with Airtable webhooks
5. Dashboard Builder pulls metrics from Airtable views
```

### Phase 4: Testing & Deployment (Weeks 7-8)
```
Input: Features + Data
Output: Production deployment on Vercel

Steps:
1. Testing Suite runs unit + integration tests
2. Accessibility Audit checks WCAG 2.1 AA compliance
3. Performance Analysis measures Core Web Vitals
4. Vercel Preview deploys to staging URL
5. User Testing with ward staff + select constituents
6. Production Deploy pushes to your48.vercel.app
```

---

## Vercel Deployment Structure

```
your48/
├── public/
│   ├── data/
│   │   ├── precincts.json          # Static precinct data
│   │   ├── businesses.json         # Static business directory
│   │   └── ward-boundary.geojson   # Map polygon
│   ├── img/
│   │   ├── andersonville.png
│   │   ├── edgewater.png
│   │   └── uptown.png
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── PrecinctMap.tsx         # Mapbox integration
│   │   ├── PrecinctCard.tsx        # Captain profile card
│   │   ├── BusinessTable.tsx       # Searchable business list
│   │   ├── IntakeForm.tsx          # Service request form
│   │   └── Dashboard.tsx           # Ward metrics view
│   ├── pages/
│   │   ├── Precincts.tsx           # /precincts route
│   │   ├── Businesses.tsx          # /businesses route
│   │   ├── Report.tsx              # /report route (forms)
│   │   └── Dashboard.tsx           # /dashboard route
│   ├── lib/
│   │   ├── airtable.ts             # Airtable API client
│   │   ├── search.ts               # Fuse.js setup
│   │   └── mapbox.ts               # Mapbox GL setup
│   └── main.tsx                    # App entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json                     # Deployment config
```

---

## Cost Analysis

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Vercel Hosting | ✅ Included | — | 100GB bandwidth, 100 builds/day |
| Airtable | 1,200 records | $20/mo (50K records) | Upgrade when needed |
| Chicago Data Portal | ✅ Unlimited | — | Public API, no auth needed |
| Mapbox GL | 50K loads/mo | $5/mo (100K loads) | Upgrade if traffic grows |
| **Total Cost** | **$0** | **$25/mo** | Only if growth requires upgrades |

---

## Maintenance Model

### Ongoing Tasks
| Task | Frequency | Owner | Automation |
|------|-----------|-------|------------|
| Business license sync | Daily | ROSTR cron job | Fully automated |
| Precinct data updates | Per election | Ward staff | Manual CSV upload |
| Captain contacts | As needed | Ward staff | Airtable UI |
| Dashboard metrics | Weekly | Ward staff | Airtable UI |
| Bug fixes | As needed | Developer (Pat) | Git workflow |
| Feature requests | Quarterly | Developer (Pat) | Git workflow |

### ROSTR Cron Jobs
```
Job 1: Sync Business Licenses
- Trigger: Daily at 2 AM
- Source: Chicago Data Portal API
- Output: Updated businesses.json

Job 2: Sync 311 Requests
- Trigger: Daily at 3 AM
- Source: Chicago Data Portal API
- Output: Updated service-requests.json

Job 3: Generate Dashboard Metrics
- Trigger: Weekly on Monday
- Source: Airtable forms + Chicago API
- Output: Updated dashboard-metrics.json
```

---

## Security & Privacy

### Data Protection
- **No PII collected** without explicit consent (intake forms)
- **Airtable** handles form submissions with encryption at rest
- **Mapbox** uses HTTPS for all tile requests
- **No tracking pixels** (privacy-first analytics optional)

### Access Control
- Precinct captain profiles: **opt-in** (staff confirms before publishing)
- Service request forms: **Airtable form view** (no custom backend)
- Dashboard metrics: **public** (transparency by design)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Precinct lookups | 200/month | Mapbox load events |
| Business searches | 1,000/month | Fuse.js search events |
| Form submissions | 50/month | Airtable record count |
| Page load time | <2 seconds | Vercel analytics |
| Mobile usage | 60%+ | Vercel analytics |
| Ward staff time saved | 10+ hrs/week | Staff survey |

---

**This architecture prioritizes:**
1. **Client-side rendering** — fast, no backend needed
2. **Static JSON** — cheap, scalable, CDN-cached
3. **Airtable for forms** — no custom backend, staff-editable
4. **ROSTR automation** — data pipeline runs on autopilot
5. **Vercel free tier** — $0 cost until growth justifies upgrades
