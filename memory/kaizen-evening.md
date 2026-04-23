## Kaizen Evening Suggestion - April 23, 2026

### What I Analyzed
- The 16-agent team structure (Tier A/B/C) and Agent Orchestrator routing logic
- Current single-agent routing limitation vs. documented multi-agent workflow vision
- Task accountability system with stale/escalation tracking (Phase 2 implemented)
- Mission Control's workflow state visualization (intake → analyzing → prep → active → review → completed → archived)
- Existing handoff principles from SPECIALISTS.md (Done → Summarise → Next → Context)
- Current gap: Multi-agent workflows exist in concept ("Ethan → Lucas → Jay → Sophie") but no implementation path

### The Suggestion
**Implement Workflow State Persistence for Multi-Agent Handoffs**

**Why this matters:** Multi-agent workflows are the key to true owner independence. Currently, even though the system can route to the "best-fit agent," complex tasks that span multiple domains (e.g., "write LinkedIn post + create YouTube video + review") still require Brendan to manually coordinate handoffs between agents. By implementing persistent workflow state with explicit handoff queues, the system could chain agents automatically—reducing a 4-step task from 4 separate Brendan touchpoints to 1 initial request. This directly advances the North Star: Brendan delegates once, the system manages the cascade.

**What to do:** Create a `workflows` table/state store that tracks multi-agent jobs:
- **Workflow definition**: Parse compound requests ("and", "then", "also") into ordered agent chains
- **State per step**: Track which agent has it, completion status, summary output, context passed forward
- **Handoff trigger**: When an agent completes its step, automatically queue the next agent with full context
- **Blocking/escalation**: If a step stalls 24h/48h/72h, escalate per existing rules
- **View in Mission Control**: Add "Active Workflows" view showing pipeline progress (like the cron calendar but for multi-agent jobs)

Start small: Support 2-agent chains first (e.g., Ethan writes → Sophie reviews), then extend. Use the existing `findBestAgent()` logic to auto-assemble chains from natural language requests.

**Effort:** Medium (4-6 hours to prototype persistence layer, 2-3 days for full UI and 3+ agent chains)
**Impact:** High (eliminates coordination overhead for 40-60% of complex requests; enables true "delegate and forget" operations)
