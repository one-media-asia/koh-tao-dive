import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

interface PageContentRow {
  id: string;
  language: 'en' | 'nl';
  seo: boolean;
  dive_site?: string;
  page?: string;
  section: string;
  content: string;
}

type GroupedContent = {
  [key: string]: {
    [section: string]: {
      en?: PageContentRow;
      nl?: PageContentRow;
    };
  };
};

const PagesContent: React.FC = () => {
  const [data, setData] = useState<PageContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_content')
        .select('*');
      if (error) {
        setError(error.message);
      } else {
        setData(data as PageContentRow[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Group by dive_site or page, then by section
  const grouped: GroupedContent = {};
  data.forEach(row => {
    const key = row.dive_site || row.page || 'Other';
    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][row.section]) grouped[key][row.section] = {};
    grouped[key][row.section][row.language] = row;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Pages Content (EN / NL)</h1>
      {Object.entries(grouped).map(([site, sections]) => (
        <div key={site} style={{ marginBottom: 32 }}>
          <h2 style={{ borderBottom: '1px solid #ccc' }}>{site}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>Section</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>EN Content</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>NL Content</th>
                <th style={{ border: '1px solid #ccc', padding: 8 }}>SEO</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sections).map(([section, langs]) => (
                <tr key={section}>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{section}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{langs.en?.content || <em>—</em>}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>{langs.nl?.content || <em>—</em>}</td>
                  <td style={{ border: '1px solid #ccc', padding: 8 }}>
                    {langs.en?.seo || langs.nl?.seo ? '✅' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default PagesContent;
