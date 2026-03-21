import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const TwinsPinnacle = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = isDutch
    ? {
        overview: 'De populairste duiksite van Koh Tao met drie granieten pinnacles, rijk onderwaterleven en geschikt voor alle brevetniveaus.',
        quickFacts: {
          depth: '6-18m',
          difficulty: 'Beginner tot gemiddeld',
          location: 'Westkust van Koh Nang Yuan',
          bestTime: 'Hele jaar, beste periode november-mei',
        },
        whatYouCanSee: [
          'Zadel-clownvis en Sebae-anemonen',
          'Naaktslakken',
          'Pijpvissen',
          'Gele koffervis',
          'Longface emperor',
          'White’s vlindervis',
          'Keizersvissen',
          'Rifvissen',
          'Murenen',
          'Trevally',
          'Blauwgestippelde lintstaartrog',
          'Snapper',
          'Tandbaarzen',
          'Papegaaivissen',
          'Bannerfish',
          'Zeeschildpadden',
          'Scribbled filefish',
          'Anemoonvissen',
          'Koffervissen en wratslakken'
        ],
        marineLifeHighlights: [
          'Drie granieten pinnacles',
          'Boog en rotsformaties',
          'Rijk onderwaterleven',
          'Perfect voor training',
          'Rustige omstandigheden',
          'Anemonen met clownvissen'
        ],
        divingTips: [
          'Perfect voor Open Water-duikers en trainingsduiken',
          'Verken eerst de diepere westelijke piek',
          'Navigeer naar de middelste piek en bekijk de boog aan de noordzijde',
          'Kijk onder overhangen bij de ondiepe piek',
          'Mis de bekende clownvis met Sebae-anemoon niet',
          'Let op: rond de clownvis is een stenen cirkel gemaakt - ga daar niet binnen',
          'Geweldig voor macrofotografie',
          'Oefen drijfvermogen op de boog en rotsformaties',
          'Nabijgelegen Buoyancy World is speciaal voor drijfvermogen',
          'Uitstekend voor mariene bewustwording',
          'Eenvoudige navigatie dankzij de drie pieken'
        ],
        images: ['/images/twins-pinnacle.webp']
      }
    : {
        overview: "Koh Tao's most popular dive site featuring three granite pinnacles with abundant marine life and perfect for all certification levels.",
        quickFacts: {
          depth: '6-18m',
          difficulty: 'Beginner to Intermediate',
          location: 'West coast of Koh Nang Yuan',
          bestTime: 'Year-round, best November-May',
        },
        whatYouCanSee: [
          "Saddleback Clownfish and Sebae Anemones",
          "Nudibranchs",
          "Pipefish",
          "Yellow Boxfish",
          "Longface Emperor Fish",
          "White's Butterflyfish",
          "Angel Fish (Six-banded and others)",
          "Coral Fish",
          "Moray Eels",
          "Trevally",
          "Blue-spotted Ribbontail Rays",
          "Snapper",
          "Groupers",
          "Parrotfish",
          "Bannerfish",
          "Turtles",
          "Scribbled Filefish",
          "Anemonefish",
          "Boxfish and pufferfish"
        ],
        marineLifeHighlights: [
          'Three granite pinnacles',
          'Archway and rock formations',
          'Abundant marine life',
          'Perfect for training',
          'Flat conditions',
          'Clownfish anemones'
        ],
        divingTips: [
          'Perfect for Open Water divers and training dives',
          'Explore the deeper western pinnacle first',
          'Navigate to the middle pinnacle and check the arch on the north side',
          'Look under overhangs at the shallow pinnacle',
          'Don’t miss the famous clownfish with Sebae anemone',
          'Note: there is a stone circle around the clownfish - do not enter',
          'Great for macro photography',
          'Practice buoyancy on the arch and rock formations',
          'Nearby Buoyancy World is designed for buoyancy practice',
          'Excellent for marine awareness and identification courses',
          'Easy navigation thanks to the three pinnacles'
        ],
        images: ['/images/twins-pinnacle.webp']
      };

  const locale = isDutch ? 'nl' : 'en';
  const data = content;

  return (
    <DiveSiteDetail
      name={isDutch ? 'Twins Pinnacle' : 'Twins Pinnacle'}
      overview={data.overview}
      quickFacts={data.quickFacts}
      whatYouCanSee={data.whatYouCanSee}
      marineLifeHighlights={data.marineLifeHighlights}
      divingTips={data.divingTips}
      images={data.images}
    />
  );
};

export default TwinsPinnacle;
