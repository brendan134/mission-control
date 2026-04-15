"use client";

import { useState } from 'react';
import { Users, Building2, User, ChevronDown, ChevronRight, Shield, X } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  humanName: string;
  role: string;
  tier: 'A' | 'B' | 'C';
  model: string;
  status: 'Active' | 'Inactive' | 'Training';
  responsibilities: string[];
  capabilities: string[];
  reportsTo: string | null;
}

const teamPurpose = "We exist to amplify the freedom of others. We do this by helping 'hands-on' business owners and leaders step out of the day-to-day and build self-managing teams, stronger accountability and scalable performance, without carrying it all themselves.";

const agents: Agent[] = [
  // Tier A+ - Founder
  {
    id: 'founder',
    name: 'Brendan',
    humanName: 'Brendan (Founder)',
    role: 'Founder & Visionary',
    tier: 'A',
    model: 'human',
    status: 'Active',
    responsibilities: [
      'Set vision and direction',
      'Final decision authority',
      'Client relationships',
      'Strategic partnerships'
    ],
    capabilities: [
      'Vision & strategy',
      'Client leadership',
      'Business development'
    ],
    reportsTo: null
  },
  // Tier A - Leadership
  {
    id: 'niles',
    name: 'Niles',
    humanName: 'Niles (Chief Agent Officer)',
    role: 'Leadership & Coordination',
    tier: 'A',
    model: 'minimax',
    status: 'Active',
    responsibilities: [
      'Coordinate all agent activities',
      'Make strategic decisions',
      'Manage task delegation to sub-agents',
      'Ensure alignment with business purpose',
      'Handle escalation from sub-agents'
    ],
    capabilities: [
      'Full system oversight',
      'Cross-agent communication',
      'Priority setting',
      'Quality assurance'
    ],
    reportsTo: 'founder'
  },
  // Tier B - Department Heads (Sub-agents)
  {
    id: 'strategy',
    name: 'Strategy Agent',
    humanName: 'Marcus (Strategic Lead)',
    role: 'Strategic Planning',
    tier: 'B',
    model: 'kimi',
    status: 'Active',
    responsibilities: [
      'Develop strategic priorities',
      'Create quarterly OKRs',
      'Analyse market opportunities',
      'Guide business direction'
    ],
    capabilities: [
      'Strategic analysis',
      'Goal setting',
      'Business planning'
    ],
    reportsTo: 'niles'
  },
  {
    id: 'content',
    name: 'Content Agent',
    humanName: 'Sarah (Content Lead)',
    role: 'Content Creation',
    tier: 'B',
    model: 'minimax',
    status: 'Active',
    responsibilities: [
      'Manage all content creation',
      'Coordinate content calendar',
      'Ensure brand consistency',
      'Oversee all publishing'
    ],
    capabilities: [
      'Writing & editing',
      'Video production',
      'Social media',
      'Email marketing'
    ],
    reportsTo: 'niles'
  },
  {
    id: 'client-delivery',
    name: 'Client Delivery',
    humanName: 'Jordan (Delivery Lead)',
    role: 'Client Success',
    tier: 'B',
    model: 'minimax',
    status: 'Active',
    responsibilities: [
      'Manage client onboarding',
      'Coordinate delivery teams',
      'Ensure client satisfaction',
      'Handle escalations'
    ],
    capabilities: [
      'Project management',
      'Client communication',
      'Quality control'
    ],
    reportsTo: 'niles'
  },
  // Tier C - Specialists (Workers)
  {
    id: 'messaging',
    name: 'Messaging Agent',
    humanName: 'Alex (Messaging Specialist)',
    role: 'Messaging & Copy',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    responsibilities: [
      'Write marketing copy',
      'Create email sequences',
      'Develop sales messaging'
    ],
    capabilities: [
      'Copywriting',
      'Email campaigns',
      'Sales letters'
    ],
    reportsTo: 'content'
  },
  {
    id: 'curriculum',
    name: 'Curriculum Agent',
    humanName: 'Dr. Emily (Learning Design)',
    role: 'Course Development',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    responsibilities: [
      'Design training curricula',
      'Create learning materials',
      'Develop assessments'
    ],
    capabilities: [
      'Instructional design',
      'Course creation',
      'Learning strategy'
    ],
    reportsTo: 'content'
  },
  {
    id: 'podcast',
    name: 'Podcast Agent',
    humanName: 'Chris (Audio/Video)',
    role: 'Media Production',
    tier: 'C',
    model: 'minimax',
    status: 'Active',
    responsibilities: [
      'Produce podcast episodes',
      'Edit audio/video',
      'Manage show notes'
    ],
    capabilities: [
      'Audio editing',
      'Video editing',
      'Production'
    ],
    reportsTo: 'content'
  },
  {
    id: 'community',
    name: 'Community Agent',
    humanName: 'Sam (Community Manager)',
    role: 'Community Building',
    tier: 'C',
    model: 'minimax',
    status: 'Active',
    responsibilities: [
      'Manage online communities',
      'Facilitate discussions',
      'Engage members'
    ],
    capabilities: [
      'Community management',
      'Member engagement',
      'Event coordination'
    ],
    reportsTo: 'client-delivery'
  },
  {
    id: 'research',
    name: 'Research Agent',
    humanName: 'Taylor (Research Analyst)',
    role: 'Market Research',
    tier: 'C',
    model: 'kimi',
    status: 'Active',
    responsibilities: [
      'Conduct market research',
      'Analyse competitors',
      'Gather industry insights'
    ],
    capabilities: [
      'Data analysis',
      'Market intelligence',
      'Reporting'
    ],
    reportsTo: 'strategy'
  },
  {
    id: 'ops',
    name: 'System Ops',
    humanName: 'Casey (Operations)',
    role: 'System Administration',
    tier: 'A',
    model: 'flashlite',
    status: 'Active',
    responsibilities: [
      'Manage infrastructure',
      'Maintain system health',
      'Handle technical issues'
    ],
    capabilities: [
      'System administration',
      'Technical support',
      'Automation'
    ],
    reportsTo: 'niles'
  }
];

const tierColors = {
  'A': { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#a855f7' },
  'B': { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' },
  'C': { bg: 'rgba(16, 185, 129, 0.15)', border: 'rgba(16, 185, 129, 0.4)', text: '#10b981' }
};

export default function TeamPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['leadership', 'strategy', 'content', 'delivery']);

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => 
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  // Organise by hierarchy
  const founder = agents.find(a => a.id === 'founder');
  const leadership = agents.filter(a => a.id === 'niles' || a.id === 'ops');
  const departmentHeads = agents.filter(a => a.reportsTo === 'niles' && a.tier === 'B');
  const specialists = agents.filter(a => a.tier === 'C');
  const ops = agents.find(a => a.id === 'ops');

  const getDirectReports = (managerId: string) => agents.filter(a => a.reportsTo === managerId);

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Team</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Organisational structure and agent responsibilities</p>
      </div>

      {/* Purpose */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        border: '1px solid rgba(212, 175, 55, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Shield style={{ width: '20px', height: '20px', color: '#D4AF37' }} />
          <span style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#D4AF37' }}>Purpose</span>
        </div>
        <p style={{ fontSize: '16px', color: '#fff', lineHeight: '1.6' }}>{teamPurpose}</p>
      </div>

      {/* Organisation Structure */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Organisation Structure</h2>
        
        {/* Level 1: Founder */}
        {founder && (
          <div style={{ marginBottom: '16px' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '12px 16px', 
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)', 
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.3)'
              }}
            >
              <Shield className="w-4 h-4" style={{ color: '#D4AF37' }} />
              <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Founder</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', paddingLeft: '0' }}>
              <div 
                onClick={() => setSelectedAgent(founder)}
                style={{
                  padding: '16px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={e => (e.target as HTMLDivElement).style.transform = 'translateY(-2px)'}
                onMouseOut={e => (e.target as HTMLDivElement).style.transform = 'translateY(0)'}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px', color: '#D4AF37' }}>{founder.humanName}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{founder.role}</div>
              </div>
            </div>
          </div>
        )}

        {/* Level 2: Leadership */}
        <div style={{ marginBottom: '16px' }}>
          <div 
            onClick={() => toggleDept('leadership')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 16px', 
              background: 'var(--background-secondary)', 
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid var(--border)'
            }}
          >
            {expandedDepts.includes('leadership') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Users className="w-4 h-4" style={{ color: tierColors['A'].text }} />
            <span style={{ fontWeight: '600' }}>Leadership</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Tier A</span>
          </div>
          
          {expandedDepts.includes('leadership') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', paddingLeft: '32px' }}>
              {leadership.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: '16px',
                    background: tierColors[agent.tier].bg,
                    border: `1px solid ${tierColors[agent.tier].border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={e => (e.target as HTMLDivElement).style.transform = 'translateY(-2px)'}
                  onMouseOut={e => (e.target as HTMLDivElement).style.transform = 'translateY(0)'}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: tierColors[agent.tier].text }}>{agent.humanName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.role}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{agent.model}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level 3: Department Heads */}
        <div style={{ marginBottom: '16px' }}>
          <div 
            onClick={() => toggleDept('dept-heads')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 16px', 
              background: 'var(--background-secondary)', 
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid var(--border)'
            }}
          >
            {expandedDepts.includes('dept-heads') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <Building2 className="w-4 h-4" style={{ color: tierColors['B'].text }} />
            <span style={{ fontWeight: '600' }}>Department Heads</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Tier B</span>
          </div>
          
          {expandedDepts.includes('dept-heads') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', paddingLeft: '32px' }}>
              {departmentHeads.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: '16px',
                    background: tierColors[agent.tier].bg,
                    border: `1px solid ${tierColors[agent.tier].border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={e => (e.target as HTMLDivElement).style.transform = 'translateY(-2px)'}
                  onMouseOut={e => (e.target as HTMLDivElement).style.transform = 'translateY(0)'}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: tierColors[agent.tier].text }}>{agent.humanName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.role}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{agent.model}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Level 4: Specialists */}
        <div style={{ marginBottom: '16px' }}>
          <div 
            onClick={() => toggleDept('specialists')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 16px', 
              background: 'var(--background-secondary)', 
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid var(--border)'
            }}
          >
            {expandedDepts.includes('specialists') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <User className="w-4 h-4" style={{ color: tierColors['C'].text }} />
            <span style={{ fontWeight: '600' }}>Specialists</span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>Tier C</span>
          </div>
          
          {expandedDepts.includes('specialists') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginTop: '12px', paddingLeft: '32px' }}>
              {specialists.map(agent => (
                <div 
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: '16px',
                    background: tierColors[agent.tier].bg,
                    border: `1px solid ${tierColors[agent.tier].border}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={e => (e.target as HTMLDivElement).style.transform = 'translateY(-2px)'}
                  onMouseOut={e => (e.target as HTMLDivElement).style.transform = 'translateY(0)'}
                >
                  <div style={{ fontWeight: '600', marginBottom: '4px', color: tierColors[agent.tier].text }}>{agent.humanName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{agent.role}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>{agent.model}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '100',
        }} onClick={() => setSelectedAgent(null)}>
          <div style={{
            background: 'var(--background-secondary)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid var(--border)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px', color: selectedAgent.id === 'founder' ? '#D4AF37' : tierColors[selectedAgent.tier].text }}>{selectedAgent.humanName}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{selectedAgent.role}</p>
              </div>
              <button onClick={() => setSelectedAgent(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: '500',
                background: selectedAgent.id === 'founder' ? 'rgba(212, 175, 55, 0.15)' : tierColors[selectedAgent.tier].bg,
                color: selectedAgent.id === 'founder' ? '#D4AF37' : tierColors[selectedAgent.tier].text,
                border: `1px solid ${selectedAgent.id === 'founder' ? 'rgba(212, 175, 55, 0.4)' : tierColors[selectedAgent.tier].border}`
              }}>
                {selectedAgent.id === 'founder' ? 'Founder' : `Tier ${selectedAgent.tier}`}
              </span>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: '500',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                {selectedAgent.status}
              </span>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '20px', 
                fontSize: '12px', 
                fontWeight: '500',
                background: 'var(--background-tertiary)',
                color: 'var(--text-secondary)',
              }}>
                {selectedAgent.model}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Reports To</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {selectedAgent.id === 'founder' ? 'None - Top of organisation' : selectedAgent.reportsTo ? agents.find(a => a.id === selectedAgent.reportsTo)?.humanName || 'Niles (Chief Agent Officer)' : 'None - Top of organisation'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Responsibilities</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {selectedAgent.responsibilities.map((resp, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{resp}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Capabilities</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {selectedAgent.capabilities.map((cap, i) => (
                  <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>{cap}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* How to Use This Page */}
      <div style={{ 
        background: 'var(--background-secondary)', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        padding: '20px' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>How Agents Are Organised</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '12px' }}>This page is the single source of truth for all agent responsibilities:</p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Tier A (Leadership)</strong> - Strategic oversight and system coordination (Niles + Ops)</li>
            <li style={{ marginBottom: '8px' }}><strong>Tier B (Department Heads)</strong> - Manage functional areas and specialist teams</li>
            <li style={{ marginBottom: '8px' }}><strong>Tier C (Specialists)</strong> - Execute specific tasks within departments</li>
          </ul>
          <p style={{ marginTop: '16px', marginBottom: '8px' }}><strong>How to use:</strong></p>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>When a new task arrives, identify which department it belongs to</li>
            <li style={{ marginBottom: '8px' }}>Escalate to the appropriate Tier B agent for assignment</li>
            <li style={{ marginBottom: '8px' }}>Click any agent tile to see their exact responsibilities and capabilities</li>
            <li>All agents should reference this page to ensure tasks go to the right handler</li>
          </ul>
        </div>
      </div>
    </div>
  );
}