import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { page_slug, locale, section_key, content_type, content_value } = req.body;
  if (!page_slug || !locale || !section_key || !content_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { error } = await supabase.from('page_content').upsert({
    page_slug,
    locale,
    section_key,
    content_type,
    content_value,
  });
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ status: 'ok' });
}
