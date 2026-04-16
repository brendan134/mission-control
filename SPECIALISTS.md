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
**Role:** Titles, episode outlines, descriptions, clips, repurposing map
**Default Tier:** B (minimax)
**Escalation Tier:** C (kimi)
**Cost Ceiling:** $2/episode
**Use For:**
- Episode titles
- Show notes
- Clips extraction
- Repurposing maps
- Episode outlines

**Reset Rule:** Output episode title and 3 repurposed assets created.

---

## 7. Community Agent
**ID:** `community`
**Role:** The Local Link, member posts, engagement, launch content
**Default Tier:** B (minimax)
**Cost Ceiling:** $1/task
**Use For:**
- The Local Link posts
- Engagement prompts
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
