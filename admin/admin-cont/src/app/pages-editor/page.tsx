"use client";
// Simple Pages Editor for Admin Panel
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';


// The structure for a dive site page (example: Sail Rock)
type DiveSitePage = {
  id: string;
  slug: string;
  title: string;
  content: {
    overview: string;
    quickFacts: string[];
    whatYouCanSee: string;
    marineLifeHighlights: string[];
    divingTips: string;
  };
};


export default function PagesEditor() {
  const [pages, setPages] = useState<DiveSitePage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<DiveSitePage['content'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch pages from Supabase on mount
  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('dive_site_pages')
        .select('*');
      if (error) {
        setError('Failed to fetch pages: ' + error.message);
      } else {
        console.log('Fetched pages from Supabase:', data);
        setPages(data || []);
      }
      setLoading(false);
    };
    fetchPages();
  }, []);

  const handleEdit = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (page) {
      setSelectedId(id);
      setEditContent(page.content);
    }
  };


  const handleSave = async () => {
    if (!selectedId || !editContent) return;
    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase
      .from('dive_site_pages')
      .update({ content: editContent })
      .eq('id', selectedId);
    if (updateError) {
      setError('Failed to save: ' + updateError.message);
    } else {
      setPages((prev) =>
        prev.map((p) =>
          p.id === selectedId ? { ...p, content: editContent } : p
        )
      );
      setSelectedId(null);
      setEditContent(null);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <header className="bg-white shadow mb-10">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-blue-700">Admin Pages Editor</h1>
          <span className="text-sm text-gray-400">Simple CMS</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pages List */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-blue-800">Pages</h2>
            {loading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between border border-blue-100">
                  <div>
                    <div className="font-medium text-lg text-gray-800">{page.title}</div>
                    <div className="text-xs text-gray-400 truncate max-w-xs">{page.content?.overview}</div>
                  </div>
                  <button
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    onClick={() => handleEdit(page.id)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Editor */}
          <div>
            {selectedId !== null && editContent ? (
              <div className="bg-white rounded-lg shadow p-6 border border-green-200">
                <h2 className="font-semibold text-green-700 mb-2">Edit Content</h2>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Overview</label>
                  <textarea
                    className="w-full border border-green-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-200"
                    rows={3}
                    value={editContent.overview}
                    onChange={(e) => setEditContent({ ...editContent, overview: e.target.value })}
                    placeholder="Overview of the dive site"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Quick Facts (comma separated)</label>
                  <input
                    className="w-full border border-green-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-200"
                    value={editContent.quickFacts.join(', ')}
                    onChange={(e) => setEditContent({ ...editContent, quickFacts: e.target.value.split(',').map(f => f.trim()) })}
                    placeholder="e.g. Max depth, Visibility, Level"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">What You Can See</label>
                  <textarea
                    className="w-full border border-green-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-200"
                    rows={2}
                    value={editContent.whatYouCanSee}
                    onChange={(e) => setEditContent({ ...editContent, whatYouCanSee: e.target.value })}
                    placeholder="Describe what divers can see"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Marine Life Highlights (comma separated)</label>
                  <input
                    className="w-full border border-green-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-200"
                    value={editContent.marineLifeHighlights.join(', ')}
                    onChange={(e) => setEditContent({ ...editContent, marineLifeHighlights: e.target.value.split(',').map(f => f.trim()) })}
                    placeholder="e.g. Whale shark, Barracuda, Turtle"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Diving Tips</label>
                  <textarea
                    className="w-full border border-green-300 rounded p-2 mb-2 focus:ring-2 focus:ring-green-200"
                    rows={2}
                    value={editContent.divingTips}
                    onChange={(e) => setEditContent({ ...editContent, divingTips: e.target.value })}
                    placeholder="Tips for diving this site"
                  />
                </div>
                <button
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition font-semibold disabled:opacity-50"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => { setSelectedId(null); setEditContent(null); }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 italic">Select a page to edit</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
