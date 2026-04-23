// Agent Registry - Single Source of Truth for all 16 agents
// Used by the Agent Orchestrator for routing decisions

export interface AgentCapability {
  keywords: string[];
  topics: string[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  tier: 'A' | 'B' | 'C';
  model: string;
  reportsTo: string;
  capabilities: AgentCapability[];
  handoffTo?: string;
}

export const AGENT_TEAM: Agent[] = [
  // Tier A
  {
    id: 'niles',
    name: 'Niles',
    role: 'Chief Agent Officer (CAO)',
    tier: 'A',
    model: 'minimax',
    reportsTo: 'brendan',
    capabilities: [
      { keywords: ['oversee', 'route', 'delegate', 'coordinate'], topics: ['agent operations', 'task allocation'] },
      { keywords: ['review', 'approve', 'quality'], topics: ['agent output', 'performance'] },
    ],
  },
  // Tier B
  {
    id: 'kaizen',
    name: 'Kaizen',
    role: 'Head of Improvement',
    tier: 'B',
    model: 'kimi',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['improve', 'optimize', 'efficiency', 'fix'], topics: ['process', 'workflow', 'automation'] },
      { keywords: ['suggest', 'idea', 'recommendation'], topics: ['improvement', 'innovation'] },
    ],
  },
  {
    id: 'casey',
    name: 'Casey',
    role: 'Head of Operations',
    tier: 'B',
    model: 'flashlite',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['system', 'cron', 'deploy', 'server', 'maintenance', 'fix', 'troubleshoot', 'debug'], topics: ['technical', 'infrastructure'] },
      { keywords: ['automate', 'workflow', 'integration'], topics: ['ops', 'productivity'] },
    ],
  },
  {
    id: 'marcus',
    name: 'Marcus',
    role: 'Head of Strategy',
    tier: 'B',
    model: 'kimi',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['strategy', 'goal', 'priority', 'roadmap', 'metric'], topics: ['strategic', 'planning'] },
      { keywords: ['align', 'north star', 'objective'], topics: ['vision', 'direction'] },
    ],
  },
  {
    id: 'ian',
    name: 'Ian',
    role: 'Head of Growth (BD)',
    tier: 'B',
    model: 'kimi',
    reportsTo: 'marcus',
    capabilities: [
      { keywords: ['growth', 'new members', 'outreach', 'lead', 'prospect', 'pipeline'], topics: ['business development', 'sales'] },
      { keywords: ['email', 'linkedin', 'follow-up', 'sequence', 'nurture'], topics: ['outreach', 'conversion'] },
      { keywords: ['community', 'high-impact', 'membership'], topics: ['growth community', 'member acquisition'] },
    ],
    handoffTo: 'marcus for strategy, niles for routing',
  },
  {
    id: 'sophie',
    name: 'Sophie',
    role: 'Head of Content',
    tier: 'B',
    model: 'flashlite',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['content', 'strategy', 'production', 'social', 'improve'], topics: ['content', 'creative'] },
      { keywords: ['linkedin', 'newsletter', 'social'], topics: ['distribution'] },
    ],
  },
  {
    id: 'brandon',
    name: 'Brandon',
    role: 'Head of Messaging',
    tier: 'B',
    model: 'kimi',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['copy', 'message', 'offer', 'email', 'pitch'], topics: ['messaging', 'marketing'] },
      { keywords: ['brand', 'voice', 'tone'], topics: ['positioning'] },
    ],
  },
  {
    id: 'jerry',
    name: 'Jerry',
    role: 'Client Delivery Lead',
    tier: 'B',
    model: 'flashlite',
    reportsTo: 'niles',
    capabilities: [
      { keywords: ['client', 'delivery', 'project', 'stakeholder', 'training'], topics: ['client work', 'delivery'] },
      { keywords: ['qa', 'quality', 'review'], topics: ['assurance'] },
    ],
  },
  // Tier C
  {
    id: 'kathy',
    name: 'Kathy',
    role: 'Curriculum Specialist',
    tier: 'C',
    model: 'kimi',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['course', 'curriculum', 'training', 'learning', 'build', 'create'], topics: ['education', 'development'] },
      { keywords: ['workshop', 'material', 'module'], topics: ['content creation'] },
    ],
  },
  {
    id: 'ruby',
    name: 'Ruby',
    role: 'Podcast Producer',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['podcast', 'episode', 'audio', 'video'], topics: ['production', 'recording'] },
      { keywords: ['edit', 'show notes'], topics: ['content'] },
    ],
  },
  {
    id: 'mia',
    name: 'Mia',
    role: 'Newsletter Writer',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['newsletter', 'weekly', 'email content', 'draft', 'write'], topics: ['email marketing'] },
      { keywords: ['deep dive', 'case study', 'feature'], topics: ['long-form content'] },
    ],
  },
  {
    id: 'ethan',
    name: 'Ethan',
    role: 'LinkedIn Content Strategist',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['linkedin', 'post', 'social'], topics: ['social media'] },
      { keywords: ['thought leadership', 'engagement'], topics: ['personal brand'] },
    ],
  },
  {
    id: 'lucas',
    name: 'Lucas',
    role: 'Video Script Writer',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['script', 'video', 'reel', 'short', 'youtube', 'tiktok'], topics: ['video content'] },
      { keywords: ['story', 'narrative', 'hook'], topics: ['storytelling'] },
    ],
  },
  {
    id: 'jay',
    name: 'Jay',
    role: 'YouTube Specialist',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'sophie',
    capabilities: [
      { keywords: ['youtube', 'seo', 'thumbnail', 'optimize', 'optimise', 'video', 'design'], topics: ['video optimization'] },
      { keywords: ['channel', 'description', 'tags'], topics: ['platform growth'] },
    ],
  },
  {
    id: 'zoe',
    name: 'Zoe',
    role: 'Email Sequence Strategist',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'brandon',
    capabilities: [
      { keywords: ['sequence', 'nurture', 'automation', 'prospect', 'outreach', 'cold', 'email', 'pitch', 'sales', 'launch'], topics: ['email automation'] },
      { keywords: ['launch', 'welcome', 'follow-up'], topics: ['campaigns'] },
    ],
  },
  {
    id: 'lawrie',
    name: 'Lawrie',
    role: 'Community Manager',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'jerry',
    capabilities: [
      { keywords: ['community', 'member', 'support'], topics: ['engagement'] },
      { keywords: ['event', 'webinar', 'q&a'], topics: ['community events'] },
    ],
  },
  {
    id: 'tim',
    name: 'Tim',
    role: 'Research Analyst',
    tier: 'C',
    model: 'flashlite',
    reportsTo: 'marcus',
    capabilities: [
      { keywords: ['research', 'analysis', 'data', 'report', 'trends'], topics: ['market research'] },
      { keywords: ['competitor', 'benchmark', 'insight'], topics: ['intelligence'] },
    ],
  },
];

// Workflow States for Orchestrated Tasks
export type OrchestrationState = 
  | 'intake'      // New request received
  | 'analyzing'   // Being classified/routed
  | 'prep'        // Context being assembled
  | 'active'      // With specialist agent
  | 'review'      // Awaiting review/approval
  | 'completed'   // Done
  | 'archived';   // Archived

export const WORKFLOW_STATES: { value: OrchestrationState; label: string; color: string }[] = [
  { value: 'intake', label: 'Intake', color: '#6b7280' },
  { value: 'analyzing', label: 'Analyzing', color: '#8b5cf6' },
  { value: 'prep', label: 'Prep', color: '#f59e0b' },
  { value: 'active', label: 'Active', color: '#3b82f6' },
  { value: 'review', label: 'Review', color: '#10b981' },
  { value: 'completed', label: 'Completed', color: '#22c55e' },
  { value: 'archived', label: 'Archived', color: '#9ca3af' },
];

// Routing Logic
export function findBestAgent(taskDescription: string): Agent | null {
  const lowerDesc = taskDescription.toLowerCase();
  
  let bestMatch: Agent | null = null;
  let highestScore = 0;
  
  for (const agent of AGENT_TEAM) {
    let score = 0;
    
    for (const cap of agent.capabilities) {
      // Check keywords
      for (const keyword of cap.keywords) {
        if (lowerDesc.includes(keyword)) {
          score += 2;
        }
      }
      // Check topics
      for (const topic of cap.topics) {
        if (lowerDesc.includes(topic)) {
          score += 3;
        }
      }
    }
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = agent;
    }
  }
  
  // Default to Niles if no clear match
  return bestMatch || AGENT_TEAM.find(a => a.id === 'niles') || null;
}

export function getAgentById(id: string): Agent | undefined {
  return AGENT_TEAM.find(a => a.id === id);
}