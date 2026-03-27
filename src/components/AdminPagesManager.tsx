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
const LOCALE_FILTERS = ['en', 'nl'] as const;
const CONTENT_FILTERS = ['hero', 'prices', 'faq'] as const;

const AdminPagesManager: React.FC = () => {
  const [data, setData] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editContentType, setEditContentType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [showIds, setShowIds] = useState(false);
  const [quickFilters, setQuickFilters] = useState<string[]>([]);
  const [recentlyEdited, setRecentlyEdited] = useState<Record<string, boolean>>({});
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newSectionKey, setNewSectionKey] = useState('');
  const [newLocale, setNewLocale] = useState<'en' | 'nl'>('en');
  const [newContentType, setNewContentType] = useState('text');
  const [newContentValue, setNewContentValue] = useState('');
  const [isAddingRow, setIsAddingRow] = useState(false);

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
    setEditContentType(row.content_type || 'text');
  };

  const handleSave = async (row: PageContentRow) => {
    if (!supabase) {
      alert('Supabase is not configured.');
      return;
    }

    const { error } = await supabase
      .from('page_content')
      .upsert(
        { ...row, content_value: editContent, content_type: editContentType || row.content_type || 'text' },
        { onConflict: 'id' }
      );
    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      setData((prev) => prev.map((r) => (r.id === row.id ? { ...r, content_value: editContent, content_type: editContentType || r.content_type } : r)));
      setRecentlyEdited((prev) => ({ ...prev, [row.id]: true }));
      setTimeout(() => {
        setRecentlyEdited((prev) => {
          const next = { ...prev };
          delete next[row.id];
          return next;
        });
      }, 2500);
      setEditingId(null);
    }
  };

  const handleAddRow = async () => {
    const page_slug = newPageSlug.trim();
    const section_key = newSectionKey.trim();
    const content_value = newContentValue;
    const content_type = (newContentType || 'text').trim() || 'text';

    if (!page_slug || !section_key) {
      alert('Please enter both Page Slug and Section Key.');
      return;
    }

    if (!supabase) {
      alert('Supabase is not configured.');
      return;
    }

    setIsAddingRow(true);

    const { data: inserted, error } = await supabase
      .from('page_content')
      .insert({
        page_slug,
        section_key,
        locale: newLocale,
        content_type,
        content_value,
      })
      .select('id,page_slug,section_key,locale,content_type,content_value,updated_at')
      .single();

    setIsAddingRow(false);

    if (error) {
      alert('Error adding row: ' + error.message);
      return;
    }

    if (inserted) {
      setData((prev) => {
        const next = [inserted as PageContentRow, ...prev];
        next.sort((a, b) => {
          const pageCmp = a.page_slug.localeCompare(b.page_slug);
          if (pageCmp !== 0) return pageCmp;
          const sectionCmp = a.section_key.localeCompare(b.section_key);
          if (sectionCmp !== 0) return sectionCmp;
          return a.locale.localeCompare(b.locale);
        });
        return next;
      });
      setRecentlyEdited((prev) => ({ ...prev, [inserted.id]: true }));
      setTimeout(() => {
        setRecentlyEdited((prev) => {
          const next = { ...prev };
          delete next[inserted.id];
          return next;
        });
      }, 2500);
      setNewSectionKey('');
      setNewContentValue('');
    }
  };

  const toggleQuickFilter = (filter: string) => {
    setQuickFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    );
  };

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return data.filter((row) => {
      const group = getPageGroup(row.page_slug);
      if (groupFilter !== 'all' && group !== groupFilter) return false;

      const selectedLocaleFilters = LOCALE_FILTERS.filter((filter) => quickFilters.includes(filter));
      if (selectedLocaleFilters.length && !selectedLocaleFilters.includes(row.locale as 'en' | 'nl')) {
        return false;
      }

      const selectedContentFilters = CONTENT_FILTERS.filter((filter) => quickFilters.includes(filter));
      if (selectedContentFilters.length) {
        const section = row.section_key.toLowerCase();
        const isHero = section.includes('hero');
        const isPrice = /(price|thb|usd|eur|amount|deposit)/i.test(section);
        const isFaq = /(faq|question|answer)/i.test(section);
        const contentMatch =
          (selectedContentFilters.includes('hero') && isHero) ||
          (selectedContentFilters.includes('prices') && isPrice) ||
          (selectedContentFilters.includes('faq') && isFaq);

        if (!contentMatch) return false;
      }

      if (!q) return true;

      return (
        row.page_slug.toLowerCase().includes(q) ||
        row.section_key.toLowerCase().includes(q) ||
        row.locale.toLowerCase().includes(q) ||
        (row.content_value || '').toLowerCase().includes(q)
      );
    });
  }, [data, groupFilter, quickFilters, searchQuery]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

      <div className="mt-2 flex flex-wrap gap-2">
        {[
          { key: 'en', label: 'EN' },
          { key: 'nl', label: 'NL' },
          { key: 'hero', label: 'hero_title' },
          { key: 'prices', label: 'prices' },
          { key: 'faq', label: 'FAQ' },
        ].map((chip) => {
          const active = quickFilters.includes(chip.key);
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => toggleQuickFilter(chip.key)}
              className={`rounded-full border px-3 py-1 text-xs ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'}`}
            >
              {chip.label}
            </button>
          );
        })}
        {quickFilters.length > 0 && (
          <button
            type="button"
            onClick={() => setQuickFilters([])}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600"
          >
            Clear chips
          </button>
        )}
      </div>

      <div className="mt-3 rounded border border-gray-200 p-3">
        <div className="mb-2 text-sm font-semibold">Add Missing Row</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          <input
            value={newPageSlug}
            onChange={(e) => setNewPageSlug(e.target.value)}
            placeholder="page slug (e.g. accommodation)"
            className="rounded border border-gray-300 px-3 py-2"
            aria-label="New row page slug"
          />
          <input
            value={newSectionKey}
            onChange={(e) => setNewSectionKey(e.target.value)}
            placeholder="section key (e.g. heroTitle)"
            className="rounded border border-gray-300 px-3 py-2"
            aria-label="New row section key"
          />
          <select
            value={newLocale}
            onChange={(e) => setNewLocale(e.target.value as 'en' | 'nl')}
            className="rounded border border-gray-300 px-3 py-2"
            aria-label="New row locale"
          >
            <option value="en">en</option>
            <option value="nl">nl</option>
          </select>
          <input
            value={newContentType}
            onChange={(e) => setNewContentType(e.target.value)}
            placeholder="content type (text)"
            className="rounded border border-gray-300 px-3 py-2"
            aria-label="New row content type"
          />
          <button
            type="button"
            onClick={handleAddRow}
            className="rounded border border-gray-300 px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isAddingRow}
          >
            {isAddingRow ? 'Adding...' : 'Add Row'}
          </button>
        </div>
        <textarea
          value={newContentValue}
          onChange={(e) => setNewContentValue(e.target.value)}
          placeholder="content value"
          className="mt-2 w-full rounded border border-gray-300 p-2"
          rows={3}
          aria-label="New row content value"
        />
      </div>

      <div className="mt-2 max-h-[70vh] overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="sticky top-0 z-20 bg-white">
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
                <td colSpan={showIds ? 7 : 6} className="sticky top-9 z-10 border border-gray-300 bg-gray-100 p-2 font-semibold">
                  {group} ({rows.length})
                </td>
              </tr>
              {rows.map((row) => (
            <tr key={row.id} className={recentlyEdited[row.id] ? 'bg-emerald-50' : ''}>
              <td className="whitespace-nowrap border border-gray-300 p-2">
                {editingId === row.id ? (
                  <>
                    <button className="mr-2 font-semibold" onClick={() => handleSave(row)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <button className="font-semibold" onClick={() => handleEdit(row)}>Edit</button>
                )}
                {recentlyEdited[row.id] && <span className="ml-2 text-xs text-emerald-700">Edited</span>}
              </td>
              <td className="border border-gray-300 p-2">{row.page_slug}</td>
              <td className="border border-gray-300 p-2">{row.section_key}</td>
              <td className="border border-gray-300 p-2">{row.locale}</td>
              <td className="border border-gray-300 p-2">
                {editingId === row.id ? (
                  <input
                    value={editContentType}
                    onChange={(e) => setEditContentType(e.target.value)}
                    className="w-full rounded border border-gray-300 p-1 text-sm"
                    placeholder="text"
                  />
                ) : (
                  row.content_type || 'text'
                )}
              </td>
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
