import fetch from 'node-fetch';

const JIRA_DOMAIN = process.env.JIRA_DOMAIN || 'https://divinginasia.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || process.env.JIRA_USER_EMAIL || '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'PRO';

const buildIssuePayload = ({ name, email, bookingDetails }) => ({
  fields: {
    project: { key: JIRA_PROJECT_KEY },
    summary: `Booking from ${name} (${email})`,
    description: `Booking Details:\n${bookingDetails}\n\nCustomer Email: ${email}`,
    issuetype: { name: 'Task' },
    labels: ['booking', 'manual-escalation'],
  },
});

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, bookingDetails } = req.body || {};

  if (!name || !email || !bookingDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
    return res.status(500).json({ error: 'Jira is not configured' });
  }

  try {
    const jiraResponse = await fetch(`${JIRA_DOMAIN}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildIssuePayload({ name, email, bookingDetails })),
    });

    if (!jiraResponse.ok) {
      const errorText = await jiraResponse.text();
      return res.status(500).json({ error: errorText || 'Failed to create Jira issue' });
    }

    const data = await jiraResponse.json();
    return res.status(200).json({ success: true, issue: data });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal error' });
  }
}
