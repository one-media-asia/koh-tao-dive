import { handleOptions, applyCors } from '../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const BOOKING_TABLE = 'bookings';
const LEGACY_BOOKING_TABLE = 'booking_inquiries';

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
  phone: row.phone || null,
  item_type: row.item_type || null,
  course_title: row.course_title || row.item_title || 'Booking Inquiry',
  preferred_date: row.preferred_date || null,
  experience_level: row.experience_level || null,
  addons: row.addons || null,
  addons_json: row.addons_json || null,
  addons_total: toNumberOr(row.addons_total, 0),
  subtotal_amount: typeof row.subtotal_amount === 'number' ? row.subtotal_amount : null,
  total_payable_now: typeof row.total_payable_now === 'number' ? row.total_payable_now : null,
  internal_notes: row.internal_notes || null,
  message: row.message || null,
  status: row.status || 'pending',
  created_at: row.created_at || new Date().toISOString(),
  updated_at: row.updated_at || null,
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
    addons: body.addons || null,
    addons_json: body.addons_json || null,
    addons_total: toNumberOr(body.addons_total, 0),
    subtotal_amount: typeof body.subtotal_amount === 'number' ? body.subtotal_amount : null,
    total_payable_now: typeof body.total_payable_now === 'number' ? body.total_payable_now : null,
    internal_notes: body.internal_notes || null,
    message: body.message || null,
    status: body.status || 'pending',
  };
};

const selectBookings = async () => {
  const primary = await supabase
    .from(BOOKING_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (!primary.error) {
    return { table: BOOKING_TABLE, rows: primary.data || [] };
  }

  const fallback = await supabase
    .from(LEGACY_BOOKING_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (!fallback.error) {
    return { table: LEGACY_BOOKING_TABLE, rows: fallback.data || [] };
  }

  throw new Error(primary.error?.message || fallback.error?.message || 'Failed to read bookings');
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body;
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
      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
      const { rows } = await selectBookings();
      return res.json((rows || []).map(normalizeBooking));
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      const payload = sanitizePayload(body);

      if (!payload.name || !payload.email) {
        return res.status(400).json({ error: 'Missing required fields: name and email' });
      }

      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

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

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}