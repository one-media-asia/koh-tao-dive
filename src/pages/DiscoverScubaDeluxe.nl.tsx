import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const DiscoverScubaDeluxeNl: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=Discover%20Scuba%20Diving%20Deluxe&type=dive&price=5000&currency=THB';

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/discover-scuba-deluxe.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">Discover Scuba Diving Deluxe</h1>
          <p className="mt-4 max-w-2xl">
            Een uitgebreidere en rustigere beginnerservaring met extra onderwatertijd en 3 begeleide duiken.
          </p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek DSD Deluxe</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Programmaoverzicht</h2>
            <p className="mb-6">
              Discover Scuba Diving Deluxe is perfect als je meer wilt dan alleen een korte proefduik. Je start met
              basisvaardigheden in een gecontroleerde omgeving en gaat daarna op meerdere buitenwaterduiken rond Koh Tao.
            </p>

            <h3 className="text-xl font-semibold mb-3">Hoe werkt het?</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dag 1: Zwembad & Kustduik</CardTitle>
                </CardHeader>
                <CardContent>
                  Je leert de belangrijkste duikvaardigheden in beschut water en maakt je eerste rustige buitenwaterduik.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dag 2: Bootduiken</CardTitle>
                </CardHeader>
                <CardContent>
                  Je maakt 2 begeleide bootduiken op duiklocaties rond Koh Tao voor een complete eerste ervaring.
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-3">Wat is inbegrepen?</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Gecertificeerde duikprofessional</li>
              <li>Gebruik van alle duikuitrusting</li>
              <li>Maximaal 4 deelnemers per instructeursgroep</li>
              <li>Totaal 3 duiken (kust + bootduiken)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Veelgestelde vragen</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wat is Discover Scuba Diving Deluxe?</CardTitle>
                </CardHeader>
                <CardContent>
                  Deluxe is een uitgebreid beginnersprogramma met zwembad/skills en 3 buitenwaterduiken voor
                  een completere eerste duikervaring.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Heb ik een brevet nodig?</CardTitle>
                </CardHeader>
                <CardContent>
                  Nee. Dit programma is gemaakt voor niet-gecertificeerde beginners.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Kan ik daarna doorgaan naar Open Water?</CardTitle>
                </CardHeader>
                <CardContent>
                  Ja. DSD Deluxe is een ideale manier om te ontdekken of je wilt doorgaan met een volledige Open Water-cursus.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Is dit geschikt als ik weinig tijd heb?</CardTitle>
                </CardHeader>
                <CardContent>
                  Ja. Je kunt het in 1-2 dagen afronden en toch meerdere duiken maken in een rustiger tempo.
                </CardContent>
              </Card>
            </div>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Programmadetails</CardTitle>
                  <Badge>Beginner</Badge>
                </div>
                <CardDescription>1-2 dagen · 3 duiken · Max diepte 12m</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿5,000</p>
                <p className="text-sm text-muted-foreground mb-4">Alle uitrusting inbegrepen.</p>
                <ul className="text-sm mb-4 space-y-1">
                  <li><strong>Voorwaarde:</strong> Minimale leeftijd 10 jaar</li>
                  <li><strong>Brevet nodig:</strong> Nee</li>
                </ul>
                <Button onClick={() => navigate(bookingUrl)}>Boek DSD Deluxe</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DiscoverScubaDeluxeNl;
