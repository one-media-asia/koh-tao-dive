import React from 'react';
import Layout from '@/components/Layout';
import BookNowForm from '@/components/BookNowForm';

const BookNowSite: React.FC = () => (
  <Layout>
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <BookNowForm />
    </div>
  </Layout>
);

export default BookNowSite;