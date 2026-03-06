import { handleOptions, applyCors } from '../../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);

  try {
    if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

    const id = req.query?.id || req.url?.split('/')?.pop();
    if (!id) return res.status(400).json({ error: 'Missing booking id' });

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { status } = body;
      if (!status) return res.status(400).json({ error: 'Missing status' });
      const { data, error } = await supabase.from('bookings').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select();
      if (error) return res.status(500).json({ error: error.message });
      return res.json((data || [])[0] || null);
    }

    res.setHeader('Allow', 'PUT, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings/[id]/status error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}