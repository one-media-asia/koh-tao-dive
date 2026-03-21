import React from 'react';
// import DiveSiteDetail from '../components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const SharkIsland = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = isDutch
    ? {
        description: "Prachtige paarse zachte boomkoralen en gorgonen met veel onderwaterleven.",
        difficulty: "Beginner-gemiddeld",
        location: "Zuidkust",
        highlights: ["Zeewaaiers", "Zwepkoralen", "Zwartpuntrifhaaien", "Tropische vissen"],
        detailedDescription:
          "Shark Island ligt aan de zuidkust van Koh Tao en staat bekend om spectaculaire koraalformaties en hoge biodiversiteit. Je vindt hier prachtige paarse zachte boomkoralen en kleurrijke gorgonen, waaronder grote zeewaaiers en dynamische zweepkoralen die meebewegen met de stroming. Zwartpuntrifhaaien worden hier regelmatig gezien terwijl ze langs het rif trekken - daar dankt de site haar naam aan. Het onderwaterlandschap met met koraal bedekte rotsblokken en zandstroken creëert gevarieerde habitats. Door de kleur en het vaak goede zicht is dit een favoriete plek voor onderwaterfotografie.",
        bestTime: "Hele jaar, uitstekend in droogseizoen",
        current: "Licht, meestal rustige omstandigheden",
        visibility: "20-30m, uitstekende helderheid",
        marineLife: [
          "Zwartpuntrifhaaien",
          "Diverse rifvissen",
          "Gorgoon-zeewaaiers",
          "Zachte boomkoralen",
          "Anthias",
          "Papegaaivissen en lipvissen",
          "Murenen",
          "Naaktslakken en andere ongewervelden"
        ],
        tips: [
          "Geschikt voor alle brevetniveaus",
          "Uitstekend voor onderwaterfotografie",
          "Zoek haaien in het blauwe water boven het rif",
          "Verken de koraalformaties met zorg",
          "Geweldige locatie voor observatie van onderwaterleven",
          "Perfect voor langere duiken",
          "Goede plek om fotografietechniek te oefenen",
          "Spaar energie voor de terugzwem"
        ]
      }
    : {
        description: "Beautiful soft purple tree corals and gorgonians with abundant marine life.",
        difficulty: "Beginner-Intermediate",
        location: "South coast",
        highlights: ["Sea Fans", "Dynamic Sea Whips", "Black Tip Reef Sharks", "Tropical Fish"],
        detailedDescription:
          "Shark Island is located on Koh Tao's south coast and is renowned for its spectacular coral formations and marine biodiversity. The site features beautiful soft purple tree corals, vibrant gorgonians including sea fans and dynamic sea whips that sway gracefully in the current. Black-tip reef sharks are commonly sighted cruising the reef, giving the site its name. The underwater landscape includes coral-encrusted boulders and sandy patches, creating diverse habitats for marine life. This site is particularly popular with underwater photographers due to its colorful subjects and excellent visibility.",
        bestTime: "Year-round, excellent during dry season",
        current: "Light, generally calm conditions",
        visibility: "20-30m, excellent clarity",
        marineLife: [
          "Black-tip Reef Sharks",
          "Diverse reef fish",
          "Gorgonian sea fans",
          "Soft tree corals",
          "Anthias and anthias",
          "Parrotfish and wrasse",
          "Moray eels",
          "Nudibranchs and invertebrates"
        ],
        tips: [
          "Suitable for all certification levels",
          "Excellent for underwater photography",
          "Look for sharks in the blue water above the reef",
          "Explore the coral formations carefully",
          "Great for marine life observation",
          "Perfect for extended dives",
          "Good site for practicing photography techniques",
          "Conserve energy for the return swim"
        ]
      };

  return null;
};

export default SharkIsland;