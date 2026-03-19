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
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState('');

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
            <th className="border px-2 py-1">Actions</th>
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
                <button onClick={() => setShowDetails(show => ({...show, [b.id]: !show[b.id]}))} className="ml-2 text-gray-600">Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
