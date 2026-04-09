import React from 'react';
import Layout from '@/components/Layout';

const BookNowSite: React.FC = () => (
  <Layout>
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Booking / Inquiry Form</h1>
        <iframe
          src="/booknow.html"
          style={{ width: '100%', minHeight: '1100px', border: 'none', overflow: 'auto' }}
          title="Booking / Inquiry Form"
        />
        <p className="mt-6 text-center text-gray-500 text-sm">
          After submitting, you will be redirected to our thank you page.
        </p>
      </div>
    </div>
  </Layout>
);

export default BookNowSite;