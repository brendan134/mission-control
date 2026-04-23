# Leader By Design - Priority Map

**Purpose**: Help business owners build self-managing teams, stronger accountability, and scalable performance.

**North Star**: Help owners step out of the day-to-day and build self-managing teams.

**Source of Truth**: See Team page in Mission Control (`/team`) for the complete list of humans and AI agents.

---

## Ownership Boundary

This file owns:
- People importance (humans + AI agents)
- Program/initiative importance
- Urgency level definitions
- Action mode guidance

This file does NOT own:
- Task storage mechanics (see Tasks page)
- Reply wording or content creation
- Meeting-note ingestion procedure
- Cron timing or retries

---

## How to Use This File

When a new signal arrives (email, Slack, calendar, tasks, meeting notes):

1. Map it to zero or more **people** (human or AI agent)
2. Map it to zero or more **programs** (initiatives)
3. Assign an **urgency level**
4. Choose the **action mode**

If a signal maps to no important people and no important programs, it should usually be ignored or batched.

---

## Urgency Levels

| Level | Description | When to Use |
|-------|-------------|-------------|
| **P0 — Interrupt Now** | Time-sensitive, high-stakes, or blocking | Hard deadline within 24h, revenue impact, client crisis |
| **P1 — Same Day** | Important enough to surface today | Needs attention today, but not blocking |
| **P2 — Digest / Batched** | Worth tracking, but not urgent | Good to know, can wait for structured summary |
| **P3 — Ignore / Archive** | Low-value noise | Newsletters, notifications, duplicative context |

---

## Action Modes

| Mode | Description |
|------|-------------|
| **Interrupt Now** | Surface directly - short, clear alert |
| **Handle and Summarize** | Act, then give concise update if helpful |
| **Queue for Digest** | Hold for next structured summary/heartbeat |
| **Ignore** | No user-facing message needed |

---

## People (Human Team)

### Tier A - Leadership
| Person | Why They Matter | Escalate to P0 When |
|--------|-----------------|---------------------|
| **Brendan** | Founder, decision-maker, sets direction | Hard deadline <24h, revenue blocked, strategic decision needed |
| **Niles (AI)** | Chief Agent Officer, oversees all agent operations | System down, critical agent failure, routing breakdown |

### Tier B - Heads of Function
| Person | Why They Matter |
|--------|-----------------|
| **Kaizen** | Head of Improvement - daily business suggestions |
| **Casey** | Head of Operations - system maintenance, cron, automation |
| **Marcus** | Head of Strategy - priorities, goal alignment |
| **Sophie** | Head of Content - production, LinkedIn, newsletters |
| **Brandon** | Head of Messaging - copy, offers, email marketing |
| **Jerry** | Client Delivery Lead - project delivery, QA |

### Tier C - Specialists
| Person | Area |
|--------|------|
| **Kathy** | Curriculum & Training |
| **Ruby** | Podcast Production |
| **Mia** | Newsletter |
| **Ethan** | LinkedIn Content |
| **Lucas** | Video Scripts |
| **Jay** | YouTube |
| **Zoe** | Email Sequences |
| **Lawrie** | Community |
| **Tim** | Research |

### External Team (Philippines/India)
| Person | Role |
|--------|------|
| **Kriz** | Team Leader (Philippines) |
| **Dom** | General VA |
| **Lazelle** | General VA |
| **Phoenix** | Copywriter |
| **Eunice** | Social Media |
| **Mervyn** | Video/Audio Editor |

---

## AI Agent Routing Reference

**Source of Truth**: Team page (`/team`)

When a task arrives, route to the appropriate agent:

| Task Type | Route To |
|-----------|----------|
| Strategy & Planning | Marcus (Head of Strategy) |
| Copy & Messaging | Brandon (Head of Messaging) |
| Content Production | Sophie (Head of Content) |
| Course/Curriculum | Kathy (Curriculum) |
| Client Delivery | Jerry (Client Delivery) |
| Podcast Production | Ruby (Podcast) |
| Community Management | Lawrie (Community) |
| Research & Analysis | Tim (Research) |
| Knowledge & Documentation | Knowledge Agent |
| Technical/Operations | Casey (Operations) |
| Business Improvement | Kaizen (Improvement) |

---

## Programs / Initiatives

| Program | Why It Matters | Priority |
|---------|----------------|----------|
| **Growth Club** | Core coaching offer, revenue driver | P0 |
| **High-Impact Leader Podcast** | Content & thought leadership | P1 |
| **Content Engine** | LinkedIn, newsletter, YouTube | P1 |
| **Agent System** | Operational backbone, reduces owner dependency | P0 |
| **Client Deliverables** | Revenue, reputation | P0 |
| **Team Development** | Build self-managing teams | P1 |

---

## Decision Rules

### Auto-Resolve (Act without asking)
- Update task status
- Route task to correct agent
- Handle scheduling/calendar updates
- Send routine confirmations
- Archive handled emails

### Draft and Ask (Get approval first)
- Client communications
- Strategic decisions
- Content in Brendan's voice
- Financial commitments
- Press/public-facing messages

### Escalate (Niles handles or alerts Brendan)
- System outages
- Revenue-impacting issues
- Client escalations
- Strategic pivots
- High-priority opportunities

---

## North Star Alignment

Every action should be evaluated against:

> **Does this help the business owner step out of the day-to-day?**

- ✅ Automates repetitive tasks
- ✅ Routes work to right specialist
- ✅ Builds accountability in team
- ✅ Enables scalable performance

- ❌ Creates more work for owner
- ❌ Bypasses agent system
- ❌ Requires owner micro-management

---

## Integration Principle

**We always integrate INTO our system, not force our system into someone else's shape.**

When adopting ideas from external sources (like clawchief):
- Reference existing Mission Control data (Team, Tasks, Agent Orchestrator)
- Never duplicate source of truth
- Adapt the framework to fit our existing infrastructure
- If it requires replacing what we have, reconsider the approach