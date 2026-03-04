// Vercel Serverless Function: Contact Form Example

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not
         allowed' });
      return;
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Match the booking form payload structure for Web3Forms
    const payload = {
      access_key: '4ca93aa5-cd42-4902-af87-a08e1ae7c832',
      to: 'contact@prodiving.asia',
      subject: subject || 'Contact Form Submission',
      name,
      email,
      message,
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let data = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { error: await response.text() };
    }

    if (response.ok && data.success) {
      res.status(200).json({ success: true });
    } else {
      const errMsg = data?.error || `HTTP ${response.status}`;
      console.error('Web3Forms error:', errMsg, data);
      res.status(500).json({ success: false, error: errMsg });
    }
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
