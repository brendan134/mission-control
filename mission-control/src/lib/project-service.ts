// Project Service Layer
// Handles all project CRUD operations and computed values

import { Project, ProjectStatus, Priority, Task, Stage } from './data-model';

const DATA_DIR = '/data/.openclaw/workspace';
const PROJECTS_FILE = DATA_DIR + '/projects.json';

// ==================== STORAGE ====================
const projects: Map<string, Project> = new Map();

// ==================== PERSISTENCE ====================

function saveProjects(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    const data = Array.from(projects.values());
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save projects:', err);
  }
}

function loadProjects(): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
      data.forEach((project: Project) => {
        projects.set(project.id, project);
      });
      console.log(`Loaded ${projects.size} projects from persistence`);
    }
  } catch (err) {
    console.error('Failed to load projects:', err);
  }
}

// Load projects on module init
if (typeof window === 'undefined') loadProjects();

// ==================== CRUD OPERATIONS ====================

export function createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'linked_task_ids' | 'progress' | 'last_activity_at'>): Project {
  const now = new Date().toISOString();
  const project: Project = {
    ...data,
    id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    linked_task_ids: [],
    progress: 0,
    created_at: now,
    updated_at: now,
  };
  projects.set(project.id, project);
  saveProjects(); // Persist after create
  return project;
}

export function updateProject(id: string, updates: Partial<Project>): Project | null {
  const project = projects.get(id);
  if (!project) return null;
  
  const updated = { ...project, ...updates, updated_at: new Date().toISOString() };
  projects.set(id, updated);
  saveProjects(); // Persist after update
  return updated;
}

export function getProjects(): Project[] {
  return Array.from(projects.values()).sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getProjectById(id: string): Project | null {
  return projects.get(id) || null;
}

export function deleteProject(id: string): boolean {
  const result = projects.delete(id);
  if (result) saveProjects(); // Persist after delete
  return result;
}

// ==================== COMPUTED VALUES ====================

export function getProjectProgress(projectId: string, tasks: Task[]): number {
  const projectTasks = tasks.filter(t => t.project_id === projectId);
  if (projectTasks.length === 0) return 0;
  
  const completedTasks = projectTasks.filter(t => t.stage === Stage.DONE || t.status === 'Completed');
  return Math.round((completedTasks.length / projectTasks.length) * 100);
}

export function getLastActivity(projectId: string, tasks: Task[]): string | null {
  const projectTasks = tasks.filter(t => t.project_id === projectId);
  if (projectTasks.length === 0) return null;
  
  const sorted = projectTasks.sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  return sorted[0]?.updated_at || null;
}

// ==================== PROJECT QUERIES ====================

export function getActiveProjects(): Project[] {
  return getProjects().filter(p => p.status === ProjectStatus.ACTIVE);
}

export function getHighPriorityProjects(): Project[] {
  return getProjects().filter(p => p.priority === 'High' && p.status === ProjectStatus.ACTIVE);
}

export function getStaleProjects(daysThreshold: number = 7): Project[] {
  const threshold = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000);
  return getProjects().filter(p => {
    const lastUpdate = new Date(p.updated_at).getTime();
    return p.status === ProjectStatus.ACTIVE && lastUpdate < threshold;
  });
}

// ==================== AI-ASSISTED FOCUS ====================

export interface NextBestTaskResult {
  task: Task | null;
  reason: string;
}

export function getNextBestTask(projectId: string, tasks: Task[]): NextBestTaskResult {
  const projectTasks = tasks.filter(t => t.project_id === projectId);
  
  if (projectTasks.length === 0) {
    return { task: null, reason: 'No tasks in this project' };
  }
  
  // Filter for actionable tasks (not done, not waiting)
  const actionable = projectTasks.filter(t => 
    t.stage !== Stage.DONE && 
    t.stage !== Stage.WAITING &&
    t.status !== 'Completed' &&
    t.status !== 'Archived'
  );
  
  if (actionable.length === 0) {
    return { task: null, reason: 'All tasks are complete or waiting' };
  }
  
  // Score tasks by priority and recency
  const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  const scored = actionable.map(t => {
    const priorityPoints = priorityScore[t.priority as keyof typeof priorityScore] || 1;
    const isInProgress = t.stage === Stage.IN_PROGRESS ? 2 : 0;
    const needsDecision = t.requires_decision ? 3 : 0;
    const hasNextAction = t.next_action ? 1 : 0;
    
    return {
      task: t,
      score: priorityPoints + isInProgress + needsDecision + hasNextAction
    };
  });
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  const best = scored[0];
  return { 
    task: best.task, 
    reason: `Highest priority (${best.task.priority}) with ${best.task.next_action ? 'defined next action' : 'no next action yet'}` 
  };
}

// ==================== INITIALIZE WITH SAMPLE DATA ====================

const SAMPLE_PROJECT_NAMES = [
  'High-Impact Leader Club',
  '1:1 Coaching Service Upgrade',
  'Podcast SEO Growth',
];

export function initializeSampleProjects(): void {
  // Only add missing sample projects, don't recreate deleted ones
  const existingNames = new Set(Array.from(projects.values()).map(p => p.name));
  const sampleProjects = [
    {
      name: 'High-Impact Leader Club',
      description: 'Create and record all training modules. Target: full library by June 30. Currently 7 members, goal 10 by end April.',
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      owner: 'Brendan',
      stage: 'Execution' as const,
    },
    {
      name: '1:1 Coaching Service Upgrade',
      description: 'Strengthen Leader By Design 1:1 offer with premium white-glove client experience. Define service standards and touchpoints.',
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      owner: 'Brendan',
      stage: 'Planning' as const,
    },
    {
      name: 'Podcast SEO Growth',
      description: 'Increase podcast downloads from ~15-20/week to 500-1,000/week through SEO improvements.',
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      owner: 'Brendan',
      stage: 'Execution' as const,
    },
  ];

  for (const proj of sampleProjects) {
    if (!existingNames.has(proj.name)) {
      createProject(proj);
    }
  }
}

// Initialize on import
initializeSampleProjects();

// ==================== TASK-PROJECT LINKING ====================

export function linkTaskToProject(taskId: string, projectId: string): void {
  const project = projects.get(projectId);
  if (project && !project.linked_task_ids.includes(taskId)) {
    project.linked_task_ids.push(taskId);
    project.updated_at = new Date().toISOString();
    projects.set(projectId, project);
  }
}

export function unlinkTaskFromProject(taskId: string, projectId: string): void {
  const project = projects.get(projectId);
  if (project) {
    project.linked_task_ids = project.linked_task_ids.filter(id => id !== taskId);
    project.updated_at = new Date().toISOString();
    projects.set(projectId, project);
  }
}
