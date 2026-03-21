import React from 'react';
// import DiveSiteDetail from '../components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';

const HTMSSattakut = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');

  const content = isDutch
    ? {
        description: "Voormalig US Navy-schip uit WOII, door de Thaise marine geschonken en nu een bloeiend kunstmatig rif.",
        difficulty: "Gevorderd",
        location: "Tussen de eilanden",
        highlights: ["Wrakduiken", "Onderwaterleven", "Doorgangen", "Historische waarde"],
        detailedDescription:
          "HTMS Sattakut is een fascinerend voormalig US Navy-schip uit de Tweede Wereldoorlog dat in 2011 bewust is afgezonken om een kunstmatig rif te vormen. Dit wrak van circa 30 meter ligt tussen Koh Tao en Koh Nang Yuan op 18-30 meter diepte. Inmiddels is het uitgegroeid tot een levendig rif, bedekt met koralen en bewoond door uiteenlopend onderwaterleven. De scheepsstructuur biedt interessante doorgangen, van machinekamer tot brug. Grote tandbaarzen, snappers en barracuda's gebruiken het wrak als leefgebied, waardoor dit een topbestemming is voor wrakduiken in Zuidoost-Azië.",
        bestTime: "Hele jaar, beste in droogseizoen",
        current: "Licht tot matig, meestal voorspelbaar",
        visibility: "15-25m, goed zicht rondom het wrak",
        marineLife: [
          "Malabar tandbaarzen (resident)",
          "Reuzenbarracuda",
          "Scholen snapper en fusilier",
          "Murenen",
          "Koraalduivels en schorpioenvissen",
          "Koraalgroei op wrakstructuur",
          "Diverse rifvissen",
          "Kogelvissen en trekkervissen"
        ],
        tips: [
          "Gevorderde certificering vereist voor wrakduiken",
          "Uitstekende site voor wrakspecialisaties",
          "Respecteer de historische betekenis van deze locatie",
          "Gebruik passende wrakduiktechnieken en penetratievaardigheden",
          "Blijf bij je gids bij verkenning van het interieur",
          "Zeer geschikt voor onderwaterfotografie",
          "Spaar lucht door diepte en verkenning",
          "Let op de historische kenmerken van het schip"
        ]
      }
    : {
        description: "WWII ex-US Navy vessel donated by Thai Navy, now a thriving artificial reef.",
        difficulty: "Advanced",
        location: "Between islands",
        highlights: ["Wreck Exploration", "Marine Life", "Swim-throughs", "Historical Significance"],
        detailedDescription:
          "HTMS Sattakut is a fascinating WWII-era ex-US Navy vessel deliberately sunk in 2011 to create an artificial reef. This 30-meter long wreck lies between Koh Tao and Koh Nang Yuan at depths of 18-30 meters. The wreck has become a thriving artificial reef, completely covered in corals and home to a diverse array of marine life. The ship's structure provides excellent swim-through opportunities, from the engine room to the bridge. Large groupers, snappers, and barracuda now call this wreck home, and it's become a premier wreck diving destination in Southeast Asia.",
        bestTime: "Year-round, best during dry season",
        current: "Light to moderate, generally predictable",
        visibility: "15-25m, good visibility around wreck",
        marineLife: [
          "Malabar Groupers (resident)",
          "Giant Barracuda",
          "Snapper and Fusilier schools",
          "Moray Eels",
          "Lionfish and scorpionfish",
          "Coral growth on wreck structure",
          "Various reef fish species",
          "Puffers and triggerfish"
        ],
        tips: [
          "Advanced certification required for wreck diving",
          "Excellent site for wreck diving specialty course",
          "Respect the historical significance of the site",
          "Use wreck diving techniques and penetration skills",
          "Stay with your guide when exploring the interior",
          "Perfect for underwater photography",
          "Conserve air due to depth and exploration",
          "Look for the ship's historical features"
        ]
      };

  return null;
};

export default HTMSSattakut;