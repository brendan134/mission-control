"use client";

import { useState, useEffect } from 'react';
import { Users, Coffee, Monitor, Zap, Clock, User, MessageSquare, FileText, Mic, Search, Settings, Briefcase, UsersRound } from 'lucide-react';

// Agent data - synced from Team page
interface OfficeAgent {
  id: string;
  name: string;
  humanName: string;
  role: string;
  status: 'active' | 'idle' | 'break' | 'offline';
  currentTask: string;
  location: 'desk' | 'meeting-room' | 'coffee-machine' | 'lounge';
  tier: 'A' | 'B' | 'C' | 'Founder';
}

const officeAgents: OfficeAgent[] = [
  {
    id: 'founder',
    name: 'Brendan',
    humanName: 'Brendan',
    role: 'Founder',
    status: 'active',
    currentTask: 'Strategic planning & client calls',
    location: 'desk',
    tier: 'Founder'
  },
  {
    id: 'niles',
    name: 'Niles',
    humanName: 'Niles',
    role: 'Chief Agent Officer',
    status: 'active',
    currentTask: 'Coordinating agent activities',
    location: 'desk',
    tier: 'A'
  },
  {
    id: 'ops',
    name: 'Casey',
    humanName: 'Casey',
    role: 'Operations',
    status: 'idle',
    currentTask: 'Monitoring system health',
    location: 'desk',
    tier: 'A'
  },
  {
    id: 'strategy',
    name: 'Marcus',
    humanName: 'Marcus',
    role: 'Strategic Lead',
    status: 'active',
    currentTask: 'Analysing Q2 priorities',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'content',
    name: 'Sarah',
    humanName: 'Sarah',
    role: 'Content Lead',
    status: 'active',
    currentTask: 'Reviewing content calendar',
    location: 'desk',
    tier: 'B'
  },
  {
    id: 'client-delivery',
    name: 'Jordan',
    humanName: 'Jordan',
    role: 'Delivery Lead',
    status: 'idle',
    currentTask: 'Waiting for client input',
    location: 'lounge',
    tier: 'B'
  },
  {
    id: 'messaging',
    name: 'Alex',
    humanName: 'Alex',
    role: 'Messaging Specialist',
    status: 'active',
    currentTask: 'Writing email sequence',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'curriculum',
    name: 'Emily',
    humanName: 'Emily',
    role: 'Learning Design',
    status: 'break',
    currentTask: 'On break',
    location: 'coffee-machine',
    tier: 'C'
  },
  {
    id: 'podcast',
    name: 'Chris',
    humanName: 'Chris',
    role: 'Media Production',
    status: 'active',
    currentTask: 'Editing podcast episode',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'community',
    name: 'Sam',
    humanName: 'Sam',
    role: 'Community Manager',
    status: 'idle',
    currentTask: 'Monitoring community',
    location: 'desk',
    tier: 'C'
  },
  {
    id: 'research',
    name: 'Taylor',
    humanName: 'Taylor',
    role: 'Research Analyst',
    status: 'active',
    currentTask: 'Gathering market data',
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

const locationIcons = {
  'desk': Briefcase,
  'meeting-room': UsersRound,
  'coffee-machine': Coffee,
  'lounge': Coffee
};

export default function OfficePage() {
  const [agents, setAgents] = useState(officeAgents);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates (in production, this would be real data)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = agents.filter(a => a.status === 'active').length;
  const idleCount = agents.filter(a => a.status === 'idle').length;
  const breakCount = agents.filter(a => a.status === 'break').length;

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Office</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Real-time view of what the team is working on</p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ 
          flex: 1, 
          padding: '16px', 
          background: 'var(--background-secondary)', 
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap style={{ width: '20px', height: '20px', color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{activeCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>At Work</div>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          padding: '16px', 
          background: 'var(--background-secondary)', 
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock style={{ width: '20px', height: '20px', color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{idleCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Idle</div>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          padding: '16px', 
          background: 'var(--background-secondary)', 
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Coffee style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6' }}>{breakCount}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>On Break</div>
          </div>
        </div>

        <div style={{ 
          flex: 1, 
          padding: '16px', 
          background: 'var(--background-secondary)', 
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'rgba(212, 175, 55, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users style={{ width: '20px', height: '20px', color: '#D4AF37' }} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>{agents.length}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Team</div>
          </div>
        </div>
      </div>

      {/* Last Update */}
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock className="w-3 h-3" />
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      {/* Office Floor Plan - Grid Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '16px',
        marginBottom: '32px'
      }}>
        {agents.map(agent => {
          const StatusIcon = statusConfig[agent.status].icon;
          const LocationIcon = locationIcons[agent.location];
          
          return (
            <div 
              key={agent.id}
              style={{
                padding: '16px',
                background: statusConfig[agent.status].bg,
                border: `1px solid ${statusConfig[agent.status].color}40`,
                borderRadius: '12px',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => (e.target as HTMLDivElement).style.transform = 'translateY(-2px)'}
              onMouseOut={e => (e.target as HTMLDivElement).style.transform = 'translateY(0)'}
            >
              {/* Status Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: statusConfig[agent.status].color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#fff'
                }}>
                  {agent.humanName.charAt(0)}
                </div>
                <span style={{ 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '10px', 
                  fontWeight: '600',
                  background: statusConfig[agent.status].bg,
                  color: statusConfig[agent.status].color,
                  border: `1px solid ${statusConfig[agent.status].color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[agent.status].label}
                </span>
              </div>

              {/* Agent Info */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px' }}>{agent.humanName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.role}</div>
              </div>

              {/* Current Task */}
              <div style={{ 
                padding: '8px', 
                background: 'var(--background-tertiary)', 
                borderRadius: '6px',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                marginBottom: '8px'
              }}>
                {agent.currentTask}
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                <LocationIcon className="w-3 h-3" />
                {agent.location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div style={{ 
        background: 'var(--background-secondary)', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        padding: '20px' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>How Agent Activity is Tracked</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Each agent reports their status to the system when they start/complete tasks</li>
            <li style={{ marginBottom: '8px' }}>Status options: <strong style={{ color: '#10b981' }}>Active</strong> (working), <strong style={{ color: '#f59e0b' }}>Idle</strong> (available), <strong style={{ color: '#8b5cf6' }}>On Break</strong>, or <strong style={{ color: '#6b7280' }}>Offline</strong></li>
            <li style={{ marginBottom: '8px' }}>The Office page pulls agent data from the Team page as the source of truth</li>
            <li style={{ marginBottom: '8px' }}>Current task shows what each agent is actively working on right now</li>
            <li>This view helps quickly identify bottlenecks and redistribute work if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}