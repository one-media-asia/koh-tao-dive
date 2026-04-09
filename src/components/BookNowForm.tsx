import React from 'react';


const BookNowForm: React.FC = () => (
  <div className="form-container" style={{ maxWidth: 500, margin: '2rem auto', background: '#fff', padding: '2.5rem', borderRadius: 10, boxShadow: '0 2px 12px #0002' }}>
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <img src="/images/logo.png" alt="Diving In Asia Logo" style={{ maxWidth: 180, height: 'auto' }} />
    </div>
    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Booking / Inquiry Form</h2>
    <form action="https://api.web3forms.com/submit" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      <input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
      <input type="hidden" name="subject" value="New Booking Inquiry from Website" />
      <input type="hidden" name="redirect" value="https://divinginasia.com/thank-you.html" />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="name" style={{ marginBottom: 4, fontWeight: 500 }}>Name</label>
        <input type="text" id="name" name="name" required style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="course_title" style={{ marginBottom: 4, fontWeight: 500 }}>Course</label>
        <select id="course_title" name="course_title" required style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
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
        <input type="email" id="email" name="email" required style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="phone" style={{ marginBottom: 4, fontWeight: 500 }}>Phone</label>
        <input type="text" id="phone" name="phone" style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="accommodation_type" style={{ marginBottom: 4, fontWeight: 500 }}>Accommodation Type</label>
        <select id="accommodation_type" name="accommodation_type" style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
          <option value="">Select...</option>
          <option value="standard">Standard Room</option>
          <option value="deluxe">Deluxe Room</option>
          <option value="suite">Suite</option>
          <option value="other">Other / Not sure</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="arrival_date" style={{ marginBottom: 4, fontWeight: 500 }}>Arrival Date</label>
        <input type="date" id="arrival_date" name="arrival_date" style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label htmlFor="diving_experience" style={{ marginBottom: 4, fontWeight: 500 }}>Diving Experience</label>
        <select id="diving_experience" name="diving_experience" style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}>
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
        <textarea id="message" name="message" rows={3} placeholder="Let us know any special requests, questions, or details..." style={{ width: '100%', padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }} />
      </div>

      <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#0070ba', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem', cursor: 'pointer', width: '100%' }}>
        Submit Booking
      </button>
    </form>
  </div>
);

export default BookNowForm;
