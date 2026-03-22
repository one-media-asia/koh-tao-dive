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
      const locale = i18n.language.startsWith('nl') ? 'nl' : 'en-US';
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
          // Filter for the entry with slug 'DIVE_SITE_NAME'
          const item = json.items.find(item => item.fields.slug === 'DIVE_SITE_NAME');
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
            setData({ ...fields, images });
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
