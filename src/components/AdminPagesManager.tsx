import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const cleanEnv = (value: string | undefined) =>
  String(value || '')
    .replace(/\\n/g, '')
    .trim();

const supabaseUrl =
  cleanEnv((import.meta.env.VITE_SUPABASE_URL as string | undefined)) ||
  cleanEnv(process.env.REACT_APP_SUPABASE_URL) ||
  '';
const supabaseKey =
  cleanEnv((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)) ||
  cleanEnv((import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)) ||
  cleanEnv(process.env.REACT_APP_SUPABASE_ANON_KEY) ||
  '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

interface PageContentRow {
  id: string;
  language: 'en' | 'nl';
  seo: boolean;
  dive_site?: string;
  page?: string;
  section: string;
  content: string;
}

const AdminPagesManager: React.FC = () => {
  const [data, setData] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!supabase) {
        setError('Supabase is not configured for Admin Pages Manager. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('page_content')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setData(data as PageContentRow[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEdit = (row: PageContentRow) => {
    setEditingId(row.id);
    setEditContent(row.content);
  };

  const handleSave = async (row: PageContentRow) => {
    if (!supabase) {
      alert('Supabase is not configured.');
      return;
    }

    const { error } = await supabase
      .from('page_content')
      .update({ content: editContent })
      .eq('id', row.id);
    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      setData((prev) => prev.map((r) => (r.id === row.id ? { ...r, content: editContent } : r)));
      setEditingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1>Pages Manager</h1>
      <div className="mt-2 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
            <th className="border border-gray-300 p-2 text-left">ID</th>
            <th className="border border-gray-300 p-2 text-left">Section</th>
            <th className="border border-gray-300 p-2 text-left">Language</th>
            <th className="border border-gray-300 p-2 text-left">Content</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap border border-gray-300 p-2">
                {editingId === row.id ? (
                  <>
                    <button className="mr-2 font-semibold" onClick={() => handleSave(row)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="font-semibold" onClick={() => handleEdit(row)}>Edit</button>
                )}
              </td>
              <td className="border border-gray-300 p-2">{row.id}</td>
              <td className="border border-gray-300 p-2">{row.section}</td>
              <td className="border border-gray-300 p-2">{row.language}</td>
              <td className="border border-gray-300 p-2">
                {editingId === row.id ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full rounded border border-gray-300 p-2"
                    aria-label={`Edit content for ${row.section}`}
                    placeholder="Edit content"
                  />
                ) : (
                  row.content
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminPagesManager;
