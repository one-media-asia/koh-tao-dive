// PATCH method is supported locally and on platforms that allow all HTTP methods for API routes.
// If deploying to Vercel and PATCH is not allowed, consider using POST with an action parameter instead.
// import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');
    return res.status(204).end();
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  if (req.method === 'POST') {
    try {
      const body = req.body;
      if (!body.created_at) body.created_at = new Date().toISOString();
      const { error } = await supabase.from(BOOKING_TABLE).insert([body]);
      if (error) {
        return res.status(500).json({ error: error.message || 'Insert failed' });
      }
      return res.status(200).json({ status: 'ok' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'PATCH') {
    let id = req.query.id;
    if (Array.isArray(id)) id = id[0];
    if (!id) {
      return res.status(400).json({ error: 'Missing booking id in URL' });
    }
    try {
      const body = req.body;
      const { error, data } = await supabase.from(BOOKING_TABLE).update(body).eq('id', id).select();
      if (error) {
        // Log error details for debugging
        console.error('Supabase update error:', error, 'id:', id, 'body:', body);
        return res.status(500).json({ error: error.message || 'Update failed', details: error.details || null });
      }
      return res.status(200).json(data);
    } catch (err) {
      // Log unexpected error
      console.error('Unexpected PATCH error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
