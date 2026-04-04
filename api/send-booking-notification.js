

import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const hasSmtpConfig = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getResendFromCandidates = () => {
  const primary = process.env.RESEND_FROM_EMAIL || 'confirmed@divinginasia.com';
  return Array.from(new Set([primary, 'onboarding@resend.dev']));
};

const buildAdminHtml = ({
  name,
  email,
  phone,
  preferred_date,
  experience_level,
  message,
  item_title,
  deposit_amount,
  payment_choice,
  paypal_link,
  body,
}) => `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; padding: 32px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px;">
          <h2 style="color: #2563eb; margin-bottom: 8px;">New Booking (Pending)</h2>
          <p style="color: #64748b; margin-bottom: 24px;">A new booking has been submitted and is pending confirmation.</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tbody>
              <tr><td style="font-weight: bold; padding: 6px 0;">Name:</td><td>${name}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Email:</td><td>${email}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Phone:</td><td>${phone}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Preferred Date:</td><td>${preferred_date}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Experience Level:</td><td>${experience_level}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Message:</td><td>${message}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Item:</td><td>${item_title}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Deposit:</td><td>${deposit_amount}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Payment Choice:</td><td>${payment_choice}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Paypal Link:</td><td><a href="${paypal_link}" style="color: #2563eb;">${paypal_link}</a></td></tr>
            </tbody>
          </table>
          <h3 style="color: #0ea5e9; margin-bottom: 8px;">Other Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
            <tbody>
              <tr><td style="font-weight: bold; padding: 6px 0;">Internal Notes:</td><td>${body.internal_notes || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Bank Transfer:</td><td>${body.bank_transfer_details || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Subtotal:</td><td>${body.subtotal_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Total:</td><td>${body.total_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Due:</td><td>${body.due_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Addons:</td><td>${body.addons || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Addons Total:</td><td>${body.addons_total || '-'}</td></tr>
            </tbody>
          </table>
          <div style="margin-top: 32px; text-align: center;">
            <a href="https://www.divinginasia.com/admin/" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 16px;">Open Project Manager</a>
          </div>
        </div>
      </div>
    `;

const sendWithResend = async ({ fromEmail, adminEmails, booking }) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { attempted: false, delivered: false, reason: 'Resend not configured' };
  }

  const resend = new Resend(resendApiKey);
  const adminSubject = `New Booking (Pending): ${booking.item_title}`;
  const adminHtml = buildAdminHtml({ ...booking, body: booking.body });
  const clientSubject = `Booking Received: ${booking.item_title}`;
  const clientText = `Thank you for your booking! We have received your request and will confirm your booking soon.\n\nBooking Details:\nName: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nPreferred Date: ${booking.preferred_date}\nExperience Level: ${booking.experience_level}\nMessage: ${booking.message}\nItem: ${booking.item_title}\nDeposit: ${booking.deposit_amount}\nPayment Choice: ${booking.payment_choice}`;

  let lastError = null;

  for (const candidateFromEmail of getResendFromCandidates()) {
    const { error: adminSendError } = await resend.emails.send({
      from: candidateFromEmail,
      to: adminEmails,
      subject: adminSubject,
      html: adminHtml,
      text: undefined,
    });

    if (adminSendError) {
      lastError = adminSendError;
      continue;
    }

    const { error: clientSendError } = await resend.emails.send({
      from: candidateFromEmail,
      to: [booking.email],
      subject: clientSubject,
      text: clientText,
    });

    if (!clientSendError) {
      return { attempted: true, delivered: true, fromEmail: candidateFromEmail };
    }

    lastError = clientSendError;
  }

  return { attempted: true, delivered: false, reason: lastError?.message || 'Failed to send client email' };
};

const sendWithSmtp = async ({ adminEmails, booking }) => {
  if (!hasSmtpConfig()) {
    return { attempted: false, delivered: false, reason: 'SMTP not configured' };
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const adminHtml = buildAdminHtml({ ...booking, body: booking.body });

  const clientText = `Thank you for your booking! We have received your request and will confirm your booking soon.\n\nBooking Details:\nName: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nPreferred Date: ${booking.preferred_date}\nExperience Level: ${booking.experience_level}\nMessage: ${booking.message}\nItem: ${booking.item_title}\nDeposit: ${booking.deposit_amount}\nPayment Choice: ${booking.payment_choice}`;

  await transporter.sendMail({
    from: smtpUser,
    to: adminEmails.join(', '),
    subject: `New Booking (Pending): ${booking.item_title}`,
    replyTo: booking.email,
    text: undefined,
    html: adminHtml,
  });

  await transporter.sendMail({
    from: smtpUser,
    to: booking.email,
    subject: `Booking Received: ${booking.item_title}`,
    text: clientText,
  });

  return { attempted: true, delivered: true };
};

export default async function handler(req, res) {
  // Allow production and any Vercel preview domain
  const origin = req.headers.origin;
  const isProd = origin === 'https://www.divinginasia.com';
  const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);
  if (isProd || isVercelPreview) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const {
      name,
      email,
      phone,
      preferred_date,
      experience_level,
      message,
      item_title,
      deposit_amount,
      payment_choice,
      paypal_link,
    } = req.body || {};

    // Basic validation
    if (!name || !email || !item_title) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const fromEmail = getResendFromCandidates()[0];
    // Admins can be a comma-separated list in env
    const adminEmails = (process.env.RESEND_BOOKING_TO_EMAIL || 'bookings@divinginasia.com').split(',').map(e => e.trim());

    const booking = {
      name,
      email,
      phone,
      preferred_date,
      experience_level,
      message,
      item_title,
      deposit_amount,
      payment_choice,
      paypal_link,
      body: req.body || {},
    };

    const resendResult = await sendWithResend({ fromEmail, adminEmails, booking });
    if (resendResult.delivered) {
      res.status(200).json({ success: true, notified: true });
      return;
    }

    try {
      const smtpResult = await sendWithSmtp({ adminEmails, booking });
      if (smtpResult.delivered) {
        res.status(200).json({ success: true, notified: true, fallback: 'smtp' });
        return;
      }

      res.status(200).json({
        success: true,
        notified: false,
        warning: resendResult.reason || smtpResult.reason || 'Booking saved but notification email was not sent.',
      });
    } catch (smtpError) {
      console.error('SMTP booking notification error:', smtpError);
      res.status(200).json({
        success: true,
        notified: false,
        warning: resendResult.reason || smtpError?.message || 'Booking saved but notification email was not sent.',
      });
    }
  } catch (err) {
    console.error('send-booking-notification error', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}
