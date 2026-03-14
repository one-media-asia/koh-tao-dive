import { handleOptions, applyCors } from '../../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../../_lib/auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;
const BOOKING_TABLE = 'bookings';
const LEGACY_BOOKING_TABLE = 'booking_inquiries';

const findBookingTable = async (id) => {
  const primary = await supabase.from(BOOKING_TABLE).select('id').eq('id', id).limit(1);
  if (!primary.error && primary.data?.length) return BOOKING_TABLE;

  const fallback = await supabase.from(LEGACY_BOOKING_TABLE).select('id').eq('id', id).limit(1);
  if (!fallback.error && fallback.data?.length) return LEGACY_BOOKING_TABLE;

  return null;
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


    // Robustly extract booking ID from /api/bookings/[id]/status
    let id = req.query?.id;
    if (!id) {
      // Try to extract from URL path: /api/bookings/{id}/status
      const match = req.url.match(/bookings\/(.+?)\/status/);
      if (match && match[1]) {
        id = match[1];
      }
    }
    if (!id) return res.status(400).json({ error: 'Missing booking id' });

    const targetTable = await findBookingTable(id);
    if (!targetTable) return res.status(404).json({ error: 'Booking not found' });

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const { status } = body;
      if (!status) return res.status(400).json({ error: 'Missing status' });

      if (targetTable !== BOOKING_TABLE) {
        return res.status(409).json({ error: 'Status updates are not supported for legacy booking_inquiries rows.' });
      }

      // Extra logging for debugging
      try {
        const { data, error } = await supabase
          .from(targetTable)
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select();
        console.log('[Booking Status API] Update result', { id, table: targetTable, data, error });
        if (error) return res.status(500).json({ error: error.message });
        if (!data || !data.length) {
          console.error('[Booking Status API] No rows updated', { id, table: targetTable });
          return res.status(404).json({ error: 'Booking not found for status update' });
        }
        return res.json(data[0]);
      } catch (err) {
        console.error('[Booking Status API] Exception during update', err);
        return res.status(500).json({ error: err?.message || 'Internal error' });
      }
    }

    res.setHeader('Allow', 'PUT, PATCH');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('api/bookings/[id]/status error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}