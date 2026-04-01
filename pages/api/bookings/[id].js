// API route: PATCH /api/bookings/[id]
// Updates notes for a specific booking

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }
  const { notes } = req.body;
  if (typeof notes !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid notes' });
  }
  try {
    const { data, error } = await supabase
      .from(BOOKING_TABLE)
      .update({ notes })
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    res.status(200).json({ message: 'Notes updated', data });
  } catch (e) {
    res.status(500).json({ message: 'Update failed: ' + (e.message || e) });
  }
}
