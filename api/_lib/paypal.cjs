// Minimal PayPal integration for Node.js Express
// Uses @paypal/checkout-server-sdk

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET';
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

async function createOrder(req, res) {
  const { course_title, price = 50.00, currency = 'USD' } = req.body;
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: price.toFixed(2),
        },
        description: course_title || 'Course Booking',
      },
    ],
    application_context: {
      return_url: 'https://www.divinginasia.com/thank-you.html',
      cancel_url: 'https://www.divinginasia.com/booking-form.html',
    },
  });
  try {
    const order = await client().execute(request);
    res.json({ id: order.result.id, links: order.result.links });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createOrder };
