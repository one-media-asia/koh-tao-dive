
import { handleOptions, applyCors } from '../_lib/cors.js';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const DB_PATH = path.resolve(process.cwd(), 'bookings.db');
const BOOKING_TABLE = 'bookings';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

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
  created_at: row.created_at || '',
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
  };
};

const selectBookings = async () => {
  if (supabase) {
    // Use Supabase in production
    const { data, error } = await supabase
      .from(BOOKING_TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return { table: BOOKING_TABLE, rows: data || [] };
  } else {
    // Use SQLite locally
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });
    const rows = await db.all(`SELECT * FROM ${BOOKING_TABLE} ORDER BY created_at DESC LIMIT 1000`);
    await db.close();
    return { table: BOOKING_TABLE, rows };
  }
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
      try {
        const { rows } = await selectBookings();
        return res.json((rows || []).map(normalizeBooking));
      } catch (err) {
        return res.status(500).json({ error: err?.message || 'Failed to load bookings from SQLite' });
      }
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