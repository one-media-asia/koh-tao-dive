import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const JapaneseGardens = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = {
    en: {
      overview: 'Your new overview content here',
      quickFacts: {
        depth: '12-25m',
        difficulty: 'Intermediate',
        location: 'Near Koh Nang Yuan',
        bestTime: 'May–September',
      },
      whatYouCanSee: ['Pink-tailed triggerfish', 'Ocellated eagle ray', 'Colorful coral', 'Marbled octopus'],
      marineLifeHighlights: ['test'],
      divingTips: ['test'],
      images: ['/images/japanese-gardensdwins.jpg'],
    },
    nl: {
      overview: 'Dutch overview content here',
      quickFacts: {
        depth: '12-25m',
        difficulty: 'Gemiddeld',
        location: 'Bij Koh Nang Yuan',
        bestTime: 'Mei–September',
      },
      whatYouCanSee: ['Pink-tailed triggerfish', 'Ocellated adelaarsrog', 'Kleurrijk koraal', 'Gemarmerde octopus'],
      marineLifeHighlights: ['Dutch marine life highlights here'],
      divingTips: ['Dutch quick facts here'],
      images: ['/images/japanese-gardensdwins.jpg'],
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
