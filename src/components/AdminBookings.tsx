
// AdminBookings.tsx
// Clean admin bookings table: shows Name, Email, Phone, Course, Date, Total, Deposit, To Be Paid, PayPal link.
// To add more columns or features, edit below. For comments or notes, add a new column and input logic as needed.

import React, { useEffect, useState } from 'react';
import FunDiveBooking from './FunDiveBooking';
import FinanceSection from './FinanceSection';
import BookingsCalendar from './BookingsCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  bank_transfer_details?: string | null;
}

interface FinanceSettings {
  paypal_link: string;
  default_currency: string;
  bank_transfer_details: string;
}

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, string>>({});
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null);
  const [statusResult, setStatusResult] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [showFunDiveBooking, setShowFunDiveBooking] = useState(false);
  const [financeModalBooking, setFinanceModalBooking] = useState<Booking | null>(null);
  const [financeSettings, setFinanceSettings] = useState<FinanceSettings>({
    paypal_link: 'https://paypal.me/prodivingasia',
    default_currency: 'THB',
    bank_transfer_details: '',
  });
  const [noteDraft, setNoteDraft] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteResult, setNoteResult] = useState<string | null>(null);
  const [bankTransferDraft, setBankTransferDraft] = useState('');
  const [bankTransferSaving, setBankTransferSaving] = useState(false);
  const [bankTransferResult, setBankTransferResult] = useState<string | null>(null);

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

  useEffect(() => {
    fetch('/api/get-page-content?page_slug=admin-finance&locale=en')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        const rows = Array.isArray(payload?.content) ? payload.content : [];
        if (!rows.length) return;

        setFinanceSettings((prev) => {
          const next = { ...prev };
          rows.forEach((row: any) => {
            if (!row?.section_key) return;
            if (row.section_key === 'paypal_link' && row.content_value) next.paypal_link = row.content_value;
            if (row.section_key === 'default_currency' && row.content_value) next.default_currency = row.content_value;
            if (row.section_key === 'bank_transfer_details' && row.content_value) next.bank_transfer_details = row.content_value;
          });
          return next;
        });
      })
      .catch(() => {
        // Keep defaults if settings are unavailable.
      });
  }, []);

  const getPayableNow = (booking: Booking) => {
    if (typeof booking.total_payable_now === 'number' && booking.total_payable_now > 0) return booking.total_payable_now;
    if (typeof booking.deposit_amount === 'number' && booking.deposit_amount > 0) return booking.deposit_amount;
    if (typeof booking.total_amount === 'number' && booking.total_amount > 0) return booking.total_amount;
    return null;
  };

  const buildPayPalUrl = (booking: Booking) => {
    const amount = getPayableNow(booking);
    if (amount === null) return null;
    return `${financeSettings.paypal_link}/${amount}${financeSettings.default_currency}`;
  };

  useEffect(() => {
    if (!financeModalBooking) return;
    setNoteDraft(financeModalBooking.internal_notes || '');
    setNoteResult(null);
    setBankTransferDraft(financeModalBooking.bank_transfer_details || financeSettings.bank_transfer_details || '');
    setBankTransferResult(null);
  }, [financeModalBooking]);

  const saveBookingNote = async () => {
    if (!financeModalBooking) return;

    setNoteSaving(true);
    setNoteResult(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: financeModalBooking.id, internal_notes: noteDraft }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || 'Failed to save booking note');
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === financeModalBooking.id
            ? {
                ...b,
                internal_notes: noteDraft,
              }
            : b
        )
      );
      setFinanceModalBooking((prev) =>
        prev
          ? {
              ...prev,
              internal_notes: noteDraft,
            }
          : prev
      );
      setNoteResult('Note saved.');
    } catch (err) {
      setNoteResult(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setNoteSaving(false);
    }
  };

  const saveBankTransferDetails = async () => {
    if (!financeModalBooking) return;

    setBankTransferSaving(true);
    setBankTransferResult(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: financeModalBooking.id, bank_transfer_details: bankTransferDraft }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || 'Failed to save bank transfer details');
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === financeModalBooking.id
            ? {
                ...b,
                bank_transfer_details: bankTransferDraft,
              }
            : b
        )
      );
      setFinanceModalBooking((prev) =>
        prev
          ? {
              ...prev,
              bank_transfer_details: bankTransferDraft,
            }
          : prev
      );
      setBankTransferResult('Booking bank transfer details saved.');
    } catch (err) {
      setBankTransferResult(err instanceof Error ? err.message : 'Failed to save bank transfer details');
    } finally {
      setBankTransferSaving(false);
    }
  };

  const saveStatus = async (bookingId: string, explicitStatus?: string) => {
    const selectedStatus = explicitStatus || statusDrafts[bookingId];
    if (!selectedStatus) return;

    setStatusSavingId(bookingId);
    setStatusResult(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: selectedStatus }),
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
        className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded mr-4"
        onClick={() => setShowFunDiveBooking(true)}
      >
        Book a Fun Dive
      </button>
      {showFunDiveBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative z-50">
            <FunDiveBooking />
            <button
              className="absolute top-2 right-2 bg-white rounded-full shadow p-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowFunDiveBooking(false)}
              aria-label="Close Fun Dive Booking"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* View Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'table'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setView('table')}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-colors ${
            view === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
          onClick={() => setView('calendar')}
        >
          Calendar View
        </button>
      </div>

      {/* Calendar View */}
      {view === 'calendar' && <BookingsCalendar bookings={bookings} />}

      {/* Table View & Controls */}
      {view === 'table' && (
        <>
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
                <button
                  type="button"
                  onClick={() => setFinanceModalBooking(b)}
                  className="mt-2 rounded bg-slate-700 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Finance
                </button>
              </td>
              <td className="border px-2 py-1">
                {buildPayPalUrl(b) && (
                  <a
                    href={buildPayPalUrl(b) || '#'}
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

      <Dialog open={Boolean(financeModalBooking)} onOpenChange={(open) => { if (!open) setFinanceModalBooking(null); }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Individual Finance Details{financeModalBooking ? ` - ${financeModalBooking.name}` : ''}
            </DialogTitle>
          </DialogHeader>

          {financeModalBooking && (
            <div className="space-y-3 text-sm">
              {/* Finance Section Heading and Status */}
              <FinanceSection
                initialStatus={financeModalBooking.status}
                onSave={(status) => {
                  // Optionally update status in backend here
                  setBookings((prev) => prev.map((b) => b.id === financeModalBooking.id ? { ...b, status } : b));
                  setFinanceModalBooking((prev) => prev ? { ...prev, status } : prev);
                }}
              />
              <div><strong>Booking ID:</strong> {financeModalBooking.id}</div>
              <div><strong>Course:</strong> {financeModalBooking.course_title}</div>
              <div><strong>Date:</strong> {financeModalBooking.preferred_date || '-'}</div>
              <div><strong>Total:</strong> {typeof financeModalBooking.total_amount === 'number' ? financeModalBooking.total_amount : '-'}</div>
              <div><strong>Deposit:</strong> {typeof financeModalBooking.deposit_amount === 'number' ? financeModalBooking.deposit_amount : '-'}</div>
              <div><strong>Due:</strong> {typeof financeModalBooking.due_amount === 'number' ? financeModalBooking.due_amount : '-'}</div>
              <div>
                <strong>Payable now:</strong>{' '}
                {getPayableNow(financeModalBooking) !== null ? `${getPayableNow(financeModalBooking)} ${financeSettings.default_currency}` : '-'}
              </div>
              <div>
                <strong>PayPal URL:</strong>{' '}
                {buildPayPalUrl(financeModalBooking) ? (
                  <a
                    href={buildPayPalUrl(financeModalBooking) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-blue-600 underline"
                  >
                    {buildPayPalUrl(financeModalBooking)}
                  </a>
                ) : (
                  '-'
                )}
              </div>

              <div>
                <strong>Bank transfer details</strong>
                <textarea
                  value={bankTransferDraft}
                  onChange={(e) => setBankTransferDraft(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  placeholder="Bank name, account number, IBAN/SWIFT..."
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveBankTransferDetails}
                    disabled={bankTransferSaving}
                    className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bankTransferSaving ? 'Saving...' : 'Save bank details'}
                  </button>
                  {bankTransferResult ? <span className="text-xs text-slate-600">{bankTransferResult}</span> : null}
                </div>
              </div>

              <div>
                <strong>Comments / Notes</strong>
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded border border-gray-300 p-2"
                  placeholder="Add notes for this booking..."
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveBookingNote}
                    disabled={noteSaving}
                    className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {noteSaving ? 'Saving...' : 'Save note'}
                  </button>
                  {noteResult ? <span className="text-xs text-slate-600">{noteResult}</span> : null}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
};

export default AdminBookings;
