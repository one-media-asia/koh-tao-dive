import React, { useState } from 'react';
import AdminBookings from './AdminBookings';

const TABS = [
  { key: 'bookings', label: 'Bookings' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'project', label: 'Project Manager' },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 text-sm text-slate-700 text-center">
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('pages'); }} className="hover:underline mx-2">Pages Manager</a>
        |
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('project'); }} className="hover:underline mx-2">Project Manager</a>
        |
        <a href="#" onClick={e => { e.preventDefault(); setActiveTab('finance'); }} className="hover:underline mx-2">Global Finance Defaults</a>
        |
        <a href="/" className="hover:underline mx-2">Back to Main Page</a>
      </div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex gap-4 mb-6 border-b pb-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-t ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded shadow p-6 min-h-[300px]">
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'tickets' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tickets</h2>
            {/* TODO: Create/view/update tickets here */}
            <p>Ticket management coming soon...</p>
          </div>
        )}
        {activeTab === 'invoices' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Invoices</h2>
            {/* TODO: Generate/view/download invoices here */}
            <p>Invoice management coming soon...</p>
          </div>
        )}
        {activeTab === 'project' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Project Manager</h2>
            {/* TODO: Add project management features here */}
            <p>Project management coming soon...</p>
          </div>
        )}
        {activeTab === 'pages' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pages Manager</h2>
            {/* TODO: Add pages management features here */}
            <p>Pages management coming soon...</p>
          </div>
        )}
        {activeTab === 'finance' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Global Finance Defaults</h2>
            {/* TODO: Add global finance defaults features here */}
            <p>Finance defaults management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
