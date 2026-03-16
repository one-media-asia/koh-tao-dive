import React, { useState, useEffect } from 'react';
import { PageManager } from '@/components/PageManager';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoading(true);
      fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings')
        .then(res => res.json())
        .then(data => {
          console.log('Bookings API response:', data);
          setBookings(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Bookings API error:', err);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const handleNoteChange = async (id, value) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, internal_notes: value } : b));
  };

  const handleStatusChange = (id, value) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: value } : b));
  };

  const handleSave = async (id, internal_notes, status) => {
    try {
      const res = await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, internal_notes, status })
      });
      if (!res.ok) throw new Error('Failed to save');
    } catch (err) {
      alert('Error saving');
    }
  };
  const handleSaveStatus = async (id, status) => {
    try {
      const res = await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) throw new Error('Failed to save status');
    } catch (err) {
      alert('Error saving status');
    }
  };

  const handleSaveNote = async (id, value) => {
    try {
      const res = await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, internal_notes: value })
      });
      if (!res.ok) throw new Error('Failed to save note');
      // Optionally show a success message
    } catch (err) {
      alert('Error saving note');
    }
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-6 flex gap-4">
        <button className={`px-4 py-2 rounded ${activeTab === 'pages' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setActiveTab('pages')}>Pages</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
      </div>
      {activeTab === 'pages' && <PageManager />}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bookings Management</h2>
          {loading ? (
            <div>Loading bookings...</div>
          ) : (
            <table className="w-full mb-6 border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Course Title</th>
                  <th className="p-2">Preferred Date</th>
                  <th className="p-2">Experience Level</th>
                  <th className="p-2">Message</th>
                  <th className="p-2">Status</th>
                                    <th className="p-2">Update</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Notes</th>
                  <th className="p-2">Save</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id} className="border-t border-gray-200">
                    <td className="p-2">{booking.name}</td>
                    <td className="p-2">{booking.email}</td>
                    <td className="p-2">{booking.phone}</td>
                    <td className="p-2">{booking.course_title}</td>
                    <td className="p-2">{booking.preferred_date}</td>
                    <td className="p-2">{booking.experience_level}</td>
                    <td className="p-2">{booking.message}</td>
                    <td className="p-2">
                      <select
                        value={booking.status || 'pending'}
                        onChange={e => handleStatusChange(booking.id, e.target.value)}
                        className="border rounded p-2 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="booked">Booked</option>
                        <option value="talking">Talking</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleSave(booking.id, booking.internal_notes || '', booking.status || 'pending')}
                      >Save</button>
                    </td>
                    <td className="p-2">{booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}</td>
                    <td className="p-2">
                      <textarea
                        value={booking.internal_notes || ''}
                        onChange={e => handleNoteChange(booking.id, e.target.value)}
                        className="border rounded p-2 w-full"
                        rows={2}
                        placeholder="Add internal notes/comments..."
                      />
                    </td>
                    <td className="p-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleSave(booking.id, booking.internal_notes || '', booking.status || 'pending')}
                      >Save</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

export default Admin;