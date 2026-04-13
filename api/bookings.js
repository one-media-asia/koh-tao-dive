const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bookings.db');

module.exports = (req, res) => {
  if (req.method === 'GET') {
    db.all('SELECT * FROM bookings', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ bookings: rows });
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}