// API route: /api/bookings/comments.js
// Handles GET (fetch comments) and POST (add comment) for a booking

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const COMMENTS_TABLE = 'booking_comments';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }
  if (req.method === 'GET') {
    // GET /api/bookings/comments?booking_id=xxx
    const { booking_id } = req.query;
    if (!booking_id) return res.status(400).json({ message: 'Missing booking_id' });
    const { data, error } = await supabase
      .from(COMMENTS_TABLE)
      .select('*')
      .eq('booking_id', booking_id)
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }
  if (req.method === 'POST') {
    // POST /api/bookings/comments { booking_id, user_id, comment, is_admin }
    const { booking_id, user_id, comment, is_admin } = req.body;
    if (!booking_id || !user_id || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const { data, error } = await supabase
      .from(COMMENTS_TABLE)
      .insert([{ booking_id, user_id, comment, is_admin: !!is_admin }])
      .select();
    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data[0]);
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
