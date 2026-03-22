import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const JapaneseGardens = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = {
    en: {
      overview: 'Japanese Gardens is a beautiful dive site near Koh Nang Yuan, known for its diverse coral reef and abundant marine life. Suitable for all levels.',
      quickFacts: {
        depth: '5-18m',
        difficulty: 'Beginner to Intermediate',
        location: 'Near Koh Nang Yuan',
        bestTime: 'Year-round, best visibility November–May',
      },
      whatYouCanSee: [
        'Pink Tailed Triggerfish',
        'Ocellated Eagle Rays',
        'Colorful Corals',
        'Marbled Octopus',
      ],
      marineLifeHighlights: [
        'Pink-tailed Triggerfish (unique to this site)',
        'Ocellated Eagle Rays',
        'Marbled Octopus',
        'Blue-ringed Octopus',
        'Nudibranchs and flatworms',
        'Parrotfish and wrasse',
        'Anthias and damselfish',
        'Moray eels and lionfish',
      ],
      divingTips: [
        'Best time is November–May for visibility.',
        'Look for unique triggerfish and octopus.',
        'Great for underwater photography.',
      ],
      images: ['/images/japanandwins.jpg'],
    },
    nl: {
      overview: 'Japanese Gardens is een prachtige duikstek bij Koh Nang Yuan, bekend om zijn diverse koraalrif en overvloedig zeeleven. Geschikt voor alle niveaus.',
      quickFacts: {
        depth: '5-18m',
        difficulty: 'Beginner tot gemiddeld',
        location: 'Bij Koh Nang Yuan',
        bestTime: 'Hele jaar, beste zicht november–mei',
      },
      whatYouCanSee: [
        'Pink Tailed Triggerfish',
        'Ocellated Eagle Rays',
        'Kleurrijke koralen',
        'Marbled Octopus',
      ],
      marineLifeHighlights: [
        'Pink-tailed Triggerfish (uniek voor deze site)',
        'Ocellated Eagle Rays',
        'Marbled Octopus',
        'Blue-ringed Octopus',
        'Naaktslakken en platwormen',
        'Papegaaivissen en lipvissen',
        'Anthias en juffervissen',
        'Murenen en koraalduivels',
      ],
      divingTips: [
        'Beste tijd is november–mei voor zicht.',
        'Zoek naar unieke triggerfish en octopus.',
        'Geweldig voor onderwaterfotografie.',
      ],
      images: ['/images/japanandwins.jpg'],
    },
  };

  const locale = isDutch ? 'nl' : 'en';
  const data = content[locale];

  return (
    <DiveSiteDetail
      name="Japanese Gardens"
      overview={data.overview}
      quickFacts={data.quickFacts}
      whatYouCanSee={data.whatYouCanSee}
      marineLifeHighlights={data.marineLifeHighlights}
      divingTips={data.divingTips}
      images={data.images}
    />
  );
};

export default JapaneseGardens;
