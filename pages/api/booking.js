// pages/api/booking.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get data from request body
  const {
    name,
    email,
    course_name,
    fun_dive_count,
    accommodation_nights,
    accommodation,
    full_price,
    deposit_amount,
    message,
  } = req.body;

  // Connect to MySQL
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  // Create table if not exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255),
      course_name VARCHAR(100),
      fun_dive_count INT,
      accommodation_nights INT,
      accommodation VARCHAR(10),
      full_price INT,
      deposit_amount INT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert booking
  await connection.execute(
    `INSERT INTO bookings (name, email, course_name, fun_dive_count, accommodation_nights, accommodation, full_price, deposit_amount, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      course_name,
      fun_dive_count,
      accommodation_nights,
      accommodation,
      full_price,
      deposit_amount,
      message,
    ]
  );

  await connection.end();
  res.status(200).json({ success: true });
}
