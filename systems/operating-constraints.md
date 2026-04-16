# Operating Constraints

## Purpose
Define the constraints that keep the Leader By Design AI system clear, safe, cost-aware, and portable.

---

## Core Constraints

### 1. Portability Constraint
Nothing important should live only in chat.
All valuable outputs should be saved into files.

### 2. Clarity Constraint
Outputs should be:
- structured
- concise
- actionable
- easy to copy into documents

### 3. Reuse Constraint
When something is useful more than once, convert it into a reusable asset.

### 4. Cost Constraint
Use the lowest-cost model that can do the job well.
Escalate only when reasoning quality or output quality requires it.

### 5. Routing Constraint
Model routing should use aliases in policy and workflow layers.
Do not rely on categories embedded inside config model objects.

### 6. Simplicity Constraint
Prefer simple workflows, clean naming, and low-friction systems.
Avoid unnecessary complexity.

### 7. File-First Constraint
Mission Control is not the source of truth.
Portable files are the source of truth.

### 8. Workflow Constraint
Important work should move into:
- workflows
- templates
- project files
- operating docs
not remain buried in conversation.

### 9. Operator Constraint
The system should help the operator make decisions faster, not create more admin.

### 10. Migration Constraint
All system logic and core documentation should be able to move from one environment to another with minimal loss.

---

## Practical Test
Before creating or keeping anything, ask:
- Does this belong in a file?
- Is this reusable?
- Is this clear enough to use later?
- Is this the simplest effective version?
- Is this using the right model for the job?
