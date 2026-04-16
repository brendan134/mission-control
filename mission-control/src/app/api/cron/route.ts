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
    
    // Cache the result
    cronCache = { jobs: data.jobs || [], timestamp: Date.now() };
    
    return NextResponse.json({ jobs: data.jobs || [] });
  } catch (error: any) {
    // If we have cached data, return it even if stale
    if (cronCache) {
      return NextResponse.json({ jobs: cronCache.jobs, stale: true });
    }
    // Return fallback jobs
    return NextResponse.json({ jobs: [], error: error.message }, { status: 200 });
  }
}