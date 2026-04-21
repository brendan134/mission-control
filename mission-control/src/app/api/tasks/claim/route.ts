import { NextRequest, NextResponse } from 'next/server';
import { getTasks, updateTask } from '../../../../lib/task-service';
import { Task, TaskStatus } from '../../../../lib/data-model';

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

    // Check if task already has this agent assigned
    const isAlreadyAssigned = task.assigned_agent_ids.includes(agentId);
    if (isAlreadyAssigned) {
      return NextResponse.json({ error: 'Task already assigned to this agent' }, { status: 409 });
    }

    // Update task with agent assignment (add to assigned_agent_ids)
    const updatedTask = updateTask(taskId, { 
      assigned_agent_ids: [...task.assigned_agent_ids, agentId]
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
      const isUnassigned = t.assigned_agent_ids.length === 0 || t.assigned_agent_ids.includes('unassigned');
      const taskTypeStr = t.task_type?.toString() || '';
      const matchesSpecialization = specializationTags.length > 0 && 
        specializationTags.some(tag => taskTypeStr.toLowerCase().includes(tag.toLowerCase()));
      
      return isUnassigned || matchesSpecialization;
    });

    // If agentId provided, also return their current workload
    let agentWorkload = null;
    if (agentId) {
      const agentTasks = tasks.filter(t => t.assigned_agent_ids.includes(agentId));
      agentWorkload = {
        agentId,
        currentTasks: agentTasks.length,
        activeTasks: agentTasks.filter(t => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.ARCHIVED).length
      };
    }

    return NextResponse.json({ 
      availableTasks: availableTasks.slice(0, 10),
      agentWorkload
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch available tasks' }, { status: 500 });
  }
}