import { createClient } from '@supabase/supabase-js';
import { handleOptions, applyCors } from '../_lib/cors.js';
import { requireAdmin } from '../_lib/auth.js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

const clean = (value) => String(value || '').trim();
const normalizeEmail = (value) => clean(value).toLowerCase();

const resolveUserIdFromEmail = async (email) => {
  const targetEmail = normalizeEmail(email);
  if (!targetEmail) return null;

  let page = 1;
  const perPage = 200;

  while (page <= 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(error.message || 'Failed to list users');

    const users = data?.users || [];
    const match = users.find((user) => normalizeEmail(user?.email) === targetEmail);
    if (match?.id) return match.id;

    const lastPage = Number(data?.lastPage || 0);
    if (!users.length || (lastPage > 0 && page >= lastPage)) break;
    page += 1;
  }

  return null;
};

export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  applyCors(res);

  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }

    const adminUser = await requireAdmin(req, res);
    if (!adminUser) return;

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const userIdFromBody = clean(body.user_id);
    const emailFromBody = normalizeEmail(body.email);
    const newPassword = String(body.new_password || '');

    if (!newPassword || newPassword.length < 10) {
      return res.status(400).json({ error: 'new_password must be at least 10 characters' });
    }

    let targetUserId = userIdFromBody;
    if (!targetUserId && emailFromBody) {
      targetUserId = await resolveUserIdFromEmail(emailFromBody);
    }

    if (!targetUserId) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { error } = await supabase.auth.admin.updateUserById(targetUserId, {
      password: newPassword,
    });

    if (error) {
      return res.status(500).json({ error: error.message || 'Failed to reset password' });
    }

    return res.status(200).json({
      success: true,
      user_id: targetUserId,
      changed_by: adminUser?.email || null,
    });
  } catch (err) {
    console.error('api/admin/reset-password error', err);
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
