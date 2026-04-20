import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  const db = await open({ filename: './admin.db', driver: sqlite3.Database });
  await db.exec(`CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  if (req.method === 'POST') {
    const { username, password } = req.body;
    const user = await db.get('SELECT * FROM admin_users WHERE username = ? AND password = ?', [username, password]);
    if (user) {
      // Simple session token (not secure, demo only)
      res.status(200).json({ success: true, token: 'admin-session-token' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
  await db.close();
}
