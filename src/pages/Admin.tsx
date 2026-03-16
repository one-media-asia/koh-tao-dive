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
      supabase
        .from('bookings')
        .select('*')
        .then(({ data, error }) => {
          setBookings(data || []);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const handleNoteChange = async (id, value) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, notes: value } : b));
    await supabase
      .from('bookings')
      .update({ notes: value })
      .eq('id', id);
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
            <table className="w-full mb-6">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.name}</td>
                    <td>{booking.email}</td>
                    <td>{booking.course_title || booking.course}</td>
                    <td>{booking.preferred_date || booking.date}</td>
                    <td>{booking.status}</td>
                    <td>
                      <textarea
                        value={booking.notes || ''}
                        onChange={e => handleNoteChange(booking.id, e.target.value)}
                        className="border rounded p-2 w-full"
                        rows={2}
                        placeholder="Add notes/comments..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;