import React, { useEffect, useState } from 'react';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://koh-tao-dive-dream.vercel.app/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch bookings');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{color: 'red'}}>{error}</p>;

  return (
    <div>
      <h2>Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking, idx) => (
            <li key={idx}>{JSON.stringify(booking)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Bookings;
