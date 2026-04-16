// Cron job descriptions for display
export const CRON_DESCRIPTIONS = {
  'Git Auto-Sync Hourly': 'Commits and pushes workspace changes to GitHub. Morning run (8am) pushes to remote, evening run (8pm) only commits.',
  'Daily Cost Alert': 'Checks daily API spend and alerts via Telegram if over $4 threshold.',
  'Daily News Brief': 'Compiles top 5 global news, top 5 AU news, Liverpool FC, Australian cricket and soccer updates.',
  'Weekly Review': 'Runs cost audit, system health check, and session summary. Delivers to Telegram.',
  'Weekly Content Batch': 'Generates 3 LinkedIn posts + 1 newsletter segment using the methodology pack.'
};

// Parse cron expression to determine which days of week it runs
export function parseCronDays(expr) {
  const parts = expr.split(' ');
  if (parts.length < 5) return [];
  
  const [minute, hour, dom, month, dow] = parts;
  
  // Handle daily (every day)
  if (dom === '*' && month === '*' && dow === '*') {
    return [0, 1, 2, 3, 4, 5, 6]; // All days
  }
  
  // Handle weekly (specific day of week)
  if (dow !== '*') {
    const days = dow.split(',').map(d => parseInt(d));
    return days;
  }
  
  return [];
}
