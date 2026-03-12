import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { usePageContent } from '@/hooks/usePageContent';
import { PageContentEditor } from './PageContentEditor';
import Contact from './Contact';
import ImageRow from './ImageRow';

export interface CourseSection {
  title: string;
  content: string | string[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface CoursePageProps {
  pageSlug: string;
  locale: 'en' | 'nl';
  fallbackContent: {
    hero_title: string;
    hero_subtitle: string;
    course_overview: string;
    price_thb?: string;
    price_usd?: string;
    price_eur?: string;
    duration?: string;
  };
  heroImage?: string;
  images?: string[];
  sections?: CourseSection[];
  faqs?: CourseFAQ[];
  level?: string;
  bookingItemName?: string;
  bookingType?: 'course' | 'dive';
}

const CoursePageTemplate: React.FC<CoursePageProps> = ({
  pageSlug,
  locale,
  fallbackContent,
  heroImage,
  images = ['/images/photo-1613853250147-2f73e55c1561.avif', '/images/photo-1618865181016-a80ad83a06d3.avif', '/images/photo-1647825194145-2d94e259c745.avif'],
  sections = [],
  faqs = [],
  level = 'Recreational',
  bookingItemName,
  bookingType = 'course',
}) => {
  const navigate = useNavigate();
  const { content, isLoading } = usePageContent({
    pageSlug,
    locale,
    fallbackContent,
  });

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const localeTag = locale === 'nl' ? 'nl-NL' : 'en-US';
  const parseAmount = (value: string) => {
    const digits = String(value || '').replace(/[^\d.-]/g, '');
    return Number(digits || 0);
  };
  const formatCurrency = (amount: number, currency: 'THB' | 'USD' | 'EUR') =>
    new Intl.NumberFormat(localeTag, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const priceThb = content.price_thb || fallbackContent.price_thb || '0';
  const priceUsd = content.price_usd || fallbackContent.price_usd || '';
  const priceEur = content.price_eur || fallbackContent.price_eur || '';
  const duration = content.duration || fallbackContent.duration || 'Contact us';
  const thbAmount = parseAmount(priceThb);
  const bookingUrl = `/booking?item=${encodeURIComponent(bookingItemName || '')}&type=${bookingType}&price=${thbAmount}&currency=THB`;

  const heroImageUrl = heroImage || images[0];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <img 
          src={heroImageUrl} 
          alt={content.hero_title} 
          className="absolute inset-0 w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">{content.hero_title}</h1>
          <p className="mt-4 max-w-2xl text-lg">{content.hero_subtitle}</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>
              {locale === 'nl' ? 'Boek Nu' : 'Book Now'}
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {images.length > 0 && <ImageRow images={images} />}
        
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              {locale === 'nl' ? 'Cursusoverzicht' : 'Course Overview'}
            </h2>
            <p className="mb-6 text-base leading-relaxed">{content.course_overview}</p>

            {sections.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                {Array.isArray(section.content) ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.content.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base leading-relaxed">{section.content}</p>
                )}
              </div>
            ))}

            {faqs.length > 0 && (
              <>
                <h3 className="text-xl font-semibold mb-4 mt-8">
                  {locale === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions'}
                </h3>
                <div className="space-y-4">
                  {faqs.map((faq, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside>
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{locale === 'nl' ? 'Cursusdetails' : 'Course Details'}</CardTitle>
                  <Badge>{level}</Badge>
                </div>
                <CardDescription>{duration}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {locale === 'nl' ? 'Prijs' : 'Price'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-sky-600">{formatCurrency(thbAmount, 'THB')}</p>
                    <p className="text-sm text-muted-foreground">
                      {priceUsd && <span>{formatCurrency(Number(priceUsd), 'USD')}</span>}
                      {priceUsd && priceEur && <span> / </span>}
                      {priceEur && <span>{formatCurrency(Number(priceEur), 'EUR')}</span>}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {locale === 'nl' 
                    ? 'Inclusief alle training, materialen, PADI certificering en uitrusting' 
                    : 'Includes all training, materials, PADI certification and equipment'}
                </p>
                <Button className="w-full" onClick={() => navigate(bookingUrl)}>
                  {locale === 'nl' ? 'Boek / Informeer' : 'Book / Enquire'}
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <PageContentEditor pageSlug={pageSlug} locale={locale} />
        
        <section className="mt-12">
          <Contact />
        </section>
      </main>
    </div>
  );
};

export default CoursePageTemplate;
