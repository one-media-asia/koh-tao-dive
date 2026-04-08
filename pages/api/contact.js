
import { applyCors, handleOptions } from './_lib/cors';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (handleOptions(req, res)) return;
  applyCors(res);

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Send email using Resend API
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      res.status(500).json({ error: 'Missing RESEND_API_KEY' });
      return;
    }

    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'bookings@divinginasia.com';
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@divinginasia.com',
        to: [toEmail],
        subject: `Contact Form Submission from ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('Resend API error:', error);
      res.status(500).json({ error: error.error || 'Failed to send email' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
