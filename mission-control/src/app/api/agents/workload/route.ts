import { NextResponse } from 'next/server';
import { getTasks } from '../../../../lib/task-service';
import { TaskStatus } from '../../../../lib/data-model';
import fs from 'fs';
import path from 'path';

const AGENTS_DIR = '/data/.openclaw/workspace/agents';

// GET /api/agents/workload - Get workload status for all agents
export async function GET() {
  try {
    const tasks = getTasks();
    
    // Load agent configs to get workload settings
    const dirContents = fs.readdirSync(AGENTS_DIR, { withFileTypes: true });
    
    const agentFiles = dirContents
      .filter(f => f.isDirectory() && !['templates', 'podcast'].includes(f.name))
      .map(d => path.join(d.name, 'config.json'));
    
    if (agentFiles.length === 0) {
      return NextResponse.json({ error: 'No agent directories found' });
    }
    
    const agentWorkloads = agentFiles.map(file => {
      try {
        const configPath = path.join(AGENTS_DIR, file);
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        
        const agentId = config.agent_id || file.replace('/config.json', '');
        const agentTasks = tasks.filter(t => (t.assigned_agent_ids || []).includes(agentId));
        const activeTasks = agentTasks.filter(t => t.status !== TaskStatus.COMPLETED && t.status !== TaskStatus.ARCHIVED);
        
        const capacity = config.workload?.workload_capacity || 5;
        const currentQueue = config.workload?.current_queue || activeTasks.length;
        const autoClaim = config.workload?.auto_claim_enabled || false;
        
        return {
          agentId,
          name: config.name || agentId,
          role: config.agent_profile?.role || config.content_type || 'Specialist',
          capacity,
          currentQueue,
          activeCount: activeTasks.length,
          utilization: capacity > 0 ? Math.round((activeTasks.length / capacity) * 100) : 0,
          autoClaimEnabled: autoClaim,
          specializationTags: config.workload?.specialization_tags || [],
          status: activeTasks.length >= capacity ? 'overloaded' : 
                  activeTasks.length >= capacity * 0.8 ? 'busy' : 'available'
        };
      } catch (e: any) {
        return null;
      }
    }).filter(Boolean) as { agentId: string; name: string; role: string; capacity: number; currentQueue: number; activeCount: number; utilization: number; autoClaimEnabled: boolean; specializationTags: string[]; status: string }[];

    // Sort by utilization
    agentWorkloads.sort((a, b) => b.utilization - a.utilization);

    // Get summary stats
    const summary = {
      totalAgents: agentWorkloads.length,
      available: agentWorkloads.filter(a => a.status === 'available').length,
      busy: agentWorkloads.filter(a => a.status === 'busy').length,
      overloaded: agentWorkloads.filter(a => a.status === 'overloaded').length,
      totalActiveTasks: agentWorkloads.reduce((sum, a) => sum + a.activeCount, 0),
      totalCapacity: agentWorkloads.reduce((sum, a) => sum + a.capacity, 0)
    };

    return NextResponse.json({ 
      agents: agentWorkloads,
      summary
    });
  } catch (err) {
    console.error('Failed to fetch agent workloads:', err);
    return NextResponse.json({ error: 'Failed to fetch workload' }, { status: 500 });
  }
}