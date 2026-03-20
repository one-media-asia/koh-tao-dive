
import AdminBookings from '../components/AdminBookings';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';




// Remove static sectionKeyList, use dynamic fetching

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings' || activeTab === 'comments') {
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

  // When a booking is selected in comments tab, set draft
  useEffect(() => {
    if (activeTab === 'comments' && selectedBookingId) {
      const b = bookings.find(b => b.id === selectedBookingId);
      setCommentDraft(b?.internal_notes || '');
    }
  }, [selectedBookingId, bookings, activeTab]);

  const handleSaveComment = async () => {
    if (!selectedBookingId) return;
    setSavingComment(true);
    try {
      const res = await fetch(`/api/booking_inquiries?id=${selectedBookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: commentDraft }),
      });
      if (!res.ok) throw new Error('Failed to save comment');
      setBookings(prev => prev.map(b => b.id === selectedBookingId ? { ...b, internal_notes: commentDraft } : b));
    } catch (e) {
      alert('Error saving comment: ' + (e instanceof Error ? e.message : e));
    } finally {
      setSavingComment(false);
    }
  };

// The above button block was outside of a return statement and caused a syntax error. It is now removed. The correct button block is already present inside the return statement of the Admin component.

      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-2">
          <AdminBookings />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">Booking Calendar</h2>
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Course</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter(b => b.preferred_date)
                .sort((a, b) => (a.preferred_date > b.preferred_date ? 1 : -1))
                .map((b) => {
                  let statusClass = '';
                  if (b.status === 'confirmed') statusClass = 'bg-green-100 text-green-800 font-semibold';
                  else if (b.status === 'pending') statusClass = 'bg-yellow-100 text-yellow-800 font-semibold';
                  else if (b.status === 'talking') statusClass = 'bg-blue-100 text-blue-800 font-semibold';
                  return (
                    <tr key={b.id}>
                      <td className="border px-2 py-1">{b.preferred_date}</td>
                      <td className="border px-2 py-1">{b.name}</td>
                      <td className="border px-2 py-1">{b.course_title}</td>
                      <td className={`border px-2 py-1 ${statusClass}`}>{b.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {bookings.filter(b => !b.preferred_date).length > 0 && (
            <div className="mt-4 text-xs text-gray-500">Some bookings have no preferred date and are not shown here.</div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">Booking Comments</h2>
          <div className="flex gap-6">
            <div className="w-1/3">
              <div className="font-semibold mb-2">Select a booking:</div>
              <ul className="max-h-96 overflow-y-auto border rounded divide-y">
                {bookings.map(b => (
                  <li
                    key={b.id}
                    className={`px-2 py-1 cursor-pointer hover:bg-blue-50 ${selectedBookingId === b.id ? 'bg-blue-100 font-bold' : ''}`}
                    onClick={() => setSelectedBookingId(b.id)}
                  >
                    <div>{b.name} <span className="text-xs text-gray-500">({b.email})</span></div>
                    <div className="text-xs text-gray-500">{b.course_title} | {b.preferred_date || 'No date'}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              {selectedBookingId ? (
                <>
                  <div className="mb-2 text-sm text-gray-600">Add or update comments for this booking. Visible to all admins.</div>
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows={8}
                    value={commentDraft}
                    onChange={e => setCommentDraft(e.target.value)}
                    placeholder="Enter comments, updates, or notes..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveComment}
                      className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
                      disabled={savingComment}
                    >{savingComment ? 'Saving...' : 'Save Comment'}</button>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 mt-8">Select a booking to view or add comments.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;