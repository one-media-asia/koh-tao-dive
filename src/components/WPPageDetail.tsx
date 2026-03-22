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
    <div className="min-h-screen bg-background py-8">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden rounded-xl shadow-lg mb-8 h-72">
        <img src={hero} alt={page?.title?.rendered || ''} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">{page?.title?.rendered}</h1>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Facts */}
        <Card className="h-full flex flex-col justify-between">
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
        <Card className="h-full flex flex-col justify-between">
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

        {/* Book Now */}
        <Card className="h-full flex flex-col justify-between border-blue-400 border-2 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">Ready to dive?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 justify-between">
            <p className="text-sm text-muted-foreground mb-4">Experience {page?.title?.rendered} with our experienced guides and premium equipment.</p>
            <Button className="w-full mt-auto bg-blue-600 text-white hover:bg-blue-700" size="lg" onClick={() => setShowBookingWarning(true)}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Overview & Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
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
        <Card>
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
      </div>

      {/* Gallery Section */}
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

      {/* Booking Section (bottom) */}
      <Card className="mb-8 border-blue-400 border-2 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">Book Now</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-muted-foreground mb-4 max-w-2xl text-center">Experience {page?.title?.rendered} with our experienced guides and premium equipment.</p>
          <Button onClick={() => setShowBookingWarning(true)} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" size="lg">
            Book Now
          </Button>
        </CardContent>
      </Card>

      {/* Booking Warning Dialog */}
      <AlertDialog open={showBookingWarning} onOpenChange={setShowBookingWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to book?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to book now or contact us for more information?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <a href="https://www.divinginasia.com/#contact" tabIndex={0} className="mr-2">
              <Button variant="outline" asChild>
                <span>Contact</span>
              </Button>
            </a>
            <AlertDialogAction onClick={() => window.location.href = '/booking?item=Fun%20Dive&type=dive&price=1800&currency=THB&dives=2'}>Book Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

    export default WPPageDetail;
                <span>Contact</span>
