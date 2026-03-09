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

const Rescue: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=PADI%20Rescue%20Diver&type=course&price=10000&currency=THB';
  const randomImage = useMemo(() => {
    return imageList[Math.floor(Math.random() * imageList.length)];
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <img src={randomImage} alt="Rescue Diver" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">PADI Rescue Diver</h1>
          <p className="mt-4 max-w-2xl">Ontwikkel de vaardigheden en het vertrouwen om duiknoodsituaties te beheersen en anderen te helpen. De Rescue Diver-cursus is een belangrijke stap voor serieuze duikers.</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek Rescue</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cursusoverzicht</h2>
            <p className="mb-6">De Rescue Diver-cursus leert je duiknoodsituaties te voorkomen en te beheersen, reddingen uit te voeren en met vertrouwen als onderdeel van een duikteam te werken.</p>

            <h3 className="text-xl font-semibold mb-3">Behandelde vaardigheden</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Zelfredding en herkennen van duikerstress</li>
              <li>Reddingsscenario's en technieken</li>
              <li>Noodmanagement en uitrusting</li>
              <li>Reddingsbeademing en slachtofferzorg</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Opbouw & vereisten vooraf</h3>
            <p className="mb-6">Duur: meestal 3 dagen met zwembad- en buitenwatersessies. Vereist: EFR (of gelijkwaardig) en een Open Water-brevet.</p>

            <h3 className="text-xl font-semibold mb-3">Inbegrepen</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Lesmateriaal en certificering</li>
              <li>Reddingsvaardigheidstraining in zwembad en buitenwater</li>
              <li>Huur van alle uitrusting</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Is Rescue moeilijk?</CardTitle>
                </CardHeader>
                <CardContent>
                  De cursus is uitdagend, maar instructeurs begeleiden je stap voor stap. Een goede conditie en comfort in het water helpen.
                </CardContent>
              </Card>
            </div>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cursusdetails</CardTitle>
                  <Badge>Gevorderd</Badge>
                </div>
                <CardDescription>3 dagen · Zwembad & buitenwater · Certificering</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿10,000</p>
                <p className="text-sm text-muted-foreground mb-4">Inclusief EFR-vereiste indien nodig</p>
                <Button onClick={() => navigate(bookingUrl)}>Boek Rescue</Button>
              </CardContent>
            </Card>
          </aside>
        </div>

        <section className="mt-12">
          <h3 className="text-2xl font-semibold mb-4">Boeken</h3>
          <p className="mb-4">Vul het boekingsformulier hieronder in om je plek te reserveren. Rescue-cursussen worden regelmatig gepland — neem contact op voor privésessies.</p>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <a href="https://www.divinginasia.com/#contact" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold mb-2">Neem contact op om te boeken/informatie aan te vragen</a>
            <div className="text-muted-foreground text-sm mb-4">Of gebruik het formulier hieronder om direct een boekingsaanvraag te sturen.</div>
          </div>
          <Button onClick={() => navigate(bookingUrl)}>Verstuur boekingsaanvraag</Button>
        </section>
        <Contact />
      </main>
    </div>
  );
};

export default Rescue;
