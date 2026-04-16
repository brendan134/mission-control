'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, ChevronDown, ChevronRight, Clock, BookOpen, Filter } from 'lucide-react';

interface MemoryEntry {
  time?: string;
  content: string;
}

interface DayMemory {
  date: string;
  entries: MemoryEntry[];
}

interface LongTermSection {
  title: string;
  content: string;
}

interface MemoryData {
  daily: DayMemory[];
  longTerm: { sections: LongTermSection[] };
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Highlight search term in text
function highlightText(text: string, search: string): React.ReactNode {
  if (!search.trim()) return text;
  
  const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  
  return parts.map((part, i) => 
    part.toLowerCase() === search.toLowerCase() 
      ? <span key={i} style={{ background: 'var(--accent)', color: 'var(--background-primary)', padding: '1px 4px', borderRadius: '3px' }}>{part}</span>
      : part
  );
}

function formatDate(dateStr: string): { day: string; date: string; full: string } {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  let dayLabel = '';
  if (diffDays === 0) dayLabel = 'Today';
  else if (diffDays === 1) dayLabel = 'Yesterday';
  else if (diffDays < 7) dayLabel = `${diffDays} days ago`;
  else dayLabel = DAYS[date.getDay()];
  
  return {
    day: dayLabel,
    date: date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
    full: date.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  };
}

export default function MemoryPage() {
  const [data, setData] = useState<MemoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'longterm'>('daily');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetch('/api/memory')
      .then(r => r.json())
      .then(d => {
        setData(d);
        // Expand today by default
        if (d.daily?.[0]) {
          setExpandedDays(new Set([d.daily[0].date]));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDaily = useMemo(() => {
    if (!data?.daily) return [];
    
    let filtered = data.daily;
    
    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (timeFilter) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          filtered = filtered.filter(d => new Date(d.date + 'T12:00:00') >= cutoff);
          break;
        case 'yesterday':
          cutoff.setDate(cutoff.getDate() - 1);
          cutoff.setHours(0, 0, 0, 0);
          const yesterdayStart = new Date(cutoff);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          filtered = filtered.filter(d => {
            const dDate = new Date(d.date + 'T12:00:00');
            return dDate >= yesterdayStart && dDate < cutoff;
          });
          break;
        case '7days':
          cutoff.setDate(cutoff.getDate() - 7);
          filtered = filtered.filter(d => new Date(d.date + 'T12:00:00') >= cutoff);
          break;
        case '30days':
          cutoff.setDate(cutoff.getDate() - 30);
          filtered = filtered.filter(d => new Date(d.date + 'T12:00:00') >= cutoff);
          break;
      }
    }
    
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.map(day => ({
        ...day,
        entries: day.entries.filter(e => 
          e.content.toLowerCase().includes(searchLower)
        )
      })).filter(day => day.entries.length > 0);
      
      // Auto-expand all matching days when searching
      if (search.trim() && filtered.length > 0) {
        setExpandedDays(new Set(filtered.map(d => d.date)));
      }
    }
    
    return filtered;
  }, [data?.daily, search, timeFilter]);

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading memories...
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Memory</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>Your operational memory system</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--background-secondary)', padding: '4px', borderRadius: '8px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            background: activeTab === 'daily' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'daily' ? 'var(--background-primary)' : 'var(--text-secondary)',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Calendar size={16} />
          Daily
        </button>
        <button
          onClick={() => setActiveTab('longterm')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            background: activeTab === 'longterm' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'longterm' ? 'var(--background-primary)' : 'var(--text-secondary)',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <BookOpen size={16} />
          Long-Term
        </button>
      </div>

      {/* Search & Filters */}
      {activeTab === 'daily' && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--background-secondary)',
                color: 'var(--text)',
                fontSize: '14px',
              }}
            />
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              background: 'var(--background-secondary)',
              color: 'var(--text)',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      )}

      {/* Daily Memory View */}
      {activeTab === 'daily' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredDaily.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No memories found
            </div>
          ) : (
            filteredDaily.map((day) => {
              const { day: dayLabel, date, full } = formatDate(day.date);
              const isExpanded = expandedDays.has(day.date);
              
              return (
                <div
                  key={day.date}
                  style={{
                    background: 'var(--background-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleDay(day.date)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>
                          {dayLabel} - {date}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {day.entries.length} {day.entries.length === 1 ? 'entry' : 'entries'}
                        </div>
                      </div>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px 50px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {day.entries.map((entry, i) => (
                        <div
                          key={i}
                          style={{
                            padding: '16px',
                            background: 'var(--background-tertiary)',
                            borderRadius: '8px',
                          }}
                        >
                          {entry.time && (
                            <div style={{ fontSize: '11px', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} />
                              {entry.time}
                            </div>
                          )}
                          <div style={{ fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                            {highlightText(entry.content, search)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Long-Term Memory View */}
      {activeTab === 'longterm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!data?.longTerm?.sections?.length ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No long-term memory found
            </div>
          ) : (
            data.longTerm.sections.map((section, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--background-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  padding: '20px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px', color: 'var(--accent)' }}>
                  {section.title}
                </h3>
                <div style={{ fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>
                  {section.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}