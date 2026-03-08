const affiliateClicksStore = [];
const MAX_AFFILIATE_CLICK_EVENTS = 2000;

const ALLOWED_ORIGINS = new Set([
  'https://www.divinginasia.com',
  'https://divinginasia.com',
  'http://localhost:3000',
  'http://localhost:5173',
]);

function setCors(req, res) {
  const origin = req.headers && typeof req.headers.origin === 'string' ? req.headers.origin : '';

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const providerFilter = req.query && typeof req.query.provider === 'string' ? req.query.provider : null;
    const filtered = providerFilter
      ? affiliateClicksStore.filter((event) => event.provider === providerFilter)
      : affiliateClicksStore;

    const byProvider = {};
    for (const event of filtered) {
      const key = event.provider || 'unknown';
      byProvider[key] = (byProvider[key] || 0) + 1;
    }

    res.status(200).json({
      total: filtered.length,
      byProvider,
      recent: filtered.slice(-100).reverse(),
    });
    return;
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    const provider = typeof body.provider === 'string' ? body.provider : null;
    const hotelUrl = typeof body.hotel_url === 'string' ? body.hotel_url : null;

    if (!provider || !hotelUrl) {
      res.status(400).json({ error: 'Missing required fields: provider, hotel_url' });
      return;
    }

    const event = {
      id: String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10),
      provider,
      hotel_name: typeof body.hotel_name === 'string' ? body.hotel_name : null,
      hotel_url: hotelUrl,
      affiliate_id: typeof body.affiliate_id === 'string' ? body.affiliate_id : null,
      placement: typeof body.placement === 'string' ? body.placement : null,
      page_path: typeof body.page_path === 'string' ? body.page_path : null,
      referrer: typeof body.referrer === 'string' ? body.referrer : null,
      user_agent: typeof body.user_agent === 'string' ? body.user_agent : null,
      session_id: typeof body.session_id === 'string' ? body.session_id : null,
      clicked_at: typeof body.clicked_at === 'string' ? body.clicked_at : new Date().toISOString(),
    };

    affiliateClicksStore.push(event);
    if (affiliateClicksStore.length > MAX_AFFILIATE_CLICK_EVENTS) {
      affiliateClicksStore.splice(0, affiliateClicksStore.length - MAX_AFFILIATE_CLICK_EVENTS);
    }

    res.status(201).json({ ok: true, id: event.id });
    return;
  }

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(405).json({ error: 'Method not allowed' });
}