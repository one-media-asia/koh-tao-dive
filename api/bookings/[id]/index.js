import { handleOptions, applyCors } from '../../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

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

    const { id } = req.query || {};
    if (!id) return res.status(400).json({ error: 'Missing booking id' });

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).limit(1);
      if (error) return res.status(500).json({ error: error.message });
      return res.json((data || [])[0] || null);
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = parseBody(req);
      const { data, error } = await supabase.from('bookings').update(body).eq('id', id).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.json((data || [])[0] || null);
    }

    if (req.method === 'DELETE') {
      const { data, error } = await supabase.from('bookings').delete().eq('id', id).select();
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