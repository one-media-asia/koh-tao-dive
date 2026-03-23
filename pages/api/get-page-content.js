// pages/api/get-page-content.js

export default function handler(req, res) {
  // Example: return static content for demo/testing
  const { page_slug, locale } = req.query;

  // You can customize this static data as needed
  const staticContent = {
    en: [
      { section_key: 'overview', content_value: 'Static overview for ' + page_slug },
      { section_key: 'quickFacts', content_value: JSON.stringify({ depth: '10-20m', difficulty: 'Beginner', location: 'Near the island', bestTime: 'Year-round' }) },
      { section_key: 'whatYouCanSee', content_value: JSON.stringify(['Coral', 'Turtles', 'Reef fish']) },
      { section_key: 'marineLifeHighlights', content_value: JSON.stringify(['Turtles', 'Moray eels']) },
      { section_key: 'divingTips', content_value: JSON.stringify(['Go early for best visibility']) },
      { section_key: 'images', content_value: JSON.stringify(['/images/sample1.jpg', '/images/sample2.jpg']) },
    ],
    nl: [
      { section_key: 'overview', content_value: 'Statisch overzicht voor ' + page_slug },
      { section_key: 'quickFacts', content_value: JSON.stringify({ depth: '10-20m', difficulty: 'Beginner', location: 'Dichtbij het eiland', bestTime: 'Hele jaar' }) },
      { section_key: 'whatYouCanSee', content_value: JSON.stringify(['Koraal', 'Schildpadden', 'Rifvissen']) },
      { section_key: 'marineLifeHighlights', content_value: JSON.stringify(['Schildpadden', 'Murenen']) },
      { section_key: 'divingTips', content_value: JSON.stringify(['Ga vroeg voor beste zicht']) },
      { section_key: 'images', content_value: JSON.stringify(['/images/sample1.jpg', '/images/sample2.jpg']) },
    ],
  };

  const content = staticContent[locale] || staticContent['en'];
  res.status(200).json({ content });
}
