import React from 'react';

const BookingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', marginTop: '2rem' }}>Boekingen worden nu afgehandeld op ons nieuwe boekingsportaal</h2>
      <p style={{ marginBottom: '2rem', maxWidth: 480 }}>
        Om een cursus, fun dive of accommodatie te boeken, gebruik onze speciale boekingssite. Deze pagina accepteert geen boekingen meer.
      </p>
      <a
        href="https://booking.divinginasia.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-block', background: '#2563eb', color: '#fff', padding: '1rem 2rem', borderRadius: 8, fontWeight: 600, fontSize: '1.1rem', textDecoration: 'none' }}
      >
        Ga naar booking.divinginasia.com
      </a>
    </div>
  );
};

export default BookingPage;
