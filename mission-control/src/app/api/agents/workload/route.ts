import { NextResponse } from 'next/server';
import { getTasks } from '../../../lib/task-service';
import fs from 'fs';
import path from 'path';

// GET /api/agents/workload - Get workload status for all agents
export async function GET() {
  try {
    const tasks = getTasks();
    
    // Load agent configs to get workload settings
    const agentsDir = path.join(process.cwd(), '../../../../agents');
    const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('/config.json'));
    
    const agentWorkloads = agentFiles.map(file => {
      try {
        const configPath = path.join(agentsDir, file);
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        
        const agentId = config.agent_id || file.replace('/config.json', '');
        const agentTasks = tasks.filter(t => t.assignee === agentId);
        const activeTasks = agentTasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
        
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
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

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