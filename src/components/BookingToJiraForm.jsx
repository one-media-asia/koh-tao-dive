import React, { useState } from 'react';

const BookingToJiraForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    bookingDetails: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      const res = await fetch('/api/create-jira-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('Booking sent to Jira!');
        setForm({ name: '', email: '', bookingDetails: '' });
      } else {
        setStatus('Failed to send booking.');
      }
    } catch (err) {
      setStatus('Error sending booking.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Book & Send to Jira</h2>
      <label>
        Name:
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Email:
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <br />
      <label>
        Booking Details:
        <textarea name="bookingDetails" value={form.bookingDetails} onChange={handleChange} required />
      </label>
      <br />
      <button type="submit">Submit</button>
      <div>{status}</div>
    </form>
  );
};

export default BookingToJiraForm;
