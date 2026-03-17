import React, { useState, useEffect, Fragment } from 'react';
import jsPDF from 'jspdf';
import { PageManager } from '@/components/PageManager';
import AdminEmails from '@/components/AdminEmails';
import AdminVouchers from '@/components/AdminVouchers';
import AmountTabs from '@/components/AmountTabs';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { addDays, format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [contentRows, setContentRows] = useState([]);
  const [contentSearch, setContentSearch] = useState('');
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalRow, setContentModalRow] = useState(null); // { id, page_slug, locale, content }
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAmountsModal, setShowAmountsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  // --- Page editing modal state ---
  const [editModal, setEditModal] = useState(null); // { page, lang } or null
  const [editContent, setEditContent] = useState('');
  const [priceModal, setPriceModal] = useState(null); // { page, lang } or null
  const [editPrice1, setEditPrice1] = useState('');
  const [editPrice2, setEditPrice2] = useState('');
  const [amenities, setAmenities] = useState([
    { key: 'photography', label: 'Photography', price: '', enabled: false },
    { key: 'lunch', label: 'Lunch', price: '', enabled: false },
    { key: 'luxury_room', label: 'Luxury Room', price: '', enabled: false },
    { key: 'tours', label: 'Tours', price: '', enabled: false },
    // Add more amenities as needed
  ]);

  const locales = {
    'en-US': enUS,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
  });

  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoading(true);
      fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings')
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        });
    }
  }, [activeTab]);

  // Optionally: Reset modal fields when opening
  useEffect(() => {
    if (editModal) setEditContent('');
  }, [editModal]);
  useEffect(() => {
    if (priceModal) {
      setEditPrice1('');
      setEditPrice2('');
    }
  }, [priceModal]);

  // Fetch current content for modal
  useEffect(() => {
    const fetchContent = async () => {
      if (editModal) {
        const { data, error } = await supabase
          .from('page_content')
          .select('content')
          .eq('page_slug', editModal.page.toLowerCase().replace(/ /g, '-'))
          .eq('locale', editModal.lang)
          .single();
        setEditContent(data?.content || '');
      }
    };
    fetchContent();
  }, [editModal]);

  useEffect(() => {
    const fetchPrices = async () => {
      if (priceModal) {
        const { data, error } = await supabase
          .from('page_prices')
          .select('price1, price2')
          .eq('page_slug', priceModal.page.toLowerCase().replace(/ /g, '-'))
          .eq('locale', priceModal.lang)
          .single();
        setEditPrice1(data?.price1 || '');
        setEditPrice2(data?.price2 || '');
      }
    };
    fetchPrices();
  }, [priceModal]);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (priceModal) {
        const { data, error } = await supabase
          .from('page_amenities')
          .select('amenity_key, price, enabled')
          .eq('page_slug', priceModal.page.toLowerCase().replace(/ /g, '-'))
          .eq('locale', priceModal.lang);
        if (data) {
          setAmenities(prev => prev.map(a => {
            const found = data.find(d => d.amenity_key === a.key);
            return found ? { ...a, price: found.price || '', enabled: !!found.enabled } : { ...a, price: '', enabled: false };
          }));
        }
      }
    };
    fetchAmenities();
  }, [priceModal]);

  // Fetch all page_content rows when Content tab is active
  useEffect(() => {
    if (activeTab === 'content') {
      supabase.from('page_content').select('*').then(({ data }) => {
        setContentRows(data || []);
      });
    }
  }, [activeTab]);

  return (
    <>
      {/* Admin Tabs */}
      <div className="flex gap-2 mb-4 sticky top-0 z-50 bg-white py-2 border-b border-gray-200 shadow-sm">
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('bookings')}
        >Bookings</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'content' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('content')}
        >Content</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'calendar' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('calendar')}
        >Calendar</button>
      </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-base font-semibold mb-2">Page Content Management</h2>
                <div className="flex gap-2 mb-2">
                  <input
                    className="border rounded px-2 py-1 flex-1"
                    placeholder="Search by page, locale, or content..."
                    value={contentSearch}
                    onChange={e => setContentSearch(e.target.value)}
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => { setContentModalRow({ id: null, page_slug: '', locale: '', content: '' }); setShowContentModal(true); }}
                  >Add New</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg mb-4" style={{ fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Page Slug</th>
                        <th className="p-2">Locale</th>
                        <th className="p-2">Content Preview</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentRows && contentRows.filter(row =>
                        row.page_slug.toLowerCase().includes(contentSearch.toLowerCase()) ||
                        row.locale.toLowerCase().includes(contentSearch.toLowerCase()) ||
                        (row.content && row.content.toLowerCase().includes(contentSearch.toLowerCase()))
                      ).map(row => (
                        <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="p-2">{row.page_slug}</td>
                          <td className="p-2">{row.locale}</td>
                          <td className="p-2" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.content?.slice(0, 60) || ''}{row.content && row.content.length > 60 ? '…' : ''}</td>
                          <td className="p-2 flex gap-2">
                            <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => { setContentModalRow(row); setShowContentModal(true); }}>Edit</button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={async () => {
                              if (window.confirm('Delete this content row?')) {
                                await supabase.from('page_content').delete().eq('id', row.id);
                                setContentRows(contentRows.filter(r => r.id !== row.id));
                              }
                            }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Modal for editing/adding content */}
                {showContentModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw] relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setShowContentModal(false)} aria-label="Close">×</button>
                      <h3 className="text-lg font-bold mb-4">{contentModalRow.id ? 'Edit' : 'Add'} Page Content</h3>
                      <div className="mb-4">
                        <label className="block mb-2 font-medium">Page Slug</label>
                        <input className="w-full border rounded p-2 mb-2" value={contentModalRow.page_slug} onChange={e => setContentModalRow({ ...contentModalRow, page_slug: e.target.value })} />
                        <label className="block mb-2 font-medium">Locale</label>
                        <input className="w-full border rounded p-2 mb-2" value={contentModalRow.locale} onChange={e => setContentModalRow({ ...contentModalRow, locale: e.target.value })} />
                        <label className="block mb-2 font-medium">Content</label>
                        <RichTextEditor value={contentModalRow.content} onChange={val => setContentModalRow({ ...contentModalRow, content: val })} placeholder="Page content..." />
                        {contentModalRow.content && (
                          <div className="mt-2 p-2 border rounded bg-gray-50">
                            <div className="text-xs text-gray-500 mb-1">Preview:</div>
                            <div dangerouslySetInnerHTML={{ __html: contentModalRow.content }} />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end mt-4">
                        <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={() => setShowContentModal(false)}>Cancel</button>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={async () => {
                          if (!contentModalRow.page_slug || !contentModalRow.locale) return alert('Page slug and locale are required');
                          if (contentModalRow.id) {
                            // Update
                            await supabase.from('page_content').update({
                              page_slug: contentModalRow.page_slug,
                              locale: contentModalRow.locale,
                              content: contentModalRow.content
                            }).eq('id', contentModalRow.id);
                          } else {
                            // Insert
                            const { data } = await supabase.from('page_content').insert({
                              page_slug: contentModalRow.page_slug,
                              locale: contentModalRow.locale,
                              content: contentModalRow.content
                            }).select();
                            if (data && data[0]) setContentRows([...contentRows, data[0]]);
                          }
                          // Refresh list
                          const { data } = await supabase.from('page_content').select('*');
                          setContentRows(data || []);
                          setShowContentModal(false);
                        }}>{contentModalRow.id ? 'Save' : 'Add'}</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {/* Bookings Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-2">
          <h2 className="text-base font-semibold mb-2">Bookings Management</h2>
          {loading ? (
            <div style={{ fontSize: '0.9rem' }}>Loading bookings...</div>
          ) : (
            <table className="w-full mb-2 border border-gray-200 rounded-lg" style={{ fontSize: '0.8rem', borderCollapse: 'collapse' }}>
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-1" style={{ minWidth: 50 }}>Name</th>
                  <th className="p-1" style={{ minWidth: 80 }}>Email</th>
                  <th className="p-1" style={{ minWidth: 60 }}>Phone</th>
                  <th className="p-1" style={{ minWidth: 80 }}>Course</th>
                  <th className="p-1" style={{ minWidth: 60 }}>Date</th>
                  <th className="p-1" style={{ minWidth: 60 }}>Exp</th>
                  <th className="p-1" style={{ minWidth: 60 }}>Msg</th>
                  <th className="p-1 text-right align-middle" style={{ width: 90, color: '#0a0' }}>Deposit</th>
                  <th className="p-1 text-right align-middle" style={{ width: 90, color: '#00a' }}>Total</th>
                  <th className="p-1 text-right align-middle" style={{ width: 90, color: '#a00' }}>Due</th>
                  <th className="p-1" style={{ minWidth: 50 }}>Finance</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-1">{booking.name}</td>
                    <td className="p-1">{booking.email}</td>
                    <td className="p-1">{booking.phone}</td>
                    <td className="p-1">{booking.course_title}</td>
                    <td className="p-1">{booking.preferred_date}</td>
                    <td className="p-1">{booking.experience_level}</td>
                    <td className="p-1">{booking.message}</td>
                    <td className="p-1 text-right align-middle" style={{ width: 90, color: '#0a0', fontWeight: 500 }}>{booking.deposit_amount !== undefined && booking.deposit_amount !== null ? `฿${booking.deposit_amount}` : ''}</td>
                    <td className="p-1 text-right align-middle" style={{ width: 90, color: '#00a', fontWeight: 500 }}>{booking.total_amount !== undefined && booking.total_amount !== null ? `฿${booking.total_amount}` : ''}</td>
                    <td className="p-1 text-right align-middle" style={{ width: 90, color: '#a00', fontWeight: 500 }}>{booking.due_amount !== undefined && booking.due_amount !== null ? `฿${booking.due_amount}` : ''}</td>
                    <td className="p-1">
                      <button
                        className="bg-yellow-600 text-white px-2 py-0.5 rounded hover:bg-yellow-700"
                        style={{ fontSize: '0.8rem', minWidth: 60 }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowAmountsModal(true);
                        }}
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pages Tab Content */}
      {activeTab === 'pages' && (
        <>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-base font-semibold mb-2">Pages Management</h2>
            <p className="text-gray-600 mb-4">Manage your site pages in English and Dutch. You can edit the full content and prices for each page.</p>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg mb-4" style={{ fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Page</th>
                    <th className="p-2">Language</th>
                    <th className="p-2">Edit Content</th>
                    <th className="p-2">Edit Prices</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example rows, replace with dynamic data */}
                  <tr>
                    <td className="p-2">Open Water</td>
                    <td className="p-2">English</td>
                    <td className="p-2"><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => setEditModal({ page: 'Open Water', lang: 'en' })}>Edit</button></td>
                    <td className="p-2"><button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => setPriceModal({ page: 'Open Water', lang: 'en' })}>Prices</button></td>
                  </tr>
                  <tr>
                    <td className="p-2">Open Water</td>
                    <td className="p-2">Dutch</td>
                    <td className="p-2"><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => setEditModal({ page: 'Open Water', lang: 'nl' })}>Edit</button></td>
                    <td className="p-2"><button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => setPriceModal({ page: 'Open Water', lang: 'nl' })}>Prices</button></td>
                  </tr>
                  <tr>
                    <td className="p-2">Advanced</td>
                    <td className="p-2">English</td>
                    <td className="p-2"><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => setEditModal({ page: 'Advanced', lang: 'en' })}>Edit</button></td>
                    <td className="p-2"><button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => setPriceModal({ page: 'Advanced', lang: 'en' })}>Prices</button></td>
                  </tr>
                  <tr>
                    <td className="p-2">Advanced</td>
                    <td className="p-2">Dutch</td>
                    <td className="p-2"><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={() => setEditModal({ page: 'Advanced', lang: 'nl' })}>Edit</button></td>
                    <td className="p-2"><button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => setPriceModal({ page: 'Advanced', lang: 'nl' })}>Prices</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm">(This is a placeholder. Connect to your real page data and editing modals for full functionality.)</p>
          </div>

          {/* Content Edit Modal */}
          {editModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[400px] max-w-[90vw] relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setEditModal(null)} aria-label="Close">×</button>
                <h3 className="text-lg font-bold mb-4">Edit Content ({editModal.page} - {editModal.lang === 'en' ? 'English' : 'Dutch'})</h3>
                <div className="mb-2 p-2 bg-gray-50 border rounded text-xs text-gray-600">
                  <div><b>Debug:</b></div>
                  <div>page_slug: <code>{editModal.page.toLowerCase().replace(/ /g, '-')}</code></div>
                  <div>locale: <code>{editModal.lang}</code></div>
                  <div>Current content: <code>{editContent ? editContent.slice(0, 100) : '(empty)'}</code></div>
                </div>
                <RichTextEditor value={editContent} onChange={setEditContent} placeholder="Page content..." />
                <div className="flex gap-2 justify-end mt-4">
                  <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={() => setEditModal(null)}>Cancel</button>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" onClick={async () => {
                    // Save to Supabase (page_content table)
                    await supabase.from('page_content').upsert({
                      page_slug: editModal.page.toLowerCase().replace(/ /g, '-'),
                      locale: editModal.lang,
                      content: editContent
                    });
                    setEditModal(null);
                  }}>Save</button>
                </div>
              </div>
            </div>
          )}

          {/* Price Edit Modal */}
          {priceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px] max-w-[90vw] relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl" onClick={() => setPriceModal(null)} aria-label="Close">×</button>
                <h3 className="text-lg font-bold mb-4">Edit Prices ({priceModal.page} - {priceModal.lang === 'en' ? 'English' : 'Dutch'})</h3>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Price 1</label>
                  <input type="number" className="w-full border rounded p-2 mb-2" placeholder="Price 1" value={editPrice1} onChange={e => setEditPrice1(e.target.value)} />
                  <label className="block mb-2 font-medium">Price 2</label>
                  <input type="number" className="w-full border rounded p-2 mb-2" placeholder="Price 2" value={editPrice2} onChange={e => setEditPrice2(e.target.value)} />
                  <div className="mt-4">
                    <div className="font-semibold mb-2">Extra Amenities</div>
                    {amenities.map((a, idx) => (
                      <div key={a.key} className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={a.enabled} onChange={e => {
                          const checked = e.target.checked;
                          setAmenities(prev => prev.map((am, i) => i === idx ? { ...am, enabled: checked } : am));
                        }} />
                        <label className="w-32 cursor-pointer" onClick={() => setAmenities(prev => prev.map((am, i) => i === idx ? { ...am, enabled: !am.enabled } : am))}>{a.label}</label>
                        <input type="number" className="border rounded p-1 flex-1" placeholder={`Price for ${a.label}`} value={a.price} onChange={e => {
                          const val = e.target.value;
                          setAmenities(prev => prev.map((am, i) => i === idx ? { ...am, price: val } : am));
                        }} disabled={!a.enabled} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600" onClick={() => setPriceModal(null)}>Cancel</button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700" onClick={async () => {
                    // Save to Supabase (page_prices table)
                    await supabase.from('page_prices').upsert({
                      page_slug: priceModal.page.toLowerCase().replace(/ /g, '-'),
                      locale: priceModal.lang,
                      price1: editPrice1,
                      price2: editPrice2
                    });
                    // Save amenities
                    for (const a of amenities) {
                      await supabase.from('page_amenities').upsert({
                        page_slug: priceModal.page.toLowerCase().replace(/ /g, '-'),
                        locale: priceModal.lang,
                        amenity_key: a.key,
                        price: a.price,
                        enabled: a.enabled
                      });
                    }
                    setPriceModal(null);
                  }}>Save</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Amounts Modal with Tabs */}
      {showAmountsModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowAmountsModal(false)}
              aria-label="Close"
            >×</button>
            <h3 className="text-lg font-bold mb-4">Finance</h3>
            <AmountTabs
              deposit={selectedBooking.deposit_amount || 0}
              total={selectedBooking.total_amount || 0}
              due={selectedBooking.due_amount || 0}
              paid={selectedBooking.paid_amount || 0}
              onAmountChange={async (field, value) => {
                setSelectedBooking(prev => prev ? { ...prev, [`${field}_amount`]: value } : prev);
                setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, [`${field}_amount`]: value } : b));
                // Persist to backend
                await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: selectedBooking.id,
                    [`${field}_amount`]: value
                  })
                });
              }}
            />
            <div className="flex gap-2 mt-6 justify-center">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                style={{ fontSize: '0.9rem' }}
                onClick={() => {
                  let amount = selectedBooking.paypalAmount !== undefined ? selectedBooking.paypalAmount : selectedBooking.total_payable_now;
                  amount = typeof amount === 'string' ? amount.replace(/[^\d.]/g, '') : amount;
                  const isNumber = !isNaN(parseFloat(amount)) && isFinite(amount);
                  const paypalUrl = isNumber && parseFloat(amount) > 0
                    ? `https://paypal.me/prodivingasia/${parseFloat(amount).toFixed(0)}`
                    : 'https://paypal.me/prodivingasia';
                  window.open(paypalUrl, '_blank');
                }}
              >Pay with PayPal</button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                style={{ fontSize: '0.9rem' }}
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(18);
                  doc.text('Dive Booking Invoice', 20, 20);
                  doc.setFontSize(12);
                  doc.text(`Name: ${selectedBooking.name || ''}`, 20, 40);
                  doc.text(`Email: ${selectedBooking.email || ''}`, 20, 50);
                  doc.text(`Course: ${selectedBooking.course_title || ''}`, 20, 60);
                  let amountText = '';
                  if (typeof selectedBooking.total_payable_now === 'number') {
                    amountText = `฿${selectedBooking.total_payable_now.toFixed(2)}`;
                  } else if (typeof selectedBooking.total_payable_now === 'string') {
                    amountText = selectedBooking.total_payable_now;
                  } else {
                    amountText = 'N/A';
                  }
                  doc.text(`Amount: ${amountText}`, 20, 70);
                  doc.text(`Date: ${selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : ''}`, 20, 80);
                  doc.text(`Booking ID: ${selectedBooking.id}`, 20, 90);
                  doc.text('Thank you for booking with us!', 20, 110);
                  doc.save(`invoice-${selectedBooking.id}.pdf`);
                }}
              >Download Invoice</button>
            </div>
          </div>
        </div>
      )}
      {/* ...other admin code... */}
    </>
  );
}

export default Admin;