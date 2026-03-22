import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [showBookingWarning, setShowBookingWarning] = useState(false);

  // Optionally, you can set a default hero image or parse from content
  const hero = '/images/photo-1682686580849-3e7f67df4015.avif';

  useEffect(() => {
    setLoading(true);
    // Fetch page data from WordPress REST API
    fetch(`https://admin.prodiving.asia/wp-json/wp/v2/pages?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPage(data[0]);
          setSections(extractSections(data[0].content.rendered));
        } else {
          setPage(null);
          setSections([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPage(null);
        setSections([]);
        setLoading(false);
      });
  }, [slug]);

  // Find sections by title
  const quickFacts = sections.find(s => /quick facts/i.test(s.title));
  const whatYouCanSee = sections.find(s => /what you can see/i.test(s.title));
  const overview = sections.find(s => /overview/i.test(s.title));
  const divingTips = sections.find(s => /diving tips/i.test(s.title));
  const gallery = sections.find(s => /gallery/i.test(s.title));
  const marineLifeHighlights = sections.find(s => /marine life highlights/i.test(s.title));

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{page?.title?.rendered}</h1>
      {/* Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {overview ? (
            <div className="text-muted-foreground text-base" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(overview.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No overview provided.</span>
          )}
        </CardContent>
      </Card>
      {/* Quick Facts */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Facts</CardTitle>
        </CardHeader>
        <CardContent>
          {quickFacts ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quickFacts.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No quick facts provided.</span>
          )}
        </CardContent>
      </Card>
      {/* What You Can See */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What You Can See</CardTitle>
        </CardHeader>
        <CardContent>
          {whatYouCanSee ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(whatYouCanSee.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No details provided.</span>
          )}
        </CardContent>
      </Card>
      {/* Marine Life Highlights */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Marine Life Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          {marineLifeHighlights ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marineLifeHighlights.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No highlights provided.</span>
          )}
        </CardContent>
      </Card>
      {/* Diving Tips */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diving Tips</CardTitle>
        </CardHeader>
        <CardContent>
          {divingTips ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(divingTips.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No tips provided.</span>
          )}
        </CardContent>
      </Card>
      {/* Gallery */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {gallery ? (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(gallery.content, {ALLOWED_TAGS: ['p','ul','ol','li','strong','em','a','img','br','span','b','i','u','h3','h4','h5','h6'], ALLOWED_ATTR: ['href','src','alt']}) }} />
          ) : (
            <span className="text-muted-foreground">No gallery provided.</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

    export default WPPageDetail;
                <span>Contact</span>
