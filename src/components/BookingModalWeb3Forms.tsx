import React, { useState, useEffect } from 'react';
import './BookingModalWeb3Forms.css';


const BookingModalWeb3Forms: React.FC = () => {
  const [courseTitle, setCourseTitle] = useState('');
  const [price, setPrice] = useState('');

  // Set courseTitle from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const item = params.get('item');
    setCourseTitle(item ? decodeURIComponent(item) : '');
  }, []);

  return (
     <div className="booking-form-container">
      <div className="booking-form-header">
        <img src="/images/logo.png" alt="Diving In Asia Logo" className="booking-form-logo" />
        <h2 className="booking-form-title">Booking / Inquiry Form</h2>
        <div className="booking-form-desc">Fill out the form below and we’ll get back to you soon!</div>
      </div>
      <form action="https://api.web3forms.com/submit" method="POST" className="booking-form-fields">
        <input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
        <input type="hidden" name="subject" value="New Booking Inquiry from Website" />
        <input type="hidden" name="redirect" value="https://www.divinginasia.com/thank-you.html" />
        <div className="booking-form-field">
          <label>Name</label>
          <input type="text" name="name" required placeholder="Your Name" />
        </div>
        <div className="booking-form-field">
          <label>Email</label>
          <input type="email" name="email" required placeholder="you@email.com" />
        </div>
        <div className="booking-form-field">
          <label>Phone</label>
          <input type="text" name="phone" placeholder="Phone Number" />
        </div>
        <div className="booking-form-field">
          <label>Course / Package</label>
          <input type="text" name="course_title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="Course or Package" />
        </div>
        <div className="booking-form-field">
          <label>Price</label>
          <input
            type="text"
            name="price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Price"
          />
        </div>
        <div className="booking-form-field">
          <label>Preferred Date</label>
          <input type="date" name="preferred_date" placeholder="Preferred Date" />
        </div>
        <div className="booking-form-field">
          <label>Experience Level</label>
          <select name="experience_level" title="Experience Level">
            <option value="">Select...</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="professional">Professional</option>
          </select>
        </div>
        <div className="booking-form-field">
          <label>Comments / Questions</label>
          <textarea name="message" rows={4} required placeholder="Your message or questions" />
        </div>
        <button type="submit" className="booking-form-submit">Send Booking</button>
      </form>
    </div>
  );
};

// On mount, prefill price from URL if present
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const priceParam = params.get('price');
  if (priceParam) setPrice(priceParam);
}, []);
export default BookingModalWeb3Forms;
