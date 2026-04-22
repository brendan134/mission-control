'use client';
import { useState } from 'react';
import { AGENT_TEAM, findBestAgent, getAgentById, WORKFLOW_STATES, type Agent } from '@/lib/agent-registry';
import { Bot, Zap, ArrowRight, CheckCircle, Clock, Play, Package, FileText, Send, Archive } from 'lucide-react';

export default function AgentOrchestrator() {
  const [testInput, setTestInput] = useState('');
  const [routedAgent, setRoutedAgent] = useState<Agent | null>(null);
  const [showAllAgents, setShowAllAgents] = useState(false);

  const handleRoute = () => {
    if (testInput.trim()) {
      const agent = findBestAgent(testInput);
      setRoutedAgent(agent);
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'intake': return <FileText size={14} />;
      case 'analyzing': return <Zap size={14} />;
      case 'prep': return <Package size={14} />;
      case 'active': return <Play size={14} />;
      case 'review': return <CheckCircle size={14} />;
      case 'completed': return <CheckCircle size={14} />;
      case 'archived': return <Archive size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStateColor = (state: string) => {
    const found = WORKFLOW_STATES.find(s => s.value === state);
    return found?.color || '#6b7280';
  };

  const displayedAgents = showAllAgents ? AGENT_TEAM : AGENT_TEAM.filter(a => a.tier === 'A' || a.tier === 'B');

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={24} style={{ color: '#8b5cf6' }} />
            Agent Orchestrator
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Auto-routing for your 16-agent team</p>
        </div>
      </div>

      {/* Workflow States Visualization */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px', 
        padding: '16px', 
        background: 'var(--background-secondary)', 
        borderRadius: '12px',
        border: '1px solid var(--border)',
        overflowX: 'auto'
      }}>
        {WORKFLOW_STATES.map((state, idx) => (
          <div key={state.value} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            flex: 1,
            minWidth: 'fit-content'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: `${state.color}15`,
              color: state.color,
              fontSize: '11px',
              fontWeight: 500
            }}>
              {getStateIcon(state.value)}
              {state.label}
            </div>
            {idx < WORKFLOW_STATES.length - 1 && (
              <ArrowRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>

      {/* Routing Test */}
      <div style={{ 
        marginBottom: '24px', 
        padding: '20px', 
        background: 'linear-gradient(135deg, #8b5cf615, #3b82f615)', 
        borderRadius: '12px',
        border: '1px solid #8b5cf630'
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={16} style={{ color: '#8b5cf6' }} />
          Test Routing
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRoute()}
            placeholder="Describe a task... (e.g., 'Create a LinkedIn post about leadership')"
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background-primary)',
              color: 'var(--text)',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleRoute}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#8b5cf6',
              color: 'white',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Send size={16} />
            Route
          </button>
        </div>
        {routedAgent && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: 'var(--background-primary)', 
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Routes to:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                display: 'inline-flex', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '11px', 
                fontWeight: 500,
                background: routedAgent.tier === 'A' ? '#ef444415' : routedAgent.tier === 'B' ? '#3b82f615' : '#10b98115',
                color: routedAgent.tier === 'A' ? '#ef4444' : routedAgent.tier === 'B' ? '#3b82f6' : '#10b981'
              }}>
                {routedAgent.tier}
              </span>
              <span style={{ fontWeight: 600 }}>{routedAgent.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>- {routedAgent.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Agent Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Agent Team ({displayedAgents.length})</h3>
          <button 
            onClick={() => setShowAllAgents(!showAllAgents)}
            style={{
              background: 'none',
              border: 'none',
              color: '#8b5cf6',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            {showAllAgents ? 'Show Tier A+B' : 'Show All 16 Agents'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {displayedAgents.map(agent => (
            <div 
              key={agent.id}
              style={{
                padding: '12px',
                background: 'var(--background-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Bot size={16} style={{ color: agent.tier === 'A' ? '#ef4444' : agent.tier === 'B' ? '#3b82f6' : '#10b981' }} />
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{agent.name}</span>
                <span style={{ 
                  fontSize: '10px', 
                  padding: '1px 4px', 
                  borderRadius: '3px',
                  background: agent.tier === 'A' ? '#ef444415' : agent.tier === 'B' ? '#3b82f615' : '#10b98115',
                  color: agent.tier === 'A' ? '#ef4444' : agent.tier === 'B' ? '#3b82f6' : '#10b981'
                }}>
                  {agent.tier}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{agent.role}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Reports to: {getAgentById(agent.reportsTo)?.name || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}