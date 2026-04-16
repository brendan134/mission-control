import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { BUDGET_CONFIG } from '@/lib/config';

export const dynamic = 'force-dynamic';

// Cache for 5 minutes
let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchOpenRouterActivity(dateStr: string) {
  const apiKey = process.env.OPENROUTER_MANAGEMENT_KEY;
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://openrouter.ai/api/v1/activity?date=${dateStr}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  // Check cache first
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const todayStr = now.toISOString().split('T')[0];

    const dailyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();
    const modelMap = new Map<string, number>();

    // Fetch last 7 days only (was 30 - too slow)
    const dateStrings = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dateStrings.push(date.toISOString().split('T')[0]);
    }

    const results = await Promise.all(dateStrings.map(d => fetchOpenRouterActivity(d)));
    
    for (const data of results) {
      if (!data?.data) continue;

      for (const item of data.data) {
        const cost = item.usage || 0;
        const model = item.model || 'unknown';
        const itemDate = item.date;
        if (!itemDate) continue;

        const datePart = itemDate.split(' ')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        const dayKey = datePart;
        
        const isCurrentMonth = year === currentYear && month === currentMonth;

        if (isCurrentMonth) {
          dailyMap.set(dayKey, (dailyMap.get(dayKey) || 0) + cost);
        }

        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + cost);
        modelMap.set(model, (modelMap.get(model) || 0) + cost);
      }
    }

    const todaySpend = dailyMap.get(todayStr) || 0;
    const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const monthSpend = monthlyMap.get(currentMonthKey) || 0;

    const usageByModel: Record<string, number> = {};
    for (const [model, spend] of modelMap) {
      usageByModel[model] = Math.round(spend * 100) / 100;
    }

    // Get OpenClaw status with short timeout
    let messages = 0;
    let agents = 1;
    let gatewayStatus = 'unknown';
    
    try {
      const statusOutput = execSync('openclaw status --json', { encoding: 'utf8', timeout: 3000 });
      const status = JSON.parse(statusOutput);
      
      agents = status.agents?.agents?.length || 1;
      const sessions = status.sessions?.byAgent || [];
      sessions.forEach((agent: any) => {
        messages += agent.count || 0;
        messages += agent.recent?.length || 0;
      });
      gatewayStatus = status.gateway?.reachable ? 'online' : 'offline';
    } catch (e) {
      // Fallback
    }

    const response = {
      todaySpend: Math.round(todaySpend * 100) / 100,
      monthSpend: Math.round(monthSpend * 100) / 100,
      budget: BUDGET_CONFIG.monthly,
      messages,
      agents,
      gatewayStatus,
      usageByModel: Object.keys(usageByModel).length > 0 ? usageByModel : undefined,
      dataSource: 'openrouter',
    };

    // Cache the response
    cache = { data: response, timestamp: Date.now() };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error fetching stats:', error.message);
    return NextResponse.json({
      todaySpend: 0,
      monthSpend: 0,
      budget: BUDGET_CONFIG.monthly,
      messages: 0,
      agents: 1,
      gatewayStatus: 'unknown',
    });
  }
}