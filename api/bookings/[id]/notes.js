// API route: /api/bookings/[id]/notes.js
// Handles GET and POST for notes on a booking
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  const db = await open({ filename: 'bookings.sqlite', driver: sqlite3.Database });
  const { id } = req.query;

  if (req.method === 'GET') {
    // Get all notes for this booking
    const notes = await db.all('SELECT * FROM book_notes WHERE booking_id = ? ORDER BY created_at DESC', [id]);
    res.status(200).json({ notes });
    return;
  }

  if (req.method === 'POST') {
    const { note_type, content } = req.body;
    if (!note_type || !content) {
      res.status(400).json({ error: 'Missing note_type or content' });
      return;
    }
    await db.run(
      'INSERT INTO book_notes (booking_id, note_type, content) VALUES (?, ?, ?)',
      [id, note_type, content]
    );
    res.status(201).json({ success: true });
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
