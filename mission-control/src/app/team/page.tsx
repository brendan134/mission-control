'use client';
import { useState, useEffect } from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: string;
  model: string;
  status: 'Active' | 'Paused' | 'Offline';
  reportsTo: string;
  responsibilities: string[];
  purposeAlignment: string;
}

const PURPOSE_STATEMENT = "We exist to amplify the freedom of others. We do this by helping 'hands-on' business owners and leaders step out of the day-to-day and build self-managing teams, stronger accountability and scalable performance, without carrying it all themselves.";

const teamMembers: TeamMember[] = [
  // Level 1: Executive
  {
    id: 'niles',
    name: 'Niles',
    role: 'Chief Agent Officer (CAO)',
    tier: 'A',
    model: ' Sonnet',
    status: 'Active',
    reportsTo: 'brendan',
    responsibilities: [
      'Oversee all agent operations',
      'Task allocation and routing',
      'Quality assurance',
      'Agent performance management'
    ],
    purposeAlignment: 'Ensures all agents stay aligned to the mission'
  },
  // Level 2: Department Heads
  {
    id: 'strategy',
    name: 'Marcus',
    role: 'Head of Strategy',
    tier: 'B',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'niles',
    responsibilities: [
      'Strategic priority management',
      'Project alignment to goals',
      'North Star metric tracking'
    ],
    purposeAlignment: 'Helps leaders step out of day-to-day by providing strategic clarity'
  },
  {
    id: 'content',
    name: 'Sophie',
    role: 'Head of Content',
    tier: 'B',
    model: 'minimax',
    status: 'Active',
    reportsTo: 'niles',
    responsibilities: [
      'Content production oversight',
      'LinkedIn posts & newsletters',
      'Content strategy alignment'
    ],
    purposeAlignment: 'Amplifies reach without leaders doing the heavy lifting'
  },
  {
    id: 'messaging',
    name: 'Isla',
    role: 'Head of Messaging',
    tier: 'B',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'niles',
    responsibilities: [
      'Copy and offer creation',
      'Brand voice consistency',
      'Email marketing content'
    ],
    purposeAlignment: 'Helps communicate value without leaders writing every word'
  },
  {
    id: 'ops',
    name: 'Quinn',
    role: 'Head of Operations',
    tier: 'A',
    model: 'flashlite',
    status: 'Active',
    reportsTo: 'niles',
    responsibilities: [
      'System maintenance',
      'Cron job management',
      'Data integrity',
      'Automation workflows'
    ],
    purposeAlignment: 'Builds self-managing systems that run without constant oversight'
  },
  // Level 3: Specialists/Workers
  {
    id: 'curriculum',
    name: 'Leo',
    role: 'Curriculum Specialist',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'content',
    responsibilities: [
      'Course creation',
      'Training material development',
      'Learning path design'
    ],
    purposeAlignment: 'Creates scalable learning for team development'
  },
  {
    id: 'podcast',
    name: 'Ruby',
    role: 'Podcast Producer',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'content',
    responsibilities: [
      'Podcast production',
      'Show notes creation',
      'Audio content editing'
    ],
    purposeAlignment: 'Amplifies voice content without leader doing all production'
  },
  {
    id: 'community',
    name: 'Maya',
    role: 'Community Manager',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'messaging',
    responsibilities: [
      'Community engagement',
      'Member interactions',
      'Event coordination'
    ],
    purposeAlignment: 'Builds accountability through community connection'
  },
  {
    id: 'research',
    name: 'Dex',
    role: 'Research Analyst',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    reportsTo: 'strategy',
    responsibilities: [
      'Market research',
      'Competitor analysis',
      'Data gathering'
    ],
    purposeAlignment: 'Provides intelligence for scalable decisions'
  },
  {
    id: 'client-delivery',
    name: 'Aria',
    role: 'Client Delivery Lead',
    tier: 'B',
    model: 'minimax',
    status: 'Active',
    reportsTo: 'niles',
    responsibilities: [
      'Client project management',
      'Delivery oversight',
      'Client communication'
    ],
    purposeAlignment: 'Ensures clients get results without leader doing all work'
  }
];

const STATUS_COLORS: Record<string, string> = {
  'Active': '#22c55e',
  'Paused': '#f59e0b',
  'Offline': '#6b7280'
};

const TIER_COLORS: Record<string, string> = {
  'A': '#d4af37',  // Gold
  'B': '#3b82f6',  // Blue
  'C': '#8b5cf6'   // Purple
};

export default function Team() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredMembers = filter === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.reportsTo === filter);

  const getManager = (reportsTo: string) => teamMembers.find(m => m.id === reportsTo);

  return (
    <div style={{ padding: '32px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Team</h1>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#d4af37', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Our Purpose
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>
            {PURPOSE_STATEMENT}
          </p>
        </div>
      </div>

      {/* Hierarchy Legend */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#d4af37' }}>TIER A</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>→ Executive</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#3b82f6' }}>TIER B</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>→ Department Head</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#8b5cf6' }}>TIER C</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>→ Specialist</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#22c55e' }}>●</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active</span>
        </div>
      </div>

      {/* Org Chart Structure */}
      <div style={{ marginBottom: '32px' }}>
        {/* Brendan (Founder) */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '24px',
          padding: '16px',
          background: 'var(--background-tertiary)',
          borderRadius: '12px',
          border: '2px solid var(--accent)'
        }}>
          <div style={{ fontWeight: 600, fontSize: '16px' }}>Brendan</div>
          <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Founder • Leader By Design</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Controls the agent team</div>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)' }}>↓</div>

        {/* Niles - CAO */}
        <div 
          onClick={() => setSelectedMember(teamMembers.find(m => m.id === 'niles') || null)}
          style={{ 
            textAlign: 'center', 
            marginBottom: '32px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
            borderRadius: '12px',
            border: '2px solid #d4af37',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '18px', color: '#d4af37' }}>Niles</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chief Agent Officer (CAO)</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier A • Reports to Brendan</div>
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)' }}>↓</div>

        {/* Department Heads */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px',
          marginBottom: '32px'
        }}>
          {teamMembers.filter(m => m.tier === 'B').map(member => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              style={{ 
                padding: '16px',
                background: 'var(--background-tertiary)',
                borderRadius: '12px',
                border: `2px solid ${TIER_COLORS[member.tier]}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '14px', color: TIER_COLORS[member.tier] }}>{member.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier {member.tier} • Reports to Niles</div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-muted)' }}>↓</div>

        {/* Specialists */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '12px'
        }}>
          {teamMembers.filter(m => m.tier === 'C').map(member => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(member)}
              style={{ 
                padding: '12px',
                background: 'var(--background-secondary)',
                borderRadius: '8px',
                border: `1px solid var(--border)`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              <div style={{ fontWeight: 500, fontSize: '13px' }}>{member.name}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{member.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div 
          style={{ 
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 
          }}
          onClick={() => setSelectedMember(null)}
        >
          <div 
            style={{ 
              background: 'var(--background-secondary)', borderRadius: '16px', 
              padding: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' 
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>{selectedMember.name}</h2>
                <div style={{ fontSize: '14px', color: TIER_COLORS[selectedMember.tier] }}>{selectedMember.role}</div>
              </div>
              <span style={{ 
                fontSize: '10px', padding: '4px 8px', borderRadius: '4px',
                background: `${STATUS_COLORS[selectedMember.status]}20`, 
                color: STATUS_COLORS[selectedMember.status],
                fontWeight: 600
              }}>{selectedMember.status}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>TIER</div>
                <div style={{ fontWeight: 600, color: TIER_COLORS[selectedMember.tier] }}>Tier {selectedMember.tier}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>MODEL</div>
                <div style={{ fontWeight: 500 }}>{selectedMember.model}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>REPORTS TO</div>
                <div style={{ fontWeight: 500 }}>{getManager(selectedMember.reportsTo)?.name || 'Brendan'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>ID</div>
                <div style={{ fontWeight: 500, fontFamily: 'monospace', fontSize: '12px' }}>{selectedMember.id}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>RESPONSIBILITIES</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.6 }}>
                {selectedMember.responsibilities.map((r, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>PURPOSE ALIGNMENT</div>
              <p style={{ fontSize: '13px', lineHeight: 1.5, margin: 0, color: 'var(--text-secondary)' }}>
                {selectedMember.purposeAlignment}
              </p>
            </div>

            <button
              onClick={() => setSelectedMember(null)}
              style={{
                marginTop: '20px', width: '100%', padding: '10px',
                background: 'var(--background-tertiary)', border: 'none', borderRadius: '8px',
                fontSize: '14px', cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}