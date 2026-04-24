## Kaizen Evening Suggestion - April 24, 2026

### What I Analyzed
- SPECIALISTS.md: 9 agent definitions with clear roles and handoff protocols (v1)
- SignalFeed.tsx: Task accountability system with stale detection working well
- Daily logs (Apr 24): 38+ coaching call extractions showing parallel workflow demands
- Current system: Single-agent routing works; multi-step tasks require manual intervention
- This week's focus: Multi-agent workflow enhancement (Ethan → Lucas → Jay → Sophie example)

### The Suggestion
**Workflow Orchestrator for Multi-Agent Pipelines**

**Why this matters:** Your North Star is reducing owner dependency and building self-managing teams. Right now, when a task needs multiple agents (e.g., "create LinkedIn post + YouTube video"), either Brendan routes each handoff manually, or agents work in isolation. A Workflow Orchestrator would let complex deliverables flow automatically through agent chains—Ethan (content) passes to Lucas (script), who passes to Jay (YouTube), who passes to Sophie (review)—all without owner intervention. This turns 9 individual contributors into one coordinated team.

**What to do:** Build a lightweight workflow pipeline system:

1. **Create workflow definitions** as JSON/YAML files in `/workflows/pipelines/` (e.g., `content-to-youtube.json`)
2. **Add `workflow` field to tasks** - when a task has `workflow: "content-multi-format"`, the Orchestrator takes over
3. **Handoff protocol v2** - each agent outputs: `status: done`, `summary: "3 script angles created"`, `next_agent: "jay-youtube"`, `context_passed: {...}`
4. **Mission Control UI** - add a "Pipeline View" tab showing tasks flowing through agent stages (like a Kanban but horizontal, showing handoffs)
5. **Start with ONE pipeline** - pick the highest-frequency multi-agent workflow (likely: podcast episode → clips → social posts →的一周 content batch)

**Technical approach:**
- Reuse existing Signal Feed infrastructure
- Add `/api/workflows/trigger` endpoint
- Store pipeline state in simple JSON (agent → stage → status)
- No complex orchestration engine—just clear handoff contracts

**Effort:** Medium (2-3 days focused build, learning reusable pattern)
**Impact:** High (enables true team behavior, reduces owner as bottleneck by 60%+ on multi-step tasks)

---
*Alternative considered:* Building better single-agent prompts. Rejected because 9 good individual agents won't solve the coordination problem—it's a handoff architecture issue, not an agent capability issue.
