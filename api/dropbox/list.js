const DROPBOX_API_URL = 'https://api.dropboxapi.com/2/files/list_folder';
const DEFAULT_FOLDER_PATH = '/Diveasianew';

const readDropboxPayload = async (response) => {
  const text = await response.text();
  if (!text) return { json: null, text: '' };

  try {
    return { json: JSON.parse(text), text };
  } catch {
    return { json: null, text };
  }
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.DROPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ error: 'Dropbox is not configured' });
  }

  const folderPath = typeof req.query.folder === 'string' && req.query.folder.trim()
    ? req.query.folder.trim()
    : DEFAULT_FOLDER_PATH;
  const normalizedPath = folderPath.startsWith('/') ? folderPath : `/${folderPath}`;

  try {
    const dropboxResponse = await fetch(DROPBOX_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: normalizedPath }),
    });

    const { json: payload, text } = await readDropboxPayload(dropboxResponse);
    if (!dropboxResponse.ok) {
      return res.status(dropboxResponse.status).json({
        error: payload?.error_summary || text || 'Failed to list Dropbox folder',
      });
    }

    return res.status(200).json(payload?.entries || []);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
