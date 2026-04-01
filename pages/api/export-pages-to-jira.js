// API route: POST /api/export-pages-to-jira
// Exports all pages (title, content) from Supabase as Jira issues

import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const PAGE_CONTENT_TABLE = 'page_content';

const JIRA_URL = 'https://divinginasia.atlassian.net';
const JIRA_PROJECT_KEY = 'pro';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL || 'your-email@domain.com';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { realtime: { enabled: false } });

async function createJiraIssue(page) {
  const summary = page.title || '[Page]';
  // Only use the main content for the Jira description
  // Remove author, reading time, and reaction if present
  let content = page.content || '';
  // Optionally, strip out author/reading time lines if they exist at the top
  content = content.replace(/^By .+\n/, '');
  content = content.replace(/^\d+ min\n/, '');
  content = content.replace(/^Add a reaction\s*\n/, '');
  // Remove trailing "View Pricing & Schedule" and similar calls to action if needed
  content = content.replace(/View Pricing & Schedule[\s\S]*$/i, '').trim();
  const description = content;
  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype: { name: 'Task' },
      labels: ['page', 'export'],
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
    const { data, error } = await supabase.from(PAGE_CONTENT_TABLE).select('*');
    if (error) throw new Error(error.message);
    if (!data || !data.length) throw new Error('No pages found');
    let success = 0, failed = 0;
    for (const page of data) {
      try {
        await createJiraIssue(page);
        success++;
      } catch (e) {
        failed++;
      }
    }
    res.status(200).json({ message: `Exported ${success} pages to Jira. ${failed ? failed + ' failed.' : ''}` });
  } catch (e) {
    res.status(500).json({ message: 'Export failed: ' + (e.message || e) });
  }
}
