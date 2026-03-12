import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, RefreshCw } from 'lucide-react';
import { hasAdminAccess } from '@/lib/adminAccess';

interface PageContentEditorProps {
  pageSlug: string;
  locale: string;
}

interface ContentItem {
  section_key: string;
  content_value: string;
  content_type: string;
  label: string;
}

const PAGE_DEFINITIONS: Record<string, ContentItem[]> = {
  'open-water': [
    { section_key: 'hero_title', content_value: 'PADI Open Water Course', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: "The world's most popular scuba course. Learn the fundamentals and get certified to dive independently to 18 metres/60 feet.", content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'The Open Water course combines knowledge development, confined water dives (pool) and open water dives.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '11000', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '320', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '290', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '3-4 days', content_type: 'text', label: 'Duration' },
  ],
  'advanced': [
    { section_key: 'hero_title', content_value: 'PADI Advanced Open Water Course', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Expand your skills with adventure dives. Explore deeper depths, improve navigation, and try specialties.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'The Advanced course consists of 5 adventure dives, including deep and navigation (required), plus 3 electives of your choice.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '9500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '275', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '250', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  'rescue': [
    { section_key: 'hero_title', content_value: 'PADI Rescue Diver Course', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Learn to prevent and manage dive emergencies. Essential skills for any serious diver.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Build confidence in handling emergencies underwater and at the surface through realistic rescue scenarios.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '12500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '360', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '330', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '3 days', content_type: 'text', label: 'Duration' },
  ],
  'efr': [
    { section_key: 'hero_title', content_value: 'Emergency First Response (EFR)', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Learn CPR, first aid, and emergency response. Required for Rescue Diver certification.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Practice primary and secondary care skills including bandaging, splinting, and emergency assessments.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '4500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '130', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '120', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '1 day', content_type: 'text', label: 'Duration' },
  ],
  'divemaster': [
    { section_key: 'hero_title', content_value: 'PADI Divemaster Course', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Begin your professional diving career. Learn leadership, supervision and dive management skills.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Develops dive leadership skills including supervising activities, assisting instructors, and guiding certified divers.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '41000', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '1190', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '1090', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2-4 weeks', content_type: 'text', label: 'Duration' },
  ],
  'instructor': [
    { section_key: 'hero_title', content_value: 'PADI Instructor Development Course (IDC)', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Become a PADI Instructor. Transform your passion into a career teaching scuba diving.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Comprehensive training in teaching methodology, dive theory, and student management. Prepares you for the IE.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '59000', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '1710', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '1560', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2-3 weeks', content_type: 'text', label: 'Duration' },
  ],
  'discover-scuba': [
    { section_key: 'hero_title', content_value: 'Discover Scuba Diving', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Try scuba diving for the first time. No experience necessary!', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'A quick introduction to scuba diving. Pool practice followed by a shallow ocean dive.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '2900', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '85', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '78', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: 'Half day', content_type: 'text', label: 'Duration' },
  ],
  'scuba-diver': [
    { section_key: 'hero_title', content_value: 'PADI Scuba Diver Certification', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Get certified in just 2 days. Perfect for those with limited time.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'A shorter version of Open Water. Certifies you to dive with a professional to 12 meters.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '8500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '245', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '225', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  'scuba-review': [
    { section_key: 'hero_title', content_value: 'Scuba Review / ReActivate', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: "Haven't dived in a while? Refresh your skills with a professional instructor.", content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Quick knowledge review followed by confined and open water skill practice.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '3500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '100', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '92', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '1 day', content_type: 'text', label: 'Duration' },
  ],
  'discover-scuba-deluxe': [
    { section_key: 'hero_title', content_value: 'Discover Scuba Diving Deluxe', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'An upgraded first dive experience with extra dives and a professional photo package.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Includes a briefing, two open water dives, and an underwater photo session.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '4500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '130', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '120', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '1 day', content_type: 'text', label: 'Duration' },
  ],
  'msdt-program': [
    { section_key: 'hero_title', content_value: 'MSDT Program', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Become a Master Scuba Diver Trainer. The highest non-professional rating in recreational diving.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Combine your Divemaster or Instructor rating with 5 specialty instructor certifications.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '25000', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '720', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '660', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: 'Varies', content_type: 'text', label: 'Duration' },
  ],
  'fun-diving': [
    { section_key: 'hero_title', content_value: 'Fun Diving Koh Tao', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Explore the best dive sites around Koh Tao and the Gulf of Thailand.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'overview', content_value: 'Join our experienced dive guides for single or multiple fun dives at Koh Tao\'s top sites.', content_type: 'text', label: 'Overview' },
    { section_key: 'price_per_dive_thb', content_value: '950', content_type: 'text', label: 'Price Per Dive (THB)' },
    { section_key: 'price_per_dive_usd', content_value: '27', content_type: 'text', label: 'Price Per Dive (USD)' },
    { section_key: 'price_per_dive_eur', content_value: '25', content_type: 'text', label: 'Price Per Dive (EUR)' },
  ],
  // SPECIALTIES
  'specialty/night-diver': [
    { section_key: 'hero_title', content_value: 'Night Diver Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Experience the underwater world after dark — a completely different perspective.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Complete 3 night dives and learn to navigate, communicate, and manage buoyancy in the dark.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '6500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '188', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '172', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  'specialty/deep-diver': [
    { section_key: 'hero_title', content_value: 'Deep Diver Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Go deeper — safely. Learn the skills to dive to 40 metres/130 feet.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Four dives covering deep dive planning, buoyancy control, gas management, and narcosis awareness.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '6500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '188', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '172', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  'specialty/wreck-diver': [
    { section_key: 'hero_title', content_value: 'Wreck Diver Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Explore sunken ships and artificial reefs. Discover the history beneath the waves.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Four dives on real wrecks covering survey techniques, navigation, and safe penetration procedures.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '8500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '245', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '225', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  'specialty/enriched-air': [
    { section_key: 'hero_title', content_value: 'Enriched Air Nitrox Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Extend your bottom time with Nitrox. The world\'s most popular specialty.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Learn to plan and make dives with enriched air mixtures of up to 40% oxygen.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '4500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '130', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '120', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '1 day', content_type: 'text', label: 'Duration' },
  ],
  'specialty/underwater-photography': [
    { section_key: 'hero_title', content_value: 'Underwater Photography Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Capture the beauty of the ocean. Learn to take stunning photos underwater.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Two dives focusing on composition, lighting, and techniques to photograph marine life.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '5500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '158', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '145', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '1-2 days', content_type: 'text', label: 'Duration' },
  ],
  'specialty/sidemount': [
    { section_key: 'hero_title', content_value: 'Sidemount Diver Specialty', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Streamline your diving. Mount your cylinders at your sides for improved trim and flexibility.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'course_overview', content_value: 'Learn to configure and dive with sidemount equipment across three open water dives.', content_type: 'text', label: 'Course Overview' },
    { section_key: 'price_thb', content_value: '8500', content_type: 'text', label: 'Price (THB)' },
    { section_key: 'price_usd', content_value: '245', content_type: 'text', label: 'Price (USD)' },
    { section_key: 'price_eur', content_value: '225', content_type: 'text', label: 'Price (EUR)' },
    { section_key: 'duration', content_value: '2 days', content_type: 'text', label: 'Duration' },
  ],
  // DIVE SITES
  'dive-sites/sail-rock': [
    { section_key: 'hero_title', content_value: 'Sail Rock', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'One of the best dive sites in Southeast Asia. Famous for whale shark sightings.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'A massive pinnacle rising from 40m to just below the surface, with a unique vertical chimney swim-through.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '5–40m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Intermediate – Advanced', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Whale sharks, barracuda, batfish, giant grouper', content_type: 'text', label: 'Highlights' },
  ],
  'dive-sites/chumphon-pinnacle': [
    { section_key: 'hero_title', content_value: 'Chumphon Pinnacle', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'A world-class dive site with massive schools of fish and regular whale shark sightings.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Four large granite pinnacles covered in soft corals, anemones, and abundant marine life.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '14–40m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Intermediate – Advanced', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Whale sharks, chevron barracuda, giant grouper', content_type: 'text', label: 'Highlights' },
  ],
  'dive-sites/japanese-gardens': [
    { section_key: 'hero_title', content_value: 'Japanese Gardens', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'A stunning shallow reef perfect for beginners and snorkellers.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Colourful coral gardens teeming with reef fish, turtles, and moray eels in calm, clear water.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '4–20m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Beginner – Intermediate', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Turtles, moray eels, clownfish, vibrant corals', content_type: 'text', label: 'Highlights' },
  ],
  'dive-sites/htms-sattakut': [
    { section_key: 'hero_title', content_value: 'HTMS Sattakut Wreck', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'A 50-metre warship deliberately sunk to create an artificial reef.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'The HTMS Sattakut lies at 30m and has become home to thousands of fish and spectacular soft corals.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '22–30m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Intermediate – Advanced', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Wreck penetration, lionfish, batfish, moray eels', content_type: 'text', label: 'Highlights' },
  ],
  'dive-sites/twins': [
    { section_key: 'hero_title', content_value: 'The Twins', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Two parallel rocky ridges with rich corals and an abundance of marine life.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'A popular site suitable for all levels featuring arches, swim-throughs, and colourful reef fish.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '8–20m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Beginner – Intermediate', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Trevally, snapper, fusiliers, moray eels', content_type: 'text', label: 'Highlights' },
  ],
  'dive-sites/shark-island': [
    { section_key: 'hero_title', content_value: 'Shark Island', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'A rocky outcrop with strong currents and exciting encounters with larger pelagics.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Boulders and rock formations create a dynamic dive with frequent encounters with reef sharks and rays.', content_type: 'textarea', label: 'Description' },
    { section_key: 'depth', content_value: '6–25m', content_type: 'text', label: 'Depth Range' },
    { section_key: 'difficulty', content_value: 'Intermediate', content_type: 'text', label: 'Difficulty' },
    { section_key: 'highlights', content_value: 'Blacktip reef sharks, stingrays, scorpionfish', content_type: 'text', label: 'Highlights' },
  ],
  // MARINE LIFE
  'marine-life/whale-shark': [
    { section_key: 'hero_title', content_value: 'Whale Shark', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'The ocean\'s gentle giant. Encounter the world\'s largest fish at Koh Tao.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Whale sharks are filter feeders that can reach up to 12m in length. Koh Tao is one of the best places in the world to encounter them.', content_type: 'textarea', label: 'Description' },
    { section_key: 'best_season', content_value: 'March – May and October – December', content_type: 'text', label: 'Best Season' },
    { section_key: 'best_sites', content_value: 'Sail Rock, Chumphon Pinnacle', content_type: 'text', label: 'Best Dive Sites' },
  ],
  'marine-life/green-sea-turtle': [
    { section_key: 'hero_title', content_value: 'Green Sea Turtle', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'One of the most beloved residents of Koh Tao\'s reefs.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Green sea turtles are commonly spotted grazing on seagrass and resting on the reef around Koh Tao.', content_type: 'textarea', label: 'Description' },
    { section_key: 'best_season', content_value: 'Year-round', content_type: 'text', label: 'Best Season' },
    { section_key: 'best_sites', content_value: 'Japanese Gardens, Mango Bay, Hin Wong Pinnacle', content_type: 'text', label: 'Best Dive Sites' },
  ],
  'marine-life/hawksbill-turtle': [
    { section_key: 'hero_title', content_value: 'Hawksbill Sea Turtle', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'A critically endangered species with a striking narrow beak and stunning shell pattern.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'description', content_value: 'Hawksbill turtles feed on sponges and are occasionally spotted on Koh Tao\'s coral reefs.', content_type: 'textarea', label: 'Description' },
    { section_key: 'best_season', content_value: 'Year-round', content_type: 'text', label: 'Best Season' },
    { section_key: 'best_sites', content_value: 'Japanese Gardens, Shark Island, Twins', content_type: 'text', label: 'Best Dive Sites' },
  ],
  // INFO PAGES
  'accommodation': [
    { section_key: 'hero_title', content_value: 'Accommodation on Koh Tao', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Find the perfect place to stay during your diving holiday.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'intro', content_value: 'Koh Tao offers a wide range of accommodation from budget bungalows to luxury resorts, many right on the beach.', content_type: 'textarea', label: 'Introduction' },
  ],
  'koh-tao-info': [
    { section_key: 'hero_title', content_value: 'Koh Tao Island Guide', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Everything you need to know about the Dive Capital of Thailand.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'intro', content_value: 'Koh Tao is a small island in the Gulf of Thailand, world-famous for its affordable diving courses and stunning marine life.', content_type: 'textarea', label: 'Introduction' },
  ],
  'how-to-get-here': [
    { section_key: 'hero_title', content_value: 'How to Get to Koh Tao', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Travel options from Bangkok and beyond to the Gulf of Thailand\'s diving paradise.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'intro', content_value: 'Koh Tao is accessible by ferry from Chumphon or Surat Thani, with connecting buses, trains, and flights from Bangkok.', content_type: 'textarea', label: 'Introduction' },
  ],
  'things-to-do': [
    { section_key: 'hero_title', content_value: 'Things to Do on Koh Tao', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'Beyond diving — explore beaches, viewpoints, food, and nightlife.', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'intro', content_value: 'Koh Tao has plenty to offer outside of diving, from jungle hikes and stunning viewpoints to fresh seafood and sunset bars.', content_type: 'textarea', label: 'Introduction' },
  ],
  'weather': [
    { section_key: 'hero_title', content_value: 'Koh Tao Weather', content_type: 'text', label: 'Hero Title' },
    { section_key: 'hero_subtitle', content_value: 'When is the best time to visit and dive at Koh Tao?', content_type: 'text', label: 'Hero Subtitle' },
    { section_key: 'intro', content_value: 'Koh Tao has a tropical climate with two main seasons. The best diving conditions are typically from March to September.', content_type: 'textarea', label: 'Introduction' },
    { section_key: 'best_months', content_value: 'March – September', content_type: 'text', label: 'Best Months' },
    { section_key: 'avg_water_temp', content_value: '28–30°C', content_type: 'text', label: 'Average Water Temp' },
    { section_key: 'avg_visibility', content_value: '10–25m', content_type: 'text', label: 'Average Visibility' },
  ],
};

export const PageContentEditor: React.FC<PageContentEditorProps> = ({ pageSlug, locale }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user ? hasAdminAccess(user) : false);
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      const template = PAGE_DEFINITIONS[pageSlug] || [];
      
      try {
        // @ts-expect-error - page_content table will be available after migration
        const { data, error } = await supabase
          .from('page_content')
          .select('section_key, content_value, content_type')
          .eq('page_slug', pageSlug)
          .eq('locale', locale);

        if (error) throw error;

        const loadedItems = template.map((item) => {
          const dbItem = data?.find((d: any) => d.section_key === item.section_key);
          return {
            ...item,
            content_value: dbItem?.content_value || item.content_value,
          };
        });

        setContentItems(loadedItems);
      } catch (err) {
        console.error('Failed to load content:', err);
        toast.error('Failed to load page content');
        setContentItems(template);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [pageSlug, locale]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const upserts = contentItems.map((item) => ({
        page_slug: pageSlug,
        locale,
        section_key: item.section_key,
        content_type: item.content_type,
        content_value: item.content_value,
        updated_by: user?.email || null,
      }));

      // @ts-expect-error - page_content table will be available after migration
      const { error } = await supabase
        .from('page_content')
        .upsert(upserts, { onConflict: 'page_slug,locale,section_key' });

      if (error) throw error;

      toast.success('Page content saved successfully');
    } catch (err) {
      console.error('Failed to save content:', err);
      toast.error('Failed to save page content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (sectionKey: string, value: string) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.section_key === sectionKey ? { ...item, content_value: value } : item
      )
    );
  };

  if (!isAdmin) return null;
  if (isLoading) return <div className="p-4">Loading editor...</div>;

  return (
    <Card className="mt-8 border-yellow-300 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Page Content Editor
        </CardTitle>
        <CardDescription>
          Admin-only: Edit page content for {pageSlug} ({locale})
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contentItems.map((item) => (
          <div key={item.section_key} className="space-y-2">
            <Label htmlFor={item.section_key}>{item.label}</Label>
            {item.content_type === 'text' && item.content_value.length < 150 ? (
              <Input
                id={item.section_key}
                value={item.content_value}
                onChange={(e) => handleChange(item.section_key, e.target.value)}
                className="bg-white"
              />
            ) : (
              <Textarea
                id={item.section_key}
                value={item.content_value}
                onChange={(e) => handleChange(item.section_key, e.target.value)}
                rows={4}
                className="bg-white"
              />
            )}
          </div>
        ))}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};
