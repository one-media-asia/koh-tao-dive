// pages/api/get-page-content.js

export default function handler(req, res) {
  // Example: return static content for demo/testing
  const { page_slug, locale } = req.query;

  // You can customize this static data as needed
  const staticContent = {
    en: {
      overview: 'Static overview for ' + page_slug,
      quickFacts: {
        depth: '10-20m',
        difficulty: 'Beginner',
        location: 'Near the island',
        bestTime: 'Year-round',
      },
      whatYouCanSee: ['Coral', 'Turtles', 'Reef fish'],
      marineLifeHighlights: ['Turtles', 'Moray eels'],
      divingTips: ['Go early for best visibility'],
      images: ['/images/sample1.jpg', '/images/sample2.jpg'],
    },
    nl: {
      overview: 'Statisch overzicht voor ' + page_slug,
      quickFacts: {
        depth: '10-20m',
        difficulty: 'Beginner',
        location: 'Dichtbij het eiland',
        bestTime: 'Hele jaar',
      },
      whatYouCanSee: ['Koraal', 'Schildpadden', 'Rifvissen'],
      marineLifeHighlights: ['Schildpadden', 'Murenen'],
      divingTips: ['Ga vroeg voor beste zicht'],
      images: ['/images/sample1.jpg', '/images/sample2.jpg'],
    },
  };

  const content = staticContent[locale] || staticContent['en'];
  res.status(200).json({ content: [content] });
}
