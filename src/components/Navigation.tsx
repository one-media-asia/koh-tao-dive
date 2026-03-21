  import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { hasAdminAccess } from '@/lib/adminAccess';
import { Badge } from '@/components/ui/badge';

const Navigation = ({ user, isAdmin, isAdminRoute }: { user?: any, isAdmin?: boolean, isAdminRoute?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [funDivingOpen, setFunDivingOpen] = useState(false);
  const [diveSitesOpen, setDiveSitesOpen] = useState(false);
  const [marineLifeOpen, setMarineLifeOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  // user, isAdmin, isAdminRoute now come from props
  const navigate = useNavigate();
  const location = useLocation();

  // Auth logic moved to Layout, props used here

  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    // href format: /path#anchor or /#anchor
    const parts = href.split('#');
    const path = parts[0] || '/';
    const anchor = parts[1];
    if (!anchor) return navigate(path || '/');

    // Fun Diving sections live inside tabs; always navigate with hash so page can switch tab first.
    if ((path === '/fun-diving-koh-tao' || path === 'fun-diving-koh-tao') && anchor) {
      try { sessionStorage.setItem('scrollTo', anchor); } catch (_) {}
      navigate(`/fun-diving-koh-tao#${anchor}`);
      setIsOpen(false);
      return;
    }

    // If already on target page, scroll directly
    if (location.pathname === (path === '' ? '/' : path)) {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
        return;
      }
    }

    // Otherwise store desired anchor and navigate — page will read sessionStorage and scroll on mount
    try { sessionStorage.setItem('scrollTo', anchor); } catch (_) {}
    // update URL with hash for clarity
    const targetPath = (path === '' ? '/' : path);
    navigate(`${targetPath}#${anchor}`);
    setIsOpen(false);
  };
  const { t, i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const labels = {
    beginnerCourses: isDutch ? 'BEGINNERSCURSUSSEN' : 'BEGINNER COURSES',
    advancedCourses: isDutch ? 'GEVORDERDE CURSUSSEN' : 'ADVANCED COURSES',
    specialtyCourses: isDutch ? 'PADI SPECIALTY CURSUSSEN' : 'PADI SPECIALTY COURSES',
    professionalCourses: isDutch ? 'PROFESSIONELE CURSUSSEN' : 'PROFESSIONAL COURSES',
    marineLifeTitle: isDutch ? 'Marien leven' : 'Marine Life',
    marineLifeOverview: isDutch ? 'Overzicht marien leven' : 'Marine life overview',
    greenSeaTurtle: isDutch ? 'Groene zeeschildpad' : 'Green sea turtle',
    hawksbillSeaTurtle: isDutch ? 'Karetschildpad' : 'Hawksbill sea turtle',
    greatBarracuda: isDutch ? 'Grote barracuda' : 'Great barracuda',
    blacktipReefShark: isDutch ? 'Zwartpuntrifhaai' : 'Blacktip reef shark',
    bandedSeaKrait: isDutch ? 'Gestreepte zeekrait' : 'Banded sea krait',
    beardedScorpionfish: isDutch ? 'Baardschorpioenvis' : 'Bearded scorpionfish',
    diveSitesTitle: isDutch ? 'Duiklocaties' : 'Dive Sites',
    diveSitesOverview: isDutch ? 'Overzicht alle duiklocaties' : 'All dive sites overview',
    funDiveTrips: isDutch ? 'Fun Duiktrips' : 'Fun Dive Trips',
    boatSchedule: isDutch ? 'Bootschema' : 'Boat schedule',
    pricingPackages: isDutch ? 'Prijzen & pakketten' : 'Pricing & packages',
    diverRequirements: isDutch ? 'Vereisten voor duikers' : 'Diver requirements',
    chooseDiveCenter: isDutch ? 'Een duikcentrum kiezen' : 'Choosing a dive center',
    accommodation: isDutch ? 'Accommodatie' : 'Accommodation',
    thingsToDo: isDutch ? 'Wat te doen' : 'Things to do',
    banksKohTao: isDutch ? 'Banken op Koh Tao' : 'Banks on Koh Tao',
    beachesKohTao: isDutch ? 'Stranden op Koh Tao' : 'Beaches on Koh Tao',
    foodDrink: isDutch ? 'Eten & drinken' : 'Food & drink',
    howToGetHere: isDutch ? 'Hoe kom je hier' : 'How to get here',
    medicalServices: isDutch ? 'Medische zorg' : 'Medical services',
    viewpoints: isDutch ? 'Uitzichtpunten' : 'Viewpoints',
    weatherKohTao: isDutch ? 'Weer op Koh Tao' : 'Koh Tao weather',
    login: isDutch ? 'Inloggen' : 'Login',
    signup: isDutch ? 'Registreren' : 'Sign up',
  };

  const courseCategories = [
    {
      label: labels.beginnerCourses,
      items: [
        { name: 'PADI Open Water Course', to: '/courses/open-water' },
        { name: 'PADI Scuba Diver Course', to: '/courses/scuba-diver' },
        { name: isDutch ? 'Discover Scuba Diving (DSD)' : 'Discover Scuba Diving (DSD)', to: '/courses/discover-scuba' },
        { name: isDutch ? 'Discover Scuba Diving Deluxe' : 'Discover Scuba Diving Deluxe', to: '/courses/discover-scuba-deluxe' },
      ],
    },
    {
      label: labels.advancedCourses,
      items: [
        { name: 'Advanced Open Water', to: '/courses/advanced' },
        { name: 'EFR First Aid Course', to: '/courses/efr' },
        { name: 'PADI Rescue Diver Course', to: '/courses/rescue' },
        { name: 'Scuba Review', to: '/courses/scuba-review' },
      ],
    },
    {
      label: labels.specialtyCourses,
      items: [
        { name: 'Adaptive Support Diver', to: '/specialty/adaptive-support' },
        { name: 'Aware Fish Identification', to: '/specialty/fish-identification' },
        { name: 'Current Diver', to: '/specialty/current-diver' },
        { name: 'PADI Boat Diver', to: '/specialty/boat-diver' },
        { name: 'PADI Deep Diver', to: '/specialty/deep-diver' },
        { name: 'PADI DPV Diver', to: '/specialty/dpv-diver' },
        { name: 'Emergency O2 Provider', to: '/specialty/emergency-o2' },
        { name: 'Enriched Air Diver', to: '/specialty/enriched-air-diver' },
        { name: 'Equipment Specialist', to: '/specialty/equipment-specialist' },
        { name: 'PADI Night Diver', to: '/specialty/night-diver' },
        { name: 'PADI Peak Buoyancy', to: '/specialty/peak-performance-buoyancy' },
        { name: 'Search & Recovery Diver', to: '/specialty/search-recovery' },
        { name: 'Self Reliant Diver', to: '/specialty/self-reliant-diver' },
        { name: 'Sidemount Diver', to: '/specialty/sidemount-diver' },
        { name: 'Underwater Naturalist', to: '/specialty/underwater-naturalist' },
        { name: 'Underwater Navigator', to: '/specialty/underwater-navigator' },
        { name: 'Underwater Photography', to: '/specialty/photography' },
        { name: 'PADI Wreck Diver', to: '/specialty/wreck-diver' },
      ],
    },
    {
      label: labels.professionalCourses,
      items: [
        { name: t('courses.divemaster.title'), to: '/courses/divemaster' },
        { name: t('courses.instructor.title'), to: '/courses/instructor' },
        { name: 'Divemaster Internship', to: '/internship/divemaster' },
        { name: isDutch ? 'Instructeur Internship' : 'Instructor Internship', to: '/internship/instructor' },
        { name: 'PADI MSDT Program', to: '/courses/msdt-program' },
      ],
    },
    
    
  ];

  const marineLifeItems = [
    { name: labels.marineLifeOverview, to: '/marine-life' },
    { name: 'Whaleshark', to: '/marine-life/whaleshark' },
    { name: labels.greenSeaTurtle, to: '/marine-life/green-sea-turtle' },
    { name: labels.hawksbillSeaTurtle, to: '/marine-life/hawksbill-sea-turtle' },
    { name: labels.greatBarracuda, to: '/marine-life/great-barracuda' },
    { name: labels.blacktipReefShark, to: '/marine-life/black-tip-reef-shark' },
    { name: 'Malabar Grouper', to: '/marine-life/malabar-grouper' },
    { name: 'Cephalopods', to: '/marine-life/cephalopods' },
    { name: labels.bandedSeaKrait, to: '/marine-life/banded-sea-krait' },
    { name: labels.beardedScorpionfish, to: '/marine-life/bearded-scorpion-fish' },
    { name: 'Nudibranchs', to: '/marine-life/nudibranchs' },
  ];

  const navItems = [
    { name: t('nav.home'), href: 'https://divinginasia.com' },
    { name: t('nav.contact'), href: '/#contact' },
  ];

  if (isAdminRoute && isAdmin) {
    // Hide main menu for admins on admin pages
    return null;
  }
  // Standard/main navigation for all other users/routes
  return (
    <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 border-solid border-0 py-2">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Pro Diving Asia Logo" className="h-14 w-auto" style={{ display: 'block', marginRight: 12, marginLeft: 0 }} />
          </div>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              {t('nav.home')}
            </Link>

            {/* Courses mega dropdown */}
            <div className="relative group">
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {t('nav.courses')}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </Link>
              <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[1100px] p-6 flex gap-8">
                  {courseCategories.map((cat) => (
                    <div key={cat.label} className="flex-1">
                      <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#1a3a5c] pb-2">
                        {cat.label}
                      </h4>
                      <ul className="space-y-1">
                        {cat.items.map((item) => (
                          <li key={item.to}>
                            {item.to && item.to.startsWith('http') ? (
                              <a
                                href={item.to}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150 uppercase tracking-wide"
                              >
                                {item.name}
                              </a>
                            ) : (
                              <Link
                                to={item.to}
                                className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150 uppercase tracking-wide"
                              >
                                {item.name}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dive Sites dropdown */}
            <div className="relative group">
              <a
                href="#dive-sites"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {t('nav.diveSites')}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </a>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[300px] p-5">
                  <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#1a3a5c] pb-2">
                    {labels.diveSitesTitle}
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/koh-tao-dive-sites"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        {labels.diveSitesOverview}
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/SailRock"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Sail Rock
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dive-sites/chumphon-pinnacle"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Chumphon Pinnacle
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dive-sites/japanese-gardens"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Japanese Gardens
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dive-sites/twins-pinnacle"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Twins Pinnacle
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dive-sites/mango-bay"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Mango Bay
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Marine Life dropdown */}
            <div className="relative group">
              <Link
                to="/marine-life"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {t('nav.marineLife')}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </Link>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[300px] p-5">
                  <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#1a3a5c] pb-2">
                    {labels.marineLifeTitle}
                  </h4>
                  <ul className="space-y-1">
                    {marineLifeItems.map((item) => (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Fun Dive Trips dropdown */}
            <div className="relative group">
              <Link
                to="/fun-diving-koh-tao"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-1"
              >
                {labels.funDiveTrips}
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </Link>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[250px] p-5">
                  <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#1a3a5c] pb-2">
                    Fun diving
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      <Link
                        to="/fun-diving-koh-tao"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Fun diving Koh Tao
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/courses/discover-scuba"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Discover Scuba (DSD)
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/courses/discover-scuba-deluxe"
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        Discover Scuba Deluxe
                      </Link>
                    </li>
                    <li>
                      <a
                        href="/fun-diving-koh-tao#schedule"
                        onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#schedule')}
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        {labels.boatSchedule}
                      </a>
                    </li>
                    <li>
                      <a
                        href="/fun-diving-koh-tao#pricing"
                        onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#pricing')}
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        {labels.pricingPackages}
                      </a>
                    </li>
                    <li>
                      <a
                        href="/fun-diving-koh-tao#requirements"
                        onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#requirements')}
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        {labels.diverRequirements}
                      </a>
                    </li>
                    <li>
                      <a
                        href="/fun-diving-koh-tao#tips"
                        onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#tips')}
                        className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150"
                      >
                        {labels.chooseDiveCenter}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>


            {/* Info Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-1">
                Info
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </button>
              <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[250px] p-5">
                  <h4 className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#1a3a5c] pb-2">KOH TAO</h4>
                  <ul className="space-y-1">
                    <li><Link to="/Accommodation" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.accommodation}</Link></li>
                    <li><Link to="/ThingsToDo" className="block py-1.5 text-sm text-blue-400 hover:text-white hover:pl-1 transition-all duration-150">{labels.thingsToDo}</Link></li>
                    <li><Link to="/BanksKohTao" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.banksKohTao}</Link></li>
                    <li><Link to="/BeachesKohTao" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.beachesKohTao}</Link></li>
                    <li><Link to="/FoodDrink" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.foodDrink}</Link></li>
                    <li><Link to="/HowToGetHere" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.howToGetHere}</Link></li>
                    <li><Link to="/MedicalServices" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.medicalServices}</Link></li>
                    <li><Link to="/ViewpointsKohTao" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.viewpoints}</Link></li>
                    <li><Link to="/VisasKohTao" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">Visa</Link></li>
                    <li><Link to="/WeatherKohTao" className="block py-1.5 text-sm text-gray-300 hover:text-white hover:pl-1 transition-all duration-150">{labels.weatherKohTao}</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact stays as a single nav item */}
            <a
              href={navItems[1].href}
              onClick={(e) => handleAnchorClick(e, navItems[1].href)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {navItems[1].name}
            </a>

            {/* Account dropdown */}
            <div className="relative group">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                Account
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
              </button>
              <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#0b1e3d]/80 rounded-lg shadow-2xl border border-[#1a3a5c] min-w-[180px] p-3">
                  <ul className="space-y-1">
                    {user ? (
                      <>
                        <li className="text-xs text-gray-400 px-3 py-2 border-b border-[#1a3a5c]">
                          {user.email}
                        </li>
                        {isAdmin && (
                          <li className="px-3 py-2 border-b border-[#1a3a5c]">
                            <Badge className="bg-green-600">Admin</Badge>
                          </li>
                        )}
                        <li>
                          <Link
                            to="/account"
                            className="block py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#1a3a5c] transition-all duration-150 rounded"
                          >
                            My Account
                          </Link>
                        </li>
                        {isAdmin && (
                          <li>
                            <Link
                              to="/admin"
                              className="block py-2 px-3 text-sm text-green-400 hover:text-green-300 hover:bg-[#1a3a5c] transition-all duration-150 rounded font-medium"
                            >
                              Admin Dashboard
                            </Link>
                          </li>
                        )}
                        // ...removed Pages Manager link...
                        {isAdmin && (
                          <li>
                            <Link
                              to="/clicks-dashboard"
                              className="block py-2 px-3 text-sm text-blue-400 hover:text-blue-300 hover:bg-[#1a3a5c] transition-all duration-150 rounded font-medium"
                            >
                              📊 Analytics
                            </Link>
                          </li>
                        )}
                        <li>
                          <button
                            onClick={async () => {
                              await supabase.auth.signOut();
                              setUser(null);
                              setIsAdmin(false);
                              navigate('/');
                            }}
                            className="w-full text-left py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#1a3a5c] transition-all duration-150 rounded"
                          >
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to="/login"
                            className="block py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#1a3a5c] transition-all duration-150 rounded"
                          >
                            {labels.login}
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/signup"
                            className="block py-2 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#1a3a5c] transition-all duration-150 rounded"
                          >
                            {labels.signup}
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <LanguageSwitcher />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-blue-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-background border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t('nav.home')}
              </Link>

              <div>
                <button
                  onClick={() => setCoursesOpen(!coursesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  {t('nav.courses')}
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${coursesOpen ? 'rotate-90' : ''}`} />
                </button>
                {coursesOpen && (
                  <div className="pl-4 space-y-1 bg-muted rounded-lg mx-2 py-2">
                    {courseCategories.map((cat) => (
                      <div key={cat.label} className="mb-2">
                        <span className="block px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-wider">{cat.label}</span>
                        {cat.items.map((item) => (
                          item.to && item.to.startsWith('http') ? (
                            <a key={item.to} href={item.to} className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                          ) : (
                            <Link key={item.to} to={item.to} className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                              {item.name}
                            </Link>
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/koh-tao-dive-sites" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                {t('nav.diveSites')}
              </Link>

              {/* Mobile dive sites accordion */}
              <div>
                <button
                  onClick={() => setDiveSitesOpen(!diveSitesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  {labels.diveSitesTitle}
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${diveSitesOpen ? 'rotate-90' : ''}`} />
                </button>
                {diveSitesOpen && (
                  <div className="pl-4 space-y-1 bg-muted rounded-lg mx-2 py-2">
                    <Link to="/koh-tao-dive-sites" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      {labels.diveSitesOverview}
                    </Link>
                    <Link to="/dive-sites/sail-rock" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Sail Rock
                    </Link>
                    <Link to="/dive-sites/chumphon-pinnacle" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Chumphon Pinnacle
                    </Link>
                    <Link to="/dive-sites/japanese-gardens" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Japanese Gardens
                    </Link>
                    <Link to="/dive-sites/htms-sattakut" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      HTMS Sattakut
                    </Link>
                    <Link to="/dive-sites/twins-pinnacle" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Twins Pinnacle
                    </Link>
                    <Link to="/dive-sites/shark-island" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Shark Island
                    </Link>
                    <Link to="/dive-sites/mango-bay" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Mango Bay
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile fun dive trips accordion */}
              <div>
                <Link
                  to="/fun-diving-koh-tao"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  <span>{labels.funDiveTrips}</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${funDivingOpen ? 'rotate-90' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFunDivingOpen(!funDivingOpen);
                    }}
                  />
                </Link>
                {funDivingOpen && (
                  <div className="pl-4 space-y-1 bg-muted rounded-lg mx-2 py-2">
                    <Link to="/fun-diving-koh-tao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Fun diving Koh Tao
                    </Link>
                    <Link to="/courses/discover-scuba" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Discover Scuba (DSD)
                    </Link>
                    <Link to="/courses/discover-scuba-deluxe" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                      Discover Scuba Deluxe
                    </Link>
                    <a href="/fun-diving-koh-tao#schedule" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#schedule')}>
                      {labels.boatSchedule}
                    </a>
                    <a href="/fun-diving-koh-tao#pricing" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#pricing')}>
                      {labels.pricingPackages}
                    </a>
                    <a href="/fun-diving-koh-tao#requirements" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#requirements')}>
                      {labels.diverRequirements}
                    </a>
                    <a href="/fun-diving-koh-tao#tips" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={(e) => handleAnchorClick(e, '/fun-diving-koh-tao#tips')}>
                      {labels.chooseDiveCenter}
                    </a>
                  </div>
                )}
              </div>


              {/* Info Dropdown for Mobile */}
              <div>
                <button
                  onClick={() => setFunDivingOpen(!funDivingOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  Info
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${funDivingOpen ? 'rotate-90' : ''}`} />
                </button>
                {funDivingOpen && (
                  <div className="pl-4 space-y-1 bg-muted rounded-lg mx-2 py-2">
                    <Link to="/Accommodation" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.accommodation}</Link>
                    <Link to="/ThingsToDo" className="block px-3 py-1.5 text-sm text-blue-400 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.thingsToDo}</Link>
                    <Link to="/BanksKohTao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.banksKohTao}</Link>
                    <Link to="/BeachesKohTao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.beachesKohTao}</Link>
                    <Link to="/FoodDrink" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.foodDrink}</Link>
                    <Link to="/HowToGetHere" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.howToGetHere}</Link>
                    <Link to="/MedicalServices" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.medicalServices}</Link>
                    <Link to="/ViewpointsKohTao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.viewpoints}</Link>
                    <Link to="/VisasKohTao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>Visa</Link>
                    <Link to="/WeatherKohTao" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>{labels.weatherKohTao}</Link>
                  </div>
                )}
              </div>

              {/* Contact stays as a single nav item for mobile */}
              <a key={navItems[1].name} href={navItems[1].href} className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={(e) => handleAnchorClick(e, navItems[1].href)}>
                {navItems[1].name}
              </a>

              {/* Mobile account accordion */}
              <div>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-blue-600"
                >
                  <div className="flex items-center gap-2">
                    <span>Account</span>
                    {isAdmin && <Badge className="bg-green-600 text-xs">Admin</Badge>}
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${accountOpen ? 'rotate-90' : ''}`}
                  />
                </button>
                {accountOpen && (
                  <div className="pl-4 space-y-1 bg-muted rounded-lg mx-2 py-2">
                    {user ? (
                      <>
                        <div className="text-xs text-gray-400 px-3 py-2 border-b border-gray-200">
                          {user.email}
                        </div>
                        <Link to="/account" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                          My Account
                        </Link>
                        {isAdmin && (
                          <Link to="/clicks-dashboard" className="block px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setIsOpen(false)}>
                            📊 Analytics
                          </Link>
                        )}
                        <button
                          onClick={async () => {
                            await supabase.auth.signOut();
                            setUser(null);
                            setIsAdmin(false);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                          {labels.login}
                        </Link>
                        <Link to="/signup" className="block px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                          {labels.signup}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
