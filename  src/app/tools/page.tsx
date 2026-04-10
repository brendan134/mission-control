'use client'; import { Wrench, Play, Settings, Shield, Database, Activity, Zap, RefreshCw } from 'lucide-react';

const tools = [
  { id: 'cost-audit', name: 'Cost Audit', description: 'Run a full cost analysis', icon: Zap, color: '#5e6ad2' },
  { id: 'health-check', name: 'Health Check', description: 'System diagnostics', icon: Shield, color: '#22c55e' },
  { id: 'clear-cache', name: 'Clear Cache', description: 'Reset prompt cache', icon: RefreshCw, color: '#eab308' },
  { id: 'usage-stats', name: 'Usage Stats', description: 'View token usage', icon: Activity, color: '#ec4899' },
  { id: 'config-edit', name: 'Edit Config', description: 'Modify system settings', icon: Settings, color: '#06b6d4' },
  { id: 'backup', name: 'Backup System', description: 'Export workspace', icon: Database, color: '#f97316' },
]; 

export default function Tools() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Tools</h1>
        <p style={{ color: 'var(--text-Secondary)', fontSize: '14px' }}>Quick access to system utilities</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <button 
              key={tool.id} 
              className="card"
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start', 
                gap: '12px',
                cursor: 'pointer',
                border: 'none',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '8px', 
                background: `${tool.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={20} style={{ color: tool.color }} />
              </div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{tool.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{tool.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* System Info */}
      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>System Information</h3>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>OpenClaw Version</div>
              <div style={{ fontSize: '14px' }}>Latest</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Node Version</div>
              <div style={{ fontSize: '14px' }}>v22.22.2</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Platform</div>
              <div style={{ fontSize: '14px' }}>Linux (Hostinger VPS)</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Workspace Size</div>
              <div style={{ fontSize: '14px' }}>~1.1 MB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}