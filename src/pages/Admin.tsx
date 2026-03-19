import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// import RichTextEditor from '@/components/RichTextEditor';

const pageList = [
  { slug: 'open-water', label: 'Open Water' },
  { slug: 'advanced', label: 'Advanced' },
  { slug: 'rescue', label: 'Rescue' },
  { slug: 'divemaster', label: 'Divemaster' },
];
const languageList = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Dutch' },
];



// Remove static sectionKeyList, use dynamic fetching

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(pageList[0].slug);
  const [selectedLang, setSelectedLang] = useState(languageList[0].code);
  const [sectionKeyList, setSectionKeyList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
    // Fetch all section_keys for the selected page and language
    useEffect(() => {
      if (activeTab === 'pages') {
        supabase
          .from('page_content')
          .select('section_key')
          .eq('page_slug', selectedPage)
          .eq('locale', selectedLang)
          .then(({ data }) => {
            const keys = (data || []).map(row => row.section_key);
            setSectionKeyList(keys);
            // If the current selectedSection is not in the new list, select the first one
            if (keys.length > 0) {
              setSelectedSection(prev => keys.includes(prev) ? prev : keys[0]);
            } else {
              setSelectedSection('');
            }
          });
      }
    }, [activeTab, selectedPage, selectedLang]);
  const [pageContent, setPageContent] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [pageSaveStatus, setPageSaveStatus] = useState('');

  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoading(true);
      fetch('/api/bookings')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch bookings');
          return res.json();
        })
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err) => {
          setBookings([]);
          setLoading(false);
        });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'pages') {
      setPageLoading(true);
      setPageSaveStatus('');
      supabase
        .from('page_content')
        .select('content_value')
        .eq('page_slug', selectedPage)
        .eq('locale', selectedLang)
        .eq('section_key', selectedSection)
        .single()
        .then(({ data, error }) => {
          setPageContent(data?.content_value || '');
          setPageLoading(false);
          if (error) setPageSaveStatus('Error loading content.');
        });
    }
  }, [activeTab, selectedPage, selectedLang, selectedSection]);

  return (
    <>
      <div className="flex gap-2 mb-4 sticky top-0 z-50 bg-white py-2 border-b border-gray-200 shadow-sm">
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('bookings')}
        >Bookings</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'calendar' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('calendar')}
        >Calendar</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'pages' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('pages')}
        >Pages</button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-2">
          <h2 className="text-base font-semibold mb-2">Bookings Management</h2>
          {loading ? (
            <div style={{ fontSize: '0.9rem' }}>Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-500 text-sm">No bookings loaded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-200 rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1">Name</th>
                    <th className="p-1">Email</th>
                    <th className="p-1">Phone</th>
                    <th className="p-1">Course</th>
                    <th className="p-1">Date</th>
                    <th className="p-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-1">{b.name}</td>
                      <td className="p-1">{b.email}</td>
                      <td className="p-1">{b.phone}</td>
                      <td className="p-1">{b.course_title}</td>
                      <td className="p-1">{b.preferred_date}</td>
                      <td className="p-1">{b.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded shadow p-4">Calendar view coming soon.</div>
      )}

      {activeTab === 'pages' && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-base font-semibold mb-2">Page Content Editor</h2>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Page</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedPage}
                onChange={e => setSelectedPage(e.target.value)}
              >
                {pageList.map(p => (
                  <option key={p.slug} value={p.slug}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
              >
                {languageList.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                className="border rounded px-2 py-1"
                list="section-keys"
                value={selectedSection}
                onChange={e => {
                  const val = e.target.value;
                  // If new section, clear content
                  setSelectedSection(val);
                  if (!sectionKeyList.includes(val)) {
                    setPageContent('');
                  }
                }}
                placeholder="Type or select section key"
              />
              <datalist id="section-keys">
                {sectionKeyList.map(key => (
                  <option key={key} value={key} />
                ))}
              </datalist>
            </div>
          </div>
          {pageLoading ? (
            <div className="text-gray-500 text-sm mb-2">Loading content...</div>
          ) : (
            <>
              <textarea
                className="w-full min-h-[120px] border rounded p-2 text-base"
                value={pageContent}
                onChange={e => setPageContent(e.target.value)}
                placeholder="Edit page content..."
              />
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  disabled={!selectedSection.trim()}
                  onClick={async () => {
                    if (!selectedSection.trim()) {
                      setPageSaveStatus('Section key required.');
                      return;
                    }
                    setPageSaveStatus('Saving...');
                    const plainText = pageContent.replace(/<[^>]+>/g, '');
                    const res = await fetch('/api/admin-upsert-page-content', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        page_slug: selectedPage,
                        locale: selectedLang,
                        section_key: selectedSection,
                        content_type: 'text',
                        content_value: plainText
                      })
                    });
                    const result = await res.json();
                    setPageSaveStatus(res.ok ? 'Saved!' : (result.error || 'Error saving content.'));
                    // If new section, update sectionKeyList and select it
                    if (res.ok && !sectionKeyList.includes(selectedSection)) {
                      setSectionKeyList(prev => [...prev, selectedSection]);
                    }
                  }}
                >Save</button>
                {pageSaveStatus && <span className="text-xs text-gray-600 ml-2">{pageSaveStatus}</span>}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Admin;