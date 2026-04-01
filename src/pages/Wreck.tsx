import React from 'react';

export default function Wreck() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Wreck Diving Koh Tao</h1>
      <p className="mb-8 text-lg text-gray-700">
        Discover the thrill of wreck diving around Koh Tao! Explore famous wrecks, marine life, and underwater history.
      </p>
      {/* Wreck Images Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Wreck Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <img src="/images/wreck.jpeg" alt="Wreck Dive Koh Tao" className="rounded shadow" />
          <img src="/images/blackturtledive.com-padi-wreck-specialty-diver-koh-tao.jpg" alt="Wreck Specialty Diver" className="rounded shadow" />
          <img src="/images/fraggle-rock-koh-tao-2.jpg" alt="Fraggle Rock Wreck" className="rounded shadow" />
          <img src="/images/wreck.jpeg" alt="Wreck Dive (images folder)" className="rounded shadow" />
        </div>
      </div>
    </div>
  );
}
