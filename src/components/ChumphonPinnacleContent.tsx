import { useEffect, useState } from 'react';
import { fetchEntries } from '../utils/contentfulClient';

export default function ChumphonPinnacleContent() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries('chumphonPinnacle')
      .then((items) => setEntries(items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Chumphon Pinnacle content...</div>;
  if (!entries.length) return <div>No content found.</div>;

  return (
    <div>
      <h2>Chumphon Pinnacle Content</h2>
      {entries.map((entry) => (
        <div key={entry.sys.id}>
          <h3>{entry.fields.title}</h3>
          <div>{entry.fields.description}</div>
        </div>
      ))}
    </div>
  );
}
