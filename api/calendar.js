import { handleOptions, applyCors } from '../_lib/cors.js';
import { createClient } from '@supabase/supabase-js';

const BOOKING_TABLE = 'bookings';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CALENDAR_TOKEN = (process.env.BOOKING_CALENDAR_TOKEN || '').trim();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const parseDateOnly = (value) => {
  if (!value) return null;
  const datePart = String(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;
  return datePart;
};

const toIcsDate = (yyyyMmDd) => yyyyMmDd.replace(/-/g, '');

const nextDay = (yyyyMmDd) => {
  const d = new Date(`${yyyyMmDd}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return yyyyMmDd;
  d.setUTCDate(d.getUTCDate() + 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const nowUtcStamp = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
};

const todayUtcDateOnly = () => {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const escapeText = (value) =>
  String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

const selectBookings = async () => {
  const { data, error } = await supabase
    .from(BOOKING_TABLE)
    .select('id,name,email,phone,course_title,preferred_date,status,message,created_at')
    .order('created_at', { ascending: false })
    .limit(1500);

  if (error) throw new Error(error.message);
  return data || [];
};

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (CALENDAR_TOKEN) {
    const provided = String(req.query?.token || '').trim();
    if (provided !== CALENDAR_TOKEN) {
      return res.status(401).json({ error: 'Invalid calendar token' });
    }
  }

  try {
    const rows = await selectBookings();
    const dtStamp = nowUtcStamp();
    const today = todayUtcDateOnly();

    const events = rows
      .filter((row) => {
        const dateOnly = parseDateOnly(row.preferred_date);
        const isConfirmed = String(row.status || '').toLowerCase() === 'confirmed';
        return Boolean(dateOnly) && isConfirmed && dateOnly >= today;
      })
      .map((row) => {
        const dateOnly = parseDateOnly(row.preferred_date);
        if (!dateOnly) return null;

        const startDate = toIcsDate(dateOnly);
        const endDate = toIcsDate(nextDay(dateOnly));
        const uid = `${row.id || `${row.email || 'booking'}-${startDate}`}@prodiving.asia`;
        const summary = escapeText(`Booking: ${row.course_title || 'Inquiry'} (${row.name || 'Guest'})`);
        const description = escapeText(
          [
            `Name: ${row.name || ''}`,
            `Email: ${row.email || ''}`,
            `Phone: ${row.phone || ''}`,
            `Status: ${row.status || 'pending'}`,
            `Message: ${row.message || ''}`,
            `Booking ID: ${row.id || ''}`,
          ].join('\n')
        );

        return [
          'BEGIN:VEVENT',
          `UID:${uid}`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART;VALUE=DATE:${startDate}`,
          `DTEND;VALUE=DATE:${endDate}`,
          `SUMMARY:${summary}`,
          `DESCRIPTION:${description}`,
          'END:VEVENT',
        ].join('\r\n');
      })
      .filter(Boolean)
      .join('\r\n');

    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Pro Diving Asia//Confirmed Bookings Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:Pro Diving Asia Confirmed Bookings',
      'X-PUBLISHED-TTL:PT15M',
      'REFRESH-INTERVAL;VALUE=DURATION:PT15M',
      events,
      'END:VCALENDAR',
      '',
    ].join('\r\n');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="bookings.ics"');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(calendar);
  } catch (err) {
    console.error('api/bookings/calendar error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
