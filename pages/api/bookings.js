import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Simple API route for booking form submissions
// Replace with your actual DB logic (e.g., Supabase, MongoDB, etc.)

export default async function handler(req, res) {
  // Open (or create) the bookings.db database
  const db = await open({
    filename: './bookings.db',
    driver: sqlite3.Database
  });

  // Create table if it doesn't exist
  await db.exec(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    course TEXT,
    date TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  if (req.method === 'POST') {
    const { name, email, course, date, notes } = req.body;
    await db.run(
      'INSERT INTO bookings (name, email, course, date, notes) VALUES (?, ?, ?, ?, ?)',
      [name, email, course, date, notes]
    );
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    const bookings = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
    res.status(200).json({ bookings });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }

  await db.close();
}
