'use client';

import { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronRight } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  assignee: string;
  done: boolean;
}

interface Checklist {
  title: string;
  items: ChecklistItem[];
}

const INITIAL_CHECKLISTS: Record<string, Checklist> = {
  'Episode 15': {
    title: 'When Growth Outpaces Leadership Design',
    items: [
      { id: 'ep15-1', text: 'Edit audio episode for approval', assignee: 'Mervyn', done: false },
      { id: 'ep15-2', text: 'Schedule written social media posts (LinkedIn, Insta, FB)', assignee: 'Dom', done: false },
      { id: 'ep15-3', text: 'Schedule shorts/reels social media posts', assignee: 'Dom', done: false },
      { id: 'ep15-4', text: 'Schedule podcast in Castos (title, show notes, keywords)', assignee: 'Dom', done: false },
      { id: 'ep15-5', text: 'Schedule email marketing message for approval', assignee: 'Dom', done: false },
      { id: 'ep15-6', text: 'Schedule YouTube shorts (titles, descriptions, tags)', assignee: 'Dom', done: false },
      { id: 'ep15-7', text: 'Brendan: Review & approve audio edit', assignee: 'Brendan', done: false },
      { id: 'ep15-8', text: 'Brendan: Approve written social posts', assignee: 'Brendan', done: false },
      { id: 'ep15-9', text: 'Brendan: Approve shorts/reels', assignee: 'Brendan', done: false },
      { id: 'ep15-10', text: 'Brendan: Approve Castos schedule', assignee: 'Brendan', done: false },
      { id: 'ep15-11', text: 'Brendan: Approve email marketing', assignee: 'Brendan', done: false },
      { id: 'ep15-12', text: 'Brendan: Approve YouTube shorts', assignee: 'Brendan', done: false },
    ],
  },
};

export default function ChecklistsPage() {
  const [expanded, setExpanded] = useState<string | null>('Episode 15');
  const [checklistState, setChecklistState] = useState<Record<string, Checklist>>({});
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from API on mount
  useEffect(() => {
    setMounted(true);
    fetch('/api/checklists')
      .then(r => r.json())
      .then(data => {
        if (data.checklists && Object.keys(data.checklists).length > 0) {
          setChecklistState(data.checklists);
        } else {
          // Initialize with default data if no saved data
          setChecklistState(INITIAL_CHECKLISTS);
        }
      })
      .catch(() => {
        setChecklistState(INITIAL_CHECKLISTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleItem = async (episode: string, itemId: string) => {
    const currentChecklist = checklistState[episode];
    if (!currentChecklist) return;

    const item = currentChecklist.items.find(i => i.id === itemId);
    if (!item) return;

    const newDone = !item.done;

    // Optimistic update
    const updated = {
      ...checklistState,
      [episode]: {
        ...currentChecklist,
        items: currentChecklist.items.map(i =>
          i.id === itemId ? { ...i, done: newDone } : i
        ),
      },
    };
    setChecklistState(updated);

    // Save to API
    try {
      await fetch('/api/checklists', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId: episode, itemId, done: newDone }),
      });
    } catch (err) {
      console.error('Failed to save checklist state:', err);
    }
  };

  const getProgress = (episode: string) => {
    const checklist = checklistState[episode];
    if (!checklist || checklist.items.length === 0) return 0;
    const done = checklist.items.filter(i => i.done).length;
    return Math.round((done / checklist.items.length) * 100);
  };

  if (!mounted || loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Loading checklists...
        </div>
      </div>
    );
  }

  const episodes = Object.keys(checklistState).length > 0 
    ? Object.keys(checklistState) 
    : Object.keys(INITIAL_CHECKLISTS);

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Checklists</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Track episode delivery tasks and approvals
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {episodes.map(episode => {
          const checklist = checklistState[episode] || INITIAL_CHECKLISTS[episode];
          if (!checklist) return null;
          
          const isExpanded = expanded === episode;
          const progress = getProgress(episode);

          return (
            <div
              key={episode}
              style={{
                background: 'var(--background-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : episode)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--text)',
                  textAlign: 'left',
                }}
              >
                <ChevronRight
                  size={20}
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                    color: 'var(--text-muted)',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{episode}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{checklist.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '6px',
                      background: 'var(--background-tertiary)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: progress === 100 ? 'var(--success)' : 'var(--accent)',
                        transition: 'width 0.3s',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', minWidth: '36px' }}>
                    {progress}%
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: '0 20px 20px 52px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {checklist.items.map(item => (
                      <label
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          background: 'var(--background-primary)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          opacity: item.done ? 0.6 : 1,
                          transition: 'opacity 0.2s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleItem(episode, item.id)}
                          style={{ display: 'none' }}
                        />
                        {item.done ? (
                          <CheckSquare size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                        ) : (
                          <Square size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        )}
                        <span
                          style={{
                            flex: 1,
                            fontSize: '14px',
                            textDecoration: item.done ? 'line-through' : 'none',
                            color: item.done ? 'var(--text-muted)' : 'var(--text)',
                          }}
                        >
                          {item.text}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            padding: '2px 8px',
                            background: item.assignee === 'Brendan' ? 'rgba(212, 175, 55, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            color: item.assignee === 'Brendan' ? 'var(--accent-gold)' : 'var(--success)',
                            borderRadius: '4px',
                            fontWeight: 500,
                          }}
                        >
                          {item.assignee}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {episodes.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No checklists available
        </div>
      )}
    </div>
  );
}