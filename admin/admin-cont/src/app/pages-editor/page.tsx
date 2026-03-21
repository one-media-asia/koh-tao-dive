// Simple Pages Editor for Admin Panel
import React, { useState } from 'react';

// Placeholder data structure for pages
const initialPages = [
  { id: 1, title: 'Home', content: 'Welcome to the homepage.' },
  { id: 2, title: 'About', content: 'About us content.' },
  { id: 3, title: 'Contact', content: 'Contact details here.' },
];

export default function PagesEditor() {
  const [pages, setPages] = useState(initialPages);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEdit = (id: number) => {
    const page = pages.find((p) => p.id === id);
    if (page) {
      setSelectedId(id);
      setEditContent(page.content);
    }
  };

  const handleSave = () => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === selectedId ? { ...p, content: editContent } : p
      )
    );
    setSelectedId(null);
    setEditContent('');
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Pages Editor</h1>
      <ul className="mb-8">
        {pages.map((page) => (
          <li key={page.id} className="mb-2 flex items-center justify-between">
            <span className="font-medium">{page.title}</span>
            <button
              className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => handleEdit(page.id)}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
      {selectedId !== null && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Edit Content</h2>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={6}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
