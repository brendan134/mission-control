'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Folder, FileText, ChevronRight, ChevronDown, BookOpen, X } from 'lucide-react';

interface Note {
  title: string;
  folder: string;
  path: string;
  content: string;
  modified: string;
}

export default function KnowledgePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['01-daily-logs', '02-mistakes', '03-shared', '04-knowledge', 'prompts']));

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(d => setNotes(d.notes || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, []);

  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    notes.forEach(n => folderSet.add(n.folder));
    return Array.from(folderSet).sort();
  }, [notes]);

  const filteredNotes = useMemo(() => {
    if (!search) return notes;
    const s = search.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(s) || 
      n.content.toLowerCase().includes(s)
    );
  }, [notes, search]);

  const groupedNotes = useMemo(() => {
    const groups: Record<string, Note[]> = {};
    filteredNotes.forEach(n => {
      const folder = n.folder;
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(n);
    });
    return groups;
  }, [filteredNotes]);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getFolderIcon = (folder: string) => {
    if (folder.includes('daily')) return '📓';
    if (folder.includes('mistakes')) return '💡';
    if (folder.includes('shared')) return '🤝';
    if (folder.includes('knowledge')) return '🧠';
    if (folder.includes('prompts')) return '📋';
    return '📁';
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-xl font-bold text-amber-400 mt-4 mb-3 pb-2 border-b border-amber-500/30">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-md font-medium text-amber-200 mt-3 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-gray-300 mb-1">{line.slice(2)}</li>;
      }
      if (line.match(/^\d+\. /)) {
        return <li key={i} className="ml-4 text-gray-300 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      }
      if (line.match(/^\*\*.*\*\*/)) {
        return <p key={i} className="text-gray-200 font-semibold mb-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      if (line.startsWith('|')) {
        return <div key={i} className="font-mono text-xs text-gray-400 ml-2">{line}</div>;
      }
      return <p key={i} className="text-gray-300 text-sm mb-1">{line}</p>;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--background-primary)' }}>
      {/* Header */}
      <div className="border-b p-4" style={{ borderColor: 'var(--border)', background: 'var(--background-secondary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}>
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Knowledge Base</h1>
            <p className="text-xs text-gray-400">{notes.length} notes from your Obsidian vault</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg text-sm text-white placeholder-gray-500"
            style={{ 
              background: 'var(--background-tertiary)',
              border: '1px solid var(--border)'
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Folder tree */}
        <div className="w-72 border-r overflow-y-auto" style={{ 
          borderColor: 'var(--border)', 
          background: 'var(--background-secondary)' 
        }}>
          <div className="p-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Folders</h2>
          </div>
          {folders.map(folder => (
            <div key={folder}>
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-white/5 transition-colors"
              >
                {expandedFolders.has(folder) ? (
                  <ChevronDown className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <span className="text-lg">{getFolderIcon(folder)}</span>
                <span className="text-sm font-medium text-gray-200">{folder}</span>
                <span className="ml-auto text-xs text-gray-500">({groupedNotes[folder]?.length || 0})</span>
              </button>
              
              {expandedFolders.has(folder) && groupedNotes[folder] && (
                <div className="ml-4 border-l border-gray-700/50">
                  {groupedNotes[folder].map(note => (
                    <button
                      key={note.path}
                      onClick={() => setSelectedNote(note)}
                      className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-white/5 transition-colors ${
                        selectedNote?.path === note.path ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                      }`}
                    >
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-300 truncate">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content - Note viewer */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedNote ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedNote.title}</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedNote.folder} • {formatDate(selectedNote.modified)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="prose prose-invert max-w-none">
                {renderContent(selectedNote.content)}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)' }}>
                  <BookOpen className="w-8 h-8 text-amber-400" />
                </div>
                <p className="text-gray-400">Select a note to view</p>
                <p className="text-xs text-gray-600 mt-1">Click any note from the sidebar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}