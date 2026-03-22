import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const SPACE_ID = 'dxz3091tnbzu';
const ACCESS_TOKEN = 'YArIMzW5Pl74W0-ODfe0MAwFGvwoIeRtAacuh4m2iII';

// USAGE: Copy this file and rename it for your new dive site page.
// Replace 'DIVE_SITE_NAME' and 'Dive Site Name' with the correct slug and display name.

export default function DiveSitePage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchDiveSite = async () => {
    setLoading(true);
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
        setLoading(false);
          return;
        }
        if (json.items && json.items.length > 0) {
          // Log all available slugs for debugging
          const slugs = json.items.map(item => item.fields.slug);
          console.log('Available slugs:', slugs, 'Current locale:', locale);
          // Filter for the entry with slug 'chumphon-pinnacle'
          const item = json.items.find(item => item.fields.slug === 'divinginasia');
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
            // Debug: log the fields object to inspect structure
            console.log('Contentful fields:', fields);
            // Helper to get field value with Dutch fallback to English
          const getField = (field) => {
            if (typeof field === 'object' && field !== null) {
              // Prefer current locale, fallback to en-US, then blank
              return field[locale] || field['en-US'] || '';
            }
            return field || '';
          };
          // Helper to show fallback info for blank fields
          const withFallback = (value, label) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
              return <span style={{color:'orange'}}>{label} missing</span>;
            }
            return value;
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
            withFallback,
          });
          setError(null);
          setLastFetched(new Date().toLocaleTimeString());
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
      setLoading(false);
      setLastFetched(new Date().toLocaleTimeString());
      }
    setLoading(false);
    setLastFetched(new Date().toLocaleTimeString());
    };

  useEffect(() => {
    fetchDiveSite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);


  return (
    <div className="px-4 md:px-8">
      <div style={{marginBottom:16}}>
        <button
          onClick={fetchDiveSite}
          disabled={loading}
          style={{padding:'6px 16px', background:'#0070f3', color:'#fff', border:'none', borderRadius:4, cursor:loading?'not-allowed':'pointer', marginRight:8}}
        >
          {loading ? 'Refreshing...' : 'Refresh from Contentful'}
        </button>
        {lastFetched && <span style={{fontSize:12, color:'#666'}}>Last fetched: {lastFetched}</span>}
      </div>
      {error && <div style={{color:'red', marginBottom:8}}>Error: {error}</div>}
      {data === null && !error && <div>No data found for this dive site. Check the console for details.</div>}
      {data && (
        <>
          <div style={{marginBottom:12, fontSize:13, color:'#888'}}>
            <strong>Debug info:</strong> Locale: {i18n.language} | Name: {data.name || <span style={{color:'orange'}}>Missing</span>} | Slug: chumphon-pinnacle
          </div>
          <DiveSiteDetail
            name={data.withFallback(data.name, 'Name')}
            overview={data.withFallback(data.overview, 'Overview')}
            quickFacts={{
              depth: data.withFallback(data.depth, 'Depth'),
              difficulty: data.withFallback(data.difficulty, 'Difficulty'),
              location: data.withFallback(data.location, 'Location'),
              bestTime: data.withFallback(data.bestTime, 'Best Time'),
            }}
            whatYouCanSee={Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee : []}
            marineLifeHighlights={Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights : []}
            divingTips={Array.isArray(data.divingTips) ? data.divingTips : []}
            images={Array.isArray(data.images) ? data.images : []}
          />
        </>
      )}
    </div>
  );
}
