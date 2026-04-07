import { Resend } from 'resend';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, course, preferred_date } = req.body || {};

  if (!name || !email || !course || !preferred_date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.SMTP_FROM || 'no-reply@divinginasia.com',
      to: process.env.CONTACT_RECEIVER_EMAIL || 'bookings@divinginasia.com',
      subject: 'New Booking Notification',
      text: `Name: ${name}\nEmail: ${email}\nCourse: ${course}\nPreferred Date: ${preferred_date}`,
      reply_to: email,
    });
    res.status(200).json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send notification' });
  }
}
