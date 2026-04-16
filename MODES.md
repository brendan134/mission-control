# Operating Modes

Switch between spending modes based on context.

## The 3 Modes

### Lean Mode
**Trigger:** "lean day", "admin day", "testing", "quiet day"

- Default to Tier A (flashlite) and Tier B (minimax)
- Tier C (kimi) requires justification
- Tier D (sonnet) requires explicit approval
- Aggressive context pruning
- Summary before reset every time
- **Target spend:** <$2/day

### Standard Mode
**Trigger:** "standard day", "normal day", or no mode specified

- Default to Tier B (minimax) — 60-75% of tasks
- Tier C (kimi) allowed for Class 3-4 tasks
- Tier D (sonnet) only for Class 5 (high-stakes)
- Normal caching and context management
- **Target spend:** $3-5/day

### Sprint Mode
**Trigger:** "sprint", "launch week", "build week", "strategy day"

- Allow more Tier C (kimi) use for planning
- Tier D (sonnet) allowed for high-leverage work
- Larger token thresholds
- Post-sprint summary and cost review
- **Target spend:** $5-10/day (worth it for leverage)

## How to Switch

Just tell me which mode:
- "Today is a lean day"
- "Running in standard mode"
- "This is sprint week — we're building the new offer"

Or I may suggest a switch based on context:
- "This looks like a sprint-level task. Switch to Sprint Mode?"

## Mode Awareness

I track which mode we're in and will:
- Default to Standard if no mode specified
- Confirm mode on switch
- Warn if spending outside mode bounds
- Suggest mode changes when context shifts