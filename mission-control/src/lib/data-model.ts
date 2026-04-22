// Mission Control Data Model - v1
// Central object: Task

// ==================== ENUMS ====================

export enum TaskType {
  CLIENT_DELIVERY = 'Client Delivery',
  CONTENT = 'Content',
  SYSTEM_AI = 'System/AI',
  PERSONAL = 'Personal',
}

export enum TemplateType {
  PAM = 'PAM',
  QSGP = 'QSGP',
  CONTENT = 'Content',
  SYSTEM = 'System',
  GENERAL = 'General',
}

export enum Stage {
  CAPTURE = 'Capture',
  DEFINE = 'Define',
  IN_PROGRESS = 'In Progress',
  WAITING = 'Waiting',
  REVIEW = 'Review',
  DONE = 'Done',
}

// Orchestration states for Agent Orchestrator
export enum OrchestrationState {
  INTAKE = 'intake',
  ANALYZING = 'analyzing',
  PREP = 'prep',
  ACTIVE = 'active',
  REVIEW = 'review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum OwnerType {
  BRENDAN = 'Brendan',
  AI_AGENT = 'AI Agent',
  PH_TEAM = 'PH Team',
  EXTERNAL = 'External',
}

export enum AgentStatus {
  ACTIVE = 'Active',
  IDLE = 'Idle',
  BUSY = 'Busy',
  ERROR = 'Error',
  OFFLINE = 'Offline',
}

export enum TaskStatus {
  ACTIVE = 'Active',
  BLOCKED = 'Blocked',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum EventType {
  COMPLETED = 'completion',
  ERROR = 'error',
  ESCALATION = 'escalation',
  DECISION_REQUIRED = 'decision_required',
  BLOCKED = 'blocked',
  UNBLOCKED = 'unblocked',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CREATED = 'created',
  MOVED = 'moved',
}

export enum Severity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum ProjectStatus {
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

// ==================== SCHEMAS ====================

// Project must be defined before Task since Task references Project
export interface Project {
  // Identification
  id: string;
  name: string;
  description?: string;
  
  // Classification
  status: ProjectStatus;
  priority: Priority;
  
  // Ownership
  owner: string;
  
  // Dates
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  
  // Stage
  stage: 'Planning' | 'Execution' | 'Review' | 'Complete';
  
  // Relationships
  linked_task_ids: string[];
  strategic_priority_id?: string;
  
  // Derived (computed)
  progress?: number; // 0-100, derived from tasks
  last_activity_at?: string; // timestamp of last task update
  
  // Future extensions (optional)
  links?: {
    document_url?: string;
    memory_id?: string;
  };
}

export interface Task {
  // Identification
  id: string;
  title: string;
  description?: string;
  
  // Classification
  task_type: TaskType;
  template_type?: TemplateType;
  stage: Stage;
  status: TaskStatus;
  priority: Priority;
  
  // Work details
  outcome?: string;
  next_action?: string;
  blocked: boolean;
  blocked_reason?: string;
  
  // Ownership
  primary_owner_type: OwnerType;
  primary_owner_id: string;
  supporting_owner_ids: string[];
  assigned_agent_ids: string[];
  
  // Human interaction flags
  requires_human_input: boolean;
  requires_decision: boolean;
  
  // Audit
  created_by: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  completed_at?: string;
  
  // Context
  client_name?: string;
  project_id?: string; // Required: task must belong to a project
  related_task_ids: string[];
  tag_ids: string[];
  
  // Workflow
  work_in_progress_order?: number;
  review_required: boolean;
  reviewed_by?: string;
  
  // Accountability
  escalation_history?: EscalationRecord[];
  
  // Agent Orchestrator
  orchestration_state?: OrchestrationState;
  routed_to_agent_id?: string;
}

export interface EscalationRecord {
  timestamp: string;
  level: 'yellow' | 'warning' | 'critical';
  note?: string;
  escalated_to: string; // 'Niles' or 'Brendan'
}

export interface Agent {
  // Identification
  id: string;
  name: string;
  
  // Classification
  agent_type: string;
  role: string;
  parent_agent_id?: string;
  
  // Status
  status: AgentStatus;
  model_default: string;
  model_escalation?: string;
  
  // Capabilities
  task_capabilities: string[];
  
  // State
  active_task_ids: string[];
  last_active_at?: string;
  
  // Notes
  notes?: string;
}

export interface ActivityEvent {
  // Identification
  id: string;
  task_id: string;
  
  // Content
  event_type: EventType;
  severity: Severity;
  title: string;
  summary: string;
  details?: Record<string, unknown>;
  
  // Audit
  created_by_type: OwnerType;
  created_by_id: string;
  created_at: string;
  
  // Visibility
  visible_in_signal_feed: boolean;
  requires_attention: boolean;
  attention_owner_id?: string;
}

export interface TaskTemplate {
  // Identification
  id: string;
  name: string;
  
  // Defaults
  task_type: TaskType;
  default_stage: Stage;
  default_priority: Priority;
  default_outcome?: string;
  default_next_action?: string;
  default_agent_ids: string[];
  
  // Validation
  required_fields: string[];
}

export interface WeeklyPriority {
  // Identification
  id: string;
  title: string;
  task_id?: string;
  
  // Work
  outcome?: string;
  next_action?: string;
  owner_id: string;
  
  // Ranking
  priority_rank: number;
  week_start: string;
  week_end: string;
  status: 'pending' | 'in_progress' | 'completed' | 'bumped';
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// ==================== OPERATIONAL RULES ====================

/**
 * Rule 1: Task cannot move to "In Progress" unless it has:
 * - outcome
 * - primary_owner_id
 * - next_action
 */
export function canMoveToInProgress(task: Partial<Task>): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!task.outcome) missing.push('outcome');
  if (!task.primary_owner_id) missing.push('primary_owner_id');
  if (!task.next_action) missing.push('next_action');
  
  return { valid: missing.length === 0, missing };
}

/**
 * Rule 2: Waiting tasks must show blocked reason
 */
export function canMoveToWaiting(task: Partial<Task>): { valid: boolean; reason?: string } {
  if (task.blocked && !task.blocked_reason) {
    return { valid: false, reason: 'blocked_reason required when blocked' };
  }
  return { valid: true };
}

/**
 * Rule 3: Review tasks support approval flow
 */
export function canApproveReview(task: Task, reviewer_id: string): boolean {
  if (task.stage !== Stage.REVIEW) return false;
  if (!task.review_required) return false;
  return true;
}

/**
 * Rule 4: Signal feed filters for high-value events
 */
export function isSignalWorthy(event: ActivityEvent): boolean {
  return event.visible_in_signal_feed && 
    [EventType.COMPLETED, EventType.ERROR, EventType.ESCALATION, EventType.DECISION_REQUIRED, EventType.BLOCKED].includes(event.event_type);
}

// ==================== DEFAULT DATA ====================

export const DEFAULT_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tpl-pam',
    name: 'PAM',
    task_type: TaskType.CLIENT_DELIVERY,
    default_stage: Stage.CAPTURE,
    default_priority: Priority.HIGH,
    default_agent_ids: ['client-delivery'],
    required_fields: ['title', 'task_type', 'primary_owner_id', 'client_name'],
  },
  {
    id: 'tpl-qsgp',
    name: 'QSGP',
    task_type: TaskType.CLIENT_DELIVERY,
    default_stage: Stage.CAPTURE,
    default_priority: Priority.HIGH,
    default_agent_ids: ['curriculum'],
    required_fields: ['title', 'task_type', 'primary_owner_id', 'client_name'],
  },
  {
    id: 'tpl-content',
    name: 'Content',
    task_type: TaskType.CONTENT,
    default_stage: Stage.CAPTURE,
    default_priority: Priority.MEDIUM,
    default_agent_ids: ['content'],
    required_fields: ['title', 'task_type', 'primary_owner_id'],
  },
  {
    id: 'tpl-system',
    name: 'System',
    task_type: TaskType.SYSTEM_AI,
    default_stage: Stage.CAPTURE,
    default_priority: Priority.MEDIUM,
    default_agent_ids: ['ops'],
    required_fields: ['title', 'task_type', 'primary_owner_id'],
  },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: 'tag-urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'tag-client', name: 'Client', color: '#3b82f6' },
  { id: 'tag-content', name: 'Content', color: '#22c55e' },
  { id: 'tag-system', name: 'System', color: '#8b5cf6' },
  { id: 'tag-followup', name: 'Follow-up', color: '#f59e0b' },
];