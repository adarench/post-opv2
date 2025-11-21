# Brand & Design Guidelines

## 1. Core Identity & Emotion
This product should feel like a high-fidelity, real-time monitoring console for recovery, with a sense of precision and calm authority.

### Emotional Goals
- "This is where I check the vitals of my practice"
- "This system is watching for me"
- "If something is wrong, it will surface it—fast and clean"
- "Everything important is visible at a glance"

### Avoid
- SaaS bubbly UI
- Busy dashboards
- Cute icons
- Web-app clutter
- Over-bright, high-saturation colors
- We want a black-glass clinical terminal, not a "website"

## 2. Color System (Dark Mode Only)

### Base Palette
- Background: near-black charcoal (#0B0C0D)
- Surfaces: deep gray layers (#111213 → #181A1C)
- Text Primaries: soft white (#E5E7EB)
- Text Secondaries: muted gray (#9CA3AF)

### Risk Signal Colors
- Green (Stable): #00D686 (mint to emerald, not neon)
- Amber (Review): #FFC14D
- Red (Alert): #FF5F56

### Brand Accent Color
- Electric blue: #3B82F6 (muted enough to not feel sci-fi, but elevated)

## 3. Typography

### Font Style
- Geometric, modern sans-serif: Inter, SF Pro, or similar
- Tight, slightly condensed feeling for "terminal density"

### Hierarchy Principles
- Headers are small but bold (not large, not hero-sized)
- Status and labels carry visual weight
- Monospace for timestamps & metrics (JetBrains Mono, IBM Plex Mono)

### Tone
- Direct, factual, succinct
- Examples: "Stable", "Review recommended", "Attention required"
- No exclamation points. No warmth. Professional calm.

## 4. Layout & Structure Philosophy

### Global Layout
Three anchored regions:
1. Top Command Bar
   - Minimal height
   - High-level system status
   - Filters / modes
2. Main Monitoring Surface
   - The "ticker" or "feed"
   - Vertical list of patient states
   - High density but legible
3. Context Panel
   - Expands for details
   - Secondary to monitoring field

### Movement Philosophy
- 40–100ms transitions
- Single pulse for red alerts
- Quiet, smooth, precise selection shifts
- No jiggly animations

## 5. Component Aesthetic

### Surfaces
- Subtle depth using luminance gradients
- Tiny inner glows
- 1px cool-gray borders
- "Glass cockpit" vibes

### Rows / Lines
- Signal line approach, not cards
- Contains: name, surgery date, day post-op, risk indicator, microtrend summaries
- Slightly taller for readability but not card-like

### Visualizations
- Thin-line sparklines
- Dotted baselines
- Microcharts integrated within text rows
- Inspired by stock tickers and vitals monitors

## 6. "AI-Native" UI Signals

### Intelligence Indicators
- Inline micro-copy summaries
  - "Stable last 3 days"
  - "Slight increase in swelling"
- Movement indicators (arrows, deltas, dots)
- Compressed insights in 1-2 lines

## 7. Interaction Tone
- Crisp, confident, decisive
- Immediate response
- Subtle font shifts
- Minimal hover states
- Single risk color pulse on change

## 8. Brand Pillars
- Calm Surveillance
- Signal Over Noise
- Technical Elegance
- Clinical Integrity
- Always-On Monitoring

## UI Map

### 0. Global Structure
Three anchored sections:
- Top Command Bar
- Main Monitoring Surface (feed)
- Context Panel (detail/drill-down)

### 1. Top Command Bar
- System Status Summary
- View Selector
- Filters
- Optional: Last check-in time, Global search

### 2. Main Monitoring Surface
#### 2.1 Patient Signal List
- Ordered by urgency (Red → Yellow → Green)
- Each row: name, surgery, day post-op, risk indicator, microtrends, last check-in
- Live feed updates

#### 2.2 Interaction Behavior
- Click expands to detail panel
- Main feed remains visible
- One row spotlighted

### 3. Context Panel
#### 3.1 Patient Overview
- Basic info
- Risk score
- Action buttons

#### 3.2 Trend Surface
- Pain/Swelling trends
- Status indicators
- System-generated summary

#### 3.3 Check-In Breakdown
- Today's responses
- Highlighted risks

#### 3.4 Clinical Actions
- Notes
- Visit flagging
- Resolution marking

### 4. Secondary Views
- Enrollment
- Archive
- System Logs
- Settings

### 5. Empty & Edge States
- Clean onboarding
- Stable state indication
- Subtle alert animations

### 6. User Flows
- Quick Triage
- Patient Enrollment
- Detail Investigation

## Design Identity Summary
A dark-mode, clinical monitoring console that feels like a cross between a stock ticker, an observability dashboard, and a patient vital monitor — calm, intelligent, and signal-driven.
