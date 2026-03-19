// AdminBookings.tsx
// Clean admin bookings table: shows Name, Email, Phone, Course, Date, Total, Deposit, To Be Paid, PayPal link.
// To add more columns or features, edit below. For comments or notes, add a new column and input logic as needed.

import React, { useEffect, useState } from 'react';

interface Booking {
  total_payable_now?: number | null;
  subtotal_amount?: number | null;
  id: string;
  name: string;
  email: string;
  course_title: string;
  preferred_date?: string;
  status: string;
  internal_notes?: string;
  created_at: string;
  phone?: string;
  deposit_amount?: number | null;
  total_amount?: number | null;
  due_amount?: number | null;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBookingId, setModalBookingId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');

  useEffect(() => {
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
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleEditNotes = (id: string, internal_notes: string = '') => {
    setEditingNotesId(id);
    setNotesDraft(internal_notes);
  };
  const handleSaveNotes = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internal_notes: notesDraft }),
    });
    setEditingNotesId(null);
    setNotesDraft('');
    setBookings((prev) => prev.map(b => b.id === id ? { ...b, internal_notes: notesDraft } : b));
  };
  const handleEditStatus = (id: string, status: string) => {
    setEditingStatusId(id);
    setStatusDraft(status);
  };
  const handleSaveStatus = async (id: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusDraft }),
    });
    setEditingStatusId(null);
    setStatusDraft('');
    setBookings((prev) => prev.map(b => b.id === id ? { ...b, status: statusDraft } : b));
  };
  const handleOpenModal = (id: string) => {
    setModalBookingId(id);
    setShowModal(true);
    setCommentDraft('');
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalBookingId(null);
    setCommentDraft('');
  };
  const handleSaveComment = async () => {
    if (!modalBookingId) return;
    try {
      const res = await fetch(`/api/bookings/${modalBookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: commentDraft }),
      });
      if (!res.ok) {
        const result = await res.json();
        alert('Failed to save comment: ' + (result.error || res.status));
        return;
      }
      setBookings(prev => prev.map(b => b.id === modalBookingId ? { ...b, internal_notes: commentDraft } : b));
      setShowModal(false);
      setModalBookingId(null);
      setCommentDraft('');
    } catch (err) {
      alert('Error saving comment: ' + (err?.message || err));
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Bookings</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Course</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Deposit</th>
            <th className="border px-2 py-1">To Be Paid</th>
            <th className="border px-2 py-1">PayPal</th>
            <th className="border px-2 py-1">Comments</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.name}</td>
              <td className="border px-2 py-1">{b.email}</td>
              <td className="border px-2 py-1">{b.phone || '-'}</td>
              <td className="border px-2 py-1">{b.course_title}</td>
              <td className="border px-2 py-1">{b.preferred_date || '-'}</td>
              <td className="border px-2 py-1">
                {typeof b.total_amount === 'number' ? b.total_amount : (typeof b.total_payable_now === 'number' ? b.total_payable_now : '-')}</td>
              <td className="border px-2 py-1">{typeof b.deposit_amount === 'number' ? b.deposit_amount : '-'}</td>
              <td className="border px-2 py-1">{typeof b.due_amount === 'number' ? b.due_amount : (typeof b.total_amount === 'number' && typeof b.deposit_amount === 'number' ? b.total_amount - b.deposit_amount : '-')}</td>
              <td className="border px-2 py-1">
                {(b.total_payable_now || b.deposit_amount || b.total_amount) && (
                  <a
                    href={`https://paypal.me/prodivingasia/${b.total_payable_now || b.deposit_amount || b.total_amount}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    PayPal
                  </a>
                )}
              </td>
              <td className="border px-2 py-1">
                <button onClick={() => handleOpenModal(b.id)} className="text-blue-600 underline">Add Comment</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-2">Add Comment</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={commentDraft}
              onChange={e => setCommentDraft(e.target.value)}
              placeholder="Enter your comment..."
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleCloseModal} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleSaveComment} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
