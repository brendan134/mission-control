'use client';
import { useState, useEffect } from 'react';
import {
  Folder, Plus, AlertTriangle, TrendingUp, Clock,
  ChevronRight, Target, Users, Calendar, ArrowRight
} from 'lucide-react';
import { 
  getProjects, getActiveProjects, getHighPriorityProjects, getStaleProjects,
  getProjectProgress, getLastActivity, getNextBestTask, createProject, deleteProject,
  initializeSampleProjects
} from '../../lib/project-service';
import { Project, ProjectStatus, Priority, Task } from '../../lib/data-model';

// Sample tasks for demo - in production, fetch from real source
const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Define client objectives',
    description: 'Work with client to establish Q2 goals',
    task_type: 'Client Delivery' as any,
    stage: 'In Progress' as any,
    status: 'Active' as any,
    priority: 'High' as any,
    primary_owner_type: 'Brendan' as any,
    primary_owner_id: 'brendan',
    supporting_owner_ids: [],
    assigned_agent_ids: [],
    requires_human_input: true,
    requires_decision: true,
    created_by: 'brendan',
    created_at: '2026-04-01T10:00:00Z',
    updated_at: '2026-04-09T14:00:00Z',
    blocked: false,
    review_required: false,
    project_id: 'proj-sample-1',
    related_task_ids: [],
    tag_ids: [],
  },
  {
    id: 'task-2',
    title: 'Create content calendar',
    description: 'Plan Q2 content themes',
    task_type: 'Content' as any,
    stage: 'Define' as any,
    status: 'Active' as any,
    priority: 'Medium' as any,
    primary_owner_type: 'Brendan' as any,
    primary_owner_id: 'brendan',
    supporting_owner_ids: [],
    assigned_agent_ids: [],
    requires_human_input: false,
    requires_decision: false,
    created_by: 'brendan',
    created_at: '2026-04-05T10:00:00Z',
    updated_at: '2026-04-08T10:00:00Z',
    blocked: false,
    review_required: false,
    project_id: 'proj-sample-2',
    related_task_ids: [],
    tag_ids: [],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    owner: 'Brendan',
    stage: 'Planning',
  });

  useEffect(() => {
    initializeSampleProjects();
    loadProjects();
    // Fallback timeout in case something hangs
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const loadProjects = () => {
    const all = getProjects();
    setProjects(all);
    setLoading(false);
  };

  const activeProjects = projects.filter(p => p.status === ProjectStatus.ACTIVE);
  const highPriority = projects.filter(p => p.priority === Priority.HIGH && p.status === ProjectStatus.ACTIVE);
  const stale = getStaleProjects(7);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-AU');
  };

  const handleCreateProject = () => {
    if (!newProject.name) return;
    const created = createProject({
      name: newProject.name,
      description: newProject.description,
      priority: newProject.priority as any,
      owner: newProject.owner,
      status: ProjectStatus.ACTIVE,
      stage: newProject.stage as any,
    });
    setProjects([...projects, created]);
    setShowCreate(false);
    setNewProject({ name: '', description: '', priority: 'Medium', owner: 'Brendan', stage: 'Planning' });
  };

  const getProjectTasks = (projectId: string) => {
    return sampleTasks.filter(t => t.project_id === projectId);
  };

  const getNextAction = (projectId: string) => {
    const result = getNextBestTask(projectId, sampleTasks);
    return result;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading projects...
      </div>
    );
  }

  // If a project is selected, show detail view
  if (selectedProject) {
    const projectTasks = getProjectTasks(selectedProject.id);
    const nextAction = getNextAction(selectedProject.id);
    const progress = getProjectProgress(selectedProject.id, sampleTasks);

    return (
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setSelectedProject(null)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '8px'
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>{selectedProject.name}</h1>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
              {selectedProject.description || 'No description'}
            </p>
          </div>
        </div>

        {/* AI Focus Recommendation */}
        {nextAction.task && (
          <div style={{
            marginBottom: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 134, 11, 0.05))',
            border: '1px solid var(--accent-gold)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Target size={20} style={{ color: 'var(--accent-gold)' }} />
              <span style={{ fontWeight: 600, color: 'var(--accent-gold)' }}>Next Best Action</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>
              {nextAction.task.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {nextAction.reason}
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Status</div>
            <div style={{ fontWeight: 500 }}>{selectedProject.status}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</div>
            <div style={{ fontWeight: 500, color: selectedProject.priority === 'High' ? '#ef4444' : 'inherit' }}>
              {selectedProject.priority}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Owner</div>
            <div style={{ fontWeight: 500 }}>{selectedProject.owner}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Stage</div>
            <div style={{ fontWeight: 500 }}>{selectedProject.stage}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Progress</div>
            <div style={{ fontWeight: 500 }}>{progress}%</div>
            <div style={{
              height: '4px', background: 'var(--background-tertiary)', borderRadius: '2px', marginTop: '8px'
            }}>
              <div style={{
                height: '100%', width: `${progress}%`, background: 'var(--accent-gold)', borderRadius: '2px'
              }} />
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Last Activity</div>
            <div style={{ fontWeight: 500 }}>{formatDate(selectedProject.last_activity_at || selectedProject.updated_at)}</div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Tasks ({projectTasks.length})</h3>
            <button style={{
              padding: '8px 16px', background: 'var(--accent)', color: 'var(--background-primary)',
              border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500
            }}>
              + Add Task
            </button>
          </div>

          {projectTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              No tasks yet. Tasks will appear here when linked to this project.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projectTasks.map(task => (
                <div key={task.id} style={{
                  padding: '12px 16px', background: 'var(--background-tertiary)', borderRadius: '8px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {task.stage} • {task.priority} • {task.status}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main projects list view
  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Projects</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Source of truth for execution planning</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: 'var(--accent)', color: 'var(--background-primary)',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
          }}
        >
          <Plus size={18} /> New Project
        </button>
        </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            background: 'var(--background-secondary)', padding: '24px', borderRadius: '12px',
            width: '400px', maxWidth: '90vw'
          }}>
            <h2 style={{ marginTop: 0 }}>Create Project</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>Name *</label>
                <input
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)',
                    background: 'var(--background-primary)', color: 'var(--text)'
                  }}
                  placeholder="Project name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)',
                    background: 'var(--background-primary)', color: 'var(--text)', minHeight: '80px'
                  }}
                  placeholder="What is this project about?"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={e => setNewProject({...newProject, priority: e.target.value})}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)',
                      background: 'var(--background-primary)', color: 'var(--text)'
                    }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px' }}>Stage</label>
                  <select
                    value={newProject.stage}
                    onChange={e => setNewProject({...newProject, stage: e.target.value})}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)',
                      background: 'var(--background-primary)', color: 'var(--text)'
                    }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Execution">Execution</option>
                    <option value="Review">Review</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button
                  onClick={() => setShowCreate(false)}
                  style={{ padding: '10px 20px', border: '1px solid var(--border)', borderRadius: '6px', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  style={{ padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: '6px', color: 'var(--background-primary)', cursor: 'pointer', fontWeight: 500 }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Folder size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600 }}>{activeProjects.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active Projects</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <TrendingUp size={24} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600 }}>{highPriority.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>High Priority</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertTriangle size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 600 }}>{stale.length}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Stale (7+ days)</div>
          </div>
        </div>
      </div>

      {/* Projects Grid - 3 columns */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>All Projects</h3>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <Folder size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No projects yet. Create your first project to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {projects.map(project => {
              const progress = getProjectProgress(project.id, sampleTasks);
              const isStale = stale.some(s => s.id === project.id);
              const projectTasks = getProjectTasks(project.id);

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    padding: '20px',
                    background: isStale ? 'rgba(245, 158, 11, 0.08)' : 'var(--background-tertiary)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: isStale ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border)',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${project.name}"?`)) {
                        deleteProject(project.id);
                        initializeSampleProjects();
    loadProjects();
                      }
                    }}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'transparent', border: 'none',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      padding: '4px', opacity: 0.5
                    }}
                    title="Delete project"
                  >
                    ×
                  </button>

                  {/* Priority badges */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                    {project.priority === 'High' && (
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                        background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 600
                      }}>HIGH</span>
                    )}
                    {isStale && (
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                        background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 600
                      }}>STALE</span>
                    )}
                    <span style={{
                      fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                      background: 'var(--background-primary)', color: 'var(--text-muted)', fontWeight: 500
                    }}>{project.status}</span>
                  </div>

                  {/* Project name */}
                  <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.3 }}>
                    {project.name}
                  </h4>

                  {/* Description */}
                  {project.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.4 }}>
                      {project.description.length > 80 ? project.description.slice(0, 80) + '...' : project.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {project.stage} • {project.owner}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Progress</span>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>{progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--background-primary)', borderRadius: '3px' }}>
                      <div style={{
                        height: '100%', width: `${progress}%`,
                        background: progress === 100 ? 'var(--success)' : 'var(--accent-gold)',
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>

                  {/* Task count */}
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .card {
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}