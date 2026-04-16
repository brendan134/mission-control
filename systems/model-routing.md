# Model Routing Policy

## Principle
Route models using aliases at the workflow and operating-policy layer.
Do not embed routing categories inside model objects in config.

## Tier Mapping
- Tier A (cheap default): `minimax`
- Tier B (strong reasoning): `haiku`
- Tier C (premium fallback): `flash`

## Alias Map
- `minimax` = `openrouter/minimax/minimax-m2.5`
- `haiku` = `openrouter/anthropic/claude-haiku-4-5`
- `flash` = `openrouter/google/gemini-2.5-flash`

## Usage Guidance
### Tier A — `minimax`
Use for:
- chat replies
- formatting
- summaries
- extraction
- simple classification
- workflow glue

### Tier B — `haiku`
Use for:
- strategy
- planning
- content architecture
- business thinking
- prompt writing
- system design

### Tier C — `flash`
Use for:
- high-stakes outputs
- difficult reasoning
- final polished assets
- when Tier B fails twice
- explicit best-quality requests

## Routing Logic
- Default agent tasks → `minimax`
- Planning / architect / long-context tasks → `haiku`
- Explicit best quality or failure fallback → `flash`

## Practical Rule
Do not optimise by constantly switching models manually.
Optimise by routing tasks by job type.

## Why
This gives:
- lower spend
- cleaner logs
- more predictable outputs
- easier migration later

## Config Rule
Keep config simple:
- aliases only in model objects
- routing logic in workflow/policy files
- avoid spreading API auth across too many places
