import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { page_slug, locale } = req.query;
  if (!page_slug || !locale) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('page_content')
    .select('section_key, content_value')
    .eq('page_slug', page_slug)
    .eq('locale', locale);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ content: data });
}
