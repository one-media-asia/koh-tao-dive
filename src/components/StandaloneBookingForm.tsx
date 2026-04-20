import React, { useState } from 'react';

const StandaloneBookingForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    course: '',
    date: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Push to DB (replace with your API endpoint)
    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    // Generate PayPal payment URL (replace with your PayPal link logic)
    const params = new URLSearchParams({
      item_name: form.course,
      amount: '100', // Replace with dynamic amount if needed
      currency_code: 'USD',
      return: window.location.origin + '/thankyou',
      custom: JSON.stringify(form),
    });
    setPaypalUrl(`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&${params.toString()}`);
    setSubmitted(true);
  };

  if (submitted && paypalUrl) {
    window.location.href = paypalUrl;
    return <div>Redirecting to PayPal...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Book Your Course</h2>
      <label className="block mb-2">Name
        <input name="name" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>
      <label className="block mb-2">Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>
      <label className="block mb-2">Course
        <input name="course" value={form.course} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>
      <label className="block mb-2">Date
        <input name="date" type="date" value={form.date} onChange={handleChange} required className="w-full border p-2 rounded" />
      </label>
      <label className="block mb-2">Notes
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border p-2 rounded" />
      </label>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Book & Pay with PayPal</button>
    </form>
  );
};

export default StandaloneBookingForm;
