import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask, updateTask, deleteTask } from '../../../lib/task-service';
import { Task, TaskStatus, Stage } from '../../../lib/data-model';

// GET /api/tasks - List all tasks
export async function GET() {
  try {
    const tasks = getTasks();
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = createTask(body as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PATCH /api/tasks - Update a task
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const task = updateTask(id, updates as Partial<Task>);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks - Delete a task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
    }
    deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}