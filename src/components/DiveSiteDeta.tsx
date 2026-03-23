import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useNavigate } from 'react-router-dom';
import { MapPin, Waves, Fish, Clock, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DiveSiteDetailProps {
  name: string;
  overview: string;
  quickFacts: {
    depth: string;
    difficulty: string;
    location: string;
    bestTime: string;
  };
  whatYouCanSee: string[];
  marineLifeHighlights: string[];
  divingTips: string[];
  images: string[];
  fullHeightHero?: boolean;
  noOverlay?: boolean;
  secondaryImage?: string;
}

const DiveSiteDetail: React.FC<DiveSiteDetailProps> = ({
  name,
  overview,
  quickFacts,
  whatYouCanSee,
  marineLifeHighlights,
  divingTips,
  images,
  fullHeightHero = false,
  noOverlay = false,
  secondaryImage
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isDutch = i18n.language.startsWith('nl');
  const [showBookingWarning, setShowBookingWarning] = useState(false);
  
  const hero = images && images.length > 0 ? images[0] : '/images/photo-1682686580849-3e7f67df4015.avif';
  
  const handleBookingClick = () => {
    setShowBookingWarning(true);
  };
  
  const confirmBooking = () => {
    navigate(`/booking?item=${encodeURIComponent('Fun Dive')}&type=dive&price=1800&currency=THB&dives=2`);
  };

  const contactInstead = () => {
    window.location.href = 'https://www.divinginasia.com/#contact';
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
      case 'Beginner-gemiddeld':
      case 'Beginner tot gemiddeld':
        return 'bg-green-100 text-green-800';
      case 'Beginner-Intermediate':
      case 'Intermediate':
      case 'Gemiddeld':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
      case 'Gevorderd':
        return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-gray-800';
    }
  };

  const labels = isDutch
    ? {
        back: 'Terug naar duiklocaties',
        overview: 'Overzicht',
        depth: 'Diepte',
        location: 'Locatie',
        visibility: 'Zicht',
        current: 'Stroming',
        level: 'Niveau',
        bestTime: 'Beste periode',
        marineLife: 'Hoogtepunten marien leven',
        tips: 'Duiktips',
        quickFacts: 'Snelle feiten',
        depthRange: 'Dieptebereik',
        whatToSee: 'Wat kun je zien',
        ready: 'Klaar om te duiken?',
        readyBody: `Ervaar ${name} met onze ervaren gidsen en premium materiaal.`
      }
    : {
        back: 'Back to dive sites',
        overview: 'Overview',
        depth: 'Depth',
        location: 'Location',
        visibility: 'Visibility',
        current: 'Current',
        level: 'Level',
        bestTime: 'Best time',
        marineLife: 'Marine life highlights',
        tips: 'Diving tips',
        quickFacts: 'Quick facts',
        depthRange: 'Depth range',
        whatToSee: 'What you can see',
        ready: 'Ready to dive?',
        readyBody: `Experience ${name} with our experienced guides and premium equipment.`
      };

  // ...existing code...

  return (
    <div className="min-h-screen bg-background py-8">
      {/* Hero Section */}
      <section className={`relative flex items-center justify-center overflow-hidden rounded-xl shadow-lg mb-8 ${fullHeightHero ? 'min-h-[calc(60vh)]' : 'h-72'}`}>
        <img src={hero} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        {!noOverlay && <div className="absolute inset-0 bg-black/35" />}
        <div className={`relative z-10 text-center px-4 ${noOverlay ? 'bg-black/30 rounded-xl py-6' : 'text-white'}`}>
          <Link to="/koh-tao-dive-sites" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {labels.back}
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-2 text-white drop-shadow-lg">{name}</h1>
          {/* Best Time Badge */}
          {quickFacts.bestTime && (
            <span className="inline-block bg-blue-600 text-white text-xs md:text-sm font-semibold rounded-full px-4 py-1 mb-2 shadow-lg">
              {labels.bestTime}: {quickFacts.bestTime}
            </span>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Facts */}
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{labels.quickFacts}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div><span className="font-medium text-sm">{labels.depthRange}:</span> <span className="text-sm text-muted-foreground">{quickFacts.depth}</span></div>
            <div><span className="font-medium text-sm">{labels.level}:</span> <span className="text-sm text-muted-foreground">{quickFacts.difficulty}</span></div>
            <div><span className="font-medium text-sm">{labels.location}:</span> <span className="text-sm text-muted-foreground">{quickFacts.location}</span></div>
          </CardContent>
        </Card>

        {/* What You Can See */}
        <Card className="h-full flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{labels.whatToSee}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {whatYouCanSee.map((item, index) => (
                <Badge key={index} variant="outline">{item}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Book Now */}
        <Card className="h-full flex flex-col justify-between border-blue-400 border-2 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-700">{labels.ready}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 justify-between">
            <p className="text-sm text-muted-foreground mb-4">{labels.readyBody}</p>
            <Button className="w-full mt-auto bg-blue-600 text-white hover:bg-blue-700" size="lg" onClick={handleBookingClick}>
              {labels.bookSite || 'Book Now'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Overview & Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{labels.overview}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-base">{overview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{labels.tips}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {divingTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Gallery Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{labels.gallery || 'Gallery'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${labels.imageAlt || name} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Section (bottom) */}
      <Card className="mb-8 border-blue-400 border-2 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-700">{labels.bookTitle || 'Book Now'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-muted-foreground mb-4 max-w-2xl text-center">{labels.bookBody || labels.readyBody}</p>
          <Button onClick={handleBookingClick} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700" size="lg">
            {labels.bookPage || 'Book Now'}
          </Button>
        </CardContent>
      </Card>

      {/* Booking Warning Dialog */}
      <AlertDialog open={showBookingWarning} onOpenChange={setShowBookingWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.warningTitle || 'Ready to book?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.warningMessage || 'Would you like to book now or contact us for more information?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel || 'Cancel'}</AlertDialogCancel>
            <a href="https://www.divinginasia.com/#contact" tabIndex={0} className="mr-2">
              <Button variant="outline" asChild>
                <span>Contact</span>
              </Button>
            </a>
            <AlertDialogAction onClick={confirmBooking}>{labels.continueBooking || 'Book Now'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiveSiteDetail;