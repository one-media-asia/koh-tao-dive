import { handleOptions, applyCors } from '../_lib/cors.js';

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const BOOKING_TABLE = 'bookings';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set');
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { realtime: { enabled: false } });

const toNumberOr = (value, fallback = 0) => {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const normalizeBooking = (row = {}) => ({
  id: row.id,
  name: row.name || '',
  email: row.email || '',
  phone: row.phone || '',
  course_title: row.course_title || '',
  preferred_date: row.preferred_date || '',
  experience_level: row.experience_level || '',
  message: row.message || '',
  status: row.status || 'pending',
  internal_notes: row.internal_notes || '',
  created_at: row.created_at || '',
  deposit_amount: typeof row.deposit_amount === 'number' ? row.deposit_amount : null,
  total_amount: typeof row.total_amount === 'number' ? row.total_amount : null,
  due_amount: typeof row.due_amount === 'number' ? row.due_amount : null,
  bank_transfer_details: row.bank_transfer_details || '',
});

const sanitizePayload = (body = {}) => {
  const safeName = String(body.name || '').trim();
  const safeEmail = String(body.email || '').trim();
  return {
    name: safeName,
    email: safeEmail,
    phone: body.phone || null,
    item_type: body.item_type || null,
    course_title: body.course_title || body.item_title || 'Booking Inquiry',
    preferred_date: body.preferred_date || null,
    experience_level: body.experience_level || null,
    message: body.message || null,
    payment_choice: body.payment_choice || null,
    internal_notes: body.internal_notes || null,
    status: body.status || 'pending',
    addons: body.addons || null,
    addons_json: body.addons_json || null,
    addons_total: toNumberOr(body.addons_total, 0),
    subtotal_amount: typeof body.subtotal_amount === 'number' ? body.subtotal_amount : null,
    total_payable_now: typeof body.total_payable_now === 'number' ? body.total_payable_now : null,
    deposit_amount: typeof body.deposit_amount === 'number' ? body.deposit_amount : null,
    total_amount: typeof body.total_amount === 'number' ? body.total_amount : null,
    due_amount: typeof body.due_amount === 'number' ? body.due_amount : null,
    bank_transfer_details: body.bank_transfer_details || null,
  };
};


// Select bookings for a specific user (non-admin)
const selectBookingsForUser = async (userId) => {
  const { data, error } = await supabase
    .from(BOOKING_TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return { table: BOOKING_TABLE, rows: data || [] };
};

// Select all bookings (admin only)
const selectBookings = async () => {
  const { data, error } = await supabase
    .from(BOOKING_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);
  if (error) throw new Error(error.message);
  return { table: BOOKING_TABLE, rows: data || [] };
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
};

const hasSmtpConfig = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getResendFromCandidates = () => {
  const primary = process.env.RESEND_FROM_EMAIL || 'confirmed@divinginasia.com';
  return Array.from(new Set([primary, 'onboarding@resend.dev']));
};

const sendConfirmedEmails = async (booking) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || process.env.RESEND_BOOKING_TO_EMAIL || 'bookings@divinginasia.com';
  const subject = `Booking Confirmed: ${booking.course_title || 'Booking Inquiry'}`;
  const customerText = [
    `Hi ${booking.name || 'Customer'},`,
    '',
    'Your booking has been confirmed.',
    '',
    `Course: ${booking.course_title || 'N/A'}`,
    `Preferred Date: ${booking.preferred_date || 'N/A'}`,
    '',
    'If you have questions, just reply to this email.',
  ].join('\n');
  const adminText = [
    'A booking has been confirmed in admin.',
    '',
    `Booking ID: ${booking.id || 'N/A'}`,
    `Name: ${booking.name || 'N/A'}`,
    `Email: ${booking.email || 'N/A'}`,
    `Course: ${booking.course_title || 'N/A'}`,
    `Preferred Date: ${booking.preferred_date || 'N/A'}`,
  ].join('\n');

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);

    for (const fromEmail of getResendFromCandidates()) {
      const { error: adminSendError } = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject,
        text: adminText,
      });

      if (!adminSendError && booking.email) {
        const { error: customerSendError } = await resend.emails.send({
          from: fromEmail,
          to: booking.email,
          subject,
          text: customerText,
        });

        if (!customerSendError) {
          return;
        }

        console.error('Resend send error (customer booking):', customerSendError);
        continue;
      }

      if (!adminSendError) {
        return;
      }

      console.error('Resend send error (admin booking):', adminSendError);
    }
  }

  if (!hasSmtpConfig()) {
    console.warn('SMTP not configured, skipping confirmed booking emails');
    return;
  }

  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject,
    replyTo: booking.email || undefined,
    text: adminText,
  });

  if (booking.email) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: booking.email,
      subject,
      text: customerText,
    });
  }
};

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);

  // TEST: Respond to GET /api/bookings?test=1 with a simple message
  if (req.method === 'GET' && req.query && req.query.test === '1') {
    return res.status(200).json({ message: 'API route is working!' });
  }

  try {


    if (req.method === 'GET') {
      try {
        const { rows } = await selectBookings();
        return res.json((rows || []).map(normalizeBooking));
      } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to load bookings from database' });
      }
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      const payload = sanitizePayload(body);
      // If updating an existing booking
      if (body.id && (
        body.internal_notes !== undefined ||
        body.status !== undefined ||
        body.deposit_amount !== undefined ||
        body.total_amount !== undefined ||
        body.due_amount !== undefined ||
        body.paid_amount !== undefined ||
        body.bank_transfer_details !== undefined
      )) {
        const { data: existingRows } = await supabase
          .from(BOOKING_TABLE)
          .select('status')
          .eq('id', body.id)
          .limit(1);
        const previousStatus = existingRows?.[0]?.status || null;

        const updateFields = {};
        if (body.internal_notes !== undefined) updateFields.internal_notes = body.internal_notes;
        if (body.status !== undefined) updateFields.status = body.status;
        if (body.deposit_amount !== undefined) updateFields.deposit_amount = toNumberOr(body.deposit_amount, null);
        if (body.total_amount !== undefined) updateFields.total_amount = toNumberOr(body.total_amount, null);
        if (body.due_amount !== undefined) updateFields.due_amount = toNumberOr(body.due_amount, null);
        if (body.paid_amount !== undefined) updateFields.paid_amount = toNumberOr(body.paid_amount, null);
        if (body.bank_transfer_details !== undefined) updateFields.bank_transfer_details = body.bank_transfer_details;
        updateFields.updated_at = new Date().toISOString();
        const { data, error } = await supabase
          .from(BOOKING_TABLE)
          .update(updateFields)
          .eq('id', body.id)
          .select();
        if (error) return res.status(500).json({ error: error.message });
        const updated = normalizeBooking((data || [])[0] || null);

        if (previousStatus !== 'confirmed' && updated?.status === 'confirmed') {
          try {
            await sendConfirmedEmails(updated);
          } catch (mailErr) {
            console.error('Failed to send confirmed booking emails', mailErr);
          }
        }

        return res.status(200).json(updated);
      }
      // Otherwise, create new booking
      if (!payload.name || !payload.email) {
        return res.status(400).json({ error: 'Missing required fields: name and email' });
      }
      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

      // --- NEW: Invite user and store user_id ---
      let userId = null;
      try {
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(payload.email);
        if (inviteError) {
          console.error('Supabase invite error:', inviteError);
        } else if (inviteData && inviteData.user && inviteData.user.id) {
          userId = inviteData.user.id;
        }
      } catch (e) {
        console.error('Supabase invite exception:', e);
      }
      if (userId) payload.user_id = userId;
      // --- END NEW ---

      const primaryInsert = await supabase.from(BOOKING_TABLE).insert([payload]).select();
      if (!primaryInsert.error) {
        return res.status(201).json(normalizeBooking((primaryInsert.data || [])[0] || null));
      }
      const legacyPayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        course_title: payload.course_title,
        preferred_date: payload.preferred_date,
        experience_level: payload.experience_level,
        message: payload.message,
      };

      const fallbackInsert = await supabase.from(LEGACY_BOOKING_TABLE).insert([legacyPayload]).select();
      if (fallbackInsert.error) {
        return res.status(500).json({
          error: primaryInsert.error?.message || fallbackInsert.error?.message || 'Failed to save booking',
        });
      }

      return res.status(201).json(normalizeBooking((fallbackInsert.data || [])[0] || null));
    }

    if (req.method === 'DELETE') {
      // WARNING: This will delete all bookings! Protect this in production.
      // No API key required for now
      const { error } = await supabase.from(BOOKING_TABLE).delete().neq('id', '');
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ message: 'All bookings deleted.' });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}