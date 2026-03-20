// API route: POST /api/export-bookings-to-jira
// Triggers export of all bookings to Jira as a single issue

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const BOOKING_TABLE = 'booking_inquiries';

const JIRA_URL = 'https://divinginasia.atlassian.net';
const JIRA_PROJECT_KEY = 'pro';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || 'your-email@domain.com';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createJiraIssue(bookings) {
  const summary = `[Bookings Export] ${bookings.length} bookings exported`;
  const description = bookings.map((b, i) =>
    `Booking #${i+1}\nName: ${b.name}\nEmail: ${b.email}\nPhone: ${b.phone}\nCourse: ${b.course_title}\nPreferred Date: ${b.preferred_date}\nTotal: ${b.total_amount}\nDeposit: ${b.deposit_amount}\nTo Be Paid: ${b.due_amount}\nStatus: ${b.status}\nID: ${b.id}\n---`
  ).join('\n\n');
  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype: { name: 'Task' },
      labels: ['booking', 'export'],
    },
  };
  const res = await fetch(`${JIRA_URL}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Jira issue creation failed: ${res.status} ${err}`);
  }
  return res.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return res.status(500).json({ message: 'Supabase not configured' });
  }
  try {
    const { data, error } = await supabase.from(BOOKING_TABLE).select('*');
    if (error) throw new Error(error.message);
    if (!data || !data.length) throw new Error('No bookings found');
    await createJiraIssue(data);
    res.status(200).json({ message: 'Exported bookings to Jira.' });
  } catch (e) {
    res.status(500).json({ message: 'Export failed: ' + (e.message || e) });
  }
}
