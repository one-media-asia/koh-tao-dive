// Script: createJiraIssueFromUrl.js
// Description: Fetches content from a URL and creates a Jira issue with that content as the description.
// Usage: node createJiraIssueFromUrl.js

const fetch = require('node-fetch');

const JIRA_BASE_URL = 'https://divinginasia.atlassian.net';
const JIRA_PROJECT_KEY = 'pro';
const JIRA_USER_EMAIL = 'petergreaney@gmail.com';
const JIRA_API_TOKEN = 'ATATT3xFfGF0iGRCC82fIlRox-1uHPqqujIap_KroHw-CpPROOKL3k5zdzA-WpFRqsZfcBsyzgR3yoGqcjb6_Dv6JbljThIs1bOVdbzFxt-Bf67j0KjbNuYeJWAx8RE1HJYO6OVsiNqdrA0p2mDn1wWsIlMAwNcKKLhHKvDxc1txlMFm8xXONOc=F0EBBE0D';
const TARGET_URL = 'https://www.divinginasia.com/courses/open-water';

async function fetchPageContent(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  const html = await res.text();
  // Simple extraction: get <body> content only
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

async function createJiraIssue(htmlContent) {
  const summary = 'Imported: Open Water Course Page';
  // Use raw HTML as the description (Jira will store it as-is, but may not render all tags)
  const description = `Imported content from https://www.divinginasia.com/courses/open-water:\n\n<pre>${htmlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;

  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary,
      description,
      issuetype: { name: 'Task' },
      labels: ['imported', 'webpage', 'html'],
    },
  };

  const res = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
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

(async () => {
  try {
    const htmlContent = await fetchPageContent(TARGET_URL);
    const result = await createJiraIssue(htmlContent);
    console.log('Jira issue created:', result.key);
  } catch (e) {
    console.error('Error:', e.message || e);
  }
})();
