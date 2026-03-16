// import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

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
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing booking id in URL' });
    }
    try {
      const body = req.body;
      const { error, data } = await supabase.from(BOOKING_TABLE).update(body).eq('id', id).select();
      if (error) {
        return res.status(500).json({ error: error.message || 'Update failed' });
      }
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
