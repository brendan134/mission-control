'use client';
import { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, XCircle, Play, Pause, Plus, Edit2, Trash2, 
  RefreshCw, Zap, Target, GitBranch, Layers, FileOutput, Calendar, Brain,
  ChevronRight, Save, X, TrendingUp, Lightbulb
} from 'lucide-react';

// Types
interface Automation {
  id: string;
  name: string;
  objective: string;
  trigger: 'daily' | 'weekly' | 'monthly' | 'cron';
  cronExpr?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  contextSources: string[];
  routingMode: 'auto' | 'fixed';
  fixedPath?: string;
  leverageLevel: 'volume' | 'balanced' | 'leverage';
  approvalMode: 'none' | 'before-completion' | 'if-flagged' | 'always';
  outputDestination: string[];
  status: 'active' | 'paused';
  lastRun?: number;
  lastStatus?: 'success' | 'failed' | 'missed' | 'pending';
  lastResult?: string;
  nextRun?: number;
  routedBy?: string;
  agentsUsed?: string[];
  approvalRequired?: boolean;
  issues?: string[];
}

interface Insight {
  type: 'suggestion' | 'warning' | 'opportunity';
  title: string;
  description: string;
}

const SAMPLE_INSIGHTS: Insight[] = [
  { type: 'opportunity', title: 'Repetitive content creation detected', description: 'You\'ve manually created 3 newsletter summaries this month. Consider automating.' },
  { type: 'suggestion', title: 'Weekly review could be automated', description: 'Your Monday planning session follows a consistent pattern.' },
  { type: 'warning', title: '2 automations pending approval', description: 'Review required for: Content Batch, Weekly Report' },
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getLeverageColor(level: string): string {
  switch (level) {
    case 'volume': return '#22c55e';
    case 'balanced': return '#3b82f6';
    case 'leverage': return '#8b5cf6';
    default: return '#6b7280';
  }
}

function getLeverageLabel(level: string): string {
  switch (level) {
    case 'volume': return 'Volume (cheap)';
    case 'balanced': return 'Balanced';
    case 'leverage': return 'Leverage (strong)';
    default: return level;
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'success': return '#22c55e';
    case 'failed': return '#ef4444';
    case 'missed': return '#f97316';
    case 'pending': return '#eab308';
    default: return '#6b7280';
  }
}

export default function AutomationBuilder() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'details'>('list');
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [insights] = useState<Insight[]>(SAMPLE_INSIGHTS);
  const [leadershipView, setLeadershipView] = useState(false);

  const [formData, setFormData] = useState<Partial<Automation>>({
    name: '',
    objective: '',
    trigger: 'daily',
    time: '09:00',
    dayOfWeek: 1,
    dayOfMonth: 1,
    contextSources: [],
    routingMode: 'auto',
    leverageLevel: 'balanced',
    approvalMode: 'if-flagged',
    outputDestination: [],
    status: 'active',
  });

  useEffect(() => {
    const sample: Automation[] = [
      {
        id: 'auto-1',
        name: 'Daily News Brief',
        objective: 'Deliver curated industry news summary to task board',
        trigger: 'daily',
        time: '07:00',
        contextSources: ['knowledge'],
        routingMode: 'auto',
        leverageLevel: 'volume',
        approvalMode: 'if-flagged',
        outputDestination: ['task-board', 'content-queue'],
        status: 'active',
        lastRun: Date.now() - 3600000,
        lastStatus: 'success',
        lastResult: 'Delivered 12 articles to review queue',
        nextRun: Date.now() + 82800000,
        routedBy: 'Niles',
        agentsUsed: ['Research Agent', 'Writer Agent'],
      },
      {
        id: 'auto-2',
        name: 'Weekly Content Batch',
        objective: 'Generate week\'s content pipeline - 3 posts, 1 newsletter',
        trigger: 'weekly',
        dayOfWeek: 1,
        time: '06:00',
        contextSources: ['memory', 'knowledge', 'task-board'],
        routingMode: 'auto',
        leverageLevel: 'leverage',
        approvalMode: 'before-completion',
        outputDestination: ['content-queue', 'review-queue'],
        status: 'active',
        lastRun: Date.now() - 172800000,
        lastStatus: 'success',
        lastResult: 'Generated 4 content pieces, 1 pending approval',
        nextRun: Date.now() + 518400000,
        routedBy: 'Niles',
        agentsUsed: ['Content Agent', 'Editor Agent'],
        approvalRequired: true,
      },
      {
        id: 'auto-3',
        name: 'Client Health Check',
        objective: 'Run health analysis on all active client projects',
        trigger: 'weekly',
        dayOfWeek: 5,
        time: '08:00',
        contextSources: ['task-board', 'memory'],
        routingMode: 'fixed',
        fixedPath: 'HealthCheck → Report → Alert',
        leverageLevel: 'balanced',
        approvalMode: 'none',
        outputDestination: ['report-panel'],
        status: 'active',
        lastRun: Date.now() - 86400000,
        lastStatus: 'failed',
        lastResult: 'API timeout on 2 client queries',
        nextRun: Date.now() + 432000000,
        routedBy: 'Fixed Path',
        agentsUsed: ['HealthCheck Agent'],
        issues: ['API timeout errors', 'Missing data for 2 clients'],
      },
      {
        id: 'auto-4',
        name: 'Monthly Cost Review',
        objective: 'Audit monthly spend, flag anomalies, suggest optimizations',
        trigger: 'monthly',
        dayOfMonth: 1,
        time: '07:00',
        contextSources: ['knowledge'],
        routingMode: 'auto',
        leverageLevel: 'volume',
        approvalMode: 'always',
        outputDestination: ['report-panel', 'calendar'],
        status: 'paused',
        lastRun: Date.now() - 2592000000,
        lastStatus: 'success',
        lastResult: 'Spend within budget, 3 optimizations identified',
        routedBy: 'Niles',
        agentsUsed: ['Finance Agent'],
        approvalRequired: true,
      },
    ];
    setAutomations(sample);
    setLoading(false);
  }, []);

  const handleCreate = () => {
    setFormData({
      name: '',
      objective: '',
      trigger: 'daily',
      time: '09:00',
      dayOfWeek: 1,
      dayOfMonth: 1,
      contextSources: [],
      routingMode: 'auto',
      leverageLevel: 'balanced',
      approvalMode: 'if-flagged',
      outputDestination: [],
      status: 'active',
    });
    setView('create');
  };

  const handleEdit = (auto: Automation) => {
    setFormData({ ...auto });
    setSelectedAutomation(auto);
    setView('edit');
  };

  const handleSave = () => {
    if (!formData.name || !formData.objective) return;

    if (view === 'create') {
      const newAuto: Automation = {
        ...formData,
        id: generateId(),
        status: 'active',
        lastStatus: 'pending',
      } as Automation;
      setAutomations([...automations, newAuto]);
    } else if (view === 'edit' && selectedAutomation) {
      setAutomations(automations.map(a => 
        a.id === selectedAutomation.id ? { ...a, ...formData } : a
      ));
    }
    setView('list');
    setSelectedAutomation(null);
  };

  const handleDelete = (id: string) => {
    setAutomations(automations.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const toggleContextSource = (source: string) => {
    const current = formData.contextSources || [];
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    setFormData({ ...formData, contextSources: updated });
  };

  const toggleOutputDestination = (dest: string) => {
    const current = formData.outputDestination || [];
    const updated = current.includes(dest)
      ? current.filter(d => d !== dest)
      : [...current, dest];
    setFormData({ ...formData, outputDestination: updated });
  };

  const formatNextRun = (timestamp?: number) => {
    if (!timestamp) return '—';
    const diff = timestamp - Date.now();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  const activeCount = automations.filter(a => a.status === 'active').length;
  const successCount = automations.filter(a => a.lastStatus === 'success').length;
  const failedCount = automations.filter(a => a.lastStatus === 'failed').length;
  const pendingApproval = automations.filter(a => a.approvalRequired).length;

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Create/Edit Form View
  if (view === 'create' || view === 'edit') {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
            {view === 'create' ? 'Create Automation' : 'Edit Automation'}
          </h1>
          <button onClick={() => { setView('list'); setSelectedAutomation(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="form-section">
            <div className="section-header"><Target size={16} /> Core</div>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Daily News Brief"
              />
            </div>

            <div className="form-group">
              <label>Objective *</label>
              <textarea
                value={formData.objective || ''}
                onChange={e => setFormData({ ...formData, objective: e.target.value })}
                placeholder="Clear outcome to achieve..."
                rows={3}
              />
              <span className="hint">What result should this automation produce?</span>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header"><Clock size={16} /> Trigger</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Frequency</label>
                <select
                  value={formData.trigger || 'daily'}
                  onChange={e => setFormData({ ...formData, trigger: e.target.value as any })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="cron">Custom Cron</option>
                </select>
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  value={formData.time || '09:00'}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            {formData.trigger === 'weekly' && (
              <div className="form-group">
                <label>Day of Week</label>
                <select
                  value={formData.dayOfWeek ?? 1}
                  onChange={e => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                >
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                    <option key={i} value={i}>{day}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.trigger === 'monthly' && (
              <div className="form-group">
                <label>Day of Month</label>
                <select
                  value={formData.dayOfMonth ?? 1}
                  onChange={e => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                >
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.trigger === 'cron' && (
              <div className="form-group">
                <label>Cron Expression</label>
                <input
                  type="text"
                  value={formData.cronExpr || ''}
                  onChange={e => setFormData({ ...formData, cronExpr: e.target.value })}
                  placeholder="0 9 * * *"
                />
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="section-header"><Brain size={16} /> Context Sources</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'task-board', label: 'Task Board', icon: '📋' },
                { id: 'memory', label: 'Memory', icon: '🧠' },
                { id: 'knowledge', label: 'Knowledge (LBD Brain)', icon: '📚' },
                { id: 'client', label: 'Specific Client/Project', icon: '👤' },
              ].map(source => (
                <button
                  key={source.id}
                  type="button"
                  className={`chip ${(formData.contextSources || []).includes(source.id) ? 'chip-active' : ''}`}
                  onClick={() => toggleContextSource(source.id)}
                >
                  <span>{source.icon}</span> {source.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header"><GitBranch size={16} /> Routing & Leverage</div>
            
            <div className="form-group">
              <label>Routing Mode</label>
              <select
                value={formData.routingMode || 'auto'}
                onChange={e => setFormData({ ...formData, routingMode: e.target.value as any })}
              >
                <option value="auto">Default: Niles Auto-routing</option>
                <option value="fixed">Fixed Execution Path (Advanced)</option>
              </select>
            </div>

            {formData.routingMode === 'fixed' && (
              <div className="form-group">
                <label>Execution Path</label>
                <input
                  type="text"
                  value={formData.fixedPath || ''}
                  onChange={e => setFormData({ ...formData, fixedPath: e.target.value })}
                  placeholder="e.g., Research → Write → Edit → Publish"
                />
              </div>
            )}

            <div className="form-group">
              <label>Leverage Level</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['volume', 'balanced', 'leverage'].map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`chip ${formData.leverageLevel === level ? 'chip-active' : ''}`}
                    style={{ 
                      borderColor: formData.leverageLevel === level ? getLeverageColor(level) : undefined,
                      background: formData.leverageLevel === level ? `${getLeverageColor(level)}15` : undefined 
                    }}
                    onClick={() => setFormData({ ...formData, leverageLevel: level as any })}
                  >
                    {getLeverageLabel(level)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header"><Layers size={16} /> Approval & Output</div>
            
            <div className="form-group">
              <label>Approval Mode</label>
              <select
                value={formData.approvalMode || 'if-flagged'}
                onChange={e => setFormData({ ...formData, approvalMode: e.target.value as any })}
              >
                <option value="none">None - Run automatically</option>
                <option value="before-completion">Review before completion</option>
                <option value="if-flagged">Review only if flagged (error/low confidence)</option>
                <option value="always">Always require approval</option>
              </select>
            </div>

            <div className="form-group">
              <label>Output Destination</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { id: 'task-board', label: 'Task Board' },
                  { id: 'review-queue', label: 'Review Queue' },
                  { id: 'content-queue', label: 'Content Queue' },
                  { id: 'report-panel', label: 'Report Panel' },
                  { id: 'calendar', label: 'Calendar' },
                ].map(dest => (
                  <button
                    key={dest.id}
                    type="button"
                    className={`chip ${(formData.outputDestination || []).includes(dest.id) ? 'chip-active' : ''}`}
                    onClick={() => toggleOutputDestination(dest.id)}
                  >
                    {dest.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '12px' }}>
            <button onClick={() => { setView('list'); setSelectedAutomation(null); }} className="btn">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary"><Save size={16} /> Save Automation</button>
          </div>
        </div>

        <style>{formStyles}</style>
      </div>
    );
  }

  // List View
  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Automation Builder</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Define outcomes. Niles routes execution.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setLeadershipView(!leadershipView)} 
            className={`btn ${leadershipView ? 'btn-active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <TrendingUp size={16} />
            Leadership View
          </button>
          <button onClick={handleCreate} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} />
            New Automation
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', marginLeft: 'auto', width: 'fit-content' }}>
        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{activeCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #22c55e' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Successful</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{successCount}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Failed</div>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{failedCount}</div>
        </div>
        {leadershipView && (
          <div className="stat-card" style={{ borderLeft: '4px solid #eab308' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pending Approval</div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>{pendingApproval}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: leadershipView ? '2fr 1fr' : '1fr', gap: '24px' }}>
        <div>
          {leadershipView ? (
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} style={{ color: '#eab308' }} />
                Automations Requiring Attention
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {automations.filter(a => a.lastStatus === 'failed' || a.approvalRequired).map(auto => (
                  <div key={auto.id} className="card" style={{ borderLeft: `4px solid ${auto.lastStatus === 'failed' ? '#ef4444' : '#eab308'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{auto.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{auto.objective}</div>
                      </div>
                      <span className="badge" style={{ 
                        background: auto.lastStatus === 'failed' ? '#fef2f2' : '#fffbeb',
                        color: auto.lastStatus === 'failed' ? '#dc2626' : '#d97706'
                      }}>
                        {auto.lastStatus === 'failed' ? 'Failed' : 'Awaiting Approval'}
                      </span>
                    </div>
                    {auto.issues && auto.issues.length > 0 && (
                      <div style={{ marginTop: '12px', padding: '8px 12px', background: '#fef2f2', borderRadius: '6px', fontSize: '12px', color: '#dc2626' }}>
                        <strong>Issues:</strong> {auto.issues.join(', ')}
                      </div>
                    )}
                    <div style={{ marginTop: '12px', display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>Routed by: {auto.routedBy || 'Niles'}</span>
                      <span>Agents: {auto.agentsUsed?.join(', ') || '—'}</span>
                    </div>
                  </div>
                ))}

                {automations.filter(a => a.lastStatus === 'failed' || a.approvalRequired).length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--background-secondary)', borderRadius: '8px' }}>
                    <CheckCircle size={24} style={{ color: '#22c55e', marginBottom: '8px' }} />
                    <p>All automations running smoothly!</p>
                  </div>
                )}
              </div>

              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} style={{ color: '#8b5cf6' }} />
                High-Leverage Automations
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {automations.filter(a => a.leverageLevel === 'leverage').map(auto => (
                  <div key={auto.id} className="card" style={{ borderLeft: '4px solid #8b5cf6', cursor: 'pointer' }} onClick={() => { setSelectedAutomation(auto); setView('details'); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{auto.name}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{auto.objective}</div>
                      </div>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {automations.map(auto => (
                <div 
                  key={auto.id} 
                  className="card automation-card"
                  onClick={() => { setSelectedAutomation(auto); setView('details'); }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{auto.name}</span>
                        <span className="badge" style={{ background: auto.status === 'active' ? '#dcfce7' : '#f3f4f6', color: auto.status === 'active' ? '#166534' : '#6b7280' }}>{auto.status}</span>
                        <span className="badge" style={{ background: `${getLeverageColor(auto.leverageLevel)}15`, color: getLeverageColor(auto.leverageLevel) }}>{getLeverageLabel(auto.leverageLevel)}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{auto.objective}</div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} />{auto.trigger === 'daily' && `Daily @ ${auto.time}`}{auto.trigger === 'weekly' && `Weekly (${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][auto.dayOfWeek || 0]}) @ ${auto.time}`}{auto.trigger === 'monthly' && `Monthly (${auto.dayOfMonth}) @ ${auto.time}`}{auto.trigger === 'cron' && auto.cronExpr}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitBranch size={12} />{auto.routingMode === 'auto' ? 'Niles routing' : 'Fixed path'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileOutput size={12} />{auto.outputDestination?.length || 0} outputs</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${getStatusColor(auto.lastStatus)}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginBottom: '8px' }}>
                        {auto.lastStatus === 'success' && <CheckCircle size={16} style={{ color: getStatusColor(auto.lastStatus) }} />}
                        {auto.lastStatus === 'failed' && <XCircle size={16} style={{ color: getStatusColor(auto.lastStatus) }} />}
                        {auto.lastStatus === 'pending' && <Clock size={16} style={{ color: getStatusColor(auto.lastStatus) }} />}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Next: {formatNextRun(auto.nextRun)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="insights-panel">
            <div className="insights-header"><Lightbulb size={16} /> Automation Insights</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {insights.map((insight, idx) => (
                <div key={idx} className="insight-card" style={{ borderLeftColor: insight.type === 'warning' ? '#ef4444' : insight.type === 'opportunity' ? '#8b5cf6' : '#22c55e' }}>
                  <div style={{ fontWeight: 500, fontSize: '13px', marginBottom: '4px' }}>{insight.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{insight.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {view === 'details' && selectedAutomation && (
        <div className="modal-overlay" onClick={() => { setView('list'); setSelectedAutomation(null); }}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>{selectedAutomation.name}</h2>
                  <span className="badge" style={{ background: selectedAutomation.status === 'active' ? '#dcfce7' : '#f3f4f6', color: selectedAutomation.status === 'active' ? '#166534' : '#6b7280' }}>{selectedAutomation.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{selectedAutomation.objective}</div>
              </div>
              <button onClick={() => { setView('list'); setSelectedAutomation(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#6b7280' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div><div className="detail-label"><Clock size={14} /> Schedule</div><div className="detail-value">{selectedAutomation.trigger === 'daily' && `Daily at ${selectedAutomation.time}`}{selectedAutomation.trigger === 'weekly' && `Weekly on ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][selectedAutomation.dayOfWeek || 0]} at ${selectedAutomation.time}`}{selectedAutomation.trigger === 'monthly' && `Monthly on day ${selectedAutomation.dayOfMonth} at ${selectedAutomation.time}`}{selectedAutomation.trigger === 'cron' && selectedAutomation.cronExpr}</div></div>
              <div><div className="detail-label"><Zap size={14} /> Leverage</div><div className="detail-value" style={{ color: getLeverageColor(selectedAutomation.leverageLevel) }}>{getLeverageLabel(selectedAutomation.leverageLevel)}</div></div>
              <div><div className="detail-label"><GitBranch size={14} /> Routing</div><div className="detail-value">{selectedAutomation.routingMode === 'auto' ? 'Niles auto-routing' : selectedAutomation.fixedPath}</div></div>
              <div><div className="detail-label"><Layers size={14} /> Approval</div><div className="detail-value">{selectedAutomation.approvalMode === 'none' && 'None'}{selectedAutomation.approvalMode === 'before-completion' && 'Review before completion'}{selectedAutomation.approvalMode === 'if-flagged' && 'Review if flagged'}{selectedAutomation.approvalMode === 'always' && 'Always require approval'}</div></div>
            </div>

            <div style={{ marginBottom: '20px' }}><div className="detail-label"><Brain size={14} /> Context Sources</div><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>{selectedAutomation.contextSources?.map(src => (<span key={src} className="chip">{src}</span>))}</div></div>
            <div style={{ marginBottom: '20px' }}><div className="detail-label"><FileOutput size={14} /> Output Destinations</div><div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>{selectedAutomation.outputDestination?.map(dest => (<span key={dest} className="chip">{dest}</span>))}</div></div>

            <div style={{ background: 'var(--background-secondary)', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Execution Summary</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Routed by: </span>{selectedAutomation.routedBy || 'Niles'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Agents used: </span>{selectedAutomation.agentsUsed?.join(', ') || '—'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Last run: </span>{selectedAutomation.lastRun ? new Date(selectedAutomation.lastRun).toLocaleString() : 'Never'}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Status: </span><span style={{ color: getStatusColor(selectedAutomation.lastStatus), fontWeight: 500 }}>{selectedAutomation.lastStatus || 'Pending'}</span></div>
                {selectedAutomation.lastResult && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--text-muted)' }}>Result: </span>{selectedAutomation.lastResult}</div>}
                {selectedAutomation.issues && selectedAutomation.issues.length > 0 && <div style={{ gridColumn: '1 / -1', color: '#ef4444' }}><span style={{ color: 'var(--text-muted)' }}>Issues: </span>{selectedAutomation.issues.join(', ')}</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleEdit(selectedAutomation)} className="btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
              <button onClick={() => handleToggleStatus(selectedAutomation.id)} className="btn" style={{ flex: 1 }}>{selectedAutomation.status === 'active' ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Activate</>}</button>
              <button onClick={() => setShowDeleteConfirm(selectedAutomation.id)} className="btn" style={{ flex: 1, color: '#ef4444' }}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <Trash2 size={40} style={{ color: '#ef4444', marginBottom: '16px' }} />
            <h2 style={{ margin: '0 0 12px', fontSize: '18px' }}>Delete Automation?</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: '14px' }}>This automation will be permanently removed.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeleteConfirm(null)} className="btn">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="btn btn-danger">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{listStyles}</style>
    </div>
  );
}

const formStyles = `
  .form-section { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .section-header { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; margin-bottom: 16px; color: var(--text); }
  .form-group { margin-bottom: 16px; }
  .form-group:last-child { margin-bottom: 0; }
  .form-group label { display: block; font-size: 12px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid var(--border); font-size: 14px; background: var(--background-primary); color: var(--text); box-sizing: border-box; }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .hint { display: block; font-size: 11px; color: var(--text-muted); margin-top: 4px; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; background: var(--background-tertiary); border: 1px solid var(--border); cursor: pointer; transition: all 0.15s; color: var(--text-secondary); }
  .chip:hover { border-color: var(--text-muted); }
  .chip-active { background: var(--accent-gold); color: var(--background-primary); border-color: var(--accent-gold); }
  .btn { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 10px 16px; cursor: pointer; font-size: 13px; color: var(--text); display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
  .btn:hover { background: var(--background-tertiary); }
  .btn-primary { background: #3b82f6; color: white; border-color: #3b82f6; }
  .btn-primary:hover { background: #2563eb; }
  .btn-danger { background: #ef4444; color: white; border-color: #ef4444; }
  .btn-active { background: var(--accent-gold); color: var(--background-primary); border-color: var(--accent-gold); }
`;

const listStyles = `
  .stat-card { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; min-width: 80px; }
  .card { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
  .automation-card { cursor: pointer; transition: all 0.15s; }
  .automation-card:hover { border-color: var(--accent-gold); transform: translateY(-1px); }
  .badge { padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
  .insights-panel { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 12px; padding: 16px; position: sticky; top: 24px; }
  .insights-header { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; margin-bottom: 16px; color: var(--text); }
  .insight-card { background: var(--background-tertiary); border-radius: 6px; padding: 12px; border-left: 3px solid; }
  .detail-label { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  .detail-value { font-size: 14px; font-weight: 500; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 100; }
  .modal { background: var(--background-primary); border-radius: 12px; padding: 24px; width: 90%; max-width: 420px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); color: var(--text); }
  .modal-lg { max-width: 560px; }
  .modal-sm { max-width: 360px; text-align: center; }
  .btn { background: var(--background-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 10px 16px; cursor: pointer; font-size: 13px; color: var(--text); display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
  .btn:hover { background: var(--background-tertiary); }
  .btn-primary { background: #3b82f6; color: white; border-color: #3b82f6; }
  .btn-danger { background: #ef4444; color: white; border-color: #ef4444; }
`;