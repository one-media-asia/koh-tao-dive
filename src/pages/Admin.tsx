import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { PageManager } from '@/components/PageManager';
import AdminEmails from '@/components/AdminEmails';
import AdminVouchers from '@/components/AdminVouchers';
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
          // Map amounts and other fields for consistency
          const mapped = (data || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            email: b.email,
            phone: b.phone,
            deposit_amount: b.deposit_amount ?? b.deposit ?? '',
            total_amount: b.total_amount ?? b.total ?? '',
            due_amount: b.due_amount ?? b.due ?? '',
            course_title: b.course_title || b.item_title || '',
            preferred_date: b.preferred_date,
            experience_level: b.experience_level,
            message: b.message,
            status: b.status || 'pending',
            created_at: b.created_at,
            internal_notes: b.internal_notes,
            paypalAmount: b.paypalAmount,
            total_payable_now: b.total_payable_now
          }));
          setBookings(mapped);
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
        .then(data => {
          const mapped = (data || []).map((b: any) => ({
            id: b.id,
            name: b.name,
            email: b.email,
            phone: b.phone,
            deposit_amount: b.deposit_amount ?? b.deposit ?? '',
            total_amount: b.total_amount ?? b.total ?? '',
            due_amount: b.due_amount ?? b.due ?? '',
            course_title: b.course_title || b.item_title || '',
            preferred_date: b.preferred_date,
            experience_level: b.experience_level,
            message: b.message,
            status: b.status || 'pending',
            created_at: b.created_at,
            internal_notes: b.internal_notes,
            paypalAmount: b.paypalAmount,
            total_payable_now: b.total_payable_now
          }));
          setBookings(mapped);
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
        <button className={`px-4 py-2 rounded ${activeTab === 'emails' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setActiveTab('emails')}>Emails</button>
        <button className={`px-4 py-2 rounded ${activeTab === 'vouchers' ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => setActiveTab('vouchers')}>Vouchers</button>
      </div>
      {activeTab === 'pages' && <PageManager />}
      {activeTab === 'emails' && <AdminEmails />}
      {activeTab === 'vouchers' && <AdminVouchers bookings={bookings} />}
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
                  <th className="p-1" style={{ minWidth: 70, color: '#0a0' }}>Deposit</th>
                  <th className="p-1" style={{ minWidth: 70, color: '#00a' }}>Total</th>
                  <th className="p-1" style={{ minWidth: 70, color: '#a00' }}>Due</th>
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
                    <td className="p-1" style={{ color: '#0a0', fontWeight: 500 }}>
                      {booking.deposit_amount !== undefined && booking.deposit_amount !== null ? `฿${booking.deposit_amount}` : ''}
                    </td>
                    <td className="p-1" style={{ color: '#00a', fontWeight: 500 }}>
                      {booking.total_amount !== undefined && booking.total_amount !== null ? `฿${booking.total_amount}` : ''}
                    </td>
                    <td className="p-1" style={{ color: '#a00', fontWeight: 500 }}>
                      {booking.due_amount !== undefined && booking.due_amount !== null ? `฿${booking.due_amount}` : ''}
                    </td>
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
                          id={`internal-notes-${booking.id}`}
                          name={`internal_notes_${booking.id}`}
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                            id={`paypal-amount-${booking.id}`}
                            name={`paypal_amount_${booking.id}`}
                            type="text"
                            value={
                              booking.paypalAmount !== undefined
                                ? booking.paypalAmount
                                : (booking.total_payable_now !== undefined ? booking.total_payable_now : '')
                            }
                            onChange={e => {
                              const val = e.target.value;
                              setBookings(bookings.map(b => b.id === booking.id ? { ...b, paypalAmount: val } : b));
                            }}
                            style={{ width: 80, fontSize: '0.8rem', marginRight: 4 }}
                          />
                        <button
                          className="bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600"
                          style={{ fontSize: '0.8rem', minWidth: 80 }}
                          onClick={() => {
                            const amount = booking.paypalAmount !== undefined ? booking.paypalAmount : booking.total_payable_now;
                            const isNumber = !isNaN(parseFloat(amount)) && isFinite(amount);
                            const paypalUrl = isNumber && parseFloat(amount) > 0
                              ? `https://paypal.me/prodivingasia/${parseFloat(amount).toFixed(2)}`
                              : 'https://paypal.me/prodivingasia';
                            window.open(paypalUrl, '_blank');
                          }}
                        >{`Pay ${booking.paypalAmount !== undefined ? booking.paypalAmount : (booking.total_payable_now !== undefined ? booking.total_payable_now : '')} with PayPal`}</button>
                      </div>
                    </td>
                    <td className="p-1">
                      <button
                        className="bg-gray-500 text-white px-2 py-0.5 rounded hover:bg-gray-600"
                        style={{ fontSize: '0.8rem', minWidth: 30 }}
                        onClick={() => {
                          const doc = new jsPDF();
                          doc.setFontSize(18);
                          doc.text('Dive Booking Invoice', 20, 20);
                          doc.setFontSize(12);
                          doc.text(`Name: ${booking.name || ''}`, 20, 40);
                          doc.text(`Email: ${booking.email || ''}`, 20, 50);
                          doc.text(`Course: ${booking.course_title || ''}`, 20, 60);
                          let amountText = '';
                          if (typeof booking.total_payable_now === 'number') {
                            amountText = `฿${booking.total_payable_now.toFixed(2)}`;
                          } else if (typeof booking.total_payable_now === 'string') {
                            amountText = booking.total_payable_now;
                          } else {
                            amountText = 'N/A';
                          }
                          doc.text(`Amount: ${amountText}`, 20, 70);
                          doc.text(`Date: ${booking.created_at ? new Date(booking.created_at).toLocaleString() : ''}`, 20, 80);
                          doc.text(`Booking ID: ${booking.id}`, 20, 90);
                          doc.text('Thank you for booking with us!', 20, 110);
                          doc.save(`invoice-${booking.id}.pdf`);
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