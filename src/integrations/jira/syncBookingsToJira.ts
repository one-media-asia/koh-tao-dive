// Jira sync utility: creates issues for bookings in CSV
// Usage: import and call syncBookingsToJira()

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const JIRA_URL = 'https://divinginasia.atlassian.net';
const JIRA_PROJECT_KEY = 'pro';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || 'your-email@domain.com'; // Set your Jira user email here

// ES module compatible __dirname
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BOOKINGS_CSV = path.join(__dirname, '../../../bookings_export.csv');

function parseCSV(csv) {
  const [header, ...lines] = csv.trim().split('\n');
  const keys = header.split(',');
  return lines.map(line => {
    // Handle quoted fields and commas
    const values = line.match(/("[^"]*"|[^,]+)/g).map(v => v.replace(/^"|"$/g, ''));
    const obj = {};
    keys.forEach((k, i) => { obj[k] = values[i] || ''; });
    return obj;
  });
}

async function createJiraIssue(booking) {
  const summary = `[Booking] ${booking.course_title} for ${booking.name}`;
  const description = `Booking Details:\n\nName: ${booking.name}\nEmail: ${booking.email}\nPhone: ${booking.phone}\nCourse: ${booking.course_title}\nPreferred Date: ${booking.preferred_date}\nExperience Level: ${booking.experience_level}\nMessage: ${booking.message}\nStatus: ${booking.status}\nCreated At: ${booking.created_at}`;
  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype: { name: 'Task' },
      labels: ['booking'],
      duedate: booking.preferred_date || undefined,
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

export async function syncBookingsToJira() {
  const csv = fs.readFileSync(BOOKINGS_CSV, 'utf8');
  const bookings = parseCSV(csv);
  for (const booking of bookings) {
    if (['confirmed', 'pending'].includes(booking.status)) {
      try {
        await createJiraIssue(booking);
        console.log(`Synced booking for ${booking.name} (${booking.preferred_date})`);
      } catch (err) {
        console.error(`Failed to sync booking for ${booking.name}:`, err.message);
      }
    }
  }
}
