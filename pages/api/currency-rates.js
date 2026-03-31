// pages/api/currency-rates.js

// Simple in-memory cache (resets on server restart)

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://divinginasia.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
let cachedRates = null;
let cachedDate = null;
let lastFetch = 0;
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export default async function handler(req, res) {
  // Set CORS headers on every response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  const now = Date.now();
  if (cachedRates && (now - lastFetch < CACHE_TTL)) {
    return res.status(200).json({ rates: cachedRates, date: cachedDate, cached: true });
  }
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=THB&symbols=THB,USD,EUR');
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    const rates = {
      THB: 1,
      USD: data.rates.USD,
      EUR: data.rates.EUR,
    };
    cachedRates = rates;
    cachedDate = data.date;
    lastFetch = now;
    res.status(200).json({ rates, date: data.date, cached: false });
  } catch (err) {
    // Always serve stale cache if available, or fallback to hardcoded rates
    if (cachedRates) {
      res.status(200).json({ rates: cachedRates, date: cachedDate, cached: 'stale' });
    } else {
      // Fallback to hardcoded rates if nothing cached
      res.status(200).json({
        rates: { THB: 1, USD: 0.027, EUR: 0.025 },
        date: null,
        cached: 'fallback'
      });
    }
  }
}
