// API route: GET /api/export-page-content-sql
// Exports all page content from Supabase as SQL INSERT statements

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const PAGE_CONTENT_TABLE = 'page_content';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

function toSQLInserts(rows, table) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return rows.map(row => {
    const values = headers.map(h =>
      row[h] === null || row[h] === undefined
        ? 'NULL'
        : `'${String(row[h]).replace(/'/g, "''")}'`
    ).join(', ');
    return `INSERT INTO ${table} (${headers.join(', ')}) VALUES (${values});`;
  }).join('\n');
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
    const sql = toSQLInserts(data, PAGE_CONTENT_TABLE);
    res.setHeader('Content-Type', 'text/sql');
    res.setHeader('Content-Disposition', 'attachment; filename="page_content_export.sql"');
    res.status(200).send(sql);
  } catch (e) {
    res.status(500).json({ message: 'Export failed: ' + (e.message || e) });
  }
}
