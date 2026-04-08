import React, { useState } from 'react';

export default function ContactForm() {
  const [price, setPrice] = useState(0);
  const deposit = price > 0 ? Math.round(price * 0.2) : 0;
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult("");
    const form = e.target;
    const formData = new FormData(form);
    formData.set("deposit_amount", deposit);
    formData.set("full_price", price);
    // Prepare plain object for JSON
    const data = Object.fromEntries(formData.entries());

    // 1. Submit to Web3Forms
    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });
    const web3Json = await web3Res.json();

    // 2. Submit to /api/booking
    const dbRes = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const dbJson = await dbRes.json();

    if (web3Json.success && dbJson.success) {
      setResult("Form submitted and saved!");
      form.reset();
      setPrice(0);
    } else {
      setResult("Submission failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 400, margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <input type="hidden" name="access_key" value="e4c4edf6-6e35-456a-87da-b32b961b449a" />
        <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Booking / Inquiry Form</h2>

        <label style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Comments / Questions (required)</label>
        <textarea
          name="message"
          required
          placeholder="Your comments, questions, or anything you'd like to tell us..."
          style={{ minHeight: 100, marginBottom: 16, border: '2px solid #0070ba', padding: 8, fontSize: 15 }}
          autoFocus
        />

        <input type="text" name="name" required placeholder="Your Name" />
        <input type="email" name="email" required placeholder="Your Email" />

        <label>What course are you interested in?
          <input type="text" name="course_name" placeholder="e.g. Open Water, Advanced, etc." />
        </label>

        <label>How many fun dives?
          <input type="number" name="fun_dive_count" min="0" max="20" placeholder="0" />
        </label>

        <label>How long do you want to stay (nights)?
          <input type="number" name="accommodation_nights" min="0" max="30" placeholder="0" />
        </label>

        <label>Accommodation needed?
          <select name="accommodation">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label>Full Price (THB)
          <input
            type="number"
            name="full_price"
            min="0"
            placeholder="e.g. 10000"
            value={price > 0 ? price : ''}
            onChange={e => setPrice(Number(e.target.value))}
            required
          />
        </label>

        <input type="hidden" name="deposit_amount" value={deposit} />

        <div style={{ fontWeight: 500, color: '#0070ba', margin: '8px 0' }}>
          {deposit > 0 ? `Deposit (20%): ฿${deposit}` : 'Enter price to see deposit'}
        </div>

        <button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Form'}</button>
        <span style={{ color: result.includes('failed') ? 'red' : 'green', minHeight: 24 }}>{result}</span>
      </form>
      <div style={{ maxWidth: 400, margin: '1rem auto', textAlign: 'center' }}>
        <a
          href={`https://paypal.me/prodivingasia/${deposit > 0 ? deposit : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#0070ba',
            color: 'white',
            padding: '12px 32px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 18,
            textDecoration: 'none',
            marginTop: 16
          }}
        >
          Pay Deposit with PayPal
        </a>
        <div style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
          (You can pay your deposit anytime after submitting the form)
        </div>
      </div>
    </>
  );
}