
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';

function useQuery() {
  const { search } = typeof window !== 'undefined' ? window.location : { search: '' };
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const BookingFormPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(true);
  const query = useQuery();
  const itemTitle = query.get('item') || 'General Inquiry';
  const itemType = (query.get('type') === 'dive' || query.get('type') === 'course') ? query.get('type') : 'course';
  const depositMajor = query.get('price') ? Number(query.get('price')) : undefined;
  const depositCurrency = query.get('currency') || undefined;

  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Booking / Inquiry Form</h1>
          <BookingForm
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            itemType={itemType as 'course' | 'dive'}
            itemTitle={itemTitle}
            depositMajor={depositMajor}
            depositCurrency={depositCurrency}
          />
        </div>
      </div>
    </Layout>
  );
};

export default BookingFormPage;
