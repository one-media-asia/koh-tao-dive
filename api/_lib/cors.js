

const allowedOrigins = [
  'https://booking.divinginasia.com',
  'https://www.divinginasia.com',
  'https://koh-tao-dive-dreams.vercel.app',
];

export const applyCors = (req, res) => {
  if (!res || typeof res.setHeader !== 'function') return;
  const origin = req?.headers?.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Login-Token');
};

export const handleOptions = (req, res) => {
  if (!req || !res) return false;
  if (req.method === 'OPTIONS') {
    applyCors(req, res);
    res.status(200).end();
    return true;
  }
  return false;
};
