'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, AlertCircle, RefreshCw, Ban, HelpCircle } from 'lucide-react';

interface SignalFeed {
  critical: any[];
  warning: any[];
  yellow: any[];
  blocked: any[];
  needsDecision: any[];
  totalStale: number;
}

export default function SignalFeed() {
  const [signalFeed, setSignalFeed] = useState<SignalFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const fetchSignalFeed = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks/stale');
      if (res.ok) {
        const data = await res.json();
        setSignalFeed(data);
        setError(null);
      }
    } catch (err) {
      setError('Failed to load signal feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignalFeed();
    const interval = setInterval(fetchSignalFeed, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !signalFeed) {
    return (
      <div style={{
        background: 'var(--background-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
          <RefreshCw size={14} className="animate-spin" />
          Loading Signal Feed...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>
      </div>
    );
  }

  if (!signalFeed || signalFeed.totalStale === 0) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <CheckCircle size={14} style={{ color: '#22c55e' }} />
        <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 500 }}>All Systems Healthy</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: 'auto' }}>No stale tasks</span>
      </div>
    );
  }

  const { critical, warning, yellow, blocked, needsDecision, totalStale } = signalFeed;

  // Compact horizontal layout
  return (
    <div style={{
      background: 'var(--background-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '10px 14px',
      marginBottom: '16px'
    }}>
      {/* Header row - compact */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: expanded ? '10px' : '0' }}>
        <AlertTriangle size={14} style={{ color: totalStale > 0 ? '#f59e0b' : '#22c55e' }} />
        <span style={{ fontWeight: 600, fontSize: '13px' }}>Signal Feed</span>
        <span style={{ 
          background: totalStale > 2 ? '#ef4444' : totalStale > 0 ? '#f59e0b' : '#22c55e', 
          color: '#fff', 
          borderRadius: '10px', 
          padding: '1px 8px',
          fontSize: '11px',
          fontWeight: 600
        }}>
          {totalStale}
        </span>
        
        {/* Compact alert badges in a row */}
        <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
          {critical.length > 0 && (
            <span title={`${critical.length} critical (72h+)`} style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }} onClick={() => setExpanded(!expanded)}>
              ⚠ {critical.length}
            </span>
          )}
          {warning.length > 0 && (
            <span title={`${warning.length} warning (48h+)`} style={{
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#f59e0b',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }} onClick={() => setExpanded(!expanded)}>
              ⏰ {warning.length}
            </span>
          )}
          {yellow.length > 0 && (
            <span title={`${yellow.length} flag (24h+)`} style={{
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#eab308',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }} onClick={() => setExpanded(!expanded)}>
              🏴 {yellow.length}
            </span>
          )}
          {blocked.length > 0 && (
            <span title={`${blocked.length} blocked`} style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#8b5cf6',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }} onClick={() => setExpanded(!expanded)}>
              🚫 {blocked.length}
            </span>
          )}
          {needsDecision.length > 0 && (
            <span title={`${needsDecision.length} needs decision`} style={{
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              borderRadius: '4px',
              padding: '2px 8px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }} onClick={() => setExpanded(!expanded)}>
              ❓ {needsDecision.length}
            </span>
          )}
        </div>
        
        <button 
          onClick={fetchSignalFeed}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '4px',
            display: 'flex'
          }}
          title="Refresh"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Expanded detail view */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
          {critical.length > 0 && (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>CRITICAL (72h+): </span>
              {critical.slice(0, 5).map(t => (
                <span key={t.id} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>• {t.title.substring(0, 35)}...</span>
              ))}
            </div>
          )}
          {warning.length > 0 && (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>WARNING (48h+): </span>
              {warning.slice(0, 5).map(t => (
                <span key={t.id} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>• {t.title.substring(0, 35)}...</span>
              ))}
            </div>
          )}
          {yellow.length > 0 && (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#eab308', fontWeight: 600 }}>FLAG (24h+): </span>
              {yellow.slice(0, 5).map(t => (
                <span key={t.id} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>• {t.title.substring(0, 35)}...</span>
              ))}
            </div>
          )}
          {blocked.length > 0 && (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#8b5cf6', fontWeight: 600 }}>BLOCKED: </span>
              {blocked.slice(0, 5).map(t => (
                <span key={t.id} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>• {t.title.substring(0, 35)}...</span>
              ))}
            </div>
          )}
          {needsDecision.length > 0 && (
            <div style={{ fontSize: '12px' }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>NEEDS DECISION: </span>
              {needsDecision.slice(0, 5).map(t => (
                <span key={t.id} style={{ color: 'var(--text-muted)', marginRight: '8px' }}>• {t.title.substring(0, 35)}...</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}