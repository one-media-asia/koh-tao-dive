
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
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<string | null>(null);

  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);
  const [copyResult, setCopyResult] = useState<string | null>(null);

  const calendarFeedUrl = (() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/api/bookings/calendar`;
  })();

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch bookings');
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        const initialDrafts: Record<string, string> = {};
        data.forEach((booking: Booking) => {
          initialDrafts[booking.id] = booking.status || 'pending';
        });
        setStatusDrafts(initialDrafts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const saveStatus = async (bookingId: string, explicitStatus?: string) => {
    const selectedStatus = explicitStatus || statusDrafts[bookingId];
    if (!selectedStatus) return;

    setStatusSavingId(bookingId);
    setStatusResult(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || 'Failed to update booking status');
      }

      const updatedBooking = await res.json();
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status: updatedBooking.status || selectedStatus } : booking)));
      setStatusResult(`Status updated to ${updatedBooking.status || selectedStatus}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update booking status';
      setStatusResult(message);
    } finally {
      setStatusSavingId(null);
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Bookings</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
        onClick={async () => {
          setExporting(true);
          setExportResult(null);
          try {
            const res = await fetch('/api/export-bookings-to-jira', { method: 'POST' });
            const data = await res.json();
            setExportResult(data.message || 'Export complete.');
          } catch (e) {
            setExportResult('Export failed.');
          } finally {
            setExporting(false);
          }
        }}
        disabled={exporting}
      >
        {exporting ? 'Exporting...' : 'Export to Jira'}
      </button>
      <div className="mb-4 flex gap-2">
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded"
          onClick={() => window.open(calendarFeedUrl, '_blank', 'noopener,noreferrer')}
        >
          Open Calendar Feed
        </button>
        <button
          className="px-4 py-2 bg-slate-700 text-white rounded"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(calendarFeedUrl);
              setCopyResult('Calendar feed URL copied.');
            } catch {
              setCopyResult(`Copy failed. URL: ${calendarFeedUrl}`);
            }
          }}
        >
          Copy Feed URL
        </button>
      </div>
      {exportResult && <div className="mb-4 text-green-700">{exportResult}</div>}
      {copyResult && <div className="mb-4 text-slate-700">{copyResult}</div>}
      {statusResult && <div className="mb-4 text-emerald-700">{statusResult}</div>}
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
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-2 py-1">{b.name}</td>
              <td className="border px-2 py-1">{b.email}</td>
              <td className="border px-2 py-1">{b.phone || '-'}</td>
              <td className="border px-2 py-1">{b.course_title}</td>
              <td className="border px-2 py-1">{b.preferred_date || '-'}</td>
              <td className="border px-2 py-1">
                <div className="flex items-center gap-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={statusDrafts[b.id] || b.status || 'pending'}
                    onChange={(e) => {
                      const nextStatus = e.target.value;
                      setStatusDrafts((prev) => ({ ...prev, [b.id]: nextStatus }));
                    }}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button
                    className="px-2 py-1 text-xs bg-emerald-600 text-white rounded disabled:opacity-60"
                    disabled={statusSavingId === b.id || (statusDrafts[b.id] || b.status) === b.status}
                    onClick={() => saveStatus(b.id)}
                  >
                    {statusSavingId === b.id ? 'Saving...' : 'Save'}
                  </button>
                  {b.status !== 'confirmed' && (
                    <button
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded disabled:opacity-60"
                      disabled={statusSavingId === b.id}
                      onClick={() => {
                        setStatusDrafts((prev) => ({ ...prev, [b.id]: 'confirmed' }));
                        saveStatus(b.id, 'confirmed');
                      }}
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </td>
              <td className="border px-2 py-1">
                <div><strong>Total:</strong> {typeof b.total_amount === 'number' ? b.total_amount : '-'}</div>
                <div><strong>Deposit:</strong> {typeof b.deposit_amount === 'number' ? b.deposit_amount : '-'}</div>
                <div><strong>To Be Paid:</strong> {typeof b.due_amount === 'number' ? b.due_amount : (typeof b.total_amount === 'number' && typeof b.deposit_amount === 'number' ? b.total_amount - b.deposit_amount : '-')}</div>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBookings;
