// pages/api/pages.js
// SQLite-backed API for admin pages manager (CRUD for page_content)

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(process.cwd(), 'admin.db');

function getDb() {
  return new sqlite3.Database(dbPath);
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    // List all page_content rows
    const db = getDb();
    db.all('SELECT * FROM page_content', [], (err, rows) => {
      db.close();
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else if (req.method === 'POST') {
    const db = getDb();
    const { upsert, insert } = req.body || {};
    if (Array.isArray(upsert)) {
      // Upsert (insert or update) multiple rows
      const results = [];
      db.serialize(() => {
        const stmt = db.prepare(`INSERT INTO page_content (page_slug, section_key, locale, content_type, content_value) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(page_slug, section_key, locale) DO UPDATE SET content_type=excluded.content_type, content_value=excluded.content_value`);
        upsert.forEach(row => {
          stmt.run(row.page_slug, row.section_key, row.locale, row.content_type, row.content_value);
          results.push(row);
        });
        stmt.finalize(() => {
          db.close();
          res.json(results);
        });
      });
    } else if (Array.isArray(insert)) {
      // Insert new row(s)
      const results = [];
      db.serialize(() => {
        const stmt = db.prepare('INSERT INTO page_content (page_slug, section_key, locale, content_type, content_value) VALUES (?, ?, ?, ?, ?)');
        insert.forEach(row => {
          stmt.run(row.page_slug, row.section_key, row.locale, row.content_type, row.content_value);
          results.push(row);
        });
        stmt.finalize(() => {
          db.close();
          res.json(results.length === 1 ? results[0] : results);
        });
      });
    } else {
      db.close();
      res.status(400).json({ error: 'Invalid request body' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
