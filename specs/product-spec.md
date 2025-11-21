# Post-Op Monitoring System Specification

## Value Proposition
Surgical practices lose a surprising amount of time and money to unnecessary post-op visits and nonstop reassurance calls. Most patients can't tell whether their swelling, bleeding, or numbness is normal, so they flood the front office with calls or book appointments they don't actually need. This clogs the schedule, eats staff time, and displaces higher-value procedures.

A lightweight post-op monitoring system solves this by giving patients simple daily check-ins and clear guidance, reducing uncertainty before it turns into a phone call or an unnecessary visit. Surgeons get early visibility into the few cases that actually need attention, while the majority are managed automatically. The end result is fewer low-value appointments, smoother clinic flow, and more capacity for revenue-producing work — without adding staff or changing the EMR.

## 1. Stakeholders & Their Jobs

### 1.1 Surgeon
- Wants quick visibility into which patients actually need attention
- Wants fewer unnecessary visits and calls
- Needs a fast way to drill into a specific patient's history if they're worried

### 1.2 Front Office / Clinical Staff
- Handles phone calls, scheduling, and basic triage
- Needs a clear list of:
  - who's "red" and may need to be seen
  - who's clearly fine and doesn't need an appointment
- Needs a way to document "we saw this and handled it" to close the loop

### 1.3 Patient
- We already covered: daily check-in, reassurance, clear "when to worry"
- We'll now design features for all three

## 2. Core System Concepts
These are the primitives everything else rests on:
- Patient: a person enrolled in post-op monitoring
- Procedure / Protocol: defines which questions they get, how often, and what "normal" looks like for that surgery
- Daily Check-In: patient's responses for a given day
- Risk Score / Risk Level: result of evaluating a check-in (e.g., Green / Yellow / Red)
- Alert: a risk event that requires human review
- Status: tracking whether a given alert has been acknowledged/handled

## 3. Features by Role

### 3.1 Patient-Facing Features (Summary)
You already have this, but in system terms:
- Enrollment via front office (no patient account)
- Receive daily SMS check-in
- Answer brief structured questions
- Immediate feedback:
  - "You look on track"
  - "Watch X, do Y, if Z happens reply 'CONCERN'"
- Always-available "reply CONCERN" escape hatch
- Option to upload photo when things look off
- Opt-out when recovery is complete

### 3.2 Surgeon / Staff Dashboard (Admin View)
This is the admin/control layer that ties it all together.

#### 3.2.1 Today View (Risk Overview)
Purpose: Front office + surgeon see who needs attention at a glance.

Features:
- Patient list for today with:
  - Name
  - Surgery type
  - Surgery date (e.g., "Day 3 post-op")
  - Latest risk level (Green / Yellow / Red)
  - Time of last check-in
  - Status: "New", "In review", "Resolved"
- Sorting & filtering:
  - Filter by risk (show Red first, then Yellow)
  - Filter by surgeon (if multi-surgeon practice)
  - Filter by day post-op (e.g., Day 1–3)
- Quick actions on each row:
  - "View details"
  - "Mark resolved"
  - "Add note"
  - "Schedule follow-up" (even if this just means "we marked that we booked them" in MVP)

#### 3.2.2 Patient Detail View
Purpose: Give surgeon/staff enough context to decide "Do we need to see them or not?"

Features:
- Basic info:
  - Name, age (optional), contact
  - Procedure type (e.g., "Bilateral sagittal split osteotomy" / "Wisdom tooth extraction")
  - Surgery date, which surgeon
- Recent check-in history:
  - Last 7 days (or last N responses):
    - Date
    - Risk level
    - Key symptoms (pain, swelling, bleeding, etc.)
    - Trend snapshot (even just textual: "Pain down from 8→4 over last 3 days")
- Today's responses in full:
  - Each question + answer
  - Highlighted risk factors (e.g., red text for "increased bleeding")
- Photo gallery (if implemented):
  - Most recent photo prominently shown
  - Ability to view prior photos
- Actions:
  - "Call patient" (click-to-call from browser/mobile)
  - "Mark as handled" (closes today's alert)
  - "Add internal note" (e.g., "Called, reassured, no visit needed")
  - "Escalate to in-person visit" (maybe just toggles a flag like "Visit recommended")

#### 3.2.3 Enrollment & Management
Purpose: Make it easy for staff to put patients into the system and keep it clean.

Features:
- Add patient:
  - Name, phone number
  - Procedure type (select template)
  - Surgery date
  - Surgeon
- Assign monitoring protocol:
  - E.g., "Wisdom tooth extraction – standard"
  - Defines question set + duration (e.g., 7-day monitoring)
- Pause / stop monitoring:
  - For patients who are fine or had their final check-up
  - Adds a reason (e.g., "Recovered", "Lost to follow-up")

## 4. Risk Flagging & Profile Logic (Feature-Level)
This is not ML for now — just explicit rules and config.

### 4.1 Risk Levels
- Green – All answers normal / improving
- Yellow – Borderline or mild worsening; staff should eyeball
- Red – Clearly concerning; needs prompt review

### 4.2 Rule-Based Triggers (Examples)
Rules can be defined per protocol, but sample logic:

Pain:
- Red if pain ≥ 8 OR increase of ≥ 3 compared to yesterday
- Yellow if pain 5–7 but stable

Swelling:
- Red if patient indicates "much worse than yesterday"
- Yellow if "slightly worse than yesterday" on Day 3+

Bleeding:
- Red if "persistent bleeding" or "large clots"
- Yellow if "spotting but not stopping"

Numbness:
- Red if new numbness appears or expands
- Yellow if existing numbness feels "about the same"

Fever:
- Red if "yes" to fever or "feels hot and unwell"

These rules:
- Generate a risk level per check-in
- Generate one or more risk tags, like:
  - RISK_PAIN_SPIKE
  - RISK_BLEEDING
  - RISK_FEVER
  - RISK_SWELLING_WORSE
- Those tags can be shown on the dashboard for quick triage

## 5. Workflow Features (End-to-End)
Putting it all together as system behavior, not UI:

### 5.1 Daily Workflow
- System sends check-ins to all enrolled patients for that day
- Patients respond via SMS/web form
- Each response runs through risk engine:
  - assign risk level + tags
- Dashboard updates:
  - Red at the top, then Yellow, then Green
- Front office triages:
  - Reviews Red first
  - Leaves Greens mostly alone
  - For each Red/Yellow:
    - Staff opens patient detail
    - Calls or messages patient if needed
    - Marks as handled / adds note
- Surgeon only gets involved for:
  - Red cases
  - Tagged issues staff aren't comfortable closing

### 5.2 Alerting
For Red cases:
- Optional feature: send email/SMS/notification to staff/surgeon
- Or just rely on dashboard for MVP

### 5.3 Historical View (Lightweight)
Features:
- View past patients & their monitoring history
- Filter by date range or procedure type
- Eventually could support "we've prevented X emergency visits" – but for MVP, it's just a basic history log

## 6. Feature Priorities (What's Essential vs. Nice-to-Have)
If you need a quick sense of scope:

### Must-Have for MVP:
- Patient enrollment
- Daily SMS check-in + structured responses
- Basic risk rules → Green/Yellow/Red
- Today dashboard with risk sorting
- Patient detail view with last few days and notes
- Mark-as-handled

### Nice-to-Have:
- Photo upload
- Rich history view
- Notification system for Red alerts
- Recovery milestone tips
- Basic analytics ("X% of patients never went above Yellow")
