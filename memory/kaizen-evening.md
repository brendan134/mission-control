## Kaizen Evening Suggestion - April 25, 2026

### What I Analyzed
- **Agent Framework**: 16 agents across 3 tiers, clearly defined roles/capabilities in agent-registry.ts
- **Agent Orchestrator**: Currently routes tasks to single best-fit agent via keyword matching
- **Workflow States**: Defined (intake → analyzing → prep → active → review → completed → archived) but only visual
- **Multi-Agent Context**: The system has `handoffTo` fields in agent definitions but NO actual workflow execution
- **Mission Control**: Task management, Signal Feed for blocked items, checklist system implemented
- **Specialist Documentation**: SPECIALISTS.md has 7 pillars including handoff protocol (Done → Summarise → Next → Context)
- **Daily Operations**: Content production workflow exists but requires manual coordination between agents

### The Suggestion
**Implement Agent Workflow Chains: Declarative Multi-Agent Execution**

**Project ID:** `proj-1776207926512-awfchain`
**Strategic Priority:** AI Operating System (Scale) (`strat-1776050306440-lyukdbl5t`)

**Why this matters:** The North Star is building self-managing teams and reducing owner dependency. Currently, even simple multi-step tasks (e.g., "create LinkedIn post + YouTube video") require Brendan to manually route between agents. A workflow chain system would let agents hand off automatically—Ethan drafts, Lucas scripts, Jay optimizes, Sophie reviews—Brendan only sees the final approved output. This transforms 16 individual agents into a true self-managing team.

**What to do:** 
1. Create a `workflow-chains.yml` format defining common sequences (content-package, podcast-episode, email-sequence)
2. Add a workflow engine to Agent Orchestrator that tracks which step is active and auto-triggers next agent
3. Include pause gates at "review" state whereSophie or Niles validates before continuing
4. Build a visual pipeline view in Mission Control showing active workflows, current agent, and next handoff
5. Start with ONE chain: "LinkedIn + Script + YouTube Package" as proof of concept

**Effort:** Medium
**Impact:** High
