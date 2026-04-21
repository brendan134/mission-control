import { NextRequest, NextResponse } from 'next/server';
import { getTasks, updateTask, getTaskById } from '../../../lib/task-service';
import { Task } from '../../../lib/data-model';

// POST /api/tasks/claim - Agent claims an unassigned task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, agentId } = body;

    if (!taskId || !agentId) {
      return NextResponse.json({ error: 'taskId and agentId required' }, { status: 400 });
    }

    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Check if task is unassigned or already claimed
    if (task.assignee && task.assignee !== agentId) {
      return NextResponse.json({ error: 'Task already assigned to another agent' }, { status: 409 });
    }

    // Update task with agent assignment
    const updatedTask = updateTask(taskId, { 
      assignee: agentId,
      owner: agentId
    } as Partial<Task>);

    return NextResponse.json({ 
      success: true, 
      task: updatedTask,
      message: `Task ${taskId} claimed by ${agentId}`
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to claim task' }, { status: 500 });
  }
}

// GET /api/tasks/claim - Get available tasks for an agent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const specializationTags = searchParams.get('tags')?.split(',') || [];

    const tasks = getTasks();
    
    // Filter unassigned tasks or tasks matching agent's specialization
    let availableTasks = tasks.filter(t => {
      const isUnassigned = !t.assignee || t.assignee === 'unassigned';
      const matchesSpecialization = specializationTags.length > 0 && 
        specializationTags.some(tag => t.task_type?.includes(tag) || t.tags?.includes(tag));
      
      return isUnassigned || matchesSpecialization;
    });

    // If agentId provided, also return their current workload
    let agentWorkload = null;
    if (agentId) {
      const agentTasks = tasks.filter(t => t.assignee === agentId);
      agentWorkload = {
        agentId,
        currentTasks: agentTasks.length,
        activeTasks: agentTasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').length
      };
    }

    return NextResponse.json({ 
      availableTasks: availableTasks.slice(0, 10), // Limit to 10
      agentWorkload
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch available tasks' }, { status: 500 });
  }
}