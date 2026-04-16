# Task Classification & Model Routing

## The 6 Task Classes

Before executing any task, classify it:

### Class 1: Utility → Tier A (flashlite)
- Extract text, summarize briefly, classify request, reformat notes
- Basic transformations, metadata cleanup, tag generation

### Class 2: Standard Production → Tier B (minimax)
- LinkedIn post draft, short email, episode description
- Community post, lesson summary, basic content

### Class 3: Structured Creation → Tier B/C
- Worksheet draft, lesson slide copy, SOP
- Nurture email, formatted documents, structured outputs

### Class 4: Strategic Growth → Tier C (kimi)
- Funnel strategy, offer positioning, masterclass outline
- Program design, audience messaging, framework creation

### Class 5: High-Stakes Reasoning → Tier D (sonnet)
- Redesigning ecosystem, AI system rules, major business decisions
- Thinking through scale architecture, flagship offer design

### Class 6: Batch / Automation → Tier A/B
- Repurposing (podcast → many assets), processing multiple notes
- Planning on B/C, repeated execution on A/B

## Model Tier Mapping (Current Config)

| Tier | Model | Alias | Use For | Status |
|------|-------|-------|---------|--------|
| A | openrouter/google/gemini-2.5-flash-lite | flashlite | Utility, formatting | ✅ |
| B | openrouter/minimax/minimax-m2.5 | minimax | Standard production | ✅ **Default** |
| C | openrouter/moonshotai/kimi-k2.5 | kimi | Strategic, structured | ✅ Available |
| D | openrouter/anthropic/claude-sonnet-4-6 | sonnet | High-stakes reasoning | ✅ Available |

## Routing Execution

1. **Classify first** — "What class is this task?"
2. **Assign tier** — Match class to tier
3. **Default to B** — Most tasks use minimax
4. **Escalate only if needed** — If minimax can't handle it, go to kimi or sonnet

## Routing Rules

- **Default to Tier B (minimax)** — Your workhorse for 60-75% of tasks
- **Escalate on limitation** — Not preference. If B can handle, stay on B
- **De-escalate after** — Return to lower tier for subsequent steps
- **Split workflows** — Plan on higher tier (kimi/sonnet), execute on lower (minimax)

## How Routing Works

OpenClaw uses one model per agent. The routing is **guidance for me** (the AI) to follow:

- When you give me a task → I classify it
- If Class 1 → I use flashlite logic (but default to minimax for simplicity)
- If Class 2 → I use minimax (default)
- If Class 3 → I may escalate to kimi for structured content
- If Class 4 → I use kimi (Tier C)
- If Class 5 → I use sonnet (Tier D)

**The rule:** Use the lowest-cost model that reliably achieves the outcome.

## Example Routing

| Task | Class | Tier | Model | Notes |
|------|-------|------|-------|-------|
| "Summarize this article" | 1 | B | minimax | Simple enough for default |
| "Write a LinkedIn post" | 2 | B | minimax | Standard production |
| "Create a lesson worksheet" | 3 | C | kimi | Structured, needs good output |
| "Design our new offer" | 4 | C | kimi | Strategic positioning |
| "Map our full ecosystem" | 5 | D | sonnet | High-stakes reasoning |
