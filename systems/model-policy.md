# Model Policy

## Principle
Use the lowest-cost model that can do the job well.
Use aliases for model selection.
Do not encode routing categories inside config model objects.

## Default Model
- `minimax`

## Alias Map
- `minimax` = `openrouter/minimax/minimax-m2.5`
- `haiku` = `openrouter/anthropic/claude-haiku-4-5`
- `flash` = `openrouter/google/gemini-2.5-flash`
- `deepseek` = `openrouter/deepseek/deepseek-v3.2`
- `kimi` = `openrouter/moonshotai/kimi-k2.5`
- `glm` = `openrouter/z-ai/glm-5`
- `flashlite` = `openrouter/google/gemini-2.5-flash-lite`
- `sonnet` = `openrouter/anthropic/claude-sonnet-4-6`
- `opus` = `openrouter/anthropic/claude-opus-4-6`
- `gpt` = `openrouter/openai/gpt-5-mini`
- `nano` = `openrouter/openai/gpt-5-nano`

## Use Default For
- weekly planning admin
- task capture
- structured drafting
- summaries
- formatting
- extraction
- simple classification
- workflow glue

## Escalate To `haiku` For
- strategy
- planning
- content architecture
- business thinking
- prompt writing
- system design

## Escalate To `flash` For
- high-stakes outputs
- difficult reasoning
- final polished assets
- explicit best-quality requests
- when `haiku` fails twice

## Operating Rule
- config stores aliases and model defaults
- routing logic lives in workflow/policy files
- use aliases consistently across docs, prompts, and scripts
