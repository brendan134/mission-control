import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

// Simple in-memory cache for cron jobs
let cronCache: { jobs: any[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute cache

export async function GET() {
  // Check cache first
  if (cronCache && Date.now() - cronCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ jobs: cronCache.jobs });
  }

  try {
    const output = execSync('openclaw cron list --json 2>/dev/null', { 
      encoding: 'utf8', 
      timeout: 15000  // 15 seconds - openclaw is slow
    });
    
    let data;
    try {
      data = JSON.parse(output);
    } catch {
      // If not JSON, return empty
      data = { jobs: [] };
    }
    
    // Sort jobs by time (morning to night)
    const sortedJobs = (data.jobs || []).sort((a: any, b: any) => {
      const getHour = (job: any) => {
        const expr = job.schedule?.expr || '';
        const parts = expr.split(' ');
        // cron expr: minute hour day month dow
        return parseInt(parts[1]) || 0;
      };
      // Handle different timezones - convert to 24h format for sorting
      // Australia/Sydney is UTC+10/+11
      const aHour = getHour(a);
      const bHour = getHour(b);
      return aHour - bHour;
    });
    
    // Cache the result
    cronCache = { jobs: sortedJobs, timestamp: Date.now() };
    
    return NextResponse.json({ jobs: sortedJobs });
  } catch (error: any) {
    // If we have cached data, return it even if stale
    if (cronCache) {
      return NextResponse.json({ jobs: cronCache.jobs, stale: true });
    }
    // Return fallback jobs
    return NextResponse.json({ jobs: [], error: error.message }, { status: 200 });
  }
}