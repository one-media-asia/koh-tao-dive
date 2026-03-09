import Contact from '../components/Contact';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const imageList = [
  '/images/photo-1613853250147-2f73e55c1561.avif',
  '/images/photo-1618865181016-a80ad83a06d3.avif',
  '/images/photo-1647825194145-2d94e259c745.avif',
  '/images/photo-1659518893171-b15e20a8e201.avif',
  '/images/photo-1682686580849-3e7f67df4015.avif',
  '/images/photo-1682687982423-295485af248a.avif',
  '/images/turtle.avif',
];

const Advanced: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=Advanced%20Open%20Water&type=course&price=10000&currency=THB';
  // Pick a random image on each render
  const randomImage = useMemo(() => {
    return imageList[Math.floor(Math.random() * imageList.length)];
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <img src={randomImage} alt="Advanced Open Water" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">Advanced Open Water</h1>
          <p className="mt-4 max-w-2xl">Breid je vaardigheden uit met vijf Adventure Dives, waaronder diepduiken en navigatie; perfect voor duikers die dieper willen verkennen en meer vertrouwen willen opbouwen.</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek Advanced</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cursushoogtepunten</h2>
            <p className="mb-6">De PADI Advanced Open Water-cursus richt zich op het verbeteren van je onderwatervaardigheden via praktijkduiken. Typische Adventure Dives zijn Deep, Underwater Navigation, Peak Performance Buoyancy en twee keuzevakken zoals Night Diving of Wreck.</p>

            <h3 className="text-xl font-semibold mb-3">Wat je doet</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>5 adventureduiken (kan in 2-3 dagen)</li>
              <li>Oefenen van diepduiktechnieken en navigatie</li>
              <li>Verbeteren van drijfvermogen en comfort onder water</li>
            </ul>
            <h3 className="text-xl font-semibold mb-3">Vereisten vooraf</h3>
            <p className="mb-6">Open Water Diver-brevet (of gelijkwaardig) en minimumleeftijd van 12 jaar.</p>

            <h3 className="text-xl font-semibold mb-3">Inbegrepen</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Lesmateriaal en certificering</li>
              <li>Huur van alle uitrusting</li>
              <li>Bootkosten waar van toepassing</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hoe lang duurt het?</CardTitle>
                </CardHeader>
                <CardContent>
                  De meeste cursisten ronden de cursus af in 2-3 dagen, afhankelijk van keuzevakken en zeecondities.
                </CardContent>
              </Card>
            </div>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cursusdetails</CardTitle>
                  <Badge>Gemiddeld</Badge>
                </div>
                <CardDescription>2-3 dagen · 5 duiken · Certificering</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿10,000</p>
                <p className="text-sm text-muted-foreground mb-4">Inclusief lesmateriaal en uitrusting</p>
                <Button onClick={() => navigate(bookingUrl)}>Boek Advanced</Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Boeken</h3>
          <p className="mb-4">Kies je voorkeursdata en wij bevestigen de beschikbaarheid. Neem contact op voor maatwerkschema's.</p>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <a href="https://www.divinginasia.com/#contact" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mb-2">Neem contact op om te boeken/informatie aan te vragen</a>
            <div className="text-muted-foreground text-sm mb-4">Of gebruik het formulier hieronder om direct een boekingsaanvraag te sturen.</div>
          </div>
          <Button onClick={() => navigate(bookingUrl)}>Verstuur boekingsaanvraag</Button>
        </section>
      </main>
    </div>
  );
};

export default Advanced;
