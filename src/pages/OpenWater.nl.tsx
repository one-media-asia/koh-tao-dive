import Contact from '../components/Contact';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import ImageRow from '@/components/ImageRow';
import openWaterHero from '../../images/openwater/openwater.jpg';

const OpenWater: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=PADI%20Open%20Water%20Course&type=course&price=11000&currency=THB';
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <img src={openWaterHero} alt="Open Water" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">PADI Open Water-cursus</h1>
          <p className="mt-4 max-w-2xl">De PADI Open Water Diver-cursus is de populairste duikcursus ter wereld. Je leert de basis van het duiken en behaalt je brevet om zelfstandig met een buddy te duiken tot 18 meter/60 voet.</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek Open Water</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <ImageRow images={["/images/photo-1659518893171-b15e20a8e201.avif","/images/photo-1682686580849-3e7f67df4015.avif","/images/photo-1647825194145-2d94e259c745.avif"]} />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cursusoverzicht</h2>
            <p className="mb-6">De Open Water-cursus combineert theorie, beschut water-training (zwembad) en buitenwaterduiken. Je leert uitrusting opbouwen, basisvaardigheden onder water, drijfvermogen en duikplanning. Onze instructeurs werken met kleine groepen en leggen de nadruk op veiligheid en plezier.</p>

            <h3 className="text-xl font-semibold mb-3">Wat je leert</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Opbouwen en gebruiken van duikuitrusting</li>
              <li>Drijfvermogen en ademhalingstechnieken</li>
              <li>Basis onderwaternavigatie</li>
              <li>Noodprocedures en oppervlaktebewustzijn</li>
            </ul>
            <h3 className="text-xl font-semibold mb-3">Cursusopbouw</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Duur: 3-4 dagen (flexibele planning)</li>
              <li>Theoriesessies + training in beschut water</li>
              <li>4 buitenwaterduiken</li>
              <li>Minimumleeftijd: 10 jaar (Junior Open Water voor 10-14)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Inbegrepen</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>PADI-lesmateriaal en certificering</li>
              <li>Huur van alle duikuitrusting</li>
              <li>Zwembad- en buitenwatertraining</li>
              <li>Bootkosten waar van toepassing</li>
              <li>Thee, koffie en flessenwater</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Veelgestelde vragen</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Heb ik vooraf ervaring nodig?</CardTitle>
                </CardHeader>
                <CardContent>
                  Voorafgaande duikervaring is niet nodig — de cursus begint bij de basis.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Is de cursus veilig?</CardTitle>
                </CardHeader>
                <CardContent>
                  Ja. We werken met kleine groepen, ervaren PADI-instructeurs en moderne uitrusting. Voor elke sessie krijg je een veiligheidsbriefing.
                </CardContent>
              </Card>
            </div>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cursusdetails</CardTitle>
                  <Badge>Beginner</Badge>
                </div>
                <CardDescription>3-4 dagen · 4 buitenwaterduiken · Certificering inbegrepen</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿11,000</p>
                <p className="text-sm text-muted-foreground mb-4">Inclusief lesmateriaal en uitrusting</p>
                <ul className="text-sm mb-4">
                  <li>• Kleine groepen</li>
                  <li>• Ervaren PADI-instructeurs</li>
                  <li>• Flexibele startdata</li>
                </ul>
                <Button onClick={() => navigate(bookingUrl)}>Boek nu</Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Boeken & vervolgstappen</h3>
          <p className="mb-4">Om te boeken kun je <a href="https://www.divinginasia.com/#contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">contact opnemen</a> voor een aanvraag, of het boekingsformulier onderaan deze pagina gebruiken. We bevestigen beschikbare data en eventuele vereisten.</p>
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

export default OpenWater;
