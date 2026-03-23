import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDeta';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '@/hooks/usePageContent';

const ChumphonPinnacle = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const locale = isDutch ? 'nl' : 'en';
  // fallbackContent for static/local dev
  const fallbackContent = {
    overview: 'Chumphon Pinnacle overview',
    quickFacts: JSON.stringify({ depth: '15-30m', difficulty: 'Advanced', location: '30 minutes offshore', bestTime: 'Year-round, peak season December-April' }),
    whatYouCanSee: JSON.stringify(['Whalesharks', 'Trevally Schools', 'Eagle Rays', 'Chevron Barracuda']),
    marineLifeHighlights: JSON.stringify(['Whalesharks (regular sightings)', 'Giant Trevally schools', 'Chevron Barracuda', 'Eagle Rays']),
    divingTips: JSON.stringify(['Advanced certification recommended due to depth and current', 'Early morning departures maximize wildlife sightings']),
    images: JSON.stringify([
      '/images/chumphon-pinnacle-top.webp',
      '/images/photo-1682686580849-3e7f67df4015.avif',
      '/images/photo-1613853250147-2f73e55c1561.avif',
      '/images/photo-1618865181016-a80ad83a06d3.avif',
      '/images/photo-1647825194145-2d94e259c745.avif',
      '/images/photo-1659518893171-b15e20a8e201.avif',
      '/images/photo-1682687982423-295485af248a.avif'
    ]),
  };
  const { content, isLoading } = usePageContent({ pageSlug: 'chumphon-pinnacle', locale, fallbackContent });

  // Parse content fields
  const quickFacts = content.quickFacts ? JSON.parse(content.quickFacts) : {};
  const whatYouCanSee = content.whatYouCanSee ? JSON.parse(content.whatYouCanSee) : [];
  const marineLifeHighlights = content.marineLifeHighlights ? JSON.parse(content.marineLifeHighlights) : [];
  const divingTips = content.divingTips ? JSON.parse(content.divingTips) : [];
  const images = content.images ? JSON.parse(content.images) : [];

  if (isLoading) return <div className="px-4 md:px-8 py-8">Loading...</div>;

  return (
    <div className="px-4 md:px-8">
      <DiveSiteDetail
        name="Chumphon Pinnacle"
        overview={content.overview || ''}
        quickFacts={quickFacts}
        whatYouCanSee={whatYouCanSee}
        marineLifeHighlights={marineLifeHighlights}
        divingTips={divingTips}
        images={images}
      />
    </div>
  );
};

export default ChumphonPinnacle;