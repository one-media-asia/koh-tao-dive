import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const MangoBay = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = isDutch
    ? {
        overview: 'Ondiepe koraalriffen, perfect voor ontspannen duiken met een levendig marien ecosysteem.',
        quickFacts: {
          depth: '5-18m',
          difficulty: 'Beginner',
          location: 'Baai aan de westkust',
          bestTime: 'Hele jaar, beste bij rustig weer',
        },
        whatYouCanSee: [
          'Kleurrijke rifvissen',
          'Clownvissen en anemonen',
          'Papegaaivissen en lipvissen',
          'Vlindervissen',
          'Diverse keizersvissen',
          'Kleine rifhaaien'
        ],
        marineLifeHighlights: [
          'Gezond rifecosysteem',
          'Kleurrijke harde en zachte koralen',
          'Zeeanemonen',
          'Veel onderwaterleven'
        ],
        divingTips: [
          'Perfect voor beginners en trainingsduiken',
          'Ook uitstekend geschikt om te snorkelen',
          'Kijk uit naar grazers in zeegras en rifleven',
          'Mooie plek voor onderwaterfotografie',
          'Rustig water ideaal om drijfvermogen te leren',
          'Meerdere koraalbommies om te verkennen',
          'Geschikt voor langere duiken',
          'Perfect voor Open Water-brevetduiken'
        ],
        images: ['/images/mango-bay.webp']
      }
    : {
        overview: "Shallow coral reefs perfect for relaxed diving with thriving marine ecosystems.",
        quickFacts: {
          depth: '5-18m',
          difficulty: 'Beginner',
          location: 'West coast bay',
          bestTime: 'Year-round, best during calm weather',
        },
        whatYouCanSee: [
          'Colorful reef fish',
          'Clownfish and anemones',
          'Parrotfish and wrasse',
          'Butterflyfish',
          'Angelfish species',
          'Small reef sharks'
        ],
        marineLifeHighlights: [
          'Healthy reef ecosystem',
          'Colorful hard and soft corals',
          'Sea anemones',
          'Abundant marine life'
        ],
        divingTips: [
          'Perfect for beginner divers and training',
          'Excellent for snorkeling as well',
          'Look for seagrass grazers and reef life',
          'Great for underwater photography',
          'Calm waters ideal for learning buoyancy',
          'Multiple coral bommies to explore',
          'Good site for extended dives',
          'Perfect for Open Water certification dives'
        ],
        images: ['/images/mango-bay.webp']
      };

  const locale = isDutch ? 'nl' : 'en';
  const data = content;

  return (
    <DiveSiteDetail
      name={isDutch ? 'Mango Bay' : 'Mango Bay'}
      overview={data.overview}
      quickFacts={data.quickFacts}
      whatYouCanSee={data.whatYouCanSee}
      marineLifeHighlights={data.marineLifeHighlights}
      divingTips={data.divingTips}
      images={data.images}
    />
  );
};

export default MangoBay;
