import React, { useState, useEffect, Fragment } from 'react';
import jsPDF from 'jspdf';
import { PageManager } from '@/components/PageManager';
import AdminEmails from '@/components/AdminEmails';
import AdminVouchers from '@/components/AdminVouchers';
import AmountTabs from '@/components/AmountTabs';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('pages');
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
      {/* Finance Modal (single, inside main return) */}
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
    {/* ...existing code... */}
  );
}

export default Admin;