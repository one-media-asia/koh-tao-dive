

import { Resend } from 'resend';

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

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    // Admins can be a comma-separated list in env
    const adminEmails = (process.env.RESEND_BOOKING_TO_EMAIL || 'admin@prodiving.asia').split(',').map(e => e.trim());

    if (!resendApiKey) {
      res.status(500).json({ success: false, error: 'Resend not configured' });
      return;
    }

    const resend = new Resend(resendApiKey);


    // Hardcoded 'Other Details' section for portability
    const otherDetails = `\nOther Details:\n- Internal Notes: ${req.body.internal_notes || '-'}\n- Bank Transfer: ${req.body.bank_transfer_details || '-'}\n- Subtotal: ${req.body.subtotal_amount || '-'}\n- Total: ${req.body.total_amount || '-'}\n- Due: ${req.body.due_amount || '-'}\n- Addons: ${req.body.addons || '-'}\n- Addons Total: ${req.body.addons_total || '-'}\n`;


    const adminSubject = `New Booking (Pending): ${item_title}`;
    const adminHtml = `
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
              <tr><td style="font-weight: bold; padding: 6px 0;">Internal Notes:</td><td>${req.body.internal_notes || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Bank Transfer:</td><td>${req.body.bank_transfer_details || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Subtotal:</td><td>${req.body.subtotal_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Total:</td><td>${req.body.total_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Due:</td><td>${req.body.due_amount || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Addons:</td><td>${req.body.addons || '-'}</td></tr>
              <tr><td style="font-weight: bold; padding: 6px 0;">Addons Total:</td><td>${req.body.addons_total || '-'}</td></tr>
            </tbody>
          </table>
          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'}/admin" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 28px; border-radius: 6px; font-weight: bold; text-decoration: none; font-size: 16px;">Open Project Manager</a>
          </div>
        </div>
      </div>
    `;

    const { error: adminSendError } = await resend.emails.send({
      from: fromEmail,
      to: adminEmails,
      subject: adminSubject,
      html: adminHtml,
      text: undefined,
    });
    if (adminSendError) {
      console.error('Resend send error (admin booking):', adminSendError);
      res.status(500).json({ success: false, error: adminSendError.message || 'Failed to send admin email' });
      return;
    }

    // Email to client
    const clientSubject = `Booking Received: ${item_title}`;
    const clientText = `Thank you for your booking! We have received your request and will confirm your booking soon.\n\nBooking Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nPreferred Date: ${preferred_date}\nExperience Level: ${experience_level}\nMessage: ${message}\nItem: ${item_title}\nDeposit: ${deposit_amount}\nPayment Choice: ${payment_choice}`;

    const { error: clientSendError } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: clientSubject,
      text: clientText,
    });
    if (clientSendError) {
      console.error('Resend send error (client booking):', clientSendError);
      res.status(500).json({ success: false, error: clientSendError.message || 'Failed to send client email' });
      return;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-booking-notification error', err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
}
