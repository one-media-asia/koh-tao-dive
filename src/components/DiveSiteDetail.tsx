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
  description: string;
  depth: string;
  difficulty: string;
  location: string;
  highlights: string[];
  detailedDescription: string;
  bestTime: string;
  current: string;
  visibility: string;
  marineLife: string[];
  tips: string[];
  images: string[];
  fullHeightHero?: boolean;
  noOverlay?: boolean;
  secondaryImage?: string;
}

const DiveSiteDetail: React.FC<DiveSiteDetailProps> = ({
  name,
  description,
  depth,
  difficulty,
  location,
  highlights,
  detailedDescription,
  bestTime,
  current,
  visibility,
  marineLife,
  tips,
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
    navigate(`/booking?item=${encodeURIComponent(name)}&type=dive`);
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
      default: return 'bg-gray-100 text-gray-800';
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
        readyBody: `Ervaar ${name} met onze ervaren gidsen en premium materiaal.`,
        bookSite: 'Boek deze duiklocatie',
        gallery: 'Galerij',
        imageAlt: `${name} - Afbeelding`,
        bookTitle: `Boek je duik bij ${name}`,
        bookBody: 'Klaar om deze geweldige duiklocatie te verkennen? Neem contact op om je duikavontuur te regelen.',
        bookPage: 'Ga naar boekingspagina',
        warningTitle: 'Belangrijke mededeling',
        warningMessage: 'Vanwege het weer en ons bootschema is deze specifieke locatie mogelijk niet beschikbaar. Neem contact met ons op om te bevestigen dat we u deze specifieke locatie kunnen aanbieden. Dank u.',
        continueBooking: 'Doorgaan met boeking',
        cancel: 'Annuleren',
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
        readyBody: `Experience ${name} with our expert guides and premium equipment.`,
        bookSite: 'Book this dive site',
        gallery: 'Gallery',
        imageAlt: `${name} - Image`,
        bookTitle: `Book your dive at ${name}`,
        bookBody: 'Ready to explore this incredible dive site? Contact us to arrange your diving adventure.',
        bookPage: 'Go to booking page',
        warningTitle: 'Important Notice',
        warningMessage: 'Due to weather and our boat schedule this specific site may not be available, please contact us to confirm we can offer you this specific site. Thank you.',
        continueBooking: 'Continue Booking',
        cancel: 'Cancel',
      };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className={`relative flex items-center justify-center overflow-hidden ${fullHeightHero ? 'min-h-[calc(100vh-4rem)]' : 'h-96'}`}>
        <img src={hero} alt={name} className="absolute inset-0 w-full h-full object-cover" />
        {!noOverlay && <div className="absolute inset-0 bg-black/35" />}
        <div className={`relative z-10 text-center px-4 ${noOverlay ? 'bg-black/30 rounded-xl py-6' : 'text-white'}`}>
          <Link to="/koh-tao-dive-sites" className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {labels.back}
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">{name}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-white drop-shadow-lg">{description}</p>
        </div>
      </section>

      {secondaryImage && (
        <div className="w-full pt-4">
          <img src={secondaryImage} alt={`${name} reef`} className="w-full object-cover" />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Site Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{labels.overview}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{detailedDescription}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{labels.depth}:</span>
                    <span>{depth}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{labels.location}:</span>
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{labels.visibility}:</span>
                    <span>{visibility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{labels.current}:</span>
                    <span>{current}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">{labels.level}:</span>
                  <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">{labels.bestTime}:</span>
                  <span className="text-muted-foreground">{bestTime}</span>
                </div>
              </CardContent>
            </Card>

            {/* Marine Life */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{labels.marineLife}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {marineLife.map((animal, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Fish className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{animal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diving Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{labels.tips}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardHeader>
                <CardTitle>{labels.quickFacts}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-sm">{labels.depthRange}:</span>
                  <p className="text-sm text-muted-foreground">{depth}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">{labels.level}:</span>
                  <p className="text-sm text-muted-foreground">{difficulty}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">{labels.location}:</span>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">{labels.bestTime}:</span>
                  <p className="text-sm text-muted-foreground">{bestTime}</p>
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>{labels.whatToSee}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((highlight, index) => (
                    <Badge key={index} variant="outline">{highlight}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Book Now */}
            <Card>
              <CardHeader>
                <CardTitle>{labels.ready}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {labels.readyBody}
                  </p>
                  <Button className="w-full" size="lg" onClick={handleBookingClick}>
                    {labels.bookSite}
                  </Button>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">{labels.gallery}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${labels.imageAlt} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Booking Section */}
        <section className="mt-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{labels.bookTitle}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {labels.bookBody}
            </p>
            <Button onClick={handleBookingClick} className="px-6 py-3 bg-blue-600 text-white rounded-lg">{labels.bookPage}</Button>
          </div>
        </section>
      </div>
      
      {/* Booking Warning Dialog */}
      <AlertDialog open={showBookingWarning} onOpenChange={setShowBookingWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.warningTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.warningMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBooking}>{labels.continueBooking}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiveSiteDetail;