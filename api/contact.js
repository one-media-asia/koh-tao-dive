import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';
const supabase = SUPABASE_URL && SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } }) : null;

const hasSmtpConfig = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const getResendFromCandidates = () => {
  const primary = process.env.RESEND_FROM_EMAIL || 'confirmed@divinginasia.com';
  return Array.from(new Set([primary, 'onboarding@resend.dev']));
};

const sendWithResend = async ({ name, email, subject, message, course, preferred_date, phone, experience_level }) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return { attempted: false, delivered: false, reason: 'Resend API key not configured' };
  }

  const resend = new Resend(resendApiKey);
  const toEmail = process.env.RESEND_BOOKING_TO_EMAIL || 'bookings@divinginasia.com';
  const subjectLine = subject || 'Contact/Booking Form Submission';
  const textBody = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nCourse: ${course || ''}\nPreferred Date: ${preferred_date || ''}\nExperience Level: ${experience_level || ''}\nSubject: ${subject || ''}\nMessage:\n${message}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 32px 0;">
      <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img src=\"https://www.divinginasia.com/images/logo.png\" alt=\"Diving In Asia\" style=\"max-width: 180px; margin-bottom: 8px;\" />
        </div>
        <h2 style=\"color: #0e7490; font-size: 1.5rem; margin-bottom: 16px;\">New Contact/Booking Form Submission</h2>
        <table style=\"width: 100%; border-collapse: collapse; margin-bottom: 24px;\">
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Name:</td><td style=\"padding: 4px 0;\">${name}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Email:</td><td style=\"padding: 4px 0;\">${email}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Phone:</td><td style=\"padding: 4px 0;\">${phone || '-'}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Course:</td><td style=\"padding: 4px 0;\">${course || '-'}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Preferred Date:</td><td style=\"padding: 4px 0;\">${preferred_date || '-'}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Experience Level:</td><td style=\"padding: 4px 0;\">${experience_level || '-'}</td></tr>
          <tr><td style=\"font-weight: bold; padding: 4px 0;\">Subject:</td><td style=\"padding: 4px 0;\">${subject || '-'}</td></tr>
        </table>
        <div style=\"margin-bottom: 12px;\"><strong>Message:</strong></div>
        <div style=\"background: #f1f5f9; border-radius: 6px; padding: 16px; color: #334155;\">${message.replace(/\n/g, '<br>')}</div>
        <div style=\"margin-top: 32px; text-align: center; color: #64748b; font-size: 0.95em;\">
          <em>Diving In Asia &middot; www.divinginasia.com</em>
        </div>
      </div>
    </div>
  `;

  let lastError = null;

  for (const fromEmail of getResendFromCandidates()) {
    const { error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subjectLine,
      reply_to: email,
      text: textBody,
      html: htmlBody,
    });

    if (!resendError) {
      return { attempted: true, delivered: true, fromEmail };
    }

    lastError = resendError;
  }

  return { attempted: true, delivered: false, reason: lastError?.message || 'Failed to send email via Resend' };
};

const sendWithSmtp = async ({ name, email, subject, message, course, preferred_date, phone, experience_level }) => {
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

  await transporter.sendMail({
    from: smtpUser,
    to: process.env.SMTP_TO_EMAIL || 'contact@prodiving.asia',
    subject: subject || 'Contact/Booking Form Submission',
    replyTo: email,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || ''}\nCourse: ${course || ''}\nPreferred Date: ${preferred_date || ''}\nExperience Level: ${experience_level || ''}\nSubject: ${subject || ''}\nMessage:\n${message}`,
  });

  return { attempted: true, delivered: true };
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { name, email, subject, message, course, preferred_date, phone, experience_level } = req.body;
    const normalizedName = String(name || '').trim();
    const normalizedEmail = String(email || '').trim();
    const normalizedMessage = String(message || '').trim();

    // Basic validation
    if (!normalizedName || !normalizedEmail || !normalizedMessage) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    let inquirySaved = false;

    if (supabase) {
      const { error: insertError } = await supabase.from(BOOKING_TABLE).insert([
        {
          name: normalizedName,
          email: normalizedEmail,
          course_title: course || subject || null,
          preferred_date: preferred_date || null,
          phone: phone || null,
          experience_level: experience_level || null,
          message: normalizedMessage,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error('Contact inquiry insert failed:', insertError);
      } else {
        inquirySaved = true;
      }
    }

    const emailPayload = {
      name: normalizedName,
      email: normalizedEmail,
      subject,
      message: normalizedMessage,
      course,
      preferred_date,
      phone,
      experience_level,
    };

    try {
      const resendResult = await sendWithResend(emailPayload);

      if (resendResult.delivered) {
        res.status(200).json({ success: true, saved: inquirySaved, notified: true });
        return;
      }

      const smtpResult = await sendWithSmtp(emailPayload);

      if (smtpResult.delivered) {
        res.status(200).json({ success: true, saved: inquirySaved, notified: true });
        return;
      }

      if (inquirySaved) {
        res.status(200).json({
          success: true,
          saved: true,
          notified: false,
          warning: resendResult.reason || smtpResult.reason || 'Your inquiry was saved, but email notifications are not configured.',
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: resendResult.reason || smtpResult.reason || 'Unable to save or send your inquiry.',
      });
    } catch (err) {
      console.error('Contact notification failed:', err);

      if (inquirySaved) {
        res.status(200).json({
          success: true,
          saved: true,
          notified: false,
          warning: err?.message || 'Your inquiry was saved, but notification email delivery failed.',
        });
        return;
      }

      res.status(500).json({ success: false, error: err?.message || 'Unable to process contact inquiry' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err?.message || 'Server error' });
  }
}