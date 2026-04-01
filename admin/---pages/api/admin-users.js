// Next.js API route to fetch users from Supabase for admin assignment
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { enabled: false } });

export default async function handler(req, res) {
  const { data, error } = await supabase.from('users').select('id, name, email');
  if (error) return res.status(500).json([]);
  res.status(200).json(data || []);
}
