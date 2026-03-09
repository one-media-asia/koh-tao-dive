import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const DiscoverScubaEn: React.FC = () => {
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
            Explore the thrill of breathing underwater with no certification required. This beginner
            program is the perfect first dive experience on Koh Tao.
          </p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Book Discover Scuba</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Program Overview</h2>
            <p className="mb-6">
              Discover Scuba Diving is designed for non-certified divers who want to safely experience
              real scuba diving with a professional instructor. You start with a simple briefing and
              essential skills in confined water, then continue to shallow open water for your first dive.
            </p>

            <h3 className="text-xl font-semibold mb-3">How It Works</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 1: Briefing & Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  Learn equipment basics, safety rules, equalization and key underwater signals with your instructor.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Step 2: First Open Water Dive</CardTitle>
                </CardHeader>
                <CardContent>
                  Enjoy your first dive in calm conditions at up to 12m with close one-to-one style supervision.
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-3">What Is Included</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Certified scuba dive professional</li>
              <li>Use of all scuba equipment</li>
              <li>Maximum 4 guests per instructor group</li>
              <li>Option to add extra dives</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What is Discover Scuba Diving (DSD)?</CardTitle>
                </CardHeader>
                <CardContent>
                  DSD is a beginner experience that allows non-certified divers to try scuba diving in a controlled
                  and supervised environment before committing to a full course.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Do I need a certification to join DSD?</CardTitle>
                </CardHeader>
                <CardContent>
                  No. DSD is specifically designed for first-time divers and beginners.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>What can I expect on the day?</CardTitle>
                </CardHeader>
                <CardContent>
                  You will receive a short orientation, safety briefing and basic skills coaching before going for
                  your first open water dive with your instructor.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>What is the DSD Deluxe option?</CardTitle>
                </CardHeader>
                <CardContent>
                  Deluxe is an extended experience with extra dives and more underwater time, ideal if you want
                  a deeper introduction before starting Open Water.
                </CardContent>
              </Card>
            </div>
          </div>

          <aside>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Program Details</CardTitle>
                  <Badge>Beginner</Badge>
                </div>
                <CardDescription>1 day · 1-2 dives · Max depth 12m</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿2,500</p>
                <p className="text-sm text-muted-foreground mb-4">For 1 dive. Additional dives from ฿1,000 each.</p>
                <ul className="text-sm mb-4 space-y-1">
                  <li><strong>Prerequisite:</strong> Minimum age 10</li>
                  <li><strong>Certification required:</strong> No</li>
                </ul>
                <Button onClick={() => navigate(bookingUrl)}>Book DSD</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DiscoverScubaEn;
