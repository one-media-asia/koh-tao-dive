import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';
const supabase = SUPABASE_URL && SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } }) : null;

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { name, email, subject, message, course, preferred_date, phone, experience_level } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Removed Supabase DB insert. Contact form will only send email, not save to DB.

    // Use Resend to send the email
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = 'bookings@prodiving.asia';
    const toEmail = 'confirmed@prodiving.asia';
    if (!resendApiKey) {
      res.status(500).json({ success: false, error: 'Resend API key not configured' });
      return;
    }
    const resend = new Resend(resendApiKey);
    const subjectLine = subject || 'Contact/Booking Form Submission';
    const textBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nCourse: ${course || ''}\nPreferred Date: ${preferred_date || ''}\nExperience Level: ${experience_level || ''}\nSubject: ${subject || ''}\nMessage:\n${message}`;
    try {
      const { error: resendError } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: subjectLine,
        reply_to: email,
        text: textBody,
      });
      if (resendError) {
        res.status(500).json({ success: false, error: resendError.message || 'Failed to send email via Resend' });
        return;
      }
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err?.message || 'Resend error' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}