import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const ScubaDiver: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=PADI%20Scuba%20Diver%20Course&type=course&price=8500&currency=THB';

  return (
    <div className="min-h-screen bg-background">
      <section className="instructor-hero-bg relative h-72 md:h-96 flex items-center overflow-hidden">
        <div className="container mx-auto px-4 text-white z-10">
          <h1 className="text-4xl md:text-5xl font-bold">PADI Scuba Diver-cursus</h1>
          <p className="mt-4 max-w-2xl">Ontdek de onderwaterwereld met vertrouwen. De PADI Scuba Diver-cursus is perfect voor wie duiken wil proberen voordat je voor volledige certificering gaat.</p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Boek Scuba Diver</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cursusoverzicht</h2>
            <p className="mb-6">De PADI Scuba Diver-cursus laat je op een leuke en ontspannen manier kennismaken met de onderwaterwereld. Je leert basisvaardigheden voor duiken en verkent ondiepe riffen, zodat je met vertrouwen verder kunt in je duikavontuur. Deze cursus is een introductie tot duiken en kan worden opgewaardeerd naar volledige Open Water-certificering.</p>

            <h3 className="text-xl font-semibold mb-3">Wat je leert</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Basis duiktheorie en -fysica</li>
              <li>Correct gebruik van duikuitrusting</li>
              <li>Fundamentele duikvaardigheden en veiligheidsprocedures</li>
              <li>Onderwatercommunicatie en buddy-systeem</li>
              <li>Verkenning van ondiep water en rifbewustzijn</li>
              <li>Milieubewustzijn en mariene natuurbescherming</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Cursusopbouw</h3>
            <p className="mb-6">De cursus bestaat uit theorielessen, training in beschut water en buitenwaterduiken. Je maakt 2 buitenwaterduiken in water tot maximaal 12 meter (40 voet), waardoor de cursus voor de meeste mensen toegankelijk is.</p>

            <h3 className="text-xl font-semibold mb-3">Waarom kiezen voor Scuba Diver?</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Kortere cursus dan de volledige Open Water-cursus</li>
              <li>Perfecte introductie tot duiken</li>
              <li>Op te waarderen naar Open Water-certificering</li>
              <li>Leuke en ontspannen leeromgeving</li>
              <li>Verken de prachtige riffen van Koh Tao</li>
            </ul>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cursusdetails</CardTitle>
                  <Badge>Instapniveau</Badge>
                </div>
                <CardDescription>2-3 dagen · Theorie & praktijk</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿8,500</p>
                <p className="text-sm text-muted-foreground mb-4">Inclusief alle training, uitrusting en 2 buitenwaterduiken</p>
                <Button onClick={() => navigate(bookingUrl)}>Boek Scuba Diver</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ScubaDiver;