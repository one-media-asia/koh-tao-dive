import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const ChumphonPinnacle = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = {
    en: {
      overview: 'Your new overview content here',
      quickFacts: {
        depth: '15-30m',
        difficulty: 'Advanced',
        location: '30 minutes offshore',
        bestTime: 'May–September',
      },
      whatYouCanSee: ['Whale sharks', 'Trevally schools', 'Eagle rays', 'Chevron barracuda'],
      marineLifeHighlights: ['test'],
      divingTips: ['test'],
      images: ['/images/whale-shark-snorkelling-fos-sustainable-certification-medium-1.webp'],
    },
    nl: {
      overview: 'Dutch overview content here',
      quickFacts: {
        depth: '15-30m',
        difficulty: 'Gevorderd',
        location: '30 minuten offshore',
        bestTime: 'Mei–September',
      },
      whatYouCanSee: ['Walvishaaien', 'Trevally-scholen', 'Adelaarsroggen', 'Chevron-barracuda'],
      marineLifeHighlights: ['Dutch marine life highlights here'],
      divingTips: ['Dutch quick facts here'],
      images: ['/images/whale-shark-snorkelling-fos-sustainable-certification-medium-1.webp'],
    },
  };

  const locale = isDutch ? 'nl' : 'en';
  const data = content[locale];

  return (
    <DiveSiteDetail
      name="Chumphon Pinnacle"
      overview={data.overview}
      quickFacts={data.quickFacts}
      whatYouCanSee={data.whatYouCanSee}
      marineLifeHighlights={data.marineLifeHighlights}
      divingTips={data.divingTips}
      images={data.images}
    />
  );
};

export default ChumphonPinnacle;
