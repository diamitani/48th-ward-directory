# your48 — Product Requirements Document

## 1. Overview

| Field | Value |
|-------|-------|
| **Product Name** | your48 |
| **Tagline** | Your Digital Civic Hub |
| **Version** | 1.0 (MVP) |
| **Date** | July 1, 2026 |
| **Owner** | Pat Minclaw (Precinct Captain, 48th Ward) |
| **Stakeholder** | Alderman Leni Manaa-Hoppenworth |

## 2. Product Vision

your48 is the digital front door to Chicago's 48th Ward — a civic intelligence platform that makes the ward's data, services, and community accessible to every resident, business owner, and precinct captain through a modern, mobile-first web experience.

## 3. Target Users

### 3.1 Primary Users

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| **Resident (Maria, 34)** | Lives in Edgewater, rents apartment, doesn't attend ward meetings | Find her precinct, report issues, discover local businesses |
| **Small Business Owner (David, 52)** | Runs a restaurant on Broadway, wants more foot traffic | Get listed, connect with neighbors, access permit/license info |
| **Precinct Captain (Pat, 30s)** | Manages a precinct, coordinates volunteers, tracks issues | Digital profile, territory map, communication tools |
| **Ward Office Staff (Rosa, 40s)** | Handles constituent requests, maintains databases | Efficient intake, searchable records, reporting dashboard |

### 3.2 Secondary Users

| Persona | Description | Key Needs |
|---------|-------------|-----------|
| **Alderman's Office** | Policy oversight and public accountability | Real-time metrics, public dashboard, constituent trends |
| **Journalists/Researchers** | Covering ward-level governance | Searchable data, open records, trend analysis |
| **Other Ward Offices** | Looking to replicate the model | Documentation, architecture, open-source code |

## 4. Core Features (MVP)

### F1: Smart Business Directory

**User Story:** As a resident, I want to find businesses near me in the 48th Ward so I can support local commerce.

**Requirements:**
- Search by name, category, address, neighborhood
- Filter by: business type (restaurant, retail, service, etc.), license status (active/expired), precinct
- Sort by: name, street, license date, distance (if geolocation enabled)
- Each business card shows: name, address, category, license #, status, precinct, phone (if available)
- Click-to-expand detail view with map pin
- Data source: Chicago Data Portal Business Licenses API (filtered to 48th Ward addresses)
- Manual override: staff can add/edit businesses not in city data

**Data Fields per Business:**
```
business_name, address, city, state, zip, latitude, longitude,
license_number, license_category, license_status, license_issued,
license_expires, precinct, ward, phone, website, description,
date_added, last_updated, source (city_api | manual)
```

**Acceptance Criteria:**
- [ ] 1,562 businesses loaded from seed data
- [ ] Search returns results in <500ms
- [ ] Filters work independently and in combination
- [ ] Mobile-responsive table/card layout
- [ ] "No results" state with helpful suggestions

---

### F2: Community Institutions Directory

**User Story:** As a new resident, I want to find churches, schools, and community organizations near me.

**Requirements:**
- Separate tab/section from businesses
- Categories: Religious Institutions (42), Schools (27 CPS + private), Community Organizations, Parks, Libraries
- Each listing: name, address, type, contact info, precinct, description, hours
- Map view toggle

**Data Fields per Institution:**
```
institution_name, address, latitude, longitude, type (religious|school|community|park|library),
subtype (e.g., "elementary school", "Catholic church"), phone, website, email,
hours, description, precinct, ward, date_added, last_updated
```

**Acceptance Criteria:**
- [ ] 42 religious institutions loaded
- [ ] 27 schools loaded (CPS + private)
- [ ] Category filters work
- [ ] Contact info clickable (tel: and mailto: links)

---

### F3: Precinct Finder & Captain Directory

**User Story:** As a resident, I want to know who my precinct captain is so I can reach them with local issues.

**Requirements:**
- Address lookup → returns: precinct number, precinct captain name/email/phone, polling location
- Interactive ward map with precinct boundaries (GeoJSON overlay)
- Captain profile cards: photo, bio, contact, territory map snippet
- Printable "Precinct Sheet" (matching existing Excel format)
- 39+ precincts in the 48th Ward (varies by redistricting cycle)

**Data Fields per Precinct:**
```
precinct_number, ward, captain_name, captain_email, captain_phone,
captain_bio, captain_photo_url, polling_location_name,
polling_location_address, boundary_geojson, voter_count,
household_count, date_added, last_updated
```

**Acceptance Criteria:**
- [ ] Address lookup works for any 48th Ward address
- [ ] Map renders with precinct boundaries
- [ ] Captain contact info is clickable
- [ ] Precinct sheet matches existing Excel export format
- [ ] Works offline (cached map tiles for mobile)

---

### F4: Constituent Service Intake

**User Story:** As a resident, I want to report a pothole or graffiti and track when it gets fixed.

**Requirements:**
- Intake form with issue categories:
  - Potholes / Street Repair
  - Graffiti
  - Tree Trimming / Fallen Tree
  - Street Light Outage
  - Abandoned Vehicle
  - Rat Complaint
  - Building Violation
  - Other
- Photo upload (up to 3 images)
- Address / intersection picker
- Submit → creates ticket in Airtable backend
- Email confirmation to submitter
- Dashboard for ward staff to manage tickets
- Status tracking: Open → In Progress → Resolved → Closed

**Form Fields:**
```
issue_type, description, address, latitude, longitude,
photo_urls[3], submitter_name, submitter_email, submitter_phone,
precinct (auto-detected), date_submitted, status, assigned_to,
resolution_notes, date_resolved
```

**Acceptance Criteria:**
- [ ] Form submission creates Airtable record
- [ ] Validation on all required fields
- [ ] Photo upload works on mobile
- [ ] Confirmation email sent
- [ ] Staff dashboard shows all open tickets

---

### F5: Alderman Dashboard (Public)

**User Story:** As a concerned citizen, I want to see what the ward is working on and what's been accomplished.

**Requirements:**
- Public-facing metrics:
  - Total constituent requests (this month / resolved / avg response time)
  - Active business licenses in ward
  - Community events this month
  - Infrastructure projects underway
- Initiative tracker: list of current ward programs with status (Active / Complete / Planned)
- Newsletter signup + archive
- "Report Card" — quarterly ward performance summary

**Acceptance Criteria:**
- [ ] Metrics pull from live data (Airtable + Chicago Data Portal)
- [ ] Auto-refresh daily
- [ ] Initiative list is editable by ward staff
- [ ] Newsletter signup integrates with mailing list

---

### F6: Community Events Calendar

**User Story:** As a resident, I want to know about events happening in the 48th Ward.

**Requirements:**
- Calendar view (monthly / list)
- Event details: title, date/time, location, organizer, description, link
- Categories: Community Meeting, Block Party, Farmers Market, Town Hall, Clean-Up, Cultural
- Submission form for event organizers
- Sync with ward office Google Calendar

**Acceptance Criteria:**
- [ ] Calendar renders current + next 2 months
- [ ] Events are filterable by category
- [ ] Submission form goes to staff for approval
- [ ] Google Calendar 2-way sync

---

### F7: Newsletter & Communications

**User Story:** As a ward office staff member, I want to send updates to residents.

**Requirements:**
- Newsletter signup form (email capture)
- Newsletter archive (searchable by keyword and date)
- Integration with Mailchimp or ConvertKit (free tier)
- Push notifications for urgent alerts (via browser notifications)

**Acceptance Criteria:**
- [ ] Email capture → added to mailing list
- [ ] Archive shows all past newsletters
- [ ] Unsubscribe link in every newsletter

---

## 5. Non-Functional Requirements

### Performance
| Metric | Target |
|--------|--------|
| Initial page load (LCP) | < 2.5s |
| First Input Delay | < 100ms |
| Cumulative Layout Shift | < 0.1 |
| Lighthouse Performance | 95+ |
| Time to Interactive | < 3s on 3G |

### Accessibility
- WCAG 2.1 AA compliance (minimum)
- Screen reader compatible
- Keyboard navigable
- Color contrast ratio ≥ 4.5:1
- Alt text on all images
- Focus indicators visible

### Security
- HTTPS only
- Rate limiting on forms (prevent spam)
- CSRF protection
- Input sanitization (XSS prevention)
- No sensitive data in client-side code
- Airtable API keys in environment variables only

### SEO
- Semantic HTML
- Meta descriptions on all pages
- Open Graph tags for social sharing
- Schema.org structured data for businesses
- Sitemap.xml auto-generated
- robots.txt configured

### Compatibility
- Browsers: Chrome 90+, Firefox 90+, Safari 14+, Edge 90+
- Devices: Mobile-first, tablet, desktop
- No JavaScript required for core content (progressive enhancement)

---

## 6. Data Sources & Pipeline

### External APIs

| Source | Data | Endpoint | Refresh |
|--------|------|----------|---------|
| Chicago Data Portal | Business Licenses | data.cityofchicago.org/resource/r5kz-chrr.json | Daily |
| Chicago Data Portal | 311 Service Requests | data.cityofchicago.org/resource/v6vf-ffxy.json | Daily |
| Chicago Data Portal | Building Permits | data.cityofchicago.org/resource/ygmm-kfi7.json | Weekly |
| Chicago Board of Elections | Precinct Boundaries | chicagoelections.gov (GeoJSON) | Per election cycle |
| CPS | School Directory | cps.edu/api | Quarterly |

### Manual / Ward Office Data

| Source | Data | Format | Owner |
|--------|------|--------|-------|
| Ward Office Spreadsheet | Business inventory | Excel → JSON | Rosa (staff) |
| Precinct Captain Sheets | Captain contacts, voter data | Excel → JSON | Pat |
| Alderman Office | Initiatives, events | Airtable | Ward staff |
| Community Partners | Events, meetings | Google Forms → Airtable | Partners |

### Data Pipeline Architecture

```
External APIs ──┐
                ├──→ Data Ingestion Script (Node.js cron / Vercel Cron)
Ward Office ────┘         │
    Excel/CSV             ▼
    Manual Entry    Normalized Store
                          │
                    ┌─────┼─────┐
                    ▼     ▼     ▼
               Airtable  Static  Search
               (tickets) JSON    Index
                               (client)
```

---

## 7. Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home / Landing (hero + key metrics + quick links) | Public |
| `/businesses` | Business Directory (search + table) | Public |
| `/businesses/[id]` | Business Detail | Public |
| `/institutions` | Community Institutions Directory | Public |
| `/institutions/[id]` | Institution Detail | Public |
| `/precincts` | Precinct Map + Finder | Public |
| `/precincts/[number]` | Precinct Detail (captain + sheet) | Public |
| `/report` | Constituent Service Intake Form | Public |
| `/report/[id]` | Ticket Status View | Public |
| `/dashboard` | Alderman's Priority Dashboard | Public |
| `/events` | Community Events Calendar | Public |
| `/newsletter` | Newsletter Signup + Archive | Public |
| `/about` | About the 48th Ward + your48 | Public |
| `/admin` | Staff dashboard (tickets, businesses, analytics) | Staff-only |

---

## 8. Design System & Branding

### Visual Identity
- **Brand:** your48 — "Your Digital Civic Hub"
- **Logo:** Existing Your48 brand assets (logo files in /branding/logos/)
- **Colors:** Civic blue + Chicago flag palette (white, navy, red accents)
  - Primary: Navy Blue (#1B3A5C)
  - Secondary: Sky Blue (#4A90D9)
  - Accent: Chicago Red (#C8102E)
  - Background: Clean White (#F8FAFC) / Dark: (#0F172A)
  - Neutral: Slate grays (#64748B → #E2E8F0)
- **Typography:** Inter (body) + JetBrains Mono (data/labels)
- **Component Library:** shadcn/ui + Tailwind CSS
- **Design Inspiration:** 21st.dev SaaS template with civic/government context

### UI Patterns (from 21st.dev research)
- Hero with animated stats + search bar
- Smart Directory as sortable table with column filters
- Tabs for switching between Businesses / Institutions / Precincts
- Video embed section for community highlights
- AI Chat widget for "Ask your48" natural language queries
- Card-based feature showcase
- Form with progressive disclosure

---

## 9. Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | SSR, API routes, Vercel deploy |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS + shadcn/ui | Rapid, accessible, consistent |
| Database | Airtable (primary) + Static JSON (directory) | Low-maintenance, staff-editable |
| Search | Client-side (Fuse.js) for MVP | Fast for <2,000 records |
| Maps | Mapbox GL JS or Leaflet | Ward/precinct boundary overlay |
| Hosting | Vercel (free → pro) | Zero-config, instant deploy |
| Forms | React Hook Form + Zod | Validation, accessible |
| Analytics | Plausible or PostHog (self-hosted) | Privacy-respecting |
| Newsletter | ConvertKit (free tier) | Simple, reliable |
| Cron | Vercel Cron | Daily data refresh |

---

## 10. Milestones

### Phase 1: Foundation (Week 1-2)
- [ ] Project structure + design system setup
- [ ] Data pipeline: ingest seed data into normalized format
- [ ] Business Directory (search + table + detail pages)
- [ ] Institutions Directory

### Phase 2: Engagement (Week 3-4)
- [ ] Precinct Finder with map
- [ ] Captain profiles + precinct sheets
- [ ] Constituent intake form → Airtable
- [ ] Staff admin dashboard

### Phase 3: Intelligence (Week 5-6)
- [ ] Alderman Dashboard with live metrics
- [ ] Data pipeline: automated daily sync
- [ ] Events calendar
- [ ] Newsletter integration

### Phase 4: Polish (Week 7-8)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] SEO optimization
- [ ] Mobile testing + fixes
- [ ] Launch prep + documentation

---

## 11. Open Questions

1. **Domain:** Do we use your48.org? your48.app? 48thward.org?
2. **Alderman Buy-in:** Has Leni's office confirmed they want this as the official ward tool?
3. **Data Access:** Do we have a Chicago Data Portal API token? (Rate limit: 50K requests/day free)
4. **Privacy:** Do we need a privacy policy for constituent data? (Yes — Chicago data ordinance)
5. **Maintenance:** Who updates the data when ward boundaries change (2030 redistricting)?
6. **Funding:** Free tiers cover MVP, but what's the path if usage exceeds them?
7. **Multilingual:** Do we need Spanish language support? (48th Ward has significant Hispanic population)

---

## 12. Competitive Analysis

| Alternative | your48 Advantage |
|-------------|-----------------|
| City of Chicago portals | All data scattered across 6+ sites; no ward context |
| Google Maps | No precinct data, no captain info, no ward-specific filtering |
| Generic ward websites | Static HTML, no search, no maps, no data |
| Custom CMS (Drupal/Wordpress) | Expensive, slow, requires ongoing maintenance |
| Airtable alone | No public-facing search, no maps, no design |

**your48 is the only solution that combines all of these into one cohesive, beautiful, fast experience.**

---

## Appendix A: Data Volume Estimates

| Entity | Count | Size (JSON) |
|--------|-------|-------------|
| Business Licenses | ~1,562 | ~4MB |
| Religious Institutions | ~42 | ~50KB |
| Schools | ~27 | ~30KB |
| Precincts | ~39 | ~2MB (with GeoJSON) |
| Precinct Captains | ~39 | ~20KB |
| Community Events | ~50/yr | ~30KB |
| 311 Requests | ~5,000/yr | ~10MB |

**Total static data: ~17MB (well within Vercel's limits)**

---

## Appendix B: Airtable Base Structure

### Base: your48

**Table: Businesses** (synced from Data Portal + manual)
- Name (primary), Address, City, State, Zip, Lat, Lng
- License Number, Category, Status, Issued, Expires
- Precinct, Phone, Website, Description
- Source, Date Added, Last Updated

**Table: Institutions** (manual)
- Name (primary), Address, Type, Subtype
- Phone, Website, Email, Hours, Description
- Precinct, Date Added, Last Updated

**Table: Precinct Captains** (manual)
- Precinct Number (primary), Name, Email, Phone
- Bio, Photo URL, Polling Location, Polling Address
- Voter Count, Household Count

**Table: Service Tickets** (from intake form)
- Ticket ID (auto), Issue Type, Description
- Address, Lat, Lng, Precinct (auto)
- Photos, Submitter Name/Email/Phone
- Status, Assigned To, Resolution Notes
- Date Submitted, Date Resolved

**Table: Events** (manual + submission form)
- Title (primary), Date, Time, End Date, End Time
- Location, Organizer, Category, Description, Link
- Status (Pending/Approved/Past), Submitted By

**Table: Initiatives** (manual by ward staff)
- Initiative Name (primary), Description, Category
- Status (Active/Complete/Planned), Start Date, End Date
- Progress % (0-100), Impact Metric