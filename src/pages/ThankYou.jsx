import React from 'react';

const ThankYou = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <h1 className="text-3xl font-bold mb-4">Thank you for your booking!</h1>
    <p className="text-lg mb-6">Your payment was successful. We look forward to seeing you soon.</p>
    <a
      href="https://buy.stripe.com/aFacN5bN2bP25si1a55os00"
      target="_blank"
      rel="noopener noreferrer"
      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
    >
      Pay with Stripe
    </a>
  </div>
);

export default ThankYou;
