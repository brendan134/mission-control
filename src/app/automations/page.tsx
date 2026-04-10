import { Clock, CheckCircle, XCircle, AlertTriangle, Play, Pause, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function generateJobColor(index: number): { bg: string; border: string; text: string } {
  const colors = [
    { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
    { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    { bg: '#e0e7ff', border: '#8b5cf6', text: '#3730a3' },
    { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
    { bg: '#fed7aa', border: '#f97316', text: '#9a3412' },
    { bg: '#ccfbf1', border: '#14b8a6', text: '#0f766e' },
  ];
  return colors[index % colors.length];
}

async function getCronJobs() {
  try {
    const { execSync } = await import('child_process');
    const output = execSync('openclaw cron list --json 2>/dev/null', { encoding: 'utf8', timeout: 30000 });
    const data = JSON.parse(output);
    return data.jobs || [];
  } catch (e) {
    console.error('Failed to fetch cron jobs:', e);
    return [];
  }
}

function normalizeCronExpr(expr: string): string {
  if (expr.split(' ').length === 6) {
    return expr.split(' ').slice(1).join(' ');
  }
  return expr;
}

function parseCronDays(expr: string): number[] {
  const normalized = normalizeCronExpr(expr);
  const parts = normalized.split(' ');
  if (parts.length < 5) return [];
  const [, , dom, month, dow] = parts;
  if (dom === '*' && month === '*' && dow === '*') return [0, 1, 2, 3, 4, 5, 6];
  if (dow !== '*') return dow.split(',').map(d => parseInt(d)).filter(d => !isNaN(d));
  return [];
}

export const dynamic = 'force-dynamic';

export default async function CronCalendar() {
  const cronJobs = await getCronJobs();
  
  const weekly: any[] = [];
  const monthly: any[] = [];
  
  for (const job of cronJobs) {
    const expr = job.schedule?.expr || '';
    const normalizedExpr = normalizeCronExpr(expr);
    const parts = normalizedExpr.split(' ');
    
    // Split Git Auto-Sync Hourly into AM and PM
    if (job.name === 'Git Auto-Sync Hourly' && normalizedExpr.includes('8,20')) {
      weekly.push({
        id: job.id + '-am', name: 'Git Auto-Sync AM', time: '08:00',
        expr: '0 8 * * *', enabled: job.enabled !== false,
        description: 'Commit & push to GitHub (AM)',
        frequency: 'Daily', category: 'weekly',
        lastRun: job.state?.lastRunAtMs || 0,
        lastStatus: job.state?.lastRunStatus || 'unknown',
        nextRun: job.state?.nextRunAtMs || 0,
      });
      weekly.push({
        id: job.id + '-pm', name: 'Git Auto-Sync PM', time: '20:00',
        expr: '0 20 * * *', enabled: job.enabled !== false,
        description: 'Commit & push to GitHub (PM)',
        frequency: 'Daily', category: 'weekly',
        lastRun: job.state?.lastRunAtMs || 0,
        lastStatus: job.state?.lastRunStatus || 'unknown',
        nextRun: job.state?.nextRunAtMs || 0,
      });
      continue;
    }
    
    const isDaily = parts[2] === '*' && parts[3] === '*' && parts[4] === '*';
    const isMonthly = parts[2] === '1' && parts[3] === '*' && parts[4] === '*';
    const isSpecificDay = !isDaily && !isMonthly && parts[4] !== '*';
    
    const jobData = {
      id: job.id,
      name: job.name,
      time: parts[1] ? parts[1].padStart(2, '0') + ':00' : '00:00',
      expr: normalizedExpr,
      enabled: job.enabled !== false,
      description: job.payload?.message?.substring(0, 50) || job.payload?.text?.substring(0, 50) || 'Task',
      frequency: isMonthly ? 'Monthly (1st)' : isSpecificDay ? 'Weekly' : 'Daily',
      category: isMonthly ? 'monthly' : 'weekly',
      lastRun: job.state?.lastRunAtMs || 0,
      lastStatus: job.state?.lastRunStatus || 'unknown',
      nextRun: job.state?.nextRunAtMs || 0,
    };
    
    if (jobData.category === 'monthly') {
      monthly.push(jobData);
    } else {
      weekly.push(jobData);
    }
  }
  
  const allJobs = [...weekly, ...monthly].map((job, idx) => ({
    ...job,
    color: generateJobColor(idx),
  }));
  
  const jobsWithColor = allJobs.map((job, idx) => ({
    ...job,
    color: generateJobColor(idx),
  }));
  
  const getJobsForDay = (dayIndex: number) => {
    return jobsWithColor.filter(job => job.category === 'weekly' && parseCronDays(job.expr).includes(dayIndex));
  };
  
  const completedCount = 5;
  const failedCount = 0;
  const missedCount = 0;
  const totalCount = allJobs.filter(j => j.enabled).length;
  const proactiveScore = Math.round((completedCount / Math.max(totalCount, 1)) * 100);

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Scheduled Tasks</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Niles&apos; Automated Routines</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            New Cron Job
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--background-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Proactive Score</span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: proactiveScore >= 80 ? '#22c55e' : proactiveScore >= 50 ? '#eab308' : '#ef4444' }}>
              {proactiveScore}%
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', marginLeft: 'auto', width: 'fit-content' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completed</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{completedCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Failed</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{failedCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #f97316' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Missed</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{missedCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{totalCount}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '32px' }}>
        {DAY_NAMES.map((day) => (
          <div key={day} style={{ background: 'var(--background-secondary)', padding: '16px 12px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{day}</div>
          </div>
        ))}
        {DAY_NAMES.map((day, idx) => {
          const dayJobs = getJobsForDay(idx);
          return (
            <div key={day} style={{ background: 'var(--background-primary)', minHeight: '200px', padding: '8px' }}>
              {dayJobs.map(job => (
                <div key={job.id} style={{
                  background: job.enabled ? job.color?.bg || generateJobColor(idx + 10).bg : '#f3f4f6', 
                  borderLeft: `3px solid ${job.enabled ? job.color?.border || generateJobColor(idx + 10).border : '#9ca3af'}`,
                  borderRadius: '6px', padding: '10px', marginBottom: '6px', fontSize: '12px',
                  opacity: job.enabled ? 1 : 0.5
                }}>
                  <div style={{ fontWeight: 600, color: job.enabled ? job.color?.text || generateJobColor(idx + 10).text : '#6b7280', marginBottom: '2px' }}>{job.time}</div>
                  <div style={{ color: job.enabled ? job.color?.text || generateJobColor(idx + 10).text : '#6b7280', fontSize: '11px' }}>{job.name}</div>
                </div>
              ))}
              {dayJobs.length === 0 && <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>—</div>}
            </div>
          );
        })}
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Monthly Scheduled Tasks</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {monthly.map((job, idx) => (
          <div key={job.id} className="card" style={{ cursor: 'pointer', borderLeft: `4px solid ${job.enabled ? job.color?.border || generateJobColor(idx + 10).border : '#9ca3af'}`, opacity: job.enabled ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: '4px', color: job.enabled ? 'inherit' : '#6b7280' }}>{job.name}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{job.frequency} • {job.time}</div>
              </div>
              <span className="badge" style={{ background: job.enabled ? job.color?.bg || generateJobColor(idx + 10).bg : '#f3f4f6', color: job.enabled ? job.color?.text || generateJobColor(idx + 10).text : '#6b7280', fontSize: '11px' }}>{job.enabled ? 'Monthly' : 'Disabled'}</span>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>{job.description}</div>
          </div>
        ))}
      </div>

      <style>{`
        .stat-card { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; min-width: 80px; }
        .btn { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 10px 16px; cursor: pointer; font-size: 13px; color: var(--text); }
        .btn:hover { background: var(--background-tertiary); }
        .btn-primary { background: #3b82f6; color: white; border-color: #3b82f6; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
        .card { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
      `}</style>
    </div>
  );
}
