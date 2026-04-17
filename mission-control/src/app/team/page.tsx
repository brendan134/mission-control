'use client';
import { useState } from 'react';

const PURPOSE_STATEMENT = "We exist to amplify the freedom of others. We do this by helping 'hands-on' business owners and leaders step out of the day-to-day and build self-managing teams, stronger accountability and scalable performance, without carrying it all themselves.";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: 'A' | 'B' | 'C';
  model: string;
  reportsTo: string;
  responsibilities: string[];
}

const teamMembers: TeamMember[] = [
  // Tier A - Executive
  { id: 'niles', name: 'Niles', role: 'Chief Agent Officer (CAO)', tier: 'A', model: 'Sonnet', reportsTo: 'brendan', responsibilities: ['Oversee all agent operations', 'Task allocation and routing', 'Quality assurance', 'Agent performance management'] },
  // Tier B - Department Heads
  { id: 'strategy', name: 'Marcus', role: 'Head of Strategy', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Strategic priority management', 'Project alignment to goals', 'North Star metric tracking'] },
  { id: 'ops', name: 'Casey', role: 'Head of Operations', tier: 'B', model: 'flashlite', reportsTo: 'niles', responsibilities: ['System maintenance', 'Cron job management', 'Data integrity', 'Automation workflows'] },
  { id: 'content', name: 'Sarah', role: 'Head of Content', tier: 'B', model: 'minimax', reportsTo: 'niles', responsibilities: ['Content production oversight', 'LinkedIn posts & newsletters', 'Content strategy alignment'] },
  { id: 'client-delivery', name: 'Jordan', role: 'Client Delivery Lead', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Client project delivery', 'Quality assurance', 'Stakeholder communication'] },
  // Tier C - Specialists
  { id: 'messaging', name: 'Alex', role: 'Messaging Specialist', tier: 'C', model: 'kimi', reportsTo: 'niles', responsibilities: ['Copy and offer creation', 'Brand voice consistency', 'Email marketing content'] },
  { id: 'curriculum', name: 'Emily', role: 'Learning Design', tier: 'C', model: 'kimi', reportsTo: 'content', responsibilities: ['Course creation', 'Training material development', 'Learning path design'] },
  { id: 'podcast', name: 'Chris', role: 'Media Production', tier: 'C', model: 'kimi', reportsTo: 'content', responsibilities: ['Podcast editing and production', 'Video content creation', 'Audio quality management'] },
  { id: 'community', name: 'Sam', role: 'Community Manager', tier: 'C', model: 'kimi', reportsTo: 'niles', responsibilities: ['Community engagement', 'Member support', 'Event coordination'] },
  { id: 'research', name: 'Taylor', role: 'Research Analyst', tier: 'C', model: 'kimi', reportsTo: 'strategy', responsibilities: ['Market research', 'Data analysis', 'Competitive intelligence'] }
];

export default function TeamPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getTierColor = (tier: string) => {
    switch(tier) { case 'A': return '#D4AF37'; case 'B': return '#3b82f6'; case 'C': return '#10b981'; default: return '#6b7280'; }
  };

  const tierBMembers = teamMembers.filter(m => m.tier === 'B');
  const tierCMembers = teamMembers.filter(m => m.tier === 'C');

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header with Purpose Box */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>Team</h1>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))', 
          border: '1px solid rgba(212, 175, 55, 0.3)', 
          borderRadius: '12px', 
          padding: '20px' 
        }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#d4af37', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Purpose</div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{PURPOSE_STATEMENT}</p>
        </div>
      </div>

      {/* Org Structure */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
        
        {/* Level 1: Brendan (Human - Founder) */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            padding: '16px 24px', 
            background: 'var(--background-tertiary)', 
            borderRadius: '12px', 
            border: '2px solid var(--accent)',
            cursor: 'pointer'
          }}>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>Brendan</div>
            <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Founder • Leader By Design</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Oversees the agent team</div>
          </div>
        </div>

        {/* Arrow down */}
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>

        {/* Level 2: Niles (CAO) */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            onClick={() => setExpandedId(expandedId === 'niles' ? null : 'niles')}
            style={{ 
              padding: '20px 32px', 
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))',
              borderRadius: '12px', 
              border: '2px solid #d4af37',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
          >
            <div style={{ fontWeight: '600', fontSize: '18px', color: '#d4af37' }}>Niles</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chief Agent Officer (CAO)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier A • Reports to Brendan</div>
          </div>
          {expandedId === 'niles' && (
            <div style={{ marginTop: '12px', padding: '16px', background: 'var(--background-secondary)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'left', minWidth: '300px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-muted)' }}>RESPONSIBILITIES</div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
                {teamMembers.find(m => m.id === 'niles')?.responsibilities.map((r, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Arrow down */}
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>

        {/* Level 3: Tier B - Department Heads */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
          {tierBMembers.map(member => (
            <div key={member.id} style={{ textAlign: 'center' }}>
              <div 
                onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                style={{ 
                  padding: '16px 20px', 
                  background: 'var(--background-tertiary)', 
                  borderRadius: '12px', 
                  border: '2px solid #3b82f6',
                  cursor: 'pointer',
                  minWidth: '160px'
                }}
              >
                <div style={{ fontWeight: '600', fontSize: '14px', color: '#3b82f6' }}>{member.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier B • Reports to Niles</div>
              </div>
              {expandedId === member.id && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-muted)' }}>RESPONSIBILITIES</div>
                  <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '12px' }}>
                    {member.responsibilities.map((r, i) => (<li key={i} style={{ marginBottom: '2px' }}>{r}</li>))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrow down */}
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>

        {/* Level 4: Tier C - Specialists */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {tierCMembers.map(member => (
            <div key={member.id} style={{ textAlign: 'center' }}>
              <div 
                onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                style={{ 
                  padding: '12px 16px', 
                  background: 'var(--background-secondary)', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  minWidth: '140px'
                }}
              >
                <div style={{ fontWeight: '500', fontSize: '13px' }}>{member.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{member.role}</div>
              </div>
              {expandedId === member.id && (
                <div style={{ marginTop: '8px', padding: '10px', background: 'var(--background-tertiary)', borderRadius: '6px', border: '1px solid var(--border)', textAlign: 'left' }}>
                  <div style={{ fontSize: '10px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-muted)' }}>RESPONSIBILITIES</div>
                  <ul style={{ margin: 0, paddingLeft: '12px', fontSize: '11px' }}>
                    {member.responsibilities.map((r, i) => (<li key={i}>{r}</li>))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Legend */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4AF37' }}></span> Tier A - Executive</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span> Tier B - Department Head</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Tier C - Specialist</div>
      </div>
    </div>
  );
}
