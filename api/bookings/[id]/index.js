import { handleOptions, applyCors } from '../../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../../_lib/auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;
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

const findBookingById = async (id) => {
  const primary = await supabase.from(BOOKING_TABLE).select('*').eq('id', id).limit(1);
  if (!primary.error && primary.data?.length) {
    return { table: BOOKING_TABLE, row: primary.data[0] };
  }

  const fallback = await supabase.from(LEGACY_BOOKING_TABLE).select('*').eq('id', id).limit(1);
  if (!fallback.error && fallback.data?.length) {
    return { table: LEGACY_BOOKING_TABLE, row: fallback.data[0] };
  }

  return null;
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
  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
    const adminUser = await requireAdmin(req, res);
    if (!adminUser) {
      // requireAdmin already sent 404
      return;
    }

    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Missing booking id' });

    const record = await findBookingById(id);
    if (!record) return res.status(404).json({ error: 'Booking not found' });

    if (req.method === 'GET') {
      return res.json(normalizeBooking(record.row));
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = parseBody(req);
      const updateData = record.table === BOOKING_TABLE
        ? {
            name: body.name,
            email: body.email,
            phone: body.phone,
            item_type: body.item_type,
            course_title: body.course_title,
            preferred_date: body.preferred_date,
            experience_level: body.experience_level,
            addons: body.addons,
            addons_json: body.addons_json,
            addons_total: typeof body.addons_total !== 'undefined' ? toNumberOr(body.addons_total, 0) : undefined,
            subtotal_amount: typeof body.subtotal_amount !== 'undefined' ? toNumberOr(body.subtotal_amount, 0) : undefined,
            total_payable_now: typeof body.total_payable_now !== 'undefined' ? toNumberOr(body.total_payable_now, 0) : undefined,
            internal_notes: body.internal_notes,
            message: body.message,
            status: body.status,
            updated_at: new Date().toISOString(),
          }
        : {
            name: body.name,
            email: body.email,
            phone: body.phone,
            course_title: body.course_title,
            preferred_date: body.preferred_date,
            experience_level: body.experience_level,
            message: body.message,
          };

      Object.keys(updateData).forEach((key) => {
        if (typeof updateData[key] === 'undefined') delete updateData[key];
      });

      const { data, error } = await supabase.from(record.table).update(updateData).eq('id', id).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.json(normalizeBooking((data || [])[0] || null));
    }

    if (req.method === 'DELETE') {
      const { data, error } = await supabase.from(record.table).delete().eq('id', id).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ success: true });
    }

    res.setHeader('Allow', 'GET, PATCH, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings/[id] error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}