// Utility to fetch live exchange rates (THB to USD, EUR) from exchangerate.host
// Usage: const rates = await getExchangeRates(); rates.USD, rates.EUR

export type ExchangeRates = {
  USD: number;
  EUR: number;
};
// IMPORTANT: Replace 'YOUR_APP_ID' with your actual Open Exchange Rates App ID or use an environment variable
const APP_ID = import.meta.env.VITE_OXR_APP_ID || 'YOUR_APP_ID';

export async function getExchangeRates(): Promise<ExchangeRates> {
  // Fetch latest rates with base USD
  const url = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch exchange rates');
  const data = await res.json();
  console.log('Open Exchange Rates API response:', data);
  // Rates are relative to USD, so to get THB→USD and THB→EUR:
  // 1 THB = (1 / rates.THB) USD, 1 THB = (rates.EUR / rates.THB) EUR
  if (!data.rates || typeof data.rates.THB !== 'number' || typeof data.rates.USD !== 'number' || typeof data.rates.EUR !== 'number') {
    throw new Error('Open Exchange Rates API response missing THB, USD, or EUR rates');
  }
  return {
    USD: 1 / data.rates.THB, // 1 THB in USD
    EUR: data.rates.EUR / data.rates.THB, // 1 THB in EUR
  };
}
