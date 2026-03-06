import { handleOptions, applyCors } from '../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

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
    if (req.method === 'GET') {
      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(1000);
      if (error) return res.status(500).json({ error: error.message });
      return res.json(data || []);
    }

    if (req.method === 'POST') {
      const body = parseBody(req);
      if (!body.name || !body.email) return res.status(400).json({ error: 'Missing required fields: name and email' });
      if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
      const { data, error } = await supabase.from('bookings').insert([body]).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.status(201).json((data || [])[0] || null);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}