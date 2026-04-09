import React from 'react';

const BookNowForm: React.FC = () => (
  <div className="form-container" style={{ maxWidth: 400, margin: '2rem auto', background: '#fff', padding: '2rem', borderRadius: 8, boxShadow: '0 2px 8px #0001' }}>
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <img src="/images/logo.png" alt="Diving In Asia Logo" style={{ maxWidth: 180, height: 'auto' }} />
    </div>
    <h2 style={{ textAlign: 'center' }}>Booking / Inquiry Form</h2>
    <form action="https://api.web3forms.com/submit" method="POST">
      <input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
      <input type="hidden" name="subject" value="New Booking Inquiry from Website" />
      <input type="hidden" name="redirect" value="https://divinginasia.com/thank-you.html" />

      <label htmlFor="name">Name</label>
      <input type="text" id="name" name="name" required />

      <label htmlFor="course_title">Course</label>
      <select id="course_title" name="course_title" required>
        <option value="">Select...</option>
        <option value="Open Water">Open Water</option>
        <option value="Advanced Open Water">Advanced Open Water</option>
        <option value="Rescue Diver">Rescue Diver</option>
        <option value="Divemaster">Divemaster</option>
        <option value="Fun Dive">Fun Dive</option>
      </select>

      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" required />

      <label htmlFor="phone">Phone</label>
      <input type="text" id="phone" name="phone" />

      <label htmlFor="accommodation_type">Accommodation Type</label>
      <select id="accommodation_type" name="accommodation_type">
        <option value="">Select...</option>
        <option value="standard">Standard Room</option>
        <option value="deluxe">Deluxe Room</option>
        <option value="suite">Suite</option>
        <option value="other">Other / Not sure</option>
      </select>

      <label htmlFor="arrival_date">Arrival Date</label>
      <input type="date" id="arrival_date" name="arrival_date" />

      <label htmlFor="diving_experience">Diving Experience</label>
      <select id="diving_experience" name="diving_experience">
        <option value="">Select...</option>
        <option value="none">No diving experience</option>
        <option value="beginner">Beginner (1-10 dives)</option>
        <option value="intermediate">Intermediate (10-50 dives)</option>
        <option value="advanced">Advanced (50+ dives)</option>
        <option value="professional">Professional diver</option>
      </select>

      <label htmlFor="message">Comments / Questions</label>
      <textarea id="message" name="message" rows={3} placeholder="Let us know any special requests, questions, or details..." />

      <button type="submit" style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#0070ba', color: '#fff', border: 'none', borderRadius: 4, fontSize: '1rem', cursor: 'pointer' }}>
        Submit Booking
      </button>
    </form>
  </div>
);

export default BookNowForm;
