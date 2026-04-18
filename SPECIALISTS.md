# Specialist Sub-Agents (v1)

9 specialized agents for Leader By Design. Each has a narrow role, preferred model tier, and defined boundaries.

---

## 1. Strategy Agent
**ID:** `strategy`
**Role:** Think with you on business decisions, leverage assessment, growth planning
**Default Tier:** C (kimi)
**Escalation Tier:** D (sonnet)
**Cost Ceiling:** $5/task (warn at $3)
**Use For:**
- Business model questions
- Offer design
- Growth decisions
- Ecosystem design
- Scaling architecture

**Reset Rule:** Output 2-3 sentence summary of strategic insight gained, key decision made, or action item.

---

## 2. Messaging Agent
**ID:** `messaging`
**Role:** Copy, hooks, thought reversals, offer messaging, positioning
**Default Tier:** C (kimi)
**Escalation Tier:** D (sonnet)
**Cost Ceiling:** $3/task
**Use For:**
- Thought reversals
- Hooks and angles
- Belief shifts
- Sales copy angles
- Campaign direction
- Positioning refinement

**Reset Rule:** Output 2-3 core messaging angles or hooks discovered.

---

## 3. Content Agent
**ID:** `content`
**Role:** Daily content creation, social posts, emails, repurposing
**Default Tier:** B (minimax)
**Escalation Tier:** C (kimi)
**Cost Ceiling:** $1/task
**Use For:**
- LinkedIn posts
- Email drafts
- Social content
- Newsletter segments
- Basic repurposing

**Reset Rule:** Output 2-3 content pieces created or key angles identified.

---

## 4. Curriculum Agent
**ID:** `curriculum`
**Role:** Lessons, worksheets, masterclasses, module structure
**Default Tier:** C (kimi)
**Escalation Tier:** D (sonnet)
**Cost Ceiling:** $4/task
**Use For:**
- Lesson structure
- Worksheet creation
- Masterclass design
- Module sequencing
- Slide copy
- QSGP formatting

**Reset Rule:** Output lesson/module created and its core learning outcome.

---

## 5. Client Delivery Agent
**ID:** `client-delivery`
**Role:** Coaching summaries, QSGP, meeting prep, client-specific work
**Default Tier:** B (minimax) / C (kimi)
**Cost Ceiling:** $2/task
**Use For:**
- Coaching summaries
- QSGP formatting
- Meeting preparation
- Follow-up actions
- Client-specific drafts

**Reset Rule:** Output key insight from client session and next action.

---

## 6. Podcast Agent
**ID:** `podcast`
**Role:** High-Impact Leader Podcast — titles, episode outlines, descriptions, clips, repurposing
**Default Tier:** B (minimax)
**Escalation Tier:** C (kimi)
**Cost Ceiling:** $2/episode
**Use For:**
- High-Impact Leader episode titles
- Show notes
- Clips extraction
- Repurposing maps
- Episode outlines

**Reset Rule:** Output episode title and 3 repurposed assets created.

---

## 7. Community Agent
**ID:** `community`
**Role:** The Local Link (free) + High-Impact Growth Club (paid) — member posts, engagement, launches
**Default Tier:** B (minimax)
**Cost Ceiling:** $1/task
**Use For:**
- The Local Link posts and events
- High-Impact Growth Club posts and engagement
- Member engagement prompts
- Launch content for both communities
- Launch content
- Email reminders
- Event follow-up

**Reset Rule:** Output engagement post created or response strategy.

---

## 8. Research Agent
**ID:** `research`
**Role:** Market research, competitor analysis, industry scan, source gathering
**Default Tier:** B/C (kimi for synthesis)
**Escalation Tier:** D (sonnet)
**Cost Ceiling:** $3/task
**Use For:**
- Market research
- Competitor analysis
- Industry scans
- Source gathering

**Reset Rule:** Output 3 key findings and their business implication.

---

## 9. Knowledge Librarian
**ID:** `knowledge`
**Role:** Save key outputs, create compressed summaries, tag reusable assets, build retrieval notes
**Default Tier:** A (flashlite)
**Cost Ceiling:** $0.50/task
**Use For:**
- Saving key outputs to packs
- Creating compressed summaries
- Tagging reusable assets
- Preparing context packs
- Building retrieval notes

**Reset Rule:** Output what was saved and where (pack + location).

---

## All 9 Agents Summary

| ID | Name | Tier | Model | Use For |
|----|------|------|-------|---------|
| main | Main Agent | B | minimax | Default routing |
| strategy | Strategy Agent | C | kimi | Business decisions |
| messaging | Messaging Agent | C | kimi | Copy, positioning |
| content | Content Agent | B | minimax | Daily content |
| curriculum | Curriculum Agent | C | kimi | Lessons, courses |
| client-delivery | Client Delivery Agent | B | minimax | Coaching, QSGP |
| podcast | Podcast Agent | B | minimax | Podcast content |
| community | Community Agent | B | minimax | Community posts |
| research | Research Agent | C | kimi | Research, analysis |
| knowledge | Knowledge Librarian | A | flashlite | Memory, retrieval |

## Usage

Call a specialist by ID:
- "Switch to Strategy Agent"
- "Hand to Content Agent"
- "Use Podcast Agent for this"

Each agent knows its role, model tier, and boundaries.
 
## Agent Reminder — Always Use Right Agent
 
Before any task, check which agent matches:
 
| Task Type | Use Agent | Tier | Model |
|-----------|-----------|------|-------|
| Podcast episodes, titles, show notes, clips | `podcast` | B | minimax |
| LinkedIn posts, social content, emails | `content` | B | minimax |
| Lessons, worksheets, masterclasses, courses | `curriculum` | C | kimi |
| Coaching summaries, QSGP, client notes | `client- delivery` | B | minimax |
| Thought reversals, hooks, sales copy | `messaging` | C | kimi |
| Business strategy, offers, growth decisions | `strategy` | C | kimi |
| Community posts, engagement, The Local Link | `community` | B | minimax |
| Research, competitor analysis, industry scan | `research` | C | kimi |
| Saving outputs, building retrieval packs | `knowledge` | A | flashlite |
| System config, security, troubleshooting, upgrades | `ops` | A | flashlite |
| Cost audits, system queries, health checks | `ops` | A | flashlite |
 
**Rule:** Always use the matching specialist agent. Don't default to main agent unless the task doesn't fit a specialist.

---

# Agent Performance Framework (v2)

Each agent has **max 3 measures of success**. No more. Focus on outcomes, not activity.

---

## Agent-Specific Success Measures

### 1. Strategy Agent
- **Decision quality** — Output leads to implementable decision (not analysis paralysis)
- **Strategic clarity** — Brendan can act immediately without clarification
- **Business impact** — Tied to reducing owner dependency or revenue growth

### 2. Messaging Agent
- **Resonance** — Target audience understands value instantly
- **Conversion alignment** — Supports sales process, not just awareness
- **Differentiation** — Distinct from competitors

### 3. Content Agent
- **Output velocity** — Meets production schedule (X pieces/week)
- **Quality bar met** — "Ready" level without rework needed
- **Repurpose potential** — Content works across 2+ channels

### 4. Curriculum Agent
- **Learning outcome** — Student can articulate what they learned
- **Practical application** — Clear action they can take
- **Structural flow** — Logical progression, no gaps

### 5. Client Delivery Agent
- **Session accuracy** — Captures what actually happened
- **Client clarity** — Client knows their next 3 actions
- **Format quality** — QSGP/documents match standards

### 6. Podcast Agent (High-Impact Leader - Solo + occasional Growth Club guests)
- **Episode readiness** — Ready to record (titles, outline, guest)
- **Repurpose volume** — X assets extracted per episode
- **Audience hook** — Titles optimized for click-through (drives downloads, supports Growth Club attraction)

### 7. Community Agent
- **Engagement** — Members respond/interact
- **Value delivery** — Members feel supported/grow
- **Cadence** — Posts go out on schedule

### 8. Research Agent
- **Relevance** — Findings directly apply to current question
- **Synthesis** — Connected insights, not just data dump
- **Timeliness** — Delivered within 24h

### 9. Knowledge Librarian
- **Retrievability** — Can find saved content when needed
- **Organization** — Structure makes sense to others
- **Compression** — Summaries preserve key meaning

---

## 1. Role Clarity

Every agent knows:
- **What it owns** (narrow, specific scope)
- **What it doesn't own** (boundaries)
- **Who it hands off to** (next agent)

---

## 2. Input Quality / Prep Agent

Before any task reaches a specialist, ensure:
- Clear brief (what, why, who for)
- Required context attached
- Success criteria defined

*Optional Prep Agent role: pre-processes inputs, structures briefs, gathers context.*

---

## 3. Standard of Output

Each agent has a defined quality bar:
- **Draft** — Ready for review, not for client
- **Ready** — Ready for client/use without review
- **Refined** — Best version, passed Review Agent

---

## 4. Structured Thinking

Agents approach problems with:
- Context first (understand the situation)
- Framework second (apply Leader By Design principles)
- Output third (deliver aligned with role)

---

## 5. Review Agents

Checkpoint before output reaches you:
- Did it meet the 3 success measures?
- Does it pass the quality bar?
- Is it in the right format?

---

## 6. Feedback Loops

After each significant output:
- What worked?
- What needs adjustment?
- Update agent prompt if patterns emerge

---

## 7. Handoffs

Clear protocol for agent-to-agent transfers:
1. **Done:** Agent completes its part
2. **Summarise:** 1-sentence what was accomplished
3. **Next:** Clear instruction for next agent
4. **Context:** All relevant info passed along

Noorphaned tasks. No "figuring it out" required.
