import React, { useState, useEffect, Fragment } from 'react';
import jsPDF from 'jspdf';
import { PageManager } from '@/components/PageManager';
import AdminEmails from '@/components/AdminEmails';
import AdminVouchers from '@/components/AdminVouchers';
import AmountTabs from '@/components/AmountTabs';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAmountsModal, setShowAmountsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoading(true);
      fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings')
        .then(res => res.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        });
    }
  }, [activeTab]);

  return (
    <>
      {/* Admin Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('bookings')}
        >Bookings</button>
        <button
          className={`px-3 py-1 rounded ${activeTab === 'pages' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveTab('pages')}
        >Pages</button>
        {/* Add more tabs as needed */}
      </div>
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      {/* Bookings Table */}
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
                  <th className="p-1" style={{ minWidth: 50 }}>Finance</th>
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
                    <td className="p-1" style={{ color: '#0a0', fontWeight: 500 }}>{booking.deposit_amount !== undefined && booking.deposit_amount !== null ? `฿${booking.deposit_amount}` : ''}</td>
                    <td className="p-1" style={{ color: '#00a', fontWeight: 500 }}>{booking.total_amount !== undefined && booking.total_amount !== null ? `฿${booking.total_amount}` : ''}</td>
                    <td className="p-1" style={{ color: '#a00', fontWeight: 500 }}>{booking.due_amount !== undefined && booking.due_amount !== null ? `฿${booking.due_amount}` : ''}</td>
                    <td className="p-1">
                      <button
                        className="bg-yellow-600 text-white px-2 py-0.5 rounded hover:bg-yellow-700"
                        style={{ fontSize: '0.8rem', minWidth: 60 }}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowAmountsModal(true);
                        }}
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Amounts Modal with Tabs */}
      {showAmountsModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
              onClick={() => setShowAmountsModal(false)}
              aria-label="Close"
            >×</button>
            <h3 className="text-lg font-bold mb-4">Finance</h3>
            <AmountTabs
              deposit={selectedBooking.deposit_amount || 0}
              total={selectedBooking.total_amount || 0}
              due={selectedBooking.due_amount || 0}
              paid={selectedBooking.paid_amount || 0}
              onAmountChange={async (field, value) => {
                setSelectedBooking(prev => prev ? { ...prev, [`${field}_amount`]: value } : prev);
                setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, [`${field}_amount`]: value } : b));
                // Persist to backend
                await fetch('https://koh-tao-dive-dreams.vercel.app/api/bookings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: selectedBooking.id,
                    [`${field}_amount`]: value
                  })
                });
              }}
            />
            <div className="flex gap-2 mt-6 justify-center">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                style={{ fontSize: '0.9rem' }}
                onClick={() => {
                  const amount = selectedBooking.paypalAmount !== undefined ? selectedBooking.paypalAmount : selectedBooking.total_payable_now;
                  const isNumber = !isNaN(parseFloat(amount)) && isFinite(amount);
                  const paypalUrl = isNumber && parseFloat(amount) > 0
                    ? `https://paypal.me/prodivingasia/${parseFloat(amount).toFixed(2)}`
                    : 'https://paypal.me/prodivingasia';
                  window.open(paypalUrl, '_blank');
                }}
              >Pay with PayPal</button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                style={{ fontSize: '0.9rem' }}
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(18);
                  doc.text('Dive Booking Invoice', 20, 20);
                  doc.setFontSize(12);
                  doc.text(`Name: ${selectedBooking.name || ''}`, 20, 40);
                  doc.text(`Email: ${selectedBooking.email || ''}`, 20, 50);
                  doc.text(`Course: ${selectedBooking.course_title || ''}`, 20, 60);
                  let amountText = '';
                  if (typeof selectedBooking.total_payable_now === 'number') {
                    amountText = `฿${selectedBooking.total_payable_now.toFixed(2)}`;
                  } else if (typeof selectedBooking.total_payable_now === 'string') {
                    amountText = selectedBooking.total_payable_now;
                  } else {
                    amountText = 'N/A';
                  }
                  doc.text(`Amount: ${amountText}`, 20, 70);
                  doc.text(`Date: ${selectedBooking.created_at ? new Date(selectedBooking.created_at).toLocaleString() : ''}`, 20, 80);
                  doc.text(`Booking ID: ${selectedBooking.id}`, 20, 90);
                  doc.text('Thank you for booking with us!', 20, 110);
                  doc.save(`invoice-${selectedBooking.id}.pdf`);
                }}
              >Download Invoice</button>
            </div>
          </div>
        </div>
      )}
      {/* ...other admin code... */}
    </>
  );
}

export default Admin;