'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Folder, FileText, ChevronRight, ChevronDown, BookOpen, Tag } from 'lucide-react';

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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['01-daily-logs', '02-mistakes', '03-shared', '04-knowledge']));

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
          <span className="text-sm text-gray-500">({notes.length} notes)</span>
        </div>
        
        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Folder tree */}
        <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
          {folders.map(folder => (
            <div key={folder}>
              <button
                onClick={() => toggleFolder(folder)}
                className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 transition-colors"
              >
                {expandedFolders.has(folder) ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
                <Folder className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">{folder}</span>
              </button>
              
              {expandedFolders.has(folder) && groupedNotes[folder] && (
                <div className="ml-6">
                  {groupedNotes[folder].map(note => (
                    <button
                      key={note.path}
                      onClick={() => setSelectedNote(note)}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-gray-100 transition-colors ${
                        selectedNote?.path === note.path ? 'bg-blue-50 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main content - Note viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {selectedNote ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{selectedNote.title}</h2>
                <span className="text-xs text-gray-500">
                  {formatDate(selectedNote.modified)}
                </span>
              </div>
              <div className="prose prose-sm max-w-none">
                {selectedNote.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                  }
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(3)}</h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4">{line.slice(2)}</li>;
                  }
                  if (line.match(/^\d+\. /)) {
                    return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="text-sm text-gray-700">{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a note to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}