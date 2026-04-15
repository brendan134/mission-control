"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, BookOpen, Clock, ChevronDown, ChevronRight, X, Filter, FileText } from 'lucide-react';

interface MemoryEntry {
  date: string;
  content: string;
  sections: { title: string; content: string }[];
}

interface LongTermMemory {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

// Sample long-term memory entries
const longTermMemories: LongTermMemory[] = [
  {
    id: '1',
    title: 'System Architecture',
    content: 'The Leader By Design AI Operating System uses OpenClaw as the core framework. Mission Control is a Next.js app running on the VPS. Cloudflare tunnel provides public access.',
    category: 'Technical',
    createdAt: '2026-04-10'
  },
  {
    id: '2',
    title: 'Business Purpose',
    content: 'We exist to amplify the freedom of others by helping hands-on business owners build self-managing teams.',
    category: 'Mission',
    createdAt: '2026-04-10'
  },
  {
    id: '3',
    title: 'Key Contacts',
    content: 'Brendan is the founder. Niles is the Chief Agent Officer. Team includes Marcus (Strategy), Sarah (Content), Jordan (Delivery), and specialists Alex, Emily, Chris, Sam, Taylor.',
    category: 'Team',
    createdAt: '2026-04-12'
  }
];

export default function MemoryPage() {
  const [dailyMemories, setDailyMemories] = useState<MemoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDays, setExpandedDays] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'longterm'>('daily');
  const [searchResults, setSearchResults] = useState<{date: string; matches: string[]}[]>([]);

  // Load memory files
  useEffect(() => {
    async function loadMemories() {
      try {
        const response = await fetch('/api/memory');
        const data = await response.json();
        setDailyMemories(data);
        // Expand the most recent day by default
        if (data.length > 0) {
          setExpandedDays([data[0].date]);
        }
      } catch (error) {
        console.error('Failed to load memories:', error);
        // Fallback to sample data
        const sampleMemories: MemoryEntry[] = [
          {
            date: '2026-04-14',
            content: `# April 14, 2026\n\n## What Happened\n\n### Morning Work - Mission Control Features\n- Added View button to Documents page\n- Added Strategic Priority dropdown to Projects page\n\n### Afternoon Disaster\n- Around 18:10, the workspace was reset\n- Lost all Mission Control files`,
            sections: [
              { title: 'What Happened', content: 'Morning: Added View button to Documents, Strategic Priority dropdown to Projects. Afternoon: Workspace reset at 18:10, lost Mission Control files.' },
              { title: 'Lessons Learned', content: 'Code not pushed to GitHub - lost completely. Critical: Push to GitHub same day.' }
            ]
          }
        ];
        setDailyMemories(sampleMemories);
        setExpandedDays(['2026-04-14']);
      }
    }
    
    loadMemories();
  }, []);

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: {date: string; matches: string[]}[] = [];
    const queryLower = query.toLowerCase();

    dailyMemories.forEach(memory => {
      const matches: string[] = [];
      
      // Search in content
      if (memory.content.toLowerCase().includes(queryLower)) {
        // Find the section containing the match
        memory.sections.forEach(section => {
          if (section.content.toLowerCase().includes(queryLower)) {
            const preview = section.content.substring(
              Math.max(0, section.content.toLowerCase().indexOf(queryLower) - 30),
              Math.min(section.content.length, section.content.toLowerCase().indexOf(queryLower) + query.length + 50)
            );
            matches.push(`...${preview}...`);
          }
        });
      }
      
      if (matches.length > 0) {
        results.push({ date: memory.date, matches: [...new Set(matches)] });
      }
    });

    setSearchResults(results);
  };

  const toggleDay = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Memory</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Search and browse your memory logs</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: activeTab === 'daily' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'daily' ? '#000' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <Calendar className="w-4 h-4" />
          Daily Logs
        </button>
        <button
          onClick={() => setActiveTab('longterm')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: activeTab === 'longterm' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'longterm' ? '#000' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          <BookOpen className="w-4 h-4" />
          Long-term Memory
        </button>
      </div>

      {/* Search Bar */}
      {activeTab === 'daily' && (
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search className="w-5 h-5" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search memories by word or phrase..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'var(--background-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && activeTab === 'daily' && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Search className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div style={{ 
              padding: '32px', 
              textAlign: 'center', 
              background: 'var(--background-secondary)', 
              borderRadius: '12px',
              border: '1px solid var(--border)'
            }}>
              <Search className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p style={{ color: 'var(--text-secondary)' }}>No matches found</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Try different keywords or check spelling</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.map((result, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '16px',
                    background: 'var(--background-secondary)',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setExpandedDays(prev => [...new Set([...prev, result.date])]);
                    setSearchQuery('');
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{formatDate(result.date)}</span>
                  </div>
                  {result.matches.map((match, mIdx) => (
                    <div 
                      key={mIdx}
                      style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)', 
                        padding: '8px',
                        background: 'var(--background-tertiary)',
                        borderRadius: '6px',
                        marginBottom: mIdx < result.matches.length - 1 ? '8px' : '0'
                      }}
                    >
                      {match}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Daily Memory Logs */}
      {activeTab === 'daily' && !searchQuery && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dailyMemories.map(memory => (
            <div 
              key={memory.date}
              style={{
                background: 'var(--background-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* Day Header */}
              <div 
                onClick={() => toggleDay(memory.date)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  background: expandedDays.includes(memory.date) ? 'var(--background-tertiary)' : 'transparent',
                }}
              >
                {expandedDays.includes(memory.date) ? (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                )}
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{formatDate(memory.date)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {memory.sections.length} section{memory.sections.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Day Content */}
              {expandedDays.includes(memory.date) && (
                <div style={{ padding: '0 20px 20px 48px' }}>
                  {memory.sections.map((section, idx) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--accent)' }}>
                        {section.title}
                      </h4>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Long-term Memory */}
      {activeTab === 'longterm' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Filter className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Curated memories that persist across sessions
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
            {longTermMemories.map(memory => (
              <div 
                key={memory.id}
                style={{
                  padding: '20px',
                  background: 'var(--background-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{memory.title}</h3>
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: '#D4AF37',
                    }}>
                      {memory.category}
                    </span>
                  </div>
                  <BookOpen className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {memory.content}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <Clock className="w-3 h-3" />
                  Saved {memory.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div style={{ 
        marginTop: '32px',
        background: 'var(--background-secondary)', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        padding: '20px' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>How Memory is Organised</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Daily Logs</strong> - Automatic session summaries grouped by date</li>
            <li style={{ marginBottom: '8px' }}><strong>Long-term Memory</strong> - Curated entries that persist and don't get deleted</li>
            <li style={{ marginBottom: '8px' }}><strong>Search</strong> - Full-text search across all daily memory content, finds words and phrases</li>
            <li style={{ marginBottom: '8px' }}><strong>Indexing</strong> - Each day is parsed into sections for easy scanning</li>
            <li>Click any day to expand and see full content. Use search to find specific conversations or context.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}