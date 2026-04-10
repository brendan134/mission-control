'use client';
import { useState, useEffect } from 'react';
import { 
  CheckSquare, Plus, Filter, AlertTriangle, Clock, 
  ChevronRight, Play, Pause, CheckCircle, XCircle, Target
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

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
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

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <CheckSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <p>No tasks yet. Create your first task to start executing.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDone = task.stage === Stage.DONE || task.status === TaskStatus.COMPLETED;
            const isBlocked = task.blocked || task.status === TaskStatus.BLOCKED;
            
            return (
              <div 
                key={task.id}
                style={{ 
                  padding: '16px 20px',
                  background: isDone ? 'rgba(34, 197, 94, 0.05)' : isBlocked ? 'rgba(239, 68, 68, 0.05)' : 'var(--background-secondary)',
                  borderRadius: '12px',
                  border: `1px solid ${isDone ? 'rgba(34, 197, 94, 0.2)' : isBlocked ? 'rgba(239, 68, 68, 0.2)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  opacity: isDone ? 0.7 : 1,
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
                    {isBlocked && <AlertTriangle size={14} color="#ef4444" />}
                    {task.priority === Priority.HIGH && (
                      <span style={priorityBadgeStyle}>HIGH</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {getProjectName(task.project_id)} • {task.stage} • {task.primary_owner_id}
                    {task.due_date && ` • Due ${formatDate(task.due_date)}`}
                  </div>
                  {task.next_action && (
                    <div style={{ fontSize: '12px', color: 'var(--accent-gold)', marginTop: '4px' }}>
                      → {task.next_action}
                    </div>
                  )}
                  {task.blocked_reason && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      Blocked: {task.blocked_reason}
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
                        style={actionButtonStyle}
                      >
                        <Play size={16} />
                      </button>
                      <button 
                        onClick={() => handleBlock(task.id)}
                        title="Block task"
                        style={actionButtonStyle}
                      >
                        <Pause size={16} />
                      </button>
                    </>
                  )}
                  {isBlocked && (
                    <button 
                      onClick={() => handleUnblock(task.id)}
                      title="Unblock task"
                      style={{ ...actionButtonStyle, color: '#22c55e' }}
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
                </div>
              </div>
            );
          })
        )}
      </div>

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