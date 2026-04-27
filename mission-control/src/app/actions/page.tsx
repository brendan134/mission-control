'use client';

import { useEffect, useState } from 'react';

interface ActionItem {
  owner: string;
  action: string;
  due_date: string | null;
  priority: string;
  source: string;
}

interface CallRecord {
  call_date: string;
  client: string;
  actions: ActionItem[];
}

export default function ActionsPage() {
  const [data, setData] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState('');

  useEffect(() => {
    fetch('/api/coaching-actions')
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const clients = [...new Set(data.map(d => d.client).filter(Boolean))].sort();

  const filteredData = data.filter(record => {
    const matchesSearch = filter === '' || 
      record.client?.toLowerCase().includes(filter.toLowerCase()) ||
      record.actions.some(a => a.action.toLowerCase().includes(filter.toLowerCase()));
    const matchesClient = selectedClient === '' || record.client === selectedClient;
    return matchesSearch && matchesClient;
  });

  const totalActions = filteredData.reduce((sum, r) => sum + r.actions.length, 0);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="loading">Loading action items...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
          Coaching Action Items
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {filteredData.length} calls • {totalActions} total actions
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search actions..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--background-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            minWidth: '250px'
          }}
        />
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--background-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          <option value="">All Clients</option>
          {clients.map(client => (
            <option key={client} value={client}>{client}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredData.map((record, idx) => (
          <div 
            key={idx}
            style={{
              background: 'var(--background-secondary)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{ fontWeight: '600', fontSize: '16px' }}>
                {record.client || 'Unknown Client'}
              </h3>
              <span style={{ 
                fontSize: '13px', 
                color: 'var(--text-muted)' 
              }}>
                {record.call_date}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {record.actions.map((action, actionIdx) => (
                <div 
                  key={actionIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px',
                    background: 'var(--background-primary)',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid var(--accent)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      {action.action}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      marginTop: '6px',
                      fontSize: '12px',
                      color: 'var(--text-muted)'
                    }}>
                      <span>Owner: {action.owner}</span>
                      {action.due_date && <span>Due: {action.due_date}</span>}
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: action.priority === 'High' ? 'var(--error)' : 'var(--background-secondary)',
                        color: action.priority === 'High' ? 'white' : 'inherit'
                      }}>
                        {action.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}