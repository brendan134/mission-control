'use client';
const agents = [
  { id: 'main', name: 'Main Agent', tier: 'B', model: 'minimax', status: 'Active' },
  { id: 'strategy', name: 'Strategy Agent', tier: 'C', model: 'kimi', status: 'Active' },
  { id: 'messaging', name: 'Messaging Agent', tier: 'C', model: 'kimi', status: 'Active' },
  { id: 'content', name: 'Content Agent', tier: 'B', model: 'minimax', status: 'Active' },
  { id: 'curriculum', name: 'Curriculum Agent', tier: 'C', model: 'kimi', status: 'Active' },
  { id: 'client- delivery', name: 'Client Delivery', tier: 'B', model: 'minimax', status: 'Active' },
  { id: 'podcast', name: 'Podcast Agent', tier: 'B', model: 'minimax', status: 'Active' },
  { id: 'community', name: 'Community Agent', tier: 'B', model: 'minimax', status: 'Active' },
  { id: 'research', name: 'Research Agent', tier: 'C', model: 'kimi', status: 'Active' },
  { id: 'ops', name: 'System Ops', tier: 'A', model: 'flashlite', status: 'Active' },
];

export default function Agents() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>Agents</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {agents. map(agent => (
          <div key={agent.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{agent.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text- muted)' }}>{agent.model}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge" style={{ background: 'var(--background-tertiary)', color: 'var(--text-Secondary)' }}>Tier {agent.tier}</span>
              <span className="badge badge- success">{agent.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
