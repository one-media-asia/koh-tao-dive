import { createHmac } from 'crypto';

// Vercel Serverless Function: Basic Admin Login

const ADMIN_EMAILS_RAW = process.env.ADMIN_EMAILS || 'peter@p.com';
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '').trim();

const ADMIN_EMAILS = ADMIN_EMAILS_RAW
  .split(',')
  .map((email) => String(email || '').trim().toLowerCase())
  .filter(Boolean);

const toBase64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const signPayload = (payloadB64) =>
  createHmac('sha256', ADMIN_PASSWORD)
    .update(payloadB64)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

const createAdminToken = (email) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    email,
    iat: now,
    exp: now + 60 * 60 * 12,
    iss: 'admin-login',
  };

  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const sig = signPayload(payloadB64);
  return `${payloadB64}.${sig}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!ADMIN_PASSWORD) {
    res.status(500).json({ success: false, error: 'Admin login is not configured' });
    return;
  }

  const { email, password } = req.body;
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (ADMIN_EMAILS.includes(normalizedEmail) && password === ADMIN_PASSWORD) {
    const token = createAdminToken(normalizedEmail);
    res.status(200).json({ success: true, message: 'Login successful', token });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
}
