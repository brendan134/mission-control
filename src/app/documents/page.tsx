"use client";

import { useState, useEffect, useMemo } from 'react';
import { FileText, Search, Folder, Calendar, X, Filter, Tag, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  path: string;
  category: string;
  content: string;
  date: string;
  preview: string;
}

const categoryIcons: Record<string, string> = {
  'System': '⚙️',
  'Workflows': '🔄',
  'Packs': '📦',
  'Business': '💼',
  'Podcast': '🎙️',
  'Mission Control': '🚀',
  'Identity': '👤',
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);

  // Fetch full document content when selected
  useEffect(() => {
    if (selectedDoc) {
      setLoadingContent(true);
      fetch(`/api/documents?path=${encodeURIComponent(selectedDoc.path)}`)
        .then(res => res.json())
        .then(data => {
          setDocContent(data.content || selectedDoc.content);
          setLoadingContent(false);
        })
        .catch(() => {
          setDocContent(selectedDoc.content);
          setLoadingContent(false);
        });
    }
  }, [selectedDoc]);

  // Clear content when modal closes
  useEffect(() => {
    if (!selectedDoc) {
      setDocContent('');
    }
  }, [selectedDoc]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['System', 'Workflows', 'Packs']);

  // Load documents from various locations
  useEffect(() => {
    // Sample documents - in production, this would fetch from an API that scans the filesystem
    const sampleDocs: Document[] = [
      // System Docs
      {
        id: '1',
        title: 'AGENTS.md',
        path: '/data/.openclaw/AGENTS.md',
        category: 'System',
        content: 'Contains agent configurations and operating instructions',
        date: '2026-04-15',
        preview: 'Contains agent configurations and operating instructions for the AI system...'
      },
      {
        id: '2',
        title: 'SOUL.md',
        path: '/data/.openclaw/SOUL.md',
        category: 'System',
        content: 'Core identity and persona definitions',
        date: '2026-04-15',
        preview: 'Core identity and persona definitions for the AI assistant...'
      },
      {
        id: '3',
        title: 'TOOLS.md',
        path: '/data/.openclaw/TOOLS.md',
        category: 'System',
        content: 'Local tool configurations and preferences',
        date: '2026-04-15',
        preview: 'Local tool configurations and preferences for the system...'
      },
      {
        id: '4',
        title: 'RULES.md',
        path: '/data/.openclaw/RULES.md',
        category: 'System',
        content: 'Operational rules and boundaries',
        date: '2026-04-12',
        preview: 'Operational rules and boundaries for the AI system...'
      },
      // Workflows
      {
        id: '5',
        title: 'Task Capture & Prioritisation',
        path: '/data/.openclaw/workflows/task-capture-and-prioritisation.md',
        category: 'Workflows',
        content: 'Workflow for capturing and prioritising tasks',
        date: '2026-04-06',
        preview: 'Workflow for capturing and prioritising tasks in the system...'
      },
      {
        id: '6',
        title: 'Decision Log Workflow',
        path: '/data/.openclaw/workflows/decision-log-workflow.md',
        category: 'Workflows',
        content: 'Process for logging important decisions',
        date: '2026-04-06',
        preview: 'Process for logging important decisions and their rationale...'
      },
      {
        id: '7',
        title: 'Content Production Workflow',
        path: '/data/.openclaw/workflows/content-production-workflow.md',
        category: 'Workflows',
        content: 'End-to-end content creation process',
        date: '2026-04-06',
        preview: 'End-to-end content creation process from brief to publication...'
      },
      // Packs
      {
        id: '8',
        title: 'Avatar Story',
        path: '/data/.openclaw/packs/avatar-story.md',
        category: 'Packs',
        content: 'Brand avatar and personal story content',
        date: '2026-04-06',
        preview: 'Brand avatar and personal story content for Leader By Design...'
      },
      {
        id: '9',
        title: 'Methodology',
        path: '/data/.openclaw/packs/methodology.md',
        category: 'Packs',
        content: 'Core methodology and frameworks',
        date: '2026-04-06',
        preview: 'Core methodology and frameworks for the leadership system...'
      },
      {
        id: '10',
        title: 'Brand Voice',
        path: '/data/.openclaw/packs/brand-voice.md',
        category: 'Packs',
        content: 'Brand voice guidelines and tone',
        date: '2026-04-06',
        preview: 'Brand voice guidelines and tone for all content...'
      },
      {
        id: '11',
        title: 'Messaging',
        path: '/data/.openclaw/packs/messaging.md',
        category: 'Packs',
        content: 'Core messaging and positioning',
        date: '2026-04-06',
        preview: 'Core messaging and positioning for the business...'
      },
      {
        id: '12',
        title: 'Offer',
        path: '/data/.openclaw/packs/offer.md',
        category: 'Packs',
        content: 'Service offer and pricing structure',
        date: '2026-04-06',
        preview: 'Service offer and pricing structure for clients...'
      },
      // Business
      {
        id: '13',
        title: 'Leader By Design',
        path: '/data/.openclaw/business/leader-by-design.md',
        category: 'Business',
        content: 'Business overview and positioning',
        date: '2026-04-01',
        preview: 'Business overview and positioning for Leader By Design...'
      },
      // Podcast
      {
        id: '14',
        title: 'Episode 2026-04-06',
        path: '/data/.openclaw/podcast/episode-2026-04-06.md',
        category: 'Podcast',
        content: 'Podcast episode script and notes',
        date: '2026-04-06',
        preview: 'Podcast episode: Why Your Team Keeps Waiting for You to Decide...'
      },
      // Mission Control
      {
        id: '15',
        title: 'Mission Control Architecture Rules',
        path: '/data/.openclaw/workspace/MISSION_CONTROL_ARCHITECTURE_RULES.md',
        category: 'Mission Control',
        content: 'Architecture guidelines for Mission Control',
        date: '2026-04-10',
        preview: 'Architecture guidelines and rules for building Mission Control...'
      },
      {
        id: '16',
        title: 'Migration Guide',
        path: '/data/.openclaw/workspace/MIGRATION.md',
        category: 'Mission Control',
        content: 'Mac Mini migration instructions',
        date: '2026-04-15',
        preview: 'Complete guide for migrating the system to Mac Mini...'
      },
      // Identity
      {
        id: '17',
        title: 'IDENTITY.md',
        path: '/data/.openclaw/workspace/IDENTITY.md',
        category: 'Identity',
        content: 'AI assistant identity configuration',
        date: '2026-04-14',
        preview: 'AI assistant identity configuration and personality settings...'
      },
      {
        id: '18',
        title: 'USER.md',
        path: '/data/.openclaw/workspace/USER.md',
        category: 'Identity',
        content: 'User profile and preferences',
        date: '2026-04-14',
        preview: 'User profile and preferences for Brendan...'
      }
    ];

    setDocuments(sampleDocs.sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.preview.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, selectedCategory]);

  // Get unique categories
  const categories = [...new Set(documents.map(d => d.category))];

  // Group documents by category
  const groupedDocs = useMemo(() => {
    const grouped: Record<string, Document[]> = {};
    filteredDocs.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    return grouped;
  }, [filteredDocs]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>Documents</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Search and browse your document library</p>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search className="w-5 h-5" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search documents by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              background: 'var(--background-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '12px 16px',
            background: 'var(--background-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text)',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          Found {filteredDocs.length} document{filteredDocs.length !== 1 ? 's' : ''} matching "{searchQuery}"
        </div>
      )}

      {/* Document List - Grouped by Category */}
      {!searchQuery ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map(category => (
            <div 
              key={category}
              style={{
                background: 'var(--background-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              {/* Category Header */}
              <div 
                onClick={() => toggleCategory(category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  background: expandedCategories.includes(category) ? 'var(--background-tertiary)' : 'transparent',
                }}
              >
                {expandedCategories.includes(category) ? (
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                ) : (
                  <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                )}
                <span style={{ fontSize: '20px' }}>{categoryIcons[category] || '📄'}</span>
                <span style={{ fontWeight: '600' }}>{category}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {groupedDocs[category]?.length || 0} document{(groupedDocs[category]?.length || 0) !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Documents in Category */}
              {expandedCategories.includes(category) && groupedDocs[category] && (
                <div style={{ padding: '0 20px 16px 48px' }}>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {groupedDocs[category].map(doc => (
                      <div 
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        style={{
                          padding: '12px 16px',
                          background: 'var(--background-primary)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseOver={e => (e.target as HTMLDivElement).style.background = 'var(--background-tertiary)'}
                        onMouseOut={e => (e.target as HTMLDivElement).style.background = 'var(--background-primary)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                            <span style={{ fontWeight: '500', fontSize: '14px' }}>{doc.title}</span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.date}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginLeft: '28px' }}>
                          {doc.preview}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Search Results */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredDocs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              style={{
                padding: '16px 20px',
                background: 'var(--background-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span style={{ fontWeight: '500', fontSize: '14px' }}>{doc.title}</span>
                  <span style={{ 
                    fontSize: '10px', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    background: 'var(--background-tertiary)',
                    color: 'var(--text-muted)',
                  }}>
                    {doc.category}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doc.date}</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '28px' }}>
                {doc.preview}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '100',
        }} onClick={() => setSelectedDoc(null)}>
          <div style={{
            background: 'var(--background-secondary)',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '80vh',
            overflow: 'auto',
            border: '1px solid var(--border)',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>{selectedDoc.title}</h3>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    padding: '2px 10px', 
                    borderRadius: '12px',
                    background: 'var(--background-tertiary)',
                    color: 'var(--text-secondary)',
                  }}>
                    {selectedDoc.category}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar className="w-3 h-3" />
                    {selectedDoc.date}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div style={{ 
              padding: '20px', 
              background: 'var(--background-tertiary)', 
              borderRadius: '10px',
              fontSize: '14px',
              lineHeight: '1.7',
              color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
              maxHeight: '400px',
              overflow: 'auto',
            }}>
              {loadingContent ? 'Loading...' : docContent}
            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Path: {selectedDoc.path}
            </div>
          </div>
        </div>
      )}

      {/* How Documents Are Organised */}
      <div style={{ 
        marginTop: '32px',
        background: 'var(--background-secondary)', 
        border: '1px solid var(--border)', 
        borderRadius: '12px', 
        padding: '20px' 
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>How Documents Are Collected</h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>System</strong> - Core configuration files (AGENTS.md, SOUL.md, TOOLS.md, RULES.md)</li>
            <li style={{ marginBottom: '8px' }}><strong>Workflows</strong> - Operational workflows (task capture, decision logging, content production)</li>
            <li style={{ marginBottom: '8px' }}><strong>Packs</strong> - Content packs (avatar, methodology, brand voice, messaging, offer)</li>
            <li style={{ marginBottom: '8px' }}><strong>Business</strong> - Business documents and positioning</li>
            <li style={{ marginBottom: '8px' }}><strong>Podcast</strong> - Episode scripts and notes</li>
            <li style={{ marginBottom: '8px' }}><strong>Mission Control</strong> - System architecture and migration docs</li>
            <li>Documents are grouped by category for easy navigation. Use search to find specific content.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}