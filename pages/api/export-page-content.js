// API route: GET /api/export-page-content
// Exports all page content from Supabase as CSV

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const PAGE_CONTENT_TABLE = 'page_content';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')];
  for (const row of rows) {
    csv.push(headers.map(h => '"' + String(row[h]).replace(/"/g, '""') + '"').join(','));
  }
  return csv.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }
  try {
    const { data, error } = await supabase.from(PAGE_CONTENT_TABLE).select('*');
    if (error) throw new Error(error.message);
    const csv = toCSV(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="page_content_export.csv"');
    res.status(200).send(csv);
  } catch (e) {
    res.status(500).json({ message: 'Export failed: ' + (e.message || e) });
  }
}
