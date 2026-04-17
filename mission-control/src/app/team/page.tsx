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
  { id: 'niles', name: 'Niles', role: 'Chief Agent Officer (CAO)', tier: 'A', model: 'Sonnet', reportsTo: 'brendan', responsibilities: ['Oversee all agent operations', 'Task allocation and routing', 'Quality assurance', 'Agent performance management'] },
  { id: 'strategy', name: 'Marcus', role: 'Head of Strategy', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Strategic priority management', 'Project alignment to goals', 'North Star metric tracking'] },
  { id: 'ops', name: 'Casey', role: 'Head of Operations', tier: 'B', model: 'flashlite', reportsTo: 'niles', responsibilities: ['System maintenance', 'Cron job management', 'Data integrity', 'Automation workflows'] },
  { id: 'content', name: 'Sarah', role: 'Head of Content', tier: 'B', model: 'minimax', reportsTo: 'niles', responsibilities: ['Content production oversight', 'LinkedIn posts & newsletters', 'Content strategy alignment'] },
  { id: 'client-delivery', name: 'Jordan', role: 'Client Delivery Lead', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Client project delivery', 'Quality assurance', 'Stakeholder communication'] },
  { id: 'messaging', name: 'Alex', role: 'Messaging Specialist', tier: 'C', model: 'kimi', reportsTo: 'niles', responsibilities: ['Copy and offer creation', 'Brand voice consistency', 'Email marketing content'] },
  { id: 'curriculum', name: 'Emily', role: 'Learning Design', tier: 'C', model: 'kimi', reportsTo: 'content', responsibilities: ['Course creation', 'Training material development', 'Learning path design'] },
  { id: 'podcast', name: 'Chris', role: 'Media Production', tier: 'C', model: 'kimi', reportsTo: 'content', responsibilities: ['Podcast editing and production', 'Video content creation', 'Audio quality management'] },
  { id: 'community', name: 'Sam', role: 'Community Manager', tier: 'C', model: 'kimi', reportsTo: 'niles', responsibilities: ['Community engagement', 'Member support', 'Event coordination'] },
  { id: 'research', name: 'Taylor', role: 'Research Analyst', tier: 'C', model: 'kimi', reportsTo: 'strategy', responsibilities: ['Market research', 'Data analysis', 'Competitive intelligence'] }
];

export default function TeamPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tierBMembers = teamMembers.filter(m => m.tier === 'B');
  const tierCMembers = teamMembers.filter(m => m.tier === 'C');

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>Team</h1>
        <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05))', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#d4af37', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Purpose</div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{PURPOSE_STATEMENT}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ padding: '16px 24px', background: 'var(--background-tertiary)', borderRadius: '12px', border: '2px solid var(--accent)', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, fontSize: '16px' }}>Brendan</div>
            <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Founder • Leader By Design</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Oversees the agent team</div>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div onClick={() => setExpandedId(expandedId === 'niles' ? null : 'niles')} style={{ padding: '20px 32px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))', borderRadius: '12px', border: '2px solid #d4af37', cursor: 'pointer' }}>
            <div style={{ fontWeight: 600, fontSize: '18px', color: '#d4af37' }}>Niles</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Chief Agent Officer (CAO)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier A • Reports to Brendan</div>
          </div>
        </div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
          {tierBMembers.map(member => (
            <div key={member.id} style={{ textAlign: 'center' }}>
              <div onClick={() => setExpandedId(expandedId === member.id ? null : member.id)} style={{ padding: '16px 20px', background: 'var(--background-tertiary)', borderRadius: '12px', border: '2px solid #3b82f6', cursor: 'pointer', minWidth: '160px' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: '#3b82f6' }}>{member.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{member.role}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Tier B • Reports to Niles</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>↓</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {tierCMembers.map(member => (
            <div key={member.id} style={{ textAlign: 'center' }}>
              <div onClick={() => setExpandedId(expandedId === member.id ? null : member.id)} style={{ padding: '12px 16px', background: 'var(--background-secondary)', borderRadius: '8px', border: '2px solid #10b981', cursor: 'pointer', minWidth: '140px' }}>
                <div style={{ fontWeight: 500, fontSize: '13px', color: '#10b981' }}>{member.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '24px', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#D4AF37' }}></span> Tier A - Executive</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></span> Tier B - Department Head</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Tier C - Specialist</div>
      </div>
    </div>
  );
}