import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDeta';
import { useTranslation } from 'react-i18next';

const ChumphonPinnacle = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = isDutch
    ? {
        overview: "Chumphon Pinnacle is een van de meest spectaculaire diepduiklocaties van Koh Tao, op ongeveer 30 minuten varen uit de kust. Deze granieten pinnacle rijst steil op vanaf de oceaanbodem en vormt een natuurlijke schoonmaakplek voor grote zeedieren. De locatie staat vooral bekend om betrouwbare walvishaaiwaarnemingen, waarbij deze zachte reuzen regelmatig door de diepte cruisen. Grote scholen trevally en chevron-barracuda zorgen voor indrukwekkende scenes, terwijl adelaarsroggen en andere pelagische soorten extra dynamiek geven. De structuur van de pinnacle biedt ook mooie doorgangen en sterke fotomogelijkheden.",
        quickFacts: { depth: '15-30m', difficulty: 'Gevorderd', location: '30 minuten uit de kust', bestTime: 'Hele jaar, piekseizoen december-april' },
        whatYouCanSee: ["Walvishaaien", "Scholen trevally", "Adelaarsroggen", "Chevron-barracuda"],
        marineLifeHighlights: [
          "Walvishaaien (regelmatige waarnemingen)",
          "Grote scholen giant trevally",
          "Chevron-barracuda",
          "Adelaarsroggen",
          "Scholen horsmakreel en fusilier",
          "Reuzenbarracuda",
          "Kingfish",
          "Diverse rifvissen"
        ],
        divingTips: [
          "Gevorderde certificering aanbevolen door diepte en stroming",
          "Vroege ochtendtrips vergroten kans op wildlife-waarnemingen",
          "Groothoeklens aanbevolen voor grote onderwerpen",
          "Blijf bij je gids bij matige stroming",
          "Perfect voor specialisaties in diepduiken",
          "Walvishaaien zijn vaak actiever bij opkomend tij",
          "Neem een goede onderwatercamera mee"
        ],
        images: [
          "/images/chumphon-pinnacle-top.webp",
          "/images/photo-1682686580849-3e7f67df4015.avif",
          "/images/photo-1613853250147-2f73e55c1561.avif",
          "/images/photo-1618865181016-a80ad83a06d3.avif",
          "/images/photo-1647825194145-2d94e259c745.avif",
          "/images/photo-1659518893171-b15e20a8e201.avif",
          "/images/photo-1682687982423-295485af248a.avif"
        ]
      }
    : {
        overview: "Chumphon Pinnacle is one of Koh Tao's most spectacular deep dive sites, located 30 minutes offshore. This granite pinnacle rises dramatically from the deep ocean floor, creating a natural cleaning station for large marine life. The site is particularly famous for its reliable whaleshark sightings, with these gentle giants often cruising the depths. Massive schools of trevally and chevron barracuda create mesmerizing displays, while eagle rays and other pelagics add to the excitement. The pinnacle's structure provides excellent swim-through opportunities and photographic subjects.",
        quickFacts: { depth: '15-30m', difficulty: 'Advanced', location: '30 minutes offshore', bestTime: 'Year-round, peak season December-April' },
        whatYouCanSee: ["Whalesharks", "Trevally Schools", "Eagle Rays", "Chevron Barracuda"],
        marineLifeHighlights: [
          "Whalesharks (regular sightings)",
          "Giant Trevally schools",
          "Chevron Barracuda",
          "Eagle Rays",
          "Scad and Fusilier schools",
          "Giant Barracuda",
          "Kingfish",
          "Various reef fish species"
        ],
        divingTips: [
          "Advanced certification recommended due to depth and current",
          "Early morning departures maximize wildlife sightings",
          "Wide-angle photography lens recommended for large subjects",
          "Stay with your dive guide in moderate currents",
          "Perfect for deep diving specialty courses",
          "Whalesharks are most active during incoming tides",
          "Bring a good quality underwater camera"
        ],
        images: [
          "/images/chumphon-pinnacle-top.webp",
          "/images/photo-1682686580849-3e7f67df4015.avif",
          "/images/photo-1613853250147-2f73e55c1561.avif",
          "/images/photo-1618865181016-a80ad83a06d3.avif",
          "/images/photo-1647825194145-2d94e259c745.avif",
          "/images/photo-1659518893171-b15e20a8e201.avif",
          "/images/photo-1682687982423-295485af248a.avif"
        ]
      };

  return (
    <DiveSiteDetail
      name="Chumphon Pinnacle"
      overview={content.overview}
      quickFacts={content.quickFacts}
      whatYouCanSee={content.whatYouCanSee}
      marineLifeHighlights={content.marineLifeHighlights}
      divingTips={content.divingTips}
      images={content.images}
    />
  );
};

export default ChumphonPinnacle;
