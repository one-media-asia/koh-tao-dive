


import BookingForm from '@/components/BookingForm';
import { useState, useEffect } from 'react';

// Map course names to deposit and price
const COURSE_DEPOSITS: Record<string, { deposit: number; price: number }> = {
  'PADI Open Water': { deposit: 2000, price: 11000 },
  'PADI Advanced Open Water': { deposit: 2500, price: 10500 },
  'EFR': { deposit: 500, price: 4500 },
  'Rescue Diver': { deposit: 3000, price: 12000 },
  'Divemaster': { deposit: 5000, price: 41000 },
  'Instructor': { deposit: 10000, price: 68900 },
  'Discover Scuba Diving (DSD)': { deposit: 1000, price: 2500 },
  'Discover Scuba Diving Deluxe': { deposit: 1500, price: 5000 },
  // Add more as needed
};

export default function CoursesBookingPage() {
  const [open, setOpen] = useState(true);
  const [course, setCourse] = useState('');
  const [deposit, setDeposit] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);

  useEffect(() => {
    let search = '';
    if (typeof window !== 'undefined') search = window.location.search;
    if (search) {
      const params = new URLSearchParams(search);
      const courseName = params.get('course') || '';
      setCourse(courseName);
      const info = COURSE_DEPOSITS[courseName];
      setDeposit(info?.deposit);
      setPrice(info?.price);
    }
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 16 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 24 }}>Book a Course or Fun Dive</h1>
      {price && deposit && (
        <div style={{ marginBottom: 16, fontSize: '1.1rem', background: '#f8fafc', borderRadius: 8, padding: 16, border: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Total Price:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>฿{price}</span>
          </div>
          <div>
            <strong>Deposit Required:</strong> <span style={{ color: '#059669', fontWeight: 600 }}>฿{deposit}</span>
          </div>
        </div>
      )}
      <BookingForm
        isOpen={open}
        onClose={() => setOpen(false)}
        itemType="course"
        itemTitle={course}
        depositMajor={deposit}
        depositCurrency="THB"
      />
    </div>
  );
}
