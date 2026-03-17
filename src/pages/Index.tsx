import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageContentEditor from '../components/PageContentEditor';
import { hasAdminAccess } from '@/lib/adminAccess';
import { tryAutoScroll } from '@/lib/scroll';
import Hero from '../components/Hero';
import DiveSites from '../components/DiveSites';
import Courses from '../components/Courses';
import Gallery from '../components/Gallery';
import About from '../components/About';
import Contact from '../components/Contact';
import FunDiving from './FunDiving';

const Index = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [user, setUser] = useState(null);
  // Always scroll to top on mount to prevent anchor jumps
  useEffect(() => {
    window.scrollTo(0, 0);
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const location = useLocation();

  // Removed auto-scroll logic for normal homepage behavior
  return (
    <div className="min-h-screen bg-background">
      {/* Admin-only page editor modal */}
      {user && hasAdminAccess(user) && (
        <>
          <button
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700"
            onClick={() => setShowEditor(true)}
            style={{ fontSize: '1rem' }}
          >
            Edit Page Content
          </button>
          {showEditor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg p-6 min-w-[340px] relative">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                  onClick={() => setShowEditor(false)}
                  aria-label="Close"
                >×</button>
                <PageContentEditor pageSlug="home" locale="en" />
              </div>
            </div>
          )}
        </>
      )}
      <Hero />
      <About />
      <DiveSites />
      <Courses />
      <FunDiving />
      <Gallery />
      <Contact />
    </div>
  );
};

export default Index;
