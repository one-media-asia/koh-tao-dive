import React from 'react';
import CoursePageTemplate from '@/components/CoursePageTemplate';
import BookingForm from '@/components/BookingForm';
import { useState } from 'react';


const OpenWaterEn: React.FC = () => {
  // Use the same content as before
  const fallbackContent = {
    hero_title: 'PADI Open Water Course',
    hero_subtitle: "The world's most popular scuba course. Learn the fundamentals of scuba diving and get certified to dive independently with a buddy, to 18 metres/60 feet.",
    course_overview: "The Open Water course combines knowledge development, confined water dives (pool) and open water dives. You'll learn equipment setup, basic underwater skills, buoyancy control and dive planning. Our instructors keep groups small and emphasize safety and fun.",
    price_thb: '11000',
    price_usd: '320',
    price_eur: '290',
    duration: '3-4 days',
  };


  // Booking form state
  const [open, setOpen] = useState(false);
  const courseName = 'PADI Open Water';
  const deposit = 2000;
  const price = 11000;

  return (
    <>
      <CoursePageTemplate
        pageSlug="open-water"
        locale="en"
        fallbackContent={fallbackContent}
        heroImage="/images/openwater.png"
        images={['/images/downline.png', '/images/openwater.png', '/images/photo-1682686580849-3e7f67df4015.avif', '/images/photo-1647825194145-2d94e259c745.avif']}
        level="Beginner"
        bookingItemName="PADI Open Water Course"
        sections={[
          {
            title: "What you'll learn",
            content: [
              'Equipment assembly and use',
              'Buoyancy control and breathing techniques',
              'Underwater navigation basics',
              'Emergency procedures and surface recognition',
              'Dive planning and buddy communication',
              'Environmental awareness and marine life interaction',
            ],
          },
          {
            title: 'Course Structure',
            content: [
              'Duration: 3-4 days (flexible scheduling)',
              'Theory sessions (online or classroom)',
              'Confined water training (pool)',
              '4 open water dives',
              'Minimum age: 10 years (Junior Open Water for 10-14)',
            ],
          },
          {
            title: 'Inclusions',
            content: [
              'PADI course materials and certification',
              'All scuba equipment rental',
              'Pool and open water training',
              'Boat fees where applicable',
              'Tea, coffee and bottled water',
              'Professional instruction',
            ],
          },
        ]}
        faqs={[
          {
            question: 'Do I need prior experience?',
            answer: 'No experience necessary! The Open Water course is designed for complete beginners. You just need to be comfortable in water.',
          },
          {
            question: 'Can I complete the theory online before arrival?',
            answer: 'Yes! PADI eLearning allows you to complete the knowledge development portion online at your own pace before arriving.',
          },
          {
            question: 'What if I need more time?',
            answer: "No problem. We adapt to your learning pace. If you need extra pool time or want to repeat a skill, we're flexible.",
          },
          {
            question: 'Is the certification recognized worldwide?',
            answer: 'Yes, PADI is the world\'s leading scuba training organization with recognition at dive centers and resorts globally.',
          },
        ]}
        heroButtonLabel="Book Now"
        heroButtonUrl="#open-water-booking-form"
      />
      <div id="open-water-booking-form" style={{ maxWidth: 600, margin: '2rem auto', padding: 16 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>Book PADI Open Water Course</h2>
        <div style={{ marginBottom: 16, fontSize: '1.1rem', background: '#f8fafc', borderRadius: 8, padding: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Total Price:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>฿{price}</span>
          </div>
          <div>
            <strong>Deposit Required:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>฿{deposit}</span>
          </div>
        </div>
        <button
          style={{
            background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginBottom: 16
          }}
          onClick={() => window.location.href = '/booking?course=open-water&type=course'}
        >
          Book Now
        </button>
      </div>
    </>
  );
};

export default OpenWaterEn;
