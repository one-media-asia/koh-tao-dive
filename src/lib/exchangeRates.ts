// Utility to fetch live exchange rates (THB to USD, EUR) from exchangerate.host
// Usage: const rates = await getExchangeRates(); rates.USD, rates.EUR

export type ExchangeRates = {
  USD: number;
  EUR: number;
};

export async function getExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch('https://api.exchangerate.host/latest?base=THB&symbols=USD,EUR');
  if (!res.ok) throw new Error('Failed to fetch exchange rates');
  const data = await res.json();
  console.log('Exchange rate API response:', data);
  if (!data.rates || typeof data.rates.USD !== 'number' || typeof data.rates.EUR !== 'number') {
    throw new Error('Exchange rate API response missing USD or EUR rates');
  }
  return {
    USD: data.rates.USD,
    EUR: data.rates.EUR,
  };
}
