import React from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const MangoBay = () => {
  return (
    <DiveSiteDetail
      name="Mango Bay"
      overview="Shallow coral reefs perfect for relaxed diving with thriving marine ecosystems."
      quickFacts={{
        depth: '5-18m',
        difficulty: 'Beginner',
        location: 'West coast bay',
        bestTime: 'Year-round, best during calm weather',
      }}
      whatYouCanSee={[
        'Colorful reef fish',
        'Clownfish and anemones',
        'Parrotfish and wrasse',
        'Butterflyfish',
        'Angelfish species',
        'Small reef sharks'
      ]}
      marineLifeHighlights={[
        'Healthy reef ecosystem',
        'Colorful hard and soft corals',
        'Sea anemones',
        'Abundant marine life'
      ]}
      divingTips={[
        'Perfect for beginners and training dives',
        'Also excellent for snorkeling',
        'Look for grazers in seagrass and reef life',
        'Great spot for underwater photography',
        'Calm water ideal for learning buoyancy',
        'Multiple coral bommies to explore',
        'Suitable for longer dives',
        'Perfect for Open Water certification dives'
      ]}
      images={['/images/mango-bay.webp']}
    />
  );
};

export default MangoBay;

