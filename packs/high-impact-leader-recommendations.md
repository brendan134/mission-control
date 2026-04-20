# High-Impact Leader Recommendation Engine

> Action layer that converts diagnosis into coaching priorities, tools, lessons, content angles, and offer recommendations.

**Depends On:**
- High-Impact Leader Ecosystem
- High-Impact Leader Diagnostic Layer

---

## Input Fields

- likely_balance_issue
- likely_broken_pillar
- likely_missing_growth_step
- likely_leadership_stage
- primary_problem_summary
- urgency_level
- business_context
- desired_outcome

---

## Recommendation Sequence

1. Stabilise the real constraint
2. Choose one primary focus
3. Select best intervention
4. Match to relevant tool or lesson
5. Align to offer if relevant
6. Generate clear next step

---

## Balance Recommendations

### Leader (Under-leading themselves)
- **Core Goal:** Increase internal stability, awareness, and emotional control
- **Coaching Focus:** Self-awareness, reduce reactive behaviour, identify overwhelm patterns
- **Recommended Interventions:** reflection_prompt, self-leadership_coaching, pattern_review
- **Recommended Tools:** Leadership reflection questions, End-of-week self-review, Decision journal
- **Lesson Priority:** PERCEIVE → EVALUATE

### Team (Under-leading the team)
- **Core Goal:** Increase ownership, clarity, and performance through others
- **Coaching Focus:** Clarify ownership, reduce rescue behaviour, strengthen accountability
- **Recommended Interventions:** role_clarity_reset, accountability_coaching, ownership_conversation
- **Recommended Tools:** Performance Agreement, Weekly 1:1, Monthly Development 1:1
- **Lesson Priority:** LEVERAGE → PERFORM

### Business (Under-leading the business)
- **Core Goal:** Improve strategic direction, decision quality, and operating focus
- **Coaching Focus:** Clarify priorities, reduce scattered focus, create decision criteria
- **Recommended Interventions:** strategic_clarity_session, priorities_reset, decision_framework
- **Recommended Tools:** Priority planning, Strategic goals review, Quarterly planning
- **Lesson Priority:** ENVISION → EVALUATE

---

## Pillar Recommendations

### PERCEIVE (Self-awareness)
- **Primary Outcome:** Create more grounded and intentional leadership
- **Coaching Moves:** Identify behaviour patterns under pressure, separate identity from emotional state
- **Content Angles:**
  - "Leadership is not just external. It starts with how you lead yourself."
  - "Your reactions are shaping your leadership more than your intentions."
- **Coaching Prompt:** "What pattern keeps showing up when pressure rises, and what is that pattern costing you?"

### ENVISION (Direction/Clarity)
- **Primary Outcome:** Create clarity that reduces dependence on the leader
- **Coaching Moves:** Clarify what matters most, turn vague expectations into clear standards
- **Content Angles:**
  - "Your team may not need more motivation. They may need more clarity."
  - "If everything feels urgent, clarity is missing."
- **Coaching Prompt:** "Where is your lack of clarity forcing you to stay involved more than you should?"

### OPTIMIZE (Systems)
- **Primary Outcome:** Build smoother, more reliable ways of working
- **Coaching Moves:** Identify repeated friction points, simplify before adding complexity
- **Content Angles:**
  - "If performance depends on effort alone, the system is broken."
  - "Chaos is often a design issue, not a people issue."
- **Coaching Prompt:** "What keeps going wrong in the same way, and what does that tell us about the current system?"

### PERFORM (Execution)
- **Primary Outcome:** Create a consistent execution cadence
- **Coaching Moves:** Establish weekly accountability, make priorities visible, tighten follow-through
- **Content Angles:**
  - "Good intentions do not create consistency. Rhythm does."
  - "A team without rhythm drifts, even when they care."
- **Coaching Prompt:** "Where is execution drifting because nobody is reinforcing the rhythm consistently?"

### LEVERAGE (Team/Multiplication)
- **Primary Outcome:** Multiply impact through stronger ownership and team capability
- **Coaching Moves:** Shift from doing to developing, build ownership in others, reduce rescue
- **Content Angles:**
  - "If your team keeps bringing problems back to you, leverage is broken."
  - "Delegation is not dumping. It is capability transfer."
- **Coaching Prompt:** "What are you still holding that should now be owned, solved, or led by someone else?"

### EVALUATE (Learning/Adaptation)
- **Primary Outcome:** Help the leader and team learn faster and adjust sooner
- **Coaching Moves:** Review what is working, turn mistakes into learning loops, strengthen standards
- **Content Angles:**
  - "Teams do not improve just because time passes. They improve when learning is built in."
  - "Repeated mistakes are often a review problem."
- **Coaching Prompt:** "What keeps repeating, and what review habit is missing that would help you catch it sooner?"

---

## Growth Step Recommendations

| Step | Primary Goal | Recommended Actions | Best Offer Fit |
|------|-------------|---------------------|----------------|
| 1. Build Stability | Reduce volatility | Simplify priorities, basic weekly structure | 1:1 Coaching |
| 2. Define Purpose & People | Clarify roles | Role clarity, expectations reset | Club / Accelerator |
| 3. Systemize | Make repeatable | Map workflows, document standards | Accelerator |
| 4. Develop Capability | Build team skills | Coach for problem-solving, development 1:1s | Club / Mastermind |
| 5. Create Rhythm | Consistent cadence | Weekly 1:1, metrics tracking, monthly reviews | Club / Accelerator |
| 6. Multiply Impact | Scale through others | Strengthen delegation, develop leaders | Mastermind |
| 7. Build Legacy | Design for freedom | Succession, strategic design | 1:1 Coaching |

---

## Stage Recommendations

| Stage | Best Support | Avoid | Best Offer Fit | Style |
|-------|-------------|-------|----------------|-------|
| **Hustler** | Stability, clarity, structure | Complex frameworks | Club | Simple, stabilising |
| **Operator** | Role clarity, systems, rhythm | Advanced theory | Club / Accelerator | Structured, practical |
| **Leader** | Delegation, capability development | Pure productivity fixes | Accelerator / Mastermind | Development-focused |
| **Thriving Leader** | Scaling, leadership layers | Low-level advice | Mastermind / 1:1 | Strategic, multiplication |
| **Legacy Builder** | Legacy, strategic freedom | Entry-level content | 1:1 / Mastermind | Strategic, long-range |

---

## Offer Profiles

| Offer | Best For | Positioning |
|-------|----------|-------------|
| **High-Impact Leader Club** | Foundational systems, rhythm, role clarity | Leaders building consistent performance |
| **Accelerator** | Focused implementation, one major bottleneck | Leaders who need to build, not just ideas |
| **Mastermind** | Scaling, multiplication, strategic growth | Leaders growing beyond team management |
| **1:1 Coaching** | Complex businesses, high-stakes decisions | Leaders needing custom strategic support |

---

## Content Recommendation Rules

### Thought Reversal
- Use when: Market believes the wrong thing, common behaviour misdiagnosed
- Example: "Your team is not the problem. Your leadership design is."

### Educational
- Use when: Audience needs practical next step
- Example: "3 signs your team lacks clarity, not motivation"

### Connection
- Use when: Audience feels shame, frustration, or isolation
- Example: "If you feel like the business keeps borrowing your brain, you are not alone."

### Story
- Use when: Lived example makes lesson more believable
- Example: Client story about moving from chaos to rhythm

---

## Guardrails

- Recommend only ONE primary focus unless user asks for full plan
- Do not recommend downstream fixes before upstream issues addressed
- Do not recommend advanced offers when leader lacks basic stability/rhythm
- Use clear, practical language over jargon

---

*Depends On: Ecosystem + Diagnostic Layer*
*Format: YAML/JSON Hybrid*
*Ready for: OpenClaw, Coaching Logic, Content Generation, Offer Alignment*