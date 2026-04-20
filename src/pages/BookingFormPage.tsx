import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';
import CurrencyExchange from '@/components/CurrencyExchange';

function useQuery() {
  const { search } = typeof window !== 'undefined' ? window.location : { search: '' };
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BookingFormPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(true);
  const query = useQuery();
  const itemTitle = query.get('item') || 'General Inquiry';
  const itemType = (query.get('type') === 'dive' || query.get('type') === 'course') ? query.get('type') : 'course';
  // Calculate 20% deposit
  const depositMajor = query.get('price') ? Math.round(Number(query.get('price')) * 0.2) : undefined;
  // Add payment method selection (default to 'stripe')
  const paymentMethod = query.get('payment') === 'paypal' ? 'paypal' : 'stripe';
  const depositCurrency = query.get('currency') || undefined;

  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <CurrencyExchange />
          <h1 className="text-3xl font-bold mb-6 text-center">Booking / Inquiry Form</h1>
          <BookingForm
            standalone
            itemType={itemType as 'course' | 'dive'}
            itemTitle={itemTitle}
            depositMajor={depositMajor}
            depositCurrency={depositCurrency}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BookingFormPage;
