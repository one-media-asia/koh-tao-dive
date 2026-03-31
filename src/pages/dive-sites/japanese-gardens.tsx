import React, {useMemo, useState, Suspense } from 'react';
const FunDiveBooking = React.lazy(() => import('@/components/FunDiveBooking'));
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '@/hooks/usePageContent';

const JapaneseGardens = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const locale = isDutch ? 'nl' : 'en';

  const toList = (value: string) =>
    String(value || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

  const fallbackContent = useMemo(() => ({
    overview: isDutch
      ? 'Japanese Gardens is een prachtige duiklocatie bij Koh Nang Yuan, bekend om diverse koraalriffen en rijk onderwaterleven. Geschikt voor alle niveaus.'
      : 'Japanese Gardens is a beautiful dive site near Koh Nang Yuan, known for its diverse coral reef and abundant marine life. Suitable for all levels.',
    quick_facts_depth: '5-18m',
    quick_facts_difficulty: isDutch ? 'Beginner tot Gemiddeld' : 'Beginner to Intermediate',
    quick_facts_location: isDutch ? 'Bij Koh Nang Yuan' : 'Near Koh Nang Yuan',
    quick_facts_best_time: isDutch ? 'Hele jaar, beste zicht november-mei' : 'Year-round, best visibility November-May',
    what_you_can_see: isDutch
      ? 'Pink-tailed triggerfish\nOcellated adelaarsrog\nKleurrijk koraal\nGemarmerde octopus'
      : 'Pink Tailed Triggerfish\nOcellated Eagle Rays\nColorful Corals\nMarbled Octopus',
    marine_life_highlights: isDutch
      ? 'Pink-tailed triggerfish\nOcellated adelaarsrog\nGemarmerde octopus\nBlue-ringed octopus\nNaaktslakken en platwormen\nPapegaaivissen en lipvissen\nAnthias en juffervissen\nMurenen en koraalduivels'
      : 'Pink-tailed Triggerfish (unique to this site)\nOcellated Eagle Rays\nMarbled Octopus\nBlue-ringed Octopus\nNudibranchs and flatworms\nParrotfish and wrasse\nAnthias and damselfish\nMoray eels and lionfish',
    diving_tips: isDutch
      ? 'Beste periode november-mei voor zicht\nZoek naar unieke triggerfish en octopus\nGeweldig voor onderwaterfotografie'
      : 'Best time is November-May for visibility.\nLook for unique triggerfish and octopus.\nGreat for underwater photography.',
    images: '/images/japanandwins.jpg',
  }), [isDutch]);

  const { content } = usePageContent({ pageSlug: 'japanese-gardens', locale, fallbackContent });

  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="px-4 md:px-8">
        <DiveSiteDetail
          name="Japanese Gardens"
          overview={content.overview}
          quickFacts={{
            depth: content.quick_facts_depth,
            difficulty: content.quick_facts_difficulty,
            location: content.quick_facts_location,
            bestTime: content.quick_facts_best_time,
          }}
          whatYouCanSee={toList(content.what_you_can_see)}
          marineLifeHighlights={toList(content.marine_life_highlights)}
          divingTips={toList(content.diving_tips)}
          images={toList(content.images)}
        />
      </div>
      <div className="flex justify-center my-8">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
          onClick={() => setShowBooking(true)}
        >
          Book a Fun Dive
        </button>
      </div>
      {showBooking && (
        <Suspense fallback={<div className="text-center py-8">Loading booking form…</div>}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setShowBooking(false)}
                aria-label="Close"
              >
                ×
              </button>
              <FunDiveBooking />
            </div>
          </div>
        </Suspense>
      )}
      <h2 className="text-2xl font-bold mt-8 mb-4">Gallery</h2>
      <DropboxGallery folder="japanese-gardens" />
    </>
  );
};

export default JapaneseGardens;
