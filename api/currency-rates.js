// Vercel Serverless Function: /api/currency-rates.js

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
let cachedRates = null;
let cachedDate = null;
let lastFetch = 0;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://koh-tao-dive-dreams.vercel.app');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  const now = Date.now();
  if (cachedRates && (now - lastFetch < CACHE_TTL)) {
    return res.status(200).json({ rates: cachedRates, date: cachedDate, cached: true });
  }
  try {
    // Use exchangerate.host (no API key required)
    const response = await fetch('https://api.exchangerate.host/latest?base=THB&symbols=THB,USD,EUR');
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    if (!data.rates || typeof data.rates.USD !== 'number' || typeof data.rates.EUR !== 'number') {
      throw new Error('exchangerate.host API response missing USD or EUR rates');
    }
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
    console.error('Exchange rate fetch error:', err);
    if (cachedRates) {
      res.status(200).json({ rates: cachedRates, date: cachedDate, cached: 'stale' });
    } else {
      res.status(200).json({
        rates: { THB: 1, USD: 0.027, EUR: 0.025 },
        date: null,
        cached: 'fallback'
      });
    }
  }
}
