import React, { useEffect, useState } from 'react';

interface WPPage {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
}

interface Section {
  title: string;
  content: string;
}

function extractSections(html: string): Section[] {
  // This function splits the HTML content into sections based on <h2> headings
  // and returns an array of { title, content } objects.
  const sectionRegex = /<h2[^>]*>(.*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  const sections: Section[] = [];
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    sections.push({
      title: match[1].trim(),
      content: match[2].trim(),
    });
  }
  return sections;
}

const WPPageDetail: React.FC<{ slug: string }> = ({ slug }) => {
  const [page, setPage] = useState<WPPage | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://admin.prodiving.asia/wp-json/wp/v2/pages?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPage(data[0]);
          setSections(extractSections(data[0].content.rendered));
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!page) return <div>Page not found.</div>;

  // Find sections by title
  const quickFacts = sections.find(s => /quick facts/i.test(s.title));
  const whatYouCanSee = sections.find(s => /what you can see/i.test(s.title));
  const overview = sections.find(s => /overview/i.test(s.title));
  const divingTips = sections.find(s => /diving tips/i.test(s.title));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{page.title.rendered}</h1>
      {/* Main content before first <h2> */}
      <div
        className="mb-6 prose"
        dangerouslySetInnerHTML={{
          __html: page.content.rendered.split('<h2')[0],
        }}
      />
      {/* Cards for each section */}
      <div className="grid gap-4">
        {quickFacts && (
          <div className="bg-blue-50 rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{quickFacts.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: quickFacts.content }} />
          </div>
        )}
        {whatYouCanSee && (
          <div className="bg-green-50 rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{whatYouCanSee.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: whatYouCanSee.content }} />
          </div>
        )}
        {overview && (
          <div className="bg-yellow-50 rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{overview.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: overview.content }} />
          </div>
        )}
        {divingTips && (
          <div className="bg-purple-50 rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{divingTips.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: divingTips.content }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WPPageDetail;
