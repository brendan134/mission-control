"use client";

import { useState, useEffect } from 'react';
import { Target, Plus, Pencil, Trash2, X, Check, TrendingUp, Users, Clock, AlertCircle } from 'lucide-react';

interface Priority {
  id: string;
  name: string;
  owner: string;
  successMetric: string;
  timeframe: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'at-risk';
  outcome: string;
  createdAt: string;
}

const defaultPriorities: Priority[] = [
  {
    id: '1',
    name: 'AI Agent System',
    owner: 'Brendan',
    successMetric: '5 active agents running',
    timeframe: 'Q2 2026',
    status: 'in-progress',
    outcome: 'Autonomous task execution for business operations',
    createdAt: new Date().toISOString(),
  }
];

const statusColors = {
  'not-started': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  'completed': 'bg-green-100 text-green-700',
  'at-risk': 'bg-red-100 text-red-700',
};

export default function StrategyPage() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    owner: '',
    successMetric: '',
    timeframe: '',
    outcome: '',
    status: 'not-started' as Priority['status'],
  });

  useEffect(() => {
    const saved = localStorage.getItem('strategy-priorities');
    if (saved) {
      setPriorities(JSON.parse(saved));
    } else {
      setPriorities(defaultPriorities);
    }
  }, []);

  useEffect(() => {
    if (priorities.length > 0) {
      localStorage.setItem('strategy-priorities', JSON.stringify(priorities));
    }
  }, [priorities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setPriorities(prev => prev.map(p => 
        p.id === editingId ? { ...form, id: editingId, createdAt: p.createdAt } : p
      ));
      setEditingId(null);
    } else {
      const newPriority: Priority = {
        ...form,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setPriorities(prev => [...prev, newPriority]);
    }
    
    setShowForm(false);
    setForm({ name: '', owner: '', successMetric: '', timeframe: '', outcome: '', status: 'not-started' });
  };

  const handleEdit = (priority: Priority) => {
    setForm(priority);
    setEditingId(priority.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setPriorities(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const getStatusIcon = (status: Priority['status']) => {
    switch (status) {
      case 'completed': return <Check className="w-4 h-4" />;
      case 'in-progress': return <TrendingUp className="w-4 h-4" />;
      case 'at-risk': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Strategy</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Define what matters.</p>
      </div>

      {/* North Star */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.2)',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target style={{ width: '24px', height: '24px', color: '#D4AF37' }} />
          <span style={{ fontSize: '16px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#D4AF37' }}>North Star</span>
        </div>
        <p style={{ fontSize: '20px', fontWeight: '700', color: '#fff', lineHeight: '1.5' }}>
          Build a $2M leadership development business powered by AI agents that help business owners create self-managing teams and experience true freedom from the day-to-day.
        </p>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Strategic Priorities</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', owner: '', successMetric: '', timeframe: '', outcome: '', status: 'not-started' }); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: 'var(--accent)',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Priority
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '100',
        }} onClick={() => setShowForm(false)}>
          <div style={{
            background: 'var(--background-secondary)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid var(--border)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{editingId ? 'Edit Priority' : 'Add Priority'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Priority Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Launch AI Agent Platform"
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Outcome (What success looks like) *</label>
                <textarea
                  value={form.outcome}
                  onChange={e => setForm({ ...form, outcome: e.target.value })}
                  placeholder="e.g., 10 businesses using autonomous agent teams"
                  required
                  rows={2}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Owner</label>
                  <input
                    type="text"
                    value={form.owner}
                    onChange={e => setForm({ ...form, owner: e.target.value })}
                    placeholder="e.g., Brendan"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Timeframe</label>
                  <input
                    type="text"
                    value={form.timeframe}
                    onChange={e => setForm({ ...form, timeframe: e.target.value })}
                    placeholder="e.g., Q2 2026"
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Success Metric</label>
                <input
                  type="text"
                  value={form.successMetric}
                  onChange={e => setForm({ ...form, successMetric: e.target.value })}
                  placeholder="e.g., $50K MRR"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as Priority['status'] })}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="at-risk">At Risk</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button
                type="submit"
                style={{
                  padding: '12px',
                  background: 'var(--accent)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '8px',
                }}
              >
                {editingId ? 'Save Changes' : 'Add Priority'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '100',
        }} onClick={() => setDeleteConfirm(null)}>
          <div style={{
            background: 'var(--background-secondary)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '400px',
            border: '1px solid var(--border)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Delete Priority?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Are you sure you want to delete this priority? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 16px',
                  background: 'var(--background-tertiary)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '10px 16px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Priorities List */}
      {priorities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <Target className="w-12 h-12 mx-auto mb-4" style={{ opacity: 0.5 }} />
          <p>No strategic priorities yet.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Add your first priority to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {priorities.map(priority => (
            <div
              key={priority.id}
              style={{
                background: 'var(--background-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: '1' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{priority.name}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{priority.outcome}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={statusColors[priority.status]} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    {getStatusIcon(priority.status)}
                    {priority.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {priority.successMetric && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{priority.successMetric}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {priority.owner && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users className="w-4 h-4" />
                    <span>{priority.owner}</span>
                  </div>
                )}
                {priority.timeframe && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock className="w-4 h-4" />
                    <span>{priority.timeframe}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                <button
                  onClick={() => handleEdit(priority)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    background: 'var(--background-tertiary)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(priority.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}