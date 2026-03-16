import React, { useState } from 'react';
import { PageManager } from '@/components/PageManager';

// Example booking data structure
const initialBookings = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    course: 'Open Water',
    date: '2026-03-15',
    status: 'Pending',
    notes: '',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    course: 'Advanced',
    date: '2026-03-16',
    status: 'Confirmed',
    notes: '',
  },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('pages');
  const [bookings, setBookings] = useState(initialBookings);

  const handleNoteChange = (id, value) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, notes: value } : b));
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
                  <td>{booking.course}</td>
                  <td>{booking.date}</td>
                  <td>{booking.status}</td>
                  <td>
                    <textarea
                      value={booking.notes}
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
        </div>
      )}
    </div>
  );
};

export default Admin;