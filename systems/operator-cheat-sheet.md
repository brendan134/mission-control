# Operator Cheat Sheet

## Purpose
Quick-reference guide for operating the Leader By Design AI system.
Designed for later inclusion in the Mission Control Docs menu.

---

## Core Operating Rule
Nothing important should live only in chat.
If it matters, save it into a system file.

---

## Model Routing
Use aliases, not raw model IDs, in day-to-day operating language.

### Default Model
- `minimax`

### Escalation Models
- `haiku`
- `flash`

### Alias Map
- `minimax` = cheap default
- `haiku` = strong reasoning
- `flash` = premium fallback
- `deepseek` = alternate reasoning option
- `kimi` = alternate model option
- `glm` = alternate model option
- `flashlite` = lighter Gemini option
- `sonnet` = stronger Anthropic option
- `opus` = premium Anthropic option
- `gpt` = GPT mini option
- `nano` = cheapest GPT option

### When to Use `minimax`
- chat replies
- formatting
- summaries
- extraction
- simple classification
- workflow glue

### When to Use `haiku`
- strategy
- planning
- content architecture
- business thinking
- prompt writing
- system design

### When to Use `flash`
- high-stakes outputs
- difficult reasoning
- final polished assets
- when `haiku` fails twice
- explicit best-quality requests

### Routing Rule
- default tasks → `minimax`
- planning / architecture / long-context → `haiku`
- best-quality / final-polish / fallback → `flash`

---

## File Rules
Save valuable outputs into files such as:
- `systems/`
- `workflows/`
- `templates/`
- `projects/`
- `business/`
- `context/`

### Use `systems/` for
- operator rules
- model policy
- reusable system logic
- SOP-style operating guidance

### Use `workflows/` for
- repeatable processes
- step-by-step execution patterns

### Use `templates/` for
- reusable forms
- planning templates
- message templates
- meeting notes templates

### Use `projects/` for
- active priorities
- project-specific decisions
- next actions
- status tracking

---

## Task Handling Rule
When work appears in chat:
1. clarify it
2. decide if it matters
3. convert it into a file, workflow, task, or project note
4. do not leave important items buried in conversation

---

## Planning Rule
Use the weekly planning template to:
- define weekly priorities
- identify next actions
- track delegated items
- capture blockers
- review weekly progress

---

## Cost-Saving Rule
- use the cheapest model that can do the job well
- route by task type
- avoid unnecessary manual switching
- escalate only when quality or reasoning requires it

---

## System Design Rule
Prefer:
- structured outputs
- reusable assets
- clean naming
- simple workflows
- easy migration to future environments

Avoid:
- over-complication
- fragile one-off logic
- important information trapped in chat

---

## Current Important Files
- `systems/operator-rules.md`
- `systems/model-policy.md`
- `systems/model-routing.md`
- `systems/model-aliases.json`
- `projects/current-priorities.md`
- `templates/weekly-planning-template.md`
- `workflows/task-capture-and-prioritisation.md`
- `workflows/content-production-workflow.md`
- `business/leader-by-design.md`

---

## Mission Control Note
This file is intended to become part of the future Mission Control Docs menu.
It should stay concise, practical, and operator-focused.
