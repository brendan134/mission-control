# Post-Coaching Accountability Engine

**Strategic Priority:** Systemised Program Delivery  
**Status:** In Progress  
**Created:** 2026-04-27

## Vision
A done-for-you accountability system that extracts action items from coaching calls, tracks client progress, and escalates only when truly blocked — reducing admin burden while improving client outcomes.

## Outcome
1. **Internal Tool:** Reduce Brendan's follow-up admin by 50%
2. **Standalone Product:** Offer as a premium add-on or white-label tool for other coaches

---

## Project Phases

### Phase 1: Quick Win — Post-Call Action Extractor ✅ STARTING
**Goal:** Extract action items from transcripts into a clean, actionable list with due dates.

**Tasks:**
- [ ] 1.1 Define action item extraction prompt/algorithm
- [ ] 1.2 Build extraction script that parses V2 transcripts
- [ ] 1.3 Output format: Clean list with Owner, Action, Due Date, Priority
- [ ] 1.4 Test on 5 existing transcripts
- [ ] 1.5 Create simple UI/display in Mission Control

**Success Criteria:** Can process any V2 transcript and output usable action list within 30 seconds.

---

### Phase 2: Client-Facing Dashboard
**Goal:** Give clients visibility into their commitments and progress.

**Tasks:**
- [ ] 2.1 Create client portal page in Mission Control
- [ ] 2.2 Show "My Actions" with status (Pending, In Progress, Complete, Blocked)
- [ ] 2.3 Add weekly check-in prompt system (email/Slack/WhatsApp)
- [ ] 2.4 Implement completion tracking (% committed vs % complete)
- [ ] 2.5 Add escalation logic (auto-escalate to Brendan if blocked 48h+)

**Success Criteria:** Clients can self-serve their action status without Brendan chasing.

---

### Phase 3: Analytics & Insights
**Goal:** Provide coaching insights based on action patterns.

**Tasks:**
- [ ] 3.1 Track repeat action themes across clients
- [ ] 3.2 Identify "stuck" patterns (same actions rolling over)
- [ ] 3.3 Generate coaching insights report (topics to address)
- [ ] 3.4 Add ROI metrics (actions completed vs business outcomes)

**Success Criteria:** Brendan can see coaching effectiveness at a glance.

---

### Phase 4: Standalone Product (Optional)
**Goal:** Package for other coaches as a white-label tool.

**Tasks:**
- [ ] 4.1 Define product tiers (Basic, Pro, White-Label)
- [ ] 4.2 Create landing page/one-pager
- [ ] 4.3 Build multi-tenant architecture
- [ ] 4.4 Set pricing model
- [ ] 4.5 Pilot with 2-3 trusted coaches

**Success Criteria:** At least 3 external coaches using the tool.

---

## Quick Win Progress

### 1.1 — Define extraction prompt
**Status:** Ready to start

**Approach:**
- Parse V2 transcript for "Action Items" section
- If missing, use AI to extract from "Key Topics" + "Key Quotes"
- Output structured JSON: `{owner, action, due_date, priority}`

---

## Notes
- Based on pattern across 290+ coaching calls: 80%+ mention action follow-up issues
- Differentiator: Most coaches use generic CRMs; this is purpose-built for coaching
- Quick win can be tested with existing V2 transcripts immediately