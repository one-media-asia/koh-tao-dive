import fetch from 'node-fetch';

async function testBookingNotification() {
  const response = await fetch('https://wulgixdyofyfdwcymwec.functions.supabase.co/send-booking-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Peter Greaney',
      email: 'petergreaney@gmail.com',
      phone: '123456789',
      preferred_date: '2026-04-05',
      experience_level: 'Beginner',
      message: 'Looking forward to the course!',
      item_title: 'PADI Open Water Course',
      deposit_amount: 2000,
      payment_choice: 'now',
      paypal_link: 'https://paypal.me/prodivingasia/2000THB'
    }),
  });

  const result = await response.json();
  console.log(result);
}

testBookingNotification();