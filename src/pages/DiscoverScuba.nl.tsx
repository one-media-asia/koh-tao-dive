import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const DiscoverScubaNl: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=Discover%20Scuba%20Diving&type=dive&price=2500&currency=THB';

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-72 md:h-96 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/discover-scuba-dsd.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">Discover Scuba Diving (DSD)</h1>
          <p className="mt-4 max-w-2xl">
            Ervaar hoe het is om onder water te ademen, zonder brevet nodig. Dit beginnersprogramma
            is de perfecte eerste duikervaring op Koh Tao.
          </p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek Discover Scuba</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Programmaoverzicht</h2>
            <p className="mb-6">
              Discover Scuba Diving is gemaakt voor niet-gecertificeerde duikers die veilig willen
              kennismaken met echt duiken onder begeleiding van een professionele instructeur. Je start
              met een korte briefing en basisvaardigheden in beschut water, daarna ga je naar ondiep open water.
            </p>

            <h3 className="text-xl font-semibold mb-3">Hoe werkt het?</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stap 1: Briefing & Basisvaardigheden</CardTitle>
                </CardHeader>
                <CardContent>
                  Je leert de basis van uitrusting, veiligheidsregels, klaren van druk en onderwatersignalen.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stap 2: Eerste buitenwaterduik</CardTitle>
                </CardHeader>
                <CardContent>
                  Je maakt je eerste duik in rustige omstandigheden tot maximaal 12 meter, onder directe begeleiding.
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-3">Wat is inbegrepen?</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Gecertificeerde duikprofessional</li>
              <li>Gebruik van alle duikuitrusting</li>
              <li>Maximaal 4 deelnemers per instructeursgroep</li>
              <li>Mogelijkheid om extra duiken toe te voegen</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Veelgestelde vragen</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wat is Discover Scuba Diving (DSD)?</CardTitle>
                </CardHeader>
                <CardContent>
                  DSD is een beginnerservaring waarmee niet-gecertificeerde duikers in een gecontroleerde,
                  veilige omgeving kunnen kennismaken met duiken voordat ze een volledige cursus volgen.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Heb ik een brevet nodig om mee te doen?</CardTitle>
                </CardHeader>
                <CardContent>
                  Nee. DSD is juist bedoeld voor beginners en mensen die nog nooit hebben gedoken.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Wat kan ik op de dag zelf verwachten?</CardTitle>
                </CardHeader>
                <CardContent>
                  Je krijgt een korte uitleg, veiligheidsbriefing en oefent basisvaardigheden voordat je je
                  eerste buitenwaterduik maakt met je instructeur.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Wat is de DSD Deluxe-optie?</CardTitle>
                </CardHeader>
                <CardContent>
                  Deluxe is een uitgebreidere ervaring met extra duiken en meer tijd onder water, ideaal als je
                  daarna mogelijk verder wilt met Open Water.
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
                <CardDescription>1 dag · 1-2 duiken · Max diepte 12m</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿2,500</p>
                <p className="text-sm text-muted-foreground mb-4">Voor 1 duik. Extra duiken vanaf ฿1,000 per duik.</p>
                <ul className="text-sm mb-4 space-y-1">
                  <li><strong>Voorwaarde:</strong> Minimale leeftijd 10 jaar</li>
                  <li><strong>Brevet nodig:</strong> Nee</li>
                </ul>
                <Button onClick={() => navigate(bookingUrl)}>Boek DSD</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DiscoverScubaNl;
