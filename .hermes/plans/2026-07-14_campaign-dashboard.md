# 48th Ward Campaign Dashboard — Implementation Plan

> **For Hermes:** Build this directly — internal campaign tool for Leni's team.

**Goal:** Transform the public "your 48." directory into an internal campaign dashboard for Leni Manaa-Hoppenworth's 48th Ward campaign staff. Dark theme, operational tools, precinct-level analytics.

**Architecture:** React 19 + Vite 8 + Tailwind v4 + React Router v7. Dark dashboard theme (shadcn/ui style). Reuse existing JSON data layer. Add dashboard home, turn the precinct page into a captain workboard, add gap analysis.

**Tech Stack:** React 19, TypeScript 6, Tailwind v4, Vite 8, Framer Motion, Phosphor Icons (already in deps)

---

## Phase 1: Dashboard Shell (Foundation)

### Task 1: Install dark theme CSS variables
**Files:** `src/index.css` (modify)
- Replace light theme vars with dark dashboard tokens
- Background: near-black, accent: campaign red, muted surfaces

### Task 2: Create Dashboard layout component
**Files:** `src/components/DashboardLayout.tsx` (create)
- Sidebar navigation (not top nav) — internal tool pattern
- Fixed sidebar: Home, Captains, Precincts, Turnout, Directory
- Content area with max-w

### Task 3: Rewrite App.tsx with dashboard routing
**Files:** `src/App.tsx` (modify)
- Replace public nav with DashboardLayout sidebar
- Routes: / → DashboardHome, /captains → CaptainRoster, /precincts → PrecinctWorkboard, /turnout → TurnoutAnalysis, /directory → DirectoryPage

---

## Phase 2: Dashboard Home

### Task 4: DashboardHome — stats grid
**Files:** `src/pages/DashboardHome.tsx` (create)
- 4 stat cards: Total Captains, Precinct Coverage %, Avg Turnout, Businesses
- Precinct coverage = precincts with captains / 35 total precincts
- Quick action buttons: Export Contacts, View Gaps

### Task 5: DashboardHome — coverage heat map
- 35 precinct boxes color-coded by captain status (green=covered, yellow=partial, red=gap)
- Click a precinct → navigate to precinct detail

### Task 6: DashboardHome — recent activity feed
- Static feed showing latest captain notes, meeting attendance, etc.

---

## Phase 3: Captain Workboard

### Task 7: CaptainRoster page
**Files:** `src/pages/CaptainRoster.tsx` (create)
- Table view with: Name, Precinct, Polling Location, Phone, Email, Status, Notes
- Filter by precinct, polling location
- Status badges: Active / Needs Follow-up / Unresponsive
- Export as CSV button

### Task 8: Captain status logic
- Determine status from notes: "Attended" → Active, "?" in name → Needs Follow-up, "not responded" → Unresponsive

---

## Phase 4: Turnout & Gap Analysis

### Task 9: TurnoutAnalysis page
**Files:** `src/pages/TurnoutAnalysis.tsx` (create)
- Bar chart of turnout % by precinct (simple CSS bars, no chart lib)
- Sortable columns: Precinct, Registered, Ballots, Turnout %
- Highlight low-turnout precincts (< 40%)

### Task 10: GapAnalysis (within DashboardHome or standalone)
- List precincts with NO captains
- Flag precincts with only unconfirmed captains (name contains "?")
- "Recruit Captain" priority score

---

## Files Changed
- `src/index.css` — dark theme
- `src/App.tsx` — dashboard routing
- `src/components/DashboardLayout.tsx` — new
- `src/pages/DashboardHome.tsx` — new
- `src/pages/CaptainRoster.tsx` — new
- `src/pages/TurnoutAnalysis.tsx` — new
- `src/pages/PrecinctsPage.tsx` — modify to workboard

## Verification
```bash
cd /Users/patmini/Civic/48th-ward-directory/frontend
npx tsc -b --noEmit   # typecheck
npx vite build          # build
npx oxlint              # lint
```
