import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MSDTProgram: React.FC = () => {
  const navigate = useNavigate();
  const bookingUrl = '/booking?item=PADI%20Master%20Scuba%20Diver%20Trainer%20(MSDT)%20Program&type=course&currency=THB';
  return (
    <div className="min-h-screen bg-background">
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">PADI Master Scuba Diver Trainer (MSDT) Program</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The PADI MSDT Program is designed for instructors who want to take their teaching career to the next level. This program provides you with the skills, experience, and certifications to teach a wide range of PADI specialty courses, making you more employable and confident as a dive professional.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Why Become an MSDT?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Teach at least five PADI Specialty courses</li>
                <li>Gain hands-on experience through team teaching and mentorship</li>
                <li>Increase your employability and earning potential</li>
                <li>Stand out to dive centers and resorts worldwide</li>
                <li>Enhance your confidence and teaching skills</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Program Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Choose five PADI Specialty Instructor ratings (e.g., Deep, Wreck, Nitrox, Night, Sidemount, etc.)</li>
                <li>Participate in hands-on workshops and real-world teaching scenarios</li>
                <li>Team teach with experienced Course Directors and Staff Instructors</li>
                <li>Receive guidance on course standards, logistics, and student management</li>
                <li>Log at least 25 certifications to qualify for the MSDT rating</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>PADI Open Water Scuba Instructor (OWSI) certification</li>
                <li>Current EFR Instructor</li>
                <li>Minimum 25 PADI student certifications (to apply for MSDT rating)</li>
                <li>Minimum age: 18 years</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">What’s Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li>Five PADI Specialty Instructor courses</li>
                <li>Team teaching and mentorship</li>
                <li>All required training materials</li>
                <li>Guidance on application process</li>
                <li>Access to experienced Course Directors</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">How to Enroll</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Ready to become a PADI Master Scuba Diver Trainer? Contact us for course dates, pricing, and to discuss your specialty choices.</p>
              <Button onClick={() => navigate(bookingUrl)}>Enquire / Book Now</Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MSDTProgram;
