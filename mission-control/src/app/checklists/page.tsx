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
  episode: string;
  title: string;
  items: ChecklistItem[];
}

const STORAGE_KEY = 'checklist-state';

const loadChecklists = (): Record<string, ChecklistItem[]> => {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
};

const saveChecklists = (state: Record<string, ChecklistItem[]>) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const INITIAL_CHECKLISTS: Checklist[] = [
  {
    episode: 'Episode 15',
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
];

export default function ChecklistsPage() {
  const [expanded, setExpanded] = useState<string | null>('Episode 15');
  const [checklistState, setChecklistState] = useState<Record<string, ChecklistItem[]>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = loadChecklists();
    const merged: Record<string, ChecklistItem[]> = {};
    INITIAL_CHECKLISTS.forEach(checklist => {
      if (saved[checklist.episode]) {
        merged[checklist.episode] = saved[checklist.episode];
      } else {
        merged[checklist.episode] = checklist.items;
      }
    });
    setChecklistState(merged);
  }, []);

  const toggleItem = (episode: string, itemId: string) => {
    const updated = { ...checklistState };
    updated[episode] = updated[episode].map(item =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setChecklistState(updated);
    saveChecklists(updated);
  };

  const getProgress = (episode: string) => {
    const items = checklistState[episode] || [];
    if (items.length === 0) return 0;
    const done = items.filter(i => i.done).length;
    return Math.round((done / items.length) * 100);
  };

  if (!mounted) return null;

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Checklists</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Track episode delivery tasks and approvals
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {INITIAL_CHECKLISTS.map(checklist => {
          const isExpanded = expanded === checklist.episode;
          const progress = getProgress(checklist.episode);
          const items = checklistState[checklist.episode] || checklist.items;

          return (
            <div
              key={checklist.episode}
              style={{
                background: 'var(--background-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : checklist.episode)}
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
                  <div style={{ fontWeight: 600, fontSize: '15px' }}>{checklist.episode}</div>
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
                    {items.map(item => (
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
                          onChange={() => toggleItem(checklist.episode, item.id)}
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
    </div>
  );
}
