import React, { useState } from 'react';

const coursePrices: Record<string, string> = {
  'Open Water': '฿14,900',
  'Advanced Open Water': '฿12,900',
  'Rescue Diver': '฿13,900',
  'Divemaster': '฿35,000',
  'Fun Dive': '฿2,500',
};

const BookingModalWeb3Forms: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState('');
  const price = coursePrices[course] || '';
  const deposit = price ? `฿${Math.round(parseInt(price.replace(/[^\d]/g, ''), 10) * 0.2)}` : '';

  return (
    <>
      <button style={{background:'#0070ba',color:'#fff',padding:'0.75rem 1.5rem',border:'none',borderRadius:4,fontSize:'1rem',cursor:'pointer'}} onClick={() => setOpen(true)}>
        Book Now
      </button>
      {open && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:'2rem',borderRadius:8,maxWidth:400,width:'100%',position:'relative'}}>
            <button onClick={() => setOpen(false)} style={{position:'absolute',top:8,right:8,fontSize:'1.5rem',background:'none',border:'none',cursor:'pointer'}}>&times;</button>
            <div style={{textAlign:'center',marginBottom:'1rem'}}>
              <img src="/images/logo.png" alt="Diving In Asia Logo" style={{maxWidth:180,height:'auto'}} />
            </div>
            <h2 style={{textAlign:'center'}}>Booking / Inquiry Form</h2>
            <form action="https://api.web3forms.com/submit" method="POST" style={{marginTop:'1rem'}}>
              <input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
              <input type="hidden" name="subject" value="New Booking Inquiry from Website" />
              <input type="hidden" name="redirect" value="https://www.divinginasia.com/thank-you.html" />
              <label>Name<input type="text" name="name" required /></label>
              <label>Course
                <select name="course_title" value={course} onChange={e => setCourse(e.target.value)} required>
                  <option value="">Select...</option>
                  {Object.keys(coursePrices).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              {price && (
                <div style={{margin:'1rem 0'}}>
                  <strong>Price:</strong> {price}<br />
                  <strong>20% Deposit:</strong> {deposit}<br />
                  <a href={`https://paypal.me/prodivingasia/${deposit.replace('฿','')}THB`} target="_blank" rel="noopener noreferrer">Pay 20% Deposit via PayPal</a>
                </div>
              )}
              <label>Email<input type="email" name="email" required /></label>
              <label>Phone<input type="text" name="phone" /></label>
              <label>Accommodation Type
                <select name="accommodation_type">
                  <option value="">Select...</option>
                  <option value="standard">Standard Room</option>
                  <option value="deluxe">Deluxe Room</option>
                  <option value="suite">Suite</option>
                  <option value="other">Other / Not sure</option>
                </select>
              </label>
              <label>Arrival Date<input type="date" name="arrival_date" /></label>
              <label>Diving Experience
                <select name="diving_experience">
                  <option value="">Select...</option>
                  <option value="none">No diving experience</option>
                  <option value="beginner">Beginner (1-10 dives)</option>
                  <option value="intermediate">Intermediate (10-50 dives)</option>
                  <option value="advanced">Advanced (50+ dives)</option>
                  <option value="professional">Professional diver</option>
                </select>
              </label>
              <label>Comments / Questions
                <textarea name="message" rows={3} placeholder="Let us know any special requests, questions, or details..."></textarea>
              </label>
              <button type="submit" style={{marginTop:'1.5rem',background:'#0070ba',color:'#fff',padding:'0.75rem 1.5rem',border:'none',borderRadius:4,fontSize:'1rem',cursor:'pointer'}}>Submit Booking</button>
              <div style={{textAlign:'center',marginTop:'2rem',color:'#555',fontSize:'1rem'}}>— Diving In Asia Team —</div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingModalWeb3Forms;
