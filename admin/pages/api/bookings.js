
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ bookings: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}
