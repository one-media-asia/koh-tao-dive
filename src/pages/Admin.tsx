
import AdminBookings from '../components/AdminBookings';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';




// Remove static sectionKeyList, use dynamic fetching

const Admin = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookings') {
      setLoading(true);
      fetch('/api/bookings')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch bookings');
          return res.json();
        })
        .then((data) => {
          setBookings(data);
          setLoading(false);
        })
        .catch((err) => {
          setBookings([]);
          setLoading(false);
        });
    }
  }, [activeTab]);



  return (
    <>
      <div className="flex gap-2 mb-4 sticky top-0 z-50 bg-white py-2 border-b border-gray-200 shadow-sm">
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'bookings' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('bookings')}
        >Bookings</button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors duration-150 ${activeTab === 'calendar' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('calendar')}
        >Calendar</button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bg-white rounded shadow p-2">
          <AdminBookings />
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded shadow p-4">Calendar view coming soon.</div>
      )}
    </>
  );
};

export default Admin;