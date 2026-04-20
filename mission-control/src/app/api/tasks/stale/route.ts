import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/task-service';
import { TaskStatus, Stage } from '@/lib/data-model';

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
      if (daysSinceUpdate >= 3) {
        staleLevel = 'critical'; // 72h+ - escalate to Brendan
      } else if (daysSinceUpdate >= 2) {
        staleLevel = 'warning'; // 48h+ - alert Niles
      } else if (daysSinceUpdate >= 1 && task.status !== TaskStatus.COMPLETED && task.stage !== Stage.DONE) {
        staleLevel = 'yellow'; // 24h+ - flag
      }
      
      return {
        ...task,
        daysSinceUpdate,
        hoursSinceUpdate: Math.round(hoursSinceUpdate * 10) / 10,
        staleLevel
      };
    }).filter(t => t.staleLevel);
    
    // Categorize for signal feed
    const signalFeed = {
      critical: staleTasks.filter(t => t.staleLevel === 'critical'),
      warning: staleTasks.filter(t => t.staleLevel === 'warning'),
      yellow: staleTasks.filter(t => t.staleLevel === 'yellow'),
      blocked: tasks.filter(t => t.blocked || t.status === TaskStatus.BLOCKED),
      needsDecision: tasks.filter(t => t.requires_decision && t.status === TaskStatus.ACTIVE),
      totalStale: staleTasks.length
    };
    
    return NextResponse.json(signalFeed);
  } catch (err) {
    console.error('Failed to fetch stale tasks:', err);
    return NextResponse.json({ error: 'Failed to fetch stale tasks' }, { status: 500 });
  }
}