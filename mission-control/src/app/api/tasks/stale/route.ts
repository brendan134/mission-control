import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/task-service';
import { TaskStatus, Stage, OwnerType } from '@/lib/data-model';

// GET /api/tasks/stale - Get stale tasks for accountability signal feed
export async function GET() {
  try {
    const tasks = getTasks();
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;
    
    const staleTasks = tasks.map(task => {
      const updatedAt = new Date(task.updated_at).getTime();
      const hoursSinceUpdate = (now - updatedAt) / (1000 * 60 * 60);
      const daysSinceUpdate = Math.floor(hoursSinceUpdate / 24);
      
      let staleLevel = null;
      let escalationTarget = null;
      if (daysSinceUpdate >= 3) {
        staleLevel = 'critical'; // 72h+ - escalate to Brendan
        escalationTarget = 'Brendan';
      } else if (daysSinceUpdate >= 2) {
        staleLevel = 'warning'; // 48h+ - alert Niles
        escalationTarget = 'Niles';
      } else if (daysSinceUpdate >= 1 && task.status !== TaskStatus.COMPLETED && task.stage !== Stage.DONE) {
        staleLevel = 'yellow'; // 24h+ - flag
      }
      
      // Determine owner category for accountability
      const isAiOwned = task.primary_owner_type === OwnerType.AI_AGENT;
      const isHumanOwned = task.primary_owner_type === OwnerType.BRENDAN || 
                           task.primary_owner_type === OwnerType.PH_TEAM ||
                           task.primary_owner_type === OwnerType.EXTERNAL;
      
      return {
        ...task,
        daysSinceUpdate,
        hoursSinceUpdate: Math.round(hoursSinceUpdate * 10) / 10,
        staleLevel,
        escalationTarget,
        isAiOwned,
        isHumanOwned,
        // Ensure these fields exist (handle legacy tasks)
        blocked_reason: task.blocked_reason || null,
        escalation_history: task.escalation_history || []
      };
    }).filter(t => t.staleLevel);
    
    // Separate AI vs Human owned stale tasks
    const aiStaleTasks = staleTasks.filter(t => t.isAiOwned);
    const humanStaleTasks = staleTasks.filter(t => t.isHumanOwned);
    
    // Categorize for signal feed
    const signalFeed = {
      critical: staleTasks.filter(t => t.staleLevel === 'critical'),
      warning: staleTasks.filter(t => t.staleLevel === 'warning'),
      yellow: staleTasks.filter(t => t.staleLevel === 'yellow'),
      blocked: tasks.filter(t => t.blocked || t.status === TaskStatus.BLOCKED).map(t => ({
        ...t,
        blocked_reason: t.blocked_reason || null,
        escalation_history: t.escalation_history || []
      })),
      needsDecision: tasks.filter(t => t.requires_decision && t.status === TaskStatus.ACTIVE),
      totalStale: staleTasks.length,
      aiOwned: aiStaleTasks,
      humanOwned: humanStaleTasks,
      summary: {
        aiCritical: aiStaleTasks.filter(t => t.staleLevel === 'critical').length,
        aiWarning: aiStaleTasks.filter(t => t.staleLevel === 'warning').length,
        aiYellow: aiStaleTasks.filter(t => t.staleLevel === 'yellow').length,
        humanCritical: humanStaleTasks.filter(t => t.staleLevel === 'critical').length,
        humanWarning: humanStaleTasks.filter(t => t.staleLevel === 'warning').length,
        humanYellow: humanStaleTasks.filter(t => t.staleLevel === 'yellow').length,
      }
    };
    
    return NextResponse.json(signalFeed);
  } catch (err) {
    console.error('Failed to fetch stale tasks:', err);
    return NextResponse.json({ error: 'Failed to fetch stale tasks' }, { status: 500 });
  }
}