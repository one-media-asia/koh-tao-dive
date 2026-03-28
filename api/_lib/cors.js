
export const applyCors = (res) => {
  if (!res || typeof res.setHeader !== 'function') return;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Login-Token');
};

export const handleOptions = (req, res) => {
  if (!req || !res) return false;
  if (req.method === 'OPTIONS') {
    applyCors(res);
    res.status(200).end();
    return true;
  }
  return false;
};
