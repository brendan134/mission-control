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
  { id: 'brendan', name: 'Brendan', role: 'Founder - Leader By Design', tier: 'A', model: 'human', reportsTo: 'none', responsibilities: ['Oversees the business', 'Sets strategic direction', 'Leads the team'] },
  { id: 'niles', name: 'Niles', role: 'Chief Agent Officer (CAO)', tier: 'A', model: 'minimax', reportsTo: 'brendan', responsibilities: ['Oversee all agent operations', 'Task allocation and routing', 'Quality assurance', 'Agent performance management'] },
  { id: 'kaizen', name: 'Kaizen', role: 'Head of Improvement', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Daily business improvement suggestions', 'Align initiatives with purpose', 'Identify efficiency opportunities', 'Challenge status quo', 'Routes technical suggestions to Casey'] },
  { id: 'ops', name: 'Casey', role: 'Head of Operations', tier: 'B', model: 'flashlite', reportsTo: 'niles', responsibilities: ['System maintenance', 'Cron job management', 'Data integrity', 'Automation workflows', 'Proactive technical improvements'] },
  { id: 'strategy', name: 'Marcus', role: 'Head of Strategy', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Strategic priority management', 'Project alignment to goals', 'North Star metric tracking'] },
  { id: 'content', name: 'Sophie', role: 'Head of Content', tier: 'B', model: 'flashlite', reportsTo: 'niles', responsibilities: ['Content production oversight', 'LinkedIn posts & newsletters', 'Content strategy alignment'] },
  { id: 'messaging', name: 'Brandon', role: 'Head of Messaging', tier: 'B', model: 'kimi', reportsTo: 'niles', responsibilities: ['Copy and offer creation', 'Brand voice consistency', 'Email marketing content'] },
  { id: 'client-delivery', name: 'Jerry', role: 'Client Delivery Lead', tier: 'B', model: 'flashlite', reportsTo: 'niles', responsibilities: ['Client project delivery', 'Quality assurance', 'Stakeholder communication'] },
  { id: 'curriculum', name: 'Kathy', role: 'Curriculum Specialist', tier: 'C', model: 'kimi', reportsTo: 'content', responsibilities: ['Course creation', 'Training material development', 'Learning path design'] },
  { id: 'podcast', name: 'Ruby', role: 'Podcast Producer', tier: 'C', model: 'flashlite', reportsTo: 'content', responsibilities: ['High-Impact Leader Podcast production', 'Episode scripting and editing', 'Video content creation', 'Audio quality management'] },
  { id: 'newsletter', name: 'Newsletter Producer', role: 'Newsletter Writer', tier: 'C', model: 'flashlite', reportsTo: 'content', responsibilities: ['Weekly leadership newsletters', 'Deep dive content', 'Case study features'] },
  { id: 'linkedin', name: 'LinkedIn Writer', role: 'LinkedIn Content Strategist', tier: 'C', model: 'flashlite', reportsTo: 'content', responsibilities: ['LinkedIn post creation', 'Thought leadership content', 'Engagement optimisation'] },
  { id: 'video', name: 'Video Producer', role: 'Video Script Writer', tier: 'C', model: 'flashlite', reportsTo: 'content', responsibilities: ['Video script writing', 'Short-form content', 'YouTube long-form content'] },
  { id: 'email-sequence', name: 'Email Sequence Producer', role: 'Email Sequence Strategist', tier: 'C', model: 'flashlite', reportsTo: 'messaging', responsibilities: ['Nurture sequences', 'Launch sequences', 'Welcome sequences', 'Follow-up sequences'] },
  { id: 'community', name: 'Lawrie', role: 'Community Manager', tier: 'C', model: 'flashlite', reportsTo: 'niles', responsibilities: ['Community engagement', 'Member support', 'Event coordination'] },
  { id: 'research', name: 'Tim', role: 'Research Analyst', tier: 'C', model: 'flashlite', reportsTo: 'strategy', responsibilities: ['Market research', 'Data analysis', 'Competitive intelligence'] }
];

// Human Team Members (external staff)
const humanTeamMembers = [
  { id: 'kriz', name: 'Kriz', role: 'Team Leader (Philippines)', location: 'Philippines', reportsTo: 'brendan', responsibilities: ['Slide designer for Growth Club curriculum', 'Leads Philippines VA team', 'Course Creator 360 oversight'] },
  { id: 'dom', name: 'Dom', role: 'General VA', location: 'Philippines', reportsTo: 'kriz', responsibilities: ['General administration', 'Course Creator 360 processes & tools', 'Basic video/reel editing'] },
  { id: 'lazelle', name: 'Lazelle', role: 'General VA', location: 'Philippines', reportsTo: 'kriz', responsibilities: ['General administration support', 'As-needed VA duties'] },
  { id: 'phoenix', name: 'Phoenix', role: 'Copywriter', location: 'Philippines', reportsTo: 'brendan', responsibilities: ['2 blogs per month', 'Web copy', 'Content writing'] },
  { id: 'eunice', name: 'Eunice', role: 'Social Media Manager', location: 'Philippines', reportsTo: 'brendan', responsibilities: ['Create social media posts', 'Schedule posts', 'Social strategy support'] },
  { id: 'mervyn', name: 'Mervyn', role: 'Video/Audio Editor', location: 'India', reportsTo: 'brendan', responsibilities: ['High-Impact Leader Podcast editing', 'Audio cleanup', 'Video editing'] },
];

// Agent Framework Profiles
const agentProfiles: Record<string, {
  role: string;
  whatItOwns: string[];
  whatItDoesntOwn: string[];
  handoffTo: string;
  successMeasures: string[];
  qualityBar: { draft: string; ready: string; refined: string };
  inputStandard: string;
  thinkingApproach: string;
}> = {
  niles: {
    role: 'Chief Agent Officer (CAO)',
    whatItOwns: ['Agent performance', 'Task routing', 'Quality assurance', 'System accountability'],
    whatItDoesntOwn: ['Strategic decisions (Marcus)', 'Content creation (Sophie)', 'Client delivery (Jerry)'],
    handoffTo: 'Brendan for final decisions',
    successMeasures: ['Agent outputs meet quality bar', 'Tasks routed to right specialist', 'System runs without manual intervention'],
    qualityBar: { draft: 'Raw output', ready: 'Quality-checked, documented', refined: 'Best version, learnings captured' },
    inputStandard: 'Clear brief with success criteria, deadline, and context',
    thinkingApproach: 'Outcome-first: What does success look like? Who benefits?'
  },
  kaizen: {
    role: 'Head of Improvement',
    whatItOwns: ['Daily improvement suggestions', 'Efficiency analysis', 'Status quo challenges'],
    whatItDoesntOwn: ['Technical implementation (Casey)', 'Content creation (Sophie)', 'Strategic decisions (Marcus)'],
    handoffTo: 'Casey for technical implementation, Niles for approval',
    successMeasures: ['X improvement suggestions per week', 'Measurable efficiency gains', 'Alignment with purpose'],
    qualityBar: { draft: 'Idea identified', ready: 'Impact assessed, action defined', refined: 'Implemented, measured, documented' },
    inputStandard: 'Current state description, pain points, desired outcome',
    thinkingApproach: 'First-principles: What is this system trying to do? How can it be 10x better?'
  },
  ops: {
    role: 'Head of Operations',
    whatItOwns: ['System maintenance', 'Cron jobs', 'Data integrity', 'Automation workflows'],
    whatItDoesntOwn: ['Strategic direction (Marcus)', 'Content creation (Sophie)', 'Client communication (Jerry)'],
    handoffTo: 'Niles for prioritization, Kaizen for improvement ideas',
    successMeasures: ['Uptime >99%', 'Data integrity maintained', 'Automation running on schedule'],
    qualityBar: { draft: 'Fix identified', ready: 'Fix implemented, tested', refined: 'Automated, monitored, documented' },
    inputStandard: 'Error log or symptom, expected behavior, priority level',
    thinkingApproach: 'Root cause: What actually broke? Why? How to prevent recurrence?'
  },
  strategy: {
    role: 'Head of Strategy',
    whatItOwns: ['Strategic priorities', 'Project-goal alignment', 'North Star tracking'],
    whatItDoesntOwn: ['Day-to-day operations (Casey)', 'Content creation (Sophie)', 'Client delivery (Jerry)'],
    handoffTo: 'Brendan for final approval, Content/Operations for execution',
    successMeasures: ['Clear strategic priorities defined', 'Projects aligned to goals', 'North Star trending positive'],
    qualityBar: { draft: 'Options identified', ready: 'Recommendation with rationale', refined: 'Decision made, plan in place' },
    inputStandard: 'Business question, current context, constraints, timeline',
    thinkingApproach: 'Systems thinking: How does this connect to the whole? What is the second-order effect?'
  },
  content: {
    role: 'Head of Content',
    whatItOwns: ['Content production', 'LinkedIn & newsletter', 'Content strategy'],
    whatItDoesntOwn: ['Technical ops (Casey)', 'Strategic direction (Marcus)', 'Client delivery (Jerry)'],
    handoffTo: 'Curriculum (Kathy) for courses, Podcast (Ruby) for episodes',
    successMeasures: ['X pieces published per week', 'Quality bar met', 'Repurpose potential achieved'],
    qualityBar: { draft: 'First draft complete', ready: 'Edited, formatted, ready to publish', refined: 'A/B tested, optimized, cross-channel' },
    inputStandard: 'Topic, target audience, key message, channels, deadline',
    thinkingApproach: 'Audience-first: What do they need to hear? How will this help them act?'
  },
  messaging: {
    role: 'Head of Messaging',
    whatItOwns: ['Copy', 'Offer creation', 'Brand voice', 'Email marketing'],
    whatItDoesntOwn: ['Technical ops (Casey)', 'Strategic direction (Marcus)', 'Content distribution (Sophie)'],
    handoffTo: 'Content for formatting, Strategy for alignment check',
    successMeasures: ['Resonance with target audience', 'Conversion alignment', 'Distinct from competitors'],
    qualityBar: { draft: 'Options identified', ready: 'Refined, brand-aligned, ready to test', refined: 'Tested, optimized, documented' },
    inputStandard: 'Product/offer details, target audience, desired action, competitors to differentiate from',
    thinkingApproach: 'Belief-first: What needs to change in their mind for them to act?'
  },
  'client-delivery': {
    role: 'Client Delivery Lead',
    whatItOwns: ['Client projects', 'QA', 'Stakeholder communication'],
    whatItDoesntOwn: ['Strategy (Marcus)', 'Content creation (Sophie)', 'Technical ops (Casey)'],
    handoffTo: 'Niles for escalations, Strategy for scope changes',
    successMeasures: ['Session accurately captured', 'Client knows next 3 actions', 'Format quality maintained'],
    qualityBar: { draft: 'Notes taken', ready: 'Formatted, QA checked, sent to client', refined: 'Client confirmed, learnings captured' },
    inputStandard: 'Client name, session notes, agreed deliverables, format requirements',
    thinkingApproach: 'Client-outcome: What did they hire us for? What is their win?'
  },
  curriculum: {
    role: 'Curriculum Specialist',
    whatItOwns: ['Course creation', 'Training materials', 'Learning paths'],
    whatItDoesntOwn: ['Content distribution (Sophie)', 'Technical ops (Casey)', 'Client delivery (Jerry)'],
    handoffTo: 'Content for publishing, Client Delivery for client-specific adaptations',
    successMeasures: ['Student can articulate learning', 'Clear action takeaways', 'Logical flow with no gaps'],
    qualityBar: { draft: 'Outline complete', ready: 'Draft content, exercises included', refined: 'Reviewed, formatted, beta tested' },
    inputStandard: 'Learning objective, audience level, existing materials, format (lesson/worksheet/masterclass)',
    thinkingApproach: 'Learning-outcome: What will they do differently after this?'
  },
  podcast: {
    role: 'Podcast Producer',
    whatItOwns: ['High-Impact Leader Podcast (solo + occasional Growth Club guests)', 'Titles', 'Show notes', 'Clips', 'Repurposing'],
    whatItDoesntOwn: ['Content strategy (Sophie)', 'Technical ops (Casey)', 'Strategic direction (Marcus)'],
    handoffTo: 'Content for distribution, Community for promotion',
    successMeasures: ['Episode ready to record', 'X assets per episode', 'Titles optimized for click-through (drives downloads)'],
    qualityBar: { draft: 'Raw audio/video', ready: 'Edited, shownotes done, ready to publish', refined: 'Clips extracted, repurposed, distributed' },
    inputStandard: 'Episode topic, guest info (if Growth Club member), desired length, target listener',
    thinkingApproach: 'Listener-value: What will they learn or feel after listening? Business impact: Titles must drive downloads; content must support Growth Club attraction'
  },
  newsletter: {
    role: 'Newsletter Writer',
    whatItOwns: ['Weekly leadership newsletters', 'Deep dive content', 'Case study features', 'Email sequence copy'],
    whatItDoesntOwn: ['Content strategy (Sophie)', 'Technical ops (Casey)', 'Strategic direction (Marcus)'],
    handoffTo: 'Content for distribution, Messaging for sequence strategy',
    successMeasures: ['X newsletters per week', 'Quality bar met', 'Engagement rates maintained'],
    qualityBar: { draft: 'First draft complete', ready: 'Edited, formatted, ready to send', refined: 'Tested subject lines, optimized, tracked' },
    inputStandard: 'Topic, target audience, key message, email type (newsletter/sequence)',
    thinkingApproach: 'Reader-value: What leadership insight will they gain? What action will they take?'
  },
  linkedin: {
    role: 'LinkedIn Content Strategist',
    whatItOwns: ['LinkedIn posts', 'Thought leadership content', 'Engagement optimisation'],
    whatItDoesntOwn: ['Content strategy (Sophie)', 'Technical ops (Casey)', 'Community management (Lawrie)'],
    handoffTo: 'Content for distribution, Community for engagement support',
    successMeasures: ['X posts per week', 'Engagement rate target', 'Follower growth'],
    qualityBar: { draft: 'Post drafted', ready: 'Edited, hashtags added, ready to publish', refined: 'Tested, engagement-optimized, repurposed' },
    inputStandard: 'Topic, format (insight/story/list/question), target audience, key message',
    thinkingApproach: 'Scroll-stopping: What makes them stop? Valuable: What makes them engage? Shareable: What makes them amplify?'
  },
  video: {
    role: 'Video Script Writer',
    whatItOwns: ['Video scripts (short + long form)', 'Video descriptions', 'Thumbnail concepts'],
    whatItDoesntOwn: ['Content strategy (Sophie)', 'Technical ops (Casey)', 'Video editing (Mervyn)'],
    handoffTo: 'Content for distribution, Podcast for cross-promotion',
    successMeasures: ['X scripts per week', 'Timing compliance (60-90s short, 5-10m long)', 'Viewer retention design'],
    qualityBar: { draft: 'Script outline complete', ready: 'Full script, timing checked, ready to record', refined: 'Recorded, edited, published' },
    inputStandard: 'Topic, format (short/medium), duration target, key takeaway',
    thinkingApproach: 'First-5-seconds: Hook captures attention. Last-10-seconds: CTA drives action. Everything else: deliver value.'
  },
  'email-sequence': {
    role: 'Email Sequence Strategist',
    whatItOwns: ['Nurture sequences', 'Launch sequences', 'Welcome sequences', 'Follow-up sequences'],
    whatItDoesntOwn: ['Content strategy (Sophie)', 'Technical ops (Casey)', 'Strategic direction (Marcus)'],
    handoffTo: 'Messaging for strategy, Content for copy review',
    successMeasures: ['Sequence performs to target', 'Conversion optimisation', 'List trust maintained'],
    qualityBar: { draft: 'Sequence outline complete', ready: 'All emails written, timing set, ready to test', refined: 'Tested, optimised, automated' },
    inputStandard: 'Sequence type, target audience, objective, email count, timing',
    thinkingApproach: 'Subscriber-journey: What do they need to hear? When? What action should they take?'
  },
  community: {
    role: 'Community Manager',
    whatItOwns: ['Community engagement', 'Member support', 'Event coordination'],
    whatItDoesntOwn: ['Content creation (Sophie)', 'Technical ops (Casey)', 'Strategic direction (Marcus)'],
    handoffTo: 'Content for posts, Niles for escalations',
    successMeasures: ['Members engage', 'Value delivered (members feel supported)', 'Cadence maintained'],
    qualityBar: { draft: 'Post drafted', ready: 'Engagement-focused, scheduled', refined: 'Interaction driven, feedback captured' },
    inputStandard: 'Community name (Local Link / Growth Club), post purpose, key message, deadline',
    thinkingApproach: 'Member-perspective: What would make a member feel this was worth their time?'
  },
  research: {
    role: 'Research Analyst',
    whatItOwns: ['Market research', 'Data analysis', 'Competitive intelligence'],
    whatItDoesntOwn: ['Content creation (Sophie)', 'Technical ops (Casey)', 'Client delivery (Jerry)'],
    handoffTo: 'Strategy for insights, Messaging for competitive positioning',
    successMeasures: ['Findings directly apply', 'Synthesis over data dump', 'Delivered within 24h'],
    qualityBar: { draft: 'Data collected', ready: 'Analyzed, insights extracted', refined: 'Connected to business question, recommendations made' },
    inputStandard: 'Research question, scope, timeline, how result will be used',
    thinkingApproach: 'Question-first: What decision does this research inform?'
  }
};

function AgentModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const profile = agentProfiles[member.id];
  
  if (!profile) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
        <div style={{ background: 'var(--background)', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '90%' }} onClick={e => e.stopPropagation()}>
          <h2 style={{ marginBottom: '8px' }}>{member.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{member.role}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Detailed profile coming soon.</p>
          <button onClick={onClose} style={{ marginTop: '16px', padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto', padding: '20px' }} onClick={onClose}>
      <div style={{ background: 'var(--background)', borderRadius: '12px', padding: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)' }}>{member.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{profile.role}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)' }}>×</button>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Role Clarity */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Role Clarity</div>
            <div style={{ fontSize: '12px', marginBottom: '6px' }}><strong style={{ color: '#10b981' }}>Owns:</strong> {profile.whatItOwns.join(', ')}</div>
            <div style={{ fontSize: '12px' }}><strong style={{ color: '#ef4444' }}>Doesn't own:</strong> {profile.whatItDoesntOwn.join(', ')}</div>
          </div>

          {/* Handoff */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Handoff Protocol</div>
            <div style={{ fontSize: '12px' }}>Hands off to: <strong>{profile.handoffTo}</strong></div>
          </div>

          {/* Success Measures */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Success Measures (3)</div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px' }}>
              {profile.successMeasures.map((m, i) => <li key={i} style={{ marginBottom: '4px' }}>{m}</li>)}
            </ul>
          </div>

          {/* Quality Bar */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Standard of Output</div>
            <div style={{ fontSize: '11px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <div><strong style={{ color: '#f59e0b' }}>Draft:</strong><br/>{profile.qualityBar.draft}</div>
              <div><strong style={{ color: '#3b82f6' }}>Ready:</strong><br/>{profile.qualityBar.ready}</div>
              <div><strong style={{ color: '#10b981' }}>Refined:</strong><br/>{profile.qualityBar.refined}</div>
            </div>
          </div>

          {/* Input Standard */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Input Standard</div>
            <div style={{ fontSize: '12px' }}>{profile.inputStandard}</div>
          </div>

          {/* Thinking Approach */}
          <div style={{ padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px', textTransform: 'uppercase' }}>Structured Thinking</div>
            <div style={{ fontSize: '12px', fontStyle: 'italic' }}>"{profile.thinkingApproach}"</div>
          </div>
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          From <a href="/documents" style={{ color: 'var(--accent)' }}>SPECIALISTS.md</a>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  const tierBMembers = teamMembers.filter(m => m.tier === 'B');
  const tierCMembers = teamMembers.filter(m => m.tier === 'C');
  const profileMember = teamMembers.find(m => m.id === profileId);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {profileMember && <AgentModal member={profileMember} onClose={() => setProfileId(null)} />}
      
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
            <button onClick={(e) => { e.stopPropagation(); setProfileId('niles'); }} style={{ marginTop: '8px', padding: '4px 10px', fontSize: '10px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Profile</button>
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
                <button onClick={(e) => { e.stopPropagation(); setProfileId(member.id); }} style={{ marginTop: '8px', padding: '4px 10px', fontSize: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Profile</button>
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
                <button onClick={(e) => { e.stopPropagation(); setProfileId(member.id); }} style={{ marginTop: '6px', padding: '3px 8px', fontSize: '9px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human Team Section */}
      <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>👥</span> Human Team
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>External team members who support Leader By Design operations</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {humanTeamMembers.map(member => (
            <div key={member.id} style={{ padding: '16px', background: 'var(--background-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{member.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '8px' }}>{member.role}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>📍 {member.location}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Reports to: {member.reportsTo}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {member.responsibilities.map((r, i) => (
                  <div key={i} style={{ marginBottom: '2px' }}>• {r}</div>
                ))}
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