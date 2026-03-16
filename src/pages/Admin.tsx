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
      alert('Booking updated successfully!');
      // Refresh bookings list
      fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings')
        .then(res => res.json())
        .then(data => setBookings(data || []));
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
                  <th className="p-1" style={{ minWidth: 50 }}>Status</th>
                  <th className="p-1" style={{ minWidth: 40 }}>Upd</th>
                  <th className="p-1" style={{ minWidth: 70 }}>Created</th>
                  <th className="p-1" style={{ minWidth: 80 }}>Notes</th>
                  <th className="p-1" style={{ minWidth: 40 }}>💲</th>
                  <th className="p-1" style={{ minWidth: 40 }}>🧾</th>
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
                    <td className="p-1">
                      <select
                        value={booking.status || 'pending'}
                        onChange={e => handleStatusChange(booking.id, e.target.value)}
                        className="border rounded p-1"
                        style={{ fontSize: '0.8rem', minWidth: 40 }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="booked">Booked</option>
                        <option value="talking">Talking</option>
                      </select>
                    </td>
                    <td className="p-1">
                      <button
                        className="bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600"
                        style={{ fontSize: '0.8rem', minWidth: 30 }}
                        onClick={() => handleSave(booking.id, booking.internal_notes || '', booking.status || 'pending')}
                      >Save</button>
                    </td>
                    <td className="p-1">{booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}</td>
                    <td className="p-1">
                      <input
                        type="text"
                        value={booking.internal_notes || ''}
                        onChange={e => handleNoteChange(booking.id, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSave(booking.id, booking.internal_notes || '', booking.status || 'pending');
                          }
                        }}
                        className="border rounded p-1"
                        style={{ fontSize: '0.8rem', minWidth: 60 }}
                        placeholder="Notes"
                      />
                    </td>
                    <td className="p-1">
                      <button
                        className="bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600"
                        style={{ fontSize: '0.8rem', minWidth: 30 }}
                        onClick={() => {
                          const amount = typeof booking.total_payable_now === 'number' && booking.total_payable_now > 0
                            ? booking.total_payable_now.toFixed(2)
                            : '';
                          const paypalUrl = amount
                            ? `https://paypal.me/divinginasia/${amount}`
                            : 'https://paypal.me/divinginasia';
                          window.open(paypalUrl, '_blank');
                        }}
                      >💲</button>
                    </td>
                    <td className="p-1">
                      <button
                        className="bg-gray-500 text-white px-2 py-0.5 rounded hover:bg-gray-600"
                        style={{ fontSize: '0.8rem', minWidth: 30 }}
                        onClick={() => {
                          const amount = typeof booking.total_payable_now === 'number' ? booking.total_payable_now.toFixed(2) : '0.00';
                          const invoice = `Invoice\nName: ${booking.name}\nEmail: ${booking.email}\nCourse: ${booking.course_title}\nAmount: $${amount}\nDate: ${booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}`;
                          const blob = new Blob([invoice], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `invoice-${booking.id}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >🧾</button>
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