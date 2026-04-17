'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Folder, X, FileText } from 'lucide-react';

interface Doc {
  title: string;
  subtitle?: string;
  path: string;
  category: string;
  date: string;
  size: number;
  preview: string;
}

const CATEGORIES = ['All', 'Workflow', 'Content', 'Podcast', 'Packs', 'Curriculum', 'System', 'Other'];

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [docContent, setDocContent] = useState('');
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => setDocs(d.documents || []))
      .finally(() => setLoading(false));
  }, []);

  // Load full content when doc is selected
  useEffect(() => {
    if (selectedDoc) {
      setLoadingContent(true);
      fetch(`/api/documents?path=${encodeURIComponent(selectedDoc.path)}`)
        .then(r => r.json())
        .then(d => setDocContent(d.content || ''))
        .finally(() => setLoadingContent(false));
    }
  }, [selectedDoc]);

  const filteredDocs = useMemo(() => {
    let result = docs;
    if (category !== 'All') result = result.filter(d => d.category === category);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(s) || d.path.toLowerCase().includes(s) || (d.subtitle && d.subtitle.toLowerCase().includes(s)));
    }
    return result;
  }, [docs, search, category]);

  const groupedByCategory = useMemo(() => {
    const groups: { [key: string]: Doc[] } = {};
    filteredDocs.forEach(d => {
      if (!groups[d.category]) groups[d.category] = [];
      groups[d.category].push(d);
    });
    return groups;
  }, [filteredDocs]);

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading documents...</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, margin: 0 }}>Documents</h1>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>{docs.length} documents in your library</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--background-secondary)', color: 'var(--text)' }}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--background-secondary)', color: 'var(--text)' }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {Object.keys(groupedByCategory).length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No documents found</div>
      ) : (
        Object.entries(groupedByCategory).map(([cat, catDocs]) => (
          <div key={cat} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Folder size={14} /> {cat} ({catDocs.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {catDocs.map((doc, i) => (
                <div 
                  key={i} 
                  style={{ 
                    background: 'var(--background-secondary)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '8px', 
                    padding: '16px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: '3px solid var(--accent)'
                  }}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>{doc.title}</h4>
                      {doc.subtitle && (
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>{doc.subtitle}</p>
                      )}
                    </div>
                    <FileText size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.date}</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {selectedDoc && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
          onClick={() => setSelectedDoc(null)}
        >
          <div 
            style={{ 
              background: 'var(--background-primary)', 
              borderRadius: '12px', 
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 600, margin: '0 0 4px 0' }}>{selectedDoc.title}</h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{selectedDoc.path}</p>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: '4px',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflow: 'auto', flex: 1 }}>
              {loadingContent ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading...</div>
              ) : (
                <pre style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  margin: 0,
                  fontFamily: 'inherit',
                  color: 'var(--text)'
                }}>
                  {docContent}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>{selectedDoc.date}</span>
              <span>{(selectedDoc.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}