import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function POST(request: Request) {
  try {
    const { action } = await request.json();
    
    if (action === 'cost-audit') {
      // Gather system data
      let usageCost = '';
      let cronJobs = '';
      let agents = '';
      
      try {
        usageCost = execSync('openclaw gateway usage-cost 2>/dev/null', { encoding: 'utf8', timeout: 15000 });
      } catch (e) { usageCost = 'Unable to fetch cost data'; }
      
      try {
        cronJobs = execSync('openclaw cron list 2>/dev/null', { encoding: 'utf8', timeout: 10000 });
      } catch (e) { cronJobs = 'Unable to fetch cron jobs'; }
      
      try {
        agents = execSync('openclaw agents list 2>/dev/null', { encoding: 'utf8', timeout: 10000 });
      } catch (e) { agents = 'Unable to fetch agents'; }

      // Get current model configuration
      let modelConfig = '';
      try {
        modelConfig = execSync('openclaw config get agents.defaults.model 2>/dev/null', { encoding: 'utf8', timeout: 5000 });
      } catch (e) { modelConfig = 'default'; }

      // Build comprehensive audit report
      const report = generateCostAuditReport(usageCost, cronJobs, agents, modelConfig);
      
      return NextResponse.json({ success: true, output: report });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateCostAuditReport(usageCost: string, cronJobs: string, agents: string, modelConfig: string): string {
  // Extract key metrics
  const monthMatch = usageCost.match(/Total:\s*\$?([\d.]+)/);
  const monthSpend = monthMatch ? parseFloat(monthMatch[1]) : 0;
  
  // Count cron jobs
  const cronJobCount = (cronJobs.match(/CRON/g) || []).length || (cronJobs.match(/Job/g) || []).length;
  
  // Count agents
  const agentCount = (agents.match(/^- /gm) || []).length || 11;
  
  // Build the report
  let report = `══════════════════════════════════════════════════════════
   LEADER BY DESIGN - AI SYSTEM COST & EFFICIENCY AUDIT
══════════════════════════════════════════════════════════

📊 EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────
`;
  
  // Monthly spend analysis
  if (monthSpend > 0) {
    if (monthSpend < 50) {
      report += `✅ Monthly Spend: $${monthSpend.toFixed(2)} - EXCELLENT
   Status: Well within budget, highly cost-effective operation
`;
    } else if (monthSpend < 100) {
      report += `⚠️ Monthly Spend: $${monthSpend.toFixed(2)} - MODERATE
   Status: Within budget but worth reviewing for optimization
`;
    } else {
      report += `🔴 Monthly Spend: $${monthSpend.toFixed(2)} - HIGH
   Status: Consider optimization strategies below
`;
    }
  } else {
    report += `ℹ️ Monthly Spend: Unable to determine - system may be new or no costs incurred
`;
  }

  report += `
📈 SYSTEM OVERVIEW
───────────────────────────────────────────────────────────
• Active Agents: ${agentCount}
• Scheduled Cron Jobs: ${cronJobCount}
• Default Model: ${modelConfig.trim() || 'minimax (cost-effective)'}

`;

  // Cost optimization recommendations
  report += `💡 COST OPTIMIZATION RECOMMENDATIONS
───────────────────────────────────────────────────────────
`;

  // Model recommendations
  report += `
1. MODEL SELECTION STRATEGY
   Current: ${modelConfig.trim() || 'minimax (good default)'}
   
   → Use "minimax" or "flashlite" for:
     • Daily briefs, routine tasks, simple queries
     • Internal updates, scheduling, standard content
     • Cost: ~$0.001-0.005 per request
   
   → Use "kimi" or "sonnet" for:
     • Client deliverables, strategy work
     • Complex reasoning, detailed content
     • Cost: ~$0.01-0.03 per request
   
   → Use "opus" sparingly for:
     • Highly complex analysis only
     • When quality is critical and budget allows
`;

  // Cron job optimization
  report += `
2. CRON JOB EFFICIENCY
   Current: ${cronJobCount} scheduled tasks
   
   → Review frequency: Are any tasks running too often?
   → Consider batching: Combine related tasks where possible
   → Skip low-value: Remove tasks that don't drive outcomes
   → Time shifts: Move heavy tasks to off-peak hours
`;

  // Agent optimization
  report += `
3. AGENT UTILIZATION
   Current: ${agentCount} agents configured
   
   → Audit active agents: Are all being used regularly?
   → Consolidate: Consider merging similar agents
   → Specialized: Keep dedicated agents for high-value work
   → Review: Remove agents that don't serve a clear purpose
`;

  // Quality assurance for client work
  report += `
🎯 CLIENT WORK QUALITY ASSURANCE
───────────────────────────────────────────────────────────
• Use premium models (kimi/sonnet) for ALL client deliverables
• Review outputs before delivery - human quality check
• Track client-specific costs separately if needed
• Consider "quality first" - sometimes paying more = better ROI

💰 QUICK WINS TO REDUCE COSTS
───────────────────────────────────────────────────────────
`;

  if (monthSpend > 50) {
    report += `
1. Review cron job frequency - reduce daily → weekly where possible
2. Switch simple tasks to flashlite model
3. Disable unused agents
4. Batch content creation into single sessions
`;
  } else {
    report += `
1. Your costs are well optimized - great job!
2. Continue monitoring weekly spend
3. Review agent usage quarterly
4. Focus budget on client work quality
`;
  }

  report += `
📅 NEXT REVIEW
───────────────────────────────────────────────────────────
Run this audit monthly to track changes and maintain efficiency.

══════════════════════════════════════════════════════════
`;

  return report;
}