# Agent Quick-Start Guide
## Using the v2.0 Template for New Content Agents

---

## Why Use This Template?

The v2.0 template ensures **every agent** meets world-class standards:

- ✅ Consistent quality across all content types
- ✅ Approval workflow (draft → needs_revision → approved)
- ✅ Weighted scoring (85 passing, 92 excellent)
- ✅ Tone protection (no hype, no fluff)
- ✅ Anti-repetition (no copy-paste fatigue)
- ✅ SEO alignment (where applicable)

---

## Step-by-Step: Create a New Agent

### Step 1: Choose Your Content Type

| Type | Use Case |
|------|----------|
| `podcast` | Audio episodes |
| `newsletter` | Email newsletters |
| `linkedin` | LinkedIn posts |
| `video` | Video scripts |
| `email` | Email sequences |
| `course` | Educational content |
| `blog` | Blog posts |
| `social` | General social media |

### Step 2: Copy the Template

```bash
cp agents/templates/agent-template-v2.json agents/{content-type}/config.json
```

Example:
```bash
mkdir -p agents/newsletter
cp agents/templates/agent-template-v2.json agents/newsletter/config.json
```

### Step 3: Fill In the Blanks

#### Required Fields (MUST EDIT)

```json
{
  "agent_id": "newsletter-producer",        // unique, kebab-case
  "name": "Newsletter Producer",            // human-readable name
  "content_type": "newsletter",             // from list above
  "owner": {
    "name": "Brendan Rogers",
    "brand": "Leader by Design"
  },
  "agent_profile": {
    "role": "Newsletter writer and strategist",
    "mission": "Write high-impact newsletters that...",
    "operating_mode": "structure_first"
  }
}
```

#### Voice (MUST EDIT)

```json
{
  "voice": {
    "tone": ["professional", "warm", "clear"],
    "must_sound_like": "Brendan Rogers' Leadership by Design voice",
    "must_not_sound_like": ["sales copy", "motivational speaker"],
    "language_rules": [
      "Use plain English",
      "Avoid jargon",
      "No hype language"
    ]
  }
}
```

#### Length Constraints (EDIT FOR YOUR TYPE)

```json
{
  "locked_rules": {
    "length": {
      "min": 500,
      "max": 800,
      "unit": "words",
      "locked": true
    }
  }
}
```

#### Format Options (OPTIONAL)

```json
{
  "formats": [
    {
      "name": "Weekly Digest",
      "locked": true,
      "purpose": "Curated weekly insights"
    },
    {
      "name": "Deep Dive",
      "locked": true,
      "purpose": "Comprehensive analysis"
    }
  ]
}
```

#### SEO Keywords (IF APPLICABLE)

```json
{
  "seo_system": {
    "priority_level": "high",
    "primary_keywords": ["leadership", "team performance"],
    "secondary_keywords": ["business growth", "accountability"]
  }
}
```

### Step 4: Customize the Workflow

```json
{
  "workflow": [
    {
      "step": 1,
      "name": "Topic Selection",
      "actions": ["Review content calendar", "Select topic", "Identify angle"]
    },
    {
      "step": 2,
      "name": "Outline",
      "actions": ["Create structure", "Define key points", "Plan CTA"]
    },
    {
      "step": 3,
      "name": "Draft",
      "actions": ["Write in voice", "Apply format", "Include SEO"]
    },
    {
      "step": 4,
      "name": "Validate",
      "actions": ["Check length", "Check tone", "Check SEO"]
    },
    {
      "step": 5,
      "name": "Final Review",
      "actions": ["Approval check", "Format check", "Schedule"]
    }
  ]
}
```

### Step 5: Add Custom Validation

```json
{
  "validation": {
    "must_pass": [
      "length_compliance",
      "voice_alignment",
      "format_compliance"
    ],
    "reject_if": [
      "too_short",
      "too_long",
      "tone_drift"
    ]
  }
}
```

---

## Agent Naming Convention

| Component | Rule | Example |
|-----------|------|---------|
| **Agent ID** | kebab-case | `newsletter-producer` |
| **Name** | Title Case | "Newsletter Producer" |
| **Folder** | kebab-case | `agents/newsletter/` |
| **Config File** | `config.json` | `agents/newsletter/config.json` |

---

## Approval Flow

```
┌─────────┐     ┌───────────────┐     ┌─────────┐
│  DRAFT  │ ──→ │NEEDS REVISION │ ──→ │APPROVED │
└─────────┘     └───────────────┘     └─────────┘
      ↑               │                      │
      └───────────────┴──────────────────────┘
                 (revision loop)
```

### Hard Fail Conditions (Auto-Reject)

Add your content-specific failures:

```json
{
  "approval_system": {
    "hard_fail_conditions": [
      "episode_shorter_than_X",
      "missing_cta",
      "tone_drift",
      "keyword_stuffing"
    ]
  }
}
```

---

## Scoring Example

| Category | Weight | Your Score |
|----------|--------|------------|
| Structural Clarity | 15 | _/15 |
| Voice Accuracy | 12 | _/12 |
| SEO Alignment | 12 | _/12 |
| Content Depth | 12 | _/12 |
| Practical Value | 10 | _/10 |
| Originality | 8 | _/8 |
| Engagement | 8 | _/8 |
| Format Compliance | 8 | _/8 |
| Technical Quality | 8 | _/8 |
|CTA Effectiveness | 7 | _/7 |
| **TOTAL** | **100** | **__/100** |

**Passing:** 85+ | **Excellent:** 92+

---

## Pre-Write Diagnostic (Required)

Every agent should require these questions answered before writing:

1. What false belief is this breaking?
2. Why does this belief persist?
3. What does the reader usually do instead?
4. What's the structural correction?
5. Where will objections surface?
6. What's the clearest framing?
7. Primary keyword?
8. Secondary keywords?

---

## Quick Command

```bash
# Create new agent from template
./scripts/create-agent.sh {agent-name}

# Example
./scripts/create-agent.sh newsletter
```

---

## Template Checklist

- [ ] agent_id filled (unique)
- [ ] name filled (human-readable)
- [ ] content_type set
- [ ] role + mission written
- [ ] voice configured (tone, must/mustn't)
- [ ] length constraints set
- [ ] formats defined (if multiple)
- [ ] workflow steps added
- [ ] validation rules set
- [ ] SEO keywords added (if applicable)
- [ ] hard fail conditions defined
- [ ] TEST with sample content

---

## Future: Agent Registry

Coming soon: A Mission Control page to manage all agents, their scores, and approval status.

---

*Last updated: 2026-04-21*
*Template version: 2.0.0*