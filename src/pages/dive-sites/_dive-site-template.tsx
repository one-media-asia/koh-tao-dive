import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DiveSiteDetail from '@/components/DiveSiteDetail';

const SPACE_ID = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const ACCESS_TOKEN = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;
const MGMT_TOKEN = import.meta.env.VITE_CONTENTFUL_MANAGEMENT_TOKEN;

// USAGE: Copy this file and rename it for your new dive site page.
// Replace 'DIVE_SITE_NAME' and 'Dive Site Name' with the correct slug and display name.

  const { i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [entryId, setEntryId] = useState(null);
  // Get slug from file name (e.g., chumphon-pinnacle.tsx => 'chumphon-pinnacle')
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').pop().replace('.tsx', '') : 'Diveasia';
  const fetchDiveSite = async () => {
    setLoading(true);
    let locale = i18n.language || 'en-US';
    const supportedLocales = ['en-US', 'nl'];
    if (!supportedLocales.includes(locale)) {
      locale = 'en-US';
    }
    const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/master/entries?access_token=${ACCESS_TOKEN}&content_type=pageContent&locale=${locale}&include=2`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      setApiResponse(json);
      if (json.sys && json.sys.type === 'Error') {
        setError(`Contentful API error: ${json.message}`);
        setData(null);
        setLoading(false);
        return;
      }
      if (json.items && json.items.length > 0) {
        const slugs = json.items.map(item => item.fields.slug);
        console.log('Available slugs:', slugs, 'Current locale:', locale);
        // Use dynamic slug
        const item = json.items.find(item => item.fields.slug === slug);
        if (item) {
          setEntryId(item.sys.id);
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
          setEditFields({}); // Reset edit fields on fetch
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


  // Save handler for Contentful Management API
  const handleSave = async () => {
    if (!entryId) {
      setSaveMsg('Entry ID not found.');
      return;
    }
    setSaving(true);
    setSaveMsg('');
    let locale = i18n.language || 'en-US';
    if (!['en-US', 'nl'].includes(locale)) locale = 'en-US';
    // Prepare fields to update
    const fields = {};
    if (editFields.name !== undefined) fields.name = { [locale]: editFields.name };
    if (editFields.overview !== undefined) fields.overview = { [locale]: editFields.overview };
    if (editFields.depth !== undefined) fields.depth = { [locale]: editFields.depth };
    if (editFields.difficulty !== undefined) fields.difficulty = { [locale]: editFields.difficulty };
    if (editFields.location !== undefined) fields.location = { [locale]: editFields.location };
    if (editFields.bestTime !== undefined) fields.bestTime = { [locale]: editFields.bestTime };
    if (editFields.whatYouCanSee !== undefined) fields.whatYouCanSee = { [locale]: editFields.whatYouCanSee.split(',').map(s => s.trim()) };
    if (editFields.marineLifeHighlights !== undefined) fields.marineLifeHighlights = { [locale]: editFields.marineLifeHighlights.split(',').map(s => s.trim()) };
    if (editFields.divingTips !== undefined) fields.divingTips = { [locale]: editFields.divingTips.split(',').map(s => s.trim()) };

    try {
      // Get latest version for the entry
      const versionRes = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${entryId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MGMT_TOKEN}`,
        },
      });
      if (!versionRes.ok) {
        setSaveMsg('Failed to fetch entry version.');
        setSaving(false);
        return;
      }
      const versionJson = await versionRes.json();
      const entryVersion = versionJson.sys.version;

      // Update entry
      const updateRes = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${entryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${MGMT_TOKEN}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': entryVersion,
        },
        body: JSON.stringify({ fields }),
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok) {
        setSaveMsg('Update failed: ' + (updateJson.message || updateRes.statusText));
        setSaving(false);
        return;
      }
      // Publish entry
      const publishRes = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/master/entries/${entryId}/published`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${MGMT_TOKEN}`,
          'X-Contentful-Version': updateJson.sys.version,
        },
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok) {
        setSaveMsg('Publish failed: ' + (publishJson.message || publishRes.statusText));
        setSaving(false);
        return;
      }
      setSaveMsg('Saved and published!');
      setEditMode(false);
      setEditFields({});
      fetchDiveSite();
    } catch (e) {
      setSaveMsg('Error: ' + e.message);
    }
    setSaving(false);
  };

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
        <button
          onClick={() => setEditMode(e => !e)}
          style={{padding:'6px 16px', background:editMode ? '#888' : '#00b894', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', marginRight:8}}
        >
          {editMode ? 'Exit Edit Mode' : 'Edit Sections'}
        </button>
        {lastFetched && <span style={{fontSize:12, color:'#666'}}>Last fetched: {lastFetched}</span>}
        {editMode && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{padding:'6px 16px', background:'#0984e3', color:'#fff', border:'none', borderRadius:4, cursor:saving?'not-allowed':'pointer', marginRight:8}}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
        {saveMsg && <span style={{fontSize:12, color:'#0984e3', marginLeft:8}}>{saveMsg}</span>}
      </div>
      {error && <div style={{color:'red', marginBottom:8}}>Error: {error}</div>}
      {data === null && !error && <div>No data found for this dive site. Check the console for details.</div>}
      {data && (
        <>
          <div style={{marginBottom:12, fontSize:13, color:'#888'}}>
            <strong>Debug info:</strong> Locale: {i18n.language} | Name: {data.name || <span style={{color:'orange'}}>Missing</span>} | Slug: Diveasia
          </div>
          {/* Editable sections */}
          <div style={{marginBottom:24, background:'#f8f8f8', padding:16, borderRadius:8}}>
            {/* Name */}
            <div style={{marginBottom:12}}>
              <strong>Name:</strong>{' '}
              {editMode ? (
                <input
                  type="text"
                  value={editFields.name !== undefined ? editFields.name : data.withFallback(data.name, 'Name')}
                  onChange={e => setEditFields(f => ({...f, name: e.target.value}))}
                  style={{padding:4, border:'1px solid #ccc', borderRadius:4, minWidth:200}}
                />
              ) : (
                <span>{data.withFallback(data.name, 'Name')}</span>
              )}
            </div>
            {/* Overview */}
            <div style={{marginBottom:12}}>
              <strong>Overview:</strong>{' '}
              {editMode ? (
                <textarea
                  value={editFields.overview !== undefined ? editFields.overview : data.withFallback(data.overview, 'Overview')}
                  onChange={e => setEditFields(f => ({...f, overview: e.target.value}))}
                  style={{padding:4, border:'1px solid #ccc', borderRadius:4, minWidth:300, minHeight:60}}
                />
              ) : (
                <span>{data.withFallback(data.overview, 'Overview')}</span>
              )}
            </div>
            {/* Quick Facts */}
            <div style={{marginBottom:12}}>
              <strong>Quick Facts:</strong>
              <div style={{marginLeft:16}}>
                <div>
                  <span>Depth: </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={editFields.depth !== undefined ? editFields.depth : data.withFallback(data.depth, 'Depth')}
                      onChange={e => setEditFields(f => ({...f, depth: e.target.value}))}
                      style={{padding:2, border:'1px solid #ccc', borderRadius:4, minWidth:60}}
                    />
                  ) : (
                    <span>{data.withFallback(data.depth, 'Depth')}</span>
                  )}
                </div>
                <div>
                  <span>Difficulty: </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={editFields.difficulty !== undefined ? editFields.difficulty : data.withFallback(data.difficulty, 'Difficulty')}
                      onChange={e => setEditFields(f => ({...f, difficulty: e.target.value}))}
                      style={{padding:2, border:'1px solid #ccc', borderRadius:4, minWidth:60}}
                    />
                  ) : (
                    <span>{data.withFallback(data.difficulty, 'Difficulty')}</span>
                  )}
                </div>
                <div>
                  <span>Location: </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={editFields.location !== undefined ? editFields.location : data.withFallback(data.location, 'Location')}
                      onChange={e => setEditFields(f => ({...f, location: e.target.value}))}
                      style={{padding:2, border:'1px solid #ccc', borderRadius:4, minWidth:60}}
                    />
                  ) : (
                    <span>{data.withFallback(data.location, 'Location')}</span>
                  )}
                </div>
                <div>
                  <span>Best Time: </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={editFields.bestTime !== undefined ? editFields.bestTime : data.withFallback(data.bestTime, 'Best Time')}
                      onChange={e => setEditFields(f => ({...f, bestTime: e.target.value}))}
                      style={{padding:2, border:'1px solid #ccc', borderRadius:4, minWidth:60}}
                    />
                  ) : (
                    <span>{data.withFallback(data.bestTime, 'Best Time')}</span>
                  )}
                </div>
              </div>
            </div>
            {/* What You Can See */}
            <div style={{marginBottom:12}}>
              <strong>What You Can See:</strong>{' '}
              {editMode ? (
                <textarea
                  value={editFields.whatYouCanSee !== undefined ? editFields.whatYouCanSee : (Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee.join(', ') : '')}
                  onChange={e => setEditFields(f => ({...f, whatYouCanSee: e.target.value}))}
                  style={{padding:4, border:'1px solid #ccc', borderRadius:4, minWidth:300, minHeight:40}}
                />
              ) : (
                <span>{Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee.join(', ') : ''}</span>
              )}
            </div>
            {/* Marine Life Highlights */}
            <div style={{marginBottom:12}}>
              <strong>Marine Life Highlights:</strong>{' '}
              {editMode ? (
                <textarea
                  value={editFields.marineLifeHighlights !== undefined ? editFields.marineLifeHighlights : (Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights.join(', ') : '')}
                  onChange={e => setEditFields(f => ({...f, marineLifeHighlights: e.target.value}))}
                  style={{padding:4, border:'1px solid #ccc', borderRadius:4, minWidth:300, minHeight:40}}
                />
              ) : (
                <span>{Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights.join(', ') : ''}</span>
              )}
            </div>
            {/* Diving Tips */}
            <div style={{marginBottom:12}}>
              <strong>Diving Tips:</strong>{' '}
              {editMode ? (
                <textarea
                  value={editFields.divingTips !== undefined ? editFields.divingTips : (Array.isArray(data.divingTips) ? data.divingTips.join(', ') : '')}
                  onChange={e => setEditFields(f => ({...f, divingTips: e.target.value}))}
                  style={{padding:4, border:'1px solid #ccc', borderRadius:4, minWidth:300, minHeight:40}}
                />
              ) : (
                <span>{Array.isArray(data.divingTips) ? data.divingTips.join(', ') : ''}</span>
              )}
            </div>
            {/* Images section is not editable in this simple mode */}
          </div>
          {/* Show preview with edited fields if in edit mode */}
          <DiveSiteDetail
            name={editMode ? (editFields.name ?? data.withFallback(data.name, 'Name')) : data.withFallback(data.name, 'Name')}
            overview={editMode ? (editFields.overview ?? data.withFallback(data.overview, 'Overview')) : data.withFallback(data.overview, 'Overview')}
            quickFacts={{
              depth: editMode ? (editFields.depth ?? data.withFallback(data.depth, 'Depth')) : data.withFallback(data.depth, 'Depth'),
              difficulty: editMode ? (editFields.difficulty ?? data.withFallback(data.difficulty, 'Difficulty')) : data.withFallback(data.difficulty, 'Difficulty'),
              location: editMode ? (editFields.location ?? data.withFallback(data.location, 'Location')) : data.withFallback(data.location, 'Location'),
              bestTime: editMode ? (editFields.bestTime ?? data.withFallback(data.bestTime, 'Best Time')) : data.withFallback(data.bestTime, 'Best Time'),
            }}
            whatYouCanSee={editMode ? (editFields.whatYouCanSee !== undefined ? editFields.whatYouCanSee.split(',').map(s => s.trim()) : (Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee : [])) : (Array.isArray(data.whatYouCanSee) ? data.whatYouCanSee : [])}
            marineLifeHighlights={editMode ? (editFields.marineLifeHighlights !== undefined ? editFields.marineLifeHighlights.split(',').map(s => s.trim()) : (Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights : [])) : (Array.isArray(data.marineLifeHighlights) ? data.marineLifeHighlights : [])}
            divingTips={editMode ? (editFields.divingTips !== undefined ? editFields.divingTips.split(',').map(s => s.trim()) : (Array.isArray(data.divingTips) ? data.divingTips : [])) : (Array.isArray(data.divingTips) ? data.divingTips : [])}
            images={Array.isArray(data.images) ? data.images : []}
          />
        </>
      )}
      {apiResponse && (
        <details style={{marginTop:24, fontSize:12}}>
          <summary>Show raw Contentful API response</summary>
          <pre style={{whiteSpace:'pre-wrap', wordBreak:'break-all', background:'#f6f8fa', padding:12, borderRadius:4, maxHeight:400, overflow:'auto'}}>{JSON.stringify(apiResponse, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
