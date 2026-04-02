// Sample Express endpoint to create a Jira issue from booking form data
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Set these with your Jira details or use environment variables
const JIRA_DOMAIN = process.env.JIRA_DOMAIN || 'https://divinginasia.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || 'your-jira-email@example.com';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || 'your-jira-api-token';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'PRO';

router.post('/create-jira-booking', async (req, res) => {
  const { name, email, bookingDetails } = req.body;
  if (!name || !email || !bookingDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const issueData = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: `Booking from ${name} (${email})`,
      description: `Booking Details:\n${bookingDetails}\n\nCustomer Email: ${email}`,
      issuetype: { name: 'Task' },
    },
  };

  try {
    const response = await fetch(`${JIRA_DOMAIN}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization':
          'Basic ' + Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64'),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }
    const data = await response.json();
    res.status(200).json({ success: true, issue: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
