// Field definitions for multi-field info pages
const PAGE_FIELDS = {
  home: [
    { key: 'about_headline', label: 'Headline' },
    { key: 'about_sites_line', label: 'Sites Line' },
    { key: 'about_map_alt', label: 'Map Alt Text' },
    { key: 'about_title', label: 'Title' },
    { key: 'about_paragraph_1', label: 'Paragraph 1' },
    { key: 'about_paragraph_2', label: 'Paragraph 2' },
  ],
  'koh-tao-info': [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'facts', label: 'Facts (one per line)' },
    { key: 'highlightsTitle', label: 'Highlights Title' },
    { key: 'highlights', label: 'Highlights (one per line)' },
  ],
  'accommodation': [
    { key: 'heroTitle', label: 'Hero Title' },
    { key: 'heroSubtitle', label: 'Hero Subtitle' },
    { key: 'roomsTitle', label: 'Rooms Title' },
    { key: 'roomsIntro', label: 'Rooms Intro' },
    { key: 'pricingNote', label: 'Pricing Note' },
    { key: 'featuresTitle', label: 'Features Title' },
    { key: 'whyStayTitle', label: 'Why Stay Title' },
    { key: 'whyStayBody', label: 'Why Stay Body' },
    { key: 'ctaTitle', label: 'CTA Title' },
    { key: 'ctaBody', label: 'CTA Body' },
    // Add more as needed
  ],
  'food-drink': [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'main', label: 'Main Content' },
  ],
  'marine-life': [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'main', label: 'Main Content' },
  ],
  'medical-services': [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'main', label: 'Main Content' },
  ],
  'fun-diving': [
    { key: 'fun_diving_hero_title', label: 'Hero Title' },
    { key: 'fun_diving_hero_subtitle', label: 'Hero Subtitle' },
    { key: 'fun_diving_overview_title', label: 'Overview Title' },
    { key: 'fun_diving_overview_body', label: 'Overview Body' },
    { key: 'fun_diving_world_class_title', label: 'World Class Title' },
    { key: 'fun_diving_world_class_body', label: 'World Class Body' },
    { key: 'fun_diving_expert_title', label: 'Expert Title' },
    { key: 'fun_diving_expert_body', label: 'Expert Body' },
    { key: 'fun_diving_marine_life_title', label: 'Marine Life Title' },
    { key: 'fun_diving_marine_life_body', label: 'Marine Life Body' },
    { key: 'fun_diving_flexible_title', label: 'Flexible Title' },
    { key: 'fun_diving_flexible_body', label: 'Flexible Body' },
    { key: 'fun_diving_ready_title', label: 'Ready Title' },
    { key: 'fun_diving_ready_body', label: 'Ready Body' },
    // Add more as needed
  ],
  'efr': [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'prerequisites', label: 'Prerequisites' },
    { key: 'what_you_learn', label: "What you'll learn (one per line)" },
    { key: 'inclusions', label: 'Inclusions (one per line)' },
    { key: 'faq', label: 'FAQ' },
    { key: 'main', label: 'Main Content' },
  ],
  'idc': [
    { key: 'title', label: 'Title' },
    { key: 'program_overview', label: 'Program Overview' },
    { key: 'prerequisites', label: 'Prerequisites' },
    { key: 'what_you_learn', label: "What you'll learn (one per line)" },
    { key: 'inclusions', label: 'Inclusions (one per line)' },
    { key: 'faq', label: 'FAQ' },
    { key: 'main', label: 'Main Content' },
  ],
};

function MultiFieldPageEditor({ pageSlug, locale, onSaveStatus }) {
  const fieldsDef = PAGE_FIELDS[pageSlug] || [{ key: 'main', label: 'Main Content' }];
  const [fields, setFields] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/get-page-content?page_slug=${pageSlug}&locale=${locale}&t=${Date.now()}`)
      .then(res => res.json())
      .then(result => {
        const data = result.content || [];
        const dbContent = {};
        data.forEach(row => {
          dbContent[row.section_key] = row.content_value;
        });
        setFields(dbContent);
      })
      .finally(() => setLoading(false));
  }, [pageSlug, locale]);

  const handleChange = (key, value) => {
    setFields(f => ({ ...f, [key]: value }));
  };

  const handleSave = async (key) => {
    onSaveStatus('Saving...');
    const plainText = (fields[key] || '').replace(/<[^>]+>/g, '');
    const res = await fetch('/api/admin-upsert-page-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_slug: pageSlug,
        locale,
        section_key: key,
        content_type: 'text',
        content_value: plainText
      })
    });
    const result = await res.json();
    onSaveStatus(res.ok ? 'Saved!' : (result.error || 'Error saving content.'));
  };

  if (loading) return <div className="text-gray-500 text-sm mb-2">Loading content...</div>;

  return (
    <div className="flex flex-col gap-4">
      {fieldsDef.map(f => (
        <div key={f.key} className="flex flex-col gap-1">
          <label className="text-xs font-medium">{f.label}</label>
          <textarea
            className="w-full min-h-[60px] border rounded p-2 text-base"
            value={fields[f.key] || ''}
            onChange={e => handleChange(f.key, e.target.value)}
            placeholder={`Edit ${f.label}...`}
          />
          <button
            className="self-end bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 mt-1"
            onClick={() => handleSave(f.key)}
          >Save {f.label}</button>
        </div>
      ))}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
// import RichTextEditor from '@/components/RichTextEditor';

const pageList = [
  { slug: 'open-water', label: 'Open Water' },
  { slug: 'advanced', label: 'Advanced' },
  { slug: 'rescue', label: 'Rescue' },
  { slug: 'divemaster', label: 'Divemaster (Pro)' },
  { slug: 'idc', label: 'Instructor Development Course (IDC) (Pro)' },
  { slug: 'scuba-diver', label: 'Scuba Diver' },
  { slug: 'discover-scuba-deluxe', label: 'Discover Scuba Deluxe' },
  { slug: 'efr', label: 'Emergency First Response (EFR)' },
  { slug: 'fun-diving', label: 'Fun Diving' },
  { slug: 'accommodation', label: 'Accommodation' },
  { slug: 'koh-tao-info', label: 'Koh Tao Info' },
  { slug: 'food-drink', label: 'Food & Drink' },
  { slug: 'medical-services', label: 'Medical Services' },
  { slug: 'marine-life', label: 'Marine Life' },
  { slug: 'home', label: 'Home/About' },
];

const COURSE_SLUGS = [
  'open-water',
  'advanced',
  'rescue',
  'divemaster',
  'idc',
  'scuba-diver',
  'discover-scuba-deluxe',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {pageList.map(page => (
              <div key={page.slug} className="border rounded p-3 flex flex-col gap-2 bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{page.label}</span>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={selectedPage === page.slug ? selectedLang : languageList[0].code}
                    onChange={e => {
                      setSelectedPage(page.slug);
                      setSelectedLang(e.target.value);
                    }}
                  >
                    {languageList.map(l => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                  <button
                    className="ml-auto bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                    onClick={() => {
                      setSelectedPage(page.slug);
                      setSelectedLang(selectedLang);
                    }}
                  >Edit</button>
                </div>
                {selectedPage === page.slug && (
                  <>
                    {/* Home/About and info pages: show all editable fields */}
                    {['home','koh-tao-info','accommodation','food-drink','marine-life','medical-services','fun-diving','efr'].includes(page.slug) ? (
                      <MultiFieldPageEditor
                        pageSlug={page.slug}
                        locale={selectedLang}
                        onSaveStatus={setPageSaveStatus}
                      />
                    ) : (
                      <>
                        {/* Course pages: show section and main content fields */}
                        {COURSE_SLUGS.includes(page.slug) && (
                          <div className="flex items-end gap-2 mb-2">
                            <div>
                              <label className="block text-xs font-medium mb-1">Section</label>
                              <select
                                className="border rounded px-2 py-1 text-xs"
                                value={selectedSection}
                                onChange={e => setSelectedSection(e.target.value)}
                                disabled={sectionKeyList.length === 0}
                              >
                                {sectionKeyList.map(key => (
                                  <option key={key} value={key}>{key}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                              onClick={() => {
                                const newKey = window.prompt('Enter new section name:');
                                if (newKey && !sectionKeyList.includes(newKey)) {
                                  setSectionKeyList(prev => [...prev, newKey]);
                                  setSelectedSection(newKey);
                                  setPageContent('');
                                }
                              }}
                            >Add Section</button>
                          </div>
                        )}
                        {pageLoading ? (
                          <div className="text-gray-500 text-sm mb-2">Loading content...</div>
                        ) : (
                          <>
                            <textarea
                              className="w-full min-h-[120px] border rounded p-2 text-base"
                              value={pageContent}
                              onChange={e => setPageContent(e.target.value)}
                              placeholder="Edit main content..."
                            />
                            <div className="flex gap-2 mt-2 justify-end">
                              <button
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                                disabled={COURSE_SLUGS.includes(page.slug) ? !selectedSection.trim() : false}
                                onClick={async () => {
                                  if (COURSE_SLUGS.includes(page.slug) && !selectedSection.trim()) {
                                    setPageSaveStatus('Section key required.');
                                    return;
                                  }
                                  setPageSaveStatus('Saving...');
                                  const plainText = pageContent.replace(/<[^>]+>/g, '');
                                  const res = await fetch('/api/admin-upsert-page-content', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      page_slug: page.slug,
                                      locale: selectedLang,
                                      section_key: COURSE_SLUGS.includes(page.slug) ? selectedSection : 'main',
                                      content_type: 'text',
                                      content_value: plainText
                                    })
                                  });
                                  const result = await res.json();
                                  setPageSaveStatus(res.ok ? 'Saved!' : (result.error || 'Error saving content.'));
                                  if (res.ok && COURSE_SLUGS.includes(page.slug) && !sectionKeyList.includes(selectedSection)) {
                                    setSectionKeyList(prev => [...prev, selectedSection]);
                                  }
                                }}
                              >Save</button>
                              {pageSaveStatus && <span className="text-xs text-gray-600 ml-2">{pageSaveStatus}</span>}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}


              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;