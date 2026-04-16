'use client';
import { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, AlertTriangle, Link2, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { StrategicPriority, getPriorities, createPriority, updatePriority, deletePriority, getProjectAlignment, updateProjectStrategicAlignment, getUnalignedProjects } from '../../lib/strategy-service';
import { Project } from '../../lib/data-model';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#22c55e' },
  { value: 'paused', label: 'Paused', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#6b7280' },
];

export default function StrategyPage() {
  const [priorities, setPriorities] = useState<StrategicPriority[]>([]);
  const [projects, setProjects] = useState<(Project & { strategic_priority_id?: string; is_orphaned?: boolean })[]>([]);
  const [unalignedProjects, setUnalignedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', owner: '', outcome: '', success_metric: '', timeframe: '', status: 'active' });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prioritiesRes, alignmentRes, unalignedRes] = await Promise.all([
        fetch('/api/strategy').catch(() => ({ json: () => [] })),
        fetch('/api/projects').catch(() => ({ json: () => [] })),
        fetch('/api/strategy/unaligned').catch(() => ({ json: () => [] }))
      ]);
      setPriorities(await prioritiesRes.json());
      setProjects(await alignmentRes.json());
      setUnalignedProjects(await unalignedRes.json());
    } catch (err) { console.error('Failed to load strategy data:', err); }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch('/api/strategy', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingId, ...formData }) });
      } else {
        await fetch('/api/strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      }
      setFormData({ name: '', owner: '', outcome: '', success_metric: '', timeframe: '', status: 'active' });
      setShowCreate(false);
      setEditingId(null);
      loadData();
    } catch (err) { console.error('Failed to save priority:', err); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch('/api/strategy', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
      setDeleteConfirm(null);
      loadData();
    } catch (err) { console.error('Failed to delete priority:', err); }
  };

  const handleEdit = (p: StrategicPriority) => { setFormData({ name: p.name, owner: p.owner, outcome: p.outcome, success_metric: p.success_metric, timeframe: p.timeframe, status: p.status }); setEditingId(p.id); setShowCreate(true); };

  const handleLinkProject = async (projectId: string, priorityId: string) => {
    try {
      await fetch('/api/strategy/link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId, priorityId }) });
      loadData();
    } catch (err) { console.error('Failed to link project:', err); }
  };

  const getStatusColor = (status: string) => STATUS_OPTIONS.find(s => s.value === status)?.color || '#6b7280';

  if (loading) return <div className="p-8 text-center text-gray-400">Loading strategy...</div>;

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(34, 197, 94, 0.1))', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>⭐</span>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#d4af37', margin: 0 }}>North Star</h2>
        </div>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>Build a $2M leadership development business powered by AI agents that helps business owners create self-managing teams and experience true freedom from the day-to-day.</p>
    </div>
    <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>Strategy</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Define what matters and ensure all projects align</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditingId(null); setFormData({ name: '', owner: '', outcome: '', success_metric: '', timeframe: '', status: 'active' }); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: 'var(--accent)', color: 'var(--background-primary)', borderRadius: '8px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
          <Plus size={18} /> Add Priority
        </button>
      </div>

      {/* Strategic Priorities */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={18} /> Strategic Priorities ({priorities.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
          {priorities.map(p => (
            <div key={p.id} style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{p.name}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Owner: {p.owner}</span>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: getStatusColor(p.status) + '20', color: getStatusColor(p.status) }}>{p.status}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}><strong>Outcome:</strong> {p.outcome}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}><strong>Metric:</strong> {p.success_metric}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}><strong>Timeframe:</strong> {p.timeframe}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(p)} style={{ padding: '6px 12px', background: 'var(--background-tertiary)', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Edit2 size={14} /> Edit</button>
                <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '6px 12px', background: '#ef444420', border: 'none', borderRadius: '6px', fontSize: '12px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
          {priorities.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No strategic priorities defined. Add one to get started.</p>}
        </div>
      </div>

      {/* Unaligned Projects Alert */}
      {unalignedProjects.length > 0 && (
        <div style={{ background: '#ef444410', border: '1px solid #ef444440', borderRadius: '12px', padding: '16px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} /> Unaligned Projects ({unalignedProjects.length})</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>These projects are not linked to any strategic priority and may need attention.</p>
          <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {unalignedProjects.map(p => <span key={p.id} style={{ padding: '4px 10px', background: 'var(--background-tertiary)', borderRadius: '4px', fontSize: '12px' }}>{p.name}</span>)}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'var(--background-secondary)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>{editingId ? 'Edit Priority' : 'Add Strategic Priority'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Priority Name *</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff' }} placeholder="e.g., Scale Content Production" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Owner *</label>
                <input value={formData.owner} onChange={e => setFormData({...formData, owner: e.target.value})} required style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff' }} placeholder="e.g., Brendan" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Expected Outcome *</label>
                <textarea value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} required rows={3} style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff', resize: 'vertical' }} placeholder="What success looks like..." />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Success Metric *</label>
                <input value={formData.success_metric} onChange={e => setFormData({...formData, success_metric: e.target.value})} required style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff' }} placeholder="e.g., 5 blog posts/week, 20% traffic increase" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Timeframe</label>
                <input value={formData.timeframe} onChange={e => setFormData({...formData, timeframe: e.target.value})} style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff' }} placeholder="e.g., Q2 2026" />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', color: '#ffffff' }}>
                  {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowCreate(false); setEditingId(null); }} style={{ padding: '10px 20px', background: 'var(--background-tertiary)', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--background-primary)', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>{editingId ? 'Save Changes' : 'Create Priority'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'var(--background-secondary)', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#ef4444' }}>Delete Priority?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>This will unlink all projects from this priority. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 20px', background: 'var(--background-tertiary)', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}