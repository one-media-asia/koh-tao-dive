import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const SPACE_ID = '5uphqssjz3hc';
const ACCESS_TOKEN = 'FychplmXWcmvE85YBhlKXGvFfR5sgJGWMyF9cirU--4';

export default function ChumphonPinnaclePage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiveSite = async () => {
      const locale = i18n.language.startsWith('nl') ? 'nl' : 'en-US';
      // No slug field exists in DiveSites model, so fetch all and filter client-side if needed
      const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=diveSites&locale=${locale}&include=2`;
      try {
        const res = await fetch(url);
        const json = await res.json();
        console.log('Contentful API response:', json); // DEBUG LOG
        if (json.sys && json.sys.type === 'Error') {
          setError(`Contentful API error: ${json.message}`);
          setData(null);
          return;
        }
        if (json.items && json.items.length > 0) {
          // If you add a slug field later, filter here: .find(item => item.fields.slug === 'chumphon-pinnacle')
          const item = json.items[0];
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
        whatYouCanSee={data.whatYouCanSee}
        marineLifeHighlights={data.marineLifeHighlights}
        divingTips={data.divingTips}
        images={data.images}
      />
    </div>
  );
}
