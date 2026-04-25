'use client';

import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MemoryPage() {
  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--background-primary)' }}>
      {/* Header */}
      <div className="border-b p-6" style={{ borderColor: 'var(--border)', background: 'var(--background-secondary)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/20">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Memory</h1>
            <p className="text-sm text-gray-400">Legacy memory system (deprecated)</p>
          </div>
        </div>
      </div>

      {/* Deprecation Notice */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-amber-500/10 border border-amber-500/30">
            <BookOpen className="w-8 h-8 text-amber-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            This page is deprecated
          </h2>
          
          <p className="text-gray-400 mb-6">
            The Memory page has been replaced by the Knowledge page (Obsidian vault). 
            All memory is now stored in the portable Obsidian vault that syncs to GitHub.
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
            <p className="text-amber-200 text-sm font-medium mb-2">
              Why the change?
            </p>
            <ul className="text-gray-300 text-sm text-left space-y-2">
              <li>✅ Persists forever (not wiped on reinstall)</li>
              <li>✅ Portable (git clone to new machine)</li>
              <li>✅ Auto-syncs to GitHub</li>
              <li>✅ Layer 4 of our memory system</li>
            </ul>
          </div>
          
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
          >
            <span>Go to Knowledge Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}