// Strategy Service Layer
import { Project } from './data-model';

const DATA_DIR = '/data/.openclaw/workspace';
const STRATEGY_FILE = DATA_DIR + '/strategy.json';
const PROJECTS_FILE = DATA_DIR + '/projects.json';

export interface StrategicPriority {
  id: string;
  name: string;
  owner: string;
  outcome: string;
  success_metric: string;
  timeframe: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

let priorities: Map<string, StrategicPriority> = new Map();

function saveStrategy(): void {
  try {
    const fs = require('fs');
    fs.writeFileSync(STRATEGY_FILE, JSON.stringify(Array.from(priorities.values()), null, 2));
  } catch (err) { console.error('Failed to save strategy:', err); }
}

function loadStrategy(): void {
  try {
    const fs = require('fs');
    if (fs.existsSync(STRATEGY_FILE)) {
      const data = JSON.parse(fs.readFileSync(STRATEGY_FILE, 'utf-8'));
      data.forEach((p: StrategicPriority) => priorities.set(p.id, p));
    }
  } catch (err) { console.error('Failed to load strategy:', err); }
}

if (typeof window === 'undefined') loadStrategy();

export function createPriority(data: Omit<StrategicPriority, 'id' | 'created_at' | 'updated_at'>): StrategicPriority {
  const now = new Date().toISOString();
  const priority: StrategicPriority = { ...data, id: `strat-${Date.now()}-${Math.random().toString(36).substr(2,9)}`, created_at: now, updated_at: now };
  priorities.set(priority.id, priority);
  saveStrategy();
  return priority;
}

export function updatePriority(id: string, updates: Partial<StrategicPriority>): StrategicPriority | null {
  const p = priorities.get(id);
  if (!p) return null;
  const updated = { ...p, ...updates, updated_at: new Date().toISOString() };
  priorities.set(id, updated);
  saveStrategy();
  return updated;
}

export function deletePriority(id: string): boolean { const del = priorities.delete(id); if (del) saveStrategy(); return del; }

export function getPriorities(): StrategicPriority[] { return Array.from(priorities.values()).sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); }

export function getProjectAlignment(): (Project & { strategic_priority_id?: string; is_orphaned?: boolean })[] {
  try {
    const fs = require('fs');
    if (!fs.existsSync(PROJECTS_FILE)) return [];
    const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    return projects.map((p: any) => ({ ...p, strategic_priority_id: p.strategic_priority_id, is_orphaned: !p.strategic_priority_id }));
  } catch { return []; }
}

export function updateProjectStrategicAlignment(projectId: string, spId: string | null): void {
  try {
    const fs = require('fs');
    if (!fs.existsSync(PROJECTS_FILE)) return;
    const projects: any[] = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    const idx = projects.findIndex((p: any) => p.id === projectId);
    if (idx >= 0) { projects[idx].strategic_priority_id = spId; fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2)); }
  } catch { console.error('Failed to update alignment'); }
}

export function getUnalignedProjects(): Project[] {
  try {
    const fs = require('fs');
    if (!fs.existsSync(PROJECTS_FILE)) return [];
    const projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
    return projects.filter((p: any) => !p.strategic_priority_id && p.status !== 'Archived');
  } catch { return []; }
}