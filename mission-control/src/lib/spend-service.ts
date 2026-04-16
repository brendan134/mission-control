import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '..', '.spend-cache.json');

// In-memory cache to avoid repeated API calls
let memoryCache: { total: number; timestamp: number } | null = null;
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface SpendCache {
  lastTotal: number;
  lastDate: string;
  yesterdaySpend: number;
}

function getCachedSpend(): SpendCache {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (e) {
    // Cache file doesn't exist or is invalid
  }
  
  return { lastTotal: 0, lastDate: '', yesterdaySpend: 0 };
}

function setCachedSpend(data: SpendCache): void {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    // Failed to write cache
  }
}

function getOpenRouterSpend(): number {
  // Check memory cache first
  if (memoryCache && Date.now() - memoryCache.timestamp < MEMORY_CACHE_TTL) {
    return memoryCache.total;
  }

  try {
    const { execSync } = require('child_process');
    const output = execSync('curl -s "https://openrouter.ai/api/v1/credits" -H "Authorization: Bearer $OPENROUTER_API_KEY" 2>/dev/null', { encoding: 'utf8', timeout: 5000 });
    const data = JSON.parse(output);
    const total = data.data?.total_usage || 0;
    
    // Update memory cache
    memoryCache = { total, timestamp: Date.now() };
    
    return total;
  } catch (e) {
    // Return cached value if available
    return memoryCache?.total || 0;
  }
}

export async function getTodayAndMonthSpend() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  const currentTotal = getOpenRouterSpend();
  const cache = getCachedSpend();
  
  let todaySpend = 0;
  let monthSpend = currentTotal;
  
  if (cache.lastDate !== today) {
    if (cache.lastDate && cache.lastTotal > 0) {
      todaySpend = cache.yesterdaySpend;
    }
    
    const yesterdayTotal = cache.lastTotal || currentTotal;
    const yesterdaySpend = currentTotal - yesterdayTotal;
    
    setCachedSpend({
      lastTotal: currentTotal,
      lastDate: today,
      yesterdaySpend: yesterdaySpend
    });
  } else {
    todaySpend = cache.yesterdaySpend;
  }
  
  return { todaySpend, monthSpend };
}