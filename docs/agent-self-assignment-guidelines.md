# Agent Self-Assignment & Workload Balancing Guidelines

**Status:** DRAFT - For Review  
**Last Updated:** 2026-04-21

---

## Overview

This system enables specialist agents to self-assign tasks based on their specialization and current workload, reducing bottlenecks at Tier A (Brendan/Niles) and building toward self-managing teams.

---

## Core Components

### 1. Workload Fields (Agent Config)

Each agent config now includes:

```json
{
  "workload": {
    "workload_capacity": 5,        // Max concurrent tasks
    "current_queue": 0,            // Current queue depth
    "specialization_tags": ["content", "linkedin", "writing"],
    "auto_claim_enabled": false,   // Default off - gradual rollout
    "max_concurrent_tasks": 3      // Safe threshold
  }
}
```

### 2. Task Claim API

- **Endpoint:** `POST /api/tasks/claim`
- **Purpose:** Agent claims an unassigned task
- **Validation:** Checks capacity before allowing claim

### 3. Workload API

- **Endpoint:** `GET /api/agents/workload`
- **Purpose:** Returns current workload status for all agents
- **Used by:** Signal Feed, Team Workload view

---

## Rollout Plan

### Phase 1: Visibility Only (Week 1-2)
- [ ] Deploy workload API endpoints
- [ ] Add "Team Workload" view to Mission Control
- [ ] Show agent capacity in Signal Feed
- [ ] **Agents still manually assigned**

### Phase 2: Controlled Testing (Week 3-4)
- [ ] Enable for 2-3 content agents (Ruby, Ethan)
- [ ] Set `auto_claim_enabled: true` for test agents only
- [ ] Monitor task distribution
- [ ] Adjust capacity limits based on observed performance
- [ ] Brendan reviews all claimed tasks within 24h

### Phase 3: Gradual Expansion (Week 5-8)
- [ ] Add more agents to self-assignment pool
- [ ] Expand to operations agents
- [ ] Reduce manual assignment frequency
- [ ] Collect metrics on throughput

### Phase 4: Full Deployment (Week 9+)
- [ ] All active agents can self-assign
- [ ] Default to unassigned for new tasks
- [ ] Brendan shifts to review/approve role
- [ ] Monthly workload analysis

---

## Capacity Guidelines

| Agent Type | Recommended Capacity | Max Concurrent |
|------------|---------------------|----------------|
| Content (Ruby, Mia, Ethan, Lucas, Zoe) | 5 | 3 |
| Operations | 7 | 5 |
| Strategy | 3 | 2 |

**Note:** Start conservative. It's easier to increase capacity than manage overload.

---

## Safety Guardrails

1. **Capacity Check:** Agent cannot claim if at max capacity
2. **Tier A Override:** Brendan/Niles can reassign any task
3. **Daily Review:** All claimed tasks reviewed within 24h
4. **Escalation Path:** Overloaded agents auto-escalate to Tier B
5. **Manual Override:** Any task can be manually reassigned

---

## Testing Checklist

Before Phase 2:

- [ ] Workload API returns correct data
- [ ] Team Workload view renders properly
- [ ] Signal Feed shows agent capacity
- [ ] Task claim validates capacity
- [ ] Task claim rejects overloaded agents

---

## Monitoring Metrics

Track weekly:

- Tasks auto-assigned vs manually assigned
- Agent utilization rates
- Task completion time (auto vs manual)
- Task quality scores (per agent)
- Brendan time spent on task assignment

---

## Rollback Procedure

If issues occur:

1. Set `auto_claim_enabled: false` for affected agent
2. Revert task assignments to manual
3. Review logs for root cause
4. Adjust capacity/settings
5. Resume testing

---

## Future Enhancements

- [ ] Smart routing based on task complexity
- [ ] Load balancing across agent teams
- [ ] Predictive capacity planning
- [ ] Agent performance-based capacity adjustment

---

*This is a living document. Update as the system evolves.*