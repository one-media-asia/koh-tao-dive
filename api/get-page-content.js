import { createClient } from '@supabase/supabase-js';

const cleanEnv = (value) => String(value || '').replace(/\\n/g, '').trim();

const SUPABASE_URL = cleanEnv(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
const SUPABASE_API_KEY = cleanEnv(
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY
);

const supabase = SUPABASE_URL && SUPABASE_API_KEY
  ? createClient(SUPABASE_URL, SUPABASE_API_KEY)
  : null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pageSlug = String(req.query.page_slug || '').trim();
  const locale = String(req.query.locale || 'en').trim();

  if (!pageSlug) {
    return res.status(400).json({ error: 'Missing page_slug' });
  }

  if (!supabase) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  try {
    const { data, error } = await supabase
      .from('page_content')
      .select('section_key, content_value, content_type, locale, page_slug, updated_at')
      .eq('page_slug', pageSlug)
      .eq('locale', locale)
      .order('section_key', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message, content: [] });
    }

    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(200).json({ content: data || [] });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Failed to fetch page content', content: [] });
  }
}
