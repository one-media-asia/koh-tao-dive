const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || '').trim();

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

const getAdminLoginToken = (req) => {
  const token =
    req.headers?.['x-admin-login-token'] ||
    req.headers?.['X-Admin-Login-Token'];

  return typeof token === 'string' ? token.trim() : null;
};

const base64UrlToBase64 = (value = '') =>
  value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4 || 4)) % 4);

const verifyAdminLoginToken = async (token) => {
  if (!ADMIN_PASSWORD) return null;
  if (!token || !token.includes('.')) return null;

  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  // Node runtime signature verification via HMAC-SHA256.
  const { createHmac } = await import('crypto');
  const computedSig = createHmac('sha256', ADMIN_PASSWORD)
    .update(payloadB64)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  if (computedSig !== sig) return null;

  try {
    const payload = JSON.parse(Buffer.from(base64UrlToBase64(payloadB64), 'base64').toString('utf8'));
    const email = normalizeEmail(payload?.email || '');
    const exp = Number(payload?.exp || 0);
    const now = Math.floor(Date.now() / 1000);

    if (!email || !exp || exp <= now) return null;

    const allowedEmails = parseAllowedAdminEmails();
    if (allowedEmails.length && !allowedEmails.includes(email)) return null;

    return {
      id: `admin-login:${email}`,
      email,
      app_metadata: { app_role: 'admin' },
      user_metadata: { role: 'admin' },
    };
  } catch {
    return null;
  }
};


export const requireAdmin = async (req, res) => {
  const token = getBearerToken(req);
  if (!token) {
    const adminLoginToken = getAdminLoginToken(req);
    const adminFromLogin = await verifyAdminLoginToken(adminLoginToken);
    if (adminFromLogin) return adminFromLogin;

    res.status(404).json({ error: 'Not found' });
    return null;
  }

  if (!SUPABASE_URL || !SUPABASE_API_KEY) {
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
