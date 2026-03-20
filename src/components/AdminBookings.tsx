
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
  // Status editing removed
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Comments and finance modal removed

  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<string | null>(null);

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

  // Comments and finance modal logic removed

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
      {exportResult && <div className="mb-4 text-green-700">{exportResult}</div>}
        const [exporting, setExporting] = useState(false);
        const [exportResult, setExportResult] = useState<string | null>(null);
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Course</th>
            <th className="border px-2 py-1">Date</th>
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
