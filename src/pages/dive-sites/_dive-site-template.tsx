import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const SPACE_ID = '5uphqssjz3hc';
const ACCESS_TOKEN = 'FychplmXWcmvE85YBhlKXGvFfR5sgJGWMyF9cirU--4';

// USAGE: Copy this file and rename it for your new dive site page.
// Replace 'DIVE_SITE_NAME' and 'Dive Site Name' with the correct slug and display name.

export default function DiveSitePage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiveSite = async () => {
      // Use the current i18n.language directly as the Contentful locale, fallback to 'en-US' if not set
      let locale = i18n.language || 'en-US';
      // If Contentful doesn't have this locale, fallback to 'en-US'
      const supportedLocales = ['en-US', 'nl']; // Add more as you add them in Contentful
      if (!supportedLocales.includes(locale)) {
        locale = 'en-US';
      }
      const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=diveSites&locale=${locale}&include=2`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.sys && json.sys.type === 'Error') {
          setError(`Contentful API error: ${json.message}`);
          setData(null);
          return;
        }
        if (json.items && json.items.length > 0) {
          // Log all available slugs for debugging
          const slugs = json.items.map(item => item.fields.slug);
          console.log('Available slugs:', slugs, 'Current locale:', locale);
          // Filter for the entry with slug 'chumphon-pinnacle'
          const item = json.items.find(item => item.fields.slug === 'chumphon-pinnacle');
          if (item) {
            const fields = item.fields;
            // Resolve images from includes
            const assets = {};
            if (json.includes && json.includes.Asset) {
              json.includes.Asset.forEach(asset => {
                assets[asset.sys.id] = asset.fields.file.url;
              });
            }
            const images = (fields.images || []).map(img => assets[img.sys.id]);
            // Helper to get field value with Dutch fallback to English
            const getField = (field) => {
              if (typeof field === 'object' && field !== null) {
                return field['nl'] || field['en-US'] || '';
              }
              return field;
            };
            setData({
              name: getField(fields.name),
              overview: getField(fields.overview),
              quickFacts: getField(fields.quickFacts),
              depth: getField(fields.depth),
              difficulty: getField(fields.difficulty),
              location: getField(fields.location),
              bestTime: getField(fields.bestTime),
              marineLifeHighlights: getField(fields.marineLifeHighlights),
              whatYouCanSee: getField(fields.whatYouCanSee),
              divingTips: getField(fields.divingTips),
              images,
            });
            setError(null);
            // Debug log for locale and name
            console.log('Locale:', locale, 'Name:', fields.name);
          } else {
            setData(null);
            setError('No entry found with the specified slug.');
          }
        } else {
          setData(null);
          setError('No items found. Check content type and locale.');
        }
      } catch (e) {
        setError('Network or parsing error: ' + e.message);
        setData(null);
      }
    };
    fetchDiveSite();
  }, [i18n.language]);

  if (error) return <div style={{color:'red'}}>Error: {error}</div>;
  if (data === null) return <div>No data found for this dive site. Check the console for details.</div>;

  return (
    <div className="px-4 md:px-8">
      <DiveSiteDetail
        name={data.name}
        overview={data.overview}
        quickFacts={{
          depth: data.depth,
          difficulty: data.difficulty,
          location: data.location,
          bestTime: data.bestTime,
        }}
        whatYouCanSee={Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee : []}
        marineLifeHighlights={Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights : []}
        divingTips={Array.isArray(data.divingTips) ? data.divingTips : []}
        images={Array.isArray(data.images) ? data.images : []}
      />
    </div>
  );
}
