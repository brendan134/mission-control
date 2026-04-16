'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Folder, ChevronDown, ChevronRight } from 'lucide-react';

interface Doc {
  title: string;
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
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(d => setDocs(d.documents || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredDocs = useMemo(() => {
    let result = docs;
    if (category !== 'All') result = result.filter(d => d.category === category);
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(s) || d.path.toLowerCase().includes(s));
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
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}><Folder size={14} /> {cat} ({catDocs.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {catDocs.map((doc, i) => (
                <div key={i} style={{ background: 'var(--background-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', cursor: 'pointer' }} onClick={() => setExpandedDoc(expandedDoc === doc.path ? null : doc.path)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{doc.title}</h4>
                    {expandedDoc === doc.path ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.date} • {(doc.size / 1024).toFixed(0)}KB</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>{expandedDoc === doc.path ? doc.preview : doc.preview.substring(0, 80)}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
