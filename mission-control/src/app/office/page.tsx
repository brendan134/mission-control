"use client";
import { useState, useEffect } from 'react';
import { Users, Coffee, Monitor, Zap, Clock, User, Briefcase, UsersRound } from 'lucide-react';

interface OfficeAgent {
  id: string;
  name: string;
  humanName: string;
  role: string;
  status: 'active' | 'idle' | 'break' | 'offline';
  currentTask: string;
  location: 'desk' | 'meeting-room' | 'coffee-machine' | 'lounge';
  tier: 'A' | 'B' | 'C';
}

// Synced with Team page - 10 agents
const officeAgents: OfficeAgent[] = [
  {
    id: 'niles',
    name: 'Niles',
    humanName: 'Niles',
    role: 'Chief Agent Officer (CAO)',
    status: 'active',
    currentTask: 'Coordinating agent activities',
    location: 'desk',
    tier: 'A'
  },
  {
    id: 'strategy',
    name: 'Marcus',
    humanName: 'Marcus',
    role: 'Head of Strategy',
    status: 'active',
    currentTask: 'Strategic planning & priority alignment',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'ops',
    name: 'Casey',
    humanName: 'Casey',
    role: 'Head of Operations',
    status: 'idle',
    currentTask: 'Monitoring system health',
    location: 'desk',
    tier: 'A'
  },
  {
    id: 'content',
    name: 'Sarah',
    humanName: 'Sarah',
    role: 'Head of Content',
    status: 'active',
    currentTask: 'Content production oversight',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'client-delivery',
    name: 'Jordan',
    humanName: 'Jordan',
    role: 'Client Delivery Lead',
    status: 'active',
    currentTask: 'Client project management',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'kaizen',
    name: 'Kaizen',
    humanName: 'Kaizen',
    role: 'Business Improvement',
    status: 'active',
    currentTask: 'Analyzing business for improvement opportunities',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'messaging',
    name: 'Alex',
    humanName: 'Alex',
    role: 'Messaging Specialist',
    status: 'active',
    currentTask: 'Copy and offer creation',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'curriculum',
    name: 'Emily',
    humanName: 'Emily',
    role: 'Learning Design',
    status: 'idle',
    currentTask: 'Course creation',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'podcast',
    name: 'Chris',
    humanName: 'Chris',
    role: 'Media Production',
    status: 'active',
    currentTask: 'Podcast editing',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'community',
    name: 'Sam',
    humanName: 'Sam',
    role: 'Community Manager',
    status: 'idle',
    currentTask: 'Community engagement',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'research',
    name: 'Taylor',
    humanName: 'Taylor',
    role: 'Research Analyst',
    status: 'active',
    currentTask: 'Market research',
    location: 'desk',
    tier: 'C'
  }
];

const statusConfig = {
  active: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', label: 'At Work', icon: Monitor },
  idle: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', label: 'Idle', icon: Coffee },
  break: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)', label: 'On Break', icon: Coffee },
  offline: { color: '#6b7280', bg: 'rgba(107, 114, 128, 0.15)', label: 'Offline', icon: User }
};

export default function OfficePage() {
  const [agents, setAgents] = useState(officeAgents);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdate(new Date());
    const interval = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter(a => a.status === 'active').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Office</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time view of what the team is working on</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1, padding: '16px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap style={{ width: '20px', height: '20px', color: '#10b981' }} />
          </div>
          <div><div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{activeCount}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>At Work</div></div>
        </div>
        <div style={{ flex: 1, padding: '16px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
          </div>
          <div><div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{idleCount}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Idle</div></div>
        </div>
        <div style={{ flex: 1, padding: '16px', background: 'var(--background-secondary)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users style={{ width: '20px', height: '20px', color: '#D4AF37' }} />
          </div>
          <div><div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>{agents.length}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Team</div></div>
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Updating...'}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {agents.map(agent => {
          const StatusIcon = statusConfig[agent.status].icon;
          return (
            <div key={agent.id} style={{ padding: '16px', background: statusConfig[agent.status].bg, border: `1px solid ${statusConfig[agent.status].color}40`, borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: statusConfig[agent.status].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                  {agent.humanName.charAt(0)}
                </div>
                <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '600', background: statusConfig[agent.status].bg, color: statusConfig[agent.status].color, border: `1px solid ${statusConfig[agent.status].color}40` }}>
                  {statusConfig[agent.status].label}
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}><div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{agent.humanName}</div><div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.role}</div></div>
              <div style={{ padding: '8px', background: 'var(--background-tertiary)', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{agent.currentTask}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}><Briefcase style={{ width: 12, height: 12 }} />{agent.location}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
