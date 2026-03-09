import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const DiscoverScubaDeluxeEn: React.FC = () => {
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
            A longer, more relaxed beginner scuba experience with extra underwater time and 3 guided dives.
          </p>
          <div className="mt-6">
            <Button size="lg" onClick={() => navigate(bookingUrl)}>Book DSD Deluxe</Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Program Overview</h2>
            <p className="mb-6">
              Discover Scuba Diving Deluxe is ideal if you want more than a short try dive. You begin with
              foundational skills in a controlled environment and then continue to multiple open water dives
              around Koh Tao with your instructor.
            </p>

            <h3 className="text-xl font-semibold mb-3">How It Works</h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Day 1: Pool & Shore</CardTitle>
                </CardHeader>
                <CardContent>
                  Learn key scuba skills in pool/confined water and complete your first easy open water entry.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Day 2: Boat Dives</CardTitle>
                </CardHeader>
                <CardContent>
                  Complete 2 guided boat dives at Koh Tao dive sites for a fuller underwater adventure.
                </CardContent>
              </Card>
            </div>

            <h3 className="text-xl font-semibold mb-3">What Is Included</h3>
            <ul className="list-disc pl-5 mb-6">
              <li>Certified scuba dive professional</li>
              <li>Use of all scuba equipment</li>
              <li>Maximum 4 guests per instructor group</li>
              <li>3 total dives (shore + boat dives)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What is the Discover Scuba Diving Deluxe program?</CardTitle>
                </CardHeader>
                <CardContent>
                  Deluxe is an extended beginner program that includes pool/confined skills plus 3 open water dives,
                  giving you a more complete first scuba experience.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Do I need to be certified?</CardTitle>
                </CardHeader>
                <CardContent>
                  No. It is designed for non-certified beginners.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Can I continue to Open Water after this?</CardTitle>
                </CardHeader>
                <CardContent>
                  Yes. DSD Deluxe is an excellent way to decide if you want to continue with full Open Water certification.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Is this suitable for limited time stays?</CardTitle>
                </CardHeader>
                <CardContent>
                  Yes. You can complete it in 1-2 days while still getting multiple dives and a more relaxed pace.
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
                <CardDescription>1-2 days · 3 dives · Max depth 12m</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-sky-600 mb-3">฿5,000</p>
                <p className="text-sm text-muted-foreground mb-4">All equipment included.</p>
                <ul className="text-sm mb-4 space-y-1">
                  <li><strong>Prerequisite:</strong> Minimum age 10</li>
                  <li><strong>Certification required:</strong> No</li>
                </ul>
                <Button onClick={() => navigate(bookingUrl)}>Book DSD Deluxe</Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default DiscoverScubaDeluxeEn;
