import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { getModelPrice } from '@/lib/config';

export const dynamic = 'force-dynamic';

function getSessionSpendData() {
  try {
    const statusOutput = execSync('openclaw status --json', { encoding: 'utf8' });
    const status = JSON.parse(statusOutput);
    const sessions = status.sessions?.byAgent || [];
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const today = now.getDate();
    
    const dailyMap = new Map<string, number>();
    const monthlyMap = new Map<string, number>();
    const modelMap = new Map<string, number>();

    for (const agentData of sessions) {
      if (!agentData.recent) continue;
      
      for (const session of agentData.recent) {
        const inputTokens = session.inputTokens || 0;
        const outputTokens = session.outputTokens || 0;
        const cacheRead = session.cacheRead || 0;
        const totalTokens = session.totalTokens || (inputTokens + outputTokens);
        const model = session.model || 'default';
        const pricePerMillion = getModelPrice(model);
        
        const tokenCost = (totalTokens / 1000000) * pricePerMillion;
        const cacheDiscount = (cacheRead / 1000000) * pricePerMillion * 0.1;
        const cost = tokenCost - cacheDiscount;
        
        const ageMs = (session.age || 0) * 1000;
        const sessionTime = new Date(now.getTime() - ageMs);
        
        const sessionDate = sessionTime.toISOString().split('T')[0];
        const sessionMonth = sessionDate.slice(0, 7);
        const monthKey = sessionMonth;
        
        // Daily (current month)
        if (sessionTime.getFullYear() === currentYear && sessionTime.getMonth() + 1 === currentMonth) {
          dailyMap.set(sessionDate, (dailyMap.get(sessionDate) || 0) + cost);
        }
        
        // Monthly
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + cost);
        
        // Model
        modelMap.set(model, (modelMap.get(model) || 0) + cost);
      }
    }

    return { dailyMap, monthlyMap, modelMap };
  } catch (error: any) {
    console.error('Error getting session data:', error.message);
    return null;
  }
}

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
  try {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const today = now.getDate();

    // Get session data as primary
    let sessionData = getSessionSpendData();
    if (!sessionData) {
      sessionData = {
        dailyMap: new Map(),
        monthlyMap: new Map(),
        modelMap: new Map()
      };
    }
    
    // Try OpenRouter for additional data
    const dailyMap = new Map(sessionData.dailyMap);
    const monthlyMap = new Map(sessionData.monthlyMap);
    const modelMapMonth = new Map(sessionData.modelMap);
    const modelMapYear = new Map(sessionData.modelMap);

    // Fetch last 14 days from OpenRouter for daily data
    for (let i = 0; i < 14; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const data = await fetchOpenRouterActivity(dateStr);
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
          modelMapMonth.set(model, (modelMapMonth.get(model) || 0) + cost);
        }
        
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + cost);
        modelMapYear.set(model, (modelMapYear.get(model) || 0) + cost);
      }
    }

    // Build daily data for current month
    const dailyData = [];
    for (let day = 1; day <= today; day++) {
      const date = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyData.push({
        date,
        dayLabel: `${day}`,
        spend: Math.round((dailyMap.get(date) || 0) * 100) / 100
      });
    }

    // Build monthly data for rolling 12 months
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentMonth - i >= 0 ? currentYear : currentYear - 1, (currentMonth - i + 12) % 12, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
      
      monthlyData.push({
        month: monthNames[month],
        year: year.toString(),
        label: `${monthNames[month]} ${year.toString().slice(2)}`,
        spend: Math.round((monthlyMap.get(monthKey) || 0) * 100) / 100
      });
    }

    // Calculate trends
    const recentDaily = dailyData.slice(-7);
    const avgRecent = recentDaily.length > 0 ? recentDaily.reduce((a, b) => a + b.spend, 0) / recentDaily.length : 0;
    const olderDaily = dailyData.slice(0, Math.max(0, dailyData.length - 7));
    const avgOlder = olderDaily.length > 0 ? olderDaily.reduce((a, b) => a + b.spend, 0) / olderDaily.length : avgRecent;
    const dailyTrend = avgRecent - avgOlder;

    const recentMonthly = monthlyData.slice(-3);
    const olderMonthly = monthlyData.slice(0, 3);
    const avgRecentMonthly = recentMonthly.reduce((a, b) => a + b.spend, 0) / recentMonthly.length;
    const avgOlderMonthly = olderMonthly.length > 0 ? olderMonthly.reduce((a, b) => a + b.spend, 0) / olderMonthly.length : avgRecentMonthly;
    const monthlyTrend = avgRecentMonthly - avgOlderMonthly;

    // Calculate totals
    const currentMonthTotal = dailyData.reduce((a, b) => a + b.spend, 0);
    const lastMonthData = monthlyData.find((m, idx) => idx === monthlyData.length - 2);
    const yearTotal = monthlyData.reduce((a, b) => a + b.spend, 0);

    // Format model data
    const formatModelData = (map: Map<string, number>) => {
      return Object.fromEntries(
        Array.from(map.entries())
          .map(([model, spend]) => [model, Math.round((spend as number) * 100) / 100])
          .filter(([, spend]) => (spend as number) > 0)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
      );
    };

    return NextResponse.json({
      daily: dailyData,
      monthly: monthlyData,
      dailyTrend: Math.round(dailyTrend * 100) / 100,
      monthlyTrend: Math.round(monthlyTrend * 100) / 100,
      currentMonthTotal: Math.round(currentMonthTotal * 100) / 100,
      lastMonthTotal: lastMonthData?.spend || 0,
      yearTotal: Math.round(yearTotal * 100) / 100,
      usageByModelMonth: formatModelData(modelMapMonth),
      usageByModelYear: formatModelData(modelMapYear),
      dataSource: 'openrouter+sessions'
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    console.error('Error in spend route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}