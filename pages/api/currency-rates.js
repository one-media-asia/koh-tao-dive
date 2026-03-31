// pages/api/currency-rates.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://api.exchangerate.host/latest?base=THB&symbols=THB,USD,EUR');
    if (!response.ok) throw new Error('Failed to fetch exchange rates');
    const data = await response.json();
    const rates = {
      THB: 1,
      USD: data.rates.USD,
      EUR: data.rates.EUR,
    };
    res.status(200).json({ rates, date: data.date });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch live exchange rates.' });
  }
}
