import React, { useMemo } from 'react';
import DropboxGallery from '@/components/DropboxGallery';
import DiveSiteDetail from '@/components/DiveSiteDetail';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '@/hooks/usePageContent';

const HTMSSattakut = () => {
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const locale = isDutch ? 'nl' : 'en';

  const toList = (value: string) =>
    String(value || '')
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

  const fallbackContent = useMemo(() => (isDutch
    ? {
        overview:
          "HTMS Sattakut is een fascinerend voormalig US Navy-schip uit de Tweede Wereldoorlog dat in 2011 bewust is afgezonken om een kunstmatig rif te vormen. Dit wrak van circa 30 meter ligt tussen Koh Tao en Koh Nang Yuan op 18-30 meter diepte. Inmiddels is het uitgegroeid tot een levendig rif, bedekt met koralen en bewoond door uiteenlopend onderwaterleven. De scheepsstructuur biedt interessante doorgangen, van machinekamer tot brug. Grote tandbaarzen, snappers en barracuda's gebruiken het wrak als leefgebied, waardoor dit een topbestemming is voor wrakduiken in Zuidoost-Azië.",
        quick_facts_depth: '18-30m',
        quick_facts_difficulty: 'Gevorderd',
        quick_facts_location: 'Tussen de eilanden',
        quick_facts_best_time: 'Hele jaar, beste in droogseizoen',
        what_you_can_see: 'Wrakduiken\nOnderwaterleven\nDoorgangen\nHistorische waarde',
        marine_life_highlights:
          'Malabar tandbaarzen (resident)\nReuzenbarracuda\nScholen snapper en fusilier\nMurenen\nKoraalduivels en schorpioenvissen\nKoraalgroei op wrakstructuur\nDiverse rifvissen\nKogelvissen en trekkervissen',
        diving_tips:
          'Gevorderde certificering vereist voor wrakduiken\nUitstekende site voor wrakspecialisaties\nRespecteer de historische betekenis van deze locatie\nGebruik passende wrakduiktechnieken en penetratievaardigheden\nBlijf bij je gids bij verkenning van het interieur\nZeer geschikt voor onderwaterfotografie\nSpaar lucht door diepte en verkenning\nLet op de historische kenmerken van het schip',
        images: '/images/htms-sattakut.jpg\n/images/htms-sattakut-wreck.jpg\n/images/wreck.jpeg',
      }
    : {
        overview:
          "HTMS Sattakut is a fascinating WWII-era ex-US Navy vessel deliberately sunk in 2011 to create an artificial reef. This 30-meter long wreck lies between Koh Tao and Koh Nang Yuan at depths of 18-30 meters. The wreck has become a thriving artificial reef, completely covered in corals and home to a diverse array of marine life. The ship's structure provides excellent swim-through opportunities, from the engine room to the bridge. Large groupers, snappers, and barracuda now call this wreck home, and it's become a premier wreck diving destination in Southeast Asia.",
        quick_facts_depth: '18-30m',
        quick_facts_difficulty: 'Advanced',
        quick_facts_location: 'Between islands',
        quick_facts_best_time: 'Year-round, best during dry season',
        what_you_can_see: 'Wreck Exploration\nMarine Life\nSwim-throughs\nHistorical Significance',
        marine_life_highlights:
          'Malabar Groupers (resident)\nGiant Barracuda\nSnapper and Fusilier schools\nMoray Eels\nLionfish and scorpionfish\nCoral growth on wreck structure\nVarious reef fish species\nPuffers and triggerfish',
        diving_tips:
          'Advanced certification required for wreck diving\nExcellent site for wreck diving specialty course\nRespect the historical significance of the site\nUse wreck diving techniques and penetration skills\nStay with your guide when exploring the interior\nPerfect for underwater photography\nConserve air due to depth and exploration\nLook for the ship\'s historical features',
        images: '/images/htms-sattakut.jpg\n/images/htms-sattakut-wreck.jpg\n/images/wreck.jpeg',
      }), [isDutch]);

  const { content } = usePageContent({ pageSlug: 'htms-sattakut', locale, fallbackContent });

  return (
    <div className="px-4 md:px-8">
      <DiveSiteDetail
        name="HTMS Sattakut"
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
      {/* Gallery removed as requested */}
        {/* Show images at the bottom for all users, with captions for Dutch users */}
        <div className="mt-8 flex flex-col gap-6 items-center">
          <figure>
            <img src="/images/htms-sattakut.jpg" alt="HTMS Sattakut" className="rounded shadow max-w-full h-auto" />
            {isDutch && (
              <figcaption className="text-center text-sm mt-2 text-gray-500">HTMS Sattakut - Overzicht</figcaption>
            )}
          </figure>
          <figure>
            <img src="/images/htms-sattakut-wreck.jpg" alt="HTMS Sattakut Wreck" className="rounded shadow max-w-full h-auto" />
            {isDutch && (
              <figcaption className="text-center text-sm mt-2 text-gray-500">HTMS Sattakut - Wrak</figcaption>
            )}
          </figure>
            <figure>
              <img src="https://www.divinginasia.com/images/wreck.jpeg" alt="Extern wrakafbeelding" className="rounded shadow max-w-full h-auto" />
              {isDutch && (
                <figcaption className="text-center text-sm mt-2 text-gray-500">Externe afbeelding: divinginasia.com</figcaption>
              )}
            </figure>
          {isDutch && (
            <figure>
              <img src="https://www.divinginasia.com/images/wreck.jpeg" alt="Extern wrakafbeelding" className="rounded shadow max-w-full h-auto" />
              <figcaption className="text-center text-sm mt-2 text-gray-500">Externe afbeelding: divinginasia.com</figcaption>
            </figure>
          )}
        </div>
    </div>
  );
};

export default HTMSSattakut;