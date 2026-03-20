
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
  const [statusUpdating, setStatusUpdating] = useState<{[id: string]: boolean}>({});

  // Function to handle status change and update local state
  async function handleSaveStatus(id: string, newStatus: string) {
    setStatusUpdating(s => ({ ...s, [id]: true }));
    try {
      const res = await fetch('/api/booking_inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (e) {
      alert('Error updating status: ' + (e instanceof Error ? e.message : e));
    } finally {
      setStatusUpdating(s => ({ ...s, [id]: false }));
    }
  }
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalBookingId, setModalBookingId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [showFinanceModal, setShowFinanceModal] = useState(false);
  const [financeBooking, setFinanceBooking] = useState<Booking | null>(null);

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

  // Removed unused notes/status edit functions (now handled inline)
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
      const res = await fetch(`/api/bookings/${modalBookingId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internal_notes: commentDraft }),
      });
      if (!res.ok) {
        let errorMsg = res.status;
        try {
          const result = await res.json();
          errorMsg = result.error || errorMsg;
        } catch {}
        alert('Failed to save comment: ' + errorMsg);
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
  const handleOpenFinance = (booking: Booking) => {
    setFinanceBooking(booking);
    setShowFinanceModal(true);
  };
  const handleCloseFinance = () => {
    setShowFinanceModal(false);
    setFinanceBooking(null);
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
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Finance</th>
            <th className="border px-2 py-1">PayPal</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            let rowClass = '';
            if (b.status === 'pending') rowClass = 'bg-yellow-100';
            else if (b.status === 'confirmed') rowClass = 'bg-green-100';
            else if (b.status === 'deposit paid') rowClass = 'bg-blue-100';
            else if (b.status === 'fully paid') rowClass = 'bg-purple-100';
            else if (b.status === 'cancelled') rowClass = 'bg-red-100';
            else rowClass = 'bg-white';
            return (
              <tr key={b.id} className={rowClass}>
                <td className="border px-2 py-1">{b.name}</td>
                <td className="border px-2 py-1">{b.email}</td>
                <td className="border px-2 py-1">{b.phone || '-'}</td>
                <td className="border px-2 py-1">{b.course_title}</td>
                <td className="border px-2 py-1">{b.preferred_date || '-'}</td>
                <td className="border px-2 py-1">
                  <select
                    value={b.status}
                    onChange={e => handleSaveStatus(b.id, e.target.value)}
                    className="border rounded px-1 py-0.5 bg-white"
                    disabled={!!statusUpdating[b.id]}
                    aria-label="Booking status"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="deposit paid">Deposit Paid</option>
                    <option value="fully paid">Fully Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleOpenFinance(b)} className="text-blue-600 underline">Finance</button>
                </td>
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
              </tr>
            );
          })}
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
      {showFinanceModal && financeBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-2">Finance Details</h3>
            <div className="mb-2"><strong>Total:</strong> {typeof financeBooking.total_amount === 'number' ? financeBooking.total_amount : '-'}</div>
            <div className="mb-2"><strong>Deposit:</strong> {typeof financeBooking.deposit_amount === 'number' ? financeBooking.deposit_amount : '-'}</div>
            <div className="mb-4"><strong>To Be Paid:</strong> {typeof financeBooking.due_amount === 'number' ? financeBooking.due_amount : (typeof financeBooking.total_amount === 'number' && typeof financeBooking.deposit_amount === 'number' ? financeBooking.total_amount - financeBooking.deposit_amount : '-')}</div>
            <div className="flex justify-end">
              <button onClick={handleCloseFinance} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
