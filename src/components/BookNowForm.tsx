import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';



const BookNowForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    course_title: '',
    email: '',
    phone: '',
    accommodation_type: '',
    arrival_date: '',
    diving_experience: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Send to Supabase
    const { error } = await supabase.from('bookings').insert([
      {
        name: form.name,
        course_title: form.course_title,
        email: form.email,
        phone: form.phone,
        item_type: 'web-booking',
        accommodation_type: form.accommodation_type,
        preferred_date: form.arrival_date,
        experience_level: form.diving_experience,
        message: form.message,
        status: 'new',
      },
    ]);
    if (error) {
      setError('Booking could not be saved. Please try again.');
      setLoading(false);
      return;
    }
    // Also submit to Web3Forms
    const formEl = document.createElement('form');
    formEl.action = 'https://api.web3forms.com/submit';
    formEl.method = 'POST';
    formEl.style.display = 'none';
    [
      ['access_key', 'e4c4edf6-6e35-456a-87da-b32b961b449a'],
      ['subject', 'New Booking Inquiry from Website'],
      ['redirect', 'https://divinginasia.com/thank-you.html'],
      ['name', form.name],
      ['course_title', form.course_title],
      ['email', form.email],
      ['phone', form.phone],
      ['accommodation_type', form.accommodation_type],
      ['arrival_date', form.arrival_date],
      ['diving_experience', form.diving_experience],
      ['message', form.message],
    ].forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k as string;
      input.value = v as string;
      formEl.appendChild(input);
    });
    document.body.appendChild(formEl);
    formEl.submit();
  };

  return (
    <div className="form-container" style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', padding: '2.5rem', borderRadius: 10, boxShadow: '0 2px 12px #0002' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <img src="/images/logo.png" alt="Diving In Asia Logo" style={{ maxWidth: 180, height: 'auto' }} />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Booking / Inquiry Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="name" style={{ marginBottom: 4, fontWeight: 500 }}>Name</label>
          <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="course_title" style={{ marginBottom: 4, fontWeight: 500 }}>Course</label>
          <select id="course_title" name="course_title" required value={form.course_title} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select...</option>
            <option value="Open Water">Open Water</option>
            <option value="Advanced Open Water">Advanced Open Water</option>
            <option value="Rescue Diver">Rescue Diver</option>
            <option value="Divemaster">Divemaster</option>
            <option value="Fun Dive">Fun Dive</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="email" style={{ marginBottom: 4, fontWeight: 500 }}>Email</label>
          <input type="email" id="email" name="email" required value={form.email} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="phone" style={{ marginBottom: 4, fontWeight: 500 }}>Phone</label>
          <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="accommodation_type" style={{ marginBottom: 4, fontWeight: 500 }}>Accommodation Type</label>
          <select id="accommodation_type" name="accommodation_type" value={form.accommodation_type} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select...</option>
            <option value="standard">Standard Room</option>
            <option value="deluxe">Deluxe Room</option>
            <option value="suite">Suite</option>
            <option value="other">Other / Not sure</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="arrival_date" style={{ marginBottom: 4, fontWeight: 500 }}>Arrival Date</label>
          <input type="date" id="arrival_date" name="arrival_date" value={form.arrival_date} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="diving_experience" style={{ marginBottom: 4, fontWeight: 500 }}>Diving Experience</label>
          <select id="diving_experience" name="diving_experience" value={form.diving_experience} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select...</option>
            <option value="none">No diving experience</option>
            <option value="beginner">Beginner (1-10 dives)</option>
            <option value="intermediate">Intermediate (10-50 dives)</option>
            <option value="advanced">Advanced (50+ dives)</option>
            <option value="professional">Professional diver</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="message" style={{ marginBottom: 4, fontWeight: 500 }}>Comments / Questions</label>
          <textarea id="message" name="message" rows={3} placeholder="Let us know any special requests, questions, or details..." value={form.message} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#0070ba', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', width: '100%', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookNowForm;

export default BookNowForm;
