// Next.js API route for CRUD operations on project tasks
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { enabled: false } });

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('id, title, assigned_to, status, created_at, updated_at');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data || []);
  }
  if (req.method === 'POST') {
    const { title, assigned_to, status } = req.body;
    const { data, error } = await supabase
      .from('project_tasks')
      .insert([{ title, assigned_to, status }])
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }
  if (req.method === 'PUT') {
    const { id, title, assigned_to, status } = req.body;
    const { data, error } = await supabase
      .from('project_tasks')
      .update({ title, assigned_to, status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
