import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { applyCors } from '../_lib/cors.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const supabase = SUPABASE_URL && SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } })
  : null;

export default async function handler(req, res) {
  applyCors(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { type, ...payload } = req.body || {};

  if (type === 'booking') {
    // Handle new booking
    if (!supabase) {
      res.status(500).json({ error: 'Supabase not configured' });
      return;
    }
    try {
      const { data, error } = await supabase
        .from(BOOKING_TABLE)
        .insert([payload])
        .select();
      if (error) throw new Error(error.message);
      res.status(200).json({ message: 'Booking created', data });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Booking creation failed' });
    }
    return;
  }

  if (type === 'contact') {
    // Handle contact form (send email notification)
    try {
      // Configure transporter (replace with your SMTP credentials)
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || 'no-reply@divinginasia.com',
        to: process.env.CONTACT_EMAIL || 'contact@divinginasia.com',
        subject: payload.subject || 'Contact Form Submission',
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nMessage: ${payload.message}`,
        replyTo: payload.email,
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Contact received and email sent.' });
    } catch (err) {
      res.status(500).json({ error: err.message || 'Contact failed' });
    }
    return;
  }

  res.status(400).json({ error: 'Invalid type. Must be "booking" or "contact".' });
}
