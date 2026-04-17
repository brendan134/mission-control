---
name: agent-evaluator
description: Evaluate and score agent outputs for quality assurance. Use when: (1) reviewing agent performance, (2) quality assurance checks, (3) monthly agent reviews.
---

# Agent Evaluator

Evaluate specialist agent outputs to ensure world-class quality.

## What This Does

Review outputs from the 9 specialist agents + Kaizen to:
- Score output quality (1-5)
- Identify improvement areas
- Track performance trends
- Refine agent prompts

## Evaluation Criteria

| Criterion | Score | Description |
|-----------|-------|-------------|
| Accuracy | 1-5 | Correct information, no errors |
| Relevance | 1-5 | Directly addresses the request |
| Clarity | 1-5 | Easy to understand, well-structured |
| Actionability | 1-5 | Ready to use, no rework needed |
| Efficiency | 1-5 | Concise, no unnecessary content |

## How to Evaluate

1. Get the agent output to review
2. Score each criterion (1-5)
3. Calculate average score
4. Note specific feedback
5. Log to agent-scorecard.md

## Scorecard Format

```markdown
# Agent Scorecard - [MONTH]

## [Agent Name]
- **Period:** [Date range]
- **Tasks Reviewed:** [Count]
- **Average Score:** [X/5]
- **Accuracy:** [X/5]
- **Relevance:** [X/5]
- **Clarity:** [X/5]
- **Actionability:** [X/5]
- **Efficiency:** [X/5]

### Strengths
- [What the agent does well]

### Areas for Improvement
- [What needs work]

### Prompt Refinements
- [Any changes to agent definition]
```

## Daily Evaluation (Kaizen can do this)

Each day, Kaizen should:
1. Pick one agent's output from recent work
2. Evaluate using the criteria above
3. Log to scorecard
4. Flag any urgent issues

## Monthly Review (HEARTBEAT)

Monthly (first Friday):
1. Aggregate all scores for each agent
2. Identify trends (improving/declining)
3. Review prompt refinements needed
4. Update SPECIALISTS.md if needed

## Current Agent List

| ID | Name | Role |
|----|------|------|
| strategy | Marcus | Head of Strategy |
| messaging | Alex | Messaging Specialist |
| content | Sarah | Head of Content |
| curriculum | Emily | Learning Design |
| client-delivery | Jordan | Client Delivery Lead |
| podcast | Chris | Media Production |
| community | Sam | Community Manager |
| research | Taylor | Research Analyst |
| knowledge | (Knowledge Librarian) | Memory/Retrieval |
| kaizen | Kaizen | Business Improvement |

## Output Location

Save to: `business/agent-scorecard.md`

Create if doesn't exist.