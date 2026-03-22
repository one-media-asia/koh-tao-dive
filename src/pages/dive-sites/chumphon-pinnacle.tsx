import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const SPACE_ID = '5uphqssjz3hc';
const ACCESS_TOKEN = 'FychplmXWcmvE85YBhlKXGvFfR5sgJGWMyF9cirU--4';

export default function ChumphonPinnaclePage() {
  const { i18n } = useTranslation();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDiveSite = async () => {
      const locale = i18n.language.startsWith('nl') ? 'nl' : 'en-US';
      const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=diveSite&fields.slug=chumphon-pinacle&locale=${locale}&include=2`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.items.length > 0) {
        const fields = json.items[0].fields;
        // Resolve images from includes
        const assets = {};
        if (json.includes && json.includes.Asset) {
          json.includes.Asset.forEach(asset => {
            assets[asset.sys.id] = asset.fields.file.url;
          });
        }
        const images = (fields.images || []).map(img => assets[img.sys.id]);
        setData({ ...fields, images });
      }
    };
    fetchDiveSite();
  }, [i18n.language]);

  if (!data) return <div>Loading…</div>;

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
