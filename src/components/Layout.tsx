import React from 'react';
import Navigation from './Navigation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { trackAffiliateClick } from '@/lib/affiliateTracking';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import CookieConsent from './CookieConsent';

const TRIP_ALLIANCE_ID = import.meta.env.VITE_TRIP_ALLIANCE_ID as string | undefined;
const TRIP_SITE_ID = import.meta.env.VITE_TRIP_SITE_ID as string | undefined;
const WHATSAPP_LINK = 'https://wa.me/66612345678';
const FACEBOOK_LINK = 'https://www.facebook.com/profile.php?id=61553713498498';
const INSTAGRAM_LINK = 'https://www.instagram.com/pro_diving_asia/';

const trackBookingWidgetClick = (source: 'left-widget' | 'mobile-sticky') => {
  try {
    const key = `booking-widget-clicks:${source}`;
    const current = Number(window.localStorage.getItem(key) || '0');
    window.localStorage.setItem(key, String(current + 1));

    const payload = {
      event: 'booking_widget_click',
      source,
      path: window.location.pathname,
      clicked_at: new Date().toISOString(),
    };

    if (Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push(payload);
    }

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'booking_widget_click', {
        source,
        page_path: window.location.pathname,
      });
    }
  } catch {
    // Tracking should never block navigation.
  }
};

const buildTripFooterUrl = () => {
  const baseUrl = 'https://www.trip.com/';
  const params = new URLSearchParams();

  if (TRIP_ALLIANCE_ID) params.set('allianceid', TRIP_ALLIANCE_ID);
  if (TRIP_SITE_ID) params.set('sid', TRIP_SITE_ID);

  const query = params.toString();
  return query ? `${baseUrl}?${query}` : baseUrl;
};

const Footer: React.FC = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const tripUrl = buildTripFooterUrl();

  const handleTripClick = () => {
    trackAffiliateClick({
      provider: 'trip',
      destinationUrl: tripUrl,
      placement: 'footer-link',
      hotelName: 'Trip.com Footer',
      affiliateId: TRIP_ALLIANCE_ID || TRIP_SITE_ID || null,
    });
  };

  return (
  <footer className="bg-[#0b1e3d] text-white mt-12">
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="text-xl font-bold text-blue-400 mb-3">Pro Diving Asia</div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            {isDutch
              ? 'De toonaangevende duikschool van Koh Tao. PADI-cursussen, fun dives en onvergetelijke onderwateravonturen.'
              : 'Koh Tao’s leading dive school. PADI courses, fun dives, and unforgettable underwater adventures.'}
          </p>
          <a href="/#contact" className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition">
            {isDutch ? 'Boek nu' : 'Book now'}
          </a>
          <div className="mt-4">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">{isDutch ? 'Volg ons' : 'Follow us'}</div>
            <div className="flex items-center gap-3">
              <a
                href={FACEBOOK_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                aria-label="WhatsApp"
                className="text-gray-300 hover:text-white transition"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Diving */}
        <div>
          <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">{isDutch ? 'Duiken' : 'Diving'}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/courses/open-water" className="hover:text-white transition">Open Water</Link></li>
            <li><Link to="/courses/discover-scuba" className="hover:text-white transition">{isDutch ? 'Discover Scuba (DSD)' : 'Discover Scuba (DSD)'}</Link></li>
            <li><Link to="/courses/discover-scuba-deluxe" className="hover:text-white transition">{isDutch ? 'Discover Scuba Deluxe' : 'Discover Scuba Deluxe'}</Link></li>
            <li><Link to="/courses/advanced" className="hover:text-white transition">Advanced</Link></li>
            <li><Link to="/courses/rescue" className="hover:text-white transition">Rescue Diver</Link></li>
            <li><Link to="/fun-diving-koh-tao" className="hover:text-white transition">Fun Diving</Link></li>
            <li><Link to="/koh-tao-dive-sites" className="hover:text-white transition">{isDutch ? 'Duiklocaties' : 'Dive Sites'}</Link></li>
            <li><Link to="/marine-life" className="hover:text-white transition">{isDutch ? 'Mariene leven' : 'Marine life'}</Link></li>
          </ul>
        </div>

        {/* Koh Tao */}
        <div>
          <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">Koh Tao</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/koh-tao-info" className="hover:text-white transition">{isDutch ? 'Over Koh Tao' : 'About Koh Tao'}</Link></li>
            <li><Link to="/Accommodation" className="hover:text-white transition">{isDutch ? 'Accommodatie' : 'Accommodation'}</Link></li>
            <li><Link to="/BeachesKohTao" className="hover:text-white transition">{isDutch ? 'Stranden' : 'Beaches'}</Link></li>
            <li><Link to="/FoodDrink" className="hover:text-white transition">{isDutch ? 'Eten & Drinken' : 'Food & Drink'}</Link></li>
            <li><Link to="/ThingsToDo" className="hover:text-white transition">{isDutch ? 'Activiteiten' : 'Activities'}</Link></li>
            <li><Link to="/HowToGetHere" className="hover:text-white transition">{isDutch ? 'Hoe kom je hier' : 'How to get here'}</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">{isDutch ? 'Informatie' : 'Information'}</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/WeatherKohTao" className="hover:text-white transition">{isDutch ? 'Weer' : 'Weather'}</Link></li>
            <li><Link to="/VisasKohTao" className="hover:text-white transition">Visas</Link></li>
            <li><Link to="/MedicalServices" className="hover:text-white transition">{isDutch ? 'Medisch' : 'Medical'}</Link></li>
            <li><Link to="/accommodation-booking" className="hover:text-white transition">Booking.com</Link></li>
            <li>
              <a
                href={tripUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTripClick}
                className="hover:text-white transition"
              >
                Trip.com
              </a>
            </li>
            <li><Link to="/agoda-hotels" className="hover:text-white transition">Agoda</Link></li>
            <li><Link to="/#contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a3a5c] pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Pro Diving Asia — All rights reserved | Powered By{' '}
        <a href="https://www.onemedia.asia" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition font-medium">
          One Media Asia
        </a>
      </div>
    </div>
  </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(isDutch ? 'Succesvol uitgelogd' : 'Successfully logged out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      {isAdminRoute && (
        {!isAdminRoute && <Navigation />}
        {isAdminRoute && (
          <div className="fixed top-20 right-4 z-50">
            <Button variant="outline" onClick={handleLogout}>{isDutch ? 'Uitloggen' : 'Successfully logged out'}</Button>
          </div>
      )}
      <Link
        to="/booking?source=left-widget"
        onClick={() => trackBookingWidgetClick('left-widget')}
        className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-r-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 motion-safe:animate-pulse md:block"
        aria-label={isDutch ? 'Boek nu' : 'Book now'}
        title={isDutch ? 'Boek nu' : 'Book now'}
      >
        {isDutch ? 'Boek nu' : 'Book now'}
      </Link>
      <Link
        to="/booking?source=mobile-sticky"
        onClick={() => trackBookingWidgetClick('mobile-sticky')}
        className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 motion-safe:animate-pulse md:hidden"
        aria-label={isDutch ? 'Boek nu' : 'Book now'}
        title={isDutch ? 'Boek nu' : 'Book now'}
      >
        {isDutch ? 'Boek nu' : 'Book now'}
      </Link>
      <main className="flex-1">{children}</main>
      <CookieConsent />
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isDutch ? 'Chat via WhatsApp' : 'Chat on WhatsApp'}
        title={isDutch ? 'Chat via WhatsApp' : 'Chat on WhatsApp'}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition hover:bg-green-600 hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
      <Footer />
    </div>
  );
};

export default Layout;
