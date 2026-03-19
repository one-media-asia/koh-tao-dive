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
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Course</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Amount</th>
            <th className="border px-2 py-1">Subtotal</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Internal</th>
              <th className="border px-2 py-1">Created</th>
              <th className="border px-2 py-1">Debug</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.id}</td>
              <td className="border px-2 py-1">{b.name}</td>
              <td className="border px-2 py-1">{b.email}</td>
              <td className="border px-2 py-1">{b.course_title}</td>
              <td className="border px-2 py-1">{b.preferred_date || '-'}</td>
              <td className="border px-2 py-1">
                {typeof b.total_payable_now === 'number' ? b.total_payable_now : '-'}
                {b.total_payable_now && b.email && (
                  <a
                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(b.email)}&item_name=Booking+${encodeURIComponent(
                      b.course_title || 'Course'
                    )}&amount=${b.total_payable_now}&currency_code=USD&custom=${b.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-600 underline"
                  >
                    PayPal Link
                  </a>
                )}
              </td>
              <td className="border px-2 py-1">{typeof b.subtotal_amount === 'number' ? b.subtotal_amount : '-'}</td>
              <td className="border px-2 py-1">
                {editingStatusId === b.id ? (
                  <>
                    <input value={statusDraft} onChange={e => setStatusDraft(e.target.value)} className="border px-1 py-0.5" placeholder="Status" />
                    <button onClick={() => handleSaveStatus(b.id)} className="ml-1 text-blue-600">Save</button>
                    <button onClick={() => setEditingStatusId(null)} className="ml-1 text-gray-600">Cancel</button>
                  </>
                ) : (
                  <>
                    {b.status}
                    <button onClick={() => handleEditStatus(b.id, b.status)} className="ml-1 text-blue-600">Edit</button>
                  </>
                )}
              </td>
              <td className="border px-2 py-1">
                {editingNotesId === b.id ? (
                  <>
                    <input value={notesDraft} onChange={e => setNotesDraft(e.target.value)} className="border px-1 py-0.5 w-32" placeholder="Admin notes" />
                    <button onClick={() => handleSaveNotes(b.id)} className="ml-1 text-blue-600">Save</button>
                    <button onClick={() => setEditingNotesId(null)} className="ml-1 text-gray-600">Cancel</button>
                  </>
                ) : (
                  <>
                    <span style={{whiteSpace: 'pre-line'}}>{b.internal_notes || ''}</span>
                    <button onClick={() => handleEditNotes(b.id, b.internal_notes || '')} className="ml-1 text-blue-600">Edit</button>
                  </>
                )}
              </td>
                <td className="border px-2 py-1">{new Date(b.created_at).toLocaleString()}</td>
                <td className="border px-2 py-1" style={{maxWidth: 200, fontSize: '0.7em', wordBreak: 'break-all'}}><pre>{JSON.stringify(b, null, 2)}</pre></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
