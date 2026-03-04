// Vercel Serverless Function: Contact Form Example

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Here you can add logic to send an email, save to a database, etc.
    // For now, just echo back the data
    res.status(200).json({ success: true, data: { name, email, message } });
  } catch (error) {
    console.error('Contact API error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
