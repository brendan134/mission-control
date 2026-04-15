"use client";

import { useState, useEffect } from 'react';
import { Folder, Plus, X, Target, Users, Clock, TrendingUp, Calendar, ChevronDown, ChevronRight, Trash2, Pencil, AlertCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  priority: string;
  owner: string;
  status: string;
  stage: string;
  strategicPriorityId?: string;
  createdAt: string;
}

interface StrategicPriority {
  id: string;
  name: string;
  outcome: string;
}

// Sample projects
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Q2 Client Deliverables',
    description: 'Complete Q2 coaching deliverables for 5 clients',
    priority: 'High',
    owner: 'Brendan',
    status: 'Active',
    stage: 'In Progress',
    strategicPriorityId: '3',
    createdAt: '2026-04-01',
  },
  {
    id: '2',
    name: 'Content Calendar Q2',
    description: 'Plan and execute Q2 content strategy',
    priority: 'Medium',
    owner: 'Brendan',
    status: 'Active',
    stage: 'Planning',
    strategicPriorityId: '2',
    createdAt: '2026-04-05',
  },
  {
    id: '3',
    name: 'Podcast Episode 5',
    description: 'Record and publish episode on team autonomy',
    priority: 'Medium',
    owner: 'Brendan',
    status: 'Active',
    stage: 'In Progress',
    strategicPriorityId: '4',
    createdAt: '2026-04-10',
  },
];

// Fallback sample tasks (used if API unavailable)
const sampleProjectTasks: Record<string, { id: string; title: string; stage: string; owner: string }[]> = {
  '1': [
    { id: 't1', title: 'Review client Q2 goals', stage: 'In Progress', owner: 'Brendan' },
    { id: 't2', title: 'Create accountability framework', stage: 'Define', owner: 'Niles' },
    { id: 't3', title: 'Schedule monthly reviews', stage: 'Done', owner: 'Brendan' },
  ],
  '2': [
    { id: 't4', title: 'Brainstorm content themes', stage: 'In Progress', owner: 'Sarah' },
    { id: 't5', title: 'Set up content calendar', stage: 'Planning', owner: 'Alex' },
  ],
  '3': [
    { id: 't6', title: 'Write script', stage: 'Done', owner: 'Chris' },
    { id: 't7', title: 'Record audio', stage: 'In Progress', owner: 'Chris' },
  ],
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  'Active': { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.4)' },
  'Completed': { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.4)' },
  'On Hold': { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.4)' },
  'Cancelled': { bg: 'rgba(107, 114, 128, 0.15)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.4)' },
};

const priorityColors: Record<string, string> = {
  'High': '#dc2626',
  'Medium': '#f59e0b',
  'Low': '#10b981',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    owner: 'Brendan',
    stage: 'Planning',
    strategicPriorityId: '',
    status: 'Active',
  });

  useEffect(() => {
    // Load projects from API first, then localStorage fallback
    const loadProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          // Fallback to localStorage
          const saved = localStorage.getItem('projects');
          if (saved) setProjects(JSON.parse(saved));
          else setProjects(sampleProjects);
        }
      } catch (err) {
        // Fallback to localStorage on error
        const saved = localStorage.getItem('projects');
        if (saved) setProjects(JSON.parse(saved));
        else setProjects(sampleProjects);
      }
    };
    loadProjects();
  }, []);

  // Load strategic priorities from Strategy page
  const [strategicPriorities, setStrategicPriorities] = useState<StrategicPriority[]>([]);
  
  useEffect(() => {
    const loadPriorities = () => {
      const saved = localStorage.getItem('strategy-priorities');
      if (saved) {
        const priorities = JSON.parse(saved);
        setStrategicPriorities(priorities.map((p: any) => ({
          id: p.id,
          name: p.name,
          outcome: p.outcome,
        })));
      }
    };
    
    loadPriorities();
    // Also listen for storage changes (from other tabs)
    window.addEventListener('storage', loadPriorities);
    return () => window.removeEventListener('storage', loadPriorities);
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.strategicPriorityId) {
      alert('Please select a Strategic Priority');
      return;
    }
    
    const projectData = {
      name: form.name,
      description: form.description,
      priority: form.priority,
      owner: form.owner,
      status: form.status,
      stage: form.stage,
      strategicPriorityId: form.strategicPriorityId,
    };
    
    try {
      if (editingId) {
        // Update via API
        await fetch('/api/projects', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...projectData }),
        });
        setProjects(prev => prev.map(p => 
          p.id === editingId ? { ...projectData, id: editingId, createdAt: p.createdAt } : p
        ));
        setEditingId(null);
      } else {
        // Create via API
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });
        const createdProject = await response.json();
        const newProject: Project = {
          ...projectData,
          id: createdProject.id || Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        setProjects(prev => [...prev, newProject]);
      }
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save project. Please try again.');
    } finally {
      setShowForm(false);
      setForm({ name: '', description: '', priority: 'Medium', owner: 'Brendan', stage: 'Planning', strategicPriorityId: '', status: 'Active' });
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description,
      priority: project.priority,
      owner: project.owner,
      stage: project.stage,
      strategicPriorityId: project.strategicPriorityId || '',
      status: project.status,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const getStrategicPriority = (id?: string) => {
    if (!id) return null;
    return strategicPriorities.find(p => p.id === id);
  };

  const getProjectTasks = (projectId: string) => {
    // Use real tasks from API if available
    if (tasks.length > 0) {
      return tasks
        .filter((t: any) => t.project_id === projectId)
        .map((t: any) => ({
          id: t.id,
          title: t.title,
          stage: t.stage,
          owner: t.primary_owner_type || 'Unassigned',
        }));
    }
    // Fallback to sample data
    return sampleProjectTasks[projectId] || [];
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Projects</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track and manage your work</p>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>All Projects ({projects.length})</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', description: '', priority: 'Medium', owner: 'Brendan', stage: 'Planning', strategicPriorityId: '', status: 'Active' }); }}
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
          New Project
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
              <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Project Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Q2 Content Strategy"
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the project"
                  rows={2}
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Strategic Priority *</label>
                <select
                  value={form.strategicPriorityId}
                  onChange={e => setForm({ ...form, strategicPriorityId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                >
                  <option value="">Select a Strategic Priority...</option>
                  {strategicPriorities.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                  ))}
                </select>
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
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Stage</label>
                  <select
                    value={form.stage}
                    onChange={e => setForm({ ...form, stage: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'var(--background-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px' }}
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
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
                {editingId ? 'Save Changes' : 'Create Project'}
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Delete Project?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Are you sure you want to delete this project? This action cannot be undone.
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

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-secondary)' }}>
          <Folder className="w-12 h-12 mx-auto mb-4" style={{ opacity: 0.5 }} />
          <p>No projects yet.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Create your first project to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {projects.map(project => {
            const priority = getStrategicPriority(project.strategicPriorityId);
            const tasks = getProjectTasks(project.id);
            const isExpanded = expandedProject === project.id;
            
            return (
              <div
                key={project.id}
                style={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: '1' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{project.name}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{project.description || 'No description'}</p>
                  </div>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: '500',
                    background: statusColors[project.status]?.bg,
                    color: statusColors[project.status]?.text,
                  }}>
                    {project.status}
                  </span>
                </div>
                
                {/* Strategic Priority */}
                {priority && (
                  <div style={{ 
                    padding: '8px 12px', 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '12px',
                    color: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Target className="w-3 h-3" />
                    Linked to: {priority.name}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users className="w-3 h-3" />
                    {project.owner}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp className="w-3 h-3" />
                    {project.priority}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock className="w-3 h-3" />
                    {project.stage}
                  </div>
                </div>

                {/* Tasks Section - Click to expand */}
                {tasks.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <button
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        background: 'var(--background-tertiary)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {tasks.length} Task{tasks.length !== 1 ? 's' : ''}
                    </button>
                    
                    {isExpanded && (
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {tasks.map(task => (
                          <div
                            key={task.id}
                            style={{
                              padding: '8px 12px',
                              background: 'var(--background-primary)',
                              borderRadius: '6px',
                              fontSize: '12px',
                            }}
                          >
                            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{task.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {task.stage} • {task.owner}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <button
                    onClick={() => handleEdit(project)}
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
                    onClick={() => setDeleteConfirm(project.id)}
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
            );
          })}
        </div>
      )}
    </div>
  );
}