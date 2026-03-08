import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const Accommodation = () => {
    // Booking.com script injection removed
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const content = {
    nl: {
      title: 'Accommodatie op Koh Tao',
      subtitle: 'Vind je perfecte verblijf, van luxe resorts tot budgethostels en alles ertussenin.',
      whereTitle: 'Waar overnachten',
      intro:
        'Koh Tao biedt een breed aanbod aan accommodaties voor elke stijl en elk budget. Of je nu zoekt naar een villa aan het strand, een knusse bungalow of een sociaal hostel: op het eiland is volop keuze.',
      options: [
        { label: 'Luxe resorts:', text: 'Geniet van zeezicht, infinity pools en spa-behandelingen bij topaccommodaties.' },
        { label: 'Strandbungalows:', text: 'Stap direct vanuit je kamer het zand op — perfect voor een tropische sfeer.' },
        { label: 'Hostels & guesthouses:', text: 'Ideaal voor backpackers en solo-reizigers, met sociale ruimtes en betaalbare prijzen.' },
        { label: 'Familiehotels:', text: 'Ervaar lokale gastvrijheid en comfort in de dorpen van het eiland.' },
        { label: 'Eco-lodges:', text: 'Verblijf duurzaam in accommodaties midden in de natuur.' },
      ],
      areas:
        'Populaire gebieden zijn Sairee Beach (levendig, veel restaurants en uitgaan), Mae Haad (handig voor de ferry) en Chalok Baan Kao (rustig en relaxed).',
      diveStay: 'Boek duiken + verblijf',
      tip: 'Tip: boek vroeg voor de beste keuze, vooral in december–april en juli–augustus.',
      inspirationTitle: 'Inspiratie nodig?',
      inspiration: [
        'Reis je met vrienden? Kies een strandbungalow voor een gezellige sfeer.',
        'Beperkt budget? Hostels en guesthouses in Mae Haad en Sairee bieden veel waarde.',
        'Op zoek naar romantiek? Boek een villa op de heuvel met zonsondergangzicht.',
      ],
      moreTips: 'Voor meer tips kun je contact opnemen via',
    },
    en: {
      title: 'Accommodation on Koh Tao',
      subtitle: 'Find your perfect stay, from luxury resorts to budget hostels and everything in between.',
      whereTitle: 'Where to stay',
      intro:
        'Koh Tao offers a wide range of accommodation for every style and budget. Whether you are looking for a beachfront villa, a cozy bungalow, or a social hostel, the island has plenty of options.',
      options: [
        { label: 'Luxury resorts:', text: 'Enjoy sea views, infinity pools, and spa treatments at top accommodations.' },
        { label: 'Beach bungalows:', text: 'Step straight from your room onto the sand — perfect for a tropical atmosphere.' },
        { label: 'Hostels & guesthouses:', text: 'Ideal for backpackers and solo travelers, with social spaces and affordable prices.' },
        { label: 'Family hotels:', text: 'Experience local hospitality and comfort in the island’s villages.' },
        { label: 'Eco lodges:', text: 'Stay sustainably in accommodations surrounded by nature.' },
      ],
      areas:
        'Popular areas include Sairee Beach (lively, with many restaurants and nightlife), Mae Haad (convenient for the ferry), and Chalok Baan Kao (quiet and relaxed).',
      diveStay: 'Book diving + stay',
      tip: 'Tip: book early for the best choice, especially in December–April and July–August.',
      inspirationTitle: 'Need inspiration?',
      inspiration: [
        'Traveling with friends? Choose a beach bungalow for a fun and social atmosphere.',
        'On a tighter budget? Hostels and guesthouses in Mae Haad and Sairee offer great value.',
        'Looking for romance? Book a hillside villa with sunset views.',
      ],
      moreTips: 'For more tips, contact us via',
    },
  };
  const pageContent = isDutch ? content.nl : content.en;

  return (
  <main className="max-w-4xl mx-auto">
    {/* Hero Section */}
    <section className="relative h-64 md:h-96 flex items-center justify-center mb-8 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/acc-head.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="text-center text-white z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{pageContent.title}</h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto drop-shadow">{pageContent.subtitle}</p>
      </div>
    </section>

    {/* Main Content */}
    <section className="bg-white rounded-lg shadow p-6 md:p-10 mb-8">
      <h2 className="text-2xl font-semibold mb-4">{pageContent.whereTitle}</h2>
      <p className="mb-4">{pageContent.intro}</p>
      <ul className="list-disc pl-6 mb-4">
        {pageContent.options.map((option) => (
          <li key={option.label + option.text}><strong>{option.label}</strong> {option.text}</li>
        ))}
      </ul>
      <p className="mb-4">{pageContent.areas}</p>
      <div className="flex flex-wrap gap-4 mb-4">
        <Link to="/agoda-hotels" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition">Agoda</Link>
        <a href="/#contact" className="inline-block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition">{pageContent.diveStay}</a>
      </div>
      <p className="text-sm text-gray-500">{pageContent.tip}</p>
    </section>

    {/* Inspiration Section */}
    <section className="bg-gray-50 rounded-lg shadow p-6 md:p-10">
      <h3 className="text-xl font-semibold mb-2">{pageContent.inspirationTitle}</h3>
      <ul className="list-disc pl-6 mb-2">
        {pageContent.inspiration.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="mt-2">{pageContent.moreTips} <a href="mailto:contact@divinginasia.com" className="text-blue-600 underline hover:text-blue-800">contact@divinginasia.com</a>.</p>
    </section>
  </main>
  );
};

export default Accommodation;
