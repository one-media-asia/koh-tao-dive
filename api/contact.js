import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';
const supabase = SUPABASE_URL && SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY) : null;

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

    // Save to Supabase bookings table (optional, can be removed if not needed)
    if (supabase) {
      try {
        const { error } = await supabase.from(BOOKING_TABLE).insert([
          {
            name,
            email,
            course_title: course || null,
            preferred_date: preferred_date || null,
            phone: phone || null,
            experience_level: experience_level || null,
            message,
            status: 'pending',
            created_at: new Date().toISOString(),
          }
        ]);
        if (error) {
          console.error('Supabase insert error:', error);
        }
      } catch (err) {
        console.error('Supabase insert exception:', err);
      }
    }

    // Use Nodemailer to send the email via your SMTP
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      res.status(500).json({ success: false, error: 'SMTP not configured' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const mailOptions = {
      from: smtpUser,
      to: 'contact@prodiving.asia',
      subject: subject || 'Contact/Booking Form Submission',
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nCourse: ${course || ''}\nPreferred Date: ${preferred_date || ''}\nExperience Level: ${experience_level || ''}\nSubject: ${subject || ''}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}