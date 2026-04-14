
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import BookingForm from '@/components/BookingForm';

const BookingFormPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(true);
  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center py-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Booking / Inquiry Form</h1>
          <BookingForm
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            itemType="course"
            itemTitle="General Inquiry"
          />
        </div>
      </div>
    </Layout>
  );
};

export default BookingFormPage;
