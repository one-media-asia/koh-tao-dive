// /api/dropbox/list.js
// Lists files/folders in the 'divingasia' Dropbox folder

const { Dropbox } = require('dropbox');

// Store your Dropbox access token securely (use env variable in production)
const DROPBOX_ACCESS_TOKEN = process.env.DROPBOX_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE';

const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN });

// Express handler example
module.exports = async function listDropboxFolder(req, res) {
  try {
    const response = await dbx.filesListFolder({ path: '/divingasia' });
    res.json(response.result.entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
