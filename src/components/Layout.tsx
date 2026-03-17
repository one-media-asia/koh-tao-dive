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
      return (
        <div className="min-h-screen flex flex-col bg-background">
          <Navigation user={user} isAdmin={isAdmin} isAdminRoute={isAdminRoute} />
          {isAdminRoute && (
            <div className="fixed top-20 right-4 z-50">
              <Button variant="outline" onClick={handleLogout}>
                {isDutch ? 'Uitloggen' : 'Successfully logged out'}
              </Button>
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
            {/* Trip.com and Agoda links removed as requested */}
            <li><Link to="/#contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1a3a5c] pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Pro Diving Asia — All rights reserved | Powered By{' '}
        <a href="https://www.onemedia.asia" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition font-medium">
          One Media Asia Co, Ltd
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
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // Import here to avoid circular dependency
      const { hasAdminAccess } = await import('@/lib/adminAccess');
      setIsAdmin(user ? hasAdminAccess(user) : false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      import('@/lib/adminAccess').then(({ hasAdminAccess }) => {
        setIsAdmin(user ? hasAdminAccess(user) : false);
      });
    });
    return () => { subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success(isDutch ? 'Succesvol uitgelogd' : 'Successfully logged out');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation user={user} isAdmin={isAdmin} isAdminRoute={isAdminRoute} />
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
