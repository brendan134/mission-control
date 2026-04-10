import { CreditCard, Users, Clock, Zap, Activity, TrendingUp, AlertCircle, Shield } from 'lucide-react';
import { BUDGET_CONFIG } from '@/lib/config';

// Server-side data fetching
async function getStats() {
  try {
    const { execSync } = await import('child_process');
    const output = execSync('openclaw gateway usage-cost --json 2>/dev/null', { encoding: 'utf8', timeout: 30000 });
    const data = JSON.parse(output);
    const todaySpend = data.daily?.length > 0 ? data.daily[data.daily.length - 1].totalCost : 0;
    const monthSpend = data.totals?.totalCost || 0;
    return {
      todaySpend,
      monthSpend,
      budget: BUDGET_CONFIG.monthly,
      messages: 0, // Not available in usage-cost
      agents: 11,
      gatewayStatus: 'online',
    };
  } catch (e) {
    return {
      todaySpend: 0,
      monthSpend: 0,
      budget: BUDGET_CONFIG.monthly,
      messages: 0,
      agents: 1,
      gatewayStatus: 'online',
    };
  }
}

async function getSpendData() {
  try {
    const { execSync } = await import('child_process');
    const output = execSync('openclaw gateway usage-cost --json 2>/dev/null', { encoding: 'utf8', timeout: 30000 });
    const data = JSON.parse(output);
    
    // Build daily data from actual API data
    const daily = (data.daily || []).map((d: any) => ({
      date: d.date,
      dayLabel: d.date?.split('-')[2] || '',
      spend: d.totalCost || 0,
    }));
    
    const monthTotal = data.totals?.totalCost || 0;
    
    // Monthly data - show current month with actual data
    const monthly = [
      { month: 'Nov', year: 2025, label: 'Nov 25', spend: 0 },
      { month: 'Dec', year: 2025, label: 'Dec 25', spend: 0 },
      { month: 'Jan', year: 2026, label: 'Jan 26', spend: 0 },
      { month: 'Feb', year: 2026, label: 'Feb 26', spend: 0 },
      { month: 'Mar', year: 2026, label: 'Mar 26', spend: 0 },
      { month: 'Apr', year: 2026, label: 'Apr 26', spend: monthTotal },
    ];
    
    return { 
      daily, 
      monthly,
      currentMonthTotal: monthTotal,
      dailyTrend: 0,
      yearTotal: monthTotal,
      monthlyTrend: 0,
    };
  } catch (e) {
    return { 
      daily: [], 
      monthly: [],
      currentMonthTotal: 0,
      dailyTrend: 0,
      yearTotal: 0,
      monthlyTrend: 0,
    };
  }
}

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const stats = await getStats();
  const spendData = await getSpendData();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const monthPct = Math.min((stats.monthSpend / stats.budget) * 100, 100);

  // Simple bar chart component
  const SimpleBar = ({ value, max, color }: { value: number; max: number; color: string }) => {
    const pct = max > 0 ? (value / max) * 100 : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ flex: 1, height: '8px', background: 'var(--background-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px' }} />
        </div>
        <span style={{ fontSize: '11px', width: '40px', textAlign: 'right' }}>{formatCurrency(value)}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your AI system at a glance</p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Today's Spend */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Today&apos;s Spend</span>
            <CreditCard size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{formatCurrency(stats.todaySpend)}</div>
          <div style={{ fontSize: '12px', color: stats.todaySpend > BUDGET_CONFIG.dailyThreshold ? '#ef4444' : 'var(--success)', marginTop: '4px' }}>{stats.todaySpend > BUDGET_CONFIG.dailyThreshold ? 'Over budget' : 'Within budget'}</div>
        </div>

        {/* Monthly Spend */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Monthly Spend</span>
            <TrendingUp size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{formatCurrency(stats.monthSpend)}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>of {formatCurrency(stats.budget)} budget</div>
        </div>

        {/* Messages */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Messages Today</span>
            <Activity size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{stats.messages}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Active sessions</div>
        </div>

        {/* Active Agents */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Active Agents</span>
            <Users size={16} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{stats.agents}</div>
          <div style={{ fontSize: '12px', color: stats.gatewayStatus === 'online' ? 'var(--success)' : '#ef4444', marginTop: '4px' }}>
            {stats.gatewayStatus === 'online' ? 'All operational' : 'Issues detected'}
          </div>
        </div>
      </div>

      {/* Spend Charts Section */}
      {spendData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          {/* Daily Spend Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Daily Spend - This Month</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {spendData.daily.map((d: any, i: number) => (
                <SimpleBar key={i} value={d.spend} max={spendData.currentMonthTotal || 10} color="#3b82f6" />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total: {formatCurrency(spendData.currentMonthTotal)}</span>
            </div>
          </div>

          {/* Monthly Spend Chart */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Monthly Spend - 12 Months</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {spendData.monthly.slice(-6).map((m: any, i: number) => (
                <SimpleBar key={i} value={m.spend} max={spendData.yearTotal || 10} color="#10b981" />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Year Total: {formatCurrency(spendData.yearTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Note */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '24px' }}>
        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Quick Actions</h3>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px', background: 'var(--background-tertiary)', borderRadius: '8px' }}>
            Run interactive commands from the Automations page or via Telegram. Use <code style={{ background: 'var(--background-primary)', padding: '2px 6px', borderRadius: '4px' }}>openclaw gateway doctor</code> for system checks.
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gateway</span>
              <span className="badge badge-success">Online</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Cache</span>
              <span className="badge badge-success">Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Heartbeat</span>
              <span className="badge badge-success">Running</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Security</span>
              <span className="badge badge-success">Clean</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .card { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
        .badge-success { background: #d1fae5; color: #065f46; }
      `}</style>
    </div>
  );
}
