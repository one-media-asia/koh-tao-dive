import React from 'react';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';
import CurrencyExchange from '@/components/CurrencyExchange';

const BookingStandalonePage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <CurrencyExchange />
          <h1 className="text-3xl font-bold mb-6 text-center">Book Now</h1>
          <BookingForm standalone itemType="course" itemTitle="Open Water" depositMajor={2000} depositCurrency="THB" paymentMethod="stripe" />
        </div>
      </div>
    </Layout>
  );
};

export default BookingStandalonePage;
