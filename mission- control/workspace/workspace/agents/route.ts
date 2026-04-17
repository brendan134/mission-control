import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get OpenClaw sessions
    const sessionsOutput = execSync('openclaw sessions', { encoding: 'utf8', timeout: 10000 });
    
    const lines = sessionsOutput.trim().split('\n').filter(line => line.trim());
    
    // Parse active sessions
    const agents: Array<{
      name: string;
      type: string;
      lastActive: string;
      isActive: boolean;
      context?: { used: number; total: number } | null;
    }> = [];
    
    for (const line of lines) {
      // Skip header line
      if (line.includes('model') && line.includes('id:')) continue;
      
      // Parse session line
      const parts = line.split(/\s{2,}/);
      if (parts.length < 2) continue;
      
      const sessionInfo = parts[0].trim();
      const lastActive = parts[1]?.trim() || 'unknown';
      const modelInfo = parts[2]?.trim() || '';
      
      // Determine agent type and name
      let type = 'unknown';
      let name = 'Unknown';
      
      if (sessionInfo.includes('agent:main:main')) {
        type = 'main';
        name = 'Niles';
      } else if (sessionInfo.includes('cron:')) {
        type = 'cron';
        const match = sessionInfo.match(/cron:([a-f0-9]+)/);
        name = match ? `Cron (${match[1].slice(0, 6)})` : 'Cron Job';
      } else if (sessionInfo.includes('subagent:')) {
        type = 'subagent';
        const match = sessionInfo.match(/subagent:(\w+)/);
        name = match ? `Subagent (${match[1].slice(0, 6)})` : 'Sub-agent';
      }
      
      // Determine if active (recent activity)
      const isActive = lastActive.includes('m ago') || lastActive.includes('s ago');
      
      // Extract context usage
      const contextMatch = modelInfo.match(/(\d+)k\/(\d+)k/);
      const context = contextMatch ? {
        used: parseInt(contextMatch[1]),
        total: parseInt(contextMatch[2])
      } : null;
      
      agents.push({
        name,
        type,
        lastActive,
        isActive,
        context
      });
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      agents,
      summary: {
        total: agents.length,
        active: agents.filter(a => a.isActive).length,
        idle: agents.filter(a => !a.isActive).length
      }
    });
    
  } catch (error) {
    console.error('Error fetching agent status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch agent status';
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
