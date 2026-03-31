import { useEffect, useState } from "react";

export interface CurrencyRates {
  THB: number;
  USD: number;
  EUR: number;
}

export function useCurrencyRates() {
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/currency-rates")
      .then((res) => res.json())
      .then((data) => {
        setRates(data.rates);
        setLastUpdate(data.date || null);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch currency rates");
        setLoading(false);
      });
  }, []);

  return { rates, lastUpdate, loading, error };
}
