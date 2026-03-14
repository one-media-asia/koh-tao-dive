const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const parseAllowedAdminEmails = () => {
  const raw = process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map(normalizeEmail)
    .filter(Boolean);
};

export const isAdminUser = (user) => {
  if (!user) return false;

  const appRole = user?.app_metadata?.app_role;
  const userRole = user?.user_metadata?.app_role || user?.user_metadata?.role;
  if (appRole === 'admin' || userRole === 'admin') return true;

  const allowedEmails = parseAllowedAdminEmails();
  if (!allowedEmails.length) return false;
  return allowedEmails.includes(normalizeEmail(user.email));
};

const getBearerToken = (req) => {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header || typeof header !== 'string') return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
};


export const requireAdmin = async (req, res) => {
  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
    res.status(404).json({ error: 'Not found' });
    return null;
  }

  const token = getBearerToken(req);
  if (!token) {
    res.status(404).json({ error: 'Not found' });
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_API_KEY,
      },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload?.id) {
      res.status(404).json({ error: 'Not found' });
      return null;
    }

    if (!isAdminUser(payload)) {
      res.status(404).json({ error: 'Not found' });
      return null;
    }

    return payload;
  } catch (err) {
    console.error('requireAdmin error', err);
    res.status(404).json({ error: 'Not found' });
    return null;
  }
};
