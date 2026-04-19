import React from 'react';
import BookingModalWeb3Forms from '../components/BookingModalWeb3Forms';

const BookingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>Booking / Inquiry</h2>
      <p style={{ marginBottom: '2rem', maxWidth: 480 }}>
        Please use the button below to open the booking/inquiry form. Fill in your details and submit your request.
      </p>
      <BookingModalWeb3Forms />
    </div>
  );
};

export default BookingPage;
