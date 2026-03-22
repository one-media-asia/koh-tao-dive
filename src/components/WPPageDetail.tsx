import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface WPContent {
  title: { rendered: string };
  content: { rendered: string };
  acf?: Record<string, any>;
}

const WPPageDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const [content, setContent] = useState<WPContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingWarning, setShowBookingWarning] = useState(false);
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  useEffect(() => {
    setLoading(true);
    setError(null);
    const pageSlug = isDutch ? `nl-${slug}` : slug;
    fetch(`https://admin.prodiving.asia/wp-json/wp/v2/pages?slug=${pageSlug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setContent(data[0]);
        } else {
          setContent(null);
          setError('Page not found.');
        }
        setLoading(false);
      })
      .catch(() => {
        setContent(null);
        setError('Failed to load content.');
        setLoading(false);
      });
  }, [slug, isDutch]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!content) return null;

  // Gallery images from ACF or fallback
  const gallery: string[] = content.acf?.gallery || [];
  // Overview text from ACF or fallback to content
  const overview: string = content.acf?.overview || content.content.rendered;
  // Quick facts from ACF
  const quickFacts = content.acf?.quick_facts || {};
  // What you can see from ACF
  const whatYouCanSee: string[] = content.acf?.what_you_can_see || [];
  // Marine life highlights from ACF
  const highlights: string[] = content.acf?.marine_life_highlights || [];
  // Booking text from ACF
  const bookingText: string = content.acf?.booking_text || '';
  const bookingUrl: string = content.acf?.booking_url || '#';

  return (
    <div className="bg-blue-100 min-h-screen py-8 px-2 md:px-8">
      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Gallery image"
                className="rounded-xl object-cover w-full h-56"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}

      {/* Main content grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Overview */}
        <section className="md:col-span-2 bg-blue-200 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <div
            className="mb-4 text-blue-900"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(overview) }}
          />
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-blue-900">
            {quickFacts.depth && (
              <div className="flex items-center gap-2">
                <span role="img" aria-label="Depth">🌊</span>
                <span className="font-semibold">Depth:</span> {quickFacts.depth}
              </div>
            )}
            {quickFacts.visibility && (
              <div className="flex items-center gap-2">
                <span role="img" aria-label="Visibility">👁️</span>
                <span className="font-semibold">Visibility:</span> {quickFacts.visibility}
              </div>
            )}
            {quickFacts.level && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Level:</span>
                <span className="bg-yellow-200 rounded px-2 py-0.5 text-sm font-semibold">{quickFacts.level}</span>
              </div>
            )}
            {quickFacts.best_time && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Best time:</span> <span>{quickFacts.best_time}</span>
              </div>
            )}
            {quickFacts.location && (
              <div className="flex items-center gap-2">
                <span role="img" aria-label="Location">🕒</span>
                <span className="font-semibold">Location:</span> {quickFacts.location}
              </div>
            )}
            {quickFacts.current && (
              <div className="flex items-center gap-2">
                <span role="img" aria-label="Current">🌀</span>
                <span className="font-semibold">Current:</span> {quickFacts.current}
              </div>
            )}
          </div>
        </section>

        {/* Quick facts */}
        <aside className="bg-blue-200 rounded-xl p-6 shadow flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-2">Quick facts</h3>
          {quickFacts.depth && <div><span className="font-semibold">Depth range:</span> {quickFacts.depth}</div>}
          {quickFacts.level && <div><span className="font-semibold">Level:</span> {quickFacts.level}</div>}
          {quickFacts.location && <div><span className="font-semibold">Location:</span> {quickFacts.location}</div>}
          {quickFacts.best_time && <div><span className="font-semibold">Best time:</span> {quickFacts.best_time}</div>}
        </aside>

        {/* What you can see */}
        <aside className="bg-blue-200 rounded-xl p-6 shadow flex flex-col gap-4 mt-6 md:mt-0">
          <h3 className="text-xl font-bold mb-2">What you can see</h3>
          <div className="flex flex-wrap gap-2">
            {whatYouCanSee.map((item, i) => (
              <span key={i} className="bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-900 border border-blue-300">
                {item}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* Marine life highlights and booking */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Marine life highlights */}
        <section className="md:col-span-2 bg-blue-200 rounded-xl p-6 shadow">
          <h3 className="text-xl font-bold mb-4">Marine life highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-blue-100 rounded px-3 py-2 text-blue-900">
                <span role="img" aria-label="Fish">🐟</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Booking card */}
        <aside className="bg-blue-200 rounded-xl p-6 shadow flex flex-col justify-between">
          <h3 className="text-xl font-bold mb-2">Ready to dive?</h3>
          <p className="mb-4">{bookingText}</p>
          <a
            href={bookingUrl}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book this dive site
          </a>
        </aside>
      </div>
    </div>
  );
};

export default WPPageDetail;
                <span>Contact</span>
