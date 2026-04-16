import React, { useState } from 'react';
import BookingModal from '../components/BookingModal';

const BookingPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = async (data: any) => {
    // Simulate booking API call
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setBookingSuccess(true);
    } catch (e) {
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Book Your Dive or Course</h1>
      {!bookingSuccess ? (
        <>
          <p style={{ marginBottom: '2rem', maxWidth: 480 }}>
            Fill out the booking form below. After submitting, you will be redirected to our main booking portal for confirmation.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '1rem 2rem', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none', marginBottom: 24 }}
          >
            Open Booking Form
          </button>
          <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleBookingSubmit} />
        </>
      ) : (
        <>
          <p style={{ marginBottom: '2rem', maxWidth: 480, color: 'green', fontWeight: 600 }}>
            Booking submitted! Please continue to our main booking portal for confirmation and payment.
          </p>
          <a
            href="https://booking.divinginasia.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '1rem 2rem', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }}
          >
            Go to booking.divinginasia.com
          </a>
        </>
      )}
    </div>
  );
};

export default BookingPage;