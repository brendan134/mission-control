// Task Service Layer
// Handles all task CRUD and derived operations
// Task is the execution engine of Mission Control

import { Task, TaskStatus, Stage, Priority, TaskType } from './data-model';

const DATA_DIR = '/data/.openclaw/workspace';
const TASKS_FILE = DATA_DIR + '/tasks.json';

// ==================== STORAGE ====================
const tasks: Map<string, Task> = new Map();

// ==================== PERSISTENCE ====================

function saveTasks(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const data = Array.from(tasks.values());
    fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save tasks:', err);
  }
}

function loadTasks(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    if (fs.existsSync(TASKS_FILE)) {
      const data = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
      data.forEach((task: Task) => {
        tasks.set(task.id, task);
      });
      console.log(`Loaded ${tasks.size} tasks from persistence`);
    }
  } catch (err) {
    console.error('Failed to load tasks:', err);
  }
}

// Load tasks on module init
if (typeof window === 'undefined') loadTasks();

// ==================== CRUD OPERATIONS ====================

export function createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
  const now = new Date().toISOString();
  const task: Task = {
    ...data,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    created_at: now,
    updated_at: now,
  };
  tasks.set(task.id, task);
  saveTasks();
  return task;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const task = tasks.get(id);
  if (!task) return null;
  
  const updated = { ...task, ...updates, updated_at: new Date().toISOString() };
  tasks.set(id, updated);
  saveTasks();
  return updated;
}

export function getTasks(): Task[] {
  return Array.from(tasks.values()).sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getTaskById(id: string): Task | null {
  return tasks.get(id) || null;
}

export function deleteTask(id: string): boolean {
  const result = tasks.delete(id);
  if (result) saveTasks();
  return result;
}

// ==================== QUERIES ====================

export function getTasksByProject(projectId: string): Task[] {
  return getTasks().filter(t => t.project_id === projectId);
}

export function getTasksByOwner(ownerId: string): Task[] {
  return getTasks().filter(t => t.primary_owner_id === ownerId);
}

export function getActiveTasks(): Task[] {
  return getTasks().filter(t => t.status === TaskStatus.ACTIVE);
}

export function getBlockedTasks(): Task[] {
  return getTasks().filter(t => t.status === TaskStatus.BLOCKED || t.blocked);
}

export function getCompletedTasks(): Task[] {
  return getTasks().filter(t => t.status === TaskStatus.COMPLETED || t.stage === Stage.DONE);
}

// ==================== WEEKLY FOCUS ====================

export function getWeeklyTasks(userId?: string): Task[] {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of this week
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  
  return getTasks().filter(t => {
    // Skip completed
    if (t.status === TaskStatus.COMPLETED || t.stage === Stage.DONE) return false;
    
    // Filter by owner if specified
    if (userId && t.primary_owner_id !== userId) return false;
    
    // Include if marked as weekly focus
    if ((t as any).is_weekly_focus) return true;
    
    // Include if due this week
    if (t.due_date) {
      const due = new Date(t.due_date);
      if (due >= weekStart && due < weekEnd) return true;
    }
    
    // Include if in progress
    if (t.stage === Stage.IN_PROGRESS) return true;
    
    return false;
  });
}

// ==================== TASK ACTIONS ====================

export function completeTask(id: string): Task | null {
  const now = new Date().toISOString();
  return updateTask(id, { 
    status: TaskStatus.COMPLETED, 
    stage: Stage.DONE,
    completed_at: now 
  });
}

export function blockTask(id: string, reason: string): Task | null {
  return updateTask(id, { 
    blocked: true, 
    blocked_reason: reason,
    status: TaskStatus.BLOCKED 
  });
}

export function unblockTask(id: string): Task | null {
  return updateTask(id, { 
    blocked: false, 
    blocked_reason: undefined,
    status: TaskStatus.ACTIVE 
  });
}

export function startTask(id: string): Task | null {
  return updateTask(id, { stage: Stage.IN_PROGRESS });
}

// ==================== PROJECT PROGRESS ====================

export function getProjectProgress(projectId: string): number {
  const projectTasks = getTasksByProject(projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(t => 
    t.stage === Stage.DONE || t.status === TaskStatus.COMPLETED
  );
  
  return Math.round((completedTasks.length / projectTasks.length) * 100);
}

export function getProjectStats(projectId: string): {
  total: number;
  completed: number;
  inProgress: number;
  blocked: number;
  pending: number;
} {
  const projectTasks = getTasksByProject(projectId);
  
  return {
    total: projectTasks.length,
    completed: projectTasks.filter(t => t.stage === Stage.DONE).length,
    inProgress: projectTasks.filter(t => t.stage === Stage.IN_PROGRESS).length,
    blocked: projectTasks.filter(t => t.blocked || t.status === TaskStatus.BLOCKED).length,
    pending: projectTasks.filter(t => t.stage === Stage.CAPTURE || t.stage === Stage.DEFINE).length,
  };
}

// ==================== AI-ASSISTED FUNCTIONS ====================

export interface NextBestTaskResult {
  task: Task | null;
  reason: string;
}

export function getNextBestTask(projectId: string): NextBestTaskResult {
  const projectTasks = getTasksByProject(projectId);
  
  if (projectTasks.length === 0) {
    return { task: null, reason: 'No tasks in this project' };
  }
  
  // Filter for actionable tasks
  const actionable = projectTasks.filter(t => 
    t.stage !== Stage.DONE && 
    t.stage !== Stage.WAITING &&
    t.status !== TaskStatus.COMPLETED &&
    t.status !== TaskStatus.ARCHIVED &&
    !t.blocked
  );
  
  if (actionable.length === 0) {
    return { task: null, reason: 'All tasks are complete, waiting, or blocked' };
  }
  
  // Score by priority and state
  const priorityScore: Record<string, number> = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
  
  const scored = actionable.map(t => {
    let score = priorityScore[t.priority] || 1;
    
    // In progress gets a boost
    if (t.stage === Stage.IN_PROGRESS) score += 3;
    
    // Has next action is ready to go
    if (t.next_action) score += 2;
    
    // Needs decision gets attention
    if (t.requires_decision) score += 2;
    
    return { task: t, score };
  });
  
  scored.sort((a, b) => b.score - a.score);
  
  const best = scored[0];
  return { 
    task: best.task, 
    reason: `Priority: ${best.task.priority}, Stage: ${best.task.stage}` 
  };
}

export function identifyStaleTasks(daysThreshold: number = 7): Task[] {
  const threshold = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
  
  return getTasks().filter(t => {
    if (t.status === TaskStatus.COMPLETED || t.stage === Stage.DONE) return false;
    const lastUpdate = new Date(t.updated_at).getTime();
    return lastUpdate < threshold;
  });
}

export function suggestWeeklyFocus(userId: string): Task[] {
  return getTasks()
    .filter(t => t.primary_owner_id === userId)
    .filter(t => t.status !== TaskStatus.COMPLETED && t.stage !== Stage.DONE)
    .sort((a, b) => {
      // Priority first
      const priorityScore: Record<string, number> = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
      const diff = (priorityScore[b.priority] || 1) - (priorityScore[a.priority] || 1);
      if (diff !== 0) return diff;
      
      // Then by due date (soonest first)
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      
      return 0;
    })
    .slice(0, 5); // Top 5 suggestions
}

// ==================== INITIALIZE ====================

export function initializeSampleTasks(): void {
  if (tasks.size > 0) return;
  
  // This would typically be empty - tasks created by users
  // Sample tasks can be added for demo purposes if needed
}

// Initialize on import
initializeSampleTasks();