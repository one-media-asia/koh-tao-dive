// API route: GET /api/bookings
// Returns all bookings from Supabase


import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });



export default async function handler(req, res) {
  // CORS support for www.divinginasia.com
  res.setHeader('Access-Control-Allow-Origin', 'https://www.divinginasia.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method === 'GET') {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return res.status(500).json({ message: 'Supabase not configured' });
    }
    try {
      const { data, error } = await supabase.from(BOOKING_TABLE).select('*');
      if (error) throw new Error(error.message);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: 'Fetch failed: ' + (e.message || e) });
    }
    return;
  }


  if (req.method === 'POST') {
    // Handle new booking or status update
    const { id, status, ...bookingFields } = req.body || {};
    // SMTP logic removed; only Resend is used for notifications

    // If id and status, it's a status update
    if (id && status) {
      try {
        // Update status in Supabase
        const { data, error } = await supabase
        if (error) throw new Error(error.message);
        const booking = data && data[0];
        // Send status update email to user and admin using Resend
        if (booking && booking.email) {
          const resendApiKey = process.env.RESEND_API_KEY;
          const fromEmail = 'confirmed@prodiving.asia';
          const adminEmails = ['confirmed@prodiving.asia'];
          console.log('[DEBUG] Status change email: booking', booking);
          console.log('[DEBUG] Resend API Key present:', !!resendApiKey);
          if (resendApiKey) {
            const resend = new Resend(resendApiKey);
            const subject = `Booking Status Update: ${booking.course_title || booking.item_title || ''}`;
            const body = `Hello ${booking.name || ''},\n\nYour booking status has been updated to: ${status}.\n\nBooking Details:\nName: ${booking.name || ''}\nEmail: ${booking.email || ''}\nCourse: ${booking.course_title || booking.item_title || ''}\nPreferred Date: ${booking.preferred_date || ''}\nStatus: ${status}\n\nIf you have questions, reply to this email.`;
            try {
              const userResult = await resend.emails.send({
            const fromEmail = 'confirmed@prodiving.asia';
                to: [booking.email],
                subject,
                text: body,
              });
              console.log('[DEBUG] Sent status email to user:', userResult);
            } catch (e) {
              console.error('[DEBUG] Error sending status email to user:', e);
            }
            try {
              const adminResult = await resend.emails.send({
                from: fromEmail,
                to: adminEmails,
                subject: `Admin Notice: ${subject}`,
                text: `Booking for ${booking.name || ''} (${booking.email || ''}) status changed to: ${status}.\n\n${body}`,
              });
              console.log('[DEBUG] Sent status email to admin:', adminResult);
            } catch (e) {
              console.error('[DEBUG] Error sending status email to admin:', e);
            }
          } else {
            console.error('[DEBUG] No RESEND_API_KEY set, cannot send status change email');
          }
        }
        res.status(200).json({ status: 'ok', updated: booking });
      } catch (err) {
        res.status(500).json({ error: err.message || 'Internal error' });
      }
      return;
    }

    // Otherwise, treat as new booking
    try {
      // Insert new booking in Supabase
      const { data, error } = await supabase
        .from(BOOKING_TABLE)
        .insert([{ ...bookingFields }])
        .select();
      if (error) throw new Error(error.message);
      const booking = (data && data[0]) || {};
      const body = `New booking received\n\nName: ${booking.name || ''}\nEmail: ${booking.email || ''}\nCourse: ${booking.course_title || ''}\nPreferred Date: ${booking.preferred_date || ''}`;
      // Send notification via SMTP
      if (smtpHost && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });
        const mailOptions = {
          from: smtpUser,
          auth: { user: smtpUser, pass: smtpPass },
