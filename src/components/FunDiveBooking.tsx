import React, { useState } from 'react';
import BookingModal from './BookingModal';

const DIVE_SITES = [
  'Chumphon Pinnacle',
  'Southwest Pinnacle',
  'Sail Rock',
  'White Rock',
  'Green Rock',
  'Japanese Gardens',
  'Shark Island',
  'Twins',
  'HTMS Sattakut',
];

const FunDiveBooking: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  const handleSiteSelect = (site: string) => {
    setSelectedSite(site);
    setShowNotice(true);
  };

  const handleProceed = () => {
    setShowNotice(false);
    setModalOpen(true);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book a Fun Dive</h1>
      <ul className="mb-6 space-y-2">
        {DIVE_SITES.map(site => (
          <li key={site}>
            <button
              className={`w-full text-left px-4 py-2 rounded border ${selectedSite === site ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} hover:bg-blue-50`}
              onClick={() => handleSiteSelect(site)}
            >
              {site}
            </button>
          </li>
        ))}
      </ul>
      {showNotice && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
          <p><strong>Notice:</strong> Due to weather and unforeseeable conditions, schedules may change. We will confirm your booking and keep you updated.</p>
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleProceed}
          >
            Proceed to Booking
          </button>
        </div>
      )}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={data => {
          // You can add logic to handle the booking submission here
          setModalOpen(false);
        }}
      />
    </div>
  );
};

export default FunDiveBooking;
