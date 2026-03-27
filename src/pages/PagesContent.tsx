import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const cleanEnv = (value: string | undefined) =>
  String(value || '')
    .replace(/\\n/g, '')
    .trim();

const supabaseUrl =
  cleanEnv((import.meta.env.VITE_SUPABASE_URL as string | undefined)) ||
  cleanEnv(process.env.REACT_APP_SUPABASE_URL) ||
  '';
const supabaseKey =
  cleanEnv((import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)) ||
  cleanEnv((import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)) ||
  cleanEnv(process.env.REACT_APP_SUPABASE_ANON_KEY) ||
  '';
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
    <div className="p-6">
      <h1>Pages Content (EN / NL)</h1>
      {Object.entries(grouped).map(([site, sections]) => (
        <div key={site} className="mb-8">
          <h2 className="border-b border-gray-300">{site}</h2>
          <table className="mt-2 w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Section</th>
                <th className="border border-gray-300 p-2 text-left">EN Content</th>
                <th className="border border-gray-300 p-2 text-left">NL Content</th>
                <th className="border border-gray-300 p-2 text-left">SEO</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sections).map(([section, langs]) => (
                <tr key={section}>
                  <td className="border border-gray-300 p-2">{section}</td>
                  <td className="border border-gray-300 p-2">{langs.en?.content || <em>—</em>}</td>
                  <td className="border border-gray-300 p-2">{langs.nl?.content || <em>—</em>}</td>
                  <td className="border border-gray-300 p-2">
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
