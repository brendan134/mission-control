'use client';
import { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Filter, AlertTriangle, Clock, 
  ChevronRight, Play, Pause, CheckCircle, XCircle, Target, LayoutGrid, List
} from 'lucide-react';
import { 
  getTasks, getTasksByProject, getBlockedTasks, getWeeklyTasks,
  createTask, updateTask, completeTask, blockTask, unblockTask, startTask,
  getProjectProgress, getNextBestTask, identifyStaleTasks, suggestWeeklyFocus
} from '../../lib/task-service';
import { getProjects } from '../../lib/project-service';
import { Task, TaskStatus, Stage, Priority, TaskType, Project } from '../../lib/data-model';

// ==================== CONSTANTS ====================

const STAGES = [
  { value: Stage.CAPTURE, label: 'Capture' },
  { value: Stage.DEFINE, label: 'Define' },
  { value: Stage.IN_PROGRESS, label: 'In Progress' },
  { value: Stage.WAITING, label: 'Waiting' },
  { value: Stage.REVIEW, label: 'Review' },
  { value: Stage.DONE, label: 'Done' },
];

const PRIORITIES = [
  { value: Priority.HIGH, label: 'High', color: '#ef4444' },
  { value: Priority.MEDIUM, label: 'Medium', color: '#f59e0b' },
  { value: Priority.LOW, label: 'Low', color: '#22c55e' },
];

const TASK_TYPES = [
  { value: TaskType.CLIENT_DELIVERY, label: 'Client Delivery' },
  { value: TaskType.CONTENT, label: 'Content' },
  { value: TaskType.SYSTEM_AI, label: 'System/AI' },
  { value: TaskType.PERSONAL, label: 'Personal' },
];

// ==================== COMPONENT ====================

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterProject, setFilterProject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project_id: '',
    priority: Priority.MEDIUM,
    task_type: TaskType.CONTENT,
    stage: Stage.CAPTURE,
    primary_owner_id: 'Brendan',
    next_action: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/projects').catch(() => ({ json: () => [] }))
      ]);
      const tasksData = await tasksRes.json();
      const projectsData = await projectsRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
    setLoading(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (filterProject !== 'all' && t.project_id !== filterProject) return false;
    if (filterStatus === 'active' && (t.status === TaskStatus.COMPLETED || t.stage === Stage.DONE)) return false;
    if (filterStatus === 'blocked' && !t.blocked) return false;
    if (filterStatus === 'completed' && t.status !== TaskStatus.COMPLETED && t.stage !== Stage.DONE) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  // Sort: stale tasks first, then by priority, then by updated_at
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const getStaleScore = (t: Task) => {
      const now = Date.now();
      const updatedAt = new Date(t.updated_at).getTime();
      const days = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
      const isDone = t.stage === Stage.DONE || t.status === TaskStatus.COMPLETED;
      if (isDone) return 0;
      if (days >= 3) return 4; // critical
      if (days >= 2) return 3; // warning
      if (days >= 1) return 2; // yellow
      return 0;
    };
    const aScore = getStaleScore(a);
    const bScore = getStaleScore(b);
    if (aScore !== bScore) return bScore - aScore; // stale first
    
    // Then by priority (HIGH first)
    const priorityOrder = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
    const aPrio = priorityOrder[a.priority as Priority] || 0;
    const bPrio = priorityOrder[b.priority as Priority] || 0;
    if (aPrio !== bPrio) return bPrio - aPrio;
    
    // Then by updated_at (most recent first)
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  // Stats
  const activeCount = tasks.filter(t => t.status !== TaskStatus.COMPLETED && t.stage !== Stage.DONE).length;
  const blockedCount = tasks.filter(t => t.blocked || t.status === TaskStatus.BLOCKED).length;
  const completedCount = tasks.filter(t => t.status === TaskStatus.COMPLETED || t.stage === Stage.DONE).length;

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.project_id) return;
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          status: TaskStatus.ACTIVE,
          blocked: false,
          supporting_owner_ids: [],
          assigned_agent_ids: [],
          requires_human_input: false,
          requires_decision: false,
          created_by: 'Brendan',
          primary_owner_type: 'Brendan',
          related_task_ids: [],
          tag_ids: [],
          review_required: false,
        }),
      });
      if (res.ok) {
        setNewTask({
          title: '',
          description: '',
          project_id: '',
          priority: Priority.MEDIUM,
          task_type: TaskType.CONTENT,
          stage: Stage.CAPTURE,
          primary_owner_id: 'Brendan',
          next_action: '',
        });
        setShowCreate(false);
        loadData();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title || !editingTask.project_id) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTask.id,
          title: editingTask.title,
          description: editingTask.description,
          project_id: editingTask.project_id,
          priority: editingTask.priority,
          stage: editingTask.stage,
          next_action: editingTask.next_action,
          due_date: editingTask.due_date || undefined,
        }),
      });
      if (res.ok) {
        setEditingTask(null);
        loadData();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: taskId, 
          status: TaskStatus.COMPLETED, 
          stage: Stage.DONE,
          completed_at: new Date().toISOString()
        }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to complete task:', err);
    }
  };

  const handleStart = async (taskId: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, stage: Stage.IN_PROGRESS }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to start task:', err);
    }
  };

  const handleBlock = async (taskId: string) => {
    const reason = prompt('Why is this task blocked?');
    if (reason) {
      try {
        await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: taskId, 
            blocked: true, 
            blocked_reason: reason,
            status: TaskStatus.BLOCKED 
          }),
        });
        loadData();
      } catch (err) {
        console.error('Failed to block task:', err);
      }
    }
  };

  const handleUnblock = async (taskId: string) => {
    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: taskId, 
          blocked: false, 
          blocked_reason: null,
          status: TaskStatus.ACTIVE 
        }),
      });
      loadData();
    } catch (err) {
      console.error('Failed to unblock task:', err);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleStageChange = async (taskId: string, newStage: Stage) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, stage: newStage }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'No Project';
    const proj = projects.find(p => p.id === projectId);
    return proj?.name || 'Unknown Project';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div style={{ padding: '32px', textAlign: 'center' }}>Loading tasks...</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Execution layer — turn projects into action</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: 'var(--accent)', color: 'var(--background-primary)',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500
          }}
        >
          <Plus size={18} /> New Task
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{activeCount}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Active</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#ef4444' }}>
          <div style={{ fontSize: '28px', fontWeight: 600, color: '#ef4444' }}>{blockedCount}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Blocked</div>
        </div>
        <div className="stat-card" style={{ borderColor: '#22c55e' }}>
          <div style={{ fontSize: '28px', fontWeight: 600, color: '#22c55e' }}>{completedCount}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Completed</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '28px', fontWeight: 600 }}>{tasks.length}</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', gap: '12px', marginBottom: '24px', 
        padding: '16px', background: 'var(--background-secondary)', 
        borderRadius: '12px', border: '1px solid var(--border)'
      }}>
        <select 
          value={filterProject}
          onChange={e => setFilterProject(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        
        <select 
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="completed">Completed</option>
        </select>
        
        <select 
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={filterSelectStyle}
        >
          <option value="all">All Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          <button
            onClick={() => setViewMode('list')}
            title="List view"
            style={{
              ...filterSelectStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: viewMode === 'list' ? 'var(--accent-blue)' : 'transparent',
              color: viewMode === 'list' ? '#fff' : 'var(--text)',
            }}
          >
            <List size={14} />
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            title="Kanban view"
            style={{
              ...filterSelectStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: viewMode === 'kanban' ? 'var(--accent-blue)' : 'transparent',
              color: viewMode === 'kanban' ? '#fff' : 'var(--text)',
            }}
          >
            <LayoutGrid size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
          <Filter size={14} />
          {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreate && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0 }}>Create Task</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  style={inputStyle}
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label style={labelStyle}>Project *</label>
                <select 
                  value={newTask.project_id}
                  onChange={e => setNewTask({...newTask, project_id: e.target.value})}
                  style={inputStyle}
                >
                  <option value="">Select project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  style={{ ...inputStyle, minHeight: '60px' }}
                  placeholder="Details..."
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                    style={inputStyle}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select 
                    value={newTask.task_type}
                    onChange={e => setNewTask({...newTask, task_type: e.target.value as any})}
                    style={inputStyle}
                  >
                    {TASK_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Next Action</label>
                <input 
                  value={newTask.next_action}
                  onChange={e => setNewTask({...newTask, next_action: e.target.value})}
                  style={inputStyle}
                  placeholder="What's the immediate next step?"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setShowCreate(false)} style={cancelButtonStyle}>Cancel</button>
                <button onClick={handleCreateTask} style={createButtonStyle}>Create Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ marginTop: 0 }}>Edit Task</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input 
                  value={editingTask.title}
                  onChange={e => setEditingTask({...editingTask, title: e.target.value})}
                  style={inputStyle}
                  placeholder="What needs to be done?"
                />
              </div>
              <div>
                <label style={labelStyle}>Project *</label>
                <select 
                  value={editingTask.project_id || ''}
                  onChange={e => setEditingTask({...editingTask, project_id: e.target.value})}
                  style={inputStyle}
                >
                  <option value="">Select project...</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Stage</label>
                <select 
                  value={editingTask.stage}
                  onChange={e => setEditingTask({...editingTask, stage: e.target.value as Stage})}
                  style={inputStyle}
                >
                  {STAGES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select 
                  value={editingTask.priority}
                  onChange={e => setEditingTask({...editingTask, priority: e.target.value as any})}
                  style={inputStyle}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Next Action</label>
                <input 
                  value={editingTask.next_action || ''}
                  onChange={e => setEditingTask({...editingTask, next_action: e.target.value})}
                  style={inputStyle}
                  placeholder="What is the next step?"
                />
              </div>
              <div>
                <label style={labelStyle}>Due Date</label>
                <input 
                  type="date"
                  value={editingTask.due_date || ''}
                  onChange={e => setEditingTask({...editingTask, due_date: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button onClick={() => setEditingTask(null)} style={cancelButtonStyle}>Cancel</button>
                <button onClick={handleUpdateTask} style={createButtonStyle}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Display - List or Kanban */}
      {viewMode === 'list' ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <CheckSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No tasks yet. Create your first task to start executing.</p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const isDone = task.stage === Stage.DONE || task.status === TaskStatus.COMPLETED;
            const isBlocked = task.blocked || task.status === TaskStatus.BLOCKED;
            
            // Calculate stale level based on updated_at
            const now = Date.now();
            const updatedAt = new Date(task.updated_at).getTime();
            const hoursSinceUpdate = (now - updatedAt) / (1000 * 60 * 60);
            const daysSinceUpdate = Math.floor(hoursSinceUpdate / 24);
            let staleLevel = null;
            if (daysSinceUpdate >= 3) staleLevel = 'critical';
            else if (daysSinceUpdate >= 2) staleLevel = 'warning';
            else if (daysSinceUpdate >= 1 && !isDone) staleLevel = 'yellow';
            
            return (
              <div 
                key={task.id}
                onClick={() => setEditingTask(task)}
                style={{ 
                  padding: '16px 20px',
                  background: isDone ? 'rgba(34, 197, 94, 0.05)' : isBlocked ? 'rgba(239, 68, 68, 0.05)' : 'var(--background-secondary)',
                  borderRadius: '12px',
                  border: `1px solid ${isDone ? 'rgba(34, 197, 94, 0.2)' : isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: isDone ? 0.7 : 1,
                  cursor: 'pointer',
                }}
              >
                {/* Priority Indicator */}
                <div style={{ 
                  width: '4px', height: '40px', borderRadius: '2px',
                  background: task.priority === Priority.HIGH ? '#ef4444' : task.priority === Priority.MEDIUM ? '#f59e0b' : '#22c55e'
                }} />
                
                {/* Task Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, textDecoration: isDone ? 'line-through' : 'none' }}>
                      {task.title}
                    </span>
                    {/* Stale/Alert Indicator */}
                    {staleLevel && (
                      <span title={`${staleLevel.toUpperCase()}: ${daysSinceUpdate} days since update`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: staleLevel === 'critical' ? 'rgba(239, 68, 68, 0.15)' : staleLevel === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: staleLevel === 'critical' ? '#ef4444' : staleLevel === 'warning' ? '#f59e0b' : '#eab308',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {staleLevel === 'critical' ? '⚠' : staleLevel === 'warning' ? '⏰' : '🏴'} {daysSinceUpdate}d
                      </span>
                    )}
                    {isBlocked && <AlertTriangle size={14} color="#ef4444" />}
                    {task.priority === Priority.HIGH && (
                      <span style={priorityBadgeStyle}>HIGH</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span>{getProjectName(task.project_id)} • {task.stage}</span>
                    <span style={{ 
                      display: 'inline-flex', 
                      padding: '1px 6px', 
                      borderRadius: '4px', 
                      fontSize: '10px', 
                      fontWeight: 500,
                      background: task.primary_owner_type === 'AI Agent' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                      color: task.primary_owner_type === 'AI Agent' ? '#8b5cf6' : '#10b981'
                    }}>
                      {task.primary_owner_type === 'AI Agent' ? '🤖 AI' : task.primary_owner_type === 'PH Team' ? '👥 Team' : task.primary_owner_type === 'Brendan' ? '👤 Brendan' : '👤 Human'}
                    </span>
                    <span>{task.primary_owner_id}</span>
                    {task.due_date && <span>• Due {formatDate(task.due_date)}</span>}
                  </div>
                  {task.next_action && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-gold)', marginTop: '4px' }}>
                      → {task.next_action}
                    </div>
                  )}
                  {task.blocked_reason && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      🚫 Blocked: {task.blocked_reason}
                    </div>
                  )}
                  {task.escalation_history && task.escalation_history.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      📜 Escalations: {task.escalation_history.length} ({task.escalation_history.map((e: any) => e.level).join(', ')})
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!isDone && !isBlocked && (
                    <>
                      <button 
                        onClick={() => handleStart(task.id)}
                        title="Start task"
                        style={{ ...actionButtonStyle, color: '#3b82f6' }}
                      >
                        <Play size={16} />
                      </button>
                      <button 
                        onClick={() => handleBlock(task.id)}
                        title="Block task"
                        style={{ ...actionButtonStyle, color: '#8b5cf6' }}
                      >
                        <Pause size={16} />
                      </button>
                    </>
                  )}
                  {isBlocked && (
                    <button 
                      onClick={() => handleUnblock(task.id)}
                      title="Unblock task"
                      style={{ ...actionButtonStyle, color: '#f59e0b' }}
                    >
                      <Play size={16} />
                    </button>
                  )}
                  {!isDone && (
                    <button 
                      onClick={() => handleComplete(task.id)}
                      title="Complete task"
                      style={{ ...actionButtonStyle, color: '#22c55e' }}
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                    style={{ ...actionButtonStyle, color: '#ef4444' }}
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      ) : (
        /* Kanban Board View */
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {STAGES.map(stage => {
            const stageTasks = sortedTasks.filter(t => t.stage === stage.value);
            return (
              <div key={stage.value} style={{ 
                minWidth: '280px', 
                maxWidth: '280px',
                background: 'var(--background-secondary)', 
                borderRadius: '12px', 
                padding: '12px',
                border: '1px solid var(--border)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{stage.label}</span>
                  <span style={{ 
                    background: 'var(--accent-blue)', 
                    color: '#fff', 
                    borderRadius: '10px', 
                    padding: '2px 8px',
                    fontSize: '11px'
                  }}>{stageTasks.length}</span>
                </div>
                <div 
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '100px' }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const taskId = e.dataTransfer.getData('taskId');
                    if (taskId) handleStageChange(taskId, stage.value);
                  }}
                >
                  {stageTasks.map(task => {
                    const isDone = task.stage === Stage.DONE || task.status === TaskStatus.COMPLETED;
                    const isBlocked = task.blocked || task.status === TaskStatus.BLOCKED;
                    
                    // Calculate stale level
                    const now = Date.now();
                    const updatedAt = new Date(task.updated_at).getTime();
                    const hoursSinceUpdate = (now - updatedAt) / (1000 * 60 * 60);
                    const daysSinceUpdate = Math.floor(hoursSinceUpdate / 24);
                    let staleLevel = null;
                    if (daysSinceUpdate >= 3) staleLevel = 'critical';
                    else if (daysSinceUpdate >= 2) staleLevel = 'warning';
                    else if (daysSinceUpdate >= 1 && !isDone) staleLevel = 'yellow';
                    
                    return (
                    <div 
                      key={task.id} 
                      draggable={!isDone}
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task.id);
                      }}
                      onClick={() => setEditingTask(task)}
                      style={{ 
                      padding: '12px',
                      background: isDone ? 'rgba(34, 197, 94, 0.1)' : isBlocked ? 'rgba(239, 68, 68, 0.05)' : staleLevel ? (staleLevel === 'critical' ? 'rgba(239, 68, 68, 0.08)' : staleLevel === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(234, 179, 8, 0.08)') : 'var(--background-primary)',
                      borderRadius: '8px',
                      border: `1px solid ${staleLevel === 'critical' ? 'rgba(239, 68, 68, 0.3)' : staleLevel === 'warning' ? 'rgba(245, 158, 11, 0.3)' : staleLevel === 'yellow' ? 'rgba(234, 179, 8, 0.3)' : 'var(--border)'}`,
                      cursor: isDone ? 'default' : 'grab',
                      opacity: isDone ? 0.7 : 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{task.title}</span>
                        {/* Stale Badge for Kanban */}
                        {staleLevel && (
                          <span title={`${staleLevel.toUpperCase()}: ${daysSinceUpdate} days`} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            background: staleLevel === 'critical' ? 'rgba(239, 68, 68, 0.15)' : staleLevel === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                            color: staleLevel === 'critical' ? '#ef4444' : staleLevel === 'warning' ? '#f59e0b' : '#eab308',
                            borderRadius: '3px',
                            padding: '1px 4px',
                            fontSize: '9px',
                            fontWeight: 600
                          }}>
                            {staleLevel === 'critical' ? '⚠' : staleLevel === 'warning' ? '⏰' : '🏴'} {daysSinceUpdate}d
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span>{getProjectName(task.project_id)}</span>
                        <span style={{ 
                          display: 'inline-flex', 
                          padding: '0px 4px', 
                          borderRadius: '3px', 
                          fontSize: '9px', 
                          fontWeight: 500,
                          background: task.primary_owner_type === 'AI Agent' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: task.primary_owner_type === 'AI Agent' ? '#8b5cf6' : '#10b981'
                        }}>
                          {task.primary_owner_type === 'AI Agent' ? '🤖' : task.primary_owner_type === 'PH Team' ? '👥' : '👤'}
                        </span>
                        {task.priority === Priority.HIGH && <span style={{ color: '#ef4444' }}>HIGH</span>}
                      </div>
                      {task.next_action && (
                        <div style={{ fontSize: '11px', color: 'var(--accent-gold)', marginTop: '4px' }}>
                          → {task.next_action}
                        </div>
                      )}
                      {task.blocked_reason && (
                        <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                          🚫 Blocked: {task.blocked_reason}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {!isDone && !isBlocked && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStart(task.id); }}
                            title="Start task"
                            style={{ ...actionButtonStyle, color: '#3b82f6', padding: '4px' }}
                          >
                            <Play size={14} />
                          </button>
                        )}
                        {!isDone && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); isBlocked ? handleUnblock(task.id) : handleBlock(task.id); }}
                            title={isBlocked ? "Unblock task" : "Block task"}
                            style={{ ...actionButtonStyle, color: isBlocked ? '#f59e0b' : '#8b5cf6', padding: '4px' }}
                          >
                            <Pause size={14} />
                          </button>
                        )}
                        {!isDone && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleComplete(task.id); }}
                            title="Complete"
                            style={{ ...actionButtonStyle, color: '#22c55e', padding: '4px' }}
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(task.id); }}
                          title="Delete"
                          style={{ ...actionButtonStyle, color: '#ef4444', padding: '4px' }}
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    </div>
                  );
                  })}
                  {stageTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .stat-card {
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
        }
      `}</style>
    </div>
  );
}

const filterSelectStyle = {
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  background: 'var(--background-primary)',
  color: 'var(--text)',
  fontSize: '13px',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed' as const,
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const modalStyle = {
  background: 'var(--background-secondary)',
  padding: '24px',
  borderRadius: '12px',
  width: '480px',
  maxWidth: '90vw',
};

const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '13px',
  fontWeight: 500,
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  background: 'var(--background-primary)',
  color: 'var(--text)',
  fontSize: '14px',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  background: 'transparent',
  color: 'var(--text)',
  cursor: 'pointer',
};

const createButtonStyle = {
  padding: '10px 20px',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: '6px',
  color: 'var(--background-primary)',
  cursor: 'pointer',
  fontWeight: 500,
};

const priorityBadgeStyle = {
  fontSize: '10px',
  padding: '2px 6px',
  borderRadius: '4px',
  background: 'rgba(239, 68, 68, 0.1)',
  color: '#ef4444',
  fontWeight: 600,
};

const actionButtonStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '6px',
  color: 'var(--text-muted)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};