import React, { useEffect, useMemo, useState } from 'react';
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
  page_slug: string;
  section_key: string;
  locale: 'en' | 'nl' | string;
  content_type?: string;
  content_value: string;
  updated_at?: string;
}

const getPageGroup = (pageSlug: string) => {
  const slug = String(pageSlug || '').toLowerCase();

  if (['open-water', 'discover-scuba', 'discover-scuba-deluxe', 'scuba-diver', 'scuba-review'].includes(slug)) {
    return 'Beginner';
  }

  if (['advanced', 'rescue', 'efr'].includes(slug)) {
    return 'Advanced';
  }

  if (['divemaster', 'instructor', 'msdt-program'].includes(slug)) {
    return 'Professional';
  }

  if (slug.startsWith('specialty/')) {
    return 'Specialties';
  }

  if (slug.startsWith('dive-sites/')) {
    return 'Dive Sites';
  }

  if (slug.startsWith('marine-life/')) {
    return 'Marine Life';
  }

  if (['home', 'contact', 'accommodation', 'koh-tao-info', 'how-to-get-here', 'things-to-do', 'weather'].includes(slug)) {
    return 'Info';
  }

  return 'Other';
};

const GROUP_ORDER = ['Beginner', 'Advanced', 'Professional', 'Specialties', 'Dive Sites', 'Marine Life', 'Info', 'Other'];

const AdminPagesManager: React.FC = () => {
  const [data, setData] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [showIds, setShowIds] = useState(false);

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
        .select('id,page_slug,section_key,locale,content_type,content_value,updated_at')
        .order('page_slug', { ascending: true })
        .order('section_key', { ascending: true })
        .order('locale', { ascending: true });
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
    setEditContent(row.content_value);
  };

  const handleSave = async (row: PageContentRow) => {
    if (!supabase) {
      alert('Supabase is not configured.');
      return;
    }

    const { error } = await supabase
      .from('page_content')
      .update({ content_value: editContent })
      .eq('id', row.id);
    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      setData((prev) => prev.map((r) => (r.id === row.id ? { ...r, content_value: editContent } : r)));
      setEditingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      const group = getPageGroup(row.page_slug);
      if (groupFilter !== 'all' && group !== groupFilter) return false;

      if (!q) return true;

      return (
        row.page_slug.toLowerCase().includes(q) ||
        row.section_key.toLowerCase().includes(q) ||
        row.locale.toLowerCase().includes(q) ||
        (row.content_value || '').toLowerCase().includes(q)
      );
    });
  }, [data, groupFilter, searchQuery]);

  const groupedRows = useMemo(() => {
    const grouped = new Map<string, PageContentRow[]>();

    filteredRows.forEach((row) => {
      const group = getPageGroup(row.page_slug);
      if (!grouped.has(group)) grouped.set(group, []);
      grouped.get(group)!.push(row);
    });

    return GROUP_ORDER
      .map((group) => [group, grouped.get(group) || []] as const)
      .filter(([, rows]) => rows.length > 0);
  }, [filteredRows]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Pages Manager</h1>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search page, section, locale, or content"
          className="min-w-[280px] flex-1 rounded border border-gray-300 px-3 py-2"
          aria-label="Search page rows"
        />

        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2"
          aria-label="Filter by section"
        >
          <option value="all">All Sections</option>
          {GROUP_ORDER.map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showIds} onChange={(e) => setShowIds(e.target.checked)} />
          Show UUID
        </label>
      </div>

      <div className="mt-2 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-left">Actions</th>
            <th className="border border-gray-300 p-2 text-left">Page</th>
            <th className="border border-gray-300 p-2 text-left">Section Key</th>
            <th className="border border-gray-300 p-2 text-left">Locale</th>
            <th className="border border-gray-300 p-2 text-left">Type</th>
            <th className="border border-gray-300 p-2 text-left">Content</th>
            {showIds && <th className="border border-gray-300 p-2 text-left">ID</th>}
          </tr>
        </thead>
        <tbody>
          {groupedRows.map(([group, rows]) => (
            <React.Fragment key={group}>
              <tr className="bg-gray-100">
                <td colSpan={showIds ? 7 : 6} className="border border-gray-300 p-2 font-semibold">
                  {group} ({rows.length})
                </td>
              </tr>
              {rows.map((row) => (
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
              <td className="border border-gray-300 p-2">{row.page_slug}</td>
              <td className="border border-gray-300 p-2">{row.section_key}</td>
              <td className="border border-gray-300 p-2">{row.locale}</td>
              <td className="border border-gray-300 p-2">{row.content_type || 'text'}</td>
              <td className="border border-gray-300 p-2">
                {editingId === row.id ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full rounded border border-gray-300 p-2"
                    aria-label={`Edit content for ${row.page_slug} ${row.section_key} ${row.locale}`}
                    placeholder="Edit content"
                  />
                ) : (
                  row.content_value
                )}
              </td>
              {showIds && <td className="border border-gray-300 p-2 text-xs text-muted-foreground">{row.id}</td>}
            </tr>
          ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {groupedRows.length === 0 && (
        <div className="py-6 text-sm text-gray-500">No rows match your current filters.</div>
      )}
      </div>
    </div>
  );
};

export default AdminPagesManager;
