// /api/dropbox/file.js
// Serves file content from Dropbox for a given path

const { Dropbox } = require('dropbox');

const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';
const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

// Express handler: /api/dropbox/file?path=...
module.exports = async function serveDropboxFile(req, res) {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path parameter' });
  try {
    const file = await dbx.filesDownload({ path });
    res.setHeader('Content-Type', file.result.content_type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.result.name}"`);
    res.send(file.result.fileBinary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
