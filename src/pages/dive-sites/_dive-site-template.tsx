
import { useState } from 'react';
import DiveSiteDetail from '@/components/DiveSiteDetail';

// Simple local state version, no Contentful
export default function DiveSiteTemplate() {
  const [editMode, setEditMode] = useState(false);
  const [fields, setFields] = useState({
    name: '',
    overview: '',
    depth: '',
    difficulty: '',
    location: '',
    bestTime: '',
    whatYouCanSee: '',
    marineLifeHighlights: '',
    divingTips: '',
  });

  return (
    <div className="px-4 md:px-8">
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => setEditMode((e) => !e)}
          style={{ padding: '6px 16px', background: editMode ? '#888' : '#00b894', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 8 }}
        >
          {editMode ? 'Exit Edit Mode' : 'Edit Sections'}
        </button>
      </div>
      <div style={{ marginBottom: 12, fontSize: 13, color: '#888' }}>
        <strong>Debug info:</strong> (Local only, not connected to Contentful)
      </div>
      <div style={{ marginBottom: 24, background: '#f8f8f8', padding: 16, borderRadius: 8 }}>
        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <strong>Name:</strong>{' '}
          {editMode ? (
            <input
              type="text"
              value={fields.name}
              onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
              style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, minWidth: 200 }}
            />
          ) : (
            <span>{fields.name}</span>
          )}
        </div>
        {/* Overview */}
        <div style={{ marginBottom: 12 }}>
          <strong>Overview:</strong>{' '}
          {editMode ? (
            <textarea
              value={fields.overview}
              onChange={e => setFields(f => ({ ...f, overview: e.target.value }))}
              style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, minWidth: 300, minHeight: 60 }}
            />
          ) : (
            <span>{fields.overview}</span>
          )}
        </div>
        {/* Quick Facts */}
        <div style={{ marginBottom: 12 }}>
          <strong>Quick Facts:</strong>
          <div style={{ marginLeft: 16 }}>
            <div>
              <span>Depth: </span>
              {editMode ? (
                <input
                  type="text"
                  value={fields.depth}
                  onChange={e => setFields(f => ({ ...f, depth: e.target.value }))}
                  style={{ padding: 2, border: '1px solid #ccc', borderRadius: 4, minWidth: 60 }}
                />
              ) : (
                <span>{fields.depth}</span>
              )}
            </div>
            <div>
              <span>Difficulty: </span>
              {editMode ? (
                <input
                  type="text"
                  value={fields.difficulty}
                  onChange={e => setFields(f => ({ ...f, difficulty: e.target.value }))}
                  style={{ padding: 2, border: '1px solid #ccc', borderRadius: 4, minWidth: 60 }}
                />
              ) : (
                <span>{fields.difficulty}</span>
              )}
            </div>
            <div>
              <span>Location: </span>
              {editMode ? (
                <input
                  type="text"
                  value={fields.location}
                  onChange={e => setFields(f => ({ ...f, location: e.target.value }))}
                  style={{ padding: 2, border: '1px solid #ccc', borderRadius: 4, minWidth: 60 }}
                />
              ) : (
                <span>{fields.location}</span>
              )}
            </div>
            <div>
              <span>Best Time: </span>
              {editMode ? (
                <input
                  type="text"
                  value={fields.bestTime}
                  onChange={e => setFields(f => ({ ...f, bestTime: e.target.value }))}
                  style={{ padding: 2, border: '1px solid #ccc', borderRadius: 4, minWidth: 60 }}
                />
              ) : (
                <span>{fields.bestTime}</span>
              )}
            </div>
          </div>
        </div>
        {/* What You Can See */}
        <div style={{ marginBottom: 12 }}>
          <strong>What You Can See:</strong>{' '}
          {editMode ? (
            <textarea
              value={fields.whatYouCanSee}
              onChange={e => setFields(f => ({ ...f, whatYouCanSee: e.target.value }))}
              style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, minWidth: 300, minHeight: 40 }}
            />
          ) : (
            <span>{fields.whatYouCanSee}</span>
          )}
        </div>
        {/* Marine Life Highlights */}
        <div style={{ marginBottom: 12 }}>
          <strong>Marine Life Highlights:</strong>{' '}
          {editMode ? (
            <textarea
              value={fields.marineLifeHighlights}
              onChange={e => setFields(f => ({ ...f, marineLifeHighlights: e.target.value }))}
              style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, minWidth: 300, minHeight: 40 }}
            />
          ) : (
            <span>{fields.marineLifeHighlights}</span>
          )}
        </div>
        {/* Diving Tips */}
        <div style={{ marginBottom: 12 }}>
          <strong>Diving Tips:</strong>{' '}
          {editMode ? (
            <textarea
              value={fields.divingTips}
              onChange={e => setFields(f => ({ ...f, divingTips: e.target.value }))}
              style={{ padding: 4, border: '1px solid #ccc', borderRadius: 4, minWidth: 300, minHeight: 40 }}
            />
          ) : (
            <span>{fields.divingTips}</span>
          )}
        </div>
      </div>
      {/* Show preview with edited fields */}
      <DiveSiteDetail
        name={fields.name}
        overview={fields.overview}
        quickFacts={{
          depth: fields.depth,
          difficulty: fields.difficulty,
          location: fields.location,
          bestTime: fields.bestTime,
        }}
        whatYouCanSee={fields.whatYouCanSee.split(',').map(s => s.trim()).filter(Boolean)}
        marineLifeHighlights={fields.marineLifeHighlights.split(',').map(s => s.trim()).filter(Boolean)}
        divingTips={fields.divingTips.split(',').map(s => s.trim()).filter(Boolean)}
        images={[]}
      />
    </div>
  );
}
