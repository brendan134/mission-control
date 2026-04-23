# Leader By Design - Auto Resolver

**Purpose**: Define when the AI should automatically resolve a signal, when to draft and ask, and when to escalate.

**Related**: See `business/priority-map.md` for who/what matters and how urgent.

---

## Core Principle

After classifying a signal, prefer to **resolve the obvious next step** instead of merely summarizing it.

- Do low-risk operational work in the same turn when authority is clear
- Update the relevant source of truth as part of doing the work
- Interrupt Brendan only when judgment, approval, ambiguity, or sensitivity requires it

---

## Resolution Modes

| Mode | When to Use |
|------|-------------|
| **1) Auto-Resolve Now** | Low-risk, operationally clear, reversible |
| **2) Draft and Ask** | Next step is clear, but principal should approve |
| **3) Escalate Without Acting** | Too much ambiguity, risk, or missing authority |
| **4) No Action / Archive** | Noise, duplicative, or not worth surfacing |

---

## Safe Auto-Resolve Lane

**Auto-resolve when ALL of these are true:**
- ✅ Signal is clearly understood
- ✅ Correct source of truth is known
- ✅ Action is operational, not strategic
- ✅ Authority is already clear
- ✅ Mistake would be low-cost and recoverable

### Examples of Safe Auto-Resolve
- Update task status in Mission Control
- Route task to correct specialist agent
- Create follow-up reminder task
- Send scheduling confirmations
- Archive handled emails
- Run scheduled cron jobs (Kaizen, news brief, etc.)

---

## Draft-First Lane

**Draft and ask when:**
- Next step is visible but judgment call is Brendan's
- Wording matters more than logistics
- Client-facing communication
- Strategic content in Brendan's voice

### Examples Requiring Approval
- Client project proposals
- Strategic pivots
- Press/podcast/public responses
- Financial commitments
- Pricing decisions
- Content in Brendan's voice

---

## Escalate-Without-Acting Lane

**Escalate when:**
- Authority is unclear
- Signal is contradictory or incomplete
- Reputational, legal, or financial risk
- Would expose private context
- No reliable source of truth

### Examples Requiring Escalation
- System outages affecting service
- Client complaints/escalations
- Revenue-impacting issues
- Security concerns
- Data integrity issues

---

## Auto-Resolve Workflow

1. **Read Priority Map** → Who/what matters, how urgent
2. **Check Source of Truth** → Team page, Tasks, Calendar
3. **Classify the Signal** → Map to person + program + urgency
4. **Choose Resolution Mode** → Auto-resolve, draft, escalate, or ignore
5. **Act Accordingly**:
   - Auto-resolve: Do the work, update source of truth
   - Draft: Prepare recommendation, ask for minimum needed
   - Escalate: Send crisp summary with blocker and recommendation

---

## Source of Truth Rules

**Never auto-resolve from memory alone.** Always ground in live data:

| Domain | Source |
|--------|--------|
| Task state | Mission Control Tasks page |
| Team roster | Mission Control Team page |
| Agent routing | Agent Orchestrator |
| Calendar | Google Calendar |
| Email | Gmail |
| Priorities | `business/priority-map.md` |

---

## Output Guidelines

When auto-resolve succeeds, be brief:

✅ Good examples:
- "Routed to Marcus for strategic review."
- "Created task for Casey - system maintenance."
- "Updated task status to Complete."

❌ Avoid:
- "I noticed you might want to consider..."
- Over-explaining trivial actions
- Asking questions you can answer yourself

---

## North Star Check

Before every action, ask:

> **Does this move the owner closer to stepping out of the day-to-day?**

If yes → Auto-resolve
If no → Route to appropriate agent
If unclear → Escalate to Niles for decision