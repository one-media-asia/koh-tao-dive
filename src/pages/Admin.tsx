
import AdminBookings from '../components/AdminBookings';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';




// Remove static sectionKeyList, use dynamic fetching

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const isCourse = ['open-water','advanced','rescue','divemaster','scuba-diver','discover-scuba-deluxe'].includes(selectedPage);
      supabase
        .from('page_content')
        .select('content_value')
        .eq('page_slug', selectedPage)
        .eq('locale', selectedLang)
        .eq('section_key', isCourse ? selectedSection : 'main')
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
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-2">
          <AdminBookings />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded shadow p-4">Calendar view coming soon.</div>
      )}
// ...existing code...
                  <option value="">-- Select section --</option>
                  {sectionKeyList.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                  onClick={() => {
                    const newKey = window.prompt('Enter new section name:');
                    if (newKey && !sectionKeyList.includes(newKey)) {
                      setSectionKeyList(prev => [...prev, newKey]);
                      setSelectedSection(newKey);
                      setPageContent('');
                    }
                  }}
                >Add Section</button>
                {selectedSection && (
                  <button
                    type="button"
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    onClick={async () => {
                      if (!window.confirm(`Delete section "${selectedSection}"? This cannot be undone.`)) return;
                      // Remove from DB
                      await fetch('/api/admin-upsert-page-content', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          page_slug: selectedPage,
                          locale: selectedLang,
                          section_key: selectedSection,
                          content_type: 'text',
                          content_value: '' // Empty value means delete
                        })
                      });
                      setSectionKeyList(prev => prev.filter(k => k !== selectedSection));
                      setSelectedSection('');
                      setPageContent('');
                    }}
                  >Delete</button>
                )}
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
                  placeholder="Edit section content..."
                  disabled={!selectedSection}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    disabled={!selectedSection}
                    onClick={async () => {
                      if (!selectedSection) return;
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
        </div>
      )}
    </>
  );
};

export default Admin;