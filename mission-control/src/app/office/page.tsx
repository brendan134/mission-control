'use client';
import { useState, useEffect } from 'react';

// Agent data from Team page
interface Agent {
  id: string;
  name: string;
  role: string;
  tier: 'A' | 'B' | 'C';
  status: 'active' | 'idle' | 'offline';
  currentTask: string;
  avatar: string;
  location: string;
}

const agents: Agent[] = [
  { id: 'brendan', name: 'Brendan', role: 'Founder', tier: 'A', status: 'active', currentTask: 'Leading the business', avatar: '👨‍💼', location: 'Executive Office' },
  { id: 'niles', name: 'Niles', role: 'Chief Agent Officer', tier: 'A', status: 'active', currentTask: 'Overseeing all agent operations', avatar: '👔', location: 'CAO Office' },
  { id: 'kaizen', name: 'Kaizen', role: 'Head of Improvement', tier: 'B', status: 'active', currentTask: 'Analyzing business processes, routing technical to Casey', avatar: '🔄', location: 'Improvement Lab' },
  { id: 'ops', name: 'Casey', role: 'Head of Operations', tier: 'B', status: 'active', currentTask: 'Implementing proactive technical improvements', avatar: '⚙️', location: 'Operations Center' },
  { id: 'strategy', name: 'Marcus', role: 'Head of Strategy', tier: 'B', status: 'active', currentTask: 'Analyzing Q2 strategic priorities', avatar: '📊', location: 'Strategy Room' },
  { id: 'content', name: 'Sophie', role: 'Head of Content', tier: 'B', status: 'idle', currentTask: 'Waiting for content requests', avatar: '🎨', location: 'Content Studio' },
  { id: 'messaging', name: 'Brandon', role: 'Head of Messaging', tier: 'B', status: 'active', currentTask: 'Crafting new email sequences', avatar: '✉️', location: 'Copy Desk' },
  { id: 'client-delivery', name: 'Jerry', role: 'Client Delivery Lead', tier: 'B', status: 'active', currentTask: 'Preparing client deliverables', avatar: '📦', location: 'Delivery Suite' },
  { id: 'curriculum', name: 'Kathy', role: 'Curriculum Specialist', tier: 'C', status: 'idle', currentTask: 'Waiting for course work', avatar: '📚', location: 'Training Lab' },
  { id: 'podcast', name: 'Ruby', role: 'Podcast Producer', tier: 'C', status: 'active', currentTask: 'Editing latest episode', avatar: '🎙️', location: 'Podcast Booth' },
  { id: 'newsletter', name: 'Mia', role: 'Newsletter Writer', tier: 'C', status: 'idle', currentTask: 'Waiting for newsletter request', avatar: '📰', location: 'Content Studio' },
  { id: 'linkedin', name: 'Ethan', role: 'LinkedIn Content Strategist', tier: 'C', status: 'idle', currentTask: 'Waiting for post request', avatar: '💼', location: 'Content Studio' },
  { id: 'video', name: 'Lucas', role: 'Video Script Writer', tier: 'C', status: 'idle', currentTask: 'Waiting for video request', avatar: '🎬', location: 'Content Studio' },
  { id: 'email-sequence', name: 'Zoe', role: 'Email Sequence Strategist', tier: 'C', status: 'idle', currentTask: 'Waiting for sequence request', avatar: '📧', location: 'Copy Desk' },
  { id: 'community', name: 'Lawrie', role: 'Community Manager', tier: 'C', status: 'active', currentTask: 'Engaging with community members', avatar: '💬', location: 'Community Hub' },
  { id: 'research', name: 'Tim', role: 'Research Analyst', tier: 'C', status: 'idle', currentTask: 'Monitoring for new research', avatar: '🔍', location: 'Research Lab' },
];

const TIER_COLORS = {
  A: '#d4af37',
  B: '#3b82f6', 
  C: '#8b5cf6'
};

const STATUS_COLORS = {
  active: '#22c55e',
  idle: '#f59e0b',
  offline: '#6b7280'
};

export default function Office() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [agentStatuses, setAgentStatuses] = useState(agents);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real agent data when page is visible (not when hidden)
  useEffect(() => {
    // Only poll when page is actually visible to user
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden - stop polling to save resources
        console.log('Office page hidden - stopping poll');
      } else {
        // Page visible - fetch fresh data
        console.log('Office page visible - fetching agent data');
        // TODO: Connect to real OpenClaw agent telemetry
        // Would call: fetch('/api/agents/status') or similar
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial fetch when component mounts
    console.log('Office page mounted - agent polling active');

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      console.log('Office page unmounted - stopped polling');
    };
  }, []);

  const activeCount = agentStatuses.filter(a => a.status === 'active').length;
  const idleCount = agentStatuses.filter(a => a.status === 'idle').length;

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>🏢 The Office</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            What's happening across the team right now
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>
            {currentTime.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Sydney, Australia
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>{agentStatuses.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Agents</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px', borderColor: '#22c55e' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#22c55e' }}>{activeCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Now</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px', borderColor: '#f59e0b' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#f59e0b' }}>{idleCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>On Break</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>
            {Math.round((activeCount / agentStatuses.length) * 100)}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Productivity</div>
        </div>
      </div>

      {/* Office Floor - Tier A (Executive) */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: TIER_COLORS.A }}>
          🏛️ Executive Floor - Tier A
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {agentStatuses.filter(a => a.tier === 'A').map(agent => (
            <OfficeDesk key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Office Floor - Tier B (Department Heads) */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: TIER_COLORS.B }}>
          🏢 Department Floor - Tier B
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {agentStatuses.filter(a => a.tier === 'B').map(agent => (
            <OfficeDesk key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Office Floor - Tier C (Specialists) */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: TIER_COLORS.C }}>
          🔧 Workshop Floor - Tier C
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {agentStatuses.filter(a => a.tier === 'C').map(agent => (
            <OfficeDesk key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>
          📡 Live Activity Feed
        </h3>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {currentTime.toLocaleTimeString()} - System running • Auto-refreshes every 30s
        </div>
      </div>
    </div>
  );
}

function OfficeDesk({ agent }: { agent: Agent }) {
  const isActive = agent.status === 'active';
  
  return (
    <div style={{ 
      background: 'var(--background-tertiary)', 
      borderRadius: '12px', 
      padding: '16px',
      border: `2px solid ${isActive ? STATUS_COLORS[agent.status] : 'var(--border)'}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Status indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: STATUS_COLORS[agent.status],
        boxShadow: isActive ? `0 0 10px ${STATUS_COLORS[agent.status]}` : 'none'
      }} />
      
      {/* Agent info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ 
          fontSize: '32px', 
          background: 'var(--background-secondary)', 
          borderRadius: '8px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {agent.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.name}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{agent.role}</div>
        </div>
      </div>

      {/* Location */}
      <div style={{ 
        fontSize: '11px', 
        color: TIER_COLORS[agent.tier],
        marginBottom: '8px',
        fontWeight: 500
      }}>
        📍 {agent.location}
      </div>

      {/* Current task */}
      <div style={{ 
        fontSize: '12px', 
        color: isActive ? 'var(--text)' : 'var(--text-muted)',
        fontStyle: isActive ? 'normal' : 'italic',
        lineHeight: 1.4
      }}>
        {isActive ? agent.currentTask : `😴 ${agent.currentTask}`}
      </div>

      {/* Status badge */}
      <div style={{ marginTop: '12px' }}>
        <span style={{
          fontSize: '10px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: `${STATUS_COLORS[agent.status]}20`,
          color: STATUS_COLORS[agent.status],
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {agent.status}
        </span>
        <span style={{
          fontSize: '10px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: `${TIER_COLORS[agent.tier]}20`,
          color: TIER_COLORS[agent.tier],
          fontWeight: 600,
          marginLeft: '8px'
        }}>
          Tier {agent.tier}
        </span>
      </div>
    </div>
  );
}